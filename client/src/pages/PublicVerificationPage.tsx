import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Calendar,
  Layers,
  Code2,
  FileCheck2,
  TrendingUp,
  Building2,
  Sparkles,
  ExternalLink,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  XCircle,
  FolderGit2,
  Info,
} from 'lucide-react';
import { roadmapApi } from '../api/roadmap';
import { PublicVerifiedProfileDTO } from '@ru-ready/shared';
import Button from '../components/ui/Button';

type RecruiterTab = 'SPRINTS' | 'EVIDENCE' | 'ASSESSMENTS' | 'TIMELINE' | 'SKILLS';

export default function PublicVerificationPage() {
  const { verificationId } = useParams<{ verificationId: string }>();
  const [profile, setProfile] = useState<PublicVerifiedProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<RecruiterTab>('SPRINTS');
  const [expandedSprints, setExpandedSprints] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!verificationId) {
      setError('No verification identifier provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    roadmapApi
      .verifyPublicProfile(verificationId)
      .then((data) => {
        if (data && data.isValid) {
          setProfile(data);
          setError(null);
        } else {
          setProfile(null);
          setError('Verification could not be confirmed.');
        }
      })
      .catch(() => {
        setProfile(null);
        setError('Verification could not be confirmed.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [verificationId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const toggleSprintExpand = (sprintNumber: number) => {
    setExpandedSprints((prev) => ({
      ...prev,
      [sprintNumber]: !prev[sprintNumber],
    }));
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Safe external link renderer
  const renderExternalLink = (url?: string | null) => {
    if (!url || typeof url !== 'string') return null;
    const isSafe = /^https?:\/\//i.test(url.trim());
    if (!isSafe) {
      return <span className="text-xs font-mono text-[#526078] break-all">{url}</span>;
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2459A8] hover:text-[#4A8BDF] hover:underline break-all"
      >
        <span>{url.length > 40 ? `${url.slice(0, 37)}...` : url}</span>
        <ExternalLink size={12} className="shrink-0" />
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#11183D] font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] py-10 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>
          {profile?.candidateName
            ? `Verified Career Proof — ${profile.candidateName} | R U READY?`
            : 'Verified Career Profile | R U READY?'}
        </title>
        <meta
          name="description"
          content="Server-authoritative verified career readiness profile with roadmap proof of work, sprint history, and evidence portfolio."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Branding Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight font-display text-[#11183D] hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] text-white flex items-center justify-center font-black text-sm shadow-xs">
              RU
            </div>
            <span>R U READY?</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              icon={copied ? <Check size={14} className="text-[#168A62]" /> : <Copy size={14} />}
              className="bg-white shadow-2xs text-xs font-display"
            >
              {copied ? 'Link Copied!' : 'Copy Verification Link'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              icon={<Printer size={14} />}
              className="bg-white shadow-2xs text-xs font-display hidden sm:inline-flex"
            >
              Print / PDF
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[#DCE7F2] p-12 text-center shadow-sm space-y-4" data-testid="verification-loading">
            <div className="w-12 h-12 border-4 border-[#4A8BDF]/30 border-t-[#4A8BDF] rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#11183D]">Verifying Credential</h3>
              <p className="text-xs text-[#526078]">
                Validating cryptographic signature against server-verified records...
              </p>
            </div>
          </div>
        )}

        {/* Invalid / Unconfirmed State */}
        {!loading && (error || !profile || !profile.isValid) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#E11D48]/30 p-8 sm:p-12 text-center shadow-sm space-y-6"
            data-testid="verification-invalid"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#FFF1F2] border border-[#E11D48]/20 text-[#E11D48] flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase font-mono tracking-wider bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30">
                Verification Unconfirmed
              </span>
              <h2 className="text-2xl font-black font-display text-[#11183D]">
                Credential Could Not Be Confirmed
              </h2>
              <p className="text-xs sm:text-sm text-[#526078] leading-relaxed">
                The verification identifier <strong className="font-mono text-[#11183D]">{verificationId}</strong> could not be authenticated against persisted server records.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#526078] max-w-md mx-auto text-left space-y-1.5">
              <span className="font-bold text-[#11183D] block">Possible Reasons:</span>
              <ul className="list-disc list-inside space-y-1">
                <li>The verification token has been tampered with or modified.</li>
                <li>The associated roadmap record has been deleted or archived.</li>
                <li>The URL was entered incorrectly.</li>
              </ul>
            </div>

            <div>
              <Link to="/">
                <Button variant="royal" size="sm">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Verified Profile Card */}
        {!loading && profile && profile.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#DCE7F2] shadow-sm overflow-hidden divide-y divide-[#DCE7F2]"
            data-testid="verified-profile-card"
          >
            {/* Header / Verified Status Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#EFFAFD] to-white space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5F0] border border-[#168A62]/30 text-[#168A62] text-xs font-bold font-display shadow-2xs">
                  <ShieldCheck size={16} />
                  <span>OFFICIALLY VERIFIED CREDENTIAL</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#526078] font-mono">
                  <Calendar size={13} className="text-[#7B8799]" />
                  <span>Issued on {formatDate(profile.issuedAt)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-[#11183D] tracking-tight">
                    {profile.candidateName || 'Verified Candidate'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#526078]">
                    <span className="font-semibold text-[#2459A8] bg-[#EFFAFD] px-2.5 py-1 rounded-lg border border-[#DCE7F2]">
                      {profile.targetRole}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 size={13} className="text-[#7B8799]" />
                      Calibrated to <strong>{profile.targetCompanyTier}</strong> Standards
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-center min-w-[140px] shadow-2xs">
                  <span className="block text-[10px] font-bold text-[#526078] uppercase tracking-wider">
                    Verified Readiness
                  </span>
                  <strong className="text-3xl font-black font-display text-[#2459A8]">
                    {profile.overallReadiness}%
                  </strong>
                </div>
              </div>

              {/* Verification Semantics Legend */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCE7F2] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-[#2459A8] shrink-0" />
                  <span className="font-semibold text-[#11183D]">Evidence Verification Key:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168A62]">
                    <ShieldCheck size={13} />
                    Platform Verified (Graded by System)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2459A8]">
                    <FileCheck2 size={13} />
                    Learner Provided (Submitted Repository/Evidence)
                  </span>
                </div>
              </div>
            </div>

            {/* Core Verification Telemetry Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                Verified Competency & Execution Summary
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center" data-testid="verified-summary-metrics">
                <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2]">
                  <span className="block text-[10px] font-bold text-[#526078] uppercase">Mastered Skills</span>
                  <strong className="text-xl font-bold font-display text-[#2459A8]">
                    {profile.masteredSkills.length}
                  </strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#E8F5F0]/60 border border-[#168A62]/20">
                  <span className="block text-[10px] font-bold text-[#168A62] uppercase">Demonstrated</span>
                  <strong className="text-xl font-bold font-display text-[#168A62]">
                    {profile.demonstratedSkills.length}
                  </strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8EAF4]/60 border border-[#A0006D]/20">
                  <span className="block text-[10px] font-bold text-[#A0006D] uppercase">Verified Evidence</span>
                  <strong className="text-xl font-bold font-display text-[#A0006D]">
                    {profile.verifiedEvidenceCount}
                  </strong>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2]">
                  <span className="block text-[10px] font-bold text-[#526078] uppercase">Sprints Completed</span>
                  <strong className="text-xl font-bold font-display text-[#11183D]">
                    {profile.completedSprintCount}
                  </strong>
                </div>
              </div>

              {/* Recruiter Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-[#DCE7F2] pb-2 pt-2" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'SPRINTS'}
                  onClick={() => setActiveTab('SPRINTS')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                    activeTab === 'SPRINTS'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
                  }`}
                >
                  Sprint History ({profile.sprintArchives?.length || profile.completedSprintCount})
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'EVIDENCE'}
                  onClick={() => setActiveTab('EVIDENCE')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                    activeTab === 'EVIDENCE'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
                  }`}
                >
                  Evidence & Projects ({profile.evidence?.length || profile.verifiedEvidenceCount})
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'ASSESSMENTS'}
                  onClick={() => setActiveTab('ASSESSMENTS')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                    activeTab === 'ASSESSMENTS'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
                  }`}
                >
                  Assessments ({profile.assessments?.length || profile.assessmentSummary.totalAttempts})
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'TIMELINE'}
                  onClick={() => setActiveTab('TIMELINE')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                    activeTab === 'TIMELINE'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
                  }`}
                >
                  Milestone Timeline ({profile.timeline?.length || 0})
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'SKILLS'}
                  onClick={() => setActiveTab('SKILLS')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                    activeTab === 'SKILLS'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-white text-[#526078] hover:bg-[#EFFAFD] hover:text-[#2459A8] border border-[#DCE7F2]'
                  }`}
                >
                  Skills Matrix ({profile.masteredSkills.length + profile.demonstratedSkills.length})
                </button>
              </div>

              {/* TAB 1: SPRINT HISTORY */}
              {activeTab === 'SPRINTS' && (
                <div className="space-y-3" data-testid="recruiter-sprints-section">
                  {(!profile.sprintArchives || profile.sprintArchives.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-[#DCE7F2] text-center space-y-1">
                      <span className="text-xs font-bold text-[#11183D] block">No Completed Sprints Recorded</span>
                      <p className="text-xs text-[#526078]">Candidate has not yet completed and archived roadmap sprints.</p>
                    </div>
                  ) : (
                    profile.sprintArchives.map((sprint) => {
                      const isExpanded = Boolean(expandedSprints[sprint.sprintNumber]);
                      return (
                        <div
                          key={sprint.sprintNumber}
                          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30">
                                  Sprint 0{sprint.sprintNumber}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  sprint.status === 'COMPLETED'
                                    ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                                    : 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30'
                                }`}>
                                  <ShieldCheck size={12} />
                                  {sprint.status === 'COMPLETED' ? 'Platform Verified' : 'In Progress'}
                                </span>
                                {sprint.decision && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                                    Decision: {sprint.decision}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold font-display text-[#11183D]">
                                {sprint.objective}
                              </h3>
                            </div>

                            <button
                              onClick={() => toggleSprintExpand(sprint.sprintNumber)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#2459A8] bg-[#EFFAFD] border border-[#4A8BDF]/30 hover:bg-[#DCE7F2]"
                            >
                              <span>{isExpanded ? 'Hide Skills' : 'View Skills'}</span>
                              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                            <div className="p-2 bg-slate-50 rounded-xl border border-[#DCE7F2]">
                              <span className="block text-[10px] text-[#7B8799] uppercase">Tasks Progress</span>
                              <strong className="font-mono text-[#11183D]">
                                {sprint.completedTasks} / {sprint.totalTasks} ({sprint.completionPercentage}%)
                              </strong>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl border border-[#DCE7F2]">
                              <span className="block text-[10px] text-[#7B8799] uppercase">Completion Date</span>
                              <span className="font-mono text-[#526078] text-[11px]">
                                {formatDate(sprint.completedAt)}
                              </span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl border border-[#DCE7F2] col-span-2 sm:col-span-1">
                              <span className="block text-[10px] text-[#7B8799] uppercase">Verification Status</span>
                              <span className="font-semibold text-[#168A62] text-[11px] flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Server-Authenticated
                              </span>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && sprint.skillsAddressed && sprint.skillsAddressed.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-2 border-t border-[#DCE7F2] space-y-1.5"
                              >
                                <span className="text-[10px] font-bold text-[#7B8799] uppercase block">
                                  Skills Addressed in Sprint:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {sprint.skillsAddressed.map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-[#EFFAFD] text-[#2459A8] text-[11px] rounded-md font-semibold border border-[#4A8BDF]/20"
                                    >
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: EVIDENCE & PROJECTS */}
              {activeTab === 'EVIDENCE' && (
                <div className="space-y-3" data-testid="recruiter-evidence-section">
                  {(!profile.evidence || profile.evidence.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-[#DCE7F2] text-center space-y-1">
                      <span className="text-xs font-bold text-[#11183D] block">No Evidence Records Available</span>
                      <p className="text-xs text-[#526078]">Verified project proof and skill submissions will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.evidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                ev.verificationSource === 'PLATFORM_VERIFIED'
                                  ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                                  : 'bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30'
                              }`}>
                                <ShieldCheck size={11} />
                                {ev.verificationSource === 'PLATFORM_VERIFIED' ? 'Platform Verified' : 'Learner Provided'}
                              </span>
                              <span className="text-[10px] font-mono text-[#7B8799]">
                                {formatDate(ev.assessedAt)}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold font-display text-[#11183D]">
                              {ev.skillName || 'Skill Competency'}
                            </h4>

                            {ev.skillCategory && (
                              <span className="text-[11px] text-[#526078] block">
                                Category: {ev.skillCategory}
                              </span>
                            )}

                            {ev.externalReference && (
                              <div className="pt-1">
                                <span className="text-[10px] font-bold text-[#7B8799] uppercase block mb-0.5">
                                  Submitted Deliverable:
                                </span>
                                {renderExternalLink(ev.externalReference)}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-[#DCE7F2] flex items-center justify-between text-xs">
                            <span className="text-[#7B8799]">Score / Proficiency:</span>
                            <span className="font-bold font-mono text-[#168A62]">
                              {typeof ev.demonstratedScore === 'number' ? `${ev.demonstratedScore}%` : 'Verified'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ASSESSMENTS */}
              {activeTab === 'ASSESSMENTS' && (
                <div className="space-y-3" data-testid="recruiter-assessments-section">
                  {(!profile.assessments || profile.assessments.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-[#DCE7F2] text-center space-y-1">
                      <span className="text-xs font-bold text-[#11183D] block">No Micro-Assessment Records</span>
                      <p className="text-xs text-[#526078]">Graded micro-assessments will appear here with passing status.</p>
                    </div>
                  ) : (
                    profile.assessments.map((att) => (
                      <div
                        key={att.id}
                        className="p-4 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xs flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              att.passed
                                ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {att.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                              {att.passed ? 'Platform Verified (Passed ≥70%)' : 'Attempt (<70%)'}
                            </span>
                            {att.skillName && (
                              <span className="text-xs font-semibold text-[#526078]">
                                • {att.skillName}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold font-display text-[#11183D]">
                            {att.title}
                          </h4>
                          <span className="text-xs text-[#526078]">
                            {att.correctAnswers} of {att.totalQuestions} questions correct
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xl font-extrabold font-mono text-[#11183D]">
                            {att.score}%
                          </div>
                          <span className="text-[11px] font-mono text-[#7B8799]">
                            {formatDate(att.completedAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: MILESTONE TIMELINE */}
              {activeTab === 'TIMELINE' && (
                <div className="space-y-3" data-testid="recruiter-timeline-section">
                  {(!profile.timeline || profile.timeline.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-[#DCE7F2] text-center space-y-1">
                      <span className="text-xs font-bold text-[#11183D] block">No Timeline Milestones</span>
                      <p className="text-xs text-[#526078]">Chronological milestones will appear here as the candidate advances.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {profile.timeline.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-[#EFFAFD] border border-[#4A8BDF]/30 flex items-center justify-center text-[#2459A8] shrink-0">
                              <CheckCircle2 size={14} className="text-[#168A62]" />
                            </div>
                            <div>
                              <span className="text-xs font-bold font-display text-[#11183D] block">
                                {item.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-[#526078]">
                                <span className={`font-semibold ${
                                  item.verificationSource === 'PLATFORM_VERIFIED' ? 'text-[#168A62]' : 'text-[#2459A8]'
                                }`}>
                                  {item.verificationSource === 'PLATFORM_VERIFIED' ? 'Platform Verified' : 'Learner Submitted'}
                                </span>
                                {item.skillName && <span>• {item.skillName}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {typeof item.score === 'number' && (
                              <span className="text-xs font-bold font-mono text-[#168A62] block">
                                {item.score}%
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-[#7B8799]">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SKILLS MATRIX */}
              {activeTab === 'SKILLS' && (
                <div className="space-y-4" data-testid="recruiter-skills-section">
                  {profile.masteredSkills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        Mastered Competencies ({profile.masteredSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.masteredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EFFAFD] text-[#2459A8] border border-[#4A8BDF]/30"
                          >
                            <CheckCircle2 size={13} className="text-[#4A8BDF]" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.demonstratedSkills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                        Demonstrated Competencies ({profile.demonstratedSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.demonstratedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30"
                          >
                            <Check size={13} className="text-[#168A62]" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recruiter Trust & Verification Footer */}
            <div className="p-6 bg-[#EFFAFD]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#526078]">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-[#7B8799] uppercase">Cryptographic Verification Token</span>
                <code className="px-2.5 py-1 bg-white rounded-md border border-[#DCE7F2] font-mono text-[#11183D] font-bold">
                  {profile.verificationId}
                </code>
              </div>

              <div className="text-left sm:text-right text-[11px] text-[#7B8799]">
                <span>Verified by R U READY? Authoritative Engine</span>
                <span className="block text-[10px]">Zero client-reported scores • Tamper-evident</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
