import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Database,
  Server,
  Layers,
  Info,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

export default function ArchitectureInspector() {
  const {
    nodes,
    selectedNodeId,
    validationReport,
    updateNodeConfig,
    setSelectedNodeId,
  } = useSystemDesignStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedNodeData = (selectedNode?.data as any) || null;
  const config = selectedNodeData?.config || {};

  const issues = validationReport?.issues || [];
  const passedChecks = validationReport?.passedChecks || [];
  const score = validationReport?.score || 100;

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto p-4 space-y-6">
      {/* Health Score Overview */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#4A8BDF]" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Architecture Health
            </span>
          </div>
          <span
            className={clsx(
              'text-xs font-bold font-mono px-2.5 py-0.5 rounded-full',
              score >= 90
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : score >= 70
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            )}
          >
            {validationReport?.status.replace('_', ' ') || 'HEALTHY'}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-black font-mono tracking-tight text-white">{score}%</div>
          <div className="text-xs text-slate-400 font-sans">
            {issues.length === 0 ? 'Zero architectural vulnerabilities detected' : `${issues.length} potential risk(s) identified`}
          </div>
        </div>

        {/* Progress meter */}
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-500 rounded-full',
              score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Selected Node Properties Editor */}
      {selectedNode && (
        <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={15} className="text-[#4A8BDF]" />
              <span className="text-xs font-bold text-slate-800 font-sans">
                Selected: {selectedNodeData.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              className="text-[10px] text-slate-500 hover:text-slate-800 underline"
            >
              Deselect
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">Instances</label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.instances || 1}
                onChange={(e) => updateNodeConfig(selectedNode.id, { instances: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-white border border-[#DCE7F2] rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">Replicas</label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.replication || 1}
                onChange={(e) => updateNodeConfig(selectedNode.id, { replication: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-white border border-[#DCE7F2] rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={!!config.hasRateLimiting}
                onChange={(e) => updateNodeConfig(selectedNode.id, { hasRateLimiting: e.target.checked })}
                className="rounded accent-[#4A8BDF]"
              />
              <span>Rate Limiting</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={!!config.isClustered}
                onChange={(e) => updateNodeConfig(selectedNode.id, { isClustered: e.target.checked })}
                className="rounded accent-[#4A8BDF]"
              />
              <span>Clustered</span>
            </label>
          </div>
        </div>
      )}

      {/* Identified Issues List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
          <span>Diagnostic Findings</span>
          <span className="text-slate-400 text-[11px] font-normal font-sans">
            {issues.length} Issues
          </span>
        </h4>

        {issues.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1.5">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-emerald-800">
              All Architectural Rules Passed
            </p>
            <p className="text-[11px] text-emerald-600">
              No single points of failure or unmitigated bottlenecks detected on canvas.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={clsx(
                  'p-3 rounded-2xl border transition-all text-xs space-y-1.5',
                  issue.severity === 'ERROR'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : issue.severity === 'WARNING'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-blue-50/70 border-blue-200 text-blue-950'
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle
                      size={14}
                      className={
                        issue.severity === 'ERROR'
                          ? 'text-rose-600'
                          : issue.severity === 'WARNING'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }
                    />
                    <span>{issue.title}</span>
                  </div>
                  <span
                    className={clsx(
                      'text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase',
                      issue.severity === 'ERROR'
                        ? 'bg-rose-200 text-rose-800'
                        : issue.severity === 'WARNING'
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-blue-200 text-blue-800'
                    )}
                  >
                    {issue.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-700 leading-snug">{issue.message}</p>

                <div className="pt-1 border-t border-black/5 text-[11px] font-medium text-slate-800 flex items-start gap-1">
                  <span className="text-[#4A8BDF] font-bold">Fix:</span>
                  <span>{issue.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Rules */}
      {passedChecks.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Verified Invariants
          </h4>
          <div className="space-y-1.5">
            {passedChecks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-sans">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
