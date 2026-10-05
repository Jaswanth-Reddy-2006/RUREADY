import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, CheckCircle2, ShieldCheck, Clock,
  Award, Zap, Layers, Sparkles
} from 'lucide-react';

export default function SkillProfileSection() {
  const skillsData = [
    { name: 'Programming Languages', score: 78, level: 'Advanced', evidence: '14 Challenges Solved', trend: '+12%', lastAssessed: '2 days ago' },
    { name: 'Data Structures & Algorithms', score: 61, level: 'Intermediate', evidence: '28 LeetCode Drills', trend: '+5%', lastAssessed: 'Yesterday' },
    { name: 'Java & Object Oriented Systems', score: 72, level: 'Advanced', evidence: 'Sprint 07 Milestone', trend: '+8%', lastAssessed: 'Today' },
    { name: 'SQL & Database Engineering', score: 82, level: 'Expert', evidence: 'B-Tree Indexing Assessment', trend: '+15%', lastAssessed: '3 days ago' },
    { name: 'System Design & Distributed Systems', score: 32, level: 'Developing', evidence: 'Rate Limiter Module', trend: '+4%', lastAssessed: '5 days ago' },
    { name: 'Cloud Native & Microservices', score: 45, level: 'Developing', evidence: 'K8s Deployment Lab', trend: '+6%', lastAssessed: '1 week ago' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-6 font-body text-[#11183D]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE7F2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold font-display text-[#2459A8] uppercase tracking-wider mb-1">
            <BarChart2 size={14} />
            <span>Skill Intelligence & Mastery Profile</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-[#11183D]">
            Verified Skill Competencies
          </h2>
        </div>

        <span className="text-xs font-semibold text-[#168A62] bg-[#E8F5F0] px-3 py-1 rounded-full border border-[#168A62]/30">
          6 Active Skills Tracked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillsData.map((skill) => (
          <div key={skill.name} className="bg-[#EFFAFD]/60 p-4 rounded-2xl border border-[#DCE7F2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-display text-[#11183D]">{skill.name}</span>
              <span className="text-xs font-extrabold font-mono text-[#4A8BDF]">{skill.score}%</span>
            </div>

            <div className="w-full bg-[#DCE7F2] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4A8BDF] to-[#A0006D] h-full rounded-full transition-all duration-500"
                style={{ width: `${skill.score}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#526078] pt-1 border-t border-[#DCE7F2]/60">
              <span className="font-semibold text-[#168A62] flex items-center gap-1">
                <CheckCircle2 size={12} />
                {skill.evidence}
              </span>
              <span className="font-mono text-[#A0006D] font-bold">{skill.trend}</span>
              <span className="text-[#7B8799]">{skill.lastAssessed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
