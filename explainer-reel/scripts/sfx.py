"""Genera efectos de sonido con ElevenLabs y los coloca en index.html.

Uso, desde la carpeta del proyecto: ELEVENLABS_API_KEY=... python3 sfx.py
Un archivo ya generado en assets/sfx/crudos no se vuelve a pedir; para cambiarlo, borralo.
Ajustar volumenes o tiempos en sfx.json y volver a correr no gasta creditos.

sfx.json:
{
  "library": {"pop_1": {"kind": "pop", "prompt": "...", "seconds": 0.5, "max": 0.22}, ...},
  "volume": {"pop": 0.32, "whoosh": 0.26, "whoosh_largo": 0.3, "cartas": 0.3},
  "cues": [{"t": 5.88, "kind": "pop"}, {"t": 7.72, "kind": "whoosh", "soft": true},
           {"t": 20.16, "kind": "cartas", "length": 1.1}]
}
Cada "kind" rota entre los efectos de la libreria con ese tipo. "soft" baja el volumen al 70%.
Los tipos "cartas" duran "length" y se comprimen para oirse. Los demas llevan su pico un cuadro
despues de la imagen (los whooshes, 0,2 s despues del inicio del movimiento).
"""
import array
import json
import os
import pathlib
import re
import subprocess
import urllib.error
import urllib.request

ROOT = pathlib.Path.cwd()
CFG = json.loads((ROOT / "sfx.json").read_text(encoding="utf8"))
RAW = ROOT / "assets/sfx/crudos"
OUT = ROOT / "assets/sfx"
SR = 44100
LEAD = {"whoosh": 0.2, "whoosh_largo": 0.6}
LANES = {"pop": [8, 9, 10], "whoosh": [11], "whoosh_largo": [12], "cartas": [13]}


def generate(name, spec):
    path = RAW / f"{name}.mp3"
    if path.exists():
        return path
    body = {"text": spec["prompt"], "duration_seconds": spec.get("seconds", 0.5), "prompt_influence": 0.6}
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
    )
    try:
        path.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"ElevenLabs {e.code}: {e.read()[:300].decode()}")
    return path


def samples(path):
    return array.array("h", subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]))


def process(name, spec, src):
    """Quita el silencio inicial, limita el largo con fundido y deja el pico en -6 dB."""
    data = samples(src)
    peak = max(abs(v) for v in data) or 1
    start = next(i for i, v in enumerate(data) if abs(v) > peak * 0.05)
    length = spec.get("max", spec.get("seconds", 0.5))
    fade = min(0.08, length / 3)
    out = OUT / f"{name}.wav"
    af = f"atrim=start={start / SR:.4f}:duration={length},asetpts=N/SR/TB,afade=t=out:st={length - fade:.3f}:d={fade},volume={0.5 * 32767 / peak:.3f}"
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", af, "-ac", "1", "-ar", str(SR), str(out)])
    if spec["kind"] == "cartas":
        tmp = out.with_suffix(".tmp.wav")
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-af", "acompressor=threshold=0.02:ratio=8:attack=1:release=50:makeup=4", str(tmp)])
        boost = 0.5 * 32767 / (max(abs(v) for v in samples(tmp)) or 1)
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", f"volume={boost:.3f}", str(out)])
        tmp.unlink()
    clip = samples(out)
    return {"len": round(len(clip) / SR, 3), "peak": round(max(range(len(clip)), key=lambda i: abs(clip[i])) / SR, 3)}


def build(info):
    kinds = {}
    for name, spec in CFG["library"].items():
        kinds.setdefault(spec["kind"], []).append(name)
    used = {k: 0 for k in kinds}
    rows = []
    for cue in sorted(CFG["cues"], key=lambda c: c["t"]):
        kind = cue["kind"]
        names = kinds[kind]
        # Rota sin repetir el mismo efecto dos veces seguidas
        name = names[(used[kind] * 3 + 1) % len(names)] if len(names) > 3 else names[used[kind] % len(names)]
        lane = LANES.get(kind, [14])[used[kind] % len(LANES.get(kind, [14]))]
        used[kind] += 1
        vol = CFG["volume"].get(kind, 0.3) * (0.7 if cue.get("soft") else 1)
        if kind == "cartas":
            start, length, extra = cue["t"], min(cue.get("length", 1.0), info[name]["len"]), ' data-fade-out="0.12"'
        else:
            start = max(0, cue["t"] + LEAD.get(kind, 1 / 30) - info[name]["peak"])
            length, extra = info[name]["len"], ""
        rows.append((start, name, length, lane, vol, extra))
    rows.sort()
    return "\n".join(
        f'      <audio id="sfx-{i}" class="clip" src="assets/sfx/{n}.wav" data-start="{s:.3f}" data-duration="{ln}"{x} data-track-index="{lane}" data-volume="{v:.3f}"></audio>'
        for i, (s, n, ln, lane, v, x) in enumerate(rows)
    )


def inject(block):
    path = ROOT / "index.html"
    page = path.read_text(encoding="utf8")
    page = re.sub(r"\n\s*<!-- sfx -->.*?<!-- /sfx -->", "", page, flags=re.S)
    anchor = "    </div>\n    <script>"
    if anchor not in page:
        raise SystemExit("No encontre el cierre del root en index.html para insertar los efectos")
    path.write_text(page.replace(anchor, f"      <!-- sfx -->\n{block}\n      <!-- /sfx -->\n{anchor}", 1), encoding="utf8")


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    info = {name: process(name, spec, generate(name, spec)) for name, spec in CFG["library"].items()}
    inject(build(info))
    names = list(CFG["library"])
    inputs = sum((["-i", str(OUT / f"{n}.wav")] for n in names), [])
    chain = "".join(f"[{i}]apad=pad_dur=0.6[a{i}];" for i in range(len(names)))
    chain += "".join(f"[a{i}]" for i in range(len(names))) + f"concat=n={len(names)}:v=0:a=1[o]"
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain, "-map", "[o]", "-b:a", "160k", str(OUT / "muestras.mp3")])
    print(f"{len(CFG['cues'])} efectos colocados; muestras en assets/sfx/muestras.mp3")


if __name__ == "__main__":
    main()
