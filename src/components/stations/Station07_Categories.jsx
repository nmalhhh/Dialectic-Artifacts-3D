import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import useStationStore from '../../hooks/useStationStore';
import { STATIONS } from '../../data/stations';

const FACE_NORMALS = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1],
];

const FACE_COLORS = [
  '#00f5ff', '#ff2d55', '#ffb800', '#34d399', '#c084fc', '#fb923c',
];

// 3D Hypercube scene
export function HypercubeScene({ visible }) {
  const cubeRef = useRef();
  const { station07, setStation07, activeStation } = useStationStore();
  const { activeCard } = station07;
  const station = STATIONS[6];

  useFrame(({ clock }) => {
    if (!cubeRef.current) return;
    if (activeCard === null) {
      // Slow auto-rotate when no card selected
      cubeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.4;
      cubeRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
  });

  if (!visible) return null;

  return (
    <group ref={cubeRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#c084fc" />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color="#9333ea" />

      {/* ── Wireframe outer cube ── */}
      <mesh>
        <boxGeometry args={[3.8, 3.8, 3.8]} />
        <meshBasicMaterial color="#c084fc" wireframe transparent opacity={0.15} />
      </mesh>

      {/* ── 6 interactive face panels ── */}
      {FACE_NORMALS.map((normal, i) => {
        const pos = normal.map((n) => n * 1.91);
        const rotX = normal[1] !== 0 ? (normal[1] > 0 ? -Math.PI / 2 : Math.PI / 2) : 0;
        const rotY = normal[0] !== 0 ? (normal[0] > 0 ? Math.PI / 2 : -Math.PI / 2) : 0;
        const rotZ = normal[2] < 0 ? Math.PI : 0;
        const isSelected = activeCard === i;
        const color = FACE_COLORS[i];

        return (
          <group key={i} position={pos} rotation={[rotX, rotY, rotZ]}>
            <mesh
              onClick={() => setStation07({ activeCard: isSelected ? null : i })}
            >
              <planeGeometry args={[3.6, 3.6]} />
              <meshStandardMaterial
                color={isSelected ? color : '#0a0a1a'}
                emissive={color}
                emissiveIntensity={isSelected ? 0.6 : 0.08}
                transparent
                opacity={isSelected ? 0.7 : 0.4}
                metalness={0}
                roughness={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Edge border */}
            <mesh>
              <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(3.6, 3.6)]} />
              <lineBasicMaterial color={color} transparent opacity={isSelected ? 0.9 : 0.25} />
            </mesh>
            {/* Face index ring */}
            <mesh position={[0, 0, 0.01]}>
              <torusGeometry args={[0.25, 0.025, 4, 20]} />
              <meshBasicMaterial color={color} transparent opacity={isSelected ? 1 : 0.4} />
            </mesh>
          </group>
        );
      })}

      {/* ── Inner core ── */}
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#1a0a2e"
          emissive="#c084fc"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// HTML overlay flip cards (outside Canvas)
export function CategoryCards() {
  const { station07, setStation07 } = useStationStore();
  const { activeCard } = station07;
  const station = STATIONS[6];

  if (activeCard === null) return null;
  const card = station.cards[activeCard];
  const color = FACE_COLORS[activeCard];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCard}
        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-20 w-72 md:w-80"
        style={{ perspective: 1000 }}
      >
        <div
          className="glass rounded-2xl p-6 relative overflow-hidden"
          style={{ borderColor: `${color}40`, boxShadow: `0 0 40px ${color}20` }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-5 rounded-2xl"
            style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
          />

          {/* Card index */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="font-mono-space text-2xl leading-none"
              style={{ color }}
            >
              {card.icon}
            </span>
            <div
              className="font-orbitron text-[9px] tracking-widest px-2 py-1 rounded-full"
              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
            >
              PHẠM TRÙ {String(activeCard + 1).padStart(2, '0')}
            </div>
          </div>

          <h3
            className="font-orbitron text-sm font-bold mb-3 leading-snug"
            style={{ color }}
          >
            {card.title}
          </h3>
          <p className="text-slate-300 text-[12px] leading-relaxed">
            {card.desc}
          </p>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          />

          {/* Close */}
          <button
            onClick={() => setStation07({ activeCard: null })}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:opacity-100 opacity-40"
            style={{ border: `1px solid ${color}50`, color }}
          >
            <span className="text-[10px]">✕</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
