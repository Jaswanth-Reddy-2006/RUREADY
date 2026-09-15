import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, EyeOff, Sparkles } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] pt-28 pb-20 font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <Helmet>
        <title>Privacy Policy — R U Ready? Data Protection & Confidentiality</title>
        <meta
          name="description"
          content="Learn how R U Ready? protects your resume data, audio interview streams, code submissions, and personal information with enterprise-grade encryption."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#168A62] text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Candidate Data Security</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#11183D] tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] font-mono">
            Effective Date: September 2026 • Encrypted & Zero Data Selling
          </p>
        </div>

        {/* Security Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCE7F2] shadow-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center mx-auto border border-[#DCE7F2]">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#11183D]">AES-256 Encryption</p>
            <p className="text-[11px] text-[#475569]">All resumes and session transcripts encrypted at rest and in transit.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE7F2] shadow-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] text-[#168A62] flex items-center justify-center mx-auto border border-[#DCE7F2]">
              <EyeOff className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#11183D]">Zero Public Sharing</p>
            <p className="text-[11px] text-[#475569]">Your interview attempts and scores are strictly private to your account.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE7F2] shadow-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center mx-auto border border-[#DCE7F2]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#11183D]">No Data Selling</p>
            <p className="text-[11px] text-[#475569]">We never monetize, broker, or sell candidate profiles to recruiters without consent.</p>
          </div>
        </div>

        {/* Main Privacy Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DCE7F2] shadow-md space-y-8 text-sm text-[#334155] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#168A62]" />
              1. Information We Collect
            </h2>
            <p>
              When you create an account, complete mock interviews, or scan resumes, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#475569]">
              <li><strong>Account Identifiers:</strong> Name, email address, and authentication credentials.</li>
              <li><strong>Resume Content:</strong> PDF/DOCX files uploaded for keyword alignment and STAR bullet generation.</li>
              <li><strong>Interview Streams:</strong> Audio telemetry (pacing metrics, speech timestamps) and code editor keystrokes for evaluation.</li>
              <li><strong>Performance Telemetry:</strong> Rubric evaluation scores, time breakdowns, and improvement recommendations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#168A62]" />
              2. How We Process Audio & Video Telemetry
            </h2>
            <p>
              Real-time oral mock interviews analyze audio features strictly to compute words-per-minute pacing, filler word counts, and response latency. Video/camera streams used for eye gaze verification are processed locally in your browser when supported and are not saved permanently on external video servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#168A62]" />
              3. AI Model Evaluation & Isolation
            </h2>
            <p>
              Resume texts and spoken transcripts sent to our calibrated Socratic models are handled through private, enterprise API endpoints with zero-retention policies. Your private mock interview answers are not used to train public foundation models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#11183D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#168A62]" />
              4. Data Retention & Deletion Rights
            </h2>
            <p>
              You maintain full control over your stored history. You may delete individual interview sessions, remove uploaded resumes, or request complete account erasure at any time from your account Settings page or by emailing <span className="text-[#4A8BDF] font-mono">privacy@ruready.app</span>.
            </p>
          </section>

          <div className="pt-6 border-t border-[#DCE7F2] text-xs text-[#7B8799] flex items-center justify-between">
            <span>Direct Privacy Inquiries: privacy@ruready.app</span>
            <span className="font-mono">R U READY TECH INC.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
