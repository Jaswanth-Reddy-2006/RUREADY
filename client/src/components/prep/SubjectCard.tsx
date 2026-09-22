import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export interface SubjectCardData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  readiness: number | null;
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'NOT_ASSESSED';
  topicsCompleted: number;
  totalTopics: number;
  questionsAttempted: number;
  totalQuestions: number;
  focusAreas: string[];
}

interface SubjectCardProps {
  subject: SubjectCardData;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const navigate = useNavigate();
  const isAssessed = subject.readiness !== null;

  const statusVerdict = !isAssessed
    ? 'Not Assessed'
    : (subject.readiness || 0) >= 75
    ? 'Proficient'
    : (subject.readiness || 0) >= 55
    ? 'Developing'
    : 'Needs Attention';

  const badgeColor =
    subject.evidenceStrength === 'STRONG'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : subject.evidenceStrength === 'MODERATE'
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : subject.evidenceStrength === 'LIMITED'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <Card className="p-6 bg-white border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all rounded-3xl flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              {subject.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{subject.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* Readiness Status & Evidence */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              Status: <span className="font-mono text-blue-700">{statusVerdict}</span>
            </span>
            <Badge className={`${badgeColor} text-[10px] font-mono font-bold`}>
              {subject.evidenceStrength.replace('_', ' ')}
            </Badge>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAssessed ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              style={{ width: `${subject.readiness || 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
            <span>{subject.topicsCompleted} / {subject.totalTopics} Topics</span>
            <span>{subject.questionsAttempted} / {subject.totalQuestions} Questions</span>
          </div>
        </div>

        {/* Actionable Focus Areas */}
        {subject.focusAreas.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Focus Areas:
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {subject.focusAreas.map((fa, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium text-[11.5px]">{fa}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => navigate(`/preparation/subject/${subject.id}`)}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
      >
        <span>{isAssessed ? 'Continue Preparation' : 'Explore Subject'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
