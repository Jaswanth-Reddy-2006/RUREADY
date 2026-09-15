import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Code2,
  FileText,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export interface FeatureSlide {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  themeColor: string;
  badgeLabel: string;
  personaName: string;
  personaRole: string;
  personaIcon: React.ReactNode;
}

export const FEATURES: FeatureSlide[] = [
  {
    id: 'voice-mock',
    step: '01 • Socratic Voice Mock',
    title: 'Practice Realistic Voice Interviews with Ava, Your 3D AI Interviewer',
    subtitle: 'Real-Time Audio Telemetry & STAR Biofeedback',
    description:
      'Speak naturally just like in a live FAANG interview. Ava listens to your explanations, evaluates communication clarity in real time, and provides gentle, empathetic coaching so you enter your real hiring loops with 100% confidence.',
    benefits: [
      'Natural conversational pacing (140-160 WPM target)',
      'STAR method scoring (Situation, Task, Action, Result)',
      'Dynamic 3D avatar facial lip-sync and eye contact',
    ],
    ctaText: 'Start Voice Mock',
    ctaLink: '/interview/new',
    themeColor: '#4A8BDF',
    badgeLabel: 'Ava Socratic AI',
    personaName: 'Ava Socratic AI',
    personaRole: 'Senior Interviewer Persona',
    personaIcon: <Mic className="w-3.5 h-3.5 text-white" />,
  },
  {
    id: 'coding-sandbox',
    step: '02 • Live Code Playground',
    title: 'Solve Real Algorithmic Problems in a Fast Browser Sandbox',
    subtitle: 'Multi-Language Compiler & Socratic Editorial Hints',
    description:
      'Execute code across 6 popular languages directly in your browser. Get immediate test feedback, catch tricky boundary edge cases, and receive progressive hints when you need guidance without spoiling the solution.',
    benefits: [
      '6 Languages: JavaScript, TypeScript, Python, Java, C++, Go',
      'Instant sandboxed execution with visible & hidden test cases',
      'Progressive Socratic hints (Pattern → Data Structure → Approach)',
    ],
    ctaText: 'Open Code Sandbox',
    ctaLink: '/interview/coding',
    themeColor: '#4A8BDF',
    badgeLabel: 'Monaco Sandbox',
    personaName: 'Monaco Engine',
    personaRole: 'Sandboxed Code Runner',
    personaIcon: <Code2 className="w-3.5 h-3.5 text-white" />,
  },
  {
    id: 'ats-scanner',
    step: '03 • ATS Resume Diagnostic',
    title: 'Match Your Resume to Any Target Job Description',
    subtitle: 'Spot Missing Keywords & Optimize Bullet Points',
    description:
      'Upload your PDF or Word resume and paste any target job posting. Instantly uncover high-value keyword gaps, benchmark your uninflated match score, and rewrite weak bullets into high-impact STAR accomplishments.',
    benefits: [
      'Semantic keyword match against live job descriptions',
      'Automated STAR bullet point rewrite generator',
      'Direct interview simulation generation from your CV',
    ],
    ctaText: 'Scan Your Resume',
    ctaLink: '/ats',
    themeColor: '#A0006D',
    badgeLabel: 'ATS Match Engine',
    personaName: 'ATS Match Engine',
    personaRole: 'Semantic Keyword Parser',
    personaIcon: <FileText className="w-3.5 h-3.5 text-white" />,
  },
  {
    id: 'career-roadmaps',
    step: '04 • Career Pathways',
    title: 'Follow Step-by-Step Career Blueprints for In-Demand Roles',
    subtitle: 'Milestone Progress Tracking & Peer Communities',
    description:
      'Structured technical roadmaps for Full Stack Engineers, AI Specialists, and DevOps Architects. Track every milestone step-by-step, benchmark skill mastery, and join candidate role discussion forums.',
    benefits: [
      'Comprehensive roadmaps: Full Stack, AI & DevOps',
      'Interactive milestone progress tracker and checklists',
      'Open group candidate discussion forums for each role',
    ],
    ctaText: 'Explore Career Roadmaps',
    ctaLink: '/roadmap',
    themeColor: '#047857',
    badgeLabel: 'Career Pathways',
    personaName: 'Career Pathways',
    personaRole: 'Milestone Benchmark Suite',
    personaIcon: <Compass className="w-3.5 h-3.5 text-white" />,
  },
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = FEATURES.length;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-rotation when not actively hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  const currentFeature = FEATURES[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 45) {
      prevSlide();
    } else if (diffX < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-4 sm:px-12 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Left Circular Arrow Navigation Button ─── */}
      <button
        onClick={prevSlide}
        aria-label="Previous Feature"
        className="absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#A0006D] to-[#4A8BDF] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/40"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* ─── Right Circular Arrow Navigation Button ─── */}
      <button
        onClick={nextSlide}
        aria-label="Next Feature"
        className="absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#4A8BDF] to-[#A0006D] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/40"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* ─── Compact Information Card (No Images) ─── */}
      <div className="w-full bg-white rounded-3xl border border-[#DCE7F2] p-6 sm:p-8 lg:p-9 shadow-lg overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentFeature.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-4 text-left"
          >
            {/* Top Bar: Step & Domain Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] text-xs font-mono font-bold uppercase border border-[#DCE7F2]">
                {currentFeature.step}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#526078] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                {currentFeature.badgeLabel}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-tight leading-snug font-display">
                {currentFeature.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#4A8BDF]">
                {currentFeature.subtitle}
              </p>
            </div>

            {/* Concise Description */}
            <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed font-sans">
              {currentFeature.description}
            </p>

            {/* 3 Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {currentFeature.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs font-semibold text-[#0F172A] bg-[#FAFDFE] p-2.5 rounded-xl border border-[#DCE7F2]/60"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-snug">{b}</span>
                </div>
              ))}
            </div>

            {/* Bottom Actions: Persona Pill + CTA */}
            <div className="pt-2 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#0F172A]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center shrink-0 shadow-xs">
                  {currentFeature.personaIcon}
                </div>
                <div>
                  <span className="font-bold text-xs text-[#0F172A]">{currentFeature.personaName}</span>
                  <span className="text-[10px] text-[#526078] font-mono ml-2">({currentFeature.personaRole})</span>
                </div>
              </div>

              <Link to={currentFeature.ctaLink}>
                <button className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer active:scale-98">
                  <span>{currentFeature.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom Indicator Dots ─── */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {FEATURES.map((feat, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={feat.id}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 h-2.5 bg-[#11183D]'
                  : 'w-2.5 h-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
