import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEARN' | 'PRACTICE' | 'TEST' | 'PROGRESS'>('OVERVIEW');
  const store = usePrepStore();
  const prog = store.learningProgress[topicId || 'dbms-normalization']?.completionPercentage || 65;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <button
          onClick={() => navigate('/preparation')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
        </button>

        {/* Topic Header Card */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 font-mono uppercase">
            <span>DBMS • Normalization</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">DBMS Normalization: 1NF → 2NF → 3NF → BCNF</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Understand how database normalization reduces data redundancy and prevents insertion, update, and deletion anomalies.
          </p>

          {/* Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold pt-1">
            {(['OVERVIEW', 'LEARN', 'PRACTICE', 'TEST', 'PROGRESS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'LEARN') navigate(`/preparation/learn/${topicId || 'dbms-normalization'}`);
                  if (tab === 'PRACTICE') navigate(`/preparation/practice/${topicId || 'dbms-normalization'}`);
                  if (tab === 'TEST') navigate(`/preparation/test/core-cs`);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Card>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* What You'll Learn */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                    What You'll Learn:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1NF — Atomic values & no multi-valued cells</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>2NF — Partial Dependency elimination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>3NF — Transitive Dependency elimination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>BCNF — Strict Super Key requirements</span>
                    </li>
                  </ul>
                </div>

                {/* Prerequisites & Time */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[11px] mb-1">
                      Prerequisites:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">Functional Dependencies</Badge>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">Candidate Keys</Badge>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[11px] mb-1">
                      Estimated Duration & Accuracy:
                    </span>
                    <div className="flex items-center gap-4 text-slate-600 font-mono">
                      <span>35 mins lesson</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">68% Recent Accuracy</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recommended Next Action */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Recommended Next Action:</span>
                  <p className="text-xs text-blue-700">Continue section 3: Third Normal Form (3NF) and BCNF decomp.</p>
                </div>
                <Button
                  onClick={() => navigate(`/preparation/learn/${topicId || 'dbms-normalization'}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shrink-0 shadow-xs"
                >
                  Continue Learning →
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
