"""Graba la voz y genera los subtitulos palabra a palabra de un explainer reel.

Uso, desde la carpeta del proyecto:
  python3 voz.py grabar               # genera la voz y los subtitulos (gasta creditos si es ElevenLabs)
  python3 voz.py subtitulos [hasta]   # solo subtitulos, desde la toma ya grabada (sin API)

Lee voz.json en el proyecto:
{
  "provider": "elevenlabs" | "kokoro",
  "elevenlabs": {"voice_id": "...", "model": "eleven_v4", "tag": "[Chilean accent] ",
                 "settings": {"stability": 0.5, "similarity_boost": 0.75}},
  "kokoro": {"voice": "ef_dora", "speed": 1.0, "pause": 0.35},
  "lines": [{"text": "Frase hablada.", "groups": ["palabra-final-de-cada-grupo"]}],
  "digits": [["veinte mil", "20.000"]],
  "hold_end": 1.6,
  "template": "templates/subtitulos.template.html"
}
Escribe assets/voice/voz.mp3, assets/voice/voz.json y compositions/subtitulos.html.
"""
import array
import base64
import glob
import html
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

ROOT = pathlib.Path.cwd()
CFG = json.loads((ROOT / "voz.json").read_text(encoding="utf8"))
VOICE_DIR = ROOT / "assets/voice"
LOUDNESS = -16.0
SR = 44100


def cli():
    found = sorted(glob.glob(os.path.expanduser("~/.claude/plugins/cache/hyperframes/hyperframes/*/skills/hyperframes/scripts/plugin-cli.mjs")))
    return ["node", found[-1]] if found else ["npx", "hyperframes"]


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]))


def samples(path):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])
    return array.array("h", raw)


def words_from_alignment(al, skip):
    words, cur, start, end = [], "", 0, 0
    for c, b, f in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c.isspace():
            if cur:
                words.append({"text": cur, "start": round(start, 3), "end": round(end, 3)})
            cur = ""
        else:
            start = b if not cur else start
            cur, end = cur + c, f
    if cur:
        words.append({"text": cur, "start": round(start, 3), "end": round(end, 3)})
    return [w for w in words if w["text"] not in skip]


def elevenlabs(raw_path):
    e = CFG["elevenlabs"]
    tag = e.get("tag", "")
    text = tag + " ".join(line["text"] for line in CFG["lines"])
    body = {"text": text, "model_id": e.get("model", "eleven_v4"), "voice_settings": e.get("settings", {}), "seed": 2026}
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{e['voice_id']}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
    )
    try:
        data = json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as err:
        raise SystemExit(f"ElevenLabs {err.code}: {err.read()[:300].decode()}")
    raw_path.write_bytes(base64.b64decode(data["audio_base64"]))
    return words_from_alignment(data["alignment"], tag.split())


def kokoro(raw_path, tmp):
    """Una toma por frase con Kokoro; los tiempos por palabra se reparten por largo de la palabra."""
    k = CFG.get("kokoro", {})
    pause = k.get("pause", 0.35)
    words, parts, t = [], [], 0.0
    for i, line in enumerate(CFG["lines"]):
        wav = pathlib.Path(tmp) / f"{i}.wav"
        run = subprocess.run(cli() + ["tts", line["text"], "-v", k.get("voice", "ef_dora"), "-s", str(k.get("speed", 1.0)), "-l", "es", "-o", str(wav)], cwd=tmp, capture_output=True, text=True)
        if run.returncode or not wav.exists():
            if "kokoro-onnx" in run.stdout + run.stderr:
                raise SystemExit(
                    "Kokoro no esta instalado. Pide permiso al usuario y luego, por ejemplo:\n"
                    "  python3 -m venv ~/.venvs/kokoro && ~/.venvs/kokoro/bin/pip install kokoro-onnx soundfile\n"
                    "  export HYPERFRAMES_PYTHON=~/.venvs/kokoro/bin/python"
                )
            raise SystemExit(f"Kokoro fallo: {(run.stdout + run.stderr)[-400:]}")
        x = samples(wav)
        peak = max(abs(v) for v in x) or 1
        on = [i2 for i2, v in enumerate(x) if abs(v) > peak * 0.03]
        a, b = on[0] / SR, on[-1] / SR
        tokens = line["text"].split()
        total = sum(len(w) + 1 for w in tokens)
        pos = a
        for w in tokens:
            d = (b - a) * (len(w) + 1) / total
            words.append({"text": w, "start": round(t + pos, 3), "end": round(t + pos + d * 0.9, 3)})
            pos += d
        parts.append((wav, pause))
        t += duration(wav) + pause
    inputs = sum((["-i", str(p)] for p, _ in parts), [])
    chain = "".join(f"[{i}:a]aresample={SR},aformat=channel_layouts=mono,apad=pad_dur={p}[a{i}];" for i, (_, p) in enumerate(parts))
    chain += "".join(f"[a{i}]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1[o]"
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain, "-map", "[o]", str(raw_path)])
    return words


def to_captions(words):
    out, i = [], 0
    digits = CFG.get("digits", [])
    while i < len(words):
        for spoken, shown in digits:
            parts = spoken.split()
            if [w["text"] for w in words[i : i + len(parts)]] == parts:
                out.append({"text": shown, "start": words[i]["start"], "end": words[i + len(parts) - 1]["end"]})
                i += len(parts)
                break
        else:
            out.append(words[i])
            i += 1
    return out


def write_captions(cw, total):
    pending = [g for line in CFG["lines"] for g in line.get("groups", [])]
    groups, cur = [], []
    for k, w in enumerate(cw):
        cur.append(k)
        if pending and w["text"] == pending[0]:
            groups.append(cur)
            cur = []
            pending.pop(0)
    if cur:
        groups.append(cur)
    if pending:
        print("Aviso: grupos sin encontrar en el texto:", pending)
    rows = []
    for g, ks in enumerate(groups):
        start = 0 if g == 0 else round(cw[ks[0]]["start"] - 0.04, 3)
        end = total if g == len(groups) - 1 else round(cw[groups[g + 1][0]]["start"] - 0.04, 3)
        spans = " ".join(f'<span id="sub-w{k}" class="sub-word">{html.escape(cw[k]["text"])}</span>' for k in ks)
        rows.append(
            f'      <div id="sub-g{g}" class="clip sub-group" data-start="{start}" data-duration="{round(end - start, 3)}" data-track-index="{g}">\n'
            f"        <div>{spans}</div>\n      </div>"
        )
    timing = []
    for k, w in enumerate(cw):
        nxt = cw[k + 1]["start"] if k + 1 < len(cw) else w["end"] + 0.12
        start = 0 if k == 0 else w["start"]  # la primera palabra se ve desde el primer cuadro
        timing.append(f'["sub-w{k}",{start},{min(nxt, round(w["end"] + 0.12, 3))}]')
    template = (ROOT / CFG.get("template", "templates/subtitulos.template.html")).read_text(encoding="utf8")
    out = template.replace("{{ROWS}}", "\n".join(rows)).replace("{{WORDS}}", "[" + ",".join(timing) + "]")
    (ROOT / "compositions/subtitulos.html").write_text(out, encoding="utf8")
    print(f"{len(groups)} grupos de subtitulos hasta {total} s")


def grabar():
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = pathlib.Path(tmp) / "raw.wav"
        words = elevenlabs(raw.with_suffix(".mp3")) if CFG["provider"] == "elevenlabs" else kokoro(raw, tmp)
        src = raw.with_suffix(".mp3") if CFG["provider"] == "elevenlabs" else raw
        probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(src), "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
        stats = json.loads(probe[probe.rindex("{") : probe.rindex("}") + 1])
        gain = min(LOUDNESS - float(stats["input_i"]), -1.0 - float(stats["input_tp"]))
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", f"volume={gain:.2f}dB", "-b:a", "160k", str(VOICE_DIR / "voz.mp3")])
    length = duration(VOICE_DIR / "voz.mp3")
    total = round(words[-1]["end"] + CFG.get("hold_end", 1.6), 2)
    (VOICE_DIR / "voz.json").write_text(json.dumps({"provider": CFG["provider"], "duration": length, "total": total, "words": words}, ensure_ascii=False, indent=0), encoding="utf8")
    write_captions(to_captions(words), total)
    print(f"Voz {length:.2f} s, video {total} s")
    print(" ".join(f"{w['text']}@{w['start']}" for w in words))


def subtitulos(hasta=None):
    data = json.loads((VOICE_DIR / "voz.json").read_text(encoding="utf8"))
    total = float(hasta) if hasta else data["total"]
    write_captions(to_captions([w for w in data["words"] if w["start"] < total]), total)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "grabar":
        grabar()
    elif cmd == "subtitulos":
        subtitulos(sys.argv[2] if len(sys.argv) > 2 else None)
    else:
        raise SystemExit(__doc__)
