import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  HelpCircle,
  Lightbulb,
  X,
  ChevronRight,
  Brain,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePrepStore } from '../../store/usePrepStore';
import DsaWindowVisualizer from '../../components/prep/DsaWindowVisualizer';
import VisualReasoningWidget from '../../components/prep/VisualReasoningWidget';

export default function LearnLessonPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [userConceptAnswers, setUserConceptAnswers] = useState<Record<number, number>>({});
  const [thinkSelection, setThinkSelection] = useState<number | null>(null);

  const lessonContent = {
    title: 'DBMS Normalization: 1NF → 2NF → 3NF → BCNF',
    subject: 'Core Computer Science',
    topic: 'Database Management Systems (DBMS)',
    estimatedTime: '15 mins',
    steps: [
      {
        id: 'intro',
        title: '1. Why Do We Need Database Normalization?',
        summary: 'Normalization organizes database tables to minimize data redundancy and prevent data anomalies during Insert, Update, and Delete operations.',
        problemTable: [
          { studentId: 101, name: 'Rahul', course: 'DBMS', prof: 'Dr. Kumar' },
          { studentId: 101, name: 'Rahul', course: 'OS', prof: 'Dr. Sharma' },
          { studentId: 102, name: 'Priya', course: 'DBMS', prof: 'Dr. Kumar' },
        ],
        thinkPrompt: {
          question: 'If Professor Dr. Kumar changes their name, how many table records need to be updated in an un-normalized table?',
          options: ['Only 1 row', '2 rows (for every enrolled student)', 'Zero rows'],
          correctIndex: 1,
          explanation: 'Because Dr. Kumar is duplicated for both Rahul and Priya, multiple rows must be updated, causing an Update Anomaly.',
        },
        anomalies: [
          { name: 'Redundancy Anomaly', desc: "Student 'Rahul' is duplicated for every course enrolled." },
          { name: 'Update Anomaly', desc: "Changing Dr. Kumar's name requires updating multiple rows." },
          { name: 'Insertion Anomaly', desc: 'Cannot insert a new course without enrolling at least one student.' },
          { name: 'Deletion Anomaly', desc: 'Deleting Priya deletes the only record of the DBMS course.' },
        ],
        quickCheck: {
          question: 'Which anomaly occurs when deleting a student record accidentally deletes course details?',
          options: ['Update Anomaly', 'Deletion Anomaly', 'Insertion Anomaly', 'Redundancy Anomaly'],
          correctIndex: 1,
          explanation: 'Deletion Anomaly happens when deleting one row removes critical secondary data.',
        },
      },
      {
        id: '1nf',
        title: '2. First Normal Form (1NF)',
        summary: 'A relation is in 1NF if and only if all attribute values are atomic (no arrays or multi-valued attributes in a single cell).',
        rule: 'Every cell must contain a single, atomic value. No duplicate rows.',
        badExample: 'CourseCell: ["DBMS", "OS", "CN"]',
        goodExample: 'Separate rows for DBMS, OS, and CN.',
        quickCheck: {
          question: 'What is the mandatory condition for a table to satisfy 1NF?',
          options: [
            'No transitive dependency',
            'All attribute values must be atomic',
            'Primary key must be composite',
            'No foreign keys allowed',
          ],
          correctIndex: 1,
          explanation: '1NF mandates atomic attribute values with no multi-valued cells.',
        },
      },
      {
        id: '2nf',
        title: '3. Second Normal Form (2NF)',
        summary: 'A relation is in 2NF if it is already in 1NF and NO non-prime attribute is partially dependent on any candidate key.',
        rule: 'Eliminate Partial Dependencies (Non-prime attribute depending on a subset of a composite primary key).',
        solution: 'Decompose table into two separate tables: StudentCourse and CourseProfessor.',
        quickCheck: {
          question: '2NF specifically eliminates which type of functional dependency?',
          options: ['Transitive Dependency', 'Partial Dependency', 'Multivalued Dependency', 'Cyclic Dependency'],
          correctIndex: 1,
          explanation: '2NF removes partial dependencies where a non-key attribute depends on part of a composite key.',
        },
      },
      {
        id: '3nf',
        title: '4. Third Normal Form (3NF) & BCNF',
        summary: 'A relation is in 3NF if it is in 2NF and NO non-prime attribute is transitively dependent on the primary key (X → Y, Y → Z => X → Z).',
        rule: 'Eliminate Transitive Dependencies. Boyce-Codd Normal Form (BCNF) requires X to be a super key for EVERY functional dependency X → Y.',
        quickCheck: {
          question: 'In 3NF, if X → Y exists, what must be true about X or Y?',
          options: [
            'X must be a super key OR Y must be a prime attribute',
            'X must be atomic',
            'Y must be a foreign key',
            'X and Y must be identical',
          ],
          correctIndex: 0,
          explanation: 'In 3NF, for X → Y, either X is a super key or Y is a prime attribute.',
        },
      },
    ],
  };

  const currentStepData = lessonContent.steps[activeStep];
  const progressPerc = Math.round(((activeStep + 1) / lessonContent.steps.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP BAR */}
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/preparation')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-600 block">
                {lessonContent.subject} • {lessonContent.topic}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {lessonContent.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-500">Progress:</span>
              <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPerc}%` }}
                />
              </div>
              <span className="font-bold text-slate-800">{progressPerc}%</span>
            </div>

            <Button
              onClick={() => navigate('/preparation')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-xl"
            >
              Exit Lesson
            </Button>
          </div>
        </div>

        {/* 3-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT LESSON NAVIGATION (3 Cols) */}
          <Card className="lg:col-span-3 p-4 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
            <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block border-b border-slate-100 pb-2">
              Lesson Sections
            </span>

            <div className="space-y-1 text-xs">
              {lessonContent.steps.map((step, idx) => {
                const isCurrent = activeStep === idx;
                const isAnswered = userConceptAnswers[idx] !== undefined;

                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveStep(idx);
                      setThinkSelection(null);
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between font-medium ${
                      isCurrent
                        ? 'bg-blue-50 border border-blue-400 text-blue-900 font-bold shadow-xs'
                        : isAnswered
                        ? 'bg-slate-50 text-slate-800 border border-slate-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="line-clamp-1">
                      {isCurrent ? '→ ' : isAnswered ? '✓ ' : '○ '}
                      {step.title.split('. ')[1] || step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* CENTER MAIN CONTENT (6 Cols) */}
          <Card className="lg:col-span-6 p-6 sm:p-8 bg-white border-slate-200/80 shadow-md rounded-3xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">{currentStepData.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{currentStepData.summary}</p>
            </div>

            {/* Table Problem Demonstration */}
            {currentStepData.problemTable && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Unnormalized Table Example:</span>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2.5">StudentID</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Course</th>
                        <th className="p-2.5">Professor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {currentStepData.problemTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono">{row.studentId}</td>
                          <td className="p-2.5 font-medium">{row.name}</td>
                          <td className="p-2.5 font-mono">{row.course}</td>
                          <td className="p-2.5">{row.prof}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Think About It Prompt */}
                {currentStepData.thinkPrompt && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <Brain className="w-4 h-4 text-amber-600" /> Think About It:
                    </div>
                    <p className="text-xs font-semibold">{currentStepData.thinkPrompt.question}</p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {currentStepData.thinkPrompt.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setThinkSelection(optIdx)}
                          className={`flex-1 p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                            thinkSelection === optIdx
                              ? optIdx === currentStepData.thinkPrompt?.correctIndex
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                                : 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                              : 'bg-white border-amber-300 text-amber-950 hover:bg-amber-100/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {thinkSelection !== null && (
                      <div className="p-2.5 rounded-xl bg-white/80 border border-amber-300 text-[11px] text-amber-900 leading-snug">
                        {currentStepData.thinkPrompt.explanation}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentStepData.anomalies?.map((anom) => (
                    <div key={anom.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                      <span className="text-xs font-bold block">{anom.name}</span>
                      <p className="text-[11px] text-slate-600 leading-snug">{anom.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Normalization Rule */}
            {currentStepData.rule && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <Lightbulb className="w-4 h-4" /> Core Normalization Rule:
                </div>
                <p className="text-xs leading-relaxed">{currentStepData.rule}</p>
              </div>
            )}

            {/* Quick Check Question Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <HelpCircle className="w-4 h-4" /> Inline Quick Check:
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                {currentStepData.quickCheck.question}
              </p>

              <div className="space-y-2">
                {currentStepData.quickCheck.options.map((opt, optIdx) => {
                  const isSelected = userConceptAnswers[activeStep] === optIdx;
                  const isCorrect = optIdx === currentStepData.quickCheck.correctIndex;
                  const isAnswered = userConceptAnswers[activeStep] !== undefined;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        const updated = { ...userConceptAnswers, [activeStep]: optIdx };
                        setUserConceptAnswers(updated);
                        const perc = Math.round(((activeStep + 1) / lessonContent.steps.length) * 100);
                        usePrepStore.getState().updateLearningProgress(topicId || 'dbms-normalization', perc);
                      }}
                      className={`w-full p-3 rounded-xl text-xs font-medium text-left transition-all border ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : isSelected
                            ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                          : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {userConceptAnswers[activeStep] !== undefined && (
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
                  <span className="font-bold text-cyan-300 block mb-1">Explanation:</span>
                  {currentStepData.quickCheck.explanation}
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                disabled={activeStep === 0}
                onClick={() => {
                  setActiveStep((prev) => Math.max(0, prev - 1));
                  setThinkSelection(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Previous Section
              </Button>

              {activeStep < lessonContent.steps.length - 1 ? (
                <Button
                  onClick={() => {
                    const nextStep = activeStep + 1;
                    setActiveStep(nextStep);
                    setThinkSelection(null);
                    const perc = Math.round(((nextStep + 1) / lessonContent.steps.length) * 100);
                    usePrepStore.getState().updateLearningProgress(topicId || 'dbms-normalization', perc);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <span>Next Section</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    usePrepStore.getState().updateLearningProgress(topicId || 'dbms-normalization', 100);
                    navigate(`/preparation/practice/${topicId || 'dbms-normalization'}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <span>Complete Lesson & Practice</span>
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>

          {/* RIGHT SIDEBAR — CONCEPT MAP & VISUAL WIDGET (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
              <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block border-b border-slate-100 pb-2">
                Concept Map
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block">Redundancy Anomaly</span>
                  <span className="text-[11px] text-slate-500">Duplicate student rows</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block">Partial Dependency</span>
                  <span className="text-[11px] text-slate-500">Non-prime key dependency</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block">Transitive Dependency</span>
                  <span className="text-[11px] text-slate-500">Indirect dependency chain</span>
                </div>
              </div>
            </Card>

            {/* Interactive visual widget if applicable */}
            {topicId === 'logical-reasoning' ? (
              <VisualReasoningWidget type="SEATING" />
            ) : topicId === 'dsa-sliding-window' ? (
              <DsaWindowVisualizer />
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
}
