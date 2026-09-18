import { create } from 'zustand';

const useStationStore = create((set) => ({
  // ─── Navigation ───────────────────────────────────────────────────
  activeStation: 0,       // 0–6
  isTransitioning: false,
  setStation: (idx) => set({ activeStation: idx, isTransitioning: true }),
  setTransitioning: (v) => set({ isTransitioning: v }),

  // ─── Station 01: Vật chất & Ý thức ───────────────────────────────
  station01: { practicalAction: false },
  setStation01: (patch) =>
    set((s) => ({ station01: { ...s.station01, ...patch } })),

  // ─── Station 02: Vận động & Đứng im ──────────────────────────────
  station02: { timeScale: 1.0 },
  setStation02: (patch) =>
    set((s) => ({ station02: { ...s.station02, ...patch } })),

  // ─── Station 04: Quy luật Lượng–Chất ────────────────────────────
  station04: { temperature: 0, isLeap: false },
  setStation04: (patch) =>
    set((s) => ({ station04: { ...s.station04, ...patch } })),

  // ─── Station 05: Quy luật Mâu thuẫn ─────────────────────────────
  station05: { poleDistance: 4.0 },
  setStation05: (patch) =>
    set((s) => ({ station05: { ...s.station05, ...patch } })),

  // ─── Station 07: Sáu Cặp Phạm Trù ───────────────────────────────
  station07: { activeCard: null },
  setStation07: (patch) =>
    set((s) => ({ station07: { ...s.station07, ...patch } })),
}));

export default useStationStore;
