import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, useTransform, animate } from 'framer-motion';
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
  Star,
  Flame,
  Monitor,
  User,
  Play,
  ChevronRight,
  ChevronDown,
  Code2,
  TrendingUp,
  MessageCircle,
  Activity,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// ─── Frequently Asked Questions ──────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'What does "uninflated" scoring mean?',
    a: 'Unlike generic AI chatbots that give polite or flattering scores, R U Ready? evaluates answers strictly against Tier-1 calibrated rubrics (Situation, Task, Action specificity, and Measurable Results). You receive the unfiltered truth about where your answers lack depth or structure.',
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

// ─── Dynamic Animated Number Counter ─────────────────────────

function AnimatedCounter({
  target,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString('en-US');

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── Animation Variants ──────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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
  const isInView = useInView(ref, { once: true, margin: '-70px' });

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

// ─── Landing Page Component ──────────────────────────────────

export default function Landing() {
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const { isAuthenticated } = useAuthStore();
  const [activeScoreTab, setActiveScoreTab] = useState<string>('overall');
  const [workflowStep, setWorkflowStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentCategory = SCORECARD_DATA[activeScoreTab] || SCORECARD_DATA.overall;

  const { scrollYProgress: pageScrollProgress } = useScroll({ target: containerRef });
  
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.85], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EFFAFD] text-[#11183D] overflow-hidden selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <Helmet>
        <title>R U Ready? — AI-Powered Mock Interview Platform</title>
        <meta name="description" content="Master technical & behavioral interviews with calibrated AI agents. Practice on realistic scenarios with brutal honesty." />
      </Helmet>

      {/* Top Scroll Indicator Progress Bar */}
      <motion.div
        style={{ scaleX: pageScrollProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#4A8BDF] z-50 transform origin-left"
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                           */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-[#EFFAFD]"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ── LEFT COLUMN: Headline & CTAs ── */}
            <div className="lg:col-span-7 max-w-2xl">
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8EAF4] border border-[#A0006D]/20 text-[#A0006D] font-display font-bold text-xs mb-6 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A0006D]" />
                <span>AI-Powered Interview Intelligence</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-black text-[2.85rem] sm:text-[3.75rem] md:text-[4.35rem] lg:text-[4.75rem] text-[#11183D] leading-[1.05] tracking-tight mb-6"
              >
                Stop Guessing.
                <br />
                <span className="text-[#4A8BDF]">
                  Start Interviewing.
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="font-body text-base sm:text-lg text-[#526078] mb-8 leading-relaxed max-w-xl"
              >
                Experience adversarial, real-time mock evaluations with{' '}
                <span className="font-semibold text-[#11183D] underline decoration-[#4A8BDF]/40 decoration-2 underline-offset-4">
                  uninflated AI feedback
                </span>
                . Calibrate your STAR structure, verbal pacing, and coding complexity under real interview pressure.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="group shrink-0">
                  <button className="inline-flex items-center gap-2.5 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-base px-8 py-4 rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                    <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Practice'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <a href="#features" className="group shrink-0">
                  <button className="inline-flex items-center gap-2 bg-white hover:bg-[#EFFAFD] text-[#4A8BDF] font-display font-semibold text-base px-7 py-4 rounded-xl border border-[#DCE7F2] shadow-sm hover:shadow transition-all cursor-pointer">
                    <span>Explore Features</span>
                  </button>
                </a>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: Candidate Visual & Floating Cards ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Candidate Surface Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-[#DCE7F2] p-2 group">
                <img
                  src="/images/hero-3d.jpg"
                  alt="Candidate live video interview"
                  className="w-full h-auto object-cover rounded-xl aspect-[4/3.2] group-hover:scale-[1.02] transition-transform duration-500"
                  loading="eager"
                />
              </div>

              {/* Floating Top-Left Card: Eggplant AI Coach Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: [-3, 3, -3] }}
                transition={{ opacity: { duration: 0.6, delay: 0.5 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -top-4 sm:-top-6 -left-3 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-[#DCE7F2] flex items-center gap-3 z-20 max-w-[260px] sm:max-w-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center shrink-0 shadow-sm">
                  <Brain className="w-5 h-5 text-[#A0006D]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A0006D] font-mono">
                      AI Bar Raiser
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A0006D] animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-[#11183D] leading-snug">
                    "Tell me about a challenging project trade-off?"
                  </p>
                </div>
              </motion.div>

              {/* Floating Top-Right Card: Royal Blue Score 87% */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: [3, -3, 3] }}
                transition={{ opacity: { duration: 0.6, delay: 0.7 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute top-6 sm:top-10 -right-2 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-[#DCE7F2] flex flex-col items-center justify-center z-20 hover:scale-105 transition-transform"
              >
                <p className="text-[10px] font-bold text-[#4A8BDF] uppercase tracking-wider font-mono mb-1">
                  STAR Score
                </p>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#EFFAFD" strokeWidth="4" fill="none" />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#4A8BDF"
                      strokeWidth="4"
                      strokeDasharray="138"
                      initial={{ strokeDashoffset: 138 }}
                      animate={{ strokeDashoffset: 18 }}
                      transition={{ duration: 1.5, delay: 0.9, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#11183D] font-display">87%</span>
                </div>
              </motion.div>

              {/* Floating Bottom-Right Card: Checklist Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [-3, 3, -3] }}
                transition={{ opacity: { duration: 0.6, delay: 0.9 }, y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-4 bg-white rounded-2xl p-3.5 shadow-xl border border-[#DCE7F2] z-20 space-y-1.5 min-w-[175px]"
              >
                {[
                  { label: 'Eye Contact', checked: true, color: 'text-[#168A62]' },
                  { label: 'Speech Pacing (145 WPM)', checked: true, color: 'text-[#4A8BDF]' },
                  { label: 'STAR Adherence', checked: true, color: 'text-[#A0006D]' },
                  { label: 'Big-O Complexity', checked: true, color: 'text-[#4A8BDF]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-[#11183D]">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TRUST BAR                                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="py-8 lg:py-10 bg-[#EFFAFD]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: 'Proctor Secure', desc: 'Cheat-resistant', iconColor: 'text-[#4A8BDF]', bg: 'bg-[#EFFAFD]' },
              { icon: Zap, title: 'Real-time Feedback', desc: 'Sub-300ms AI engine', iconColor: 'text-[#A0006D]', bg: 'bg-[#F8EAF4]' },
              { icon: TrendingUp, title: 'Detailed Insights', desc: '5-Axis Radar metrics', iconColor: 'text-[#168A62]', bg: 'bg-[#E8F5F0]' },
              { icon: Lock, title: 'Privacy First', desc: '100% telemetry privacy', iconColor: 'text-[#4A8BDF]', bg: 'bg-[#EFFAFD]' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[#DCE7F2] shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                  <item.icon className={`h-5.5 w-5.5 ${item.iconColor}`} />
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-[#11183D]">{item.title}</h4>
                <p className="text-[11px] text-[#526078] font-body">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURES — White Content Cards on Pale Blue Background   */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-16 sm:py-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-[#EFFAFD]">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-3">
            Interview prep, <span className="text-[#4A8BDF]">reimagined.</span>
          </h2>
          <p className="font-body text-sm sm:text-base text-[#526078] max-w-xl mx-auto leading-relaxed">
            Deep telemetry, adversarial conversation trees, and strict assessment diagnostics built inside a modern SaaS cockpit.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Card 1: Adversarial AI Socratic Interviewer (AI Accent Card) */}
          <motion.div
            variants={scaleIn}
            className="rounded-2xl p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-md flex flex-col justify-between hover:border-[#A0006D] transition-all duration-300 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center border border-[#A0006D]/20">
                  <MessageCircle className="w-5 h-5 text-[#A0006D]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#11183D]">Adversarial AI Socratic Interviewer</h3>
                  <p className="text-xs text-[#526078]">
                    AI challenges you with role-specific follow-ups, testing your assumptions without sugarcoating.
                  </p>
                </div>
              </div>

              {/* Chat Simulation */}
              <div className="mt-6 space-y-3 font-body text-xs">
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#A0006D] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                    AI
                  </div>
                  <div className="bg-[#F8EAF4] border border-[#A0006D]/20 p-3 rounded-2xl rounded-tl-sm text-[#11183D] flex-1">
                    You mentioned designing a distributed queue. How do you guarantee exact-once delivery during network partitions?
                  </div>
                </div>

                <div className="flex gap-2.5 items-start justify-end">
                  <div className="bg-[#EFFAFD] border border-[#4A8BDF]/30 p-2.5 rounded-2xl rounded-tr-sm text-[#11183D] max-w-[80%]">
                    We use idempotent consumer IDs combined with consensus log replication...
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-[#4A8BDF] text-white flex items-center justify-center shrink-0">
                    <User size={12} />
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#A0006D] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                    AI
                  </div>
                  <div className="bg-[#F8EAF4] border border-[#A0006D]/20 p-3 rounded-2xl rounded-tl-sm text-[#11183D] flex-1">
                    <span className="text-[#A0006D] font-bold">[Bar Raiser Probe]</span> Excellent. What is the impact on P99 latency?
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Multi-Modal Behavioral Telemetry (Royal Blue Card) */}
          <motion.div
            variants={scaleIn}
            className="rounded-2xl p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-md flex flex-col justify-between hover:border-[#4A8BDF] transition-all duration-300 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2]">
                  <Activity className="w-5 h-5 text-[#4A8BDF]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#11183D]">Multi-Modal Telemetry Engine</h3>
                  <p className="text-xs text-[#526078]">
                    Real-time analysis of eye contact stability, speech pacing (WPM), audio waveforms, and code syntax.
                  </p>
                </div>
              </div>

              {/* Telemetry Preview */}
              <div className="mt-6 relative rounded-xl overflow-hidden bg-[#EFFAFD] border border-[#DCE7F2] flex items-center justify-center aspect-[16/10]">
                <img
                  src="/images/telemetry-3d.jpg"
                  alt="Candidate video telemetry"
                  className="w-full h-full object-cover object-top opacity-90"
                />

                {/* Live REC Indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-mono text-[#11183D] border border-[#DCE7F2] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#168A62] animate-pulse" />
                  LIVE TELEMETRY
                </div>

                {/* Telemetry Tags */}
                <div className="absolute top-3 right-3 space-y-1.5">
                  {[
                    { label: 'Eye Focus 94%', bg: 'bg-[#E8F5F0] text-[#168A62] border-[#168A62]/30' },
                    { label: 'Speech 142 WPM', bg: 'bg-[#EFFAFD] text-[#4A8BDF] border-[#DCE7F2]' },
                    { label: 'AI Score 88%', bg: 'bg-[#F8EAF4] text-[#A0006D] border-[#A0006D]/30' },
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border shadow-sm ${t.bg}`}
                    >
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card 3: Uninflated Scorecard Insights */}
        <motion.div
          variants={scaleIn}
          className="rounded-2xl p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-md relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2]">
              <BarChart3 className="w-5 h-5 text-[#4A8BDF]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#11183D]">Uninflated STAR Scorecard Insights</h3>
              <p className="text-xs text-[#526078]">
                Calibrated diagnostics across technical, behavioral, and communication metrics. Click categories to inspect live breakdowns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Nav Menu Buttons */}
            <div className="md:col-span-3 space-y-1.5 font-body text-xs">
              {[
                { id: 'overall', label: 'Overall', icon: Flame, color: 'text-[#4A8BDF]' },
                { id: 'technical', label: 'Technical Skills', icon: Code2, color: 'text-[#4A8BDF]' },
                { id: 'communication', label: 'Communication', icon: Users, color: 'text-[#4A8BDF]' },
                { id: 'behavioral', label: 'Behavioral', icon: Zap, color: 'text-[#168A62]' },
                { id: 'suggestions', label: 'AI Action Plan', icon: Sparkles, color: 'text-[#A0006D]' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeScoreTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScoreTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-[#4A8BDF] text-white shadow-sm'
                        : 'text-[#526078] hover:text-[#11183D] hover:bg-[#EFFAFD]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Center: Dynamic Animated Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="56" stroke="#DCE7F2" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="56"
                    stroke="#4A8BDF"
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
                    className="font-display font-black text-3xl text-[#11183D]"
                  >
                    {currentCategory.score}{' '}
                    <span className="text-sm font-normal text-[#526078]">/ 100</span>
                  </motion.span>
                  <span className="text-[10px] text-[#4A8BDF] font-mono font-bold mt-0.5 max-w-[130px] text-center truncate">
                    {currentCategory.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Breakdown Bars */}
            <div className="md:col-span-5 space-y-3.5 text-xs font-body">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-[#526078] text-xs uppercase tracking-wider font-mono">
                  Rubric Metrics
                </p>
                <span className="text-[10px] text-[#4A8BDF] font-mono font-bold">
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
                        <span className="text-[#526078]">{b.label}</span>
                        <span className="font-mono text-[#11183D] font-bold">{b.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#DCE7F2] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#4A8BDF] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${b.val}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STATS                                                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="py-16 sm:py-24 bg-[#EFFAFD]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight leading-tight">
              Numbers that <span className="text-[#4A8BDF]">speak</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Flame,
                targetNumber: 885,
                suffix: '+',
                title: 'Engineers Prepared',
                desc: 'From students to Staff Engineers ready for Tier-1 interviews.',
                color: 'text-[#4A8BDF]',
                bgColor: 'bg-[#EFFAFD]',
              },
              {
                icon: Brain,
                targetNumber: 11067,
                suffix: '+',
                title: 'Socratic Prompts',
                desc: 'Adversarial questions generated from resumes and targets.',
                color: 'text-[#A0006D]',
                bgColor: 'bg-[#F8EAF4]',
              },
              {
                icon: TrendingUp,
                targetNumber: 25,
                suffix: '%',
                title: 'STAR Adherence',
                desc: 'Candidates show 25% growth in structured delivery within 3 runs.',
                color: 'text-[#168A62]',
                bgColor: 'bg-[#E8F5F0]',
              },
              {
                icon: Star,
                targetNumber: 4.8,
                suffix: '/5',
                decimals: 1,
                title: 'Satisfaction Score',
                desc: 'Loved by candidates preparing for top tech companies.',
                color: 'text-[#4A8BDF]',
                bgColor: 'bg-[#EFFAFD]',
              },
            ].map((stat, i) => (
              <motion.div key={i} variants={scaleIn} custom={i}>
                <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between group hover:-translate-y-0.5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-display font-black text-3xl sm:text-4xl ${stat.color}`}>
                        <AnimatedCounter
                          target={stat.targetNumber}
                          decimals={stat.decimals || 0}
                          suffix={stat.suffix}
                        />
                      </span>
                      <div className={`h-10 w-10 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#11183D] font-display mb-1.5">
                      {stat.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#526078] font-body leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* WORKFLOW / HOW IT WORKS                                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="workflow" className="py-20 sm:py-28 bg-[#EFFAFD] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight leading-tight mb-4">
              How <span className="text-[#4A8BDF]">R U Ready?</span> Works
            </h2>
            <p className="font-body text-[#526078] text-sm sm:text-base leading-relaxed">
              Experience the full rigor of technical and behavioral hiring loops in 4 calibrated steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Persona Calibration',
                desc: 'Upload target JD, choose level (Junior to Staff), and select persona: Hiring Manager, Architect, or Bar Raiser.',
                icon: Sliders,
                tag: 'Step 1',
                color: 'text-[#4A8BDF]',
                bg: 'bg-[#EFFAFD]',
              },
              {
                step: '02',
                title: 'Socratic Voice Room',
                desc: 'AVA asks role-specific scenarios, listens actively, and poses probing follow-ups if answers lack depth.',
                icon: MessageCircle,
                tag: 'Step 2',
                color: 'text-[#A0006D]',
                bg: 'bg-[#F8EAF4]',
              },
              {
                step: '03',
                title: 'Live Telemetry',
                desc: 'Continuous tracking of audio waveforms, speech pacing (WPM), filler words, gaze stability, and code syntax.',
                icon: Activity,
                tag: 'Step 3',
                color: 'text-[#4A8BDF]',
                bg: 'bg-[#EFFAFD]',
              },
              {
                step: '04',
                title: 'Uninflated Scorecard',
                desc: 'Receive uncompromising scores across Situation, Task, Action, and Result with line-by-line action items.',
                icon: BarChart3,
                tag: 'Step 4',
                color: 'text-[#168A62]',
                bg: 'bg-[#E8F5F0]',
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
                  className={`relative rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-250 flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-white border-2 border-[#4A8BDF] shadow-md -translate-y-1'
                      : 'bg-white border border-[#DCE7F2] hover:border-[#4A8BDF]'
                  }`}
                >
                  <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full font-mono text-[10px] font-black tracking-widest uppercase shadow transition-colors ${
                    isSelected ? 'bg-[#4A8BDF] text-white' : 'bg-[#11183D] text-white'
                  }`}>
                    STEP {card.step}
                  </div>

                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 shadow-sm ${
                      isSelected
                        ? 'bg-[#4A8BDF] text-white scale-105'
                        : `${card.bg} border border-[#DCE7F2] ${card.color} group-hover:bg-[#4A8BDF] group-hover:text-white`
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-[#4A8BDF] font-mono uppercase tracking-wider block mb-1">
                      {card.tag}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#11183D] mb-2.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#526078] font-body leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#7B8799] font-medium block">
                      Calibration Loop
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#4A8BDF] translate-x-0.5' : 'text-[#7B8799]'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register">
              <button className="inline-flex items-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
                <span>Start Practice Workflow</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRICING SECTION                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 sm:py-28 bg-[#EFFAFD] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight leading-tight mb-4">
              Practice That Fits Your <span className="text-[#4A8BDF]">Budget</span>
            </h2>
            <p className="font-body text-[#526078] text-sm sm:text-base leading-relaxed">
              No locked subscriptions or hidden fees. Calibrate your readiness with flexible session bundles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Plan 1: Free */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="rounded-2xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#526078] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 border border-[#DCE7F2]">
                  Starter
                </div>
                <h3 className="font-display font-black text-xl text-[#11183D] mb-1">Free Tier</h3>
                <p className="text-xs text-[#526078] font-body mb-6">Test the platform and benchmark your baseline.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-[#11183D]">₹0</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ forever free</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  {[
                    '2 Practice Sessions / month',
                    'Standard Behavioral STAR Evaluation',
                    'Standard AI Model Latency',
                    'Executive Score Overview',
                    'Web & Mobile Responsive Access',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#7B8799] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl border border-[#DCE7F2] hover:bg-[#EFFAFD] font-display font-bold text-xs text-[#4A8BDF] transition-all cursor-pointer">
                  Start Free
                </button>
              </Link>
            </motion.div>

            {/* Plan 2: ₹69 Single Pass */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="rounded-2xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#DCE7F2] text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Quick Sprint
                </div>
                <h3 className="font-display font-black text-xl text-[#11183D] mb-1">Single Pass</h3>
                <p className="text-xs text-[#526078] font-body mb-6">Got an interview tomorrow? Run a targeted mock.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-[#11183D]">₹69</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ single session</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  {[
                    '1 Full Adaptive Mock Session',
                    'Choice of Any Persona (Hiring Mgr / Bar Raiser)',
                    'Live Audio Waveform & Speech Pacing',
                    'Granular STAR Breakdown & Scorecard',
                    'Instant PDF Feedback Download',
                    'Session Audio & Full Transcript Replay',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer">
                  Get Pass — ₹69
                </button>
              </Link>
            </motion.div>

            {/* Plan 3: ₹159 Pro Pack (HIGHLIGHTED ROYAL BLUE) */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="rounded-2xl bg-white border-2 border-[#4A8BDF] p-6 sm:p-7 shadow-xl relative flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A8BDF] text-white text-[10px] font-black font-mono uppercase tracking-widest shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>Most Popular</span>
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 mt-2 border border-[#A0006D]/20">
                  AI Career Pro
                </div>
                <h3 className="font-display font-black text-xl text-[#11183D] mb-1">5-Session Bundle</h3>
                <p className="text-xs text-[#526078] font-body mb-6">Complete interview prep for Tier-1 engineering roles.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-[#4A8BDF]">₹159</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ 5 sessions (₹31/ea)</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
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
                      <Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-xs shadow-md transition-all cursor-pointer">
                  Unlock Pro Pack — ₹159
                </button>
              </Link>
            </motion.div>

            {/* Plan 4: ₹249 AI Mastery Pack (EGGPLANT AI HIGHLIGHT) */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="rounded-2xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 border border-[#A0006D]/20">
                  Full AI Mastery
                </div>
                <h3 className="font-display font-black text-xl text-[#11183D] mb-1">15-Session Elite</h3>
                <p className="text-xs text-[#526078] font-body mb-6">Comprehensive mastery for Staff & FAANG roles.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-4xl text-[#11183D]">₹249</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ 15 sessions (₹16/ea)</span>
                </div>

                <ul className="space-y-3 text-xs font-body text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
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
                      <Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#A0006D] hover:bg-[#780052] text-white font-display font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer">
                  Get Ultimate — ₹249
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FAQ SECTION                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="about" className="py-20 sm:py-28 bg-[#EFFAFD]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#11183D] tracking-tight leading-tight mb-3">
              Frequently Asked <span className="text-[#4A8BDF]">Questions</span>
            </h2>
            <p className="font-body text-[#526078] text-sm sm:text-base leading-relaxed">
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
                  className="rounded-2xl bg-white border border-[#DCE7F2] overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm sm:text-base text-[#11183D] hover:text-[#4A8BDF] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7B8799] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-[#4A8BDF]' : ''
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
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#526078] font-body leading-relaxed border-t border-[#DCE7F2]">
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
      {/* CTA BANNER                                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#EFFAFD]">
        <motion.div
          variants={scaleIn}
          className="mx-auto max-w-5xl relative overflow-hidden rounded-2xl bg-white text-[#11183D] p-8 sm:p-12 lg:p-14 shadow-xl border border-[#DCE7F2] text-center"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-[#A0006D] font-mono uppercase tracking-widest bg-[#F8EAF4] px-3 py-1 rounded-full border border-[#A0006D]/20 inline-block">
              AI CAREER TECHNOLOGY
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight leading-tight">
              Ready to meet <span className="text-[#4A8BDF]">AVA?</span>
            </h2>
            <p className="font-body text-[#526078] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Join thousands of engineers who stopped guessing and calibrated their technical capacity.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/register" className="group shrink-0">
                <button className="inline-flex items-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer">
                  Start Assessment — It's Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <a href="#features" className="shrink-0">
                <button className="inline-flex items-center gap-2 border border-[#DCE7F2] bg-white hover:bg-[#EFFAFD] text-[#4A8BDF] px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-current text-[#4A8BDF]" />
                  Watch Demo
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
