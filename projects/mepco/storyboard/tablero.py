"""Arma un tablero de 7 columnas con escenas/escena_<n>.png. Uso: python3 tablero.py salida.png 01 02 ..."""
import pathlib
import subprocess
import sys

out, names = sys.argv[1], sys.argv[2:]
d = pathlib.Path(__file__).parent / "escenas"
ins, fl, lay = [], "", []
for k, n in enumerate(names):
    ins += ["-i", str(d / f"escena_{n}.png")]
    fl += f"[{k}]scale=360:640[v{k}];"
    lay.append(f"{(k % 7) * 360}_{(k // 7) * 640}")
fl += "".join(f"[v{k}]" for k in range(len(names))) + f"xstack=inputs={len(names)}:layout={'|'.join(lay)}:fill=black"
subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fl, out])
