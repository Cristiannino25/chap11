// shots/02_systemes.js — moteur, direction, came, le piège du vélo, la question finale.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, text, FONTS, shade } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rue } from '../sets/rue.js';
import { atelier } from '../sets/atelier.js';
import { ELEVE } from '../cast.js';
import { C, arrow, arcArrow, gear, rack, label, pop, glow, circle, ring, seg, rr, poly, alpha } from '../sets/mech.js';
import { chapter, egg, eggR } from './01_intro.js';

// --- moteur : bielle-manivelle (vue en coupe) ---
function engine(g, t, o) {
  const c = C(), cx = o.cx, cy = o.cy, R = 90, L = 250, a = o.angle;
  const pin = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
  const py = cy - (R * Math.cos(a) + Math.sqrt(L * L - (R * Math.sin(a)) ** 2));
  const top = cy - (L + R) - 120;
  // cylindre
  seg(g, [[cx - 95, top], [cx - 95, cy - L + R + 40]], 6, c.line); seg(g, [[cx + 95, top], [cx + 95, cy - L + R + 40]], 6, c.line); seg(g, [[cx - 110, top], [cx + 110, top]], 6, c.line);
  // explosion quand le piston est en haut
  const boom = Math.pow(Math.max(0, Math.cos(a)), 12);
  if (o.boom && boom > 0.05) { glow(g, cx, top + 50, 200 * boom + 60, '#ff8a3d', 0.9 * boom); glow(g, cx, top + 50, 80, '#fff1c0', boom); }
  // piston
  rr(g, cx - 85, py - 80, 170, 100, 10); g.fillStyle = alpha(c.gold, 0.18); g.fill(); g.strokeStyle = o.hl === 'piston' ? c.gold : c.line; g.lineWidth = 6; g.stroke();
  // bielle
  seg(g, [[cx, py - 20], pin], 22, o.hl === 'bielle' ? c.gold : c.line); seg(g, [[cx, py - 20], pin], 10, '#0b1a14');
  circle(g, cx, py - 20, 12, c.cream);
  // manivelle / vilebrequin
  ring(g, cx, cy, R + 40, 6, o.hl === 'manivelle' ? c.gold : c.line); seg(g, [[cx, cy], pin], 14, o.hl === 'manivelle' ? c.gold : c.line);
  circle(g, cx, cy, 16, c.cream); circle(g, pin[0], pin[1], 12, c.cream);
  return { py, pin, top };
}
registerShot('s08', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tE = (wordTime('explosion', g0) ?? g0 + 1) - g0, tB = (wordTime('bielle', g0) ?? g0 + 2.6) - g0;
  const a = Math.max(0, t - 0.2) * 2.2;
  const hl = t < tB - 0.1 ? 'piston' : 'bielle';
  const z = 1 + 0.05 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const r = engine(g, t, { cx: E.W * 0.42, cy: E.H * 0.8, angle: a, boom: true, hl });
  g.restore();
  UI.callout(g, t, { at: [E.W * 0.42 + 90, r.py - 30], to: [E.W * 0.62, E.H * 0.33], str: 'PISTON', start: tE - 0.1, color: c.gold });
  UI.callout(g, t, { at: [(E.W * 0.42 + r.pin[0]) / 2 + 10, (r.py + r.pin[1]) / 2], to: [E.W * 0.66, E.H * 0.55], str: 'BIELLE', start: tB - 0.1, color: c.gold });
  label(g, 'MOTEUR À COMBUSTION', E.W * 0.12, E.H * 0.12, c.cream, 36, ease.out(prog(t, 0.1, 0.5)), 'left');
} });
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tV = (wordTime('vilebrequin', g0) ?? g0 + 1.2) - g0;
  const a = (t + 3.8) * 2.2;
  engine(g, t, { cx: E.W * 0.42, cy: E.H * 0.8, angle: a, boom: true, hl: 'manivelle' });
  arcArrow(g, E.W * 0.42, E.H * 0.8, 175, -2.6, 0.2, 8, c.gold, 26);
  UI.callout(g, t, { at: [E.W * 0.42 + 130, E.H * 0.8], to: [E.W * 0.66, E.H * 0.62], str: 'MANIVELLE → VILEBREQUIN', start: Math.max(0.1, tV - 0.6), color: c.gold });
  label(g, 'TRANSLATION → ROTATION', E.W * 0.5, E.H * 0.12, c.cream, 44, ease.out(prog(t, 0.2, 0.6)));
} });

registerShot('s10', { draw(g, t, info) { chapter(g, t, info, 3, 'PIGNON ET CRÉMAILLÈRE', POSES.think, 'thinking'); } });

// s11 — direction : vue de dessus
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tP = (wordTime('pignon', g0) ?? g0 + 1) - g0, tC = (wordTime('crémaillère', g0) ?? g0 + 2) - g0, tR = (wordTime('roues', g0) ?? g0 + 3.4) - g0;
  const steer = Math.sin(Math.max(0, t - 0.3) * 1.6);              // -1..1
  const cx = E.W / 2, ay = E.H * 0.33, pr = 54, pinRot = steer * 1.6;
  const shift = -pinRot * pr;                                       // la crémaillère avance de r × angle
  // carrosserie vue de dessus
  rr(g, cx - 330, ay - 150, 660, 760, 120); g.strokeStyle = alpha(c.line, 0.35); g.lineWidth = 4; g.stroke();
  // volant + colonne
  const wy = E.H * 0.82;
  ring(g, cx, wy, 80, 10, t > 0.1 ? c.gold : c.line);
  for (let k = 0; k < 3; k++) { const a = steer * 1.6 + k * 2.094 - Math.PI / 2; seg(g, [[cx, wy], [cx + Math.cos(a) * 78, wy + Math.sin(a) * 78]], 8, c.gold); }
  seg(g, [[cx, wy - 80], [cx, ay + pr + 10]], 8, alpha(c.line, 0.8));
  label(g, 'VOLANT', cx + 120, wy + 10, c.gold, 34, 1, 'left');
  // crémaillère + pignon
  rack(g, cx - 260 + shift, ay - pr - 30, 520, 30, 30, shift, t > tC - 0.1 ? c.gold : c.line, false, 5);
  gear(g, cx, ay, pr, 10, pinRot, t > tP - 0.1 ? c.gold : c.line, 5);
  // biellettes et roues avant qui pivotent
  const wa = -shift / 260;
  for (const side of [-1, 1]) {
    const rx = cx + side * 260 + shift, hub = [cx + side * 360, ay - pr - 15];
    seg(g, [[rx, ay - pr - 15], [hub[0] - side * 40, hub[1] + 30]], 6, c.line);
    g.save(); g.translate(hub[0], hub[1]); g.rotate(wa); rr(g, -30, -75, 60, 150, 14); g.fillStyle = alpha(t > tR - 0.2 ? c.gold : c.line, 0.25); g.fill(); g.strokeStyle = t > tR - 0.2 ? c.gold : c.line; g.lineWidth = 5; g.stroke(); g.restore();
  }
  UI.callout(g, t, { at: [cx + 30, ay + 30], to: [cx + 200, ay + 190], str: 'PIGNON', start: tP - 0.1, color: c.gold });
  UI.callout(g, t, { at: [cx - 160 + shift, ay - pr - 40], to: [cx - 330, ay - 240], str: 'CRÉMAILLÈRE', start: tC - 0.1, color: c.gold });
  label(g, 'DIRECTION D’AUTOMOBILE', E.W * 0.05, E.H * 0.09, c.cream, 34, ease.out(prog(t, 0.1, 0.5)), 'left');
} });

registerShot('s12', { draw(g, t, info) { chapter(g, t, info, 4, 'CAME ET TIGE GUIDÉE', POSES.explain, 'joy'); } });

// s13 — came en forme d'œuf, tige guidée, aiguille de machine à coudre
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tO = (wordTime('œuf', g0) ?? g0 + 2) - g0;
  const cx = E.W * 0.42, cy = E.H * 0.72, r = 110, rot = t * 2.6;
  const lift = eggR(-Math.PI / 2 - rot, r);
  egg(g, cx, cy, r, rot, t > tO - 0.2 ? c.gold : c.line, 6);
  // tige guidée (deux guides)
  const ty = cy - lift;
  seg(g, [[cx - 40, E.H * 0.2], [cx - 40, E.H * 0.42]], 6, alpha(c.line, 0.8)); seg(g, [[cx + 40, E.H * 0.2], [cx + 40, E.H * 0.42]], 6, alpha(c.line, 0.8));
  rr(g, cx - 22, ty - 380, 44, 380, 8); g.fillStyle = alpha(c.gold, 0.2); g.fill(); g.strokeStyle = c.gold; g.lineWidth = 6; g.stroke();
  circle(g, cx, ty, 16, c.cream);
  arrow(g, [[cx + 120, E.H * 0.36], [cx + 120, E.H * 0.2]], 7, c.cream, 24); arrow(g, [[cx + 120, E.H * 0.26], [cx + 120, E.H * 0.42]], 7, c.cream, 24);
  // aiguille de la machine à coudre (à droite) qui suit la tige
  const nx = E.W * 0.74, ny = E.H * 0.28 + (r * 1.2 - lift) * 0.9;
  g.strokeStyle = alpha(c.line, 0.6); g.lineWidth = 5; g.beginPath(); g.moveTo(nx - 260, E.H * 0.18); g.lineTo(nx + 140, E.H * 0.18); g.lineTo(nx + 140, E.H * 0.7); g.lineTo(nx - 260, E.H * 0.7); g.stroke();
  seg(g, [[nx, ny], [nx, ny + 150]], 6, c.gold); poly(g, [[nx - 5, ny + 150], [nx + 5, ny + 150], [nx, ny + 180]], c.gold);
  seg(g, [[nx - 220, E.H * 0.6], [nx + 100, E.H * 0.6]], 4, alpha(c.cream, 0.7));
  label(g, 'MACHINE À COUDRE', nx - 60, E.H * 0.8, c.cream, 34, ease.out(prog(t, 0.4, 0.8)));
  UI.callout(g, t, { at: [cx + r * 0.8, cy + 30], to: [cx + 270, cy + 120], str: 'CAME EN ŒUF', start: tO - 0.2, color: c.gold });
  label(g, 'ROTATION → TRANSLATION ALTERNATIVE', E.W * 0.05, E.H * 0.09, c.cream, 34, ease.out(prog(t, 0.1, 0.5)), 'left');
} });

// --- vélo ---
function bike(g, x, GY, t, M) {
  const ink = '#0d0b12', w1 = [x - 120, GY - 70], w2 = [x + 130, GY - 70], cr = [x, GY - 70], rot = t * 6;
  for (const [wx, wy] of [w1, w2]) { ring(g, wx, wy, 68, 8, ink); for (let k = 0; k < 6; k++) { const a = rot + k * Math.PI / 3; seg(g, [[wx, wy], [wx + Math.cos(a) * 64, wy + Math.sin(a) * 64]], 2, alpha(M.rim, 0.5)); } }
  seg(g, [w1, [x - 20, GY - 170], cr, w1], 9, ink); seg(g, [[x - 20, GY - 170], [x + 110, GY - 170], w2], 9, ink); seg(g, [[x + 110, GY - 170], cr], 9, ink);
  seg(g, [[x - 40, GY - 185], [x + 5, GY - 185]], 12, ink); seg(g, [[x + 110, GY - 170], [x + 100, GY - 215], [x + 135, GY - 220]], 8, ink);
  ring(g, cr[0], cr[1], 22, 6, ink); const pa = rot * 0.7; seg(g, [[cr[0] - Math.cos(pa) * 40, cr[1] - Math.sin(pa) * 40], [cr[0] + Math.cos(pa) * 40, cr[1] + Math.sin(pa) * 40]], 7, ink);
  return { cr, pa };
}
registerShot('s14', { draw(g, t, info) {
  const cam = { z: 1.05, x: -t * 120 };
  const { GY, M } = rue(g, t, cam, { mood: 'golden' });
  const x = E.W * 0.45, SC = 1.6;
  g.save(); g.translate(x, GY + 40); g.scale(SC, SC); g.translate(-x, -(GY + 40));
  const { cr, pa } = bike(g, x, GY + 40, t, M);
  // cycliste : jambes sur les pédales
  const hip = [x - 20, GY + 40 - 215];
  drawFigure(g, { x: hip[0] + 10, y: hip[1] + 200, s: 1.1, facing: 1, outfit: ELEVE, pose: breathe(POSES.sit, t), expr: t > 1.2 ? 'surprised' : 'happy', rim: { color: M.rim, dir: [1, -0.4] }, shadow: false });
  bike(g, x, GY + 40, t, M);
  g.restore();
  const crS = [x + (cr[0] - x) * SC, GY + 40 + (cr[1] - GY - 40) * SC];
  const a = ease.outBack(prog(t, 0.5, 0.9));
  if (a > 0) { g.save(); g.translate(E.W * 0.78, E.H * 0.24); g.scale(a, a); rr(g, -190, -60, 380, 120, 60); g.fillStyle = S().ui.accent; g.fill(); text(g, 'ATTENTION!', 0, 4, { size: 54, color: '#1a0a06', font: FONTS.title, weight: 700, spacing: 2 }); g.restore(); }
  UI.callout(g, t, { at: crS, to: [crS[0] - 360, crS[1] - 360], str: 'PÉDALIER', start: 1.4, color: S().ui.gold });
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.3 });
} });

// s15 — « La rotation reste une rotation : c'est une transmission. »
registerShot('s15', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tT = (wordTime('transmission', g0) ?? g0 + 2.4) - g0;
  const p1 = [E.W * 0.3, E.H * 0.5], p2 = [E.W * 0.68, E.H * 0.5], r1 = 120, r2 = 60, rot = t * 1.5;
  gear(g, ...p1, r1, 20, rot, c.gold, 5); gear(g, ...p2, r2, 10, rot * r1 / r2, c.gold, 5);
  // chaîne
  seg(g, [[p1[0], p1[1] - r1 - 14], [p2[0], p2[1] - r2 - 14]], 4, alpha(c.cream, 0.8)); seg(g, [[p1[0], p1[1] + r1 + 14], [p2[0], p2[1] + r2 + 14]], 4, alpha(c.cream, 0.8));
  for (let k = 0; k < 14; k++) { const f = ((k / 14) + t * 0.25) % 1; circle(g, lerp(p1[0], p2[0], f), lerp(p1[1] - r1 - 14, p2[1] - r2 - 14, f), 6, c.cream); }
  arcArrow(g, ...p1, r1 + 70, -2.6, -1.2, 7, c.gold, 24); arcArrow(g, ...p2, r2 + 60, -2.6, -1.0, 7, c.gold, 24);
  label(g, 'ROTATION', p1[0], p1[1] + r1 + 110, c.gold, 40); label(g, 'ROTATION', p2[0], p2[1] + r2 + 160, c.gold, 40);
  const a = ease.out(prog(t, 0.6, 1.0));
  if (a > 0) { label(g, 'TRANSFORMATION', E.W / 2, E.H * 0.13, alpha(c.red, 0.9), 48, a); const w = 230 * ease.out(prog(t, 1.0, 1.4)); seg(g, [[E.W / 2 - w, E.H * 0.13], [E.W / 2 + w, E.H * 0.13]], 8, c.red); }
  const b = ease.outBack(prog(t, tT - 0.15, tT + 0.25));
  if (b > 0) { g.save(); g.translate(E.W / 2, E.H * 0.24); g.scale(b, b); text(g, 'TRANSMISSION', 0, 0, { size: 76, color: c.gold, font: FONTS.title, weight: 700, spacing: 4, glow: 26, glowColor: alpha(c.gold, 0.6) }); g.restore(); }
} });

// s16 — « Et toi, autour de toi, quel objet transforme le mouvement? »
registerShot('s16', { draw(g, t, info) {
  blurLayer(g, 14, (g) => atelier(g, t, { z: 1.5, x: 120, y: -140 })); veil(g, '#120a10', 0.4);
  const M = mood('interiorWarm'), r = 300 * (1 + 0.04 * t);
  bigFace(g, E.W * 0.68, E.H * 0.7, r, { outfit: ELEVE, expr: t < 1.5 ? 'smile' : 'thinking', look: [-0.6, -0.3], rimColor: M.rim, rimSide: 1, blink: (t % 3) > 2.88 });
  const a = ease.out(prog(t, 0.3, 0.9)), ui = S().ui;
  text(g, 'Et toi, autour de toi,', E.W * 0.3, E.H * 0.36, { size: 58, font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: a });
  text(g, 'quel objet transforme', E.W * 0.3, E.H * 0.46, { size: 58, font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: a });
  text(g, 'le mouvement?', E.W * 0.3, E.H * 0.56, { size: 72, font: FONTS.serif, weight: 900, italic: true, color: ui.gold, alpha: ease.out(prog(t, 0.8, 1.4)), glow: 20, glowColor: alpha(ui.gold, 0.5) });
  FX.dust(g, t, { count: 30 });
} });
