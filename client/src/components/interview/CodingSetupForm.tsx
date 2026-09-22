import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Clock, Code2, AlertTriangle, 
  ArrowLeft, Shield, Terminal, Check, ArrowRight,
  Cpu, Layers, CheckCircle2, ShieldCheck, Zap,
  Search, Plus, Play, Briefcase, GraduationCap
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Data Engineer',
  'AI / ML Engineer',
  'DevOps Engineer',
  'Product Engineer',
];

const POPULAR_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'TCS',
  'Infosys',
  'Deloitte',
  'Accenture',
  'Meta',
  'Apple',
  'Uber',
  'Top Tech / Startup',
];

const CODING_PRACTICE_CHECKBOXES = [
  { id: 'DSA', label: 'DSA / Problem Solving', isRecommended: true },
  { id: 'SQL', label: 'SQL & Database Queries' },
  { id: 'Debugging', label: 'Debugging & Code Review' },
  { id: 'MachineCoding', label: 'Machine Coding / Low-Level Design' },
  { id: 'Backend', label: 'Backend / API Development' },
  { id: 'Frontend', label: 'Frontend Component Coding' },
  { id: 'Competitive', label: 'Competitive Programming' },
];

const CODING_LANGUAGES = [
  { id: 'cpp', label: 'C++', ext: 'cpp', badge: 'Native GCC' },
  { id: 'java', label: 'Java 17', ext: 'java', badge: 'JVM' },
  { id: 'python', label: 'Python 3', ext: 'py', badge: 'CPython 3.12' },
  { id: 'javascript', label: 'JavaScript', ext: 'js', badge: 'Node.js 20' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts', badge: 'Strict Types' },
  { id: 'go', label: 'Go (Golang)', ext: 'go', badge: 'Goroutines' },
  { id: 'csharp', label: 'C#', ext: 'cs', badge: '.NET 8' },
];

export default function CodingSetupForm() {
  const navigate = useNavigate();

  // Form State
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  const [targetCompany, setTargetCompany] = useState('Google');
  const [customCompanyInput, setCustomCompanyInput] = useState('');
  const [isCustomCompany, setIsCustomCompany] = useState(false);

  const [experienceLevel, setExperienceLevel] = useState('FRESHER');
  const [jobDescription, setJobDescription] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  // Practice Selection & Language
  const [selectedPractice, setSelectedPractice] = useState<string[]>(['DSA', 'Debugging']);
  const [codingLanguage, setCodingLanguage] = useState<string>('python');
  const [rememberLanguage, setRememberLanguage] = useState<boolean>(true);

  // Duration & Realism
  const [durationMins, setDurationMins] = useState(30);
  const [simulationMode, setSimulationMode] = useState<'PRACTICE' | 'REALISTIC' | 'CHALLENGE'>('REALISTIC');

  // Pre-Flight Review State
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prepMessage, setPrepMessage] = useState('');

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('ru_ready_preferred_language');
    if (savedLang) {
      setCodingLanguage(savedLang);
    }
  }, []);

  // Save language preference when toggled
  const handleLanguageChange = (langId: string) => {
    setCodingLanguage(langId);
    if (rememberLanguage) {
      localStorage.setItem('ru_ready_preferred_language', langId);
    }
  };

  // Auto-extract topics from JD
  useEffect(() => {
    if (!jobDescription.trim()) return;
    const lower = jobDescription.toLowerCase();
    const detected = new Set<string>();
    if (/dsa|algorithm|data structure/i.test(lower)) detected.add('DSA');
    if (/sql|postgres|database/i.test(lower)) detected.add('SQL');
    if (/backend|node|java|spring|python/i.test(lower)) detected.add('Backend');
    if (/react|frontend|ui/i.test(lower)) detected.add('Frontend');
    
    if (detected.size > 0) {
      setExtractedSkills(Array.from(detected));
    }
  }, [jobDescription]);

  const togglePractice = (id: string) => {
    if (selectedPractice.includes(id)) {
      setSelectedPractice(selectedPractice.filter((item) => item !== id));
    } else {
      setSelectedPractice([...selectedPractice, id]);
    }
  };

  const handleGeneratePlan = () => {
    setIsGenerated(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleStartCodingInterview = async () => {
    setIsSubmitting(true);
    setPrepMessage('Initializing observed IDE sandbox & compilation engine...');
    try {
      const finalRole = isCustomRole ? customRoleInput || 'Software Engineer' : targetRole;
      const finalCompany = isCustomCompany ? customCompanyInput || 'Top Tech' : targetCompany;
      const goalMeta = `[Mode: ${simulationMode}][Lang: ${codingLanguage}][Topics: ${selectedPractice.join(',')}]`;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: 'CODING',
        targetRole: finalRole,
        targetCompany: finalCompany,
        industry: 'Technology',
        experienceLevel,
        focusAreas: selectedPractice,
        interviewGoal: goalMeta,
        durationMins,
      });

      const sessionId = sessionResponse.data.id;
      setPrepMessage('Ava is preparing your live algorithmic challenge...');
      await apiClient.post(`/interview/session/${sessionId}/start`);
      navigate(`/interview/coding/${sessionId}`);
    } catch (err) {
      console.error('Failed to launch coding interview', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Code2 className="w-3.5 h-3.5" />
            <span>Observed IDE & Algorithmic Assessment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prepare for Coding Interview
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Tell us what you're preparing for. Ava will observe your approach, code compilation, and debugging process.
          </p>
        </div>

        {/* ─── SINGLE PAGE FORM CONTAINER ─── */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200/80 shadow-xl rounded-3xl space-y-8">
          
          {/* SECTION 1: TARGET ROLE */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Target Role *
            </label>
            {!isCustomRole ? (
              <select
                value={targetRole}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setIsCustomRole(true);
                  } else {
                    setTargetRole(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                {POPULAR_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value="CUSTOM">+ Enter a custom role manually...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomRole(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: TARGET COMPANY */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Target Company
            </label>
            {!isCustomCompany ? (
              <select
                value={targetCompany}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setIsCustomCompany(true);
                  } else {
                    setTargetCompany(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                {POPULAR_COMPANIES.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
                <option value="CUSTOM">+ Enter company manually...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCompanyInput}
                  onChange={(e) => setCustomCompanyInput(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI, Startup"
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCompany(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: EXPERIENCE LEVEL */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { level: 'FRESHER', label: 'Fresher / Student' },
                { level: 'MID', label: '0–2 Years' },
                { level: 'MID_SENIOR', label: '2–5 Years' },
                { level: 'SENIOR', label: '5+ Years' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setExperienceLevel(item.level)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    experienceLevel === item.level
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: JOB DESCRIPTION (OPTIONAL) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Job Description
              </label>
              <span className="text-xs text-slate-400 font-medium">Optional</span>
            </div>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here to extract target data structures and algorithms..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
            {extractedSkills.length > 0 && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Extracted Coding Topics: <strong>{extractedSkills.join(', ')}</strong></span>
              </div>
            )}
          </div>

          {/* SECTION 5: WHAT WOULD YOU LIKE TO PRACTICE? */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              5. What would you like to practice?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CODING_PRACTICE_CHECKBOXES.map((item) => {
                const isChecked = selectedPractice.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePractice(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isChecked
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.isRecommended && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Recommended</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: CODING LANGUAGE SELECTION */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                6. Choose Coding Language
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberLanguage}
                  onChange={(e) => setRememberLanguage(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Remember my preference</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CODING_LANGUAGES.map((lang) => {
                const isSelected = codingLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-xs font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{lang.label}</div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{lang.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 7: INTERVIEW DURATION */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              7. Interview Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMins(mins)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    durationMins === mins
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              30-minute observed coding session (Engine allocates problem depth)
            </span>
          </div>

          {/* SECTION 8: REALISM MODE */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              8. Interview Realism Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'PRACTICE', title: 'Practice Mode', desc: 'Progressive hints & guidance' },
                { id: 'REALISTIC', title: 'Realistic Simulation', desc: 'Standard coding interview behavior' },
                { id: 'CHALLENGE', title: 'Challenge Mode', desc: 'Deeper follow-ups & zero hints' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSimulationMode(m.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    simulationMode === m.id
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-400/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{m.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GENERATE CTA */}
          <div className="pt-6 border-t border-slate-100">
            <Button
              onClick={handleGeneratePlan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-5 h-5 fill-white" />
              <span>Generate Coding Interview</span>
            </Button>
          </div>

        </Card>

        {/* ─── PRE-INTERVIEW REVIEW CARD ─── */}
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 shadow-2xl border border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Coding Assessment Formulated</span>
                <h2 className="text-2xl font-bold text-white mt-1">Ready to Code.</h2>
              </div>
              <Badge className="bg-blue-600 text-white text-xs px-3 py-1">Observed IDE Engine</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Target Role:</span>
                <span className="font-bold text-white text-sm">{isCustomRole ? customRoleInput || 'Software Engineer' : targetRole}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Company:</span>
                <span className="font-bold text-white text-sm">{isCustomCompany ? customCompanyInput || 'Top Tech' : targetCompany}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Language:</span>
                <span className="font-bold text-cyan-300 text-sm uppercase">{codingLanguage}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration:</span>
                <span className="font-bold text-white text-sm">{durationMins} Minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Topics & Focus Areas:</span>
              <div className="flex flex-wrap gap-2">
                {selectedPractice.map((item) => (
                  <span key={item} className="px-3 py-1 bg-slate-800 text-cyan-300 rounded-lg text-xs font-medium border border-slate-700">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  AVA
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Ava — Observed Coding Interviewer</h4>
                  <p className="text-[11px] text-slate-400">Live Code Stream • Socratic Feedback Active</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> IDE & Compiler Ready
              </span>
            </div>

            {isSubmitting && (
              <div className="p-3 bg-blue-950 text-blue-300 rounded-xl text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                <span>{prepMessage}</span>
              </div>
            )}

            <Button
              onClick={handleStartCodingInterview}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Coding Interview →</span>
            </Button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
