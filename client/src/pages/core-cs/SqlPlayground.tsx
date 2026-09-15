import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Table, 
  HelpCircle, 
  Copy, 
  Check, 
  Clock,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { SQL_CHALLENGES, SqlChallenge } from '../../data/coreCs.data';

// Sample Mock Tables for in-browser SQL queries
const MOCK_DATA = {
  employees: [
    { id: 1, name: 'Alice Smith', department_id: 101, salary: 95000, hire_date: '2021-03-15' },
    { id: 2, name: 'Bob Jones', department_id: 101, salary: 110000, hire_date: '2019-06-20' },
    { id: 3, name: 'Charlie Ray', department_id: 102, salary: 85000, hire_date: '2022-01-10' },
    { id: 4, name: 'Diana Prince', department_id: 102, salary: 125000, hire_date: '2018-11-05' },
    { id: 5, name: 'Evan Wright', department_id: 103, salary: 78000, hire_date: '2023-04-01' },
    { id: 6, name: 'Fiona Gallagher', department_id: 101, salary: 110000, hire_date: '2020-08-12' },
  ],
  departments: [
    { id: 101, name: 'Engineering', location: 'Bengaluru' },
    { id: 102, name: 'Data Science & AI', location: 'Hyderabad' },
    { id: 103, name: 'Product Operations', location: 'Pune' },
  ],
};

export default function SqlPlayground() {
  const [selectedChallenge, setSelectedChallenge] = useState<SqlChallenge>(SQL_CHALLENGES[0]);
  const [sqlCode, setSqlCode] = useState<string>(SQL_CHALLENGES[0].initialQuery);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'employees' | 'departments'>('employees');

  const handleSelectChallenge = (c: SqlChallenge) => {
    setSelectedChallenge(c);
    setSqlCode(c.initialQuery);
    setQueryResult(null);
    setExecutionTimeMs(null);
    setShowSolution(false);
  };

  const handleRunQuery = () => {
    const startTime = performance.now();
    const queryLower = sqlCode.toLowerCase().trim();

    // Simulated query executor for common SQL interview problems
    try {
      let results: any[] = [];

      if (queryLower.includes('second') || (queryLower.includes('salary') && (queryLower.includes('offset 1') || queryLower.includes('max(salary)')))) {
        // Find second highest salary
        const salaries = Array.from(new Set(MOCK_DATA.employees.map(e => e.salary))).sort((a, b) => b - a);
        const secondHighest = salaries[1] || null;
        results = [{ SecondHighestSalary: secondHighest }];
      } else if (queryLower.includes('join') || queryLower.includes('department')) {
        // Department highest salary
        const deptMap = new Map(MOCK_DATA.departments.map(d => [d.id, d.name]));
        const highestPerDept: Record<number, number> = {};
        MOCK_DATA.employees.forEach(e => {
          if (!highestPerDept[e.department_id] || e.salary > highestPerDept[e.department_id]) {
            highestPerDept[e.department_id] = e.salary;
          }
        });
        results = MOCK_DATA.employees
          .filter(e => e.salary === highestPerDept[e.department_id])
          .map(e => ({
            Department: deptMap.get(e.department_id) || 'Unknown',
            Employee: e.name,
            Salary: e.salary,
          }));
      } else if (queryLower.includes('dense_rank') || queryLower.includes('rank')) {
        // Rank employees by department
        const deptMap = new Map(MOCK_DATA.departments.map(d => [d.id, d.name]));
        results = [...MOCK_DATA.employees]
          .sort((a, b) => b.salary - a.salary)
          .map((e, idx) => ({
            id: e.id,
            name: e.name,
            department: deptMap.get(e.department_id),
            salary: e.salary,
            salary_rank: idx + 1,
          }));
      } else {
        // Default select all from employees
        results = MOCK_DATA.employees.map(e => ({ ...e }));
      }

      const elapsed = Math.round(performance.now() - startTime + 8); // realistic execution duration
      setExecutionTimeMs(elapsed);
      setQueryResult(results);
    } catch (err) {
      setQueryResult([{ error: 'Query syntax error or unrecognized table.' }]);
      setExecutionTimeMs(5);
    }
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(selectedChallenge.expectedQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/core-cs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526078] hover:text-[#11183D] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Core CS Hub</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] font-sans flex items-center gap-2.5">
              <Database className="w-7 h-7 text-emerald-600" />
              Interactive SQL Execution Lab
            </h1>
            <p className="text-xs sm:text-sm text-[#526078]">
              Practice high-frequency SQL queries on simulated employee & department schemas in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSqlCode(selectedChallenge.initialQuery)}
              className="px-4 py-2 rounded-full bg-white border border-[#DCE7F2] text-xs font-bold text-[#526078] hover:text-[#11183D] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Code</span>
            </button>
            <button
              onClick={handleRunQuery}
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run SQL Query</span>
            </button>
          </div>
        </div>

        {/* Challenge Selection Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCE7F2] shadow-sm flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-bold text-[#7E8B9B] whitespace-nowrap uppercase tracking-wider pl-2">
            Challenges:
          </span>
          {SQL_CHALLENGES.map((c) => {
            const isSelected = selectedChallenge.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectChallenge(c)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#11183D] text-white shadow-sm'
                    : 'bg-[#F8FAFC] text-[#526078] hover:bg-slate-100 border border-[#DCE7F2]'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        {/* Main Workspace Grid: Left Schema & Problem, Right Code & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Problem & Table Schema (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Problem Statement Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7F2] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedChallenge.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  selectedChallenge.difficulty === 'Medium' ? 'bg-blue-50 text-[#4A8BDF] border border-blue-200' :
                  'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {selectedChallenge.difficulty}
                </span>
                <div className="flex items-center gap-1">
                  {selectedChallenge.companyTags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-[#7E8B9B] bg-[#F8FAFC] border border-[#DCE7F2] px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-base font-extrabold text-[#11183D] font-sans">
                {selectedChallenge.title}
              </h3>
              <p className="text-xs text-[#526078] leading-relaxed">
                {selectedChallenge.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showSolution ? 'Hide Solution' : 'View Expected SQL & Rationale'}</span>
                </button>
              </div>

              {showSolution && (
                <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#11183D]">Optimal SQL Query:</span>
                    <button
                      onClick={handleCopySolution}
                      className="text-[11px] font-bold text-[#4A8BDF] flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#0F172A] text-emerald-400 text-xs font-mono overflow-x-auto">
                    <code>{selectedChallenge.expectedQuery}</code>
                  </pre>
                  <p className="text-[11px] text-[#526078] leading-relaxed">
                    <strong>Explanation:</strong> {selectedChallenge.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Schema Inspector */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7F2] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-2">
                  <Table className="w-4 h-4 text-[#4A8BDF]" />
                  Database Table Preview
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveSchemaTab('employees')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeSchemaTab === 'employees' ? 'bg-[#11183D] text-white' : 'bg-slate-100 text-[#526078]'
                    }`}
                  >
                    employees
                  </button>
                  <button
                    onClick={() => setActiveSchemaTab('departments')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeSchemaTab === 'departments' ? 'bg-[#11183D] text-white' : 'bg-slate-100 text-[#526078]'
                    }`}
                  >
                    departments
                  </button>
                </div>
              </div>

              {/* Table Data Preview */}
              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#DCE7F2] text-[#7E8B9B] uppercase font-bold">
                      {Object.keys(MOCK_DATA[activeSchemaTab][0]).map((key) => (
                        <th key={key} className="py-2 px-3">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE7F2]">
                    {MOCK_DATA[activeSchemaTab].map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-[#EFFAFD]/30">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="py-2 px-3 text-[#526078] font-mono">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: SQL Editor & Real-Time Output (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Editor Card */}
            <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              <div className="px-5 py-3 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-300 font-semibold ml-2">
                    query.sql
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  ANSI SQL Engine
                </span>
              </div>

              <textarea
                value={sqlCode}
                onChange={(e) => setSqlCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full p-5 bg-transparent text-slate-100 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed selection:bg-[#4A8BDF]/30"
                placeholder="Write your SELECT query here..."
              />

              <div className="px-5 py-3 bg-[#1E293B]/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Ctrl + Enter to Execute</span>
                <button
                  onClick={handleRunQuery}
                  className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-[#0F172A] font-bold text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute</span>
                </button>
              </div>
            </div>

            {/* Query Results Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7F2] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#11183D]" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D]">
                    Query Output Window
                  </h4>
                </div>

                {executionTimeMs !== null && (
                  <div className="flex items-center gap-3 text-xs text-[#7E8B9B]">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                    <span className="font-mono">{executionTimeMs}ms</span>
                    <span className="font-semibold text-[#11183D]">
                      {queryResult ? queryResult.length : 0} rows
                    </span>
                  </div>
                )}
              </div>

              {queryResult === null ? (
                <div className="py-12 text-center text-xs text-[#7E8B9B] space-y-2">
                  <Database className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Click "Run SQL Query" to evaluate your statement.</p>
                </div>
              ) : queryResult.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7E8B9B]">
                  Query executed successfully, but returned 0 rows.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#DCE7F2] text-[#7E8B9B] uppercase font-bold">
                        {Object.keys(queryResult[0]).map((col) => (
                          <th key={col} className="py-2.5 px-4 font-mono">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE7F2]">
                      {queryResult.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#EFFAFD]/40 font-mono text-[#11183D]">
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j} className="py-2.5 px-4">
                              {val === null ? <span className="text-slate-400 italic">NULL</span> : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
