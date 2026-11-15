// sets/mech.js — dessins de mécanismes en style plan (blueprint) : engrenages, crémaillère, flèches, piston, came.
import { E, S, seg, circle, ring, poly, rr, glow, alpha, text, FONTS, ease, prog, clamp } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';

export const C = () => ({ line: UI.bpStroke(), gold: S().ui.gold, cream: S().ui.cream, red: S().ui.accent });

export function arrow(g, pts, w, col, head = 22) {
  seg(g, pts, w, col);
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  poly(g, [[b[0] + Math.cos(ang) * head * 0.6, b[1] + Math.sin(ang) * head * 0.6], [b[0] + Math.cos(ang + 2.4) * head, b[1] + Math.sin(ang + 2.4) * head], [b[0] + Math.cos(ang - 2.4) * head, b[1] + Math.sin(ang - 2.4) * head]], col);
}
// flèche circulaire (rotation), de a0 à a1 radians
export function arcArrow(g, x, y, r, a0, a1, w, col, head = 22) {
  const pts = []; for (let k = 0; k <= 30; k++) { const a = a0 + (a1 - a0) * k / 30; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  arrow(g, pts, w, col, head);
}
export function gear(g, x, y, r, teeth, rot, col, w = 5, fill = null) {
  const pts = [], d = r * 0.16;
  for (let i = 0; i < teeth * 4; i++) { const a = rot + (i / (teeth * 4)) * Math.PI * 2, rr2 = (i % 4 === 1 || i % 4 === 2) ? r + d : r - d * 0.3; pts.push([x + Math.cos(a) * rr2, y + Math.sin(a) * rr2]); }
  g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.strokeStyle = col; g.lineWidth = w; g.lineJoin = 'round'; g.stroke();
  ring(g, x, y, r * 0.25, w, col); seg(g, [[x, y], [x + Math.cos(rot) * r * 0.7, y + Math.sin(rot) * r * 0.7]], w, col);
}
// crémaillère horizontale, dents vers le haut (up=true) ou le bas
export function rack(g, x, y, w, h, pitch, off, col, up = true, lw = 5) {
  g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round';
  g.strokeRect(x, y, w, h);
  const ty = up ? y : y + h, dir = up ? -1 : 1;
  g.beginPath(); const start = x + ((off % pitch) + pitch) % pitch - pitch;
  for (let px = start; px < x + w; px += pitch) { const a = Math.max(x, px + pitch * 0.15), b = Math.min(x + w, px + pitch * 0.85); if (b <= a) continue; g.moveTo(a, ty); g.lineTo(Math.min(b, a + pitch * 0.2), ty + dir * pitch * 0.45); g.lineTo(Math.max(a, b - pitch * 0.2), ty + dir * pitch * 0.45); g.lineTo(b, ty); }
  g.stroke();
}
export function label(g, str, x, y, col, size = 44, a = 1, align = 'center') {
  text(g, str, x, y, { size, color: col, font: FONTS.ui, weight: 900, spacing: 3, align, alpha: a });
}
export const pop = (t, at) => ease.outBack(prog(t, at, at + 0.35));
export { glow, circle, ring, seg, rr, poly, alpha, clamp };
