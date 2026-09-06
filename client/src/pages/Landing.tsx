import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Users,
  Zap,
  Shield,
  Lock,
  Clock,
  Search,
  Star,
  Flame,
  Monitor,
  User,
  Play,
  ChevronRight,
  ChevronDown,
  Code2,
  Cpu,
  TrendingUp,
  MessageCircle,
  Activity,
  BarChart3,
  Sliders,
  Layers,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';

// ─── Frequently Asked Questions ──────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'What does "uninflated" scoring mean?',
    a: 'Unlike generic AI chatbots that give polite or flattering scores, RU READY? evaluates answers strictly against Tier-1 calibrated rubrics (Situation, Task, Action specificity, and Measurable Results). You receive the unfiltered truth about where your answers lack depth or structure.',
  },
  {
    q: 'How do the different interviewer personas work?',
    a: 'You can choose between the supportive Hiring Manager (evaluates communication & collaboration), the pragmatic Technical Architect (drills into system architecture & edge cases), and the adversarial Bar Raiser (challenges your assumptions with probing Socratic follow-ups).',
  },
  {
    q: 'Can I practice coding interviews directly in the browser?',
    a: 'Yes! The Coding Interview Room features a Monaco-based code editor, automated test case runner, live Big-O complexity analysis, and progressive Socratic hints if you get stuck.',
  },
  {
    q: 'Is my voice and camera data kept private?',
    a: 'Absolutely. All live facial and audio telemetry (gaze tracking, speech pacing, audio waveforms) is computed in real time for scoring and is never shared, sold, or used for model training.',
  },
];

// ─── Animation Variants ──────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Scorecard Data for Interactive Tabs ─────────────────────

interface ScorecardCategory {
  title: string;
  score: number;
  breakdown: Array<{ label: string; val: number }>;
}

const SCORECARD_DATA: Record<string, ScorecardCategory> = {
  overall: {
    title: 'Executive Overall Score',
    score: 87,
    breakdown: [
      { label: 'Technical Accuracy & Edge-cases', val: 94 },
      { label: 'Communication Clarity & Tone', val: 82 },
      { label: 'Behavioral STAR Adherence', val: 85 },
      { label: 'Time Management & Pacing', val: 88 },
    ],
  },
  technical: {
    title: 'Technical Competency',
    score: 94,
    breakdown: [
      { label: 'Algorithm Complexity (O notation)', val: 96 },
      { label: 'Code Architecture & Modularity', val: 92 },
      { label: 'Edge Case & Fault Handling', val: 95 },
      { label: 'Optimal Data Structure Selection', val: 93 },
    ],
  },
  communication: {
    title: 'Verbal & Structured Articulation',
    score: 82,
    breakdown: [
      { label: 'Conciseness (Word economy)', val: 80 },
      { label: 'Tone & Executive Presence', val: 85 },
      { label: 'Active Listening & Prompt Recall', val: 84 },
      { label: 'Filler Word Suppression (um/like)', val: 79 },
    ],
  },
  behavioral: {
    title: 'Leadership & STAR Method',
    score: 85,
    breakdown: [
      { label: 'Situation & Task Formulation', val: 88 },
      { label: 'Action Specificity & Ownership', val: 86 },
      { label: 'Measurable Quantified Results', val: 81 },
      { label: 'Conflict Resolution & Empathy', val: 85 },
    ],
  },
  suggestions: {
    title: 'High-Impact Action Items',
    score: 91,
    breakdown: [
      { label: 'State assumptions before coding', val: 92 },
      { label: 'Quantify metrics in past project wins', val: 89 },
      { label: 'Maintain eye focus during pauses', val: 94 },
      { label: 'Elaborate trade-offs on design choices', val: 89 },
    ],
  },
};

// ─── Section Wrapper ─────────────────────────────────────────

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Circular Score Gauge ─────────────────────────────────────

function CircularGauge({ score, size = 180 }: { score: number; size?: number }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#181B22"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#solarGaugeGradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: circumference - progress } : {}}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="solarGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9433" />
            <stop offset="100%" stopColor="#FF7A00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-4xl text-white leading-none">{score}</span>
        <span className="text-xs text-slate-400 font-mono mt-1">/100</span>
      </div>
    </div>
  );
}

// ─── Landing Page ────────────────────────────────────────────

export default function Landing() {
  const heroRef = useRef(null);
  const { isAuthenticated } = useAuthStore();
  const [activeScoreTab, setActiveScoreTab] = useState<string>('overall');
  const [workflowStep, setWorkflowStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentCategory = SCORECARD_DATA[activeScoreTab] || SCORECARD_DATA.overall;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-hidden selection:bg-primary-500/20 selection:text-primary-900">
      <Helmet>
        <title>RU READY? — AI-Powered Mock Interview Platform</title>
        <meta name="description" content="Master technical & behavioral interviews with calibrated AI agents. Practice on realistic scenarios with brutal honesty." />
      </Helmet>

      {/* ════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                           */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-white"
      >
        {/* Warm radial background glow from the top-right matching reference image */}
        <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-bl from-orange-200/50 via-amber-100/30 to-transparent rounded-full blur-[100px] pointer-events-none -z-0" />
        <div className="absolute top-1/3 left-[-100px] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[90px] pointer-events-none -z-0" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ── LEFT COLUMN: Text & CTAs ── */}
            <div className="lg:col-span-7 max-w-2xl">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-extrabold text-[2.85rem] sm:text-[3.75rem] md:text-[4.35rem] lg:text-[4.75rem] text-slate-950 leading-[1.05] tracking-tight mb-6"
              >
                Stop Guessing.
                <br />
                <span className="text-primary-500">
                  Start Interviewing.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="font-body text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl"
              >
                Experience adversarial, real-time mock evaluations with{' '}
                <span className="font-semibold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4">
                  brutally honest feedback
                </span>
                . Assess structure, verbal metrics, and eye presence under strict technical constraints.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="group shrink-0">
                  <button className="inline-flex items-center gap-2.5 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-[#FF7A00]/25 hover:shadow-[#FF7A00]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                    <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Interview'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <a href="#features" className="group shrink-0">
                  <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-display font-semibold text-base px-7 py-4 rounded-full border border-slate-200 shadow-sm hover:shadow transition-all cursor-pointer">
                    <span>Explore Demo</span>
                  </button>
                </a>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: Complete 3D Model Candidate Interview Visual & Floating Cards ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Main Candidate 3D Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-100 group">
                <img
                  src="/images/hero-3d.jpg"
                  alt="3D Candidate in live video interview"
                  className="w-full h-auto object-cover aspect-[4/3.2] group-hover:scale-103 transition-transform duration-700"
                  loading="eager"
                />
                
                {/* Handwritten cursive overlay text at bottom-right */}
                <div className="absolute bottom-5 right-6 text-white font-script text-2xl drop-shadow-md transform -rotate-6 text-right leading-tight pointer-events-none">
                  Practice<br />Grow<br />Get Hired!
                </div>
              </div>

              {/* Floating Top-Left Card: AI Interviewer Question (Interactive Float) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: [-3, 3, -3],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.5 },
                  y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute -top-4 sm:-top-6 -left-3 sm:-left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-100 flex items-center gap-3 z-20 max-w-[260px] sm:max-w-xs hover:shadow-orange-500/10 transition-shadow"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center text-primary-500 shrink-0 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      AI Interviewer
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    "Tell me about a challenging project you worked on?"
                  </p>
                </div>
              </motion.div>

              {/* Floating Top-Right Card: Circular Confidence 82% (Interactive Float) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  y: [3, -3, 3],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.7 },
                  y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute top-6 sm:top-10 -right-2 sm:-right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-100 flex flex-col items-center justify-center z-20 hover:scale-105 transition-transform"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Confidence
                </p>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#FF7A00"
                      strokeWidth="4"
                      strokeDasharray="138"
                      initial={{ strokeDashoffset: 138 }}
                      animate={{ strokeDashoffset: 25 }}
                      transition={{ duration: 1.5, delay: 0.9, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-900 font-display">82%</span>
                </div>
              </motion.div>

              {/* Floating Bottom-Right Checklist Card (Interactive Float) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [-3, 3, -3],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.9 },
                  y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-100 z-20 space-y-1.5 min-w-[170px] hover:shadow-orange-500/10 transition-shadow"
              >
                {[
                  { label: 'Eye Contact', checked: true },
                  { label: 'Speech Clarity', checked: true },
                  { label: 'Structured Answer', checked: true },
                  { label: 'Technical Accuracy', checked: true },
                  { label: 'Areas to Improve', checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${item.checked ? 'text-emerald-500' : 'text-slate-300'}`}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TRUST BAR (White card with clean icon pills)           */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="py-8 lg:py-10 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: 'Proctor Secure', desc: 'Cheat-resistant' },
              { icon: Zap, title: 'Real-time Feedback', desc: 'Instant AI analysis' },
              { icon: TrendingUp, title: 'Detailed Insights', desc: 'Track your growth' },
              { icon: Lock, title: 'Privacy First', desc: 'Your data, your control' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center mb-2 text-primary-500 group-hover:scale-105 transition-transform">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 font-body">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURES — Bento Analytics Showcase (Deep Blue Cards)   */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-16 sm:py-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight mb-3">
            Interview prep, <span className="text-primary-500">reimagined.</span>
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Deep telemetry, adversarial conversation trees, and strict assessment diagnostics built inside an elite cockpit wrapper.
          </p>
        </motion.div>

        {/* Bento Grid matching reference screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Card 1: Adversarial AI Mock Interviews (Deep Navy Blue) */}
          <motion.div
            variants={scaleIn}
            className="rounded-3xl p-6 sm:p-8 bg-[#0D1628] text-white border border-slate-800 shadow-2xl flex flex-col justify-between hover:border-primary-500/30 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-primary-500 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Adversarial AI Mock Interviews</h3>
                  <p className="text-xs text-slate-400">
                    AI challenges you with role-specific, real-world questions, just like real interviewers — no sugarcoating.
                  </p>
                </div>
              </div>

              {/* Chat simulation */}
              <div className="mt-6 space-y-3 font-body text-xs">
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded bg-primary-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    AI
                  </div>
                  <div className="bg-[#17223B] border border-slate-700/60 p-3 rounded-2xl rounded-tl-sm text-slate-200 flex-1">
                    You mentioned working on a distributed system. What are the trade-offs between consistency and availability?
                  </div>
                </div>

                <div className="flex gap-2.5 items-start justify-end">
                  <div className="bg-primary-500/20 border border-primary-500/40 p-2.5 rounded-2xl rounded-tr-sm text-white max-w-[80%]">
                    Great question. In a distributed system...
                  </div>
                  <div className="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <User size={12} />
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded bg-primary-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    AI
                  </div>
                  <div className="bg-[#17223B] border border-slate-700/60 p-3 rounded-2xl rounded-tl-sm text-slate-200 flex-1">
                    Solid start. Can you elaborate on how you would handle network partitions?
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Multi-Modal Behavioral Tracker (Deep Navy Blue with 3D model portrait) */}
          <motion.div
            variants={scaleIn}
            className="rounded-3xl p-6 sm:p-8 bg-[#0D1628] text-white border border-slate-800 shadow-2xl flex flex-col justify-between hover:border-primary-500/30 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Multi-Modal Behavioral Tracker</h3>
                  <p className="text-xs text-slate-400">
                    We analyze your face, voice, and content in real-time to give unified feedback.
                  </p>
                </div>
              </div>

              {/* Video container with 3D telemetry candidate */}
              <div className="mt-6 relative rounded-2xl overflow-hidden bg-[#111A2E] border border-slate-700/60 flex items-center justify-center aspect-[16/10]">
                <img
                  src="/images/telemetry-3d.jpg"
                  alt="3D Candidate video telemetry"
                  className="w-full h-full object-cover object-top opacity-90"
                />

                {/* Live REC indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </div>

                {/* Right side telemetry tags */}
                <div className="absolute top-3 right-3 space-y-1.5">
                  {[
                    { label: 'Eye Gaze', color: 'text-emerald-400' },
                    { label: 'Speech Pace', color: 'text-emerald-400' },
                    { label: 'Confidence', color: 'text-amber-400' },
                    { label: 'Filler Words', color: 'text-red-400' },
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] text-white border border-white/10"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.color.replace('text-', 'bg-')}`} />
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom waveform & timer */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-1 h-3.5">
                    {[40, 70, 90, 60, 30, 80, 100, 75, 45, 60, 85].map((h, i) => (
                      <div key={i} className="w-0.5 bg-primary-500 rounded-full" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-slate-300">00:24</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card 3: Interactive Uninflated Scorecard Insights (Animated & Interactive) */}
        <motion.div
          variants={scaleIn}
          className="rounded-3xl p-6 sm:p-8 bg-[#0D1628] text-white border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Uninflated Scorecard Insights</h3>
              <p className="text-xs text-slate-400">
                Get honest, structured feedback with no fluff. Click categories below to explore live breakdowns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Nav Menu Buttons (Interactive Category Switcher) */}
            <div className="md:col-span-3 space-y-1.5 font-body text-xs">
              {[
                { id: 'overall', label: 'Overall', icon: Flame },
                { id: 'technical', label: 'Technical Skills', icon: Code2 },
                { id: 'communication', label: 'Communication', icon: Users },
                { id: 'behavioral', label: 'Behavioral', icon: Zap },
                { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeScoreTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScoreTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Center: Interactive Animated Circular Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="56" stroke="#17223B" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="56"
                    stroke="#FF7A00"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    animate={{ strokeDashoffset: (2 * Math.PI * 56) - (currentCategory.score / 100) * (2 * Math.PI * 56) }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <motion.span
                    key={currentCategory.score}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display font-extrabold text-3xl text-white"
                  >
                    {currentCategory.score}{' '}
                    <span className="text-sm font-normal text-slate-400">/ 100</span>
                  </motion.span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-[120px] text-center truncate">
                    {currentCategory.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Dynamic Breakdown Progress Bars */}
            <div className="md:col-span-5 space-y-3.5 text-xs font-body">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-300 text-xs uppercase tracking-wider font-mono">
                  Detailed Breakdown
                </p>
                <span className="text-[10px] text-primary-400 font-mono">
                  {currentCategory.title}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScoreTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {currentCategory.breakdown.map((b: { label: string; val: number }, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{b.label}</span>
                        <span className="font-mono text-white font-bold">{b.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#17223B] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${b.val}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  View Full Report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STATS: Numbers that Speak                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight">
              Numbers that <span className="text-primary-500">speak</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Flame,
                number: '885+',
                title: 'Elite Engineers Prepared',
                desc: 'From students to senior professionals — interview ready.',
                color: 'text-primary-500',
                bgColor: 'bg-orange-50',
              },
              {
                icon: Brain,
                number: '11,067+',
                title: 'Adversarial Prompts Served',
                desc: 'Real-world dialogue scenarios generated from resumes, domains and targets.',
                color: 'text-primary-500',
                bgColor: 'bg-orange-50',
              },
              {
                icon: TrendingUp,
                number: '25%',
                title: 'Star Structure Growth',
                desc: 'Candidates show 25% improvement in structured communication within 3 sessions.',
                color: 'text-primary-500',
                bgColor: 'bg-orange-50',
              },
              {
                icon: Star,
                number: '4.8/5',
                title: 'User Satisfaction',
                desc: 'Loved by learners across colleges and companies.',
                color: 'text-primary-500',
                bgColor: 'bg-orange-50',
              },
            ].map((stat, i) => (
              <motion.div key={i} variants={scaleIn} custom={i}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between group hover:-translate-y-0.5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display font-black text-3xl text-primary-500">
                        {stat.number}
                      </span>
                      <div className={`h-8 w-8 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-display mb-1.5">
                      {stat.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 font-body leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} custom={2} className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-600">
            {[
              { icon: Shield, text: 'Strict Environmental Privacy' },
              { icon: Zap, text: 'Adversarial AI Core v1.0' },
              { icon: CheckCircle2, text: 'Zero Cost Setup Evaluation' },
              { icon: Monitor, text: 'Works on Any Device' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono font-medium"
              >
                <item.icon className="h-3.5 w-3.5 text-primary-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* WORKFLOW / HOW IT WORKS (Interactive Steps)            */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="workflow" className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-100 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight mb-4">
              How <span className="text-primary-500">RU READY?</span> Works
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
              Experience the full rigor of Tier-1 technical and behavioral hiring loops in 4 calibrated steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Persona & Role Calibration',
                desc: 'Upload your target JD, select seniority (Junior to Staff), and choose an interviewer persona: Hiring Manager, Architect, or Bar Raiser.',
                icon: Sliders,
                tag: 'Target Calibration',
                detail: 'Fullstack • Backend • ML • System Design',
              },
              {
                step: '02',
                title: 'Adaptive Socratic Dialogue',
                desc: 'Enter the live voice room. AVA asks role-specific scenarios, listens actively, and poses adversarial follow-ups if answers lack depth.',
                icon: MessageCircle,
                tag: 'Voice & Video Room',
                detail: 'Sub-300ms Dynamic Question Formulation',
              },
              {
                step: '03',
                title: 'Real-Time Multi-Modal Telemetry',
                desc: 'Continuous background monitoring of audio waveforms, speech pacing (WPM), filler words, eye contact stability, and code syntax.',
                icon: Activity,
                tag: 'Deep Behavioral Stream',
                detail: 'Audio • Gaze • Code Sandbox Runner',
              },
              {
                step: '04',
                title: 'Uninflated STAR Scorecard',
                desc: 'Receive uncompromising scores across Situation, Task, Action, and Result with line-by-line code optimizations and personalized talking points.',
                icon: BarChart3,
                tag: 'Brutal Honesty Report',
                detail: 'Actionable Improvement Roadmap',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              const isSelected = workflowStep === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  onClick={() => setWorkflowStep(i)}
                  className={`relative rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-white border-2 border-primary-500 shadow-xl shadow-primary-500/10 -translate-y-1'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full font-mono text-[10px] font-black tracking-widest uppercase shadow transition-colors ${
                    isSelected ? 'bg-primary-500 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    STEP {card.step}
                  </div>

                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm ${
                      isSelected
                        ? 'bg-primary-500 text-white scale-105'
                        : 'bg-orange-50 border border-orange-100 text-primary-500 group-hover:bg-primary-500 group-hover:text-white'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-primary-600 font-mono uppercase tracking-wider block mb-1">
                      {card.tag}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-2.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-body leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-medium block">
                      {card.detail}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-primary-500 translate-x-0.5' : 'text-slate-300'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register">
              <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow hover:shadow-md transition-all cursor-pointer">
                <span>Experience the Calibration Workflow</span>
                <ArrowRight className="w-4 h-4 text-primary-400" />
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRICING SECTION (in Rupees: Free, 69, 159, 249)         */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight mb-4">
              Practice That Fits Your <span className="text-primary-500">Budget</span>
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
              No locked monthly subscriptions or hidden charges. Calibrate your readiness with flexible session bundles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Plan 1: Free */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Starter
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 mb-1">Free Tier</h3>
                <p className="text-xs text-slate-500 font-body mb-6">Test the platform and benchmark your baseline.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-slate-950">₹0</span>
                  <span className="text-xs font-mono text-slate-400">/ forever free</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  {[
                    '2 Practice Sessions / month',
                    'Standard Behavioral STAR Evaluation',
                    'Standard AI Model Latency',
                    'Executive Score Overview',
                    'Web & Mobile Responsive Access',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-display font-bold text-xs text-slate-800 transition-all cursor-pointer">
                  Start Free
                </button>
              </Link>
            </motion.div>

            {/* Plan 2: ₹69 Sprint Pack */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-orange-50 text-primary-600 border border-orange-200/60 text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Quick Sprint
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 mb-1">Single Pass</h3>
                <p className="text-xs text-slate-500 font-body mb-6">Got an interview tomorrow? Run a full targeted mock.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-slate-950">₹69</span>
                  <span className="text-xs font-mono text-slate-400">/ single interview</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  {[
                    '1 Full Adaptive Mock Session',
                    'Choice of Any Persona (Hiring Mgr / Bar Raiser)',
                    'Live Audio Waveform & Speech Pacing',
                    'Granular STAR Breakdown & Scorecard',
                    'Instant PDF Feedback Download',
                    'Session Audio & Full Transcript Replay',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer">
                  Get Pass — ₹69
                </button>
              </Link>
            </motion.div>

            {/* Plan 3: ₹159 Pro Pack (HIGHLIGHTED) */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="rounded-3xl bg-[#0D1628] text-white border-2 border-primary-500 p-6 sm:p-7 shadow-2xl relative flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-black font-mono uppercase tracking-widest shadow-lg shadow-primary-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>Most Popular</span>
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-bold font-mono uppercase tracking-wider mb-4 mt-2">
                  Career Ready Pro
                </div>
                <h3 className="font-display font-black text-xl text-white mb-1">5-Session Bundle</h3>
                <p className="text-xs text-slate-400 font-body mb-6">Complete interview prep for Tier-1 engineering roles.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-primary-400">₹159</span>
                  <span className="text-xs font-mono text-slate-400">/ 5 sessions (₹31/ea)</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-slate-300 mb-8 border-t border-slate-800 pt-6">
                  {[
                    '5 Full Multi-Modal Mock Sessions (Oral + Coding)',
                    'Live Coding Sandbox & Test Case Runner',
                    'Adversarial Bar Raiser Persona with Probing',
                    'Facial Gaze & Voice Telemetry Analytics',
                    'Custom Resume & Job Description Calibration',
                    'Progressive Hint Unlocks during coding',
                    'Priority Sub-150ms Neural Pipeline',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-display font-bold text-xs shadow-lg shadow-primary-500/30 transition-all cursor-pointer">
                  Unlock Pro Pack — ₹159
                </button>
              </Link>
            </motion.div>

            {/* Plan 4: ₹249 Mastery Pack */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Full Mastery
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 mb-1">15-Session Elite</h3>
                <p className="text-xs text-slate-500 font-body mb-6">Comprehensive mastery for Staff, FAANG & dream roles.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-slate-950">₹249</span>
                  <span className="text-xs font-mono text-slate-400">/ 15 sessions (₹16/ea)</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-slate-600 mb-8 border-t border-slate-100 pt-6">
                  {[
                    '15 Full Multi-Modal Mock Sessions',
                    'All 3 Interviewer Personas Unlocked',
                    'Automated Code Complexity & Big-O Breakdown',
                    'Full Historical Analytics & 5-Axis Radar Chart',
                    'Line-by-Line Code Refactor Suggestions',
                    'Personalized Weakness Diagnosis Roadmap',
                    '24/7 Priority Support & Calibration',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer">
                  Get Ultimate — ₹249
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Guarantee Pill */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-full px-5 py-2.5 text-xs text-slate-600 font-body">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% Uninflated Calibration • No Recurring Subscription • Instant Session Activation</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FAQ SECTION (Interactive Accordion)                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight leading-tight mb-3">
              Frequently Asked <span className="text-primary-500">Questions</span>
            </h2>
            <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
              Everything you need to know about calibrated mock evaluations.
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm sm:text-base text-slate-900 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-primary-500' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-body leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* CTA BANNER: Ready to Meet AVA? (Deep Navy Card)         */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          variants={scaleIn}
          className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl bg-[#0D1628] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-slate-800 text-center"
        >
          {/* Subtle Orange Glow inside card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              YOUR NEXT OPPORTUNITY DESERVES A BETTER YOU
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Ready to meet <span className="text-primary-500">AVA?</span>
            </h2>
            <p className="font-body text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Join thousands of engineers who stopped guessing and calibrated their technical capacity.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/register" className="group shrink-0">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-display font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-primary-500/25 transition-all">
                  Start Assessment — It's Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a href="#features" className="shrink-0">
                <button className="inline-flex items-center gap-2 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all">
                  <Play className="w-3.5 h-3.5 fill-current text-primary-500" />
                  Watch Demo
                </button>
              </a>
            </div>

            {/* Handwritten cursive annotation without emoji */}
            <div className="pt-6 font-script text-xl text-primary-400 text-right pr-6 pointer-events-none flex items-center justify-end gap-1.5">
              <span>Better Interviews, Brighter You</span>
              <Sparkles className="w-4 h-4 text-primary-400 inline" />
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
