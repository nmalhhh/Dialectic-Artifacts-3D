import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const HELIX_TURNS = 5;
const HELIX_RADIUS = 2;
const HELIX_HEIGHT = 12;
const STEP_COUNT = 32;

// Parametric helix points
function helixPoint(t, phase = 0) {
  const angle = t * HELIX_TURNS * Math.PI * 2 + phase;
  return new THREE.Vector3(
    Math.cos(angle) * HELIX_RADIUS,
    t * HELIX_HEIGHT - HELIX_HEIGHT / 2,
    Math.sin(angle) * HELIX_RADIUS,
  );
}

export default function Station06_Negation({ visible }) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const isDragging  = useRef(false);
  const lastY       = useRef(0);
  const strandARefs = useRef();
  const strandBRefs = useRef();
  const glowRef     = useRef();

  // Build helix tube geometry
  const helixTubeA = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 200; i++) pts.push(helixPoint(i / 200, 0));
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 200, 0.04, 8, false);
  }, []);

  const helixTubeB = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 200; i++) pts.push(helixPoint(i / 200, Math.PI));
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 200, 0.04, 8, false);
  }, []);

  // Cross-rungs
  const rungPositions = useMemo(() => {
    const rungs = [];
    for (let i = 0; i < STEP_COUNT; i++) {
      const t = i / (STEP_COUNT - 1);
      const a = helixPoint(t, 0);
      const b = helixPoint(t, Math.PI);
      rungs.push([a, b]);
    }
    return rungs;
  }, []);

  // Staircase platforms
  const platforms = useMemo(() => {
    const plts = [];
    for (let i = 0; i < 18; i++) {
      const t = i / 18;
      const center = helixPoint(t, Math.PI / 2);
      plts.push({ pos: center, t });
    }
    return plts;
  }, []);

  useFrame(({ clock }) => {
    if (!visible) return;

    // Gentle auto-scroll when not dragging
    if (!isDragging.current) {
      progressRef.current = (progressRef.current + 0.0003) % 1;
    }
    const p = progressRef.current;
    const camPt = helixPoint(p, 0);
    const lookPt = helixPoint(Math.min(p + 0.05, 1), 0);

    // Lerp camera along helix
    camera.position.lerp(
      new THREE.Vector3(camPt.x * 0.6, camPt.y, camPt.z * 0.6 + 5),
      0.04,
    );
    camera.lookAt(lookPt.x * 0.3, lookPt.y, lookPt.z * 0.3);

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2);
    }
  });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastY.current = e.clientY;
  };
  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dy = e.clientY - lastY.current;
    progressRef.current = Math.max(0, Math.min(1, progressRef.current - dy * 0.001));
    lastY.current = e.clientY;
  };
  const handlePointerUp = () => { isDragging.current = false; };

  if (!visible) return null;

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <ambientLight intensity={0.15} />
      <pointLight ref={glowRef} position={[0, 0, 4]} intensity={2} color="#34d399" />
      <pointLight position={[0, HELIX_HEIGHT / 2, 0]} intensity={3} color="#34d399" distance={20} />
      <pointLight position={[0, -HELIX_HEIGHT / 2, 0]} intensity={1} color="#059669" distance={15} />

      {/* ── Helix Strand A ── */}
      <mesh geometry={helixTubeA}>
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* ── Helix Strand B ── */}
      <mesh geometry={helixTubeB}>
        <meshStandardMaterial
          color="#059669"
          emissive="#059669"
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* ── Cross rungs ── */}
      {rungPositions.map(([a, b], i) => {
        const pts = [a, b];
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <line key={i} geometry={geom}>
            <lineBasicMaterial
              color={i % 3 === 0 ? '#34d399' : '#1e4d3a'}
              transparent
              opacity={0.5}
            />
          </line>
        );
      })}

      {/* ── Stair platforms ── */}
      {platforms.map(({ pos, t }, i) => (
        <mesh key={i} position={pos} rotation={[0, -t * HELIX_TURNS * Math.PI * 2, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.4]} />
          <meshStandardMaterial
            color="#0a2618"
            emissive="#34d399"
            emissiveIntensity={0.15}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ── Floating ascending markers ── */}
      {[...Array(6)].map((_, i) => {
        const y = -HELIX_HEIGHT / 2 + (i + 1) * (HELIX_HEIGHT / 7);
        return (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[HELIX_RADIUS + 0.5, 0.02, 4, 64]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.15} />
          </mesh>
        );
      })}

      {/* ── Top apex glow ── */}
      <mesh position={[0, HELIX_HEIGHT / 2 + 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, HELIX_HEIGHT / 2 + 0.5, 0]} intensity={5} color="#34d399" distance={6} />
    </group>
  );
}
