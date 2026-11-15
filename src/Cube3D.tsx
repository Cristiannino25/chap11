import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Cube3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rotation = interpolate(frame, [0, 150], [0, Math.PI * 2]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <mesh rotation={[rotation * 0.5, rotation, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4f8cff" />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
