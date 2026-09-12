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
  FileText,
  Compass,
  Layers,
  Search,
  BookOpen,
  Award,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// ─── Inline Brand Logo SVGs for Orbital Hero Rings ──────────────

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.65H1.27C.46 8.26 0 10.07 0 12s.46 3.74 1.27 5.35l4.01-3.13z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.65l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z" />
    </svg>
  );
}

function MetaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0668E1">
      <path d="M16.78 3.01c-1.89 0-3.66.9-4.78 2.37-1.12-1.47-2.89-2.37-4.78-2.37-3.47 0-6.22 2.78-6.22 6.25 0 4.19 3.64 8.01 9.94 11.45l1.06.58 1.06-.58c6.3-3.44 9.94-7.26 9.94-11.45 0-3.47-2.75-6.25-6.22-6.25z" />
    </svg>
  );
}

function AWSLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF9900">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SlackLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#E01E5A" d="M6 15a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-7.5A2.5 2.5 0 0 1 8.5 10H6V7.5z" />
      <path fill="#36C5F0" d="M9 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm7.5 0A2.5 2.5 0 0 1 14 8.5V6h2.5z" />
      <path fill="#2EB67D" d="M18 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 7.5a2.5 2.5 0 0 1-2.5-2.5H18v2.5z" />
      <path fill="#ECB22E" d="M15 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-7.5 0A2.5 2.5 0 0 1 10 15.5V18H7.5z" />
    </svg>
  );
}

function StripeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-4.116C17.72 2.148 15.228 1.5 12.35 1.5 7.42 1.5 4.09 3.99 4.09 7.962c0 4.707 4.908 5.626 8.358 6.892 2.457.9 3.284 1.65 3.284 2.614 0 .997-.936 1.558-2.385 1.558-2.614 0-5.32-1.157-7.234-2.19l-.92 4.195c2.052 1.053 4.937 1.768 8.017 1.768 5.253 0 8.793-2.392 8.793-6.619 0-4.887-4.757-5.836-8.027-7.022z" />
    </svg>
  );
}

// ─── Frequently Asked Questions ──────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does the AI Resume & ATS Engine work?',
    a: 'Simply upload your PDF/DOCX resume and paste any target job description or URL. Our AI extracts requirements, computes your keyword match score, highlights missing skills, rewrites bullet points into STAR format, and generates a customized mock interview loop.',
  },
  {
    q: 'What are Career Roadmaps & Tech Stack Customizers?',
    a: 'Roadmaps provide complete step-by-step career pathways for roles like Full Stack Developer, Data Analyst, Cloud Architect, and System Design Lead. You can customize your tech stack and track your learning progress interactively.',
  },
  {
    q: 'What is the Role Discussion Community?',
    a: 'It is an open group forum where candidates preparing for specific roles (Frontend, Backend, System Design, Data) discuss interview questions, share feedback, and collaborate on prep strategies.',
  },
  {
    q: 'What does "uninflated" scoring mean?',
    a: 'Unlike generic AI chatbots that give polite or flattering scores, R U Ready? evaluates answers strictly against Tier-1 calibrated rubrics (Situation, Task, Action specificity, and Measurable Results). You receive the unfiltered truth about where your answers lack depth.',
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
    title: 'Executive Overall Readiness',
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<string>('fullstack');

  const currentCategory = SCORECARD_DATA[activeScoreTab] || SCORECARD_DATA.overall;
  const { scrollYProgress: pageScrollProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EFFAFD] text-[#11183D] overflow-hidden selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] font-sans">
      <Helmet>
        <title>R U Ready? — Check Your Standards & Upgrade Yourself to Get Placed</title>
        <meta name="description" content="AI Mock Interviews, ATS Resume Match Engine, Custom Career Roadmaps & Candidate Role Discussion Communities." />
      </Helmet>

      {/* Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: pageScrollProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#4A8BDF] z-50 transform origin-left"
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* CONCENTRIC ORBITAL HERO SECTION                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#EFFAFD] via-white to-[#EFFAFD]"
      >
        {/* SVG Concentric Orbit Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
          <svg className="w-[1100px] h-[1100px] opacity-40 text-[#4A8BDF]/20" viewBox="0 0 1000 1000">
            <circle cx="500" cy="500" r="160" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="6 6" />
            <circle cx="500" cy="500" r="280" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <circle cx="500" cy="500" r="490" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Floating Tech Brand Logos on Orbit Orbits */}
        <div className="absolute inset-0 max-w-6xl mx-auto pointer-events-none z-10 hidden sm:block">
          {/* Inner Orbit Badges */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[22%] left-[18%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <GoogleLogo className="w-5 h-5" />
          </motion.div>
          
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[20%] right-[20%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <MetaLogo className="w-5 h-5" />
          </motion.div>

          {/* Middle Orbit Badges */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[45%] left-[8%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <AWSLogo className="w-5.5 h-5.5" />
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[48%] right-[10%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <SlackLogo className="w-5.5 h-5.5" />
          </motion.div>

          {/* Outer Orbit Badges */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[22%] left-[16%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <StripeLogo className="w-5 h-5" />
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[24%] right-[17%] p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md flex items-center justify-center"
          >
            <div className="w-5 h-5 rounded-full bg-[#11183D] flex items-center justify-center text-[10px] font-bold text-white font-mono">
              Uber
            </div>
          </motion.div>
        </div>

        {/* Center Hero Content Container */}
        <div className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          
          {/* Top Trust Ratings & AI Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Pink AI Pill Badge (Matching reference image) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE8F3] border border-[#F4B4D6] text-[#A0006D] font-sans font-semibold text-xs shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A0006D]" />
              <span>AI-Powered Interview Intelligence</span>
            </motion.div>

            {/* Google / Trustpilot rating badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#526078] text-xs font-medium shadow-xs">
              <span className="font-bold text-[#11183D] flex items-center gap-1">
                <GoogleLogo className="w-3.5 h-3.5" /> 4.6 Google
              </span>
              <span>•</span>
              <span className="font-bold text-[#168A62] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#168A62] text-[#168A62]" /> 4.9 Trustpilot
              </span>
            </div>
          </div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#11183D] leading-[1.12] tracking-tight max-w-3xl mx-auto"
          >
            Check Your Standards &{' '}
            <span className="text-[#4A8BDF] underline decoration-[#4A8BDF]/30 underline-offset-8">
              Upgrade Yourself
            </span>{' '}
            to Get Placed
          </motion.h1>

          {/* Hero Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans text-base sm:text-lg text-[#526078] max-w-2xl mx-auto leading-relaxed"
          >
            From ATS resume alignment to Socratic mock interviews and custom career roadmaps — benchmark your real readiness against Tier-1 tech hiring bars.
          </motion.p>

          {/* Hero Action Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <button className="inline-flex items-center gap-2 bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer">
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Practice'}</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </Link>

            <Link to="/roadmaps">
              <button className="inline-flex items-center gap-2 bg-white hover:bg-[#EFFAFD] text-[#11183D] font-sans font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full border border-[#DCE7F2] shadow-xs hover:shadow transition-all cursor-pointer">
                <Compass className="w-4 h-4 text-[#4A8BDF]" />
                <span>Explore Roadmaps</span>
              </button>
            </Link>
          </motion.div>

          {/* Stacked Live Candidate Activity Notification Cards (Matching reference image) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="pt-8 max-w-md mx-auto relative"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCE7F2] shadow-xl p-3.5 flex items-center gap-3 relative z-30 transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-full bg-[#4A8BDF] text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                WC
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-[#11183D] truncate">
                  Wei Chen <span className="font-normal text-[#526078]">joined</span> System Design Loop
                </p>
                <p className="text-[11px] text-[#7B8799] font-mono">8 min ago • Orixcreative Dribbble</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#168A62] animate-pulse shrink-0" />
            </div>

            {/* Sub-Card Stack Layer 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#DCE7F2] shadow-md p-3 flex items-center gap-3 relative -mt-3.5 mx-3 z-20 text-left">
              <div className="w-8 h-8 rounded-full bg-[#A0006D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                MJ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#11183D] truncate">
                  Matthew Johnson <span className="font-normal text-[#526078]">• Senior Frontend Role Matched 94%</span>
                </p>
              </div>
            </div>

            {/* Sub-Card Stack Layer 2 */}
            <div className="bg-white/60 backdrop-blur-xs rounded-2xl border border-[#DCE7F2]/60 shadow-xs p-2.5 flex items-center gap-3 relative -mt-3.5 mx-6 z-10 text-left">
              <div className="w-7 h-7 rounded-full bg-[#168A62] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                TL
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#526078] truncate">
                  Terry Lipshutz <span className="font-normal text-[#7B8799]">• STAR Bullet Rewritten</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Logo Bar */}
        <div className="mt-16 pt-8 border-t border-[#DCE7F2]/60 w-full max-w-5xl mx-auto px-4 text-center z-20">
          <p className="text-xs font-bold font-mono uppercase tracking-widest text-[#7B8799] mb-5">
            Trusted by 200,000+ candidates preparing for top tech companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 font-display font-bold text-sm text-[#526078]">
            <span>Google</span>
            <span>Airbnb</span>
            <span>Coinbase</span>
            <span>Notion</span>
            <span>Gumroad</span>
            <span>PayPal</span>
            <span>Upwork</span>
            <span>Shopify</span>
            <span>Stripe</span>
            <span>Zoom</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURE 1: AI RESUME & ATS MATCH ENGINE                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="ats-engine" className="py-20 sm:py-28 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/30 text-[#A0006D] text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText size={14} /> NEW: ATS Scorecard Engine
          </div>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-4">
            AI Resume & Job Description <span className="text-[#A0006D]">Match Engine</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#526078] leading-relaxed">
            Upload your resume and paste any target job description. Get instant keyword match scoring, missing skill gap analysis, and automated STAR bullet point rewrites.
          </p>
        </div>

        {/* ATS Showcase Card */}
        <motion.div
          variants={scaleIn}
          className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-10 shadow-lg relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: ATS Metric Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#A0006D] uppercase tracking-wider">
                  Target Alignment: Senior Full Stack Engineer @ Stripe
                </span>
                <h3 className="font-sans font-bold text-2xl text-[#11183D]">
                  Uncover Missing Keywords & Build 100% Custom Mock Loops
                </h3>
                <p className="text-xs text-[#526078] leading-relaxed">
                  Our ATS engine parses your experience against exact job requirements, converting resume bullet points into high-impact STAR metrics.
                </p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {[
                  { title: 'Keyword Match Score', desc: 'Computes exact semantic alignment percentage (88% match)', color: 'text-[#168A62]' },
                  { title: 'Missing Skill Gap Identifier', desc: 'Detects absent keywords like Redis Caching, GraphQL, & K8s', color: 'text-[#4A8BDF]' },
                  { title: 'STAR Method Bullet Rewriter', desc: 'Transforms vague lines into quantified achievement statements', color: 'text-[#A0006D]' },
                  { title: 'Custom Mock Suite Generation', desc: 'Creates a 100% custom interview loop from the target posting', color: 'text-[#11183D]' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
                    <CheckCircle2 className={`w-4 h-4 ${item.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-bold text-[#11183D]">{item.title}</p>
                      <p className="text-[#526078] text-[11px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/ats">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#A0006D] hover:bg-[#780052] text-white font-sans font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer">
                  <span>Launch ATS Scanner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Right: Interactive ATS Scorecard Mockup */}
            <div className="lg:col-span-7 bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2] p-5 sm:p-7 space-y-5">
              
              {/* ATS Top Score Ribbon */}
              <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-[#7B8799] uppercase tracking-wider font-bold">Overall ATS Score</p>
                  <p className="text-2xl font-bold font-sans text-[#168A62]">92% Match</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#E8F5F0] text-[#168A62] font-mono font-bold text-xs">
                  ATS Verified
                </div>
              </div>

              {/* STAR Bullet Point Rewrite Box */}
              <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs space-y-2">
                <p className="text-xs font-bold text-[#11183D]">STAR Bullet Optimization</p>
                <div className="p-2.5 rounded-lg bg-[#FDF2F2] border border-[#D64545]/20 text-[11px] text-[#D64545] font-sans">
                  <span className="font-bold">Before:</span> "Worked on database performance and optimized SQL queries."
                </div>
                <div className="p-2.5 rounded-lg bg-[#E8F5F0] border border-[#168A62]/30 text-[11px] text-[#168A62] font-sans">
                  <span className="font-bold">After (STAR):</span> "Redesigned PostgreSQL query indexing, reducing P99 latency by 42% across 1.2M daily active user requests."
                </div>
              </div>

              {/* Missing Keywords Pills */}
              <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs space-y-2">
                <p className="text-xs font-bold text-[#11183D]">Missing Skill Keywords to Add</p>
                <div className="flex flex-wrap gap-2">
                  {['Distributed Caching', 'Kafka Streaming', 'CI/CD Pipelines', 'System Observability'].map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/20 text-[#A0006D] text-[11px] font-mono font-semibold">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURE 2: ADVANCED CAREER ROADMAPS                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="roadmaps" className="py-20 sm:py-28 bg-white border-y border-[#DCE7F2]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFFAFD] border border-[#4A8BDF]/30 text-[#4A8BDF] text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass size={14} /> NEW: Role Mastery Pathways
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-4">
              Advanced Career <span className="text-[#4A8BDF]">Roadmaps & Customizer</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#526078] leading-relaxed">
              Step-by-step tech stack roadmaps for Full Stack Developers, Data Analysts, DevOps Leads, and System Architects with live progress tracking and custom stack creation.
            </p>
          </div>

          {/* Interactive Roadmap Selector & Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                id: 'fullstack',
                title: 'Full Stack Engineering',
                role: 'Senior Full Stack Developer',
                topics: ['React / Next.js', 'Node.js & Microservices', 'PostgreSQL & Redis', 'System Design & Distributed Queues'],
                color: 'border-[#4A8BDF] text-[#4A8BDF]',
                bg: 'bg-[#EFFAFD]',
              },
              {
                id: 'data',
                title: 'Data & Analytics Lead',
                role: 'Data Analyst & BI Specialist',
                topics: ['SQL & Data Modeling', 'Python & Pandas', 'Tableau & PowerBI', 'ETL Pipelines & Snowflake'],
                color: 'border-[#A0006D] text-[#A0006D]',
                bg: 'bg-[#F8EAF4]',
              },
              {
                id: 'cloud',
                title: 'Cloud & DevOps Architect',
                role: 'DevOps & Infrastructure Engineer',
                topics: ['Docker & Kubernetes', 'Terraform & IaC', 'AWS / GCP Cloud Architecture', 'CI/CD & Observability'],
                color: 'border-[#168A62] text-[#168A62]',
                bg: 'bg-[#E8F5F0]',
              },
            ].map((rm) => (
              <motion.div
                key={rm.id}
                variants={scaleIn}
                onClick={() => setActiveRoadmap(rm.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
                  activeRoadmap === rm.id ? `${rm.color} shadow-md` : 'border-[#DCE7F2] hover:border-[#4A8BDF]'
                }`}
              >
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3 ${rm.bg} ${rm.color}`}>
                    {rm.title}
                  </div>
                  <h3 className="font-sans font-bold text-xl text-[#11183D] mb-4">{rm.role}</h3>
                  <div className="space-y-2">
                    {rm.topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#526078] font-sans">
                        <CheckCircle2 className="w-4 h-4 text-[#168A62] shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-5 mt-5 border-t border-[#DCE7F2] flex items-center justify-between text-xs font-bold">
                  <span className="text-[#11183D]">Interactive Pathway</span>
                  <ChevronRight className="w-4 h-4 text-[#4A8BDF]" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/roadmaps">
              <button className="inline-flex items-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-sans font-semibold text-sm px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer">
                <span>Browse All Popular Roadmaps & Customize Yours</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURE 3: ROLE DISCUSSION COMMUNITIES                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="discuss-community" className="py-20 sm:py-28 bg-[#EFFAFD]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F5F0] border border-[#168A62]/30 text-[#168A62] text-xs font-semibold uppercase tracking-wider mb-3">
              <Users size={14} /> NEW: Role Discussion Forum
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-4">
              Open Group <span className="text-[#168A62]">Role Communities</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#526078] leading-relaxed">
              Connect with candidate peers preparing for identical roles. Discuss real interview questions, exchange feedback, and compare roadmap milestones.
            </p>
          </div>

          {/* Group Forum Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                group: 'Frontend & UI Architecture',
                members: '1,420 Candidates',
                topic: 'How to explain React Concurrent Mode & Fiber Reconciliation in Staff interviews?',
                replies: 48,
                tag: 'Frontend',
              },
              {
                group: 'Backend & Distributed Systems',
                members: '2,150 Candidates',
                topic: 'Best approach for Rate Limiter design: Token Bucket vs Sliding Window Counter?',
                replies: 76,
                tag: 'Backend',
              },
            ].map((forum, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="p-6 rounded-3xl bg-white border border-[#DCE7F2] shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] font-mono text-[10px] font-bold uppercase border border-[#DCE7F2]">
                    {forum.tag} Group
                  </span>
                  <span className="text-xs text-[#7B8799] font-sans">{forum.members}</span>
                </div>
                <h3 className="font-sans font-bold text-lg text-[#11183D]">{forum.group}</h3>
                <div className="p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#526078]">
                  "{forum.topic}"
                </div>
                <div className="flex items-center justify-between text-xs text-[#7B8799] pt-2">
                  <span>{forum.replies} Active Replies</span>
                  <Link to="/discuss" className="text-[#4A8BDF] font-bold hover:underline flex items-center gap-1">
                    Join Discussion <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FEATURE 4: ADVERSARIAL SOCRATIC INTERVIEW & TELEMETRY   */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-20 sm:py-28 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-[#EFFAFD]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-3">
            Socratic AI Interviewer & <span className="text-[#4A8BDF]">Audio Telemetry</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#526078] max-w-xl mx-auto leading-relaxed">
            Multi-agent personas (Hiring Manager, Architect, Bar Raiser) with sub-300ms real-time audio telemetry and Monaco coding runner.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Card 1: Personas */}
          <motion.div
            variants={scaleIn}
            className="rounded-3xl p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-md flex flex-col justify-between hover:border-[#A0006D] transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center border border-[#A0006D]/20">
                  <MessageCircle className="w-5 h-5 text-[#A0006D]" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-[#11183D]">Multi-Agent Socratic Personas</h3>
                  <p className="text-xs text-[#526078]">Hiring Manager, Technical Architect, & Bar Raiser.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 font-sans text-xs">
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#A0006D] text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                    AI
                  </div>
                  <div className="bg-[#F8EAF4] border border-[#A0006D]/20 p-3 rounded-2xl text-[#11183D] flex-1">
                    How do you guarantee exact-once delivery during network partitions in your queue architecture?
                  </div>
                </div>
                <div className="flex gap-2.5 items-start justify-end">
                  <div className="bg-[#EFFAFD] border border-[#4A8BDF]/30 p-2.5 rounded-2xl text-[#11183D] max-w-[80%]">
                    We use idempotent consumer IDs combined with consensus log replication...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Audio Telemetry */}
          <motion.div
            variants={scaleIn}
            className="rounded-3xl p-6 sm:p-8 bg-white border border-[#DCE7F2] shadow-md flex flex-col justify-between hover:border-[#4A8BDF] transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2]">
                  <Activity className="w-5 h-5 text-[#4A8BDF]" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-[#11183D]">Real-Time Audio Telemetry</h3>
                  <p className="text-xs text-[#526078]">Speech pacing (145 WPM), eye gaze stability, & waveform analysis.</p>
                </div>
              </div>

              <div className="mt-6 relative rounded-2xl overflow-hidden bg-[#EFFAFD] border border-[#DCE7F2] p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#168A62] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-[#11183D]">LIVE AUDIO TELEMETRY ACTIVE</span>
                </div>
                <div className="flex justify-center gap-1.5 py-3">
                  {[40, 75, 30, 90, 60, 100, 45, 80, 50].map((h, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [h * 0.4, h, h * 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.1 }}
                      className="w-1.5 bg-[#4A8BDF] rounded-full h-8"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* PRICING BUNDLES                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 sm:py-28 bg-[#EFFAFD] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight mb-4">
              Practice That Fits Your <span className="text-[#4A8BDF]">Budget</span>
            </h2>
            <p className="font-sans text-[#526078] text-sm sm:text-base leading-relaxed">
              No locked subscriptions or hidden fees. Calibrate your readiness with flexible session bundles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Plan 1: Free */}
            <div className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#526078] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 border border-[#DCE7F2]">
                  Starter
                </div>
                <h3 className="font-sans font-bold text-xl text-[#11183D] mb-1">Free Tier</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-sans font-extrabold text-4xl text-[#11183D]">₹0</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ forever free</span>
                </div>
                <ul className="space-y-3 text-xs font-sans text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#7B8799]" /> 2 Practice Sessions / month</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#7B8799]" /> Standard Behavioral STAR Evaluation</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#7B8799]" /> Web & Mobile Responsive Access</li>
                </ul>
              </div>
              <Link to="/register"><button className="w-full py-3 rounded-full border border-[#DCE7F2] hover:bg-[#EFFAFD] font-semibold text-xs text-[#4A8BDF]">Start Free</button></Link>
            </div>

            {/* Plan 2: ₹69 */}
            <div className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#DCE7F2] text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Quick Sprint
                </div>
                <h3 className="font-sans font-bold text-xl text-[#11183D] mb-1">Single Pass</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-sans font-extrabold text-4xl text-[#11183D]">₹69</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ single session</span>
                </div>
                <ul className="space-y-3 text-xs font-sans text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> 1 Full Adaptive Mock Session</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> ATS Resume Match Scanner</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> Instant PDF Feedback Download</li>
                </ul>
              </div>
              <Link to="/register"><button className="w-full py-3 rounded-full bg-[#4A8BDF] text-white font-semibold text-xs shadow-sm">Get Pass — ₹69</button></Link>
            </div>

            {/* Plan 3: ₹159 Pro */}
            <div className="rounded-3xl bg-white border-2 border-[#4A8BDF] p-6 sm:p-7 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A8BDF] text-white text-[10px] font-bold font-mono uppercase tracking-widest shadow-sm">
                Most Popular
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 mt-2">
                  AI Career Pro
                </div>
                <h3 className="font-sans font-bold text-xl text-[#11183D] mb-1">5-Session Bundle</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-sans font-extrabold text-4xl text-[#4A8BDF]">₹159</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ 5 sessions</span>
                </div>
                <ul className="space-y-3 text-xs font-sans text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> 5 Mock Sessions (Oral + Coding)</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> Full ATS Resume & STAR Engine</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF]" /> Career Roadmap Access</li>
                </ul>
              </div>
              <Link to="/register"><button className="w-full py-3.5 rounded-full bg-[#4A8BDF] text-white font-semibold text-xs shadow-md">Unlock Pro Pack — ₹159</button></Link>
            </div>

            {/* Plan 4: ₹249 Elite */}
            <div className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                  Full AI Mastery
                </div>
                <h3 className="font-sans font-bold text-xl text-[#11183D] mb-1">15-Session Elite</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-sans font-extrabold text-4xl text-[#11183D]">₹249</span>
                  <span className="text-xs font-mono text-[#7B8799]">/ 15 sessions</span>
                </div>
                <ul className="space-y-3 text-xs font-sans text-[#526078] mb-8 border-t border-[#DCE7F2] pt-6">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D]" /> 15 Full Multi-Modal Mock Sessions</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D]" /> Priority ATS & Roadmap Calibration</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D]" /> Open Role Community VIP Access</li>
                </ul>
              </div>
              <Link to="/register"><button className="w-full py-3 rounded-full bg-[#A0006D] text-white font-semibold text-xs">Get Ultimate — ₹249</button></Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FAQ SECTION                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="about" className="py-20 sm:py-28 bg-[#EFFAFD]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-[#11183D] tracking-tight mb-3">
              Frequently Asked <span className="text-[#4A8BDF]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl bg-white border border-[#DCE7F2] overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-sans font-bold text-sm sm:text-base text-[#11183D] hover:text-[#4A8BDF] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#7B8799] transition-transform ${isOpen ? 'rotate-180 text-[#4A8BDF]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#526078] font-sans leading-relaxed border-t border-[#DCE7F2]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* CTA BANNER                                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#EFFAFD]">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white text-[#11183D] p-8 sm:p-14 shadow-xl border border-[#DCE7F2] text-center space-y-5">
          <span className="text-[10px] font-bold text-[#A0006D] font-mono uppercase tracking-widest bg-[#F8EAF4] px-3 py-1 rounded-full border border-[#A0006D]/20 inline-block">
            AI CAREER INTELLIGENCE
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11183D] tracking-tight">
            Ready to Check Your Standards & Get Placed?
          </h2>
          <p className="font-sans text-[#526078] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Join thousands of candidates using R U Ready? for ATS alignment, mock interviews, and career roadmaps.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <button className="inline-flex items-center gap-2 bg-[#11183D] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md transition-all cursor-pointer">
                <span>Start Free Assessment</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
