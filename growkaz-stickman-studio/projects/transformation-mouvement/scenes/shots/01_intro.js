// shots/01_intro.js — le volant (accroche), le titre, rotation ↔ translation, les 4 systèmes, vis-écrou.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, wordTime, text, FONTS, linGrad, shade } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rue } from '../sets/rue.js';
import { atelier } from '../sets/atelier.js';
import { ELEVE } from '../cast.js';
import { C, arrow, arcArrow, gear, rack, label, pop, glow, circle, ring, seg, rr, poly, alpha } from '../sets/mech.js';

// voiture vue de côté, l'élève au volant
function car(g, x, GY, t, M, steer) {
  const ink = '#0d0b12', body = shade(M.wall, -0.45);
  g.fillStyle = body; g.beginPath();
  g.moveTo(x - 300, GY - 50); g.lineTo(x - 300, GY - 160); g.quadraticCurveTo(x - 290, GY - 185, x - 230, GY - 190);
  g.lineTo(x - 160, GY - 190); g.lineTo(x - 80, GY - 330); g.lineTo(x + 170, GY - 330); g.lineTo(x + 270, GY - 200); g.lineTo(x + 400, GY - 180);
  g.quadraticCurveTo(x + 450, GY - 165, x + 450, GY - 120); g.lineTo(x + 450, GY - 50); g.closePath(); g.fill();
  // vitres claires (le ciel derrière) pour voir l'élève en silhouette
  poly(g, [[x - 60, GY - 312], [x + 160, GY - 312], [x + 245, GY - 200], [x - 130, GY - 200]], alpha(M.sky[2] || M.sky[1], 0.85));
  drawFigure(g, { x: x + 30, y: GY - 60, s: 1.15, facing: 1, outfit: ELEVE, pose: breathe({ ...POSES.sit }, t), expr: t > 1.4 ? 'thinking' : 'neutral', rim: { color: M.rim, dir: [1, -0.3] }, shadow: false, blink: (t % 3.1) > 3.0 });
  // volant vu de côté + rayon qui tourne
  g.save(); g.translate(x + 175, GY - 225); g.rotate(-0.35);
  g.strokeStyle = ink; g.lineWidth = 11; g.beginPath(); g.ellipse(0, 0, 14, 50, 0, 0, 7); g.stroke();
  seg(g, [[0, 0], [0, Math.cos(steer) * 44]], 8, ink); g.restore();
  seg(g, [[x + 50, GY - 320], [x + 50, GY - 200]], 12, body);
  g.fillStyle = body; g.fillRect(x - 300, GY - 200, 750, 150);
  seg(g, [[x - 120, GY - 150], [x + 300, GY - 150]], 3, alpha(M.rim, 0.35));
  for (const wx of [x - 180, x + 310]) { circle(g, wx, GY - 45, 64, ink); circle(g, wx, GY - 45, 28, shade(M.wall, 0.1)); }
  glow(g, x + 445, GY - 140, 160, M.practical, 0.55);
}

registerShot('s01', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.06 * ease.inOut(t / info.dur), x: -40 * ease.inOut(t / info.dur) };
  const { GY, M } = rue(g, t, cam, { mood: 'dusk' });
  const steer = Math.sin(t * 2.2) * 1.2;
  layer(g, cam, 1, (g) => car(g, E.W * 0.4, GY + 60, t, M, steer));
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
  UI.callout(g, t, { at: [E.W * 0.4 + 175, GY - 165], to: [E.W * 0.4 + 420, GY - 470], str: 'VOLANT : ROTATION', start: 1.2, color: S().ui.gold });
  if (t > 1.2) arcArrow(g, E.W * 0.4 + 175, GY - 165, 80, -2.2 + Math.sin(t * 2.2) * 0.4, -0.6 + Math.sin(t * 2.2) * 0.4, 6, alpha(S().ui.gold, clamp((t - 1.2) * 2)), 20);
} });

registerShot('s02', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.05 * ease.inOut(t / info.dur), y: -15 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.sun(g, E.W / 2, E.H * 0.62, 90, '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, E.H * 0.62, { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * 0.74, w: E.W + 400, maxH: 300, color: '#2a1f36', windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#16111e'; g.fillRect(-E.W, E.H * 0.74, E.W * 3, E.H); });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
  UI.titleCard(g, t, { lines: ['LA TRANSFORMATION', 'DU MOUVEMENT'], dur: info.dur + 0.4, y: E.H * 0.42 });
} });

// s03 — « Une rotation devient une translation, ou l'inverse. »
registerShot('s03', { draw(g, t, info) {
  UI.blueprint(g); const c = C(), g0 = info.shot.start;
  const tR = (wordTime('rotation', g0) ?? g0 + 0.3) - g0, tT = (wordTime('translation', g0) ?? g0 + 1.4) - g0, tI = (wordTime('inverse', g0) ?? g0 + 2.4) - g0;
  const lx = E.W * 0.27, rx = E.W * 0.73, y = E.H * 0.47;
  // rotation : roue qui tourne
  const a1 = pop(t, tR - 0.1);
  if (a1 > 0) { g.save(); g.translate(lx, y); g.scale(a1, a1); gear(g, 0, 0, 120, 12, t * 1.6, c.gold, 6); arcArrow(g, 0, 0, 185, -2.6, -0.5, 7, c.gold, 24); g.restore(); label(g, 'ROTATION', lx, y + 250, c.gold, 52, clamp(a1)); }
  // translation : bloc qui glisse
  const a2 = pop(t, tT - 0.1);
  if (a2 > 0) {
    const bx = rx - 170 + 120 * (0.5 - 0.5 * Math.cos(t * 2.4));
    seg(g, [[rx - 260, y + 70], [rx + 260, y + 70]], 4, alpha(c.line, 0.7));
    g.save(); g.globalAlpha *= clamp(a2); rr(g, bx, y - 50, 160, 120, 12); g.fillStyle = alpha(c.gold, 0.15); g.fill(); g.strokeStyle = c.gold; g.lineWidth = 6; g.stroke(); g.restore();
    arrow(g, [[rx - 200, y - 120], [rx + 200, y - 120]], 7, alpha(c.gold, clamp(a2)), 26);
    label(g, 'TRANSLATION', rx, y + 250, c.gold, 52, clamp(a2));
  }
  // la flèche de transformation entre les deux, qui devient double (« ou l'inverse »)
  const k = ease.out(prog(t, tT, tT + 0.5));
  if (k > 0) arrow(g, [[E.W / 2 - 110, y], [E.W / 2 - 110 + 220 * k, y]], 8, c.cream, 28);
  const ki = ease.out(prog(t, tI - 0.1, tI + 0.4));
  if (ki > 0) { arrow(g, [[E.W / 2 + 110, y + 50], [E.W / 2 + 110 - 220 * ki, y + 50]], 8, c.cream, 28); label(g, 'OU L’INVERSE', E.W / 2, y + 130, c.cream, 34, ki); }
} });

// petites icônes des 4 systèmes (réutilisées)
export function icon(g, n, x, y, s, t, col) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (n === 0) { // vis-écrou
    rr(g, -14, -70, 28, 140, 6); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
    for (let i = 0; i < 7; i++) { const yy = -60 + ((i * 20 + t * 30) % 140); seg(g, [[-14, yy], [14, yy - 10]], 4, col); }
    rr(g, -42, -10, 84, 34, 6); g.fillStyle = alpha(col, 0.25); g.fill(); g.stroke();
  } else if (n === 1) { // bielle-manivelle
    const a = t * 3, px = Math.sin(a) * 30, py = 40 - Math.cos(a) * 30, ty = 40 - (30 * Math.cos(a) + Math.sqrt(90 * 90 - (30 * Math.sin(a)) ** 2));
    ring(g, 0, 40, 40, 5, col); seg(g, [[px, py], [0, ty]], 7, col); rr(g, -26, ty - 28, 52, 30, 5); g.fillStyle = alpha(col, 0.25); g.fill(); g.strokeStyle = col; g.stroke();
    seg(g, [[-32, -110], [-32, -10]], 4, alpha(col, 0.6)); seg(g, [[32, -110], [32, -10]], 4, alpha(col, 0.6));
  } else if (n === 2) { // pignon-crémaillère
    gear(g, 0, -20, 40, 9, t * 2, col, 5); rack(g, -80, 30, 160, 26, 24, -t * 2 * 40, col, true, 5);
  } else { // came
    const rot = t * 2.5; egg(g, 0, 40, 46, rot, col);
    const lift = eggR(-Math.PI / 2 - rot, 46); rr(g, -10, 40 - lift - 110, 20, 110, 5); g.fillStyle = alpha(col, 0.25); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
  }
  g.restore();
}
export const eggR = (a, r) => r * (0.75 + 0.45 * Math.pow(Math.max(0, Math.cos(a)), 2));
export function egg(g, x, y, r, rot, col, w = 5) {
  g.beginPath(); for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI * 2, rr2 = eggR(a, r); const px = x + Math.cos(a + rot) * rr2, py = y + Math.sin(a + rot) * rr2; i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath(); g.fillStyle = alpha(col, 0.15); g.fill(); g.strokeStyle = col; g.lineWidth = w; g.stroke(); circle(g, x, y, 6, col);
}

// s04 — « Il y a quatre systèmes à connaître. »
registerShot('s04', { draw(g, t, info) {
  UI.blueprint(g); const c = C();
  const names = ['VIS-ÉCROU', 'BIELLE-MANIVELLE', 'PIGNON-CRÉMAILLÈRE', 'CAME-TIGE'];
  text(g, '4 SYSTÈMES', E.W / 2, E.H * 0.17, { size: 70, color: c.gold, font: FONTS.title, weight: 700, spacing: 4, glow: 20, glowColor: alpha(c.gold, 0.5), alpha: ease.out(prog(t, 0, 0.3)) });
  names.forEach((n, i) => {
    const x = E.W * (0.14 + i * 0.24), y = E.H * 0.52, k = pop(t, 0.2 + i * 0.4);
    if (k <= 0) return;
    g.save(); g.translate(x, y); g.scale(k, k); ring(g, 0, 0, 150, 4, alpha(c.line, 0.6)); glow(g, 0, 0, 220, c.gold, 0.12); g.restore();
    icon(g, i, x, y + 5, 0.95 * k, t, c.gold);
    label(g, String(i + 1), x - 120, y - 120, c.cream, 50, clamp(k));
    label(g, n, x, y + 215, c.cream, 32, clamp(k));
  });
} });

// chapitre : l'élève à l'atelier + gros numéro
export function chapter(g, t, info, n, title, pose, expr) {
  const cam = { z: 1.02 + 0.06 * ease.inOut(t / info.dur), x: 30 - 50 * ease.inOut(t / info.dur) };
  const { GY, M } = atelier(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.68, y: GY, s: 1.5, facing: -1, outfit: ELEVE, pose: breathe(posesAt(t, [[0, POSES.stand], [0.35, pose]]), t), expr, rim: { color: M.rim, dir: [0.6, -1] }, blink: (t % 2.9) > 2.8 }));
  blurLayer(g, 10, (g) => { g.fillStyle = 'rgba(40,24,30,.85)'; rr(g, -60, E.H - 260, 380, 320, 40); g.fill(); }, cam, 1.6);
  FX.dust(g, t, { count: 40 });
  const k = ease.outBack(prog(t, 0.05, 0.45)), ui = S().ui;
  g.save(); g.translate(E.W * 0.1, E.H * 0.3); g.scale(k, k);
  text(g, String(n), 0, 0, { size: 200, align: 'left', color: ui.gold, font: FONTS.title, weight: 700, glow: 40, glowColor: 'rgba(255,170,60,.8)' });
  g.restore();
  text(g, title, E.W * 0.06, E.H * 0.3 + 170, { size: 56, align: 'left', color: ui.cream, font: FONTS.title, weight: 700, spacing: 3, glow: 18, glowColor: 'rgba(255,140,60,.6)', alpha: ease.out(prog(t, 0.3, 0.7)) });
}
registerShot('s05', { draw(g, t, info) { chapter(g, t, info, 1, 'VIS ET ÉCROU', POSES.explain, 'smile'); } });

// s06 — « Tu tournes la vis, et le mors du serre en C avance en ligne droite. »
registerShot('s06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => atelier(g, t, { z: 1.6, x: -260, y: -150 })); veil(g, '#120a10', 0.45);
  const M = mood('interiorWarm'), ink = '#0d0b12', rim = M.rim, ui = S().ui;
  const cx = E.W * 0.45, top = E.H * 0.18, bot = E.H * 0.82;
  const turn = ease.inOut(prog(t, 0.5, info.dur - 0.4)), rot = turn * Math.PI * 8, drop = turn * 195;
  const sh = (fn) => { g.save(); g.translate(-5, -4); fn(rim); g.restore(); fn(ink); };
  // planche de bois sur la mâchoire du bas
  rr(g, cx - 210, bot - 150, 420, 60, 6); g.fillStyle = '#b07a46'; g.fill(); g.fillStyle = '#8a5a30'; for (let i = 0; i < 4; i++) g.fillRect(cx - 200 + i * 100, bot - 130, 70, 4);
  // cadre en C
  sh((col) => { g.strokeStyle = col; g.lineWidth = 70; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx - 10, top + 40); g.lineTo(cx + 330, top + 40); g.lineTo(cx + 330, bot - 50); g.lineTo(cx - 60, bot - 50); g.stroke(); });
  // vis filetée : les filets défilent quand elle tourne
  const sx = cx - 10, sTop = top - 60 + drop, sBot = top + 300 + drop;
  rr(g, sx - 26, sTop, 52, sBot - sTop, 8); g.fillStyle = '#8fa3ad'; g.fill();
  g.save(); g.beginPath(); g.rect(sx - 26, sTop, 52, sBot - sTop); g.clip();
  for (let y = sTop - 40 + ((rot * 6) % 26); y < sBot + 26; y += 26) seg(g, [[sx - 28, y + 9], [sx + 28, y - 9]], 6, '#55656e');
  g.restore();
  // poignée en T (largeur apparente = rotation)
  const hw = 150 * Math.cos(rot); sh((col) => seg(g, [[sx - hw, sTop], [sx + hw, sTop]], 26, col)); circle(g, sx, sTop, 22, ink);
  // mors mobile (patin) au bout de la vis
  rr(g, sx - 80, sBot, 160, 40, 10); g.fillStyle = ui.gold; g.fill();
  // flèches et étiquettes
  const a1 = ease.out(prog(t, 0.6, 1.0)), a2 = ease.out(prog(t, 1.8, 2.2));
  if (a1 > 0) { arcArrow(g, sx, sTop, 190, -2.8, -0.4, 8, alpha(ui.gold, a1), 26); text(g, 'ROTATION', sx - 260, sTop - 60, { size: 46, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 2, alpha: a1, align: 'right' }); }
  if (a2 > 0) { arrow(g, [[sx - 190, sBot - 120], [sx - 190, sBot + 20]], 9, alpha(ui.cream, a2), 28); text(g, 'TRANSLATION', sx - 230, sBot - 50, { size: 46, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: a2, align: 'right' }); }
  text(g, 'SERRE EN C', E.W * 0.82, E.H * 0.2, { size: 40, color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
  FX.dust(g, t, { count: 30 });
} });

registerShot('s07', { draw(g, t, info) { chapter(g, t, info, 2, 'BIELLE ET MANIVELLE', POSES.point, 'happy'); } });
