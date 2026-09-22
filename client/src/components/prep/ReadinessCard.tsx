import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlacementReadinessBreakdown } from '@ru-ready/shared';
import { Sparkles, ShieldCheck, Clock, Map, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface ReadinessCardProps {
  readiness: PlacementReadinessBreakdown;
  lastAssessedDate?: string;
}

export default function ReadinessCard({ readiness, lastAssessedDate }: ReadinessCardProps) {
  const navigate = useNavigate();
  const isAssessed = readiness.overallScore !== null;

  if (!isAssessed) {
    return (
      <Card className="p-6 sm:p-7 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Placement Preparation</span>
          </div>
          <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-mono font-bold">
            Evidence: NOT ASSESSED
          </Badge>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">You haven't been assessed yet.</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            Discover your current strengths and gaps with a short baseline assessment.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => navigate('/preparation/assessment')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Baseline Assessment</span>
          </Button>
        </div>
      </Card>
    );
  }

  const badgeColor =
    readiness.evidenceStrength === 'STRONG'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : readiness.evidenceStrength === 'MODERATE'
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : 'bg-amber-50 text-amber-800 border-amber-200';

  const statusVerdict =
    (readiness.overallScore || 0) >= 75
      ? 'Proficient'
      : (readiness.overallScore || 0) >= 55
      ? 'Developing'
      : 'Needs Attention';

  const gaps = readiness.gaps && readiness.gaps.length > 0 ? readiness.gaps : ['Logical Reasoning', 'DSA', 'Aptitude'];

  return (
    <Card className="p-6 sm:p-7 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Your Preparation Profile</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`${badgeColor} text-xs font-mono font-bold`}>
            Evidence Strength: {readiness.evidenceStrength}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Status Verdict & Score Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <span className="text-2xl font-extrabold font-mono text-cyan-400">{readiness.overallScore}%</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Preparation Status</span>
            <h3 className="text-lg font-bold text-slate-900">{statusVerdict}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last assessed {lastAssessedDate || 'recently'}</span>
            </p>
          </div>
        </div>

        {/* Domain Scores & Focus Areas */}
        <div className="space-y-2 text-xs text-slate-600 border-l border-slate-100 pl-0 md:pl-6">
          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
            Your Focus Areas:
          </span>
          <ul className="space-y-1">
            {gaps.slice(0, 3).map((gap, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2 justify-end">
          <Button
            onClick={() => navigate('/preparation/today')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Start Today's Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => navigate('/preparation/skills')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Map className="w-4 h-4 text-slate-500" />
            <span>View Skill Map</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
