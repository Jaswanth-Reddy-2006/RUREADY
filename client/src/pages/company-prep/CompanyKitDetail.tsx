import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Video, 
  ShieldCheck, 
  Calendar, 
  FileText,
  Percent,
  Check
} from 'lucide-react';
import { COMPANY_KITS } from '../../data/companyKits.data';

export default function CompanyKitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pattern' | 'rounds' | 'questions' | 'roadmap'>('pattern');

  const kit = COMPANY_KITS.find((k) => k.id.toLowerCase() === id?.toLowerCase()) || COMPANY_KITS[0];

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/company-prep"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#526078] hover:text-[#11183D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Placement Kits</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7E8B9B]">Placement Track:</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF]">
              {kit.tierLabel}
            </span>
          </div>
        </div>

        {/* Company Overview Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] flex items-center justify-center text-3xl shadow-xs shrink-0">
                {kit.logo}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] font-sans">
                    {kit.name}
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4A8BDF] border border-blue-200">
                    {kit.tier}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#526078] mt-1">
                  Roles: {kit.hiringRoles.join(' • ')}
                </p>
                <p className="text-sm font-extrabold text-emerald-700 mt-2 font-sans">
                  {kit.packageRange}
                </p>
              </div>
            </div>

            {/* CTA: Launch Calibrated Mock */}
            <div className="shrink-0 flex flex-col sm:items-end gap-2">
              <Link
                to={`/interview/new?company=${kit.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
              >
                <Video className="w-4 h-4 text-[#4A8BDF]" />
                <span>Simulate {kit.name.split(' ')[0]} Mock</span>
              </Link>
              <span className="text-[11px] text-[#7E8B9B]">
                Calibrated against {kit.roundsCount} recruitment stages
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCE7F2] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#526078]">
            <div className="space-y-1">
              <span className="font-bold text-[#11183D] block">Eligibility & Criteria:</span>
              <p className="leading-relaxed">{kit.eligibility}</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-[#11183D] block">Hiring Strategy Overview:</span>
              <p className="leading-relaxed">{kit.overview}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-[#DCE7F2] overflow-x-auto pb-2">
          {[
            { id: 'pattern', label: '1. Exam Pattern & Syllabus', icon: FileText },
            { id: 'rounds', label: `2. All ${kit.roundsCount} Rounds Breakdown`, icon: Layers },
            { id: 'questions', label: '3. High-Frequency Interview Q&A', icon: HelpCircle },
            { id: 'roadmap', label: '4. 4-Week Prep Blueprint', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#11183D] text-white shadow-sm'
                    : 'bg-white text-[#526078] hover:bg-[#F8FAFC] border border-[#DCE7F2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXAM PATTERN & SYLLABUS */}
        {activeTab === 'pattern' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE7F2]">
              <div>
                <h3 className="text-lg font-extrabold text-[#11183D] font-sans">
                  Round 1 Online Assessment Blueprint
                </h3>
                <p className="text-xs text-[#526078] mt-0.5">
                  Administered on: <strong className="text-[#11183D]">{kit.examPattern.platform}</strong>
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${kit.examPattern.negativeMarking ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {kit.examPattern.negativeMarking ? '⚠️ Negative Marking Active' : '✅ No Negative Marking'}
              </span>
            </div>

            {/* Sections Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#DCE7F2] text-[#7E8B9B] uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Section Name</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Time Allocated</th>
                    <th className="py-3 px-4">Recommended Cutoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE7F2]">
                  {kit.examPattern.sections.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-[#EFFAFD]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#11183D]">{sec.name}</td>
                      <td className="py-3.5 px-4 text-[#526078] font-semibold">{sec.questions} MCQs</td>
                      <td className="py-3.5 px-4 text-[#526078]">{sec.timeMinutes} mins</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ≥ {sec.cutoffPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Repeated Topics Highlight */}
            <div className="p-5 bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D]">
                Core Topics Repeated Every Placement Cycle:
              </h4>
              <div className="flex flex-wrap gap-2">
                {kit.repeatedTopics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-white border border-[#DCE7F2] text-xs font-bold text-[#11183D]">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROUNDS BREAKDOWN */}
        {activeTab === 'rounds' && (
          <div className="space-y-4">
            {kit.rounds.map((rnd) => (
              <div
                key={rnd.number}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE7F2] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE7F2]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#11183D] text-white flex items-center justify-center text-xs font-bold font-sans">
                      {rnd.number}
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-[#11183D] font-sans">
                        {rnd.name}
                      </h4>
                      <span className="text-xs text-[#7E8B9B] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rnd.duration}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/interview/new?company=${kit.id}&round=${rnd.number}`}
                    className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1"
                  >
                    <span>Simulate Round {rnd.number}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <p className="text-xs text-[#526078] leading-relaxed">
                  {rnd.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] space-y-2">
                    <span className="text-xs font-extrabold text-[#11183D] block">Key Focus Areas:</span>
                    <ul className="space-y-1.5 text-xs text-[#526078]">
                      {rnd.focusAreas.map((fa, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4A8BDF] shrink-0 mt-0.5" />
                          <span>{fa}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                    <span className="text-xs font-extrabold text-amber-900 block">Candidate Secret Tips:</span>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {rnd.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: HIGH-FREQUENCY INTERVIEW QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#DCE7F2]">
              <h3 className="text-lg font-extrabold text-[#11183D] font-sans">
                Real Questions Recalled by Hired Candidates
              </h3>
              <p className="text-xs text-[#526078] mt-0.5">
                Practice answering these in our AI interview room with instant speech & clarity diagnostics
              </p>
            </div>

            <div className="space-y-3">
              {kit.sampleQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#DCE7F2] hover:border-[#4A8BDF] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-[#DCE7F2] text-[#11183D]">
                        {q.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                        q.difficulty === 'Medium' ? 'bg-blue-50 text-[#4A8BDF]' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#11183D]">
                      {q.question}
                    </p>
                  </div>
                  <Link
                    to="/interview/new"
                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF] hover:bg-[#EFFAFD] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Practice with Ava</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 4-WEEK ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            {kit.weekByWeekRoadmap.map((wk, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE7F2] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] font-extrabold text-xs border border-[#4A8BDF]/20 font-mono">
                      {wk.week}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#11183D] font-sans">
                      {wk.goal}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {wk.tasks.map((task, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] flex items-start gap-2.5 text-xs text-[#526078]"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
