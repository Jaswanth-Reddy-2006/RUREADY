import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Network, 
  Code2, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  Terminal
} from 'lucide-react';
import { CORE_CS_SUBJECTS, CsSubject, CsQuestion } from '../../data/coreCs.data';

export default function CoreCsHub() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('os');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const currentSubject = CORE_CS_SUBJECTS.find((s) => s.id === selectedSubjectId) || CORE_CS_SUBJECTS[0];

  const filteredQuestions = currentSubject.questions.filter((q) => 
    q.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchFilter.toLowerCase()) ||
    q.companyTags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#4A8BDF]">
            <Cpu className="w-3.5 h-3.5" />
            <span>High-Yield CS Fundamentals Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Core CS Subjects & Interview Bank
          </h1>
          <p className="text-base sm:text-lg text-[#526078] leading-relaxed">
            Essential Operating Systems, DBMS, Computer Networks, and OOPs concepts asked in over 85% of technical campus recruitment rounds.
          </p>
        </div>

        {/* Top Subject Selection Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {CORE_CS_SUBJECTS.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setExpandedQuestionId(null);
                }}
                className={`p-4 sm:p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-white border-[#4A8BDF] ring-2 ring-[#4A8BDF]/20 shadow-md'
                    : 'bg-white/80 border-[#DCE7F2] hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{sub.icon}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#EFFAFD] text-[#4A8BDF]' : 'bg-slate-100 text-[#7E8B9B]'
                  }`}>
                    {sub.code}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#11183D] font-sans">
                  {sub.name}
                </h3>
                <p className="text-[11px] text-[#526078] line-clamp-1 mt-1">
                  {sub.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Subject Detail Overview Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentSubject.icon}</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#11183D] font-sans">
                  {currentSubject.name} Mastery Guide
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#526078]">
                {currentSubject.overview}
              </p>
            </div>

            {currentSubject.id === 'dbms' && (
              <Link
                to="/sql-playground"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans shadow-sm transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Launch Interactive SQL Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* High-Yield Topics Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7E8B9B]">
              Essential Theoretical Pillars & Cheat Sheets:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSubject.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] space-y-3 hover:border-[#4A8BDF]/40 transition-colors"
                >
                  <h4 className="text-sm font-extrabold text-[#11183D] font-sans">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-[#526078] leading-relaxed">
                    {topic.summary}
                  </p>
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    {topic.coreConcepts.map((c, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-bold text-[#11183D]">{c.term}: </span>
                        <span className="text-[#526078]">{c.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Campus Interview Q&A Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#11183D] font-sans">
                Top Frequently Asked Interview Questions
              </h3>
              <p className="text-xs text-[#526078] mt-0.5">
                Detailed step-by-step answers with architectural breakdowns and code snippets
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter questions..."
                className="w-full px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#DCE7F2] text-xs text-[#11183D] placeholder-[#7E8B9B] focus:outline-none focus:ring-1 focus:ring-[#4A8BDF]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-100/60 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                          q.difficulty === 'Medium' ? 'bg-blue-50 text-[#4A8BDF]' :
                          'bg-purple-50 text-purple-700'
                        }`}>
                          {q.difficulty}
                        </span>
                        {q.companyTags.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold text-[#7E8B9B] bg-white border border-[#DCE7F2] px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-sm font-bold text-[#11183D] font-sans">
                        {q.question}
                      </h4>
                    </div>

                    <div className="p-1 rounded-full text-[#7E8B9B] shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 sm:p-5 pt-0 border-t border-[#DCE7F2] bg-white space-y-3"
                    >
                      <div className="pt-3">
                        <span className="text-[10px] uppercase font-bold text-[#7E8B9B] tracking-wider block mb-1">
                          Comprehensive Answer:
                        </span>
                        <p className="text-xs text-[#526078] leading-relaxed whitespace-pre-line">
                          {q.answer}
                        </p>
                      </div>

                      {q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="p-3 bg-[#EFFAFD] rounded-xl border border-[#DCE7F2] space-y-1">
                          <span className="text-xs font-bold text-[#11183D] block">Key Interview Takeaways:</span>
                          <ul className="space-y-1 text-xs text-[#526078]">
                            {q.keyPoints.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#4A8BDF] shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.codeSnippet && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#7E8B9B] font-mono">
                            Implementation Code ({q.language || 'Snippet'}):
                          </span>
                          <pre className="p-3 rounded-xl bg-[#0F172A] text-slate-100 text-xs font-mono overflow-x-auto">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end">
                        <Link
                          to="/interview/new"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A8BDF] hover:underline"
                        >
                          <span>Ask Ava to test me on this question</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
