// sets/atelier.js — atelier de techno au coucher du soleil : grande fenêtre, établi, panneau d'outils.
import { E, V, mood, layer, rr, seg, circle, ring, linGrad, alpha, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const atelierGround = () => E.H * V(0.8, 0.68);
export function atelier(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = atelierGround(), CX = E.W / 2;
  layer(g, cam, 0.35, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [M.dark, M.wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    const wx = CX - 120, wy = GY - 600, ww = 720, wh = 360;
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 4, frame: shade(M.wall, -0.55), bar: 10, blinds: 0 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
      FX.sun(g, x + w * 0.6, y + h * 0.7, 50, '#fff7e6', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.5, color: alpha(shade(M.wall, -0.2), 0.8), windowColor: alpha(M.practical, 0.7), seed: 7 });
    });
    // panneau d'outils (silhouettes)
    const px = CX - 820, py = GY - 560; rr(g, px, py, 520, 300, 10); g.fillStyle = shade(M.wall, -0.35); g.fill();
    const tc = shade(M.wall, -0.7);
    seg(g, [[px + 60, py + 60], [px + 60, py + 220]], 14, tc); rr(g, px + 40, py + 40, 40, 40, 6); g.fillStyle = tc; g.fill();          // marteau
    seg(g, [[px + 150, py + 50], [px + 150, py + 240]], 8, tc); seg(g, [[px + 135, py + 50], [px + 165, py + 50]], 16, tc);             // tournevis
    ring(g, px + 280, py + 110, 48, 12, tc); seg(g, [[px + 280, py + 158], [px + 280, py + 250]], 12, tc);                             // clé
    for (let i = 0; i < 4; i++) circle(g, px + 380 + i * 34, py + 200, 12 + i * 2, tc);                                                    // douilles
    seg(g, [[px + 360, py + 80], [px + 490, py + 80], [px + 490, py + 130]], 12, tc);                                                      // équerre
  });
  layer(g, cam, 0.75, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 30, 0, GY + 600, [shade(M.floor, 0.1), M.dark]); g.fillRect(-E.W, GY - 30, E.W * 3, E.H * 2);
    FX.floorLines(g, GY - 30, GY + 600, 'rgba(0,0,0,.22)', 0.07);
    // établi
    const bx = CX + 300, bw = 560, top = GY - 150;
    g.fillStyle = shade(M.wall, -0.2); g.fillRect(bx, top, bw, 26);
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(bx + 20, top + 26, 24, 124); g.fillRect(bx + bw - 44, top + 26, 24, 124);
    rr(g, bx + 300, top - 70, 120, 70, 8); g.fillStyle = shade(M.wall, -0.5); g.fill();                                                 // étau
    FX.pool(g, CX + 160, GY + 10, 520, 80, M.key, 0.22);
  });
  return { GY, CX, M };
}
