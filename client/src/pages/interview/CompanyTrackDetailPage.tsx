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
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { COMPANY_INTERVIEW_TRACKS } from '../../data/companyTracksData';
import apiClient from '../../api/client';

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
    // Load track progress from local storage or real API session history
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

  const handleStartSection = (sec: any) => {
    // Navigate to setup or directly to live room pre-populated with company track details
    navigate(`/oral/new?company=${encodeURIComponent(track.companyName)}&role=${encodeURIComponent(track.role)}&mode=${sec.interviewType.toLowerCase()}&focus=${sec.focusAreas.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/interviews/company-wise')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Company Tracks</span>
        </button>

        {/* ─── TRACK HEADER ─── */}
        <Card className="p-6 md:p-8 bg-white border-slate-200/80 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 font-black text-2xl flex items-center justify-center border border-purple-200">
                {track.companyName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono">
                    {track.companyName} Interview Loop
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{track.role}</h1>
                <p className="text-xs text-slate-500 mt-0.5">{track.description}</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right shrink-0">
              <span className="text-xs font-semibold text-slate-500 block">Track Progress</span>
              <span className="text-2xl font-black text-slate-900">
                {completedSectionIds.length} / {track.sections.length} Completed
              </span>
            </div>
          </div>

          {/* If track is fully completed, show overall aggregated score */}
          {isTrackCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Overall Track Performance Completed
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-xs border-emerald-500/40">
                  VERIFIED SCORE
                </Badge>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">{overallScore}%</span>
                <span className="text-xs text-slate-300">Aggregated across all {track.sections.length} interview rounds</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  onClick={() => {
                    localStorage.removeItem(`company_track_progress_${track.id}`);
                    setCompletedSectionIds([]);
                    setSectionScores({});
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Track</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── SECTION ROUNDS LIST ─── */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Interview Rounds Track</h2>

            <div className="space-y-3">
              {track.sections.map((sec, idx) => {
                const isCompleted = completedSectionIds.includes(sec.id);
                const isCurrent = !isCompleted && (idx === 0 || completedSectionIds.includes(track.sections[idx - 1]?.id));
                const score = sectionScores[sec.id];

                return (
                  <div
                    key={sec.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isCurrent
                        ? 'bg-white border-blue-300 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-slate-50/60 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          Round {sec.order}
                        </span>

                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {sec.durationMins} mins
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900">{sec.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{sec.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sec.skills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 self-start md:self-auto">
                      {isCompleted ? (
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-600 block">{score ? `${score}%` : 'Passed'}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        </div>
                      ) : isCurrent ? (
                        <Button
                          onClick={() => handleStartSection(sec)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start Round</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
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
