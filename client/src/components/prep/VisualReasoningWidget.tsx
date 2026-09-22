import React from 'react';
import { Users, Compass, Network, Circle } from 'lucide-react';

interface VisualReasoningWidgetProps {
  type: 'SEATING' | 'DIRECTION' | 'BLOOD_RELATION' | 'SYLLOGISM';
  data?: any;
}

export default function VisualReasoningWidget({ type, data }: VisualReasoningWidgetProps) {
  if (type === 'SEATING') {
    return (
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Circular Seating Visualizer
          </span>
          <span className="font-mono text-[10px] text-slate-400">8-Person Facing Center</span>
        </div>

        {/* Circular Table Grid Diagram */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          {/* Table Circle */}
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-cyan-500/50 bg-slate-800/80 flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-cyan-300">TABLE</span>
          </div>

          {/* Seats around circle */}
          <div className="absolute top-1 font-bold text-xs bg-cyan-950 border border-cyan-500 text-cyan-200 px-2 py-0.5 rounded-md font-mono">
            A (North)
          </div>
          <div className="absolute bottom-1 font-bold text-xs bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded-md font-mono">
            E (South)
          </div>
          <div className="absolute left-0 font-bold text-xs bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded-md font-mono">
            G (West)
          </div>
          <div className="absolute right-0 font-bold text-xs bg-cyan-950 border border-cyan-500 text-cyan-200 px-2 py-0.5 rounded-md font-mono">
            C (East)
          </div>
          <div className="absolute top-6 left-5 font-bold text-[11px] text-slate-400 font-mono">H</div>
          <div className="absolute top-6 right-5 font-bold text-[11px] text-slate-400 font-mono">B</div>
          <div className="absolute bottom-6 left-5 font-bold text-[11px] text-slate-400 font-mono">F</div>
          <div className="absolute bottom-6 right-5 font-bold text-[11px] text-slate-400 font-mono">D</div>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-snug">
          Candidate A sits opposite E. B is immediate right of A. G is second to the left of A.
        </p>
      </div>
    );
  }

  if (type === 'DIRECTION') {
    return (
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Direction Grid Diagram
          </span>
          <span className="font-mono text-[10px] text-slate-400">2D Path Tracking</span>
        </div>

        <div className="relative w-44 h-36 mx-auto border border-slate-800 rounded-xl bg-slate-950 p-2 flex items-center justify-center">
          {/* Compass Rose */}
          <div className="absolute top-1 right-2 text-[9px] font-mono text-slate-500">
            N ↑ | E →
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 80">
            {/* Grid lines */}
            <line x1="10" y1="40" x2="90" y2="40" stroke="#334155" strokeDasharray="2" />
            <line x1="50" y1="10" x2="50" y2="70" stroke="#334155" strokeDasharray="2" />

            {/* Path */}
            <path d="M 20 60 L 20 20 L 70 20 L 70 40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3" />
            <circle cx="20" cy="60" r="3" fill="#22c55e" />
            <circle cx="70" cy="40" r="3" fill="#ef4444" />
          </svg>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-snug">
          Walks 10m North → Turns Right 15m East → Turns Right 5m South. Total Displacement: 15.8m NE.
        </p>
      </div>
    );
  }

  if (type === 'BLOOD_RELATION') {
    return (
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Network className="w-4 h-4" /> Family Tree Hierarchy
          </span>
          <span className="font-mono text-[10px] text-slate-400">3 Generations</span>
        </div>

        <div className="space-y-3 text-center text-xs font-mono">
          {/* Generation 1 */}
          <div className="flex justify-center items-center gap-4">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Grandfather [M]
            </div>
            <span className="text-slate-500 text-xs">═ (Married) ═</span>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Grandmother [F]
            </div>
          </div>

          <div className="text-slate-600 text-xs">│</div>

          {/* Generation 2 */}
          <div className="flex justify-center items-center gap-4">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-200">
              Father [M]
            </div>
            <span className="text-slate-500 text-xs">═</span>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Mother [F]
            </div>
          </div>

          <div className="text-slate-600 text-xs">│</div>

          {/* Generation 3 */}
          <div className="flex justify-center items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-200 text-[11px]">
              Candidate (Son)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SYLLOGISM Venn diagram fallback
  return (
    <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
      <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Circle className="w-4 h-4" /> Syllogism Venn Diagram
        </span>
        <span className="font-mono text-[10px] text-slate-400">Set Logic</span>
      </div>

      <div className="relative w-44 h-28 mx-auto flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-blue-500 bg-blue-500/20 absolute left-4 flex items-center justify-start pl-2">
          <span className="text-[10px] font-bold text-blue-300">All A</span>
        </div>
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500 bg-emerald-500/20 absolute right-4 flex items-center justify-end pr-2">
          <span className="text-[10px] font-bold text-emerald-300">Some B</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center leading-snug">
        Conclusion I: "Some A are B" (True). Conclusion II: "All B are A" (False).
      </p>
    </div>
  );
}
