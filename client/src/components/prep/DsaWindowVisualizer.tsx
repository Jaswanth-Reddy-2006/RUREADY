import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function DsaWindowVisualizer() {
  const arr = [2, 1, 5, 1, 3, 2];
  const k = 3;
  const [left, setLeft] = useState(0);

  const right = left + k - 1;
  const currentSum = arr.slice(left, right + 1).reduce((a, b) => a + b, 0);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 font-sans">
      <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider font-mono">
        <span>Sliding Window Visualizer</span>
        <span>Window Size K = {k}</span>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] text-slate-400 block font-mono">
          Array Elements & Active Window Pointers:
        </span>

        <div className="flex items-center justify-center gap-2 py-3">
          {arr.map((val, idx) => {
            const inWindow = idx >= left && idx <= right;
            const isLeftBound = idx === left;
            const isRightBound = idx === right;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500">
                  {isLeftBound ? '[L]' : isRightBound ? '[R]' : `[${idx}]`}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all border ${
                    inWindow
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-md scale-105'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400">Current Window Sum:</span>
        <span className="font-bold text-cyan-300 text-sm">
          {arr.slice(left, right + 1).join(' + ')} = {currentSum}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button
          disabled={left === 0}
          onClick={() => setLeft((prev) => Math.max(0, prev - 1))}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-1.5 rounded-lg disabled:opacity-50"
        >
          ← Slide Left
        </Button>

        <Button
          disabled={left >= arr.length - k}
          onClick={() => setLeft((prev) => Math.min(arr.length - k, prev + 1))}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1"
        >
          <span>Slide Right</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
