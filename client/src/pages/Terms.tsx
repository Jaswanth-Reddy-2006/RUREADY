import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Shield, Sparkles, Scale, Clock } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] pt-28 pb-20 font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <Helmet>
        <title>Terms & Conditions — R U Ready? AI Interview Platform</title>
        <meta
          name="description"
          content="Review the terms and conditions, session usage policies, and service agreements governing the R U Ready? AI career platform."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF] text-xs font-semibold shadow-xs">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#11183D] tracking-tight">
            Terms of Service & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-mono">
            Last Updated: September 2026 • Version 2.4
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DCE7F2] shadow-md space-y-8 text-sm text-[#334155] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using R U Ready? ("the Platform", "we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not register, access, or use any of our AI-driven interview rooms, ATS analyzers, or roadmap services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              2. Description of Services & AI Calibration
            </h2>
            <p>
              R U Ready? provides candidate evaluation tools, including multi-agent conversational oral interviews, browser-based coding sandbox execution, resume-to-job-description keyword alignment (ATS scoring), and personalized learning roadmaps.
            </p>
            <p>
              Our rubrics simulate standard tech industry hiring benchmarks (e.g., STAR framework, time/space algorithmic complexity). Feedback, scores, and readiness percentages are advisory educational benchmarks designed to aid preparation and do not constitute an explicit employment guarantee.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              3. User Accounts & Session Bundles
            </h2>
            <p>
              You are responsible for safeguarding your login credentials and for all activities that occur under your account. Session passes (Single Pass, Pro Bundle, Elite Pass) grant credits for live AI interview execution and ATS scans as specified in our pricing details.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#475569]">
              <li>Credits are non-transferable between separate user accounts.</li>
              <li>Promotional trial credits must be utilized within the designated promo window.</li>
              <li>Purchased session bundles never expire and remain in your active balance until consumed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              4. Code Execution & Acceptable Use
            </h2>
            <p>
              When utilizing our live in-browser coding runner, you agree not to submit malicious payloads, infinite memory exhaustion routines, reverse engineering scripts, or automated scraping bots targeting our evaluation servers. Violation will result in immediate session termination without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              5. Intellectual Property & Candidate Data
            </h2>
            <p>
              Candidates retain full ownership of resumes, custom code submissions, and spoken responses uploaded to the platform. R U Ready? retains ownership of proprietary persona evaluation models, rubric engines, user interface design, and scoring heuristics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A8BDF]" />
              6. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, R U Ready? shall not be liable for any indirect, incidental, or consequential damages resulting from interview outcomes or third-party hiring decisions.
            </p>
          </section>

          <div className="pt-6 border-t border-[#DCE7F2] text-xs text-[#7B8799] flex items-center justify-between">
            <span>Questions regarding terms? Contact legal@ruready.app</span>
            <span className="font-mono">R U READY TECH INC.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
