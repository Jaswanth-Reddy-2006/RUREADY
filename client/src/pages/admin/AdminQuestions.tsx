// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Question Bank & Assessment Studio
// Curate technical, behavioral, system design & coding questions
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  Filter,
  Code2,
  Sparkles,
  Layers,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Tag,
  Clock,
  Award,
  ChevronRight,
  X,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export interface QuestionBankItem {
  id: string;
  questionText: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'CODING_DSA' | 'CODING_SQL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  targetRole: string;
  usageCount: number;
  expectedKeywords: string[];
  sampleRubric: string;
}

const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'q-1',
    questionText: 'Explain the difference between optimistic and pessimistic locking in distributed databases.',
    category: 'TECHNICAL',
    difficulty: 'MEDIUM',
    targetRole: 'Backend Developer',
    usageCount: 342,
    expectedKeywords: ['Version timestamp', 'Lock contention', 'ACID', 'Concurrency', 'Deadlocks'],
    sampleRubric: 'Candidate should explain version checking at commit time vs holding exclusive row locks during transaction.',
  },
  {
    id: 'q-2',
    questionText: 'Tell me about a time you had a technical disagreement with a senior colleague. How did you resolve it?',
    category: 'BEHAVIORAL',
    difficulty: 'EASY',
    targetRole: 'Software Engineer',
    usageCount: 512,
    expectedKeywords: ['STAR method', 'Data-driven', 'Active listening', 'Compromise', 'Team goal'],
    sampleRubric: 'Look for structured STAR framing, respectful communication, and objective metric-driven resolution.',
  },
  {
    id: 'q-3',
    questionText: 'Design a distributed rate limiter supporting 1,000,000 requests/sec with minimal latency.',
    category: 'SYSTEM_DESIGN',
    difficulty: 'HARD',
    targetRole: 'Systems Software Engineer',
    usageCount: 189,
    expectedKeywords: ['Token Bucket', 'Sliding Window Counter', 'Redis Cluster', 'Nginx Lua', 'Race conditions'],
    sampleRubric: 'Candidate should compare token bucket vs sliding window, discuss Redis memory efficiency and eventual consistency.',
  },
  {
    id: 'q-4',
    questionText: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum (Kadane’s Algorithm).',
    category: 'CODING_DSA',
    difficulty: 'MEDIUM',
    targetRole: 'Software Engineer',
    usageCount: 678,
    expectedKeywords: ['Dynamic programming', 'O(N) time', 'O(1) space', 'Current max', 'Global max'],
    sampleRubric: 'Expect O(N) single-pass dynamic programming solution without allocating extra auxiliary arrays.',
  },
  {
    id: 'q-5',
    questionText: 'Write a SQL query using Window Functions (DENSE_RANK) to find the second highest salary per department.',
    category: 'CODING_SQL',
    difficulty: 'MEDIUM',
    targetRole: 'Data Engineer',
    usageCount: 245,
    expectedKeywords: ['DENSE_RANK()', 'PARTITION BY', 'CTE / Subquery', 'NULL handling'],
    sampleRubric: 'Verify correct use of PARTITION BY department_id and filtering WHERE rank = 2.',
  },
  {
    id: 'q-6',
    questionText: 'How does React 18 Fiber architecture enable concurrent rendering and interruptible task scheduling?',
    category: 'TECHNICAL',
    difficulty: 'HARD',
    targetRole: 'Frontend Developer',
    usageCount: 198,
    expectedKeywords: ['Fiber tree', 'requestIdleCallback', 'Work loop', 'Reconciliation', 'Time slicing'],
    sampleRubric: 'Check understanding of unit of work nodes, priority lanes, and how work is paused without blocking UI thread.',
  },
];

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(INITIAL_QUESTIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionBankItem | null>(null);

  // Form State
  const [formText, setFormText] = useState('');
  const [formCategory, setFormCategory] = useState<QuestionBankItem['category']>('TECHNICAL');
  const [formDifficulty, setFormDifficulty] = useState<QuestionBankItem['difficulty']>('MEDIUM');
  const [formRole, setFormRole] = useState('Software Engineer');
  const [formKeywords, setFormKeywords] = useState('');
  const [formRubric, setFormRubric] = useState('');

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.questionText.toLowerCase().includes(search.toLowerCase()) ||
        q.targetRole.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'ALL' || q.category === categoryFilter;
      const matchDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [questions, search, categoryFilter, difficultyFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormText('');
    setFormCategory('TECHNICAL');
    setFormDifficulty('MEDIUM');
    setFormRole('Software Engineer');
    setFormKeywords('');
    setFormRubric('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: QuestionBankItem) => {
    setEditingItem(item);
    setFormText(item.questionText);
    setFormCategory(item.category);
    setFormDifficulty(item.difficulty);
    setFormRole(item.targetRole);
    setFormKeywords(item.expectedKeywords.join(', '));
    setFormRubric(item.sampleRubric);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.success('Question removed from bank');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) {
      toast.error('Question text is required');
      return;
    }

    const keywords = formKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (editingItem) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingItem.id
            ? {
                ...q,
                questionText: formText,
                category: formCategory,
                difficulty: formDifficulty,
                targetRole: formRole,
                expectedKeywords: keywords,
                sampleRubric: formRubric,
              }
            : q
        )
      );
      toast.success('Question updated successfully');
    } else {
      const newItem: QuestionBankItem = {
        id: `q-${Date.now()}`,
        questionText: formText,
        category: formCategory,
        difficulty: formDifficulty,
        targetRole: formRole,
        usageCount: 0,
        expectedKeywords: keywords,
        sampleRubric: formRubric,
      };
      setQuestions((prev) => [newItem, ...prev]);
      toast.success('New question added to bank');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-body">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>Question Bank & Rubric Studio</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage assessment prompts, scoring rubrics, and technical challenges used by Ava AI.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </Button>
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <Card className="p-4 bg-white border-slate-200/90 shadow-xs rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by question text, target role, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="TECHNICAL">Technical Concepts</option>
              <option value="BEHAVIORAL">HR & Behavioral</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="CODING_DSA">Coding (DSA)</option>
              <option value="CODING_SQL">Coding (SQL)</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ─── Question Cards List ─── */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredQuestions.map((q) => (
          <Card
            key={q.id}
            className="p-5 bg-white border-slate-200/90 shadow-xs hover:shadow-md transition-all rounded-2xl space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      q.category === 'TECHNICAL'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : q.category === 'BEHAVIORAL'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : q.category === 'SYSTEM_DESIGN'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }
                  >
                    {q.category.replace('_', ' ')}
                  </Badge>

                  <Badge
                    className={
                      q.difficulty === 'EASY'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }
                  >
                    {q.difficulty}
                  </Badge>

                  <span className="text-[11px] font-bold text-slate-500 font-mono flex items-center gap-1">
                    <Target className="w-3 h-3 text-slate-400" />
                    <span>{q.targetRole}</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Used {q.usageCount} times
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {q.questionText}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Edit Question"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rubric & Keywords */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              {q.expectedKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Concepts:</span>
                  {q.expectedKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              {q.sampleRubric && (
                <p className="text-slate-600 font-normal leading-relaxed text-[11px]">
                  <strong className="text-slate-800 font-semibold">Evaluation Rubric: </strong>
                  {q.sampleRubric}
                </p>
              )}
            </div>
          </Card>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No matching questions found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 font-display">
                  {editingItem ? 'Edit Question Bank Item' : 'Add New Question to Bank'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Question Text *</label>
                  <textarea
                    rows={3}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Enter the comprehensive question statement..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="TECHNICAL">Technical Concepts</option>
                      <option value="BEHAVIORAL">HR & Behavioral</option>
                      <option value="SYSTEM_DESIGN">System Design</option>
                      <option value="CODING_DSA">Coding (DSA)</option>
                      <option value="CODING_SQL">Coding (SQL)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Difficulty</label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Target Role</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Backend Developer, Data Scientist..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Expected Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    placeholder="e.g. Token Bucket, Redis, Concurrency, Latency"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Evaluation Rubric & Key Indicators</label>
                  <textarea
                    rows={3}
                    value={formRubric}
                    onChange={(e) => setFormRubric(e.target.value)}
                    placeholder="Describe what a great answer should cover..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save Question
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
