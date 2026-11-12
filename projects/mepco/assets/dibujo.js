/* Funciones de dibujo copiadas de storyboard/index.html. Globales con var para poder cargarse desde varias composiciones. GLID: prefijo del filtro GLOW (se fija antes de dibujar en cada composicion). */
var BG = "#26292d", PANEL = "#0e0f10", LINE = "#3d4248", INK = "#ecebe6", MUTED = "#8b8d91",
      AMBER = "#ffb000", ORANGE = "#ff6a13", TEAL = "#46c2b0", OFF = "#211d12";
var TOTAL = 97.25;
var SECTIONS = ["El golpe", "El amortiguador", "La decisión", "El efecto", "Hoy"];

/* ---------- 7 segmentos ---------- */
var SEG = { "0":"abcdef","1":"bc","2":"abged","3":"abgcd","4":"fgbc","5":"afgcd","6":"afgedc","7":"abc","8":"abcdefg","9":"abcdfg","-":"g" };
function seg7(str, x, y, w, h, t, on, off = OFF) {
  let s = "", cx = x;
  for (const ch of str) {
    if (ch === "." || ch === ",") { s += `<rect x="${cx - t * 0.2}" y="${y + h - t}" width="${t}" height="${t}" rx="${t * .3}" fill="${on}"/>`; cx += t * 1.2; continue; }
    const k = SEG[ch] || "", hh = h / 2;
    const g = { a: [cx + t, y, w - 2 * t, t], d: [cx + t, y + h - t, w - 2 * t, t], g: [cx + t, y + hh - t / 2, w - 2 * t, t],
      f: [cx, y + t, t, hh - 1.5 * t], b: [cx + w - t, y + t, t, hh - 1.5 * t], e: [cx, y + hh + t / 2, t, hh - 1.5 * t], c: [cx + w - t, y + hh + t / 2, t, hh - 1.5 * t] };
    for (const n in g) { const [a, b, c, d] = g[n]; s += `<rect x="${a}" y="${b}" width="${c}" height="${d}" rx="${t * .35}" fill="${k.includes(n) ? on : off}"/>`; }
    cx += w + t * 1.1;
  }
  return s;
}
var GLID = "gl";
var glowDefs = () => `<defs><filter id="${GLID}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
var T = (x, y, txt, o = {}) => `<text x="${x}" y="${y}" font-family="${o.mono ? "JetBrains Mono" : "Barlow Condensed"}" font-weight="${o.w || (o.mono ? 500 : 700)}" font-size="${o.s || 30}" fill="${o.c || INK}" text-anchor="${o.a || "start"}" letter-spacing="${o.ls != null ? o.ls : (o.mono ? 3 : 0)}" ${o.extra || ""}>${txt}</text>`;

/* ---------- auto en corte con resorte (local 640 x 330) ---------- */
function car(x, y, sc, o = {}) {
  const sw = 6, comp = o.comp || 0, lift = -comp * 40;   // comp: 0 normal, 1 comprimido
  const body = o.body || "#454a52", spring = o.spring || TEAL;
  const W = (n, str) => o.id ? `<g id="${o.id}-${n}">${str}</g>` : str;   // o.id: ids estables para animar (cuerpo, resortes sp0/sp1, ruedas wh0/wh1)
  let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
  let b = `<g transform="translate(0 ${lift * 0})">`;
  b += `<path d="M30 190 L44 132 Q54 112 92 108 L190 102 L262 46 Q280 32 312 32 L430 32 Q462 32 484 54 L540 104 L590 112 Q622 118 626 146 L628 190 Z" fill="${body}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  b += `<path d="M214 104 L276 56 Q288 48 306 48 L360 48 L360 104 Z" fill="${BG}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  b += `<path d="M380 104 L380 48 L428 48 Q450 48 466 62 L510 104 Z" fill="${BG}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  b += `</g>`;
  s += W("body", b);
  const wheels = o.wheels || [[150, 0], [500, 0]];
  wheels.forEach(([wx, dy], k) => {
    const top = 190, bot = 262 + dy, n = 7;
    if (!o.noSpring) {
      let d = `M${wx} ${top}`;
      for (let i = 1; i <= n; i++) d += ` L${wx + (i % 2 ? 24 : -24)} ${top + (bot - top) * i / (n + 1)}`;
      d += ` L${wx} ${bot}`;
      s += W("sp" + k, `<path d="${d}" fill="none" stroke="${spring}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" ${o.glow ? `filter="url(#${GLID})"` : ""}/>`);
    } else {
      s += `<line x1="${wx}" y1="${top}" x2="${wx}" y2="${top + 18}" stroke="${MUTED}" stroke-width="7"/><line x1="${wx}" y1="${bot - 14}" x2="${wx}" y2="${bot}" stroke="${MUTED}" stroke-width="7"/>`;
    }
    s += W("wh" + k, `<circle cx="${wx}" cy="${280 + dy}" r="50" fill="${PANEL}" stroke="${INK}" stroke-width="${sw}"/><circle cx="${wx}" cy="${280 + dy}" r="18" fill="#3a3c40"/>`);
  });
  return s + `</g>`;
}

/* ---------- personas planas ---------- */
function person(x, y, sc, shirt, skin, hair, o = {}) {
  let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
  s += `<rect x="-34" y="-60" width="68" height="120" rx="30" fill="${shirt}"/>`;
  s += `<rect x="-28" y="50" width="22" height="70" rx="10" fill="#2a2d31"/><rect x="6" y="50" width="22" height="70" rx="10" fill="#2a2d31"/>`;
  s += `<circle cx="0" cy="-96" r="32" fill="${skin}"/>`;
  s += o.long ? `<path d="M-34 -96 Q-34 -134 0 -134 Q34 -134 34 -96 L34 -50 L24 -50 L24 -100 L-24 -100 L-24 -50 L-34 -50 Z" fill="${hair}"/>` : `<path d="M-33 -100 Q-30 -134 0 -133 Q30 -134 33 -100 Q20 -114 0 -112 Q-20 -114 -33 -100 Z" fill="${hair}"/>`;
  return s + `</g>`;
}
var FAMILY = (x, y, sc) => person(x, y, sc, "#4b6b8a", "#c8936a", "#2a201a") + person(x + 100 * sc, y + 10 * sc, sc * .95, ORANGE, "#eac6a2", "#5b3b24", { long: true }) + person(x + 185 * sc, y + 40 * sc, sc * .62, AMBER, "#946043", "#1a1a1a");

/* ---------- barril ---------- */
function barrel(x, y, sc, label) {
  let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
  s += `<rect x="-70" y="-100" width="140" height="200" rx="18" fill="#2a2d31" stroke="${INK}" stroke-width="6"/>`;
  s += `<line x1="-70" y1="-40" x2="70" y2="-40" stroke="${INK}" stroke-width="6"/><line x1="-70" y1="40" x2="70" y2="40" stroke="${INK}" stroke-width="6"/>`;
  s += `<ellipse cx="0" cy="-100" rx="70" ry="16" fill="#3a3c40" stroke="${INK}" stroke-width="6"/>`;
  if (label) s += T(0, 14, label, { a: "middle", s: 30, w: 800, c: AMBER });
  return s + `</g>`;
}

/* ---------- letrero LED de precio ---------- */
function ledRow(x, y, label, value, on, sz = 1) {
  const w = 92 * sz, h = 150 * sz, t = 17 * sz;
  return T(x, y, label, { mono: true, s: 26, c: on === AMBER ? AMBER : MUTED }) + T(x, y + 38 * sz + h - 26 * sz, "$", { s: 100 * sz, c: on, w: 700 }) +
    `<g ${on === AMBER ? `filter="url(#${GLID})"` : ""}>${seg7(value, x + 62 * sz, y + 30 * sz, w, h, t, on)}</g>`;
}

/* ---------- gráfico: petróleo afuera vs precio en la bomba ---------- */
var CH = { x0: 110, x1: 990, y0: 980, y1: 420, n: 40, lo: 900, hi: 1600 };
var cx = (i) => CH.x0 + (i / (CH.n - 1)) * (CH.x1 - CH.x0);
var cy = (v) => CH.y0 - (v - CH.lo) / (CH.hi - CH.lo) * (CH.y0 - CH.y1);
var PAR = Array.from({ length: CH.n }, (_, i) => i < 6 ? 1050 : i < 10 ? 1050 + (i - 5) * 70 : i < 20 ? 1330 : i < 26 ? 1330 - (i - 19) * 45 : 1060);
var PUMP = (() => { const o = []; let p = 1050; for (let i = 0; i < CH.n; i++) { if (i % 3 === 0 && i) { const d = PAR[i] - p; p += Math.max(-26, Math.min(26, d)); } o.push(p); } return o; })();
var path = (arr, upto = CH.n) => arr.slice(0, upto).map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(" ");
var stepPath = (arr, upto = CH.n) => { let d = ""; arr.slice(0, upto).forEach((v, i) => { d += i ? ` L${cx(i).toFixed(1)} ${cy(arr[i - 1]).toFixed(1)} L${cx(i).toFixed(1)} ${cy(v).toFixed(1)}` : `M${cx(0)} ${cy(v)}`; }); return d; };
function gapArea(upto, sign) {
  let top = "", bot = [];
  for (let i = 0; i < upto; i++) { const a = PAR[i], b = PUMP[i]; if ((a - b) * sign > 0) { top += `${top ? "L" : "M"}${cx(i)} ${cy(a)} `; bot.unshift(`L${cx(i)} ${cy(b)}`); } else if (top) break; }
  return top ? `<path d="${top}${bot.join(" ")} Z" fill="${TEAL}" fill-opacity=".3"/>` : "";
}
function chartFrame(o = {}) {
  let s = "";
  for (const v of [1000, 1200, 1400]) s += `<line x1="${CH.x0}" x2="${CH.x1}" y1="${cy(v)}" y2="${cy(v)}" stroke="${LINE}" stroke-width="2"/>`;
  s += `<line x1="${CH.x0}" x2="${CH.x1}" y1="${CH.y0}" y2="${CH.y0}" stroke="${MUTED}" stroke-width="3"/>`;
  s += T(CH.x0, CH.y0 + 44, o.left || "SEMANAS →", { mono: true, s: 26, c: MUTED });
  if (o.legend !== false) {
    s += `<line x1="110" x2="160" y1="352" y2="352" stroke="${MUTED}" stroke-width="5" stroke-dasharray="12 9"/>` + T(176, 361, "PETRÓLEO AFUERA", { mono: true, s: 26, c: MUTED });
    s += `<line x1="600" x2="650" y1="352" y2="352" stroke="${ORANGE}" stroke-width="9" stroke-linecap="round"/>` + T(666, 361, "PRECIO BOMBA", { mono: true, s: 26, c: ORANGE });
  }
  return s;
}
function cal(x, y, day, num, price, on) {
  return `<g transform="translate(${x} ${y})"><rect width="360" height="440" rx="22" fill="${on ? PANEL : "#16171a"}" stroke="${on ? AMBER : LINE}" stroke-width="4"/>
    <path d="M0 22 Q0 0 22 0 L338 0 Q360 0 360 22 L360 90 L0 90 Z" fill="${on ? ORANGE : "#2a2d31"}"/>
    ${T(180, 64, day, { a: "middle", s: 52, w: 800, c: on ? BG : MUTED, ls: 4 })}
    ${T(180, 270, num, { a: "middle", s: 190, w: 800, c: on ? INK : MUTED })}
    ${T(180, 330, "MARZO 2026", { a: "middle", mono: true, s: 26, c: MUTED })}
    <g ${on ? `filter="url(#${GLID})"` : ""}>${seg7(price, 72, 360, 48, 56, 9, on ? AMBER : "#a8916a")}</g></g>`;
}
var ROAD = (bumpX = 600, bumpH = 70) => `<path d="M0 1130 L${bumpX - 80} 1130 Q${bumpX} ${1130 - bumpH * 2} ${bumpX + 80} 1130 L1080 1130" fill="none" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 90}" y="1160" width="50" height="8" fill="#3a3c40"/>`).join("")}`;
function doc(x, y, w, h, lines, stamp) {
  let s = `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="10" fill="#e9e6dd"/>`;
  lines.forEach((l, i) => { s += T(36, 70 + i * 50, l, { mono: true, s: 26, c: "#3a3c40", w: 500 }); });
  for (let i = 0; i < 6; i++) s += `<rect x="36" y="${70 + lines.length * 50 + i * 34}" width="${w - 72 - (i % 3) * 60}" height="10" rx="5" fill="#c9c4b8"/>`;
  if (stamp) s += `<g transform="translate(${w * .52} ${h * .72}) rotate(-12)"><rect x="-170" y="-58" width="340" height="116" rx="10" fill="none" stroke="${ORANGE}" stroke-width="8"/>${T(0, 18, stamp, { a: "middle", s: 60, w: 800, c: ORANGE })}</g>`;
  return s + `</g>`;
}
function congress(x, y, sc, col) {
  let s = `<g transform="translate(${x} ${y}) scale(${sc})" fill="none" stroke="${col}" stroke-width="6">`;
  s += `<path d="M-160 0 L160 0 M-140 0 L-140 -110 M140 0 L140 -110 M-170 -110 L170 -110 L0 -190 Z"/>`;
  for (const cx2 of [-90, -30, 30, 90]) s += `<line x1="${cx2}" y1="-10" x2="${cx2}" y2="-100"/>`;
  return s + `</g>`;
}
function truck(x, y, sc, cargo = true) {
  let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
  s += `<rect x="0" y="0" width="420" height="200" rx="10" fill="#454a52" stroke="${INK}" stroke-width="6"/>`;
  s += `<path d="M420 60 L520 60 L580 130 L580 200 L420 200 Z" fill="#454a52" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M440 80 L510 80 L550 125 L440 125 Z" fill="${BG}" stroke="${INK}" stroke-width="4"/>`;
  if (cargo) [["PAN", 30], ["LECHE", 160], ["FRUTA", 290]].forEach(([n, bx]) => { s += `<rect x="${bx}" y="40" width="110" height="120" rx="8" fill="${PANEL}" stroke="${AMBER}" stroke-width="3"/>` + T(bx + 55, 110, n, { a: "middle", mono: true, s: 26, c: AMBER }); });
  for (const wx of [90, 330, 500]) s += `<circle cx="${wx}" cy="215" r="44" fill="${PANEL}" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="215" r="16" fill="#3a3c40"/>`;
  return s + `</g>`;
}
function stairs(o = {}) {               // regla de antes vs una noche: +$372. o.id: grupos con ids (axis, path, regla, wall, marz, plus); o.clipId: recorte del trazo
  const x0 = 140, x1 = 980, y0 = 1000, y1 = 470, weeks = 43, step = 26;
  const X = (w) => x0 + w / weeks * (x1 - x0), Y = (v) => y0 - v / 372 * (y0 - y1);
  const W = (n, str) => o.id ? `<g id="${o.id}-${n}">${str}</g>` : str;
  let d = `M${x0} ${y0}`, v = 0;
  for (let w = 3; w <= weeks + 1 && v < 372; w += 3) { const nv = Math.min(372, v + step); d += ` L${X(w)} ${Y(v)} L${X(w)} ${Y(nv)}`; v = nv; }
  let ax = `<line x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}" stroke="${MUTED}" stroke-width="3"/>`;
  for (const w of [0, 13, 26, 39]) ax += T(X(w), y0 + 40, w ? w + " SEM" : "0", { a: "middle", mono: true, s: 26, c: MUTED });
  let s = W("axis", ax);
  s += W("path", `<path ${o.clipId ? `clip-path="url(#${o.clipId})"` : ""} d="${d}" fill="none" stroke="${TEAL}" stroke-width="8" stroke-linejoin="round"/>`);
  s += W("regla", T(X(30), Y(372) - 30, "REGLA DE ANTES: ~43 SEMANAS", { a: "middle", mono: true, s: 26, c: TEAL }));
  s += W("wall", `<line x1="${x0}" x2="${x0}" y1="${y0}" y2="${Y(372)}" stroke="${ORANGE}" stroke-width="14" stroke-linecap="round"/><line x1="${x0}" x2="${X(10)}" y1="${Y(372)}" y2="${Y(372)}" stroke="${ORANGE}" stroke-width="14" stroke-linecap="round"/>`);
  s += W("marz", T(x0 + 20, Y(372) + 50, "MARZO 2026: 1 NOCHE", { mono: true, s: 26, c: ORANGE }));
  s += W("plus", T(x1, Y(372) - 70, "+$372", { a: "end", s: 64, w: 800, c: AMBER }));
  return s;
}
function gauge(v) { const a = (x) => Math.PI * (1 - x / 6); const C = [540, 960], R = 360; const P = (x, r = R) => [C[0] + r * Math.cos(a(x)), C[1] - r * Math.sin(a(x))];
  const arc = (x0, x1, col, w) => { const [ax, ay] = P(x0), [bx, by] = P(x1); return `<path d="M${ax} ${ay} A${R} ${R} 0 0 1 ${bx} ${by}" fill="none" stroke="${col}" stroke-width="${w}"/>`; };
  let s = arc(0, 6, "#3d4248", 60) + arc(2, 4, TEAL, 60);
  for (let x = 0; x <= 6; x++) { const [tx, ty] = P(x, R + 70); s += T(tx, ty + 10, x + "%", { a: "middle", mono: true, s: 24, c: MUTED }); }
  const [ox, oy] = P(2.8, R - 70); s += `<line x1="${C[0]}" y1="${C[1]}" x2="${ox}" y2="${oy}" stroke="${MUTED}" stroke-width="8" stroke-dasharray="10 10"/>`;
  const [nx, ny] = P(v, R - 40); s += `<line x1="${C[0]}" y1="${C[1]}" x2="${nx}" y2="${ny}" stroke="${ORANGE}" stroke-width="14" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="24" fill="${ORANGE}"/>`;
  return s; }
