import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useAuthStore } from '../../store/authStore';

interface FeatureGuardProps {
  featureKey: string;
  featureTitle?: string;
  children: React.ReactNode;
}

export default function FeatureGuard({ featureKey, featureTitle, children }: FeatureGuardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isFeatureEnabled, features } = useFeatureFlags();

  const isAllowed = isFeatureEnabled(featureKey);
  const flag = features[featureKey];

  if (!isAllowed) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#F8FAFD]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DCE7F2] p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-amber-100 text-amber-900 inline-block">
              Feature Unavailable
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              {featureTitle || flag?.name || 'Module Under Maintenance'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              This feature has been temporarily paused by the platform administrator or is restricted for your current account tier.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/video')}
              className="px-5 py-2.5 rounded-xl bg-[#2459A8] hover:bg-[#1D4A8C] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Explore Video Interviews</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
