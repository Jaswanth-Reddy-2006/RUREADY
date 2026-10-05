import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Award,
  ExternalLink,
  Code2,
  FolderGit2,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface RoadmapProfileSummaryCardProps {
  userRoadmapId?: string;
  isOwnProfile?: boolean;
}

export default function RoadmapProfileSummaryCard({
  userRoadmapId,
  isOwnProfile = true,
}: RoadmapProfileSummaryCardProps) {
  const navigate = useNavigate();
  const {
    profileSummary,
    isProfileSummaryLoading,
    profileSummaryError,
    fetchProfileSummary,
    activeUserRoadmap,
    userRoadmaps,
  } = useRoadmapStore();

  const resolvedRoadmapId =
    userRoadmapId ||
    activeUserRoadmap?.id ||
    Object.values(userRoadmaps)[0]?.id;

  useEffect(() => {
    fetchProfileSummary(resolvedRoadmapId);
  }, [resolvedRoadmapId, fetchProfileSummary]);

  const handleNavigateToHistory = () => {
    if (profileSummary?.roadmapId || profileSummary?.userRoadmapId) {
      navigate(`/roadmap/${profileSummary.roadmapId || profileSummary.userRoadmapId}`);
    } else {
      navigate('/roadmap');
    }
  };

  const handleNavigateToVerification = () => {
    if (profileSummary?.verificationId) {
      navigate(`/verify/${profileSummary.verificationId}`);
    }
  };

  if (isProfileSummaryLoading && !profileSummary) {
    return (
      <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="h-10 w-10 bg-slate-200 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-24 bg-slate-50 rounded-2xl border border-[#DCE7F2] animate-pulse" />
      </Card>
    );
  }

  if (profileSummaryError && !profileSummary) {
    return (
      <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-3 text-center">
        <AlertCircle size={28} className="text-amber-500 mx-auto" />
        <p className="text-xs font-bold text-[#11183D]">Unable to load verified roadmap profile</p>
        <p className="text-xs text-[#526078]">{profileSummaryError}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchProfileSummary(resolvedRoadmapId)}
          icon={<RefreshCw size={13} />}
          className="mx-auto"
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (!profileSummary || (profileSummary.completedSprintCount === 0 && profileSummary.verifiedSkillCount === 0 && profileSummary.selectedProof.length === 0)) {
    return (
      <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <Compass size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-[#11183D]">
                Verified Career Roadmap & Proof of Work
              </h3>
              <p className="text-xs text-[#526078]">
                Deterministic milestone verification, assessment benchmarks, and practical proof.
              </p>
            </div>
          </div>
          {isOwnProfile && (
            <Button
              variant="royal"
              size="sm"
              onClick={() => navigate('/roadmap')}
              icon={<ArrowRight size={13} />}
            >
              Start Career Roadmap
            </Button>
          )}
        </div>

        <div className="p-8 text-center bg-[#EFFAFD]/50 rounded-2xl border border-[#DCE7F2] space-y-3">
          <ShieldCheck size={36} className="text-[#4A8BDF] mx-auto opacity-70" />
          <h4 className="text-sm font-bold text-[#11183D]">No Verified Roadmap Evidence Yet</h4>
          <p className="text-xs text-[#526078] max-w-md mx-auto">
            {isOwnProfile
              ? 'Complete roadmap sprint milestones, solve sandbox coding drills, or pass micro-assessments to generate cryptographic proof of work on your profile.'
              : 'This candidate has not recorded verified roadmap milestones or assessment evidence yet.'}
          </p>
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/roadmap')}
              className="bg-white"
            >
              Explore Roadmaps
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const completionPct =
    profileSummary.totalSprintCount > 0
      ? Math.round((profileSummary.completedSprintCount / profileSummary.totalSprintCount) * 100)
      : 0;

  return (
    <Card className="p-6 sm:p-7 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm space-y-6">
      {/* 1. Header Banner & Verification Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <Compass size={20} />
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-[#11183D]">
              Verified Career Roadmap & Proof of Work
            </h3>
            <Badge variant="success" size="xs" className="flex items-center gap-1">
              <ShieldCheck size={12} />
              Platform Verified
            </Badge>
          </div>
          <p className="text-xs text-[#526078] flex flex-wrap items-center gap-2">
            <span>Targeting <strong>{profileSummary.targetRole}</strong> at <strong>{profileSummary.targetCompanyTier}</strong></span>
            {profileSummary.verificationId && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleNavigateToVerification}
                  className="font-mono text-[11px] font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Inspect public recruiter verification record"
                >
                  <span>{profileSummary.verificationId}</span>
                  <ExternalLink size={10} />
                </button>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNavigateToVerification}
            icon={<ShieldCheck size={13} className="text-[#168A62]" />}
            className="bg-white text-xs"
          >
            Recruiter View
          </Button>
          <Button
            variant="royal"
            size="sm"
            onClick={handleNavigateToHistory}
            icon={<ArrowRight size={13} />}
            className="text-xs"
          >
            Detailed Learning History
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Overall Readiness Gauge */}
        <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Readiness Score
            </span>
            <TrendingUp size={14} className="text-[#2459A8]" />
          </div>
          <div className="text-xl font-black font-display text-[#11183D]">
            {profileSummary.overallReadiness}%
          </div>
          <div className="w-full bg-[#DCE7F2] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2459A8] to-[#4A8BDF] h-full rounded-full transition-all duration-500"
              style={{ width: `${profileSummary.overallReadiness}%` }}
            />
          </div>
        </div>

        {/* Sprints Completed */}
        <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Sprint Progress
            </span>
            <Layers size={14} className="text-[#A0006D]" />
          </div>
          <div className="text-xl font-black font-display text-[#11183D]">
            {profileSummary.completedSprintCount} <span className="text-xs font-semibold text-[#526078]">/ {profileSummary.totalSprintCount}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#A0006D] block">
            {completionPct}% Curriculums Completed
          </span>
        </div>

        {/* Verified Skills */}
        <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Verified Skills
            </span>
            <CheckCircle2 size={14} className="text-[#168A62]" />
          </div>
          <div className="text-xl font-black font-display text-[#168A62]">
            {profileSummary.verifiedSkillCount}
          </div>
          <span className="text-[11px] text-[#526078] block">
            Backed by evaluated code & tests
          </span>
        </div>

        {/* Assessment Benchmark */}
        <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] font-mono">
              Assessments Passed
            </span>
            <Award size={14} className="text-[#E06810]" />
          </div>
          <div className="text-xl font-black font-display text-[#11183D]">
            {profileSummary.passedAssessmentCount} <span className="text-xs font-semibold text-[#526078]">/ {profileSummary.assessmentCount}</span>
          </div>
          <span className="text-[11px] text-[#526078] block">
            {profileSummary.assessmentSummary.averageScore !== null
              ? `Avg ${profileSummary.assessmentSummary.averageScore}% score`
              : 'Benchmark active'}
          </span>
        </div>
      </div>

      {/* 3. Verified Skill Highlights */}
      {profileSummary.verifiedSkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
              <Sparkles size={14} className="text-[#2459A8]" />
              <span>Verified Skill Highlights</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EFFAFD] text-[#2459A8] font-mono">
                {profileSummary.verifiedSkills.length} competencies
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profileSummary.verifiedSkills.slice(0, 6).map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 rounded-2xl bg-white border border-[#DCE7F2] hover:border-[#4A8BDF]/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#11183D] font-display truncate">
                    {skill.name}
                  </span>
                  {skill.score !== null && skill.score !== undefined && (
                    <span className="text-xs font-mono font-bold text-[#2459A8]">
                      {skill.score}%
                    </span>
                  )}
                </div>

                <div className="w-full bg-[#EFFAFD] h-1.5 rounded-full overflow-hidden border border-[#DCE7F2]/60">
                  <div
                    className="bg-gradient-to-r from-[#2459A8] to-[#168A62] h-full rounded-full transition-all"
                    style={{ width: `${skill.score ?? 70}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#526078] pt-1 border-t border-[#DCE7F2]/40 font-mono">
                  <span className="flex items-center gap-1 font-semibold text-[#168A62]">
                    <CheckCircle2 size={11} />
                    {skill.evidenceCount} {skill.evidenceCount === 1 ? 'Proof Item' : 'Proof Items'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    skill.status === 'MASTERED'
                      ? 'bg-[#E8F5F0] text-[#168A62]'
                      : 'bg-[#EFFAFD] text-[#2459A8]'
                  }`}>
                    {skill.status || 'DEMONSTRATED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Selected Proof of Work Cards */}
      {profileSummary.selectedProof.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
              <FileCheck2 size={14} className="text-[#168A62]" />
              <span>Selected Proof of Work</span>
              <span className="text-[10px] font-normal text-[#526078] lowercase">
                (latest verified milestones)
              </span>
            </h4>
            <button
              type="button"
              onClick={handleNavigateToHistory}
              className="text-xs font-bold text-[#2459A8] hover:underline flex items-center gap-1 cursor-pointer font-display"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {profileSummary.selectedProof.map((proof) => {
              const isPlatform = proof.verificationSource === 'PLATFORM_VERIFIED';
              return (
                <div
                  key={proof.id}
                  className="p-3.5 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#EFFAFD]/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      proof.type === 'PRACTICAL_DRILL'
                        ? 'bg-[#E8F5F0] text-[#168A62]'
                        : proof.type === 'ASSESSMENT'
                        ? 'bg-[#F8EAF4] text-[#A0006D]'
                        : proof.type === 'PROJECT'
                        ? 'bg-[#EFFAFD] text-[#2459A8]'
                        : 'bg-slate-100 text-[#526078]'
                    }`}>
                      {proof.type === 'PRACTICAL_DRILL' ? (
                        <Code2 size={16} />
                      ) : proof.type === 'ASSESSMENT' ? (
                        <Award size={16} />
                      ) : proof.type === 'PROJECT' ? (
                        <FolderGit2 size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#11183D] font-display">
                          {proof.title}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isPlatform
                            ? 'bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/20'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isPlatform ? 'Platform Verified' : 'Learner Provided'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#526078]">
                        {proof.skillName && <span>Skill: <strong>{proof.skillName}</strong> • </span>}
                        <span>{new Date(proof.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    {proof.score !== null && proof.score !== undefined && (
                      <span className="text-xs font-mono font-bold text-[#2459A8] px-2 py-0.5 rounded bg-white border border-[#DCE7F2]">
                        {proof.score}%
                      </span>
                    )}
                    {proof.externalUrl && (
                      <a
                        href={proof.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-[#DCE7F2] text-[#526078] hover:text-[#2459A8] transition-colors"
                        title="View External Project Artifact"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
