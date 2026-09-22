import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Award,
  BookOpen,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { COMPANY_INTERVIEW_TRACKS } from '../../data/companyTracksData';

export default function CompanyWiseCatalogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ─── HEADER ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>Company-Specific Practice Tracks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Company-wise Interview Tracks
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              Practice structured interview loops tailored for top tech employers. Complete each round to earn a verified track readiness score.
            </p>
          </div>

          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-mono self-start sm:self-auto">
            4 Curated Tracks Available
          </Badge>
        </div>

        {/* ─── IMPORTANT ACCURACY DISCLOSURE NOTICE ─── */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>RU READY Practice Tracks Disclosure:</strong> These company tracks represent structured practice simulations based on publicly documented role rubrics and interview formats. Completing rounds generates actual performance evidence for your preparation profile.
          </div>
        </div>

        {/* ─── COMPANY TRACK CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPANY_INTERVIEW_TRACKS.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 bg-white border-slate-200 hover:border-purple-300 hover:shadow-md transition-all rounded-3xl space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-lg">
                        {track.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{track.companyName}</h3>
                        <span className="text-xs text-purple-600 font-semibold">{track.role}</span>
                      </div>
                    </div>

                    <Badge className="bg-slate-100 text-slate-700 font-mono text-xs">
                      {track.sections.length} Rounds
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {track.description}
                  </p>

                  {/* Round Highlights */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Interview Loop Breakdown:
                    </span>
                    <div className="space-y-1.5">
                      {track.sections.map((sec) => (
                        <div key={sec.id} className="text-xs text-slate-700 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="font-medium truncate">{sec.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{sec.durationMins}m</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Total Loop: {track.sections.reduce((acc, s) => acc + s.durationMins, 0)} mins
                  </span>

                  <Button
                    onClick={() => navigate(`/interviews/company-wise/${track.companySlug}`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Track & Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
