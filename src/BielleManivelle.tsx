import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadBody } from "@remotion/google-fonts/AtkinsonHyperlegible";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Couleurs reprises du site « Humain et technique »
const C = {
  bg: "#EDF2F3",
  ink: "#0F2330",
  muted: "#4F6370",
  ocean: "#0F2B3A",
  onOcean: "#EAF4F6",
  accent: "#0A8571",
  amber: "#B8690C",
  violet: "#6B4DC0",
  steel: "#8FA3AD",
  line: "#D2DDE2",
};

const { fontFamily: display } = loadDisplay("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: body } = loadBody("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] });

// Géométrie du mécanisme
const R = 1.1; // rayon de la manivelle
const L = 3.0; // longueur de la bielle
const START = 45; // le mécanisme démarre
const OMEGA = (2 * Math.PI) / 75; // 1 tour en 2,5 s à pleine vitesse

// Angle de la manivelle : on intègre une vitesse qui accélère doucement
const crankAngle = (frame: number) => {
  let a = 0;
  for (let f = START; f < frame; f++) {
    a += OMEGA * interpolate(f, [START, START + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  }
  return a;
};

const pistonY = (a: number) => R * Math.cos(a) + Math.sqrt(L * L - (R * Math.sin(a)) ** 2);
const Y_MIN = L - R;
const Y_MAX = L + R;

const CameraRig: React.FC = () => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(5.5, 3.2, 14.5);
    camera.lookAt(0, 2.3, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

const Mechanism: React.FC<{ angle: number; highlight: string | null }> = ({ angle, highlight }) => {
  const pin = new THREE.Vector3(R * Math.sin(angle), R * Math.cos(angle), 0.35);
  const yp = pistonY(angle);
  const top = new THREE.Vector3(0, yp, 0.35);
  const d = top.clone().sub(pin);
  const mid = pin.clone().add(top).multiplyScalar(0.5);
  const rodAngle = Math.atan2(-d.x, d.y);

  const glow = (name: string) => (highlight === name ? 0.35 : 0);

  return (
    <group position={[0, 0, 0]}>
      {/* Manivelle : disque qui tourne autour de son axe */}
      <group rotation={[0, 0, -angle]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R + 0.3, R + 0.3, 0.4, 64]} />
          <meshStandardMaterial color={C.amber} emissive={C.amber} emissiveIntensity={glow("manivelle")} metalness={0.3} roughness={0.45} />
        </mesh>
        {/* repère pour bien voir la rotation */}
        <mesh position={[0, R / 2, 0.21]}>
          <boxGeometry args={[0.22, R, 0.04]} />
          <meshStandardMaterial color="#F8EAD5" />
        </mesh>
      </group>
      {/* Axe (vilebrequin) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.6, 32]} />
        <meshStandardMaterial color={C.steel} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Maneton : liaison manivelle-bielle */}
      <mesh position={pin} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.5, 24]} />
        <meshStandardMaterial color={C.steel} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Bielle */}
      <mesh position={mid} rotation={[0, 0, rodAngle]}>
        <boxGeometry args={[0.28, L, 0.18]} />
        <meshStandardMaterial color={C.violet} emissive={C.violet} emissiveIntensity={glow("bielle")} metalness={0.25} roughness={0.4} />
      </mesh>
      {/* Piston */}
      <mesh position={[0, yp + 0.25, 0.35]}>
        <cylinderGeometry args={[0.62, 0.62, 0.9, 48]} />
        <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={glow("piston")} metalness={0.3} roughness={0.35} />
      </mesh>
      {/* Cylindre transparent : guidage en translation */}
      <mesh position={[0, (Y_MIN + Y_MAX) / 2 + 0.3, 0.35]}>
        <cylinderGeometry args={[0.7, 0.7, Y_MAX - Y_MIN + 0.9, 48, 1, true]} />
        <meshStandardMaterial color="#9FC7D3" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Socle */}
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[5, 0.2, 2.4]} />
        <meshStandardMaterial color="#C9D6DB" roughness={0.9} />
      </mesh>
    </group>
  );
};

const fadeIn = (frame: number, at: number, dur = 12) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

const fadeWindow = (frame: number, from: number, to: number) =>
  Math.min(fadeIn(frame, from), 1 - fadeIn(frame, to - 10, 10));

const Legend: React.FC<{ frame: number }> = ({ frame }) => {
  const items = [
    { at: 70, color: C.amber, name: "Manivelle", role: "tourne : rotation" },
    { at: 100, color: C.violet, name: "Bielle", role: "relie les deux pièces" },
    { at: 130, color: C.accent, name: "Piston", role: "monte et descend : translation" },
  ];
  return (
    <div style={{ position: "absolute", left: 90, top: 250, display: "flex", flexDirection: "column", gap: 26 }}>
      {items.map((it) => {
        const o = fadeIn(frame, it.at);
        return (
          <div key={it.name} style={{ opacity: o, transform: `translateX(${(1 - o) * -30}px)`, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: it.color }} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: C.ink }}>{it.name}</div>
              <div style={{ fontFamily: body, fontSize: 28, color: C.muted }}>{it.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Jauge de position du piston, à droite
const Gauge: React.FC<{ frame: number; y: number }> = ({ frame, y }) => {
  const o = fadeIn(frame, 160);
  const t = (y - Y_MIN) / (Y_MAX - Y_MIN);
  const H = 380;
  return (
    <div style={{ position: "absolute", right: 120, top: 250, opacity: o, display: "flex", gap: 26, alignItems: "center" }}>
      <div style={{ position: "relative", width: 22, height: H, borderRadius: 11, background: C.line }}>
        <div style={{ position: "absolute", left: -9, top: (1 - t) * (H - 40), width: 40, height: 40, borderRadius: 20, background: C.accent, boxShadow: "0 4px 12px rgba(10,133,113,.35)" }} />
      </div>
      <div style={{ fontFamily: body, color: C.muted, fontSize: 26, display: "flex", flexDirection: "column", justifyContent: "space-between", height: H }}>
        <span>haut</span>
        <span style={{ fontFamily: display, fontWeight: 700, color: C.ink, fontSize: 28, lineHeight: 1.3 }}>
          va-et-
          <br />
          vient
        </span>
        <span>bas</span>
      </div>
    </div>
  );
};

const Caption: React.FC<{ frame: number; from: number; to: number; children: React.ReactNode }> = ({ frame, from, to, children }) => {
  const o = fadeWindow(frame, from, to);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
      <div style={{ background: C.ocean, color: C.onOcean, fontFamily: body, fontSize: 38, padding: "22px 40px", borderRadius: 20, maxWidth: 1400, textAlign: "center", lineHeight: 1.35 }}>
        {children}
      </div>
    </div>
  );
};

export const BielleManivelle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const angle = crankAngle(frame);
  const y = pistonY(angle);

  const highlight = frame >= 70 && frame < 100 ? "manivelle" : frame >= 100 && frame < 130 ? "bielle" : frame >= 130 && frame < 160 ? "piston" : null;

  const titleO = fadeIn(frame, 0, 18);
  const sceneO = fadeIn(frame, 10, 25);
  const endStart = durationInFrames - 90;
  const endO = fadeIn(frame, endStart, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: sceneO }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 42 }}>
          <CameraRig />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 6]} intensity={1.6} />
          <directionalLight position={[-6, 2, -4]} intensity={0.4} />
          <Mechanism angle={angle} highlight={highlight} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* En-tête */}
      <div style={{ position: "absolute", left: 90, top: 70, opacity: titleO }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 26, color: C.accent, letterSpacing: 2, textTransform: "uppercase" }}>
          La transformation du mouvement · Cahier p. 22
        </div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 68, color: C.ink, marginTop: 8 }}>Système bielle-manivelle</div>
      </div>

      <Legend frame={frame} />
      <Gauge frame={frame} y={y} />

      <Caption frame={frame} from={40} to={160}>
        Quelle pièce tourne? Laquelle se déplace en ligne droite?
      </Caption>
      <Caption frame={frame} from={165} to={endStart}>
        <b>Rotation → translation alternative (va-et-vient)</b>, ou l’inverse
      </Caption>

      {/* Conclusion */}
      {endO > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center", opacity: endO, transform: `translateY(${(1 - endO) * 16}px)` }}>
          <div style={{ background: C.ocean, color: C.onOcean, borderRadius: 20, padding: "26px 44px", maxWidth: 1500, fontFamily: body, fontSize: 34, lineHeight: 1.4 }}>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 36, color: "#7FD8C6", marginBottom: 8 }}>Exemple : moteur à combustion</div>
            Dans un moteur, l’explosion repousse le piston, la bielle descend et la manivelle fait tourner le vilebrequin.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
