import { useState, useCallback, useEffect } from 'react';
import LoadingScreen   from './components/core/LoadingScreen';
import SceneContainer  from './components/core/SceneContainer';
import HUD             from './components/core/HUD';
import StationNav      from './components/core/StationNav';
import StationControls from './components/core/StationControls';
import { CategoryCards } from './components/stations/Station07_Categories';
import useStationStore   from './hooks/useStationStore';
import { STATIONS }      from './data/stations';
import { motion, AnimatePresence } from 'framer-motion';

// Keyboard navigation
function KeyboardNav() {
  const { activeStation, setStation, isTransitioning } = useStationStore();
  useEffect(() => {
    const handler = (e) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setStation(Math.min(activeStation + 1, STATIONS.length - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setStation(Math.max(activeStation - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeStation, isTransitioning, setStation]);
  return null;
}

// Station title flash overlay (brief title reveal on switch)
function StationTitleFlash() {
  const { activeStation, isTransitioning } = useStationStore();
  const station = STATIONS[activeStation];
  const color = station.color;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={`title-${activeStation}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-25 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div
              className="font-orbitron text-[11px] tracking-[0.4em] font-bold mb-2"
              style={{ color, textShadow: `0 0 30px ${color}` }}
            >
              STATION {station.id}
            </div>
            <h2
              className="font-orbitron text-2xl md:text-4xl font-black tracking-wider text-white"
              style={{ textShadow: `0 0 60px ${color}80` }}
            >
              {station.title}
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Top-left branding strip
function Branding() {
  return (
    <div className="fixed top-6 left-6 z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg glass flex items-center justify-center border border-cyan-DEFAULT/20">
          <span className="font-orbitron text-cyan-DEFAULT text-[9px] font-black">DA</span>
        </div>
        <div>
          <div className="font-orbitron text-[9px] tracking-[0.25em] text-cyan-DEFAULT font-bold">
            DIALECTIC ARTIFACTS
          </div>
          <div className="font-mono-space text-[8px] text-slate-500 tracking-wider">
            Triết học Mác – Lênin · Interactive
          </div>
        </div>
      </div>
    </div>
  );
}

// Vertical progress stepper (right side, compact)
function ProgressStepper() {
  const { activeStation, setStation, isTransitioning } = useStationStore();
  const colors = ['#00f5ff','#ffb800','#a78bfa','#fb923c','#ff2d55','#34d399','#c084fc'];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
      {STATIONS.map((s, i) => (
        <button
          key={i}
          id={`step-${i}`}
          onClick={() => !isTransitioning && setStation(i)}
          className="relative group flex items-center justify-center"
          title={s.title}
        >
          <motion.div
            animate={{
              width:  activeStation === i ? 20 : 4,
              height: activeStation === i ? 4  : 4,
              borderRadius: 4,
              backgroundColor: activeStation === i ? colors[i] : '#2d3748',
              boxShadow: activeStation === i ? `0 0 8px ${colors[i]}` : 'none',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ display: 'block' }}
          />
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Subtle CSS star-field */}
      <div className="starfield" />

      {/* Loading screen */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* 3D Scene — single persistent Canvas */}
      <SceneContainer />

      {/* HTML overlay UI layer — only shows after loaded */}
      {loaded && (
        <>
          <KeyboardNav />
          <Branding />
          <HUD />
          <StationControls />
          <StationNav />
          <ProgressStepper />
          <StationTitleFlash />
          <CategoryCards />
        </>
      )}
    </>
  );
}
