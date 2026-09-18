import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useStationStore from '../../hooks/useStationStore';

// ─── Conduit between two points ──────────────────────────────────
function Conduit({ from, to, color, pulseOffset = 0 }) {
  const matRef = useRef();
  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = (clock.getElapsedTime() * 0.5 + pulseOffset) % 1;
      matRef.current.opacity = 0.4 + 0.3 * Math.sin(t * Math.PI * 2);
    }
  });
  const curve = useMemo(() => {
    const mid = new THREE.Vector3(
      (from[0] + to[0]) / 2 + (Math.random() - 0.5) * 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      mid,
      new THREE.Vector3(...to),
    );
  }, []);
  const points = curve.getPoints(40);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line geometry={geom}>
      <lineBasicMaterial ref={matRef} color={color} transparent opacity={0.6} linewidth={1} />
    </line>
  );
}

// ─── Shockwave ring ───────────────────────────────────────────────
function ShockwaveRing({ active, color, delay = 0 }) {
  const ref = useRef();
  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (!active || !ref.current) { startTime.current = null; return; }
    if (!startTime.current) startTime.current = clock.getElapsedTime() - delay;
    const elapsed = (clock.getElapsedTime() - startTime.current) % 2.5;
    const t = elapsed / 2.5;
    ref.current.scale.setScalar(0.1 + t * 4);
    ref.current.material.opacity = (1 - t) * 0.6;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
      <torusGeometry args={[1, 0.05, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// ─── Electric pulse from brain to base ───────────────────────────
function ElectricPulse({ active, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.visible = active && Math.sin(clock.getElapsedTime() * 18) > 0.2;
  });
  const pts = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 12; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        -2.2 + (i / 12) * 4.4,
        (Math.random() - 0.5) * 0.6,
      ));
    }
    return arr;
  }, [active]);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);

  return (
    <line ref={ref} geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.9} linewidth={1} />
    </line>
  );
}

export default function Station01_Matter({ visible }) {
  const { station01, setStation01 } = useStationStore();
  const { practicalAction } = station01;
  const brainRef = useRef();
  const baseRef  = useRef();
  const glowRef  = useRef();
  const [actionTimer, setActionTimer] = useState(false);

  const handleAction = () => {
    setStation01({ practicalAction: true });
    setActionTimer(true);
    setTimeout(() => {
      setStation01({ practicalAction: false });
      setActionTimer(false);
    }, 4000);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (brainRef.current) {
      brainRef.current.position.y = 1.8 + Math.sin(t * 0.8) * 0.15;
      brainRef.current.rotation.y = t * 0.3;
    }
    if (baseRef.current) {
      baseRef.current.rotation.y = -t * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.intensity = practicalAction
        ? 3 + 2 * Math.sin(t * 8)
        : 1.2 + 0.4 * Math.sin(t * 2);
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Ambient + point lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#00f5ff" />
      <pointLight ref={glowRef} position={[0, 0, 4]} intensity={1.5} color="#00f5ff" />

      {/* ── Crystalline Brain ── */}
      <mesh ref={brainRef} position={[0, 1.8, 0]}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshPhysicalMaterial
          color="#001f3f"
          emissive="#00f5ff"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.1}
          transmission={0.5}
          thickness={1.5}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>
      {/* Brain wireframe overlay */}
      <mesh position={[0, 1.8, 0]} scale={[1.02, 1.02, 1.02]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} wireframe />
      </mesh>

      {/* ── Metallic Base ── */}
      <group ref={baseRef} position={[0, -2.2, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 2, 1.2, 12, 1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} emissive="#001122" />
        </mesh>
        {/* Top ring glow */}
        <mesh position={[0, 0.62, 0]}>
          <torusGeometry args={[1.5, 0.04, 8, 64]} />
          <meshBasicMaterial
            color={practicalAction ? '#ff2d55' : '#00f5ff'}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Hex details */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1]}>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#0a1628" metalness={0.95} roughness={0.1} />
            </mesh>
          );
        })}
      </group>

      {/* ── Optical Conduits ── */}
      <Conduit from={[-0.3, 0.8, 0]} to={[-0.6, -1.8, 0.3]} color="#00f5ff" pulseOffset={0} />
      <Conduit from={[0.3, 0.8, 0]}  to={[0.6, -1.8, -0.3]} color="#00f5ff" pulseOffset={0.33} />
      <Conduit from={[0, 0.6, 0.3]}  to={[0, -1.8, 0.8]}    color="#00b8d9" pulseOffset={0.66} />

      {/* ── Shockwave rings (only when practicalAction) ── */}
      <ShockwaveRing active={practicalAction} color="#ff2d55" delay={0} />
      <ShockwaveRing active={practicalAction} color="#ff6b35" delay={0.6} />
      <ShockwaveRing active={practicalAction} color="#ffb800" delay={1.2} />

      {/* ── Electric pulses (brain → base) ── */}
      <ElectricPulse active={practicalAction} color="#00f5ff" />
      <ElectricPulse active={practicalAction} color="#a78bfa" />

      {/* ── OrbitControls ── */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        enableDamping
        dampingFactor={0.06}
      />

      {/* ── HTML interaction button (via DOM portal in App) ── */}
    </group>
  );
}

// Export the button state for App.jsx to use
export { };
