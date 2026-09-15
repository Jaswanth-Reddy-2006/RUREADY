import { motion } from 'framer-motion';
import { 
  Video, Code2, FileText, Compass, CheckCircle2, 
  TrendingUp, Sparkles, Brain, ShieldCheck, Zap, 
  Layers, Mic, Eye, Award, Target, MessageSquare
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function PracticeStatsBreakdown() {
  const { profile } = useProfileStore();
  const { oralStats, skills } = profile;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. AI Oral Mock Interview Mastery Card (6 Cols) */}
      <Card padding="lg" className="lg:col-span-6 border-[#DCE7F2] bg-white shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#A0006D]/10 text-[#A0006D]">
              <Video size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[#11183D]">Oral Interview Performance</h3>
              <p className="text-[11px] text-[#526078] font-body">STAR structure, speech delivery, and eye telemetry metrics</p>
            </div>
          </div>
          <Badge variant="eggplant" size="xs">
            {oralStats.interviewsCompleted} Sessions
          </Badge>
        </div>

        {/* 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>Average STAR Score</span>
              <Award size={14} className="text-[#4A8BDF]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#11183D] font-mono">{oralStats.avgScore}</span>
              <span className="text-xs font-mono text-[#526078]">/100</span>
            </div>
            <div className="h-1.5 w-full bg-[#DCE7F2] rounded-full overflow-hidden">
              <div className="h-full bg-[#4A8BDF] rounded-full" style={{ width: `${oralStats.avgScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/20 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#A0006D] font-medium">
              <span>STAR Compliance</span>
              <CheckCircle2 size={14} className="text-[#A0006D]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#A0006D] font-mono">{oralStats.starCompliance}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#A0006D]/15 rounded-full overflow-hidden">
              <div className="h-full bg-[#A0006D]" style={{ width: `${oralStats.starCompliance}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>Vocal Confidence</span>
              <Mic size={14} className="text-[#4A8BDF]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#11183D] font-mono">{oralStats.vocalConfidence}%</span>
              <span className="text-[10px] font-mono text-[#526078]">({oralStats.averagePacingWpm} wpm)</span>
            </div>
            <div className="h-1.5 w-full bg-[#DCE7F2] rounded-full overflow-hidden">
              <div className="h-full bg-[#4A8BDF]" style={{ width: `${oralStats.vocalConfidence}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F5F0] border border-[#168A62]/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#168A62] font-medium">
              <span>Eye Gaze Stability</span>
              <Eye size={14} className="text-[#168A62]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#168A62] font-mono">{oralStats.eyeContactScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#168A62]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#168A62]" style={{ width: `${oralStats.eyeContactScore}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Technical Coding & ATS Platform Insights (6 Cols) */}
      <Card padding="lg" className="lg:col-span-6 border-[#DCE7F2] bg-white shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#4A8BDF]/10 text-[#4A8BDF]">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[#11183D]">Technical Coding & ATS Metrics</h3>
              <p className="text-[11px] text-[#526078] font-body">Monaco sandbox solutions, code quality, and resume keywords</p>
            </div>
          </div>
          <Badge variant="teal" size="xs">
            Tier-1 Ready
          </Badge>
        </div>

        {/* 4 Technical Pillars */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>Code Quality Score</span>
              <Zap size={14} className="text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#11183D] font-mono">92%</span>
              <span className="text-[10px] text-emerald-600 font-semibold font-mono">Optimal</span>
            </div>
            <p className="text-[10px] text-[#526078]">Clean asymptotic bounds & modularity</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>ATS Resume Alignment</span>
              <FileText size={14} className="text-[#4A8BDF]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#4A8BDF] font-mono">91/100</span>
            </div>
            <p className="text-[10px] text-[#526078]">Calibrated for Tier-1 engineering JDs</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>Roadmap Modules</span>
              <Compass size={14} className="text-[#A0006D]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#11183D] font-mono">8 / 10</span>
            </div>
            <p className="text-[10px] text-[#526078]">Distributed systems & Microservices</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#526078] font-medium">
              <span>Discussion Answers</span>
              <MessageSquare size={14} className="text-[#168A62]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#168A62] font-mono">18</span>
              <span className="text-[10px] text-[#526078]">Upvoted</span>
            </div>
            <p className="text-[10px] text-[#526078]">Interview questions shared in hub</p>
          </div>
        </div>
      </Card>

    </div>
  );
}