"""Genera assets/retime.js: lleva tiempos de la toma 6 (Kokoro, con la que se animo todo) a la toma actual.
Anclas: inicio de cada palabra y fin de la ultima palabra de cada frase. Uso: python3 retime_build.py"""
import json, pathlib
R = pathlib.Path(__file__).parent
old = json.load(open(R / "assets/voice/tomas/toma6_kokoro.json"))
new = json.load(open(R / "assets/voice/voz.json"))
ow, nw = old["words"], new["words"]
assert [w["text"] for w in ow] == [w["text"] for w in nw], "las tomas no tienen el mismo texto"
A = [(0.0, 0.0)]
for i, (a, b) in enumerate(zip(ow, nw)):
    A.append((a["start"], b["start"]))
    if a["text"][-1] in ".?!:," and i + 1 < len(ow):
        A.append((a["end"], b["end"]))
A.append((ow[-1]["end"], nw[-1]["end"]))
A.append((old["total"], new["total"]))
clean = [A[0]]
for x, y in A[1:]:
    if x > clean[-1][0] + 1e-3 and y > clean[-1][1] + 1e-3:
        clean.append((x, y))
js = f"""/* generado por retime_build.py: tiempos de la toma 6 (Kokoro) -> toma actual. No editar a mano. */
var RT_A = {json.dumps([[round(x, 3), round(y, 3)] for x, y in clean])};
var RT_TOTAL = {new['total']};
function RM(t) {{
  var A = RT_A;
  if (t <= A[0][0]) return t;
  for (var i = 1; i < A.length; i++) if (t <= A[i][0]) {{ var a = A[i - 1], b = A[i]; return a[1] + (t - a[0]) * (b[1] - a[1]) / (b[0] - a[0]); }}
  var l = A[A.length - 1]; return l[1] + (t - l[0]);
}}
/* mueve cada hijo del timeline (tiempos locales de una escena que empezaba en hostOld y ahora empieza en hostNew);
   los tweens largos (>0,6 s) tambien estiran su duracion, los cortos conservan su ritmo */
function retime(tl, hostOld, hostNew) {{
  var kids = tl.getChildren(false, true, true);
  var plan = kids.map(function (c) {{
    var s = c.startTime(), d = c.duration();
    var ns = RM(hostOld + s) - hostNew;
    var nd = d > 0.6 ? RM(hostOld + s + d) - hostNew - ns : d;
    return [c, Math.max(0, ns), nd, d, s];
  }});
  // las secuencias cortas (salida y entrada de escena, pops escalonados) conservan sus distancias originales
  plan.sort(function (x, y) {{ return x[4] - y[4]; }});
  for (var i = 1; i < plan.length; i++) {{
    var g = plan[i][4] - plan[i - 1][4];
    if (g < 0.3) plan[i][1] = Math.max(plan[i][1], plan[i - 1][1] + g);
  }}
  plan.forEach(function (p) {{ if (p[2] !== p[3]) p[0].duration(p[2]); p[0].startTime(p[1]); }});
  return tl;
}}
"""
(R / "assets/retime.js").write_text(js, encoding="utf8")
print(len(clean), "anclas; total", old["total"], "->", new["total"])
for t in [0, 3.48, 13.23, 34.275, 56.775, 82.675, 99.052]:
    import bisect
    xs = [a for a, _ in clean]; i = bisect.bisect_left(xs, t)
    if i == 0: print(t, t); continue
    if i >= len(clean): print(t, clean[-1][1] + t - clean[-1][0]); continue
    a, b = clean[i - 1], clean[i]; print(t, round(a[1] + (t - a[0]) * (b[1] - a[1]) / (b[0] - a[0]), 3))
