import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, Map, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';
import { PREP_CATEGORIES } from '../../data/prepCurriculumData';

export default function SkillMapPage() {
  const navigate = useNavigate();
  const store = usePrepStore();
  const readiness = store.getPlacementReadiness();

  const [expandedCategory, setExpandedCategory] = useState<string | null>('CODING');
  const [expandedDomain, setExpandedDomain] = useState<string | null>('dsa');

  const getMasteryLevel = (score: number | null) => {
    if (score === null) return { label: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    if (score >= 90) return { label: 'Mastered', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (score >= 75) return { label: 'Strong', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 60) return { label: 'Developing', color: 'bg-blue-50 text-blue-800 border-blue-200' };
    if (score >= 45) return { label: 'Assessed', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (score >= 25) return { label: 'Practicing', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    return { label: 'Learning', color: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const getCategoryScore = (catId: string) => {
    if (readiness.overallScore === null) return null;
    switch (catId) {
      case 'FUNDAMENTALS': return readiness.aptitude;
      case 'CODING': return readiness.coding;
      case 'CORE_CS': return readiness.coreCs;
      case 'SYSTEM_DESIGN': return readiness.systemDesign;
      case 'DEVELOPMENT': return readiness.development;
      case 'INTERVIEW_PREP': return readiness.interviewPerformance;
      default: return readiness.overallScore;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <button
          onClick={() => navigate('/preparation')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
        </button>

        {/* Skill Map Header */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
              <Map className="w-4 h-4" /> Placement Preparation 2.0 Diagnostics
            </div>
            <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-xs font-mono font-bold">
              7 CATEGORIES • 27 DOMAINS
            </Badge>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Interactive Placement Skill Tree</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Drill down into domain subjects, sub-topics, and individual concepts to identify exact preparation strengths and gaps.
          </p>

          {/* 7 Mastery Stages Legend */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              7-Stage Mastery Progression Scale:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">1. Not Started</span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">2. Learning</span>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">3. Practicing</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">4. Assessed</span>
              <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">5. Developing</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">6. Strong</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">7. Mastered</span>
            </div>
          </div>
        </Card>

        {/* 7-Category Skill Tree */}
        <div className="space-y-4">
          {PREP_CATEGORIES.map((cat) => {
            const isCatExpanded = expandedCategory === cat.id;
            const catScore = getCategoryScore(cat.id);
            const catMastery = getMasteryLevel(catScore);

            return (
              <Card key={cat.id} className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                {/* Category Tier */}
                <div
                  onClick={() => setExpandedCategory(isCatExpanded ? null : cat.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isCatExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
                      <p className="text-xs text-slate-500 hidden sm:block">{cat.domains.length} Preparation Domains</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <Badge className={`${catMastery.color} text-[11px] font-mono font-bold`}>
                      {catMastery.label}
                    </Badge>
                    <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${catScore || 0}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800">{catScore !== null ? `${catScore}%` : 'Not Assessed'}</span>
                  </div>
                </div>

                {/* Domains Tier */}
                {isCatExpanded && (
                  <div className="pl-6 space-y-3 border-l-2 border-blue-100 pt-2">
                    {cat.domains.map((dom) => {
                      const isDomExpanded = expandedDomain === dom.id;
                      const domMastery = getMasteryLevel(catScore);

                      return (
                        <div key={dom.id} className="space-y-2">
                          <div
                            onClick={() => setExpandedDomain(isDomExpanded ? null : dom.id)}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 text-xs font-semibold"
                          >
                            <div className="flex items-center gap-2">
                              {isDomExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                              <span className="text-slate-900 font-bold">{dom.name}</span>
                              <span className="text-slate-400 font-normal text-[11px]">({dom.topicCount} Topics)</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono">
                              <Badge className={`${domMastery.color} text-[10px] font-mono`}>
                                {domMastery.label}
                              </Badge>
                              <span className="font-bold text-blue-700">{catScore !== null ? `${catScore}%` : '--'}</span>
                            </div>
                          </div>

                          {/* Concepts Tier */}
                          {isDomExpanded && (
                            <div className="pl-6 space-y-1.5 border-l-2 border-slate-200">
                              {dom.focusTopics.map((topic, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                                  <span className="text-slate-700 font-medium">{topic}</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/preparation/practice/${dom.id}`);
                                      }}
                                      className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-lg"
                                    >
                                      Practice Topic
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
