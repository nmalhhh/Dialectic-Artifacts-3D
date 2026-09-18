import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStationStore from '../../hooks/useStationStore';

// ─── Particle stream inside hourglass ────────────────────────────
function ParticleStream({ timeScale }) {
  const ref = useRef();
  const COUNT = 300;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = Math.random() * 1.5;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(a) * r;
      vel[i] = 0.01 + Math.random() * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const posRef = useRef(positions.slice());

  useFrame((_, delta) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const speed = Math.max(timeScale * 0.8, 0.05); // micro-vibrate even at 0

    for (let i = 0; i < COUNT; i++) {
      const yIdx = i * 3 + 1;
      // Micro-vibration always present
      const microV = Math.sin(Date.now() * 0.003 + i) * 0.0008;
      posRef.current[yIdx] -= velocities[i] * speed * 60 * delta + microV;

      // Necking: constrain x/z near y=0
      const y = posRef.current[yIdx];
      const maxR = 0.15 + Math.abs(y) * 0.6;
      const curX = posRef.current[i * 3];
      const curZ = posRef.current[i * 3 + 2];
      const curR = Math.sqrt(curX * curX + curZ * curZ);
      if (curR > maxR) {
        const ratio = maxR / curR;
        posRef.current[i * 3]     *= ratio;
        posRef.current[i * 3 + 2] *= ratio;
      }

      // Reset when fallen below bottom bulb
      if (posRef.current[yIdx] < -2.5) {
        posRef.current[yIdx] = 2.5;
        const r = Math.random() * 1.5;
        const a = Math.random() * Math.PI * 2;
        posRef.current[i * 3]     = Math.cos(a) * r;
        posRef.current[i * 3 + 2] = Math.sin(a) * r;
      }

      attr.setXYZ(i, posRef.current[i * 3], posRef.current[yIdx], posRef.current[i * 3 + 2]);
    }
    attr.needsUpdate = true;
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#ffb800" size={0.04} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ─── Planetary ring ───────────────────────────────────────────────
function Ring({ radius, tilt, speed, color, timeScale }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += speed * timeScale * delta;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 4, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

export default function Station02_Motion({ visible }) {
  const { station02 } = useStationStore();
  const { timeScale } = station02;
  const hourRef = useRef();

  useFrame(({ clock }) => {
    if (hourRef.current) {
      hourRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  if (!visible) return null;

  return (
    <group ref={hourRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 4, 4]} intensity={2} color="#ffb800" />
      <pointLight position={[0, -4, 4]} intensity={1} color="#ff8c00" />

      {/* ── Hourglass glass body (two cones) ── */}
      <mesh position={[0, 1.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 2.8, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#1a0a00"
          emissive="#ff8c00"
          emissiveIntensity={0.1}
          metalness={0}
          roughness={0}
          transmission={0.7}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <coneGeometry args={[1.5, 2.8, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#1a0a00"
          emissive="#ff8c00"
          emissiveIntensity={0.1}
          transmission={0.7}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top & bottom cap rings */}
      {[-2.8, 2.8].map((y, i) => (
        <mesh key={i} position={[0, y / 2 + (i === 0 ? -0.1 : 0.1), 0]}>
          <torusGeometry args={[1.5, 0.06, 8, 64]} />
          <meshStandardMaterial color="#ffb800" metalness={0.8} roughness={0.2} emissive="#ffb800" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* ── Particle stream ── */}
      <ParticleStream timeScale={timeScale} />

      {/* ── Planetary rings ── */}
      <Ring radius={2.8} tilt={Math.PI / 3}    speed={0.6}  color="#ffb800" timeScale={timeScale} />
      <Ring radius={3.5} tilt={-Math.PI / 4}   speed={0.35} color="#ff8c00" timeScale={timeScale} />
      <Ring radius={4.2} tilt={Math.PI / 6}    speed={0.18} color="#ffd700" timeScale={timeScale} />
      <Ring radius={4.8} tilt={-Math.PI / 2.5} speed={0.08} color="#ffb80040" timeScale={timeScale} />
    </group>
  );
}
