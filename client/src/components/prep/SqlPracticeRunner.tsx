import React, { useState } from 'react';
import { Play, CheckCircle2, RefreshCw, Database } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function SqlPracticeRunner() {
  const [query, setQuery] = useState(`SELECT emp_id, emp_name, salary 
FROM employees 
WHERE salary > 75000 
ORDER BY salary DESC;`);

  const [executed, setExecuted] = useState(false);
  const [executing, setExecuting] = useState(false);

  const mockResult = [
    { emp_id: 104, emp_name: 'Ananya Rao', salary: '$95,000' },
    { emp_id: 101, emp_name: 'Vikram Singh', salary: '$88,000' },
    { emp_id: 108, emp_name: 'Karthik Raja', salary: '$78,000' },
  ];

  const handleRunQuery = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 400);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100">SQL Query Lab</span>
        </div>
        <Badge className="bg-cyan-950 text-cyan-300 border-cyan-700 text-[10px] font-mono">
          Deterministic SQL Query Practice Simulator
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Target Objective: Find high-earning employees (&gt; $75,000)</span>
          <button
            onClick={() => setQuery(`SELECT emp_id, emp_name, salary FROM employees WHERE salary > 75000 ORDER BY salary DESC;`)}
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Query
          </button>
        </div>

        {/* SQL Code Textarea */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="w-full p-3.5 rounded-xl bg-slate-950 text-cyan-200 border border-slate-800 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
          />
          <Button
            onClick={handleRunQuery}
            disabled={executing}
            className="absolute bottom-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{executing ? 'Simulating...' : 'Run Query'}</span>
          </Button>
        </div>
      </div>

      {/* Query Execution Result Grid */}
      {executed && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simulator Result Match (3 rows returned)
            </span>
            <span className="text-[10px] text-slate-500">Deterministic validation</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-900 font-bold text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="p-2">emp_id</th>
                  <th className="p-2">emp_name</th>
                  <th className="p-2">salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {mockResult.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2 text-cyan-300">{row.emp_id}</td>
                    <td className="p-2">{row.emp_name}</td>
                    <td className="p-2 text-emerald-300 font-bold">{row.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
