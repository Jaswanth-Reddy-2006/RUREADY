import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] pt-28 pb-20 font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <Helmet>
        <title>About Us — R U Ready? AI Career Intelligence</title>
        <meta
          name="description"
          content="Learn about R U Ready? — the AI-powered interview benchmarking, ATS resume alignment, and career roadmap platform calibrated against Tier-1 tech hiring bars."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF] text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#11183D] tracking-tight leading-tight"
          >
            Empowering Candidates with{' '}
            <span className="text-[#4A8BDF]">Uninflated, Real-World</span> Readiness
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] leading-relaxed"
          >
            Most AI tools sugarcoat feedback. R U Ready? was engineered to give candidates the rigorous, calibrated benchmark needed to clear Tier-1 engineering, product, and data hiring bars.
          </motion.p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 border border-[#DCE7F2] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2]">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#11183D]">Socratic AI Personas</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                We simulate real interview loops with dynamic personas — from high-level Hiring Managers probing leadership to adversarial Bar Raisers testing distributed edge-case limits.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#DCE7F2] text-xs font-semibold text-[#4A8BDF] flex items-center gap-1">
              Adaptive Challenge Loops <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 border border-[#DCE7F2] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center border border-[#F4B4D6]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#11183D]">Calibrated ATS & STAR Scoring</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Zero generic praise. Answers and resumes are scored against strict rubrics: Situation specificity, Task ownership, Action measurability, and quantified Results.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#DCE7F2] text-xs font-semibold text-[#A0006D] flex items-center gap-1">
              Objective Rubrics <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 border border-[#DCE7F2] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5F0] text-[#168A62] flex items-center justify-center border border-[#A7E3CF]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#11183D]">Personalized Growth Paths</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Beyond point-in-time assessments, we build interactive tech stack roadmaps and peer discussion communities to help you close every skill gap.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#DCE7F2] text-xs font-semibold text-[#168A62] flex items-center gap-1">
              Full Spectrum Prep <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-mono font-bold text-[#4A8BDF] uppercase tracking-wider">
                Why We Built R U Ready?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#11183D] tracking-tight">
                Closing the Gap Between Practice and Real Hiring Rooms
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                Thousands of engineers study LeetCode and practice memorized behavioral answers, only to freeze when a Principal Architect asks "Why didn’t you use a write-through cache instead?" or when ATS bots silently reject their resume.
              </p>
              <p className="text-sm text-[#475569] leading-relaxed">
                We engineered R U Ready? to bridge this reality gap. With sub-300ms live audio telemetry, Monaco coding execution, and strict STAR alignment scoring, candidates build authentic, resilient confidence.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  'Trained on Tier-1 technical hiring matrices',
                  'Instant feedback on speech pacing, gaze, and filler words',
                  'Comprehensive ATS resume alignment with automated rewrites',
                  'End-to-end multi-modal coding and oral evaluation',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#168A62] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EFFAFD] rounded-2xl border border-[#DCE7F2] p-6 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs">
                <p className="text-xs font-mono text-[#7B8799] uppercase font-bold">Platform Calibrations</p>
                <p className="text-3xl font-extrabold text-[#11183D] mt-1">250,000+</p>
                <p className="text-xs text-[#475569] mt-0.5">Mock interview sessions evaluated across 40+ countries</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs">
                  <p className="text-[11px] font-mono text-[#7B8799] uppercase font-bold">ATS Match Rate</p>
                  <p className="text-2xl font-bold text-[#168A62] mt-1">94.2%</p>
                  <p className="text-[11px] text-[#475569]">First-round interview conversion</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#DCE7F2] shadow-xs">
                  <p className="text-[11px] font-mono text-[#7B8799] uppercase font-bold">Latency Benchmark</p>
                  <p className="text-2xl font-bold text-[#4A8BDF] mt-1">&lt;280ms</p>
                  <p className="text-[11px] text-[#475569]">Real-time conversational response</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#11183D] rounded-3xl p-10 sm:p-14 text-white space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to test your real-world readiness?</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience the standard before walking into the actual interview room.
          </p>
          <Link to="/register">
            <button className="inline-flex items-center gap-2 bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-md transition-all cursor-pointer">
              <span>Start Free Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
