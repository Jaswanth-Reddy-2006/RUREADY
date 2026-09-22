import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Award,
  Code2,
  Boxes,
  Server,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';
import {
  PREP_CATEGORIES,
  APTITUDE_FORMULA_SHEETS,
  CODING_PATTERNS_DATA,
  LLD_PROBLEMS_DATA,
  HLD_CASE_STUDIES_DATA,
} from '../../data/prepCurriculumData';

export default function SubjectOverviewPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const store = usePrepStore();
  const readiness = store.getPlacementReadiness();

  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'FORMULAS' | 'PATTERNS' | 'LLD' | 'HLD'>('SYLLABUS');
  const [expandedPattern, setExpandedPattern] = useState<string | null>('sliding-window');
  const [expandedLld, setExpandedLld] = useState<string | null>('parking-lot');
  const [expandedHld, setExpandedHld] = useState<string | null>('url-shortener');

  // Find domain in curriculum data
  const allDomains = PREP_CATEGORIES.flatMap((c) => c.domains);
  const currentDomain = allDomains.find((d) => d.id === subjectId || d.subjectKey === subjectId?.toUpperCase());

  const subjectTitle = currentDomain ? currentDomain.name : 'Subject Overview';
  const subjectDescription = currentDomain
    ? currentDomain.description
    : 'Comprehensive placement curriculum topics, exercises, and assessments.';

  // Sample Syllabus Topics
  const topicsMap = [
    {
      category: 'FOUNDATIONS & FUNDAMENTALS',
      topics: [
        { id: `${subjectId}-foundations-1`, name: `${subjectTitle} — Core Principles`, status: 'COMPLETED' },
        { id: `${subjectId}-foundations-2`, name: `${subjectTitle} — Standard Definitions & Rules`, status: 'COMPLETED' },
      ],
    },
    {
      category: 'CORE CONCEPTS & PATTERNS',
      topics: [
        { id: `${subjectId}-core-1`, name: `${subjectTitle} — Primary Problem Solving Methodologies`, status: 'CURRENT' },
        { id: `${subjectId}-core-2`, name: `${subjectTitle} — Intermediate Applications`, status: 'AVAILABLE' },
      ],
    },
    {
      category: 'ADVANCED APPLICATIONS & INTERVIEWS',
      topics: [
        { id: `${subjectId}-adv-1`, name: `${subjectTitle} — Advanced Interview Cases & Edge Conditions`, status: 'AVAILABLE' },
        { id: `${subjectId}-adv-2`, name: `${subjectTitle} — Comprehensive Mock Test Assessment`, status: 'AVAILABLE' },
      ],
    },
  ];

  const formulaEntries = Object.entries(APTITUDE_FORMULA_SHEETS);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <button
          onClick={() => navigate('/preparation')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
        </button>

        {/* Subject Header */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono font-bold">
                SUBJECT CURRICULUM
              </Badge>
              <h1 className="text-2xl font-bold text-slate-900">{subjectTitle}</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">{subjectDescription}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => navigate(`/preparation/learn/${subjectId || 'core-cs'}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                Start Learning
              </Button>
              <Button
                onClick={() => navigate(`/preparation/test/${subjectId || 'core-cs'}`)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                Take Subject Test
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">READINESS</span>
              <span className="font-bold text-blue-600 text-base">
                {readiness.overallScore !== null ? `${readiness.overallScore}%` : 'Not Assessed'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">EVIDENCE</span>
              <span className="font-bold text-slate-800 text-base">
                {readiness.evidenceStrength}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">TOPICS MASTERED</span>
              <span className="font-bold text-slate-800 text-base">
                {currentDomain ? `2 / ${currentDomain.topicCount} Topics` : '4 / 10 Topics'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px]">QUESTIONS AVAILABLE</span>
              <span className="font-bold text-slate-800 text-base">
                {currentDomain ? currentDomain.questionCount : 120}
              </span>
            </div>
          </div>
        </Card>

        {/* Specialized Feature Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('SYLLABUS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SYLLABUS'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Topic Syllabus Map
          </button>

          {(subjectId === 'quant' || subjectId === 'aptitude') && (
            <button
              onClick={() => setActiveTab('FORMULAS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'FORMULAS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Formula Sheets & Speed Math
            </button>
          )}

          {(subjectId === 'dsa' || subjectId === 'coding-patterns') && (
            <button
              onClick={() => setActiveTab('PATTERNS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'PATTERNS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              15 DSA Coding Patterns
            </button>
          )}

          {(subjectId === 'lld' || subjectId === 'system-design') && (
            <button
              onClick={() => setActiveTab('LLD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'LLD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              LLD Problem Walkthroughs
            </button>
          )}

          {(subjectId === 'hld' || subjectId === 'system-design') && (
            <button
              onClick={() => setActiveTab('HLD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'HLD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              HLD Case Studies
            </button>
          )}
        </div>

        {/* TAB 1: SYLLABUS MAP */}
        {activeTab === 'SYLLABUS' && (
          <div className="space-y-4">
            <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono block">
                5-Stage Placement Learning Loop
              </span>
              <div className="flex items-center justify-between text-xs text-center font-bold gap-1 overflow-x-auto pb-1">
                <div className="flex-1 p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 min-w-[80px]">1. Learn</div>
                <span className="px-1 text-slate-300">→</span>
                <div className="flex-1 p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 min-w-[80px]">2. Quick Check</div>
                <span className="px-1 text-slate-300">→</span>
                <div className="flex-1 p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 min-w-[80px]">3. Practice</div>
                <span className="px-1 text-slate-300">→</span>
                <div className="flex-1 p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 min-w-[80px]">4. Mini Test</div>
                <span className="px-1 text-slate-300">→</span>
                <div className="flex-1 p-2 rounded-xl bg-slate-900 text-cyan-300 min-w-[80px]">5. Mastery</div>
              </div>
            </Card>

            <div className="space-y-4">
              {topicsMap.map((section) => (
                <Card key={section.category} className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
                  <span className="text-xs font-bold text-slate-400 font-mono tracking-wider block uppercase">
                    {section.category}
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.topics.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => navigate(`/preparation/topic/${t.id}`)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                            : t.status === 'CURRENT'
                            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold block">{t.name}</span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-500">
                            {t.status === 'COMPLETED' ? '✓ Completed' : t.status === 'CURRENT' ? '→ Current' : '○ Available'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FORMULA SHEETS */}
        {activeTab === 'FORMULAS' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Quantitative Formula Reference & Speed Math Tricks</h3>
                  <p className="text-xs text-slate-500">Essential formulas for campus recruitment screening rounds.</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono font-bold">
                  {formulaEntries.length} TOPICS
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulaEntries.map(([topicName, formulas]) => (
                  <Card key={topicName} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono">{topicName}</span>
                      <Badge className="bg-white text-slate-700 border-slate-200 text-[10px]">
                        {formulas.length} Formulas
                      </Badge>
                    </div>

                    <ul className="space-y-2 text-xs">
                      {formulas.map((f, idx) => (
                        <li key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                          <span className="font-bold text-slate-800 block text-[11px]">{f.title}</span>
                          <code className="text-[11px] font-mono font-bold text-blue-700 block bg-blue-50/60 p-1 rounded">
                            {f.formula}
                          </code>
                          <p className="text-[10.5px] text-slate-600">{f.explanation}</p>
                          <span className="text-[10px] text-amber-700 font-medium block">
                            ⚡ Trap: {f.commonTraps}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: 15 DSA CODING PATTERNS */}
        {activeTab === 'PATTERNS' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">15 Algorithmic Coding Patterns</h3>
                  <p className="text-xs text-slate-500">Pattern recognition framework for online coding rounds and technical interviews.</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-mono font-bold">
                  {CODING_PATTERNS_DATA.length} PATTERNS
                </Badge>
              </div>

              <div className="space-y-3">
                {CODING_PATTERNS_DATA.map((pattern) => {
                  const isExpanded = expandedPattern === pattern.id;

                  return (
                    <Card key={pattern.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div
                        onClick={() => setExpandedPattern(isExpanded ? null : pattern.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Code2 className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-bold text-slate-900">{pattern.patternName}</h4>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>

                      {isExpanded && (
                        <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                              When to Use:
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">{pattern.whenToUse}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                              Key Problem Clues:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {pattern.clues.map((c, idx) => (
                                <Badge key={idx} className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                              Template Implementation:
                            </span>
                            <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto">
                              {pattern.templateCode}
                            </pre>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: LLD WALKTHROUGHS */}
        {activeTab === 'LLD' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Low-Level Object-Oriented Design (LLD)</h3>
                  <p className="text-xs text-slate-500">Master class diagrams, SOLID design principles, and design patterns.</p>
                </div>
                <Button
                  onClick={() => navigate('/oral/new?role=Software%20Engineer&focus=System%20Design%20LLD')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs shrink-0"
                >
                  Practice LLD Oral Interview →
                </Button>
              </div>

              <div className="space-y-3">
                {LLD_PROBLEMS_DATA.map((lld) => {
                  const isExpanded = expandedLld === lld.id;

                  return (
                    <Card key={lld.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div
                        onClick={() => setExpandedLld(isExpanded ? null : lld.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Boxes className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{lld.title}</h4>
                            <p className="text-xs text-slate-500">{lld.requirements.length} Core Requirements</p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>

                      {isExpanded && (
                        <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 uppercase font-mono text-[11px] block">
                              Key Classes & Interfaces:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {lld.classes.map((cls, idx) => (
                                <Badge key={idx} className="bg-white text-slate-800 border-slate-300 text-xs font-mono font-bold">
                                  {cls}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 uppercase font-mono text-[11px] block">
                              Design Patterns Applied:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {lld.patternsUsed.map((dp, idx) => (
                                <Badge key={idx} className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold">
                                  {dp}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button
                              onClick={() => navigate(`/oral/new?role=Software%20Engineer&focus=${encodeURIComponent(lld.title)}`)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                            >
                              Practice {lld.title} in Oral Interview Loop →
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: HLD CASE STUDIES */}
        {activeTab === 'HLD' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">High-Level Architecture (HLD) Case Studies</h3>
                  <p className="text-xs text-slate-500">Distributed systems, caching strategies, database sharding, and scalability.</p>
                </div>
                <Button
                  onClick={() => navigate('/oral/new?role=Senior%20Software%20Engineer&focus=System%20Design%20HLD')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs shrink-0"
                >
                  Practice System Design Interview →
                </Button>
              </div>

              <div className="space-y-3">
                {HLD_CASE_STUDIES_DATA.map((hld) => {
                  const isExpanded = expandedHld === hld.id;

                  return (
                    <Card key={hld.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div
                        onClick={() => setExpandedHld(isExpanded ? null : hld.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Server className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{hld.title}</h4>
                            <p className="text-xs text-slate-500">Est. Capacity: {hld.estimatedCapacity}</p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>

                      {isExpanded && (
                        <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 uppercase font-mono text-[11px] block">
                              Architecture Components:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {hld.architectureComponents.map((comp, idx) => (
                                <Badge key={idx} className="bg-white text-slate-800 border-slate-300 text-xs font-mono font-bold">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                                Database Strategy:
                              </span>
                              <p className="text-slate-600 leading-relaxed">{hld.databaseStrategy}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                                Caching Strategy:
                              </span>
                              <p className="text-slate-600 leading-relaxed">{hld.cachingStrategy}</p>
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button
                              onClick={() => navigate(`/oral/new?role=Senior%20Software%20Engineer&focus=${encodeURIComponent(hld.title)}`)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                            >
                              Practice {hld.title} in Oral Interview Loop →
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
