import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStationStore from '../../hooks/useStationStore';
import { STATIONS } from '../../data/stations';

const ACCENT_COLORS = [
  '#00f5ff', '#ffb800', '#a78bfa', '#fb923c',
  '#ff2d55', '#34d399', '#c084fc',
];

export default function StationControls() {
  const {
    activeStation,
    station01, setStation01,
    station02, setStation02,
    station04, setStation04,
    station05, setStation05,
  } = useStationStore();

  const holdRef = useRef(null);
  const station = STATIONS[activeStation];
  const color = ACCENT_COLORS[activeStation];
  const [holding, setHolding] = useState(false);
  const tempRef = useRef(0);
  const holdIntervalRef = useRef(null);

  const startHeat = () => {
    if (holdIntervalRef.current) return; // prevent double-start
    setHolding(true);
    holdIntervalRef.current = setInterval(() => {
      tempRef.current = Math.min(tempRef.current + 1.5, 100);
      if (tempRef.current >= 100) {
        setStation04({ temperature: 100, isLeap: true });
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setTimeout(() => {
          setStation04({ temperature: 0, isLeap: false });
          tempRef.current = 0;
          setHolding(false);
        }, 2200);
      } else {
        setStation04({ temperature: tempRef.current });
      }
    }, 60);
  };
  const stopHeat = () => {
    setHolding(false);
    clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-20 left-6 z-20 flex flex-col gap-3"
        id="station-controls"
      >
        {/* ── Station 01: Tác động thực tiễn button ── */}
        {activeStation === 0 && (
          <button
            id="s01-action-btn"
            onClick={() => {
              setStation01({ practicalAction: true });
              setTimeout(() => setStation01({ practicalAction: false }), 4000);
            }}
            className="btn-cyber px-5 py-3 rounded-xl text-xs tracking-widest uppercase transition-all"
            style={{
              color,
              borderColor: color,
              boxShadow: station01.practicalAction ? `0 0 20px ${color}60` : 'none',
            }}
          >
            ⚡ Tác động thực tiễn
          </button>
        )}

        {/* ── Station 02: Time scale slider ── */}
        {activeStation === 1 && (
          <div className="glass rounded-xl p-4 w-56" style={{ borderColor: `${color}20` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-orbitron text-[9px] tracking-widest" style={{ color }}>
                TỐC ĐỘ THỜI GIAN
              </span>
              <span className="font-mono-space text-[10px] text-white">
                {station02.timeScale === 0 ? 'ĐỨNG IM' : `×${station02.timeScale.toFixed(2)}`}
              </span>
            </div>
            <input
              id="s02-timescale-slider"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={station02.timeScale}
              onChange={(e) => setStation02({ timeScale: parseFloat(e.target.value) })}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${color} ${station02.timeScale / 2 * 100}%, #1e2a3a ${station02.timeScale / 2 * 100}%)`,
                accentColor: color,
              }}
            />
            <div className="flex justify-between font-mono-space text-[8px] mt-1 text-slate-500">
              <span>ĐỨNG IM</span>
              <span>TỐC ĐỘ CỰC ĐẠI</span>
            </div>
          </div>
        )}

        {/* ── Station 03: Hover hint ── */}
        {activeStation === 2 && (
          <div className="glass rounded-xl px-4 py-3 w-56" style={{ borderColor: `${color}20` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="font-mono-space text-[9px] text-slate-400 tracking-wider">
                Hover/Click nút mạng
              </span>
            </div>
            <div className="font-mono-space text-[9px] text-slate-500 mt-1.5 ml-4">
              để kích hoạt gợn sóng lan truyền
            </div>
          </div>
        )}

        {/* ── Station 04: Hold to heat ── */}
        {activeStation === 3 && (
          <div className="flex flex-col gap-2">
            <button
              id="s04-heat-btn"
              onMouseDown={startHeat}
              onMouseUp={stopHeat}
              onMouseLeave={stopHeat}
              onTouchStart={startHeat}
              onTouchEnd={stopHeat}
              className="btn-cyber px-5 py-4 rounded-xl text-xs tracking-widest uppercase select-none"
              style={{
                color,
                borderColor: color,
                boxShadow: holding ? `0 0 30px ${color}80` : 'none',
                transform: holding ? 'scale(0.97)' : 'scale(1)',
                transition: 'all 0.15s',
              }}
            >
              🔥 {holding ? 'NUNG NHIỆT...' : 'GIỮ ĐỂ NUNG NHIỆT'}
            </button>
            {/* Temperature readout */}
            <div className="glass rounded-lg px-3 py-2 flex items-center justify-between" style={{ borderColor: `${color}20` }}>
              <span className="font-orbitron text-[9px] tracking-wider" style={{ color }}>NHIỆT ĐỘ</span>
              <span className="font-mono-space text-sm font-bold" style={{ color }}>
                {Math.round(station04.temperature)}°C
                {station04.temperature >= 100 && (
                  <span className="ml-1 text-[9px] animate-pulse"> BƯỚC NHẢY!</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* ── Station 05: Pole distance slider ── */}
        {activeStation === 4 && (
          <div className="glass rounded-xl p-4 w-56" style={{ borderColor: `${color}20` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-orbitron text-[9px] tracking-widest" style={{ color }}>
                KHOẢNG CÁCH CỰC
              </span>
              <span className="font-mono-space text-[10px] text-white">
                {station05.poleDistance.toFixed(1)}u
              </span>
            </div>
            <input
              id="s05-distance-slider"
              type="range"
              min={1.5}
              max={6}
              step={0.05}
              value={station05.poleDistance}
              onChange={(e) => setStation05({ poleDistance: parseFloat(e.target.value) })}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${color} ${((station05.poleDistance - 1.5) / 4.5) * 100}%, #1e2a3a ${((station05.poleDistance - 1.5) / 4.5) * 100}%)`,
                accentColor: color,
              }}
            />
            <div className="flex justify-between font-mono-space text-[8px] mt-1 text-slate-500">
              <span>ĐẤU TRANH</span>
              <span>THỐNG NHẤT</span>
            </div>
          </div>
        )}

        {/* ── Station 06: Drag hint ── */}
        {activeStation === 5 && (
          <div className="glass rounded-xl px-4 py-3 w-56" style={{ borderColor: `${color}20` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="font-mono-space text-[9px] text-slate-400 tracking-wider">
                Kéo để bay theo đường xoắn ốc
              </span>
            </div>
          </div>
        )}

        {/* ── Station 07: Click hint ── */}
        {activeStation === 6 && (
          <div className="glass rounded-xl px-4 py-3 w-56" style={{ borderColor: `${color}20` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="font-mono-space text-[9px] text-slate-400 tracking-wider">
                Click mặt Hypercube để khám phá phạm trù
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
