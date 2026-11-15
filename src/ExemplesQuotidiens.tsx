import { Easing, interpolate, useCurrentFrame } from "remotion";

type Colors = { ink: string; muted: string; accent: string; amber: string; violet: string; line: string; ocean: string; onOcean: string };

const OMEGA = (2 * Math.PI) / 45; // un cycle toutes les 1,5 s

// Position d'un piston de bielle-manivelle (0 = bas, 1 = haut) et angle de la manivelle
const cycle = (frame: number) => {
  const a = frame * OMEGA;
  const r = 1;
  const l = 3;
  const y = r * Math.cos(a) + Math.sqrt(l * l - (r * Math.sin(a)) ** 2);
  return { a, t: (y - (l - r)) / (2 * r) };
};

const STROKE = "#2C3E46";

const Moteur: React.FC<{ frame: number; c: Colors }> = ({ frame, c }) => {
  const { a, t } = cycle(frame);
  const cx = 120, cy = 128, r = 14;
  const px = cx + r * Math.sin(a), py = cy - r * Math.cos(a);
  const top = 62 + (1 - t) * 28;
  return (
    <svg viewBox="0 0 240 170" width="100%" height="100%">
      {/* bloc moteur */}
      <rect x="78" y="40" width="84" height="120" rx="10" fill="#E6EDEA" stroke={STROKE} strokeWidth="3" />
      <rect x="98" y="48" width="44" height="78" fill="#CFE6EC" stroke={STROKE} strokeWidth="2" />
      {/* étincelle */}
      <path d="M120 30 l-6 10 h8 l-6 10" fill="none" stroke={c.amber} strokeWidth="3" strokeLinecap="round" opacity={t > 0.85 ? 1 : 0.25} />
      {/* piston */}
      <rect x="101" y={top} width="38" height="18" rx="3" fill={c.accent} stroke={STROKE} strokeWidth="2" />
      {/* bielle */}
      <line x1="120" y1={top + 16} x2={px} y2={py} stroke={c.violet} strokeWidth="7" strokeLinecap="round" />
      {/* vilebrequin */}
      <circle cx={cx} cy={cy} r="20" fill={c.amber} stroke={STROKE} strokeWidth="2" />
      <circle cx={px} cy={py} r="4" fill={STROKE} />
      <circle cx={cx} cy={cy} r="4" fill="#fff" />
    </svg>
  );
};

const ScieSauteuse: React.FC<{ frame: number; c: Colors }> = ({ frame, c }) => {
  const { t } = cycle(frame);
  const dy = (1 - t) * 16;
  return (
    <svg viewBox="0 0 240 170" width="100%" height="100%">
      {/* planche */}
      <rect x="20" y="118" width="200" height="16" fill="#D9CBB0" stroke={STROKE} strokeWidth="2" />
      {/* lame (bouge) */}
      <g transform={`translate(0 ${dy})`}>
        <rect x="113" y="88" width="10" height="52" fill="#B7C4CA" stroke={STROKE} strokeWidth="2" />
        <path d="M113 96 l-5 4 l5 4 l-5 4 l5 4 l-5 4 l5 4 l-5 4 l5 4" fill="none" stroke={STROKE} strokeWidth="1.5" />
      </g>
      {/* corps de la scie */}
      <path d="M60 104 h120 v-34 a10 10 0 0 0 -10 -10 h-30 c-10 -26 -60 -26 -64 0 h-6 a10 10 0 0 0 -10 10 z" fill={c.accent} stroke={STROKE} strokeWidth="3" />
      <path d="M86 60 c4 -14 36 -14 40 0" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" />
      <rect x="52" y="100" width="136" height="10" rx="3" fill="#8FA3AD" stroke={STROKE} strokeWidth="2" />
      {/* flèche va-et-vient */}
      <path d="M150 124 v24 M144 130 l6 -7 l6 7 M144 142 l6 7 l6 -7" fill="none" stroke={c.amber} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Compresseur: React.FC<{ frame: number; c: Colors }> = ({ frame, c }) => {
  const { a, t } = cycle(frame);
  const cx = 70, cy = 128, r = 12;
  const px = cx + r * Math.sin(a), py = cy - r * Math.cos(a);
  const top = 50 + (1 - t) * 24;
  return (
    <svg viewBox="0 0 240 170" width="100%" height="100%">
      {/* réservoir */}
      <rect x="110" y="70" width="110" height="70" rx="35" fill="#CFE6EC" stroke={STROKE} strokeWidth="3" />
      <circle cx="140" cy="150" r="10" fill="#8FA3AD" stroke={STROKE} strokeWidth="2" />
      <circle cx="195" cy="150" r="10" fill="#8FA3AD" stroke={STROKE} strokeWidth="2" />
      {/* manomètre */}
      <circle cx="165" cy="58" r="12" fill="#fff" stroke={STROKE} strokeWidth="2" />
      <line x1="165" y1="58" x2={165 + 8 * Math.sin(-1 + t * 1.2)} y2={58 - 8 * Math.cos(-1 + t * 1.2)} stroke={c.amber} strokeWidth="2.5" strokeLinecap="round" />
      {/* tuyau */}
      <path d="M92 52 h20 v20" fill="none" stroke={STROKE} strokeWidth="4" />
      {/* cylindre de pompe */}
      <rect x="50" y="34" width="40" height="78" fill="#E6EDEA" stroke={STROKE} strokeWidth="2" />
      <rect x="53" y={top} width="34" height="16" rx="3" fill={c.accent} stroke={STROKE} strokeWidth="2" />
      <line x1={70} y1={top + 14} x2={px} y2={py} stroke={c.violet} strokeWidth="6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="18" fill={c.amber} stroke={STROKE} strokeWidth="2" />
      <circle cx={px} cy={py} r="4" fill={STROKE} />
      <circle cx={cx} cy={cy} r="4" fill="#fff" />
    </svg>
  );
};

const Locomotive: React.FC<{ frame: number; c: Colors }> = ({ frame, c }) => {
  const a = frame * OMEGA;
  const wx = 150, wy = 132, wr = 26, cr = 16;
  const px = wx + cr * Math.cos(a), py = wy + cr * Math.sin(a);
  // tige du piston qui glisse à l'horizontale
  const L = 70;
  const sx = px - Math.sqrt(L * L - (py - wy) ** 2);
  return (
    <svg viewBox="0 0 240 170" width="100%" height="100%">
      {/* corps */}
      <rect x="30" y="70" width="150" height="40" rx="8" fill={c.ocean} stroke={STROKE} strokeWidth="3" />
      <rect x="150" y="36" width="60" height="74" rx="6" fill={c.ocean} stroke={STROKE} strokeWidth="3" />
      <rect x="162" y="46" width="36" height="22" rx="3" fill="#CFE6EC" />
      <rect x="50" y="44" width="18" height="26" fill={c.ocean} stroke={STROKE} strokeWidth="3" />
      {/* vapeur */}
      <circle cx={59 + ((frame * 0.6) % 20)} cy={34 - ((frame * 0.5) % 16)} r="7" fill="#fff" stroke={c.line} strokeWidth="2" opacity="0.9" />
      {/* cylindre à vapeur */}
      <rect x="28" y="114" width="44" height="22" rx="3" fill="#8FA3AD" stroke={STROKE} strokeWidth="2" />
      {/* roues */}
      <circle cx="90" cy={wy} r={wr} fill="#E6EDEA" stroke={STROKE} strokeWidth="3" />
      <g transform={`rotate(${(a * 180) / Math.PI} ${wx} ${wy})`}>
        <circle cx={wx} cy={wy} r={wr} fill={c.amber} stroke={STROKE} strokeWidth="3" />
        <line x1={wx - wr} y1={wy} x2={wx + wr} y2={wy} stroke={STROKE} strokeWidth="2" />
        <line x1={wx} y1={wy - wr} x2={wx} y2={wy + wr} stroke={STROKE} strokeWidth="2" />
      </g>
      {/* tige de piston + bielle */}
      <line x1={50} y1={wy - 7} x2={sx} y2={wy - 7} stroke={c.accent} strokeWidth="6" strokeLinecap="round" />
      <line x1={sx} y1={wy - 7} x2={px} y2={py} stroke={c.violet} strokeWidth="6" strokeLinecap="round" />
      <circle cx={px} cy={py} r="4.5" fill={STROKE} />
      <line x1="10" y1="160" x2="230" y2="160" stroke={STROKE} strokeWidth="3" />
    </svg>
  );
};

const EXEMPLES = [
  { Illu: ScieSauteuse, nom: "Scie sauteuse", sens: "Rotation → translation", texte: "Le moteur tourne; la lame monte et descend pour couper le bois." },
  { Illu: Compresseur, nom: "Compresseur d’air", sens: "Rotation → translation", texte: "Le moteur tourne; le piston pompe l’air dans le réservoir." },
  { Illu: Moteur, nom: "Moteur d’auto", sens: "Translation → rotation", texte: "L’explosion pousse le piston; le vilebrequin se met à tourner." },
  { Illu: Locomotive, nom: "Locomotive à vapeur", sens: "Translation → rotation", texte: "La vapeur pousse le piston; la bielle fait tourner les roues." },
];

export const ExemplesQuotidiens: React.FC<{ c: Colors; display: string; body: string }> = ({ c, display, body }) => {
  const frame = useCurrentFrame();
  const appear = (at: number) =>
    interpolate(frame, [at, at + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 90, top: 70, opacity: appear(0) }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 26, color: c.accent, letterSpacing: 2, textTransform: "uppercase" }}>
          Système bielle-manivelle
        </div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 68, color: c.ink, marginTop: 8 }}>Dans la vie courante</div>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 270, display: "flex", gap: 30 }}>
        {EXEMPLES.map(({ Illu, nom, sens, texte }, i) => {
          const o = appear(20 + i * 30);
          const inverse = sens.startsWith("Translation");
          return (
            <div
              key={nom}
              style={{
                flex: 1,
                opacity: o,
                transform: `translateY(${(1 - o) * 40}px)`,
                background: "#FFFFFF",
                borderRadius: 20,
                boxShadow: "0 2px 4px rgba(15,35,48,.06), 0 12px 32px rgba(15,35,48,.10)",
                padding: "24px 26px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ height: 240, background: "#F3F7F8", borderRadius: 14, padding: 10 }}>
                <Illu frame={frame} c={c} />
              </div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, lineHeight: 1.18, minHeight: 72, display: "flex", alignItems: "flex-end", color: c.ink, marginTop: 6 }}>{nom}</div>
              <div
                style={{
                  alignSelf: "flex-start",
                  fontFamily: body,
                  fontWeight: 700,
                  fontSize: 22,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: inverse ? "#ECE6FA" : "#DDF1EC",
                  color: inverse ? c.violet : c.accent,
                }}
              >
                {sens}
              </div>
              <div style={{ fontFamily: body, fontSize: 26, color: c.muted, lineHeight: 1.35 }}>{texte}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          display: "flex",
          justifyContent: "center",
          opacity: appear(170),
        }}
      >
        <div style={{ background: c.ocean, color: c.onOcean, fontFamily: body, fontSize: 36, padding: "20px 40px", borderRadius: 20 }}>
          Le même système fonctionne <b>dans les deux sens</b> : rotation ↔ translation.
        </div>
      </div>
    </div>
  );
};
