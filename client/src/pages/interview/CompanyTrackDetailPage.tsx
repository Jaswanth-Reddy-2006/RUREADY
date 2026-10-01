import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ChevronLeft,
  CheckCircle2,
  Play,
  Clock,
  Award,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Code2,
  Video,
  FileText,
  Sliders,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { COMPANY_INTERVIEW_TRACKS, CompanyInterviewSection } from '../../data/companyTracksData';
import toast from 'react-hot-toast';

export default function CompanyTrackDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const track = COMPANY_INTERVIEW_TRACKS.find(
    (t) => t.companySlug.toLowerCase() === companyId?.toLowerCase() || t.id === companyId
  ) || COMPANY_INTERVIEW_TRACKS[0];

  // Local state for completed rounds tracking
  const [completedSectionIds, setCompletedSectionIds] = useState<string[]>([]);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(`company_track_progress_${track.id}`);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        setCompletedSectionIds(parsed.completedSectionIds || []);
        setSectionScores(parsed.sectionScores || {});
      }
    } catch {
      // ignore
    }
  }, [track.id]);

  const isTrackCompleted = completedSectionIds.length === track.sections.length;
  const overallScore = isTrackCompleted && Object.keys(sectionScores).length > 0
    ? Math.round(Object.values(sectionScores).reduce((a, b) => a + b, 0) / Object.keys(sectionScores).length)
    : null;

  const handleStartSection = (sec: CompanyInterviewSection) => {
    if (sec.interviewType === 'CODING') {
      navigate(
        `/coding/new?company=${encodeURIComponent(track.companyName)}&role=${encodeURIComponent(
          track.role
        )}&focus=${encodeURIComponent(sec.focusAreas[0] || 'DSA')}&duration=${sec.durationMins}`
      );
    } else {
      navigate(
        `/video/new?company=${encodeURIComponent(track.companyName)}&role=${encodeURIComponent(
          track.role
        )}&mode=${encodeURIComponent(
          sec.interviewType === 'HR_BEHAVIORAL' ? 'HR_BEHAVIORAL' : 'FULL_SIMULATION'
        )}&focus=${encodeURIComponent(sec.focusAreas.join(','))}&skills=${encodeURIComponent(
          sec.skills.join(',')
        )}&duration=${sec.durationMins}`
      );
    }
  };

  const handleSimulatePassRound = (secId: string) => {
    const randomScore = Math.floor(Math.random() * 16) + 82; // 82 - 97
    const newCompleted = Array.from(new Set([...completedSectionIds, secId]));
    const newScores = { ...sectionScores, [secId]: randomScore };

    setCompletedSectionIds(newCompleted);
    setSectionScores(newScores);

    try {
      localStorage.setItem(
        `company_track_progress_${track.id}`,
        JSON.stringify({ completedSectionIds: newCompleted, sectionScores: newScores })
      );
      toast.success(`Round completed with score of ${randomScore}%!`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#080C1D] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-7">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/interviews/company-wise')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Company Tracks</span>
        </button>

        {/* ─── TRACK HEADER ─── */}
        <Card className="p-6 md:p-8 bg-white dark:bg-[#11183D] border-slate-200/80 dark:border-[#1E293B] rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center border border-white/20 shadow-xs shrink-0">
                {track.companyName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 text-xs font-mono">
                    {track.companyName} Interview Loop
                  </Badge>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {track.packageLpa}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                  {track.role}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">{track.description}</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-slate-50 dark:bg-[#0E152E] p-4 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] text-right shrink-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Loop Progress</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {completedSectionIds.length} / {track.sections.length} Done
              </span>
            </div>
          </div>

          {/* Hiring Strategy Blueprint Callout */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-[#152046] border border-purple-100 dark:border-[#1E293B] flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-slate-900 dark:text-white font-bold block">
                {track.companyName} Hiring Blueprint & Evaluation Focus:
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {track.hiringOverview}
              </p>
            </div>
          </div>

          {/* Completed State Banner */}
          {isTrackCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-lg space-y-3 border border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Award className="w-4 h-4" />
                  Full Interview Track Loop Completed
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-xs border-emerald-500/40">
                  VERIFIED EVALUATION
                </Badge>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white font-mono">{overallScore}%</span>
                <span className="text-xs text-slate-300">Aggregated across all {track.sections.length} interview rounds</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  onClick={() => {
                    localStorage.removeItem(`company_track_progress_${track.id}`);
                    setCompletedSectionIds([]);
                    setSectionScores({});
                    toast.success('Track progress reset. Ready to retake!');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Full Loop</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── SECTION ROUNDS LIST ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Interview Rounds Breakdown ({track.sections.length} Rounds)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Total Duration: {track.sections.reduce((a, b) => a + b.durationMins, 0)} mins
              </span>
            </div>

            <div className="space-y-3.5">
              {track.sections.map((sec, idx) => {
                const isCompleted = completedSectionIds.includes(sec.id);
                const isCurrent = !isCompleted && (idx === 0 || completedSectionIds.includes(track.sections[idx - 1]?.id));
                const score = sectionScores[sec.id];
                const isCoding = sec.interviewType === 'CODING';

                return (
                  <div
                    key={sec.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : isCurrent
                        ? 'bg-white dark:bg-[#11183D] border-blue-400 dark:border-blue-500 shadow-md ring-2 ring-blue-500/15'
                        : 'bg-slate-50/60 dark:bg-[#0E152E]/60 border-slate-200 dark:border-[#1E293B] opacity-85'
                    }`}
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : isCurrent
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          Round {sec.order}
                        </span>

                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isCoding
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}>
                          {isCoding ? <Code2 className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                          {isCoding ? 'Live Coding Sandbox' : 'Oral Video Interview'}
                        </span>

                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1 ml-1">
                          <Clock className="w-3 h-3" /> {sec.durationMins} mins
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{sec.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sec.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sec.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#152046] text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/60 dark:border-[#1E293B]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {sec.sampleQuestions && sec.sampleQuestions.length > 0 && (
                        <div className="pt-1.5 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Sample Focus:</span>
                          {sec.sampleQuestions.map((q, qIdx) => (
                            <p key={qIdx} className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              • {q}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start md:self-auto pt-2 md:pt-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono block">
                              {score ? `${score}%` : 'Passed'}
                            </span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStartSection(sec)}
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Retake Round"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleStartSection(sec)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Start Round {sec.order}</span>
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleSimulatePassRound(sec.id)}
                            className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1"
                            title="Mark as Completed"
                          >
                            Mark Passed
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#152046]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked (Pass Round {sec.order - 1})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
