import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStationStore from '../../hooks/useStationStore';

// ─── Magnetic arc between the two spheres ────────────────────────
function MagneticArc({ from, to, color, dashOffset, poleDistance }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.material.opacity = 0.3 + 0.3 * Math.sin(t * 3 + dashOffset);
    }
  });
  const curve = useMemo(() => {
    const ctrl = new THREE.Vector3(
      (from[0] + to[0]) / 2 + (Math.random() - 0.5) * poleDistance * 0.5,
      Math.random() * poleDistance * 0.6 - poleDistance * 0.3,
      (Math.random() - 0.5) * poleDistance * 0.3,
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      ctrl,
      new THREE.Vector3(...to),
    );
  }, [JSON.stringify(from), JSON.stringify(to)]);

  const pts = curve.getPoints(50);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);

  return (
    <line ref={ref} geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={1} />
    </line>
  );
}

// ─── Random lightning ─────────────────────────────────────
// `frequency` 0–1 maps 22 Hz → 80 Hz threshold
function Lightning({ from, to, active, frequency = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Higher frequency = lower sin threshold = more flashes
    const hz = 22 + frequency * 58;
    const threshold = 0.5 - frequency * 0.45; // 0.5 → 0.05 as freq increases
    ref.current.visible = active && Math.sin(t * hz) > threshold;
    if (ref.current.visible) {
      const attr = ref.current.geometry.attributes.position;
      const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
      // Wider zigzag when poles are very close (more violent conflict)
      const zigzag = 0.4 + frequency * 0.6;
      const steps = attr.count;
      for (let i = 0; i < steps; i++) {
        const r = i / (steps - 1);
        attr.setXYZ(i,
          from[0] + dx * r + (Math.random() - 0.5) * zigzag,
          from[1] + dy * r + (Math.random() - 0.5) * zigzag,
          from[2] + dz * r + (Math.random() - 0.5) * zigzag,
        );
      }
      attr.needsUpdate = true;
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(12 * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return g;
  }, []);

  return (
    <line ref={ref} geometry={geom}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.9} linewidth={1} />
    </line>
  );
}

export default function Station05_Contradiction({ visible }) {
  const { station05 } = useStationStore();
  const { poleDistance } = station05;

  const crimsonRef  = useRef();
  const blueRef     = useRef();
  const coreRef     = useRef();
  const coreGlowRef = useRef();
  const axisGroupRef = useRef(); // for shake when poles very close

  const crimsonPos = useMemo(() => [-poleDistance / 2, 0, 0], [poleDistance]);
  const bluePos    = useMemo(() => [poleDistance / 2, 0, 0],  [poleDistance]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Orbit the two spheres
    if (crimsonRef.current) {
      crimsonRef.current.position.x = -poleDistance / 2;
      crimsonRef.current.rotation.y = t * 0.8;
      crimsonRef.current.rotation.x = t * 0.3;
    }
    if (blueRef.current) {
      blueRef.current.position.x = poleDistance / 2;
      blueRef.current.rotation.y = -t * 0.8;
      blueRef.current.rotation.x = -t * 0.3;
    }
    // Central engine core rises with closer poles
    if (coreRef.current) {
      const coreHeight = (6 - poleDistance) / 4.5 * 3;
      coreRef.current.position.y = coreHeight * 0.5;
      coreRef.current.scale.setScalar(0.4 + (6 - poleDistance) / 4.5 * 0.8);
    }
    if (coreGlowRef.current) {
      const intensity = (6 - poleDistance) / 4.5;
      coreGlowRef.current.intensity = 1 + intensity * 5;
    }
    // Axis shake: violent trembling when poles extremely close (< 2.0)
    if (axisGroupRef.current) {
      if (poleDistance < 2.0) {
        const shakeAmp = (2.0 - poleDistance) / 0.5 * 0.06; // 0 → 0.06 as dist → 1.5
        axisGroupRef.current.position.x = (Math.random() - 0.5) * shakeAmp;
        axisGroupRef.current.position.y = (Math.random() - 0.5) * shakeAmp;
      } else {
        axisGroupRef.current.position.x = 0;
        axisGroupRef.current.position.y = 0;
      }
    }
  });

  if (!visible) return null;

  const closenessFactor = (6 - poleDistance) / 4.5; // 0 (far) → 1 (close)
  const arcCount = 4 + Math.floor(closenessFactor * 6);
  // Lightning frequency: 0 when poleDistance >= 3.5, ramps to 1.0 at 1.5
  const lightningFrequency = poleDistance < 3.5
    ? Math.min(1, (3.5 - poleDistance) / 2.0)
    : 0;

  return (
    // axisGroupRef applies per-frame shake when poles very close
    <group ref={axisGroupRef}>
      <ambientLight intensity={0.15} />
      <pointLight ref={coreGlowRef} position={[0, 0, 2]} intensity={2} color="#ffffff" />
      <pointLight position={crimsonPos} intensity={2} color="#ff2d55" />
      <pointLight position={bluePos}   intensity={2} color="#3b82f6" />

      {/* ── Crimson Sphere ── */}
      <mesh ref={crimsonRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshPhysicalMaterial
          color="#3d000a"
          emissive="#ff2d55"
          emissiveIntensity={0.8 + closenessFactor * 0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      {/* Crimson wireframe */}
      <mesh position={crimsonPos} scale={1.05}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#ff2d55" transparent opacity={0.15} wireframe />
      </mesh>

      {/* ── Blue Sphere ── */}
      <mesh ref={blueRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshPhysicalMaterial
          color="#00112a"
          emissive="#3b82f6"
          emissiveIntensity={0.8 + closenessFactor * 0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh position={bluePos} scale={1.05}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} wireframe />
      </mesh>

      {/* ── Magnetic Arcs ── */}
      {[...Array(arcCount)].map((_, i) => (
        <MagneticArc
          key={i}
          from={crimsonPos}
          to={bluePos}
          color={i % 2 === 0 ? '#ff2d55' : '#3b82f6'}
          dashOffset={i * 0.7}
          poleDistance={poleDistance}
        />
      ))}

      {/* ── Lightning ── */}
      <Lightning
        from={crimsonPos}
        to={bluePos}
        active={poleDistance < 3.5}
        frequency={lightningFrequency}
      />
      {/* Extra second bolt when extremely close */}
      {poleDistance < 2.0 && (
        <Lightning
          from={[crimsonPos[0], crimsonPos[1] + 0.3, crimsonPos[2]]}
          to={[bluePos[0], bluePos[1] - 0.3, bluePos[2]]}
          active
          frequency={1}
        />
      )}

      {/* ── Central Engine Core ── */}
      <group ref={coreRef} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color="#111"
            emissive="#ffffff"
            emissiveIntensity={0.5 + closenessFactor}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh scale={1.3}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.1 * closenessFactor} wireframe />
        </mesh>
      </group>

      {/* Orbit ring axis */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[poleDistance / 2, 0.01, 4, 128]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
