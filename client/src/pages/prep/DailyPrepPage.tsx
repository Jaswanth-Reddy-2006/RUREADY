import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Sparkles, BookOpen, Brain, Code2, Database } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function DailyPrepPage() {
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({ 0: true });

  const tasks = [
    {
      id: 0,
      type: 'LEARN',
      subject: 'DBMS',
      title: 'DBMS Normalization — 3NF & BCNF',
      duration: '15 min',
      route: '/preparation/learn/dbms-normalization',
    },
    {
      id: 1,
      type: 'PRACTICE',
      subject: 'Logical Reasoning',
      title: 'Seating Arrangement Puzzles',
      duration: '10 questions',
      route: '/preparation/practice/logical-reasoning',
    },
    {
      id: 2,
      type: 'PRACTICE',
      subject: 'DSA',
      title: 'Binary Search & Sliding Window',
      duration: '5 questions',
      route: '/preparation/practice/dsa-binary-search',
    },
    {
      id: 3,
      type: 'TEST',
      subject: 'Operating Systems',
      title: 'Process Scheduling Timed Mini-Test',
      duration: '15 questions',
      route: '/preparation/test/core-cs',
    },
  ];

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPerc = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Nav */}
        <button
          onClick={() => navigate('/preparation')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Preparation Command Center
        </button>

        {/* Header Card */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono font-bold">
              TODAY'S PLAN • 55 MINS TOTAL
            </Badge>
            <span className="text-xs font-mono text-slate-500 font-bold">{completedCount} / {tasks.length} Completed</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Today's Calibrated Agenda</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            A balanced daily mix of conceptual learning, active practice, and timed assessment.
          </p>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
              <span>Today's Progress</span>
              <span>{progressPerc}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPerc}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Task Step List */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const isDone = completedTasks[task.id] === true;

            return (
              <Card
                key={task.id}
                className={`p-5 bg-white border transition-all rounded-3xl flex items-center justify-between gap-4 ${
                  isDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200/80 shadow-xs hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : task.id + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-mono">
                        {task.type} • {task.duration}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">{task.subject}</span>
                    </div>
                    <h3 className={`text-sm font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCompletedTasks((prev) => ({ ...prev, [task.id]: true }));
                    navigate(task.route);
                  }}
                  className={`text-xs font-bold px-5 py-2 rounded-xl shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isDone ? 'Review' : 'Start'}
                </Button>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
