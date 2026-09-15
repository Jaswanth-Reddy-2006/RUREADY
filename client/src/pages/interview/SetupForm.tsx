import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Briefcase, GraduationCap, Award, Play, Clock, Upload, 
  FileText, CheckCircle2, AlertCircle, X, ChevronDown, Code, 
  ChevronRight, ChevronLeft, Lock, Target, Compass, Check, ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { z } from 'zod';
import apiClient from '../../api/client';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import { useInterviewStore, InterviewCategory } from '../../store/useInterviewStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const POPULAR_ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Fullstack Engineer',
  'AI / ML Engineer',
  'Data Scientist',
  'DevOps / SRE',
  'Product Manager',
  'Database Administrator',
  'Mobile Developer',
  'Embedded Systems Engineer',
  'Security Engineer',
  'QA / Testing Engineer'
];

const PILLS_BY_CATEGORY: Record<InterviewCategory, string[]> = {
  CODING: ['DSA', 'System Design', 'OOPs Concepts', 'Clean Code & Refactoring', 'Time & Space Complexity', 'Data Structures', 'Tree & Graphs', 'Dynamic Programming'],
  HR: ['Behavioral (STAR)', 'Conflict Resolution', 'Culture Fit', 'Salary Negotiation', 'Team Collaboration', 'Overcoming Failure'],
  INTERNSHIP: ['DSA', 'OOPs Concepts', 'Web Core', 'Basic Databases', 'Behavioral (STAR)', 'Problem Solving Basics'],
  JOB: ['DSA', 'System Design', 'OOPs Concepts', 'System Architecture', 'Web Core', 'API & Scaling', 'Behavioral (STAR)', 'Distributed Systems', 'Scale & Security', 'Team Mentorship'],
  PROMOTION: ['System Architecture', 'API & Scaling', 'Distributed Systems', 'Scale & Security', 'Team Mentorship', 'Leadership & Strategy', 'Behavioral (STAR)', 'Cross-team Alignment'],
  PRACTICE: ['DSA', 'System Design', 'OOPs Concepts', 'Web Core', 'API & Scaling', 'Behavioral (STAR)', 'Conflict Resolution', 'Culture Fit'],
  LEADERSHIP: ['Team Mentorship', 'Leadership & Strategy', 'Scale & Security', 'Conflict Resolution', 'Culture Fit', 'Distributed Systems', 'Hiring & Org Design']
};

const CATEGORIES_METADATA: Record<InterviewCategory, { title: string; desc: string; icon: any; tag: string; questionsEst: string }> = {
  CODING: { title: 'Coding & Algorithms', desc: 'Socratic code sandbox, algorithmic complexity analysis, and live test suites.', icon: Code, tag: 'Technical', questionsEst: '1-3 Problems' },
  HR: { title: 'HR & Behavioral', desc: 'Behavioral scenarios, alignment probes, and structural STAR method diagnostics.', icon: Sparkles, tag: 'Culture & STAR', questionsEst: '4-6 Questions' },
  INTERNSHIP: { title: 'Junior / Intern', desc: 'Foundational programming concepts, academic core topics, and standard paradigms.', icon: GraduationCap, tag: 'Fundamentals', questionsEst: '4-5 Questions' },
  JOB: { title: 'Full Technical Job', desc: 'Full-stack software design, API pipelines, transactional queries, and production gotchas.', icon: Briefcase, tag: 'Comprehensive', questionsEst: '5-7 Questions' },
  PROMOTION: { title: 'Internal Promotion', desc: 'Advanced engineering leadership, high-scale execution, and complex system design.', icon: Award, tag: 'Staff / Lead', questionsEst: '4-6 Questions' },
  PRACTICE: { title: 'General Practice', desc: 'A custom, balanced simulation testing a wide scope of general tech and behavioral skills.', icon: Compass, tag: 'Balanced', questionsEst: '4-5 Questions' },
  LEADERSHIP: { title: 'Tech Leadership', desc: 'Mentoring dynamics, architectural roadmaps, growth scaling, and strategic vision.', icon: Target, tag: 'Executive', questionsEst: '3-5 Questions' }
};

export default function SetupForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ZUSTAND Store State
  const { currentStep, formData, updateField, nextStep, prevStep, resetForm } = useInterviewStore();

  // Local UI States
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [roleSearch, setRoleSearch] = useState(formData.targetRole);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prepMessage, setPrepMessage] = useState('');

  // Update store role whenever roleSearch changes
  const [profileData, setProfileData] = useState<{
    targetRole?: string;
    seniority?: string;
    targetCompany?: string;
    techStack?: string[];
  }>({});

  useEffect(() => {
    updateField('targetRole', roleSearch);
  }, [roleSearch, updateField]);

  // Preload role from onboarding profile if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ru_ready_onboarding_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfileData(parsed);
        if (parsed.targetRole && !formData.targetRole) {
          const roleTitleMap: Record<string, string> = {
            frontend: 'Frontend Engineer',
            backend: 'Backend Engineer',
            fullstack: 'Fullstack Engineer',
            'ai-ml': 'AI / ML Engineer',
            devops: 'DevOps / SRE',
            manager: 'Engineering Manager',
          };
          const title = roleTitleMap[parsed.targetRole] || parsed.targetRole;
          setRoleSearch(title);
          updateField('targetRole', title);
        }
        if (parsed.targetCompany && !formData.targetCompany) {
          updateField('targetCompany', parsed.targetCompany);
        }
      }
    } catch {
      // Ignore storage read error
    }
  }, []);

  const handleQuickStartFromProfile = async () => {
    setIsSubmitting(true);
    setPrepMessage('Initializing session with your profile calibration...');
    try {
      const roleTitleMap: Record<string, string> = {
        frontend: 'Frontend Engineer',
        backend: 'Backend Engineer',
        fullstack: 'Fullstack Engineer',
        'ai-ml': 'AI / ML Engineer',
        devops: 'DevOps / SRE',
        manager: 'Engineering Manager',
      };
      const role = roleTitleMap[profileData.targetRole || ''] || profileData.targetRole || 'Software Engineer';
      const expLevel = profileData.seniority === 'senior' 
        ? ExperienceLevel.SENIOR 
        : profileData.seniority === 'mid' 
          ? ExperienceLevel.MID 
          : ExperienceLevel.FRESHER;
      const domains = profileData.techStack && profileData.techStack.length > 0 
        ? profileData.techStack 
        : ['DSA', 'System Design', 'Behavioral (STAR)'];
      const company = profileData.targetCompany || 'Top Tech Companies';
      const goalMeta = `[Timer: 20][Difficulty: MEDIUM][Skills: ${domains.join(',')}][Tools: ][Subjects: ${domains.join(',')}]`;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: InterviewType.JOB,
        targetRole: role,
        targetCompany: company,
        industry: 'Technology',
        experienceLevel: expLevel,
        focusAreas: domains && domains.length > 0 ? domains : ['General Technical'],
        interviewGoal: goalMeta,
        durationMins: 20,
      });

      const sessionId = sessionResponse.data.id;
      setPrepMessage('Ava is preparing the initial question tailored to your profile...');
      await apiClient.post(`/interview/session/${sessionId}/start`);
      resetForm();
      navigate(`/interview/${sessionId}/device-check`);
    } catch (err: any) {
      console.error('Failed to quick start session', err);
      setValidationError('Failed to initialize mock interview. Please check server connection.');
      setIsSubmitting(false);
    }
  };

  // Synchronize dynamic defaults when Step 1 category changes
  const handleCategorySelect = (cat: InterviewCategory) => {
    updateField('category', cat);
    
    // Auto adjust duration defaults
    if (cat === 'CODING') {
      updateField('durationMinutes', 45);
    } else if (cat === 'HR' || cat === 'PRACTICE') {
      updateField('durationMinutes', 15);
    } else {
      updateField('durationMinutes', 20);
    }

    // Auto adjust focus domains depending on category rules
    if (cat === 'CODING') {
      updateField('focusDomains', ['DSA', 'System Design']);
    } else {
      updateField('focusDomains', ['Behavioral (STAR)', 'System Architecture']);
    }

    setValidationError(null);
    nextStep();
  };

  // Get active pills based on category + experience level
  const activePills = formData.category 
    ? PILLS_BY_CATEGORY[formData.category] || [] 
    : [];

  const getFullPillMatrix = () => {
    let pills = [...activePills];
    if (formData.category === 'JOB' && formData.experienceLevel === 'SENIOR') {
      const highLevel = ['Distributed Systems', 'Scale & Security', 'Team Mentorship'];
      highLevel.forEach(p => {
        if (!pills.includes(p)) pills.push(p);
      });
    }
    // Include any custom focus domains added by user
    formData.focusDomains.forEach(fd => {
      if (!pills.includes(fd)) pills.push(fd);
    });
    return pills;
  };

  const currentPills = getFullPillMatrix();

  // Check if a pill is locked / mandatory
  const isPillLocked = (pill: string) => {
    if (formData.category === 'CODING') {
      return pill === 'DSA' || pill === 'System Design';
    }
    return false;
  };

  // Toggle pill tags matrix
  const handlePillToggle = (pill: string) => {
    if (isPillLocked(pill)) return;

    const currentDomains = [...formData.focusDomains];
    if (currentDomains.includes(pill)) {
      updateField('focusDomains', currentDomains.filter(p => p !== pill));
    } else {
      updateField('focusDomains', [...currentDomains, pill]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const newTag = customTagInput.trim();
      if (!formData.focusDomains.includes(newTag)) {
        updateField('focusDomains', [...formData.focusDomains, newTag]);
      }
      setCustomTagInput('');
    }
  };

  // Dropdown filtering
  const filteredRoles = POPULAR_ROLES.filter(r =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  // Resume Upload Handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setUploadError('Only .pdf and .docx file extensions are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Resume file exceeds maximum size limit of 5.0MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const uploadPayload = new FormData();
    uploadPayload.append('resume', file);

    try {
      const res = await apiClient.post('/upload/resume', uploadPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateField('resumeFile', file);
      updateField('resumeId', res.data.id);
      updateField('resumeFileName', file.name);

      if (res.data.skills && res.data.skills.length > 0) {
        const parsedSkills = res.data.skills.map((s: string) => s.trim()).filter(Boolean);
        const mergedDomains = Array.from(new Set([...formData.focusDomains, ...parsedSkills]));
        updateField('focusDomains', mergedDomains);
      }
    } catch (err: any) {
      console.error('Resume upload failed', err);
      setUploadError(err.response?.data?.message || 'Failed to parse resume context.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Step Nav validation gates
  const validateAndProceed = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!formData.category) {
        setValidationError('Please select an interview category to proceed.');
        return;
      }
      nextStep();
    } else if (currentStep === 2) {
      const schema = z.object({
        targetRole: z.string().min(1, 'Target Role field cannot be empty.'),
        industry: z.string().min(1, 'Industry field cannot be empty.'),
        experienceLevel: z.enum(['FRESHER', 'MID', 'SENIOR'], {
          errorMap: () => ({ message: 'Please select your target experience level.' })
        })
      });

      const result = schema.safeParse({
        targetRole: formData.targetRole,
        industry: formData.industry || 'Technology',
        experienceLevel: formData.experienceLevel
      });

      if (!result.success) {
        setValidationError(result.error.errors[0].message);
        return;
      }

      if (formData.category === 'CODING') {
        const domains = Array.from(new Set([...formData.focusDomains, 'DSA', 'System Design']));
        updateField('focusDomains', domains);
      }

      nextStep();
    } else if (currentStep === 3) {
      if (formData.focusDomains.length === 0) {
        setValidationError('Please select at least one focus domain.');
        return;
      }

      if (formData.category === 'JOB' && formData.experienceLevel === 'SENIOR') {
        const seniorPills = ['Distributed Systems', 'Scale & Security', 'Team Mentorship'];
        const hasSeniorPill = formData.focusDomains.some(d => seniorPills.includes(d));
        if (!hasSeniorPill) {
          setValidationError('Senior level Job interviews require at least one high-level architectural or leadership domain.');
          return;
        }
      }

      nextStep();
    }
  };

  // Handle Form Submission Step 4
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setPrepMessage('Saving your interview profile...');

    let apiInterviewType = InterviewType.PRACTICE;
    if (formData.category === 'INTERNSHIP') apiInterviewType = InterviewType.INTERNSHIP;
    else if (formData.category === 'JOB') apiInterviewType = InterviewType.JOB;
    else if (formData.category === 'PROMOTION') apiInterviewType = InterviewType.PROMOTION;
    else if (formData.category === 'CODING') apiInterviewType = InterviewType.CODING;
    else if (formData.category === 'HR') apiInterviewType = InterviewType.HR_ROUND;
    else if (formData.category === 'LEADERSHIP') apiInterviewType = InterviewType.LEADERSHIP;

    const goalMeta = `[Timer: ${formData.durationMinutes}][Difficulty: MEDIUM][Skills: ${formData.focusDomains.join(',')}][Tools: ][Subjects: ${formData.focusDomains.join(',')}]`;

    try {
      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: apiInterviewType,
        targetRole: formData.targetRole.trim(),
        targetCompany: formData.targetCompany.trim() || 'General Practice',
        industry: formData.industry.trim() || 'Technology',
        experienceLevel: formData.experienceLevel,
        focusAreas: formData.focusDomains && formData.focusDomains.length > 0 ? formData.focusDomains : ['General Technical'],
        interviewGoal: goalMeta,
        durationMins: formData.durationMinutes,
        resumeId: formData.resumeId || undefined,
      });

      const sessionId = sessionResponse.data.id;
      setPrepMessage('Ava is preparing the initial question tailored to your stack...');

      await apiClient.post(`/interview/session/${sessionId}/start`);

      resetForm();
      navigate(`/interview/${sessionId}/device-check`);
    } catch (err: any) {
      console.error('Failed to initialize session', err);
      setValidationError('Failed to initialize mock interview. Please check server connection.');
      setIsSubmitting(false);
    }
  };

  const getDurationConstraints = () => {
    if (formData.category === 'CODING') {
      return { min: 30, max: 60, step: 5 };
    }
    if (formData.category === 'HR' || formData.category === 'PRACTICE') {
      return { min: 10, max: 30, step: 5 };
    }
    return { min: 15, max: 45, step: 5 };
  };

  const durationConstraints = getDurationConstraints();
  const estimatedQuestionsCount = Math.max(3, Math.round(formData.durationMinutes / 4));

  return (
    <div className="relative mx-auto max-w-5xl xl:max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#11183D]/80 backdrop-blur-md">
          <div className="mx-4 max-w-md w-full rounded-3xl border border-[#DCE7F2] bg-[#11183D] p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#4A8BDF] border-t-transparent" />
            <h3 className="text-lg font-bold font-display text-white mb-2">
              Calibrating Socratic Engine
            </h3>
            <p className="text-xs text-[#DCE7F2] font-body">
              {prepMessage || 'Please wait...'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FD] border border-[#DCE7F2] text-[#4A8BDF] text-xs font-bold shadow-2xs">
          <Sparkles size={14} />
          <span>Interactive Pre-Interview Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11183D] font-display tracking-tight">
          Configure Your Assessment
        </h1>
        <p className="text-sm sm:text-base text-[#334155] font-body leading-relaxed">
          Answer a few interactive questions to calibrate Ava’s Socratic difficulty, technical stack, and STAR depth.
        </p>
      </div>

      {/* Step Progress Tracker */}
      <div className="flex items-center justify-between gap-3 mb-10 px-4 sm:px-10">
        {[
          { step: 1, label: 'Track Category' },
          { step: 2, label: 'Role & Level' },
          { step: 3, label: 'Domains & Time' },
          { step: 4, label: 'Pre-Flight Review' }
        ].map((s, idx) => (
          <div key={s.step} className="flex-1 flex items-center">
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center font-display text-xs font-bold transition-all duration-300 shrink-0 ${
                currentStep === s.step 
                  ? 'bg-[#4A8BDF] text-white shadow-md ring-4 ring-[#4A8BDF]/20' 
                  : currentStep > s.step 
                    ? 'bg-[#168A62] text-white' 
                    : 'bg-[#EFFAFD] text-[#7B8799] border border-[#DCE7F2]'
              }`}>
                {currentStep > s.step ? <Check size={15} /> : s.step}
              </div>
              <span className={`hidden md:inline text-xs font-bold font-display ${
                currentStep === s.step ? 'text-[#11183D]' : 'text-[#7B8799]'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < 3 && (
              <div className="flex-1 h-[2px] mx-4 bg-[#DCE7F2] relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#4A8BDF] transition-all duration-500"
                  style={{ width: currentStep > s.step ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="flex items-start gap-3 rounded-2xl bg-[#FDF0F0] border border-[#D64545]/25 p-4 text-xs text-[#D64545] font-body shadow-sm mb-8 animate-in fade-in slide-in-from-top-3 duration-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold font-display block mb-0.5">Configuration Notice:</span>
            <span>{validationError}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setValidationError(null)} 
            className="text-[#D64545] hover:opacity-75 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <Card padding="none" className="shadow-sm border-[#DCE7F2] bg-white p-6 sm:p-8 md:p-10 rounded-3xl">
        
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: CATEGORY SELECTION ─── */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Quick Start from Profile Pathway - Signature AI Eggplant Styling */}
              {profileData.targetRole && (
                <div className="p-6 rounded-2xl bg-[#F8EAF4] border border-[#A0006D]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#A0006D]" />
                      <h4 className="text-sm font-bold text-[#11183D] font-display">
                        1-Click Quick Launch from Your Profile
                      </h4>
                    </div>
                    <p className="text-xs text-[#334155] font-body">
                      Target Role: <span className="font-semibold text-[#11183D]">{profileData.targetRole}</span> • Company: <span className="font-semibold text-[#11183D]">{profileData.targetCompany || 'Top Tech'}</span> • Level: <span className="font-semibold text-[#11183D] capitalize">{profileData.seniority || 'Fresher'}</span>
                    </p>
                  </div>
                  <Button
                    size="md"
                    variant="ai"
                    onClick={handleQuickStartFromProfile}
                    disabled={isSubmitting}
                    iconRight={<ArrowRight size={14} />}
                    className="shrink-0"
                  >
                    Launch Calibrated Session
                  </Button>
                </div>
              )}

              <div className="border-b border-[#DCE7F2] pb-5">
                <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-1">
                  Questionnaire Step 1 of 4
                </span>
                <h3 className="text-xl font-bold font-display text-[#11183D]">
                  What type of interview would you like to practice today?
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-body mt-1">
                  Select a category to pre-load calibrated question models and diagnostic telemetry.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {(Object.keys(CATEGORIES_METADATA) as InterviewCategory[]).map((cat) => {
                  const meta = CATEGORIES_METADATA[cat];
                  const isSelected = formData.category === cat;
                  const IconComponent = meta.icon;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer min-h-[160px] ${
                        isSelected
                          ? 'border-[#4A8BDF] bg-[#EFF7FD] ring-2 ring-[#4A8BDF]/30 shadow-md scale-[1.01]'
                          : 'border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/40 hover:bg-[#EFFAFD] hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                              isSelected 
                                ? 'bg-[#4A8BDF] text-white shadow-xs' 
                                : 'bg-[#EFFAFD] text-[#11183D] group-hover:bg-[#EFF7FD] group-hover:text-[#4A8BDF]'
                            }`}>
                              <IconComponent size={20} />
                            </div>
                            <h4 className="text-base font-bold font-display text-[#11183D] leading-snug">
                              {meta.title}
                            </h4>
                          </div>

                          <span className="text-[11px] font-bold bg-[#EFFAFD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-2.5 py-1 rounded-full font-mono shrink-0">
                            {meta.tag}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-body">
                          {meta.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#DCE7F2]/60 flex items-center justify-between text-[11px] text-[#526078] font-mono">
                        <span className="flex items-center gap-1.5 font-semibold text-[#11183D]">
                          <Clock size={12} className="text-[#4A8BDF]" />
                          Pacing: {meta.questionsEst}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#4A8BDF] flex items-center gap-1 font-display">
                            <Check size={13} /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: PROFILE CONTEXT ─── */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-[#DCE7F2] pb-5 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-1">
                    Questionnaire Step 2 of 4
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#11183D]">
                    Tell us about the target role and experience tier
                  </h3>
                  <p className="text-xs sm:text-sm text-[#334155] font-body mt-1">
                    Ava adjusts technical rigor and complexity probes based on your level.
                  </p>
                </div>
                <Badge variant="royal" size="xs">Phase 2 of 4</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Target Role with Autocomplete */}
                <div className="space-y-2 relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Target Role <span className="text-[#D64545]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B8799]">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Engineer, Fullstack, DevOps..."
                      value={roleSearch}
                      onChange={(e) => {
                        setRoleSearch(e.target.value);
                        setShowRoleDropdown(true);
                      }}
                      onFocus={() => setShowRoleDropdown(true)}
                      onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
                      className="w-full rounded-xl border border-[#DCE7F2] bg-white pl-10 pr-9 py-3 text-sm font-body text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]/30 focus:border-[#4A8BDF] transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7B8799]"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${showRoleDropdown ? 'rotate-180 text-[#4A8BDF]' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showRoleDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto border border-[#DCE7F2] bg-white py-1 shadow-lg rounded-xl font-body text-xs text-[#11183D]"
                      >
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onMouseDown={() => {
                                setRoleSearch(role);
                                setShowRoleDropdown(false);
                              }}
                              className={`flex w-full items-center px-4 py-2.5 text-left transition-colors cursor-pointer ${
                                roleSearch === role
                                  ? 'bg-[#EFF7FD] text-[#4A8BDF] font-semibold'
                                  : 'hover:bg-[#EFFAFD] text-[#334155]'
                              }`}
                            >
                              {role}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2.5 text-xs text-[#7B8799] italic">
                            Press Enter to use custom: "{roleSearch}"
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Industry Domain */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Industry Sector <span className="text-[#D64545]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technology, FinTech, E-Commerce..."
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm font-body text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]/30 focus:border-[#4A8BDF] transition-all shadow-xs"
                  />
                </div>

                {/* Target Company */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Amazon, OpenAI, Stripe..."
                    value={formData.targetCompany}
                    onChange={(e) => updateField('targetCompany', e.target.value)}
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm font-body text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]/30 focus:border-[#4A8BDF] transition-all shadow-xs"
                  />
                </div>

                {/* Experience Level Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Experience Level <span className="text-[#D64545]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: ExperienceLevel.FRESHER, label: 'Fresher / 0-1y', icon: GraduationCap },
                      { value: ExperienceLevel.MID, label: 'Mid / 2-5y', icon: Compass },
                      { value: ExperienceLevel.SENIOR, label: 'Senior / 5y+', icon: Award }
                    ].map((exp) => {
                      const IconComponent = exp.icon;
                      const isSelected = formData.experienceLevel === exp.value;
                      return (
                        <button
                          key={exp.value}
                          type="button"
                          onClick={() => {
                            updateField('experienceLevel', exp.value);
                            setValidationError(null);
                          }}
                          className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#4A8BDF] bg-[#EFF7FD] text-[#4A8BDF] font-bold shadow-xs ring-2 ring-[#4A8BDF]/30'
                              : 'border-[#DCE7F2] bg-white text-[#334155] hover:border-[#4A8BDF]/30 hover:bg-[#EFFAFD]'
                          }`}
                        >
                          <IconComponent className={`h-4 w-4 mb-1.5 ${isSelected ? 'text-[#4A8BDF]' : 'text-[#7B8799]'}`} />
                          <span className="text-xs font-display text-center leading-tight">{exp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: FOCUS DOMAINS & DURATION ─── */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-[#DCE7F2] pb-5 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-1">
                    Questionnaire Step 3 of 4
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#11183D]">
                    Select focus topics and allocate interview time
                  </h3>
                  <p className="text-xs sm:text-sm text-[#334155] font-body mt-1">
                    Toggle key subjects to drill into, or type custom tags below.
                  </p>
                </div>
                <Badge variant="royal" size="xs">Phase 3 of 4</Badge>
              </div>

              {/* Tag Selection Matrix */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Diagnostic Syllabus Topics <span className="text-[#D64545]">*</span>
                  </label>
                  <span className="text-xs text-[#526078] font-mono">
                    {formData.focusDomains.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 p-6 rounded-2xl border border-[#DCE7F2] bg-[#EFFAFD]/40 max-h-64 overflow-y-auto">
                  {currentPills.map((pill) => {
                    const isChecked = formData.focusDomains.includes(pill);
                    const isLocked = isPillLocked(pill);

                    return (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => handlePillToggle(pill)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                          isChecked
                            ? isLocked
                              ? 'bg-[#DCE7F2] text-[#7B8799] border-[#DCE7F2] cursor-not-allowed'
                              : 'bg-[#4A8BDF] text-white border-[#4A8BDF] shadow-xs'
                            : 'bg-white text-[#334155] border-[#DCE7F2] hover:border-[#4A8BDF]/40 hover:text-[#4A8BDF] hover:bg-[#EFFAFD]'
                        }`}
                      >
                        {isLocked && <Lock className="h-3.5 w-3.5 mr-0.5" />}
                        {isChecked && !isLocked && <Check className="h-3.5 w-3.5 mr-0.5" />}
                        <span>{pill}</span>
                        {isLocked && <span className="text-[10px] opacity-70">(Mandatory)</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Custom topic input */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom topic (e.g. GraphQL, Kafka, Kubernetes)..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    className="flex-1 rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-xs sm:text-sm font-body text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF]"
                  />
                  <Button
                    size="md"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim()) {
                        const newTag = customTagInput.trim();
                        if (!formData.focusDomains.includes(newTag)) {
                          updateField('focusDomains', [...formData.focusDomains, newTag]);
                        }
                        setCustomTagInput('');
                      }
                    }}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-4 pt-6 border-t border-[#DCE7F2]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-1.5">
                    <Clock size={15} className="text-[#4A8BDF]" />
                    <span>Allocated Interview Duration</span>
                  </label>
                  <span className="text-xs sm:text-sm font-bold bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-3.5 py-1 rounded-full font-mono">
                    {formData.durationMinutes} Minutes • ≈ {estimatedQuestionsCount} Questions
                  </span>
                </div>

                <div className="pt-2">
                  <input
                    type="range"
                    min={durationConstraints.min}
                    max={durationConstraints.max}
                    step={durationConstraints.step}
                    value={formData.durationMinutes}
                    onChange={(e) => updateField('durationMinutes', parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-[#DCE7F2] rounded-lg appearance-none cursor-pointer accent-[#4A8BDF] focus:outline-none"
                  />
                  <div className="flex justify-between text-xs text-[#7B8799] font-mono mt-2">
                    <span>{durationConstraints.min}m (Quick Calibration)</span>
                    <span>{durationConstraints.max}m (Full In-Depth Round)</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ─── STEP 4: REVIEW & RESUME ─── */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-[#DCE7F2] pb-5 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-1">
                    Questionnaire Step 4 of 4
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#11183D]">
                    Review Pre-Flight Calibration & Resume
                  </h3>
                  <p className="text-xs sm:text-sm text-[#334155] font-body mt-1">
                    Verify all parameters before launching the live AI interview chamber.
                  </p>
                </div>
                <Badge variant="royal" size="xs">Ready to Launch</Badge>
              </div>

              {/* Resume Drag/Drop Area */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                  Resume Context Integration (Optional)
                </label>

                <div
                  onClick={triggerFileSelect}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      const fileInput = fileInputRef.current;
                      if (fileInput) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;
                        handleResumeUpload({ target: { files: dataTransfer.files } } as any);
                      }
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    formData.resumeFileName
                      ? 'border-[#168A62] bg-[#E8F5F0]/50'
                      : uploadError
                        ? 'border-[#D64545] bg-[#FDF0F0]/50'
                        : 'border-[#DCE7F2] hover:border-[#4A8BDF]/50 hover:bg-[#EFF7FD]/50 bg-[#EFFAFD]/30'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf,.docx"
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#4A8BDF] border-t-transparent" />
                      <p className="text-xs sm:text-sm font-semibold text-[#11183D]">Parsing tech stack from CV...</p>
                    </div>
                  ) : formData.resumeFileName ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#168A62] text-white">
                        <CheckCircle2 size={22} />
                      </div>
                      <p className="text-sm font-bold text-[#168A62] font-display">Resume Context Synced</p>
                      <p className="text-xs sm:text-sm text-[#334155] font-body flex items-center gap-2 border border-[#DCE7F2] px-4 py-1.5 bg-white rounded-full">
                        <FileText size={14} className="text-[#4A8BDF]" />
                        {formData.resumeFileName}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF7FD] text-[#4A8BDF]">
                        <Upload size={18} />
                      </div>
                      <p className="text-sm font-bold text-[#11183D]">Upload resume to ground questions in your real projects</p>
                      <p className="text-xs text-[#7B8799]">PDF or DOCX format (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="flex items-start gap-2 rounded-xl bg-[#FDF0F0] border border-[#D64545]/25 p-3.5 text-xs text-[#D64545] font-medium">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Summary Matrix */}
              <div className="space-y-4 pt-5 border-t border-[#DCE7F2]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                  Live Readiness Blueprint
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 bg-[#EFFAFD]/60 border border-[#DCE7F2] rounded-3xl p-6 sm:p-7 font-body text-xs sm:text-sm text-[#11183D]">
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Track Format</span>
                    <span className="font-bold text-[#11183D] font-display text-sm sm:text-base">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Target Position</span>
                    <span className="font-bold text-[#11183D] text-sm sm:text-base">{formData.targetRole || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Target Enterprise</span>
                    <span className="text-[#11183D] font-semibold text-sm sm:text-base">{formData.targetCompany || 'General Practice'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Seniority Level</span>
                    <span className="text-[#11183D] font-semibold capitalize">{formData.experienceLevel || 'Fresher'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Duration & Pacing</span>
                    <span className="font-semibold text-[#11183D]">{formData.durationMinutes} Min (≈ {estimatedQuestionsCount} Qs)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-0.5">Interviewer</span>
                    <span className="font-semibold text-[#A0006D] flex items-center gap-1.5">
                      <Sparkles size={13} /> Ava Socratic AI
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3 border-t border-[#DCE7F2]/80 pt-4">
                    <span className="text-[10px] text-[#7B8799] uppercase tracking-wider font-semibold block mb-2">Focus Topics</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.focusDomains.map(d => (
                        <span key={d} className="bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 text-xs px-3 py-1 rounded-full font-semibold font-body">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="mt-8 pt-5 border-t border-[#DCE7F2] flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              size="md"
              onClick={prevStep}
              disabled={isSubmitting}
              icon={<ChevronLeft size={16} />}
            >
              Previous Step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              size="md"
              onClick={validateAndProceed}
              iconRight={<ChevronRight size={16} />}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="royal"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              iconRight={<ArrowRight size={16} />}
              className="shadow-md"
            >
              Launch Mock Interview →
            </Button>
          )}
        </div>

      </Card>

      {/* Safety & Compliance Badge */}
      <div className="mt-6 flex justify-center items-center gap-2 text-xs text-[#7B8799] font-body">
        <ShieldCheck size={14} className="text-[#168A62]" />
        <span>Voice-First Dynamic Question Generation • Real-Time Socratic STAR Evaluation</span>
      </div>

    </div>
  );
}
