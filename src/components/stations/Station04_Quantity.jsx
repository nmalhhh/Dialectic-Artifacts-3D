import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import useStationStore from '../../hooks/useStationStore';

const MOLECULE_COUNT = 48;
const BOUNDS = { x: 1.0, y: 2.6, z: 1.0 }; // half-extents inside cylinder

export default function Station04_Quantity({ visible }) {
  const { station04, setStation04 } = useStationStore();
  const { temperature, isLeap } = station04;
  const { camera } = useThree();

  const instanceRef   = useRef();
  const explosionRef  = useRef();
  const thermFillRef  = useRef();
  const tempGlowRef   = useRef();
  const isLeapRef     = useRef(false); // track prev leap to fire shake once
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Molecule state stored in refs for O(n) update
  const posRef = useRef(null);
  const velRef = useRef(null);

  useEffect(() => {
    const pos = new Float32Array(MOLECULE_COUNT * 3);
    const vel = new Float32Array(MOLECULE_COUNT * 3);
    for (let i = 0; i < MOLECULE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * BOUNDS.x * 1.8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 1.8;
      vel[i * 3]     = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    posRef.current = pos;
    velRef.current = vel;
  }, []);

  // ── GSAP camera shake on Bước nhảy ──────────────────────────────
  useEffect(() => {
    if (isLeap && !isLeapRef.current) {
      isLeapRef.current = true;
      const origin = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      const tl = gsap.timeline();
      // 6 rapid micro-shakes then snap back
      for (let s = 0; s < 6; s++) {
        tl.to(camera.position, {
          x: origin.x + (Math.random() - 0.5) * 0.18,
          y: origin.y + (Math.random() - 0.5) * 0.18,
          z: origin.z + (Math.random() - 0.5) * 0.12,
          duration: 0.06,
          ease: 'none',
        });
      }
      tl.to(camera.position, {
        x: origin.x,
        y: origin.y,
        z: origin.z,
        duration: 0.12,
        ease: 'power2.out',
      });
    }
    if (!isLeap) {
      isLeapRef.current = false;
    }
  }, [isLeap]);

  useFrame((_, delta) => {
    if (!instanceRef.current || !posRef.current) return;
    const speed = 1 + (temperature / 100) * 5;
    const pos = posRef.current;
    const vel = velRef.current;

    for (let i = 0; i < MOLECULE_COUNT; i++) {
      // O(n) — update position
      pos[i*3]   += vel[i*3]   * speed;
      pos[i*3+1] += vel[i*3+1] * speed;
      pos[i*3+2] += vel[i*3+2] * speed;

      // Wall bounce — no pairwise collision
      if (Math.abs(pos[i*3])   > BOUNDS.x) vel[i*3]   *= -1;
      if (Math.abs(pos[i*3+1]) > BOUNDS.y) vel[i*3+1] *= -1;
      if (Math.abs(pos[i*3+2]) > BOUNDS.z) vel[i*3+2] *= -1;

      // Write to instanced mesh
      dummy.position.set(pos[i*3], pos[i*3+1], pos[i*3+2]);
      dummy.updateMatrix();
      instanceRef.current.setMatrixAt(i, dummy.matrix);
    }
    instanceRef.current.instanceMatrix.needsUpdate = true;

    // Thermometer fill
    if (thermFillRef.current) {
      const fillH = (temperature / 100) * 3.6;
      thermFillRef.current.scale.y = Math.max(fillH, 0.01);
      thermFillRef.current.position.y = -1.8 + fillH / 2;
    }
    // Point light glow at thermometer
    if (tempGlowRef.current) {
      const t = temperature / 100;
      tempGlowRef.current.color.setRGB(1, 0.2 + t * 0.8, t < 0.5 ? 0 : (t - 0.5) * 2);
      tempGlowRef.current.intensity = 0.5 + t * 3;
    }

    // Explosion burst particles
    if (explosionRef.current) {
      explosionRef.current.visible = isLeap;
      if (isLeap) {
        const attr = explosionRef.current.geometry.attributes.position;
        for (let i = 0; i < attr.count; i++) {
          attr.setXYZ(
            i,
            attr.getX(i) + (Math.random() - 0.5) * 0.3,
            attr.getY(i) + Math.random() * 0.15,
            attr.getZ(i) + (Math.random() - 0.5) * 0.3,
          );
        }
        attr.needsUpdate = true;
      }
    }
  });

  // Explosion geometry
  const explosionGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const r     = Math.random() * 2;
      pts[i*3]   = Math.sin(phi) * Math.cos(theta) * r;
      pts[i*3+1] = Math.cos(phi) * r;
      pts[i*3+2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return g;
  }, []);

  if (!visible) return null;
  const heat = temperature / 100;
  // Post-leap: molecules become rising steam-blue
  const molColor = isLeap
    ? '#7dd3fc'
    : heat < 0.5
      ? '#60a5fa'
      : new THREE.Color().lerpColors(
          new THREE.Color('#60a5fa'),
          new THREE.Color('#ff4500'),
          (heat - 0.5) * 2,
        );
  const molEmissive = isLeap ? '#bae6fd' : (heat > 0.8 ? '#ff2200' : '#001133');
  const molEmissiveIntensity = isLeap ? 2.0 : heat * 1.5;

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight ref={tempGlowRef} position={[1.8, 0, 0]} intensity={1} color="#ff4500" />
      <pointLight position={[0, 3, 3]} intensity={1} color="#fb923c" />

      {/* ── Glass Cylinder ── */}
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 6, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#0a1628"
          metalness={0}
          roughness={0}
          transmission={0.6}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Top & bottom caps */}
      {[3, -3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <circleGeometry args={[1.1, 32]} />
          <meshStandardMaterial color="#0a1628" metalness={0.7} roughness={0.3} transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Cylinder ring accents */}
      {[-2.5, 0, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.12, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={temperature > 33 * (i + 1) ? '#fb923c' : '#1e3050'}
            transparent opacity={0.8}
          />
        </mesh>
      ))}

      {/* ── InstancedMesh Molecules ── */}
      <instancedMesh ref={instanceRef} args={[null, null, MOLECULE_COUNT]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color={molColor}
          emissive={molEmissive}
          emissiveIntensity={molEmissiveIntensity}
          metalness={0.5}
          roughness={0.3}
        />
      </instancedMesh>

      {/* ── Thermometer ── */}
      <group position={[1.6, 0, 0]}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.12, 4, 8, 16]} />
          <meshPhysicalMaterial
            color="#0a1628"
            transmission={0.5}
            transparent opacity={0.4}
            roughness={0}
          />
        </mesh>
        {/* Fill */}
        <mesh ref={thermFillRef} position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1, 16]} />
          <meshStandardMaterial
            color={heat < 0.5 ? '#3b82f6' : '#ff4500'}
            emissive={heat < 0.5 ? '#1d4ed8' : '#ff2200'}
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Bulb */}
        <mesh position={[0, -2.1, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={heat < 0.5 ? '#3b82f6' : '#ff4500'}
            emissive={heat < 0.5 ? '#1d4ed8' : '#ff2200'}
            emissiveIntensity={1}
          />
        </mesh>
        {/* Tick marks */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0.15, -1.8 + i * 0.9, 0]}>
            <boxGeometry args={[0.06, 0.015, 0.015]} />
            <meshBasicMaterial color={temperature > i * 25 ? '#fb923c' : '#334155'} />
          </mesh>
        ))}
        {/* 100° label */}
        <mesh position={[0, 2.2, 0]}>
          <torusGeometry args={[0.1, 0.012, 4, 20]} />
          <meshBasicMaterial color={temperature >= 100 ? '#fb923c' : '#334155'} />
        </mesh>
      </group>

      {/* ── Bước nhảy flash & particles ── */}
      {isLeap && (
        <>
          <points ref={explosionRef} geometry={explosionGeom}>
            {/* Steam-blue particles after phase change */}
            <pointsMaterial color="#7dd3fc" size={0.07} transparent opacity={0.85} sizeAttenuation />
          </points>
          <pointLight position={[0, 0, 2]} intensity={10} color="#bae6fd" distance={10} />
          <pointLight position={[0, 2, 0]} intensity={5} color="#e0f2fe" distance={6} />
        </>
      )}
    </group>
  );
}
