import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import useStationStore from '../../hooks/useStationStore';
import useCameraControl from '../../hooks/useCameraControl';

import Station01_Matter       from '../stations/Station01_Matter';
import Station02_Motion       from '../stations/Station02_Motion';
import Station03_Network      from '../stations/Station03_Network';
import Station04_Quantity     from '../stations/Station04_Quantity';
import Station05_Contradiction from '../stations/Station05_Contradiction';
import Station06_Negation     from '../stations/Station06_Negation';
import { HypercubeScene }     from '../stations/Station07_Categories';

// Inner component — has access to R3F context
function SceneInner() {
  useCameraControl(); // Attach GSAP camera transitions
  const { activeStation } = useStationStore();

  return (
    <>
      <Station01_Matter        visible={activeStation === 0} />
      <Station02_Motion        visible={activeStation === 1} />
      <Station03_Network       visible={activeStation === 2} />
      <Station04_Quantity      visible={activeStation === 3} />
      <Station05_Contradiction visible={activeStation === 4} />
      <Station06_Negation      visible={activeStation === 5} />
      <HypercubeScene          visible={activeStation === 6} />

      {/* Global postprocessing */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={new Vector2(0.0008, 0.0008)}
          radialModulation={false}
          modulationOffset={0.15}
        />
      </EffectComposer>
    </>
  );
}

export default function SceneContainer() {
  return (
    <div className="fixed inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 500 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 2]}
        style={{ background: '#0a0a0f' }}
      >
        <SceneInner />
      </Canvas>
    </div>
  );
}
