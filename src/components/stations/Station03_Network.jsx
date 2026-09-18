import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 56;
const CONNECT_DIST = 2.8;

// ── Fibonacci sphere layout ────────────────────────────────────────
function fibSphere(n, radius) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ));
  }
  return pts;
}

// ── Build adjacency list + edge pairs ─────────────────────────────
function buildEdges(pts) {
  const edges = [];
  const adj = Array.from({ length: pts.length }, () => []);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].distanceTo(pts[j]) < CONNECT_DIST) {
        edges.push([i, j]);
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }
  return { edges, adj };
}

export default function Station03_Network({ visible }) {
  const groupRef  = useRef();
  const nodesRef  = useRef([]);
  const glowRef   = useRef(new Float32Array(NODE_COUNT).fill(0));
  const lineRef   = useRef();    // ref to the lineSegments material

  const nodePositions = useMemo(() => fibSphere(NODE_COUNT, 3.2), []);
  const { edges, adj } = useMemo(() => buildEdges(nodePositions), [nodePositions]);

  // ── Build connection-line geometry imperatively ──────────────────
  // Using an imperative BufferGeometry avoids the broken
  // <bufferAttribute attach="attributes-position"> JSX path in R3F v9.
  const lineGeometry = useMemo(() => {
    const buf = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], idx) => {
      const pa = nodePositions[a], pb = nodePositions[b];
      buf[idx * 6 + 0] = pa.x; buf[idx * 6 + 1] = pa.y; buf[idx * 6 + 2] = pa.z;
      buf[idx * 6 + 3] = pb.x; buf[idx * 6 + 4] = pb.y; buf[idx * 6 + 5] = pb.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buf, 3));
    return geo;
  }, [edges, nodePositions]);

  // ── BFS ripple from hovered/clicked node ─────────────────────────
  const triggerRipple = useCallback((startIdx) => {
    const visited = new Set([startIdx]);
    const queue = [[startIdx, 0]];
    while (queue.length) {
      const [idx, depth] = queue.shift();
      const delay = depth * 0.08;
      setTimeout(() => {
        glowRef.current[idx] = 1.0;
      }, delay * 1000);
      adj[idx].forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, depth + 1]);
        }
      });
    }
  }, [adj]);

  useFrame(({ clock }) => {
    // Slow global rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
    // Decay glow + update node material per frame
    for (let i = 0; i < NODE_COUNT; i++) {
      glowRef.current[i] = Math.max(0, glowRef.current[i] - 0.015);
      const mesh = nodesRef.current[i];
      if (mesh) {
        const g = glowRef.current[i];
        mesh.material.emissiveIntensity = 0.3 + g * 1.5;
        mesh.scale.setScalar(1 + g * 0.5);
      }
    }
    // Line opacity pulse
    if (lineRef.current) {
      lineRef.current.opacity = 0.12 + 0.06 * Math.sin(clock.getElapsedTime());
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#c084fc" />

      {/* ── Nodes ── */}
      {nodePositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (nodesRef.current[i] = el)}
          position={pos}
          onClick={() => triggerRipple(i)}
          onPointerOver={() => triggerRipple(i)}
        >
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* ── Connection lines — geometry passed imperatively ── */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          ref={lineRef}
          color="#7c3aed"
          transparent
          opacity={0.15}
        />
      </lineSegments>

      {/* ── Outer glow sphere ── */}
      <mesh>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}
