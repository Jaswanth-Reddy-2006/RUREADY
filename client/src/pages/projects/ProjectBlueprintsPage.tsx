import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Database, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  Code2, 
  Sparkles, 
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../../data/portfolioProjects.data';

export default function ProjectBlueprintsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PORTFOLIO_PROJECTS[0].id);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  const currentProject = PORTFOLIO_PROJECTS.find((p) => p.id === selectedProjectId) || PORTFOLIO_PROJECTS[0];

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F2] shadow-xs text-xs font-bold text-[#A0006D]">
            <Layers className="w-3.5 h-3.5" />
            <span>Tier-1 Portfolio Architectures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11183D] tracking-tight font-sans">
            Portfolio Project Blueprints & Defense
          </h1>
          <p className="text-sm sm:text-base text-[#526078]">
            Replace cookie-cutter clone projects with enterprise-grade architectures. Includes production database schemas, scaling bottlenecks, and top interview defense scripts.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PORTFOLIO_PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setExpandedQuestionIdx(0);
                }}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#4A8BDF] ring-2 ring-[#4A8BDF]/20 shadow-md'
                    : 'bg-white/80 border-[#DCE7F2] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFFAFD] text-[#4A8BDF]">
                    {proj.category}
                  </span>
                  <span className="text-[10px] font-semibold text-[#7E8B9B]">
                    {proj.difficulty}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#11183D] font-sans line-clamp-1">
                  {proj.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Project Detail Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DCE7F2]">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDF4FB] text-[#A0006D] border border-[#A0006D]/20">
                  {currentProject.category}
                </span>
                <span className="text-xs font-bold text-slate-400">•</span>
                <span className="text-xs font-bold text-[#526078]">{currentProject.difficulty}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#11183D] font-sans">
                {currentProject.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#526078]">
                {currentProject.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/resume-interview?project=${encodeURIComponent(currentProject.title)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11183D] hover:bg-[#1E293B] text-white text-xs font-bold font-sans shadow-sm transition-all"
              >
                <Target className="w-3.5 h-3.5 text-[#4A8BDF]" />
                <span>Grill Me on This Project</span>
              </Link>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#7E8B9B]">
              Production Stack:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] text-xs font-bold text-[#11183D]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture & Core Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#4A8BDF]" />
                Architecture Overview
              </h4>
              <p className="text-xs text-[#526078] leading-relaxed">
                {currentProject.architectureOverview}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Technical Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-[#526078]">
                {currentProject.coreFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#4A8BDF] font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Database Schema Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#4A8BDF]" />
              Database Architecture & Relations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentProject.databaseSchema.map((sch, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F2] space-y-2">
                  <div className="font-mono text-xs font-extrabold text-[#11183D] bg-white px-2 py-1 rounded-lg border border-[#DCE7F2] inline-block">
                    {sch.table}
                  </div>
                  <p className="text-[11px] text-[#526078]">{sch.description}</p>
                  <div className="pt-2 border-t border-slate-200">
                    <ul className="text-[10px] text-[#7E8B9B] space-y-1 font-mono">
                      {sch.columns.map((c, j) => (
                        <li key={j}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scaling Bottlenecks & Edge Cases */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Scale & Concurrency Edge Cases Interviewers Will Test:
            </h4>
            <ul className="space-y-1 text-xs text-amber-950">
              {currentProject.scalingChallenges.map((sc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-700">⚠️</span>
                  <span>{sc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 10 Project Defense Interview Q&A */}
          <div className="space-y-4 pt-4 border-t border-[#DCE7F2]">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#11183D] font-sans">
                Project Defense Interview Q&A
              </h3>
              <p className="text-xs text-[#526078] mt-0.5">
                Understand what the interviewer is secretly probing for and the exact architectural answer to deliver.
              </p>
            </div>

            <div className="space-y-3">
              {currentProject.interviewQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-100/60 cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#4A8BDF] font-mono block">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#11183D] mt-0.5">
                          {q.question}
                        </h4>
                      </div>
                      <div className="p-1 rounded-full text-[#7E8B9B]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#DCE7F2] bg-white space-y-3">
                        <div className="pt-3 p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 text-xs">
                          <strong className="text-purple-900 block mb-1">Interviewer Intent:</strong>
                          <span className="text-purple-950">{q.interviewerIntent}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs">
                          <strong className="text-[#11183D] block mb-1">Recommended Architectural Response:</strong>
                          <p className="text-[#526078] leading-relaxed">{q.idealAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
