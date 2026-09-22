import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  Code2,
  Database,
  FileText,
  Calculator,
  ArrowRight,
  Sparkles,
  Layers,
  Building2,
  Activity,
  BarChart2,
  Code,
  GitBranch,
  Trophy,
  Terminal,
  Cpu,
  Boxes,
  Network,
  Server,
  Globe,
  Wrench,
  GitPullRequest,
  ShieldCheck,
  Bot,
  UserCheck,
  Zap,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PreparationHeader from '../../components/prep/PreparationHeader';
import ReadinessCard from '../../components/prep/ReadinessCard';
import SubjectCard, { SubjectCardData } from '../../components/prep/SubjectCard';
import { usePrepStore } from '../../store/usePrepStore';
import { PREP_CATEGORIES, PrepDomainConfig } from '../../data/prepCurriculumData';
import { PrepCategoryType } from '@ru-ready/shared';

export default function PreparationCommandCenter() {
  const navigate = useNavigate();

  const store = usePrepStore();
  const readiness = store.getPlacementReadiness();
  const recommendations = store.getDynamicRecommendations();
  const activityLogs = store.getActivityLogs();
  const learningProgress = store.learningProgress;

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const isAssessed = readiness.overallScore !== null;

  // Icon Resolver
  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'BarChart2': return <BarChart2 className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'Network': return <Network className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'GitPullRequest': return <GitPullRequest className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  // Flatten all 27 domain configurations
  const allDomains: PrepDomainConfig[] = PREP_CATEGORIES.flatMap((c) => c.domains);

  // Filtered domains based on selected tab
  const filteredDomains =
    activeCategory === 'ALL'
      ? allDomains
      : allDomains.filter((d) => d.category === activeCategory);

  // Map to SubjectCardData format
  const mappedSubjectCards: SubjectCardData[] = filteredDomains.map((d) => {
    let domainReadiness: number | null = null;
    if (isAssessed) {
      if (d.category === 'FUNDAMENTALS') domainReadiness = readiness.aptitude;
      else if (d.category === 'CODING') domainReadiness = readiness.coding;
      else if (d.category === 'CORE_CS') domainReadiness = readiness.coreCs;
      else if (d.category === 'SYSTEM_DESIGN') domainReadiness = readiness.systemDesign;
      else if (d.category === 'DEVELOPMENT') domainReadiness = readiness.development;
      else if (d.category === 'INTERVIEW_PREP') domainReadiness = readiness.interviewPerformance;
      else domainReadiness = readiness.overallScore;
    }

    return {
      id: d.id,
      name: d.name,
      description: d.description,
      icon: getDomainIcon(d.iconName),
      readiness: domainReadiness,
      evidenceStrength: isAssessed ? readiness.evidenceStrength : 'NOT_ASSESSED',
      topicsCompleted: Math.min(4, d.topicCount),
      totalTopics: d.topicCount,
      questionsAttempted: isAssessed ? 25 : 0,
      totalQuestions: d.questionCount,
      focusAreas: d.focusTopics,
    };
  });

  const categoryTabs = [
    { id: 'ALL', label: 'All 27 Domains' },
    { id: 'FUNDAMENTALS', label: 'Fundamentals' },
    { id: 'CODING', label: 'Coding & DSA' },
    { id: 'CORE_CS', label: 'Core CS' },
    { id: 'SYSTEM_DESIGN', label: 'System Design' },
    { id: 'DEVELOPMENT', label: 'Development' },
    { id: 'SPECIALIZED', label: 'Specialized' },
    { id: 'INTERVIEW_PREP', label: 'Interview Prep' },
  ];

  const activeLessonProgress = learningProgress['dbms-normalization']?.completionPercentage || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. HEADER */}
        <PreparationHeader isAssessed={isAssessed} />

        {/* 2. READINESS / CURRENT STATUS */}
        <ReadinessCard readiness={readiness} />

        {/* 3. TODAY'S PREPARATION PLAN */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Today's Preparation Agenda</h2>
            <p className="text-xs text-slate-500">Personalized adaptive plan built from diagnostic skill gaps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec) => (
              <Card
                key={rec.id}
                className="p-5 bg-white border-slate-200/80 shadow-xs hover:border-blue-300 rounded-3xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-[10px] font-mono font-bold ${
                        rec.type === 'LEARN'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : rec.type === 'PRACTICE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {rec.type} • {rec.estimatedTime}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-mono">
                      {rec.priority} PRIORITY
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{rec.title}</h3>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                      Why Recommended:
                    </span>
                    <p className="text-[11px] leading-snug">{rec.reason}</p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(rec.targetRoute)}
                  className={`w-full text-white text-xs font-bold py-2.5 rounded-xl shadow-xs ${
                    rec.type === 'LEARN'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : rec.type === 'PRACTICE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Start {rec.type === 'LEARN' ? 'Lesson' : rec.type === 'PRACTICE' ? 'Practice' : 'Test'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. CONTINUE LEARNING */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Active Learning Session</h2>

          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-mono font-bold">
                  ACTIVE LESSON
                </Badge>
                <span className="text-xs font-bold text-slate-800">DBMS Normalization → 3NF & BCNF</span>
              </div>
              <div className="w-full max-w-md bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(25, activeLessonProgress)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-500 block">
                {Math.max(25, activeLessonProgress)}% completed
              </span>
            </div>

            <Button
              onClick={() => navigate('/preparation/learn/dbms-normalization')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shrink-0"
            >
              Continue Lesson →
            </Button>
          </Card>
        </div>

        {/* 5. 7-CATEGORY FILTER TABS & SUBJECT CARDS */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Placement Preparation Curriculum</h2>
              <p className="text-xs text-slate-500">27 structured preparation domains across 7 core placement categories.</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mappedSubjectCards.map((sub) => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        </div>

        {/* 6. SKILL GAPS / FOCUS AREAS */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Identified Diagnostic Skill Gaps</h2>
            <p className="text-xs text-slate-500">Targeted actions based on recent practice and assessment diagnostics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">DBMS → Normalization</span>
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-mono">
                  WEAKNESS
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Partial dependency confusion in 2NF candidate key identification.</p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => navigate('/preparation/learn/dbms-normalization')}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 rounded-lg"
                >
                  Learn
                </Button>
                <Button
                  onClick={() => navigate('/preparation/practice/dbms-normalization')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-lg"
                >
                  Practice
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">OS → Synchronization</span>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-mono">
                  NEEDS WORK
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Mutex locks, Semaphores, and Banker's deadlock avoidance.</p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => navigate('/preparation/learn/core-cs')}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 rounded-lg"
                >
                  Learn
                </Button>
                <Button
                  onClick={() => navigate('/preparation/practice/core-cs')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-lg"
                >
                  Practice
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Reasoning → Seating</span>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-mono">
                  PRACTICE NEEDED
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Circular seating facing inside/outside multi-variable puzzles.</p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => navigate('/preparation/learn/logical-reasoning')}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 rounded-lg"
                >
                  Learn
                </Button>
                <Button
                  onClick={() => navigate('/preparation/practice/logical-reasoning')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-lg"
                >
                  Practice
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 7. RECENT ACTIVITY */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Recent Preparation Activity</h2>

          {activityLogs.length === 0 ? (
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl text-center space-y-2">
              <Activity className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No activity recorded yet. Take a baseline assessment or start a practice session to begin tracking.</p>
            </Card>
          ) : (
            <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl divide-y divide-slate-100">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-mono text-[10px]">
                      {log.type}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{log.title}</span>
                      <span className="text-slate-500">{log.details}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
