import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Play,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  Code,
  Target,
  Plus,
  Zap,
  Search,
  Check,
  ShieldCheck,
  Tag,
  ChevronLeft,
} from 'lucide-react';
import apiClient from '../../api/client';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const INTERVIEW_TYPES = [
  {
    id: 'TECHNICAL',
    title: 'Technical Interview',
    desc: 'Deep dive into role knowledge, technical concepts, code architecture, and problem solving.',
    icon: Code,
    badge: 'Technical',
    color: 'border-blue-300 bg-blue-50/40 text-blue-900',
  },
  {
    id: 'HR_BEHAVIORAL',
    title: 'HR / Behavioral Interview',
    desc: 'Practice introduction, leadership principles, teamwork scenarios, situational conflicts, and STAR response framing.',
    icon: Sparkles,
    badge: 'STAR Method',
    color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900',
  },
  {
    id: 'FULL_SIMULATION',
    title: 'Full Interview Simulation',
    desc: 'Realistic end-to-end combination of introduction, past project deep dive, technical questions, and behavioral probes.',
    icon: Target,
    badge: 'Recommended',
    color: 'border-purple-300 bg-purple-50/40 text-purple-900',
  },
];

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / ML Engineer',
  'Data Scientist',
  'DevOps / SRE',
  'Product Manager',
  'Database Administrator',
  'Mobile Developer',
  'QA / Testing Engineer',
  'Data Analyst',
];

const POPULAR_COMPANIES = [
  'None / General Target',
  'Amazon',
  'Google',
  'Microsoft',
  'TCS',
  'Infosys',
  'Accenture',
  'Meta',
  'Apple',
  'Uber',
];

const PREDEFINED_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'Python',
  'Java',
  'C++',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'REST APIs',
  'Git',
  'Docker',
  'AWS',
  'System Design',
  'DSA',
  'OOP',
  'Microservices',
];

const ALL_FOCUS_AREAS = [
  { id: 'Technical Knowledge', label: 'Technical Knowledge' },
  { id: 'DSA', label: 'DSA / Problem Solving' },
  { id: 'Core CS', label: 'Core CS (OS, DBMS, CN)' },
  { id: 'Projects', label: 'Projects & Architecture' },
  { id: 'System Design', label: 'System Design' },
  { id: 'Web Development', label: 'Web Development' },
  { id: 'Backend', label: 'Backend Development' },
  { id: 'Frontend', label: 'Frontend Development' },
  { id: 'Databases', label: 'Databases & SQL' },
  { id: 'APIs', label: 'APIs & Microservices' },
  { id: 'Problem Solving', label: 'Problem Solving' },
  { id: 'Behavioral', label: 'Behavioral & Leadership' },
  { id: 'Communication', label: 'Communication Polish' },
];

export default function SetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query parameter pre-fills
  const initialCompany = searchParams.get('company') || '';
  const initialRole = searchParams.get('role') || 'Software Engineer';
  const initialMode = searchParams.get('mode')?.toUpperCase() || 'FULL_SIMULATION';
  const initialJd = searchParams.get('jd') || searchParams.get('jobDescription') || '';

  // State
  const [interviewType, setInterviewType] = useState<string>(
    ['TECHNICAL', 'HR_BEHAVIORAL', 'FULL_SIMULATION'].includes(initialMode)
      ? initialMode
      : 'FULL_SIMULATION'
  );

  const [targetRole, setTargetRole] = useState<string>(initialRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);

  const [targetCompany, setTargetCompany] = useState<string>(
    initialCompany ? initialCompany : 'None / General Target'
  );
  const [customCompanyInput, setCustomCompanyInput] = useState<string>('');
  const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(ExperienceLevel.FRESHER);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'SQL']);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  
  const [jobDescription, setJobDescription] = useState<string>(initialJd);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Technical Knowledge',
    'Projects',
    'Behavioral',
  ]);

  const [durationMins, setDurationMins] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  // Auto-suggest focus areas based on Role and Skills
  useEffect(() => {
    const suggested = new Set<string>(selectedFocus);
    const roleLower = targetRole.toLowerCase();

    if (roleLower.includes('backend')) {
      suggested.add('Backend');
      suggested.add('Databases');
      suggested.add('APIs');
    }
    if (roleLower.includes('frontend')) {
      suggested.add('Frontend');
      suggested.add('Web Development');
    }
    if (roleLower.includes('full stack') || roleLower.includes('software')) {
      suggested.add('Technical Knowledge');
      suggested.add('Projects');
    }

    if (selectedSkills.includes('System Design')) suggested.add('System Design');
    if (selectedSkills.includes('DSA')) suggested.add('DSA');

    if (interviewType === 'HR_BEHAVIORAL') {
      suggested.add('Behavioral');
      suggested.add('Communication');
    }

    setSelectedFocus(Array.from(suggested));
  }, [targetRole, selectedSkills.length, interviewType]);

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleFocus = (focusId: string) => {
    if (selectedFocus.includes(focusId)) {
      setSelectedFocus(selectedFocus.filter((f) => f !== focusId));
    } else {
      setSelectedFocus([...selectedFocus, focusId]);
    }
  };

  const handleStartInterview = async () => {
    setIsSubmitting(true);
    setPrepMessage('Configuring interview session with target parameters...');
    try {
      const finalRole = isCustomRole ? customRoleInput || 'Software Engineer' : targetRole;
      const finalCompany =
        isCustomCompany
          ? customCompanyInput
          : targetCompany === 'None / General Target'
          ? ''
          : targetCompany;

      const goalMeta = `[Type: ${interviewType}][Skills: ${selectedSkills.join(',')}][Focus: ${selectedFocus.join(',')}]`;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: InterviewType.JOB,
        targetRole: finalRole,
        targetCompany: finalCompany || undefined,
        industry: 'Technology',
        experienceLevel,
        focusAreas: selectedFocus,
        interviewGoal: goalMeta,
        durationMins,
      });

      const sessionId = sessionResponse.data.id;
      setPrepMessage('Preparing questions tailored to your target role and skills...');
      await apiClient.post(`/interview/session/${sessionId}/start`);
      navigate(`/interview/${sessionId}/device-check`);
    } catch (err) {
      console.error('Failed to launch session', err);
      setIsSubmitting(false);
      setPrepMessage('Error launching session. Please try again.');
    }
  };

  const finalDisplayRole = isCustomRole ? customRoleInput || 'Custom Role' : targetRole;
  const finalDisplayCompany = isCustomCompany
    ? customCompanyInput || 'Custom Company'
    : targetCompany === 'None / General Target'
    ? 'Optional (General Role)'
    : targetCompany;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/oral')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Oral Command Center</span>
        </button>

        {/* ─── HEADER ─── */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RU READY Interview Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Prepare Your Oral Interview
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            Configure your target role, experience level, skills, and interview focus. The engine will dynamically sequence your interview questions.
          </p>
        </div>

        {/* ─── CONFIGURATION FORM ─── */}
        <div className="space-y-6">
          
          {/* 1. INTERVIEW TYPE */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>1. Select Interview Type *</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INTERVIEW_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = interviewType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInterviewType(type.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${type.color}`}>
                          {type.badge}
                        </span>
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">{type.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
                    </div>

                    {isSelected && (
                      <div className="pt-2 border-t border-blue-200/60 flex items-center gap-1.5 text-xs font-bold text-blue-700">
                        <Check className="w-4 h-4" /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2. TARGET ROLE & COMPANY */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Target Role */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Target Role *
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
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {POPULAR_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Enter Custom Role...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Distributed Systems Engineer"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomRole(false)}
                      className="p-3 text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Target Company (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Target Company <span className="text-slate-400 font-normal">(Optional)</span>
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
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {POPULAR_COMPANIES.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Enter Custom Company...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Stripe, OpenAI, Netflix"
                      value={customCompanyInput}
                      onChange={(e) => setCustomCompanyInput(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCompany(false)}
                      className="p-3 text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 3. EXPERIENCE LEVEL */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-slate-900">3. Experience Level *</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: ExperienceLevel.FRESHER, label: 'Student / Fresher' },
                { level: ExperienceLevel.MID, label: '0–2 Years' },
                { level: ExperienceLevel.SENIOR, label: '2–5 Years' },
                { level: 'LEAD', label: '5+ Years' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setExperienceLevel(item.level as any)}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    experienceLevel === item.level
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Card>

          {/* 4. SKILLS MULTI-SELECT & CUSTOM TAGS */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <span>4. Skills Relevant to Interview</span>
                </h2>
                <p className="text-xs text-slate-500">Select skills or add custom tags to guide technical questions.</p>
              </div>
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono">
                {selectedSkills.length} Selected
              </Badge>
            </div>

            {/* Selected Skill Tags */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[48px] items-center">
              {selectedSkills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills selected yet. Click skills below to add.</span>
              ) : (
                selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-purple-200 text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add custom skill tag (e.g. GraphQL, Kafka, Tailwind)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                type="button"
                onClick={handleAddCustomSkill}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl text-xs font-bold"
              >
                + Add Skill
              </Button>
            </div>

            {/* Predefined Quick Pills */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Popular Technical Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PREDEFINED_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                      }`}
                    >
                      {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* 5. JOB DESCRIPTION (OPTIONAL) */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>5. Job Description</span>
              </h2>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>

            <textarea
              rows={3}
              placeholder="Paste or attach the target job description to tailor specific role requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </Card>

          {/* 6. INTERVIEW FOCUS AREAS (MULTI-SELECT DROPDOWN) */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>6. Interview Focus Areas</span>
                </h2>
                <p className="text-xs text-slate-500">Select topics you want Ava or Ethan to emphasize.</p>
              </div>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-mono">
                {selectedFocus.length} Focus Selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_FOCUS_AREAS.map((focus) => {
                const isChecked = selectedFocus.includes(focus.id);
                return (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => toggleFocus(focus.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span>{focus.label}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 7. DURATION */}
          <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>7. Interview Duration *</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMins(mins)}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    durationMins === mins
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* ─── FINAL SETUP SUMMARY BOX & START CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Interview Configuration Summary
            </span>
            <Badge className="bg-blue-500/20 text-blue-300 font-mono text-xs border-blue-500/30">
              Ready to Launch
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Interview Type:</span>
              <strong className="text-white">{interviewType.replace('_', ' ')}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Target Role:</span>
              <strong className="text-white">{finalDisplayRole}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Company:</span>
              <strong className="text-white">{finalDisplayCompany}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Duration:</span>
              <strong className="text-white">{durationMins} Minutes</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Skills: <strong className="text-slate-200">{selectedSkills.join(', ') || 'General'}</strong>
            </div>

            <Button
              onClick={handleStartInterview}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? prepMessage || 'Initializing...' : 'Start Interview'}</span>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
