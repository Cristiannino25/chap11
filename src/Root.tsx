import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Cube3D } from "./Cube3D";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="HelloWorld"
      component={HelloWorld}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Cube3D"
      component={Cube3D}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
    </>
  );
};
