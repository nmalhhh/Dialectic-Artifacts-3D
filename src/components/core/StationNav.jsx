import { motion, AnimatePresence } from 'framer-motion';
import useStationStore from '../../hooks/useStationStore';
import { STATIONS } from '../../data/stations';

const ACCENT_COLORS = [
  '#00f5ff', '#ffb800', '#a78bfa', '#fb923c',
  '#ff2d55', '#34d399', '#c084fc',
];

export default function StationNav() {
  const { activeStation, setStation, isTransitioning } = useStationStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
      {/* Glass pill container */}
      <div className="glass rounded-full px-4 py-3 flex items-center gap-1 shadow-lg">
        {STATIONS.map((station, idx) => {
          const isActive = activeStation === idx;
          const color = ACCENT_COLORS[idx];
          return (
            <button
              key={idx}
              id={`nav-station-${idx + 1}`}
              onClick={() => !isTransitioning && setStation(idx)}
              disabled={isTransitioning}
              className="relative group flex flex-col items-center gap-1 transition-all duration-300"
              title={`${station.id} — ${station.title}`}
            >
              {/* Dot indicator */}
              <motion.div
                animate={{
                  scale: isActive ? 1.4 : 1,
                  opacity: isActive ? 1 : 0.35,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 10px ${color}, 0 0 20px ${color}60` : 'none',
                }}
              />

              {/* Station ID below dot (visible on hover or active) */}
              <span
                className="font-orbitron text-[8px] leading-none transition-all duration-200"
                style={{
                  color: isActive ? color : 'rgba(255,255,255,0.3)',
                  textShadow: isActive ? `0 0 8px ${color}` : 'none',
                }}
              >
                {station.id}
              </span>

              {/* Hover tooltip */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                  <div
                    className="glass rounded-lg px-3 py-2 text-center whitespace-nowrap"
                    style={{ borderColor: `${color}40` }}
                  >
                    <div
                      className="font-orbitron text-[9px] font-bold tracking-wider"
                      style={{ color }}
                    >
                      {station.id}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5 font-inter">
                      {station.title}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div
                    className="mx-auto mt-0.5 w-2 h-1"
                    style={{
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: `4px solid ${color}40`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Transition lock indicator */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -right-10 top-1/2 -translate-y-1/2"
        >
          <div className="w-4 h-4 border border-cyan-DEFAULT border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  );
}
