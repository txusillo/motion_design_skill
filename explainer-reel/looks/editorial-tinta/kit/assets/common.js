/* Funciones de dibujo comunes (copiadas del storyboard). Se cargan una sola vez. */
window.AP = window.AP || (function () {
const INK = "#16213e", ACC = "#2e5bff", SOFT = "#a9b8e8", PAPER = "#eceae4", CARD = "#f7f6f2";
      function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

      // ---------- Isométrico con vóxeles ----------
      const U = 30, C = Math.cos(Math.PI / 6) * U, S = Math.sin(Math.PI / 6) * U;
      const P = (x, y, z) => [(x - y) * C, (x + y) * S - z * U];
      const pts = (a) => a.map((p) => P(...p).map((v) => v.toFixed(1)).join(",")).join(" ");
      function shade(hex, k) { const n = parseInt(hex.slice(1), 16); return `rgb(${Math.round(((n >> 16) & 255) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`; }
      function box(x, y, z, w, d, h, col) {
        const top = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
        const right = [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]];
        const left = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]];
        return `<polygon points="${pts(left)}" fill="${shade(col, 0.86)}"/><polygon points="${pts(right)}" fill="${shade(col, 0.7)}"/><polygon points="${pts(top)}" fill="${col}"/>`;
      }
      const faceRect = (fx, y, z, d, h, col) => `<polygon points="${pts([[fx, y, z], [fx, y + d, z], [fx, y + d, z + h], [fx, y, z + h]])}" fill="${col}"/>`;
      function person(o) {
        let s = "";
        s += box(0.2, -0.55, 2.3, 0.8, 0.55, 2.0, o.shirt);
        s += box(0.15, 0.1, 0, 0.9, 0.8, 2.3, o.pants);
        s += box(0.15, 1.1, 0, 0.9, 0.8, 2.3, o.pants);
        s += box(0.0, 0.0, 2.3, 1.2, 2.0, 2.4, o.shirt);
        s += box(0.2, 2.0, 2.3, 0.8, 0.55, 2.0, o.shirt);
        s += box(0.25, 2.0, 2.0, 0.7, 0.55, 0.35, o.skin);
        if (o.style === "long") s += box(-0.2, 0.0, 3.8, 0.5, 2.0, 2.6, o.hair);
        s += box(-0.1, 0.1, 4.7, 1.6, 1.8, 1.7, o.skin);
        s += box(-0.15, 0.05, 6.1, 1.7, 1.9, o.style === "tall" ? 1.0 : 0.45, o.hair);
        s += box(-0.15, 0.05, 5.4, 0.45, 1.9, 0.75, o.hair);
        if (o.style === "bun") s += box(0.3, 0.7, 6.55, 0.7, 0.7, 0.6, o.hair);
        s += faceRect(1.5, 0.5, 5.35, 0.22, 0.32, "#20180f");
        s += faceRect(1.5, 1.3, 5.35, 0.22, 0.32, "#20180f");
        if (o.glasses) { s += faceRect(1.52, 0.38, 5.25, 0.46, 0.08, "#20180f"); s += faceRect(1.52, 1.18, 5.25, 0.46, 0.08, "#20180f"); s += faceRect(1.52, 0.38, 5.68, 1.26, 0.07, "#20180f"); }
        s += faceRect(1.5, 0.75, 4.95, 0.55, 0.12, shade(o.skin, 0.6));
        if (o.tie) s += faceRect(1.2, 0.85, 3.4, 0.3, 1.3, o.tie);
        return s;
      }
      const at = (x, y, sc, flip, inner) => `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})">${inner}</g>`;
      const SKIN = ["#eac6a2", "#c8936a", "#946043", "#e3b48c"];
      const HAIR = ["#2a201a", "#5b3b24", "#1a1a1a", "#8a6a3c"];
      const PEOPLE = [
        { shirt: INK, pants: shade(INK, 0.6), skin: SKIN[0], hair: HAIR[3], style: "bun" },
        { shirt: SOFT, pants: INK, skin: SKIN[3], hair: HAIR[0], style: "short", tie: ACC },
        { shirt: "#f4efe4", pants: INK, skin: SKIN[1], hair: HAIR[1], style: "long" },
        { shirt: ACC, pants: "#0f1730", skin: SKIN[2], hair: HAIR[2], style: "tall" },
        { shirt: "#8a93a8", pants: INK, skin: SKIN[1], hair: HAIR[0], style: "short" },
        { shirt: "#c3c8d4", pants: "#0f1730", skin: SKIN[0], hair: HAIR[1], style: "long" },
      ];
      const GROUPS = [
        { id: "C4", label: "Mapuche", n: 16, cx: 285, cy: 640, r: 150, col: "#5f9e7a", lx: 120, ly: 450 },
        { id: "C2", label: "Mapuche", n: 7, cx: 225, cy: 905, r: 70, col: "#2f8f8a", lx: 90, ly: 1000 },
        { id: "C3", label: "Coreana", n: 6, cx: 560, cy: 420, r: 55, col: "#d9a62e", lx: 625, ly: 380 },
        { id: "C1", label: "Gitana", n: 5, cx: 930, cy: 520, r: 40, col: "#c9577f", lx: 850, ly: 430 },
        { id: "C6", label: "Mixta", n: 6, cx: 430, cy: 860, r: 60, col: "#9a8f7a", lx: 345, ly: 945 },
        { id: "C8", label: "Mixta", n: 7, cx: 560, cy: 985, r: 62, col: "#8f6fb8", lx: 610, ly: 1040 },
        { id: "C7", label: "Aristocracia", n: 13, cx: 650, cy: 690, r: 105, col: ACC, elite: ACC, lx: 330, ly: 610 },
        { id: "C0", label: "+ familias palestinas", n: 12, cx: 850, cy: 680, r: 100, col: "#18a0e0", elite: "#18a0e0", lx: 560, ly: 500 },
        { id: "C5", label: "+ familias judías", n: 13, cx: 770, cy: 850, r: 105, col: "#1b2fa8", elite: "#1b2fa8", lx: 690, ly: 965 },
      ];
      const NET = (() => {
        const r = rng(7), nodes = [], edges = [];
        GROUPS.forEach((g, gi) => {
          for (let i = 0; i < g.n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * g.r; nodes.push({ g: gi, x: g.cx + Math.cos(a) * d, y: g.cy + Math.sin(a) * d * 0.85 }); }
        });
        nodes.forEach((p, i) => {
          const near = nodes.map((q, j) => [j, (q.x - p.x) ** 2 + (q.y - p.y) ** 2]).filter(([j]) => j !== i && nodes[j].g === p.g).sort((a, b) => a[1] - b[1]).slice(0, 2);
          near.forEach(([j]) => { if (i < j) edges.push([i, j, 0]); });
        });
        for (let k = 0; k < 18; k++) { const i = Math.floor(r() * nodes.length), j = Math.floor(r() * nodes.length); const gi = GROUPS[nodes[i].g], gj = GROUPS[nodes[j].g]; if (nodes[i].g !== nodes[j].g && (gi.elite && gj.elite ? true : r() < 0.25)) edges.push([i, j, 1]); }
        return { nodes, edges };
      })();
function hemiSeats() {
  const seats = [];
  const rows = [[170, 14], [215, 18], [260, 22], [305, 26], [350, 30]];
  rows.forEach(([r, n]) => { for (let i = 0; i < n; i++) { const a = Math.PI - (i / (n - 1)) * Math.PI; seats.push({ a, x: 540 + Math.cos(a) * r, y: 980 - Math.sin(a) * r }); } });
  seats.sort((p, q) => q.a - p.a);
  return seats;
}
return { INK, ACC, SOFT, PAPER, CARD, rng, U, C, S, P, pts, shade, box, faceRect, person, at, SKIN, HAIR, PEOPLE, GROUPS, NET, hemiSeats };
})();
