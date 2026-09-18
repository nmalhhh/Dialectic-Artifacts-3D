import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Vector3 } from 'three';
import useStationStore from './useStationStore';
import { STATIONS } from '../data/stations';

/**
 * Attaches to the R3F Canvas context.
 * Watches activeStation in Zustand and fires a GSAP tween whenever it changes.
 */
export default function useCameraControl() {
  const { camera } = useThree();
  const { activeStation, setTransitioning } = useStationStore();
  const targetRef = useRef(new Vector3());
  const lookRef   = useRef(new Vector3());
  const tweenRef  = useRef(null);

  useEffect(() => {
    const station = STATIONS[activeStation];
    if (!station) return;

    const { position, target } = station.camera;

    // Kill any ongoing tween
    if (tweenRef.current) tweenRef.current.kill();

    const proxy = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      lx: lookRef.current.x,
      ly: lookRef.current.y,
      lz: lookRef.current.z,
    };

    tweenRef.current = gsap.to(proxy, {
      px: position[0],
      py: position[1],
      pz: position[2],
      lx: target[0],
      ly: target[1],
      lz: target[2],
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.position.set(proxy.px, proxy.py, proxy.pz);
        lookRef.current.set(proxy.lx, proxy.ly, proxy.lz);
        camera.lookAt(lookRef.current);
      },
      onComplete: () => {
        setTransitioning(false);
      },
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [activeStation]); // eslint-disable-line
}
