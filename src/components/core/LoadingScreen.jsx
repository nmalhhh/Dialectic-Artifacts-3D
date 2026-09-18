import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('init'); // 'init' | 'done'

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => {
          setPhase('done');
          setTimeout(onComplete, 700);
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 80);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian"
        >
          {/* Glowing center emblem */}
          <div className="relative mb-12">
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-cyan-DEFAULT opacity-60"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border border-violet-DEFAULT opacity-40"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-orbitron text-cyan-DEFAULT text-xs font-bold tracking-[0.3em] text-glow-cyan">
                MLM
              </span>
            </div>
            {/* Orbiting dot */}
            <motion.div
              className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1 rounded-full bg-cyan-DEFAULT shadow-glow"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50% 60px' }}
            />
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-orbitron text-center text-white text-lg md:text-2xl font-bold tracking-widest mb-2"
          >
            THE DIALECTIC ARTIFACTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="font-mono-space text-xs text-slate-400 tracking-[0.2em] mb-10 text-center px-4"
          >
            Bảo tàng Tương tác Triết học Mác – Lênin
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 md:w-80">
            <div className="flex justify-between font-mono-space text-[10px] text-slate-500 mb-2">
              <span>KHỞI TẠO HỆ THỐNG</span>
              <span className="text-cyan-DEFAULT">{Math.round(progress)}%</span>
            </div>
            <div className="h-px bg-surface-2 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-DEFAULT to-violet-DEFAULT"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
              {/* Scan line */}
              <div
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent loading-scan"
              />
            </div>
            <div className="mt-3 font-mono-space text-[9px] text-slate-600 tracking-widest">
              {progress < 30 && 'LOADING ONTOLOGICAL MATRICES...'}
              {progress >= 30 && progress < 60 && 'INITIALIZING DIALECTIC ENGINE...'}
              {progress >= 60 && progress < 90 && 'RENDERING PHILOSOPHICAL ARTIFACTS...'}
              {progress >= 90 && 'PREPARING INTERACTIVE MUSEUM...'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
