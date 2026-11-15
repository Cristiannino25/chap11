// sets/rue.js — rue de quartier (crépuscule ou jour) : façades, lampadaires, arbres, trottoir.
import { E, V, mood, layer, linGrad, alpha, shade, backdrop } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const rueGround = () => E.H * V(0.8, 0.68);
export function rue(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = rueGround();
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.75, GY - 330, 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.35, (g) => FX.skyline(g, { x: -E.W, y: GY - 120, w: E.W * 3, maxH: 260, color: shade(M.wall, -0.3), windowColor: alpha(M.practical, 0.7), seed: 12 }));
  layer(g, cam, 0.6, (g) => {
    for (let i = -3; i < 7; i++) FX.facade(g, { x: i * 520 - 200, y: GY - 120, w: 460, h: 320 + (i % 3) * 60, color: shade(M.wall, -0.15 - (i % 2) * 0.1), win: M.practical, dark: shade(M.wall, -0.5), cols: 3, rows: 2, lit: 0.5, seed: 30 + i });
    for (let i = -3; i < 8; i++) FX.tree(g, i * 470 + 120, GY - 110, 1.1, shade(M.dark, 0.05));
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = shade(M.floor, 0.05); g.fillRect(-E.W * 2, GY - 120, E.W * 6, 50);                                       // trottoir
    g.fillStyle = linGrad(g, 0, GY - 70, 0, E.H + 300, [shade(M.road || M.floor, -0.1), M.dark]); g.fillRect(-E.W * 2, GY - 70, E.W * 6, E.H);
    for (let x = -E.W * 2; x < E.W * 4; x += 260) { g.fillStyle = alpha(M.practical, 0.5); g.fillRect(x, GY + 60, 130, 8); }
    for (let i = -2; i < 6; i++) FX.lampPost(g, i * 900 + 300, GY - 110, 340, { light: M.practical, a: 0.16 });
  });
  return { GY, M };
}
