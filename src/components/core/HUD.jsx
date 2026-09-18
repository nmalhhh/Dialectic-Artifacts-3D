import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Activity, PauseCircle, Share2, TrendingUp,
  Thermometer, GitBranch, Atom, RefreshCw, Layers,
  ChevronRight, Eye, EyeOff,
} from 'lucide-react';
import useStationStore from '../../hooks/useStationStore';
import { STATIONS } from '../../data/stations';

const ICON_MAP = {
  cpu: Cpu, zap: Zap, activity: Activity, 'pause-circle': PauseCircle,
  'share-2': Share2, 'trending-up': TrendingUp, thermometer: Thermometer,
  'git-branch': GitBranch, atom: Atom, 'refresh-cw': RefreshCw, layers: Layers,
};

export default function HUD() {
  const { activeStation } = useStationStore();
  const station = STATIONS[activeStation];
  const accentColor = station.color;
  const [hudVisible, setHudVisible] = useState(true);

  return (
    <>
      {/* ── Toggle HUD button — always visible in top-right corner ── */}
      <motion.button
        id="hud-toggle-btn"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setHudVisible((v) => !v)}
        title={hudVisible ? 'Ẩn HUD (Pure 3D View)' : 'Hiện HUD'}
        className="fixed z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200"
        style={{
          // Position: above the HUD panel when visible, or at fixed top-right when hidden
          top: hudVisible ? '1.5rem' : '1.5rem',
          right: hudVisible ? '1.5rem' : '1.5rem',
          // When HUD is hidden, shift to not overlap nothing; when visible, sit atop HUD
          transform: hudVisible ? 'translateX(0)' : 'translateX(0)',
          background: hudVisible ? `${accentColor}10` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${hudVisible ? accentColor + '30' : 'rgba(255,255,255,0.1)'}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          marginTop: hudVisible ? '0' : '0',
        }}
      >
        {hudVisible ? (
          <EyeOff size={11} style={{ color: accentColor }} />
        ) : (
          <Eye size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />
        )}
        <span
          className="font-orbitron text-[8px] tracking-[0.2em] uppercase leading-none"
          style={{ color: hudVisible ? accentColor : 'rgba(255,255,255,0.5)' }}
        >
          {hudVisible ? 'HUD ON' : 'HUD OFF'}
        </span>
      </motion.button>

      {/* ── Main HUD panel — conditionally rendered ── */}
      <AnimatePresence mode="wait">
        {hudVisible && (
          <motion.div
            key={`hud-${activeStation}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-20 w-72 md:w-80 flex flex-col gap-3"
            style={{ top: '1.5rem', right: '1.5rem', paddingTop: '2rem' }}
            id="hud-panel"
          >
            {/* Station header */}
            <div
              className="glass rounded-xl p-4 relative overflow-hidden"
              style={{ borderColor: `${accentColor}30` }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-12 h-12 opacity-20"
                style={{
                  background: `linear-gradient(225deg, ${accentColor} 0%, transparent 70%)`,
                }}
              />
              <div
                className="font-orbitron text-[9px] tracking-[0.3em] font-bold mb-1"
                style={{ color: accentColor }}
              >
                STATION {station.id}
              </div>
              <h2 className="font-orbitron text-white text-sm font-bold leading-tight">
                {station.title}
              </h2>
              <p className="text-slate-400 text-[11px] mt-1 font-mono-space">{station.subtitle}</p>
              {/* Accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
              />
            </div>

            {/* HUD cards */}
            {station.hud.map((item, i) => {
              const IconComp = ICON_MAP[item.icon] ?? Cpu;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  className="glass rounded-xl p-4 relative group cursor-default"
                  style={{ borderColor: `${accentColor}15` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                    >
                      <IconComp size={14} style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-orbitron text-[9px] tracking-widest font-bold mb-1.5"
                        style={{ color: accentColor }}
                      >
                        {item.label}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                  {/* Hover indicator */}
                  <ChevronRight
                    size={10}
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity"
                    style={{ color: accentColor }}
                  />
                </motion.div>
              );
            })}

            {/* Interaction hint */}
            {station.interaction && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-lg px-3 py-2 flex items-center gap-2"
                style={{ borderColor: `${accentColor}15` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="font-mono-space text-[9px] text-slate-400 tracking-wider">
                  {station.interaction.label}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
