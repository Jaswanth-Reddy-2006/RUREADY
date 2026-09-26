import { useState, useEffect } from 'react';
import {
  Calculator,
  HardDrive,
  Cpu,
  Activity,
  Zap,
  Server,
  Layers,
  ArrowDownUp,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';
import { CapacityInputs } from '../../api/systemDesign';

export default function CapacityCalculatorPanel() {
  const { session, capacityInputs, capacityOutputs, calculateCapacity } = useSystemDesignStore();

  const [inputs, setInputs] = useState<CapacityInputs>({
    dau: capacityInputs?.dau || session?.problem?.trafficDefaults?.dau || 10_000_000,
    readsPerUserPerDay: capacityInputs?.readsPerUserPerDay ?? session?.problem?.trafficDefaults?.readsPerUserPerDay ?? 20,
    writesPerUserPerDay: capacityInputs?.writesPerUserPerDay ?? session?.problem?.trafficDefaults?.writesPerUserPerDay ?? 2,
    avgReadPayloadBytes: capacityInputs?.avgReadPayloadBytes || session?.problem?.trafficDefaults?.avgReadPayloadBytes || 2048,
    avgWritePayloadBytes: capacityInputs?.avgWritePayloadBytes || session?.problem?.trafficDefaults?.avgWritePayloadBytes || 512,
    peakMultiplier: capacityInputs?.peakMultiplier || 2.5,
    retentionYears: capacityInputs?.retentionYears || 5,
    replicationFactor: capacityInputs?.replicationFactor || 3,
  });

  useEffect(() => {
    if (capacityInputs) {
      setInputs(capacityInputs);
    }
  }, [capacityInputs]);

  const handleSliderChange = (field: keyof CapacityInputs, val: number) => {
    const updated = { ...inputs, [field]: val };
    setInputs(updated);
    calculateCapacity(updated);
  };

  const outputs = capacityOutputs;

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-y-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-[#EFFAFD] text-[#4A8BDF]">
            <Calculator size={16} />
          </div>
          <h3 className="font-bold text-sm text-slate-800">
            Deterministic Capacity Estimator
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Adjust traffic assumptions to calculate QPS, bandwidth, storage, and cluster sizing mathematically.
        </p>
      </div>

      {/* Primary Scale Sliders */}
      <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          Traffic Assumptions
        </h4>

        {/* DAU */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600">Daily Active Users (DAU)</span>
            <span className="text-[#4A8BDF] font-mono font-bold">
              {(inputs.dau / 1_000_000).toFixed(1)} Million
            </span>
          </div>
          <input
            type="range"
            min="1000000"
            max="200000000"
            step="1000000"
            value={inputs.dau}
            onChange={(e) => handleSliderChange('dau', Number(e.target.value))}
            className="w-full accent-[#4A8BDF] cursor-pointer"
          />
        </div>

        {/* Reads & Writes Per User */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Reads / User / Day</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.readsPerUserPerDay}</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={inputs.readsPerUserPerDay}
              onChange={(e) => handleSliderChange('readsPerUserPerDay', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Writes / User / Day</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.writesPerUserPerDay}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.5"
              value={inputs.writesPerUserPerDay}
              onChange={(e) => handleSliderChange('writesPerUserPerDay', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
        </div>

        {/* Payloads */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Read Payload</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.avgReadPayloadBytes} B</span>
            </div>
            <input
              type="range"
              min="128"
              max="16384"
              step="128"
              value={inputs.avgReadPayloadBytes}
              onChange={(e) => handleSliderChange('avgReadPayloadBytes', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Write Payload</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.avgWritePayloadBytes} B</span>
            </div>
            <input
              type="range"
              min="128"
              max="8192"
              step="128"
              value={inputs.avgWritePayloadBytes}
              onChange={(e) => handleSliderChange('avgWritePayloadBytes', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
        </div>

        {/* Multipliers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Peak Multiplier</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.peakMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={inputs.peakMultiplier || 2.5}
              onChange={(e) => handleSliderChange('peakMultiplier', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Retention</span>
              <span className="text-slate-800 font-mono font-bold">{inputs.retentionYears} Yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={inputs.retentionYears || 5}
              onChange={(e) => handleSliderChange('retentionYears', Number(e.target.value))}
              className="w-full accent-[#4A8BDF] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Calculated Output Cards */}
      {outputs && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Derived Calculations
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {/* QPS */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80">
              <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold mb-1 font-sans">
                <Activity size={14} />
                <span>Peak Throughput</span>
              </div>
              <div className="text-lg font-black text-sky-950 font-mono">
                {Math.round(outputs.peakTotalQps).toLocaleString()}{' '}
                <span className="text-xs font-medium text-sky-700">QPS</span>
              </div>
              <div className="text-[11px] text-sky-800 mt-1 font-mono">
                Avg Read: {Math.round(outputs.avgReadQps).toLocaleString()} /s • Write: {Math.round(outputs.avgWriteQps).toLocaleString()} /s
              </div>
            </div>

            {/* Bandwidth */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
              <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold mb-1 font-sans">
                <ArrowDownUp size={14} />
                <span>Egress Bandwidth</span>
              </div>
              <div className="text-lg font-black text-indigo-950 font-mono">
                {outputs.peakEgressBandwidthMbps.toFixed(1)}{' '}
                <span className="text-xs font-medium text-indigo-700">Mbps</span>
              </div>
              <div className="text-[11px] text-indigo-800 mt-1 font-mono">
                Ingress: {outputs.peakIngressBandwidthMbps.toFixed(2)} Mbps
              </div>
            </div>

            {/* Storage */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1 font-sans">
                <HardDrive size={14} />
                <span>5-Yr Total Storage</span>
              </div>
              <div className="text-lg font-black text-emerald-950 font-mono">
                {outputs.totalStorageWithReplicationFormatted}
              </div>
              <div className="text-[11px] text-emerald-800 mt-1 font-mono">
                Daily: {outputs.dailyStorageFormatted} (3x Repl)
              </div>
            </div>

            {/* 80/20 Cache */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold mb-1 font-sans">
                <Zap size={14} />
                <span>80/20 Cache RAM</span>
              </div>
              <div className="text-lg font-black text-rose-950 font-mono">
                {outputs.cacheMemoryRequiredFormatted}
              </div>
              <div className="text-[11px] text-rose-800 mt-1 font-mono">
                20% Daily Read Volume
              </div>
            </div>
          </div>

          {/* Sizing Recommendations */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Server size={14} className="text-[#4A8BDF]" />
              <span>Recommended Infrastructure Sizing</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="bg-slate-800/80 p-2 rounded-xl text-center">
                <div className="text-slate-400 text-[10px]">App Servers</div>
                <div className="text-base font-bold text-white mt-0.5">~{outputs.recommendedAppServers}</div>
                <div className="text-[9px] text-slate-500">N+2 Redundant</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl text-center">
                <div className="text-slate-400 text-[10px]">DB Shards</div>
                <div className="text-base font-bold text-white mt-0.5">~{outputs.recommendedDbShards}</div>
                <div className="text-[9px] text-slate-500">Partitioned</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl text-center">
                <div className="text-slate-400 text-[10px]">Redis Nodes</div>
                <div className="text-base font-bold text-white mt-0.5">~{outputs.recommendedRedisNodes}</div>
                <div className="text-[9px] text-slate-500">32GB RAM / 70%</div>
              </div>
            </div>
          </div>

          {/* Calculation Step Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Step-by-Step Derivations
            </h4>
            <div className="space-y-1.5 text-xs">
              {outputs.breakdown.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-0.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{item.title}</span>
                    <span className="font-mono text-[#4A8BDF] font-bold">{item.result}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{item.formula}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
