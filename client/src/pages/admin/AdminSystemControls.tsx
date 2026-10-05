// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin System Feature Controls
// Single-purpose, instant-toggle module authorization matrix
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import {
  Sliders,
  RefreshCw,
  ShieldCheck,
  Check,
  X,
  Video,
  Code2,
  Network,
  Building2,
  Swords,
  FileText,
  Briefcase
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

const FEATURE_ICONS: Record<string, any> = {
  video_interview: Video,
  coding_interview: Code2,
  system_design_interview: Network,
  company_wise_interview: Building2,
  challenges_arena: Swords,
  ai_resume_ats: FileText,
  placement_crm: Briefcase,
};

export default function AdminSystemControls() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { features, updateFeature, fetchFeatures, isLoading } = useFeatureFlags();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFeatures();
    setIsRefreshing(false);
    toast.success('Feature states re-synchronized');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <Sliders size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#11183D] tracking-tight">
              Platform Feature Controls
            </h1>
          </div>
          <p className="text-xs text-[#526078]">
            Enable or disable platform features in real-time. Toggling instantly shows or hides the feature for all users across the platform without any reload.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2] border border-[#DCE7F2] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refresh System State"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Feature Authorization & Module Access Controls */}
      <Card padding="lg" className="bg-white border-[#DCE7F2] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#11183D]">Live Module Matrix</h2>
              <span className="text-[11px] text-[#526078]">Changes take effect immediately across all candidate sessions</span>
            </div>
          </div>
          <Badge variant="success" size="xs">Live Synchronized</Badge>
        </div>

        {/* Feature Flags List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(features).map(([key, flag]) => {
            const isEnabled = Boolean(flag.enabled);
            const IconComponent = FEATURE_ICONS[key] || ShieldCheck;

            const handleToggle = async (enable: boolean) => {
              await updateFeature(key, { enabled: enable });
              toast.success(`${flag.name} ${enable ? 'enabled' : 'disabled'}`);
            };

            return (
              <div
                key={key}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isEnabled
                    ? 'bg-white border-[#DCE7F2] shadow-2xs hover:border-[#4A8BDF]'
                    : 'bg-slate-50/90 border-slate-200'
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isEnabled
                        ? 'bg-blue-50 text-[#2459A8] border border-blue-100'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#11183D] truncate">
                        {flag.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-[#526078] mt-0.5 line-clamp-1">
                      {flag.description}
                    </p>
                  </div>
                </div>

                {/* Right: Simple Enable / Disable Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleToggle(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <Check size={13} />
                    <span>Enable</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(false)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isEnabled
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <X size={13} />
                    <span>Disable</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
