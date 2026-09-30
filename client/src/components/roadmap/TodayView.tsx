import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Compass, CheckCircle2, Circle, BookOpen, Code2, FileText, Box,
  Trophy, Clock, Target, ChevronRight, Plus, Search, Bell, Share2,
  Linkedin, Github, Mic, ExternalLink, Copy, Download, RefreshCw,
  Layers, ShieldCheck, BarChart2, Laptop, Cloud, Shield, ArrowRight,
  ChevronLeft, Play, RotateCcw, MoreVertical, Check, SlidersHorizontal
} from 'lucide-react';
import { useRoadmapStore, Roadmap } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface TodayViewProps {
  onSelectRoadmapTab: () => void;
  onSelectCategory?: (category: string) => void;
}

interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Learning' | 'Practice' | 'Test' | 'Build';
  duration: string;
  durationMinutes: number;
  completed: boolean;
  actionText: string;
  iconType: 'book' | 'code' | 'quiz' | 'box';
}

export default function TodayView({ onSelectRoadmapTab, onSelectCategory }: TodayViewProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    roadmaps,
    activeRoadmapId,
    enrolledRoadmapIds,
    setActiveRoadmap,
    claimRoadmap
  } = useRoadmapStore();

  // Find currently active user roadmap object
  const activeRoadmap = useMemo(() => {
    if (activeRoadmapId) {
      return roadmaps.find((r) => r.id === activeRoadmapId) || null;
    }
    if (enrolledRoadmapIds.length > 0) {
      return roadmaps.find((r) => r.id === enrolledRoadmapIds[0]) || null;
    }
    return null;
  }, [roadmaps, activeRoadmapId, enrolledRoadmapIds]);

  // Demo toggle state to switch between No Roadmap / Selected Roadmap if user wants
  const [forceNoRoadmap, setForceNoRoadmap] = useState(false);

  // Focus mode toggle
  const [focusMode, setFocusMode] = useState(false);

  // Career action tab
  const [careerTab, setCareerTab] = useState<'SUGGESTED' | 'VISUALS' | 'HASHTAGS'>('SUGGESTED');

  // Custom task modal / inline input
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubtitle, setNewTaskSubtitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Learning' | 'Practice' | 'Test' | 'Build'>('Learning');
  const [newTaskDuration, setNewTaskDuration] = useState('30');

  // Visual regeneration animation state
  const [isRegeneratingVisual, setIsRegeneratingVisual] = useState(false);

  // Default tasks for Today's Plan (matching Pic 2)
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Learn Decision Trees: Concepts & Intuition',
      subtitle: 'Entropy, Information Gain, Gini Impurity and how splits work.',
      category: 'Learning',
      duration: '45 min',
      durationMinutes: 45,
      completed: true,
      actionText: 'Review',
      iconType: 'book'
    },
    {
      id: 'task-2',
      title: 'Implement Decision Tree from scratch',
      subtitle: 'Build a simple model using scikit-learn and visualize it.',
      category: 'Practice',
      duration: '60 min',
      durationMinutes: 60,
      completed: true,
      actionText: 'Review',
      iconType: 'code'
    },
    {
      id: 'task-3',
      title: 'Complete 10-question assessment',
      subtitle: 'Test your understanding with mixed questions.',
      category: 'Test',
      duration: '15 min',
      durationMinutes: 15,
      completed: false,
      actionText: 'Start',
      iconType: 'quiz'
    },
    {
      id: 'task-4',
      title: 'Build a classification mini-project',
      subtitle: 'Use Decision Tree on a real dataset and analyze results.',
      category: 'Build',
      duration: '45 min',
      durationMinutes: 45,
      completed: false,
      actionText: 'Start',
      iconType: 'box'
    }
  ]);

  // GitHub tasks state
  const [githubTasks, setGithubTasks] = useState([
    { id: 'gh-1', text: "Push today's code", completed: true },
    { id: 'gh-2', text: "Update README", completed: true },
    { id: 'gh-3', text: "Add project screenshot", completed: false },
    { id: 'gh-4', text: "Write what you learned", completed: false }
  ]);

  // Milestone checklist state
  const [milestoneTasks, setMilestoneTasks] = useState([
    { id: 'm-1', text: 'Complete concept learning', completed: true },
    { id: 'm-2', text: 'Implement a model', completed: true },
    { id: 'm-3', text: 'Pass the assessment', completed: false },
    { id: 'm-4', text: 'Finish mini-project', completed: false }
  ]);

  // Task completion calculation
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const progressPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasksCount / tasks.length) * 100);
  }, [tasks, completedTasksCount]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleGithubTask = (id: string) => {
    setGithubTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleMilestoneTask = (id: string) => {
    setMilestoneTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subtitle: newTaskSubtitle.trim() || 'Custom daily practice task.',
      category: newTaskCategory,
      duration: `${newTaskDuration} min`,
      durationMinutes: parseInt(newTaskDuration) || 30,
      completed: false,
      actionText: 'Start',
      iconType: newTaskCategory === 'Learning' ? 'book' : newTaskCategory === 'Practice' ? 'code' : newTaskCategory === 'Test' ? 'quiz' : 'box'
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskSubtitle('');
    setIsAddingTask(false);
    toast.success('Custom task added to Today\'s plan!');
  };

  const handleCopyPost = () => {
    const postContent = `Today I learned how Decision Trees make predictions and built a classification model using scikit-learn. 🌲\n\nKey takeaways:\n• How entropy, information gain and gini impurity work\n• How a model chooses the best split\n• Built a project to classify Iris flowers and analyzed the results\n\nGrateful for this learning journey. On to Random Forests next!\n\n#MachineLearning #Python #DataScience #BuildInPublic #Rennetus`;
    navigator.clipboard.writeText(postContent);
    toast.success('LinkedIn post copied to clipboard!', { icon: '📋' });
  };

  const handleRegenerateVisual = () => {
    setIsRegeneratingVisual(true);
    setTimeout(() => {
      setIsRegeneratingVisual(false);
      toast.success('Visual chart regenerated!', { icon: '✨' });
    }, 1200);
  };

  const handleSelectCategoryCard = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    // Auto claim a default roadmap for that category if none is active
    const catMap = roadmaps.find(r => r.category === category || r.rolePath === category) || roadmaps[0];
    if (catMap) {
      claimRoadmap(catMap.id);
      setActiveRoadmap(catMap.id);
      setForceNoRoadmap(false);
    } else {
      onSelectRoadmapTab();
    }
  };

  const hasSelectedRoadmap = activeRoadmap && !forceNoRoadmap;

  // ══════════════════════════════════════════════════════════════════
  // INTERFACE 1: NO ROADMAP SELECTED (PIC 1)
  // ══════════════════════════════════════════════════════════════════
  if (!hasSelectedRoadmap) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Toggle option for testing */}
        {activeRoadmap && (
          <div className="flex justify-end">
            <button
              onClick={() => setForceNoRoadmap(false)}
              className="text-xs text-[#2459A8] hover:underline font-bold flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              <RotateCcw size={13} />
              <span>Show My Selected Roadmap ({activeRoadmap.title})</span>
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#11183D]">
            Today
          </h1>
          <p className="text-sm font-medium text-[#526078]">
            Your daily plan to build the career you want.
          </p>
        </div>

        {/* Hero Graphic Section with floating badges and 3D map */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] border border-[#E2E8F0] p-8 sm:p-12 text-center overflow-hidden shadow-xs">
          
          {/* Central 3D Illustration Mockup */}
          <div className="relative max-w-2xl mx-auto py-8 flex items-center justify-center">
            
            {/* 3D Map Visual */}
            <div className="relative w-64 h-44 sm:w-80 sm:h-52 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-3xl shadow-xl border border-white/80 p-4 transform -rotate-2 flex items-center justify-center overflow-hidden">
              
              {/* Dotted path lines */}
              <svg className="absolute inset-0 w-full h-full text-blue-500/40" viewBox="0 0 200 120" fill="none">
                <path d="M 30 70 Q 70 20, 110 80 T 170 30" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
              </svg>

              {/* Pin 1 (Blue) */}
              <div className="absolute left-8 bottom-8 flex flex-col items-center animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Pin 2 (Purple Flag) */}
              <div className="absolute right-10 top-6 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Trophy size={18} className="text-white" />
                </div>
              </div>

              {/* Map grid lines aesthetic background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>

            {/* Floating Badge 1: Top Left */}
            <div className="absolute top-2 left-0 sm:left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen size={16} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-800">Learn</div>
                <div className="text-[10px] text-slate-500 font-medium">in-demand skills</div>
              </div>
            </div>

            {/* Floating Badge 2: Bottom Left */}
            <div className="absolute bottom-2 left-2 sm:left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 transform rotate-2 hover:rotate-0 transition-transform">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Code2 size={16} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-800">Build</div>
                <div className="text-[10px] text-slate-500 font-medium">real projects</div>
              </div>
            </div>

            {/* Floating Badge 3: Top Right */}
            <div className="absolute top-4 right-0 sm:right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 transform rotate-3 hover:rotate-0 transition-transform">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BarChart2 size={16} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-800">Track</div>
                <div className="text-[10px] text-slate-500 font-medium">your progress</div>
              </div>
            </div>

            {/* Floating Badge 4: Bottom Right */}
            <div className="absolute bottom-2 right-2 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy size={16} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-800">Get job</div>
                <div className="text-[10px] text-slate-500 font-medium">ready</div>
              </div>
            </div>

          </div>

          {/* Heading & Paragraph */}
          <div className="max-w-xl mx-auto space-y-3 mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
              You don't have a roadmap yet
            </h2>
            <p className="text-xs sm:text-sm text-[#526078] leading-relaxed font-normal">
              Choose a career roadmap to get your personalized daily plan. We'll break it into simple, actionable tasks and help you track your progress.
            </p>
          </div>

          {/* Call to Action Gradient Button */}
          <div className="mt-7">
            <button
              onClick={onSelectRoadmapTab}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#C026D3] hover:from-[#1D4ED8] hover:to-[#A21CAF] text-white font-bold font-display text-sm shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus size={18} />
              <span>Select a Roadmap</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Divider "or" */}
        <div className="relative flex items-center justify-center my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DCE7F2]" />
          </div>
          <span className="relative px-4 bg-[#EFFAFD] text-xs font-semibold text-slate-400 uppercase tracking-widest">
            or
          </span>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Software Development */}
          <div
            onClick={() => handleSelectCategoryCard('FULLSTACK')}
            className="group rounded-2xl bg-[#F0F7FF] border border-[#D0E3FF] hover:border-[#3B82F6] hover:shadow-md p-6 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#11183D] group-hover:text-blue-600 transition-colors">
                  Software Development
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Frontend, Backend, Fullstack
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Data & AI */}
          <div
            onClick={() => handleSelectCategoryCard('AIML')}
            className="group rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] hover:border-[#A855F7] hover:shadow-md p-6 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#11183D] group-hover:text-purple-600 transition-colors">
                  Data & AI
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Data Analyst, Data Scientist, ML Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Cloud & DevOps */}
          <div
            onClick={() => handleSelectCategoryCard('DEVOPS')}
            className="group rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] hover:border-[#22C55E] hover:shadow-md p-6 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cloud size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#11183D] group-hover:text-emerald-600 transition-colors">
                  Cloud & DevOps
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Cloud Engineer, DevOps, SRE
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Cybersecurity */}
          <div
            onClick={() => handleSelectCategoryCard('CYBERSECURITY')}
            className="group rounded-2xl bg-[#FFF1F2] border border-[#FFE4E6] hover:border-[#F43F5E] hover:shadow-md p-6 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#11183D] group-hover:text-rose-600 transition-colors">
                  Cybersecurity
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Security Analyst, Ethical Hacker
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer link: Explore all roadmaps */}
        <div className="text-center pt-4">
          <button
            onClick={onSelectRoadmapTab}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2459A8] hover:text-[#1D4ED8] font-display transition-colors cursor-pointer group"
          >
            <Compass size={16} />
            <span>Explore all roadmaps</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // INTERFACE 2: ROADMAP SELECTED STATE (PIC 2)
  // ══════════════════════════════════════════════════════════════════
  const roadmapTitle = activeRoadmap?.title || 'Machine Learning Engineer';

  return (
    <div className="space-y-6 animate-fadeIn font-body">
      
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="hover:text-slate-800 cursor-pointer" onClick={onSelectRoadmapTab}>
            Career Roadmaps
          </span>
          <span>&gt;</span>
          <span className="text-slate-700 font-semibold">{roadmapTitle}</span>
          <span>&gt;</span>
          <span className="text-[#2459A8] font-bold">Today</span>
        </div>

        {/* Control actions bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setForceNoRoadmap(true)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Preview interface when no roadmap is selected"
          >
            Preview Empty State
          </button>

          <button
            onClick={onSelectRoadmapTab}
            className="text-xs font-bold text-[#2459A8] hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5"
          >
            <Compass size={14} />
            <span>Switch Roadmap</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner (Gradient Blue to Purple) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1D4ED8] via-[#3B82F6] to-[#7C3AED] text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Title & Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold font-mono tracking-wider text-white uppercase border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TODAY</span>
              <span className="text-white/60">•</span>
              <span>Monday, Sep 29, 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
              Make progress today, build the future you want.
            </h1>

            <p className="text-xs sm:text-sm text-white/90 font-medium">
              Focused tasks, real learning, and career actions — all in one place.
            </p>
          </div>

          {/* Right Progress & Quote Cards (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Progress Card */}
            <div className="rounded-2xl bg-white p-4 text-[#11183D] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 font-display">Today's Progress</span>
                  <span className="text-xl font-black text-blue-600 font-display">{progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-medium mt-3">
                {completedTasksCount} / {tasks.length} tasks completed
              </div>
            </div>

            {/* Motivational Quote Card */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-white flex flex-col justify-between">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs font-medium italic text-white/90 leading-snug">
                  "Small consistent steps today create massive opportunities tomorrow."
                </p>
              </div>
              <div className="text-[10px] text-white/60 font-mono text-right mt-2">
                ✨ Daily Boost
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content 2-Column Layout (Main 8 Cols / Sidebar 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ══════════════════════════════════════════════════════════ */}
        {/* LEFT / MAIN COLUMN (8 COLS)                                */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD 1: TODAY'S GOAL */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="space-y-3 max-w-xl">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold font-display border border-amber-200">
                    <Target size={14} className="text-amber-600" />
                    <span>Today's Goal</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    <Compass size={14} className="text-blue-600" />
                    <span>{roadmapTitle}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 font-mono">
                    <span>⚡ Day 6 / 10</span>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold font-display text-[#11183D]">
                  Master Decision Trees and build a classification model
                </h2>

                <p className="text-xs text-[#526078] leading-relaxed">
                  This completes the Decision Tree milestone in your Machine Learning roadmap and moves you closer to your target as an ML Engineer.
                </p>

                {/* Metrics tags */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <BookOpen size={13} className="text-blue-600" />
                    <span>{tasks.length} Tasks</span>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <Clock size={13} className="text-purple-600" />
                    <span>2h 30m</span>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                    <Target size={13} className="text-rose-600" />
                    <span>1 Milestone</span>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-800">
                    <Trophy size={13} className="text-amber-500" />
                    <span>Skills: ML, Python</span>
                  </span>
                </div>
              </div>

              {/* Right Illustration / 3D Tree Graphic */}
              <div className="shrink-0 hidden sm:flex items-center justify-center p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/60">
                <div className="w-28 h-28 flex flex-col items-center justify-center relative">
                  {/* Tree Structure graphic mock */}
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    Root
                  </div>
                  <div className="w-0.5 h-4 bg-indigo-300" />
                  <div className="flex items-center gap-6">
                    <div className="w-7 h-7 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                      L1
                    </div>
                    <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                      L2
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CARD 2: TODAY'S TASKS */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-6 shadow-xs space-y-4">
            
            {/* Tasks Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold font-display text-[#11183D]">
                      Today's Tasks
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {tasks.length} tasks · 2h 30m
                    </span>
                  </div>
                </div>
              </div>

              {/* Focus Mode Switch */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Focus Mode</span>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                    focusMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>

            {/* Task Items List */}
            <div className="space-y-3">
              {tasks
                .filter(t => !focusMode || !t.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-white border-[#DCE7F2] hover:border-blue-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border transition-colors flex items-center justify-center cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 hover:border-blue-500 bg-white'
                        }`}
                      >
                        {task.completed && <Check size={14} strokeWidth={3} />}
                      </button>

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        task.category === 'Learning' ? 'bg-blue-50 text-blue-600' :
                        task.category === 'Practice' ? 'bg-emerald-50 text-emerald-600' :
                        task.category === 'Test' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {task.iconType === 'book' && <BookOpen size={17} />}
                        {task.iconType === 'code' && <Code2 size={17} />}
                        {task.iconType === 'quiz' && <FileText size={17} />}
                        {task.iconType === 'box' && <Box size={17} />}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold font-display leading-tight ${
                          task.completed ? 'line-through text-slate-500' : 'text-[#11183D]'
                        }`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          {task.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right Meta & Buttons */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {/* Category badge */}
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        task.category === 'Learning' ? 'bg-blue-50 text-blue-600' :
                        task.category === 'Practice' ? 'bg-emerald-50 text-emerald-600' :
                        task.category === 'Test' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {task.category}
                      </span>

                      {/* Duration */}
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {task.duration}
                      </span>

                      {/* Action Button */}
                      {task.completed ? (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Start</span>
                        </button>
                      )}

                      <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                  </div>
                ))}
            </div>

            {/* Add Custom Task Row */}
            {isAddingTask ? (
              <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="font-bold text-xs text-slate-800">Add New Task for Today</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Task Title (e.g., Read documentation on Gini impurity)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subtitle/Details"
                    value={newTaskSubtitle}
                    onChange={(e) => setNewTaskSubtitle(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as any)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Learning">Learning</option>
                      <option value="Practice">Practice</option>
                      <option value="Test">Test</option>
                      <option value="Build">Build</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Minutes"
                      value={newTaskDuration}
                      onChange={(e) => setNewTaskDuration(e.target.value)}
                      className="w-20 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                    <span className="text-xs text-slate-500">min</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      Save Task
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/70 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Custom Task</span>
                <span className="text-[11px] font-normal text-slate-500">Add your own task for today</span>
              </button>
            )}

          </div>

          {/* BOTTOM ROW: 2 GRID COLUMNS (CAREER ACTION & RECOMMENDED VISUAL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* COLUMN 1: CAREER ACTION (LINKEDIN POST GENERATOR) */}
            <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    in
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold font-display text-[#11183D]">
                      Career Action
                    </h4>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-800">Share what you learned today</h5>
                  <p className="text-[11px] text-slate-500">
                    Build your presence by sharing your learning and project.
                  </p>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setCareerTab('SUGGESTED')}
                    className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${
                      careerTab === 'SUGGESTED' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Suggested Post
                  </button>
                  <button
                    onClick={() => setCareerTab('VISUALS')}
                    className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${
                      careerTab === 'VISUALS' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Visuals
                  </button>
                  <button
                    onClick={() => setCareerTab('HASHTAGS')}
                    className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${
                      careerTab === 'HASHTAGS' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Hashtags
                  </button>
                </div>

                {/* Draft Post Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-2 leading-relaxed">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Draft LinkedIn Post</span>
                    <button
                      onClick={handleCopyPost}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-blue-600 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copy Post</span>
                    </button>
                  </div>

                  <p>
                    Today I learned how Decision Trees make predictions and built a classification model using scikit-learn. 🌲
                  </p>

                  <div className="text-slate-600 space-y-0.5">
                    <div>Key takeaways:</div>
                    <div>• How entropy, information gain and gini impurity work</div>
                    <div>• How a model chooses the best split</div>
                    <div>• Built a project to classify Iris flowers and analyzed results</div>
                  </div>

                  <p className="text-slate-500 italic">
                    Grateful for this learning journey. On to Random Forests next!
                  </p>
                </div>

                {/* Hashtags */}
                <div className="text-[10px] font-semibold text-blue-600 flex flex-wrap gap-1">
                  <span>#MachineLearning</span>
                  <span>#Python</span>
                  <span>#DataScience</span>
                  <span>#BuildInPublic</span>
                  <span>#Rennetus</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: RECOMMENDED VISUAL */}
            <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold font-display text-[#11183D]">
                    Recommended Visual
                  </h4>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Diagram graphic preview box */}
                <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 overflow-hidden border border-slate-700 min-h-[160px] flex flex-col justify-between">
                  {isRegeneratingVisual && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Synthesizing decision tree graphic...</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-emerald-400">Decision Tree Classifier</div>

                  {/* Visual flowchart mockup */}
                  <div className="my-2 flex items-center justify-around gap-2 text-[10px]">
                    <div className="p-1.5 rounded bg-blue-500/30 border border-blue-400 text-center font-mono">
                      Petal Length &lt;= 2.45
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">Setosa</span>
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">Versicolor / Virginica</span>
                  </div>
                </div>
              </div>

              {/* Regenerate & Download buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleRegenerateVisual}
                  className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#11183D] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className={isRegeneratingVisual ? 'animate-spin' : ''} />
                  <span>Regenerate Visual</span>
                </button>

                <button
                  onClick={() => toast.success('Visual downloaded!')}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* RIGHT SIDEBAR COLUMN (4 COLS)                              */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SIDEBAR ITEM 1: TIME PLAN */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <h4 className="text-sm font-extrabold font-display text-[#11183D]">
                  Time Plan
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">2h 30m planned</span>
            </div>

            {/* Segmented multi-color progress bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '30%' }} title="Learning 45m" />
              <div className="bg-emerald-500 h-full" style={{ width: '40%' }} title="Practice 60m" />
              <div className="bg-amber-500 h-full" style={{ width: '10%' }} title="Test 15m" />
              <div className="bg-purple-500 h-full" style={{ width: '20%' }} title="Build 45m" />
            </div>

            {/* Dots Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Learning 45m
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Practice 60m
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Test 15m
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Build 45m
              </span>
            </div>
          </div>

          {/* SIDEBAR ITEM 2: TODAY'S MILESTONE */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-purple-600" />
              <h4 className="text-sm font-extrabold font-display text-[#11183D]">
                Today's Milestone
              </h4>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Decision Tree Milestone</span>
              <span className="text-xs font-black text-blue-600 font-mono">60%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }} />
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1">
              {milestoneTasks.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleMilestoneTask(item.id)}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    item.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className={item.completed ? 'line-through text-slate-400' : 'font-medium'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR ITEM 3: QUICK ACTIONS */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h4 className="text-sm font-extrabold font-display text-[#11183D]">
                Quick Actions
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => toast('Opening Roadmap Resources...', { icon: '📖' })}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <BookOpen size={16} className="text-blue-600" />
                <div className="text-xs font-bold text-slate-800">Open Resources</div>
              </button>

              <button
                onClick={() => toast('Opening Notes Editor...', { icon: '📝' })}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <FileText size={16} className="text-purple-600" />
                <div className="text-xs font-bold text-slate-800">Open Notes</div>
              </button>

              <button
                onClick={() => navigate('/roadmap/ai-planner')}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <Sparkles size={16} className="text-emerald-600" />
                <div className="text-xs font-bold text-slate-800">Ask AI Coach</div>
              </button>

              <button
                onClick={onSelectRoadmapTab}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left space-y-1 cursor-pointer transition-colors"
              >
                <Compass size={16} className="text-rose-600" />
                <div className="text-xs font-bold text-slate-800">View Roadmap</div>
              </button>
            </div>
          </div>

          {/* SIDEBAR ITEM 4: PORTFOLIO ACTION (GITHUB TRACKER) */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github size={16} className="text-slate-900" />
                <h4 className="text-xs font-extrabold font-display text-[#11183D]">
                  Portfolio Action
                </h4>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div className="text-xs font-bold text-slate-800">
              Update your GitHub repository
            </div>

            <div className="space-y-2">
              {githubTasks.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleGithubTask(item.id)}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    item.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className={item.completed ? 'line-through text-slate-400' : 'font-medium'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>{githubTasks.filter(g => g.completed).length} / {githubTasks.length} completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${(githubTasks.filter(g => g.completed).length / githubTasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* SIDEBAR ITEM 5: NETWORK & GROW */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Linkedin size={16} className="text-blue-600" />
                <h4 className="text-xs font-extrabold font-display text-[#11183D]">
                  Network & Grow
                </h4>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Connect with 3 AI/ML professionals
              </span>

              {/* Avatar stack */}
              <div className="flex items-center -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  A
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  S
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  M
                </div>
                <span className="pl-3 text-[10px] font-bold text-slate-500">+3</span>
              </div>
            </div>
          </div>

          {/* SIDEBAR ITEM 6: INTERVIEW PRACTICE */}
          <div className="rounded-3xl bg-white border border-[#DCE7F2] p-5 shadow-xs space-y-2 cursor-pointer hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-rose-600" />
                <h4 className="text-xs font-extrabold font-display text-[#11183D]">
                  Interview Practice
                </h4>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div className="text-xs font-bold text-slate-800">
              Explain how a Decision Tree chooses the best split
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Clock size={12} />
              <span>10 min</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
