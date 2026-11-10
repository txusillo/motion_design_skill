"""Render final para Instagram: render delivery, color del look y audio en -15 LUFS.

Uso: python3 render_final.py <carpeta-del-proyecto> <salida.mp4> [--grade "eq=..."]
Sin --grade usa el color que funcionó en el look retro-pixel.
"""
import glob
import json
import os
import pathlib
import subprocess
import sys
import tempfile

GRADE = "eq=brightness=0.035:contrast=1.14:saturation=1.32:gamma=1.10"


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    project = pathlib.Path(sys.argv[1]).resolve()
    out = pathlib.Path(sys.argv[2])
    out = out if out.is_absolute() else project / out
    grade = sys.argv[sys.argv.index("--grade") + 1] if "--grade" in sys.argv else GRADE
    found = sorted(glob.glob(os.path.expanduser("~/.claude/plugins/cache/hyperframes/hyperframes/*/skills/hyperframes/scripts/plugin-cli.mjs")))
    hf = ["node", found[-1]] if found else ["npx", "hyperframes"]
    with tempfile.TemporaryDirectory() as tmp:
        raw = pathlib.Path(tmp) / "crudo.mp4"
        subprocess.check_call(hf + ["render", "--quality", "delivery", "-o", str(raw)], cwd=project)
        length = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(raw)]).decode().strip()
        probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "loudnorm=I=-15:TP=-1:LRA=11:print_format=json", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
        m = json.loads(probe[probe.rindex("{") : probe.rindex("}") + 1])
        af = (
            f"loudnorm=I=-15:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
            f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
        )
        subprocess.check_call([
            "ffmpeg", "-v", "error", "-y", "-i", str(raw), "-vf", f"{grade},format=yuv420p",
            "-c:v", "libx264", "-preset", "slow", "-crf", "17",
            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
            "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-t", length, "-movflags", "+faststart", str(out),
        ])
    summary = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(out), "-af", "loudnorm=print_format=summary", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
    levels = [line.strip() for line in summary.splitlines() if "Input Integrated" in line or "Input True Peak" in line]
    print(out, length, "s", *levels)


if __name__ == "__main__":
    main()
