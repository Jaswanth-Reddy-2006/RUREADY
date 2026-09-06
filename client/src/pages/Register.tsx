import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Quote,
  Code2,
  Server,
  Layers,
  Cpu,
  Shield,
  Briefcase,
  Terminal,
  Workflow,
  Sparkles,
  Zap,
  Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const normalized = Math.min(score, 4);

  const labels: Record<number, string> = {
    0: '',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  const colors: Record<number, string> = {
    0: '',
    1: 'bg-red-500',
    2: 'bg-amber-500',
    3: 'bg-[#FF7A00]',
    4: 'bg-emerald-500',
  };

  return { score: normalized, label: labels[normalized], color: colors[normalized] };
}

const ROLE_OPTIONS = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    description: 'React, TypeScript, CSS & Performance',
    icon: Code2,
    badge: 'UI / UX',
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    description: 'APIs, Distributed Systems & SQL/NoSQL',
    icon: Server,
    badge: 'Systems',
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    description: 'End-to-End Architecture & REST/GraphQL',
    icon: Layers,
    badge: 'Popular',
  },
  {
    id: 'ai-ml',
    title: 'AI / ML Engineer',
    description: 'LLMs, PyTorch, MLOps & Neural Nets',
    icon: Cpu,
    badge: 'Trending',
  },
  {
    id: 'devops',
    title: 'DevOps & SRE',
    description: 'Kubernetes, Cloud Infra & CI/CD',
    icon: Shield,
    badge: 'Infra',
  },
  {
    id: 'manager',
    title: 'Engineering Manager',
    description: 'Leadership, Scale & Strategic Delivery',
    icon: Briefcase,
    badge: 'Leadership',
  },
];

const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Entry / Junior', range: '0–2 yrs' },
  { id: 'mid', label: 'Mid-Level', range: '2–5 yrs' },
  { id: 'senior', label: 'Senior Engineer', range: '5–8 yrs' },
  { id: 'staff', label: 'Staff / Lead', range: '8+ yrs' },
];

const FOCUS_OPTIONS = [
  {
    id: 'coding',
    title: 'Live Technical Coding',
    desc: 'Algorithms, Data Structures & Sandboxed IDE Execution',
    icon: Terminal,
    pill: 'DSA & Code',
  },
  {
    id: 'system-design',
    title: 'System Design & Scaling',
    desc: 'High-Level Distributed Systems, Sharding & Caching',
    icon: Workflow,
    pill: 'Architecture',
  },
  {
    id: 'behavioral',
    title: 'Behavioral & STAR Defense',
    desc: 'Leadership Principles, Conflict Resolution & Metric Impact',
    icon: Sparkles,
    pill: 'Soft Skills',
  },
  {
    id: 'multimodal',
    title: 'Full Multi-Modal Mock',
    desc: 'Live Code Sandbox + Speech Pacing & Eye Gaze Analytics',
    icon: Zap,
    pill: 'All-in-One',
  },
];

const TIMELINE_OPTIONS = [
  { id: 'urgent', label: '1–2 Weeks', sub: 'Actively Interviewing' },
  { id: 'target', label: '1–2 Months', sub: 'Preparing for Offers' },
  { id: 'continuous', label: 'Ongoing', sub: 'Continuous Growth' },
];

const STEP_QUOTES = [
  {
    quote: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    role: 'Pioneering Computer Scientist & Turing Laureate',
  },
  {
    quote: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    role: 'Turing Award Laureate & Systems Pioneer',
  },
  {
    quote: 'Our industry does not respect tradition — it only respects innovation.',
    author: 'Satya Nadella',
    role: 'CEO, Microsoft',
  },
];

export default function Register() {
  const { register, isRegistering } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    targetRole: 'fullstack',
    experienceLevel: 'mid',
    primaryFocus: 'coding',
    timeline: 'urgent',
  });

  const strength = getPasswordStrength(form.password);

  const passwordChecks = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    {
      label: 'Uppercase & lowercase letters',
      met: /[A-Z]/.test(form.password) && /[a-z]/.test(form.password),
    },
    { label: 'At least one number', met: /[0-9]/.test(form.password) },
    {
      label: 'At least one special character',
      met: /[^A-Za-z0-9]/.test(form.password),
    },
  ];

  // Debounced real-time check for existing email
  useEffect(() => {
    const trimmed = form.email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailExists(false);
      setIsCheckingEmail(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsCheckingEmail(true);
        const res = await authApi.checkEmail(trimmed);
        if (res.exists) {
          setEmailExists(true);
          setErrors((prev) => ({
            ...prev,
            email: 'An account with this email already exists',
          }));
        } else {
          setEmailExists(false);
          setErrors((prev) => {
            if (prev.email === 'An account with this email already exists') {
              return { ...prev, email: undefined };
            }
            return prev;
          });
        }
      } catch {
        // Ignore check error
      } finally {
        setIsCheckingEmail(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.email]);

  const validateStep1 = (): boolean => {
    const newErrors: typeof errors = {};
    const trimmedEmail = form.email.trim();

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (emailExists) {
      newErrors.email = 'An account with this email already exists';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (form.password.length > 128) {
      newErrors.password = 'Password must not exceed 128 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      // Step 3 submission
      handleSubmitFinal();
    }
  };

  const handleSubmitFinal = () => {
    // Save onboarding preferences into localStorage for session auto-fill
    try {
      localStorage.setItem(
        'ru_ready_onboarding_profile',
        JSON.stringify({
          targetRole: form.targetRole,
          experienceLevel: form.experienceLevel,
          primaryFocus: form.primaryFocus,
          timeline: form.timeline,
          completedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignore storage error
    }

    register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const currentQuote = STEP_QUOTES[currentStep - 1];

  return (
    <div className="min-h-screen lg:h-screen w-full bg-white text-slate-800 grid grid-cols-1 lg:grid-cols-12 selection:bg-primary-500/20 selection:text-primary-900 overflow-x-hidden lg:overflow-hidden">
      {/* ─── Left Column: Interactive Form & Onboarding Wizard ─── */}
      <motion.div
        initial={{ x: '-60%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '60%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 xl:col-span-7 px-5 py-5 sm:px-10 sm:py-7 lg:px-12 lg:py-5 xl:px-16 flex flex-col justify-center items-center bg-white min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto"
      >
        <div className="max-w-lg w-full my-auto flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-3 flex justify-center">
            <Link to="/">
              <Logo size="md" theme="light" />
            </Link>
          </div>

          {/* Top Bar: Back link + Step Progress Dots */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {currentStep === 1 ? (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors font-display"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors font-display cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Step {currentStep - 1}
              </button>
            )}

            {/* Step Progress Pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  onClick={() => {
                    if (stepNum < currentStep || (stepNum === 2 && validateStep1())) {
                      setCurrentStep(stepNum as 1 | 2 | 3);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 ${
                    stepNum === currentStep
                      ? 'w-6 h-2 rounded-full bg-[#FF7A00]'
                      : stepNum < currentStep
                      ? 'w-2 h-2 rounded-full bg-slate-400'
                      : 'w-2 h-2 rounded-full bg-slate-200'
                  }`}
                  title={`Step ${stepNum}`}
                />
              ))}
              <span className="text-[10.5px] font-mono font-bold text-slate-500 ml-1">
                {currentStep}/3
              </span>
            </div>
          </div>

          {/* Form Step Container with Smooth Transition */}
          <AnimatePresence mode="wait">
            {/* ═════════ STEP 1: Account Credentials ═════════ */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-3.5 sm:mb-4">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mb-1 tracking-tight">
                    Create your account
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-slate-600">
                    Step 1: Set your login credentials for personalized mock assessments.
                  </p>
                </div>

                <form onSubmit={handleNextStep} className="flex flex-col gap-2.5 sm:gap-3">
                  <Input
                    label="Full Name"
                    placeholder="Alex Chen"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    error={errors.name}
                    icon={<User className="h-4 w-4" />}
                    autoComplete="name"
                    variant="light"
                  />

                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="alex@domain.com"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                      iconRight={
                        isCheckingEmail ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#FF7A00]" />
                        ) : emailExists ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : form.email.length > 5 && !errors.email ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : undefined
                      }
                      autoComplete="email"
                      variant="light"
                    />
                    {emailExists && (
                      <div className="flex items-center justify-between text-xs text-red-600 bg-red-50/90 border border-red-200 px-3 py-1.5 rounded-lg mt-1.5 font-body">
                        <span>An account with this email already exists.</span>
                        <Link
                          to="/login"
                          className="font-bold underline text-[#FF7A00] hover:text-[#E66E00] ml-2 shrink-0"
                        >
                          Sign in instead →
                        </Link>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    error={errors.password}
                    icon={<Lock className="h-4 w-4" />}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-primary-500 text-slate-400 transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    autoComplete="new-password"
                    variant="light"
                  />

                  {/* Password strength meter */}
                  {form.password && (
                    <div className="space-y-1 -mt-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-body">Strength:</span>
                        <span className="font-semibold text-slate-900 font-display">
                          {strength.label}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-colors duration-300 ${
                              level <= strength.score ? strength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        {passwordChecks.map((check) => (
                          <div
                            key={check.label}
                            className="flex items-center gap-1.5 text-[10.5px] font-body"
                          >
                            {check.met ? (
                              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="h-3 w-3 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={
                                check.met ? 'text-slate-800 font-medium' : 'text-slate-400'
                              }
                            >
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Input
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    icon={<Lock className="h-4 w-4" />}
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="hover:text-primary-500 text-slate-400 transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    autoComplete="new-password"
                    variant="light"
                  />

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all mt-1 cursor-pointer"
                  >
                    Continue to Target Track →
                  </Button>
                </form>

                <p className="text-center font-body text-xs sm:text-sm text-slate-500 mt-3.5 sm:mt-4">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-primary-500 hover:text-primary-600 transition-colors underline decoration-primary-500/40 underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ═════════ STEP 2: Target Role & Experience Level ═════════ */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5"
              >
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 tracking-tight">
                    What is your target role?
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-slate-600">
                    We tune the interviewer persona and questions to match your exact career path.
                  </p>
                </div>

                {/* Role Card Grid (6 options) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon;
                    const isSelected = form.targetRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => updateField('targetRole', role.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#FF7A00] bg-orange-50/60 shadow-sm ring-2 ring-[#FF7A00]/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-[#FF7A00] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-orange-200/80 text-[#FF7A00]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {role.badge}
                          </span>
                        </div>
                        <div>
                          <p
                            className={`font-display font-bold text-xs sm:text-sm leading-snug ${
                              isSelected ? 'text-slate-950' : 'text-slate-800'
                            }`}
                          >
                            {role.title}
                          </p>
                          <p className="font-body text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Experience Level Segmented Selector */}
                <div>
                  <label className="text-xs font-display font-semibold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Your Seniority Level
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {EXPERIENCE_LEVELS.map((exp) => {
                      const isSelected = form.experienceLevel === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => updateField('experienceLevel', exp.id)}
                          className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF7A00] bg-[#FF7A00] text-white shadow-sm'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="font-display font-bold text-[11px] sm:text-xs">
                            {exp.label}
                          </div>
                          <div
                            className={`text-[9.5px] font-mono ${
                              isSelected ? 'text-white/85' : 'text-slate-400'
                            }`}
                          >
                            {exp.range}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    onClick={handleNextStep}
                    className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all cursor-pointer"
                  >
                    Continue to Practice Goals →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═════════ STEP 3: Interview Focus & Urgency ═════════ */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5"
              >
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 tracking-tight">
                    What is your primary interview focus?
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-slate-600">
                    We will configure your first mock session with calibrated difficulty and live metrics.
                  </p>
                </div>

                {/* Focus Options (4 options) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {FOCUS_OPTIONS.map((foc) => {
                    const Icon = foc.icon;
                    const isSelected = form.primaryFocus === foc.id;
                    return (
                      <button
                        key={foc.id}
                        type="button"
                        onClick={() => updateField('primaryFocus', foc.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#FF7A00] bg-orange-50/60 shadow-sm ring-2 ring-[#FF7A00]/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-[#FF7A00] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-orange-200/80 text-[#FF7A00]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {foc.pill}
                          </span>
                        </div>
                        <div>
                          <p
                            className={`font-display font-bold text-xs sm:text-sm ${
                              isSelected ? 'text-slate-950' : 'text-slate-800'
                            }`}
                          >
                            {foc.title}
                          </p>
                          <p className="font-body text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                            {foc.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Urgency */}
                <div>
                  <label className="text-xs font-display font-semibold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Interview Readiness Timeline
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = form.timeline === time.id;
                      return (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => updateField('timeline', time.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF7A00] bg-orange-50/80 ring-2 ring-[#FF7A00]/20'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`font-display font-bold text-xs ${
                              isSelected ? 'text-[#FF7A00]' : 'text-slate-800'
                            }`}
                          >
                            {time.label}
                          </div>
                          <div className="text-[10px] font-body text-slate-500">
                            {time.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    isLoading={isRegistering}
                    onClick={handleSubmitFinal}
                    className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all cursor-pointer"
                  >
                    Complete Onboarding & Start Practice →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Right Column: Solar Orange Full-Bleed Quotation Screen ─── */}
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0.9 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#FF7A00] via-[#FF7A00] to-[#E66E00] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none min-h-screen lg:h-screen shadow-2xl z-10"
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" theme="dark" />
          </Link>
        </div>

        {/* Dynamic Quotation Body based on Active Step */}
        <div className="relative z-10 my-auto py-6 space-y-5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md shadow-sm">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <blockquote className="font-display font-black text-2xl xl:text-3xl text-white leading-snug tracking-tight">
            &ldquo;{currentQuote.quote}&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-bold text-white">
              — {currentQuote.author}
            </p>
            <p className="text-xs text-white/80 font-body mt-0.5">
              {currentQuote.role}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
