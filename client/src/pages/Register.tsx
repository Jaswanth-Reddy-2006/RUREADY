import { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  RotateCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';

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
    3: 'bg-[#4A8BDF]',
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
    quote: 'Security is not a product, but a process.',
    author: 'Bruce Schneier',
    role: 'Renowned Security Technologist & Cryptographer',
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
  {
    quote: 'Education is not the learning of facts, but the training of the mind to think.',
    author: 'Albert Einstein',
    role: 'Theoretical Physicist & Nobel Laureate',
  },
];

export default function Register() {
  const { register, isRegistering } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Email verification continuous step state
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(45);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    college: '',
    degree: '',
    graduationYear: '2025',
    cgpa: '',
    coreSkills: '',
    githubUrl: '',
    linkedinUrl: '',
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

  // Resend cooldown timer for Step 2
  useEffect(() => {
    if (currentStep !== 2 || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, resendCooldown]);

  // Focus first OTP input when arriving on Step 2
  useEffect(() => {
    if (currentStep === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [currentStep]);

  const handleOtpDigitChange = (index: number, value: string) => {
    setOtpError(null);

    // Multi-character paste (e.g. user pasted 6 digits)
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);

      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();

      if (newDigits.every((d) => d !== '')) {
        handleVerifyOtp(newDigits.join(''));
      }
      return;
    }

    // Single digit input
    const char = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setOtpError(null);
      const res = await authApi.verifyRegistrationOtp({
        email: form.email.trim(),
        otp: code,
      });

      if (res.verified && res.verificationToken) {
        setVerificationToken(res.verificationToken);
        toast.success('Email successfully verified!');
        // Seamlessly advance to Step 3: Target Track
        setCurrentStep(3);
      } else {
        setOtpError('Invalid verification code. Please check and try again.');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Invalid or expired verification code. Please try again.';
      setOtpError(msg);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    try {
      setIsSendingOtp(true);
      setOtpError(null);
      await authApi.sendRegistrationOtp({
        email: form.email.trim(),
        name: form.name.trim(),
      });
      setResendCooldown(45);
      toast.success('A new verification code has been dispatched.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to resend code. Please try again.';
      setOtpError(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

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
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!validateStep1()) return;

      // If user already verified their email with OTP in this session, skip OTP and advance to Step 3
      if (verificationToken) {
        setCurrentStep(3);
        return;
      }

      // Send OTP to email and smoothly transition to continuous Step 2
      try {
        setIsSendingOtp(true);
        await authApi.sendRegistrationOtp({
          email: form.email.trim(),
          name: form.name.trim(),
        });
        setResendCooldown(45);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError(null);
        setCurrentStep(2);
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          'Failed to send verification code. Please check your email and try again.';
        setErrors((prev) => ({ ...prev, email: msg }));
      } finally {
        setIsSendingOtp(false);
      }
    } else if (currentStep === 2) {
      handleVerifyOtp();
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else {
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

      if (form.college || form.degree || form.coreSkills) {
        localStorage.setItem(
          'ru_ready_student_profile',
          JSON.stringify({
            college: form.college.trim(),
            degree: form.degree.trim(),
            graduationYear: form.graduationYear,
            cgpa: form.cgpa.trim(),
            coreSkills: form.coreSkills.split(',').map((s) => s.trim()).filter(Boolean),
            githubUrl: form.githubUrl.trim(),
            linkedinUrl: form.linkedinUrl.trim(),
            savedAt: new Date().toISOString(),
          }),
        );
      }
    } catch {
      // Ignore storage error
    }

    register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      verificationToken: verificationToken || undefined,
    });
  };

  const updateField = (field: keyof typeof form, value: string) => {
    if (field === 'email' && value !== form.email) {
      setVerificationToken(null);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const currentQuote = STEP_QUOTES[currentStep - 1];

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#EFFAFD] text-[#11183D] grid grid-cols-1 lg:grid-cols-12 selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] overflow-x-hidden lg:overflow-hidden">
      {/* ─── Left Column: Interactive Form & Onboarding Wizard Card ─── */}
      <motion.div
        initial={{ x: '-60%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '60%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 xl:col-span-7 px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-4 xl:px-12 flex flex-col justify-center items-center bg-[#EFFAFD] min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto"
      >
        <div className="max-w-xl w-full my-auto flex flex-col justify-center bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#DCE7F2]">
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors font-display"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4 | 5) : 1))
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A8BDF] hover:text-[#2459A8] transition-colors font-display cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {currentStep === 2
                  ? 'Back to Step 1'
                  : currentStep === 3
                  ? 'Back to Email Verification'
                  : currentStep === 4
                  ? 'Back to Role Track'
                  : 'Back to Focus Calibration'}
              </button>
            )}

            {/* Step Progress Pill */}
            <div className="flex items-center gap-1.5 bg-[#EFFAFD] px-3 py-1 rounded-full border border-[#DCE7F2]">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div
                  key={stepNum}
                  onClick={() => {
                    if (
                      stepNum < currentStep ||
                      (stepNum === 2 && validateStep1()) ||
                      (stepNum > 2 && verificationToken)
                    ) {
                      setCurrentStep(stepNum as 1 | 2 | 3 | 4 | 5);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-300 ${
                    stepNum === currentStep
                      ? 'w-6 h-2 rounded-full bg-[#4A8BDF]'
                      : stepNum < currentStep
                      ? 'w-2 h-2 rounded-full bg-[#4A8BDF]/40'
                      : 'w-2 h-2 rounded-full bg-[#DCE7F2]'
                  }`}
                  title={`Step ${stepNum}`}
                />
              ))}
              <span className="text-[10.5px] font-mono font-bold text-[#526078] ml-1">
                {currentStep}/5
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
                  <h1 className="font-sans font-bold text-2xl sm:text-3xl text-[#11183D] mb-1 tracking-tight">
                    Create your account
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-[#526078]">
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
                          <Loader2 className="h-4 w-4 animate-spin text-[#4A8BDF]" />
                        ) : emailExists ? (
                          <X className="h-4 w-4 text-[#D64545]" />
                        ) : form.email.length > 5 && !errors.email ? (
                          <Check className="h-4 w-4 text-[#168A62]" />
                        ) : undefined
                      }
                      autoComplete="email"
                      variant="light"
                    />
                    {emailExists && (
                      <div className="flex items-center justify-between text-xs text-[#D64545] bg-[#D64545]/10 border border-[#D64545]/20 px-3 py-1.5 rounded-lg mt-1.5 font-body">
                        <span>An account with this email already exists.</span>
                        <Link
                          to="/login"
                          className="font-bold underline text-[#4A8BDF] hover:text-[#2459A8] ml-2 shrink-0"
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
                        className="hover:text-[#4A8BDF] text-[#7B8799] transition-colors cursor-pointer"
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
                        <span className="text-[#526078] font-body">Strength:</span>
                        <span className="font-semibold text-[#11183D] font-display">
                          {strength.label}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-colors duration-300 ${
                              level <= strength.score ? strength.color : 'bg-[#DCE7F2]'
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
                              <Check className="h-3 w-3 text-[#168A62] shrink-0" />
                            ) : (
                              <X className="h-3 w-3 text-[#7B8799] shrink-0" />
                            )}
                            <span
                              className={
                                check.met ? 'text-[#11183D] font-medium' : 'text-[#7B8799]'
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
                        className="hover:text-[#4A8BDF] text-[#7B8799] transition-colors cursor-pointer"
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
                    isLoading={isSendingOtp}
                    className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all mt-1 cursor-pointer"
                  >
                    Verify Email & Continue →
                  </Button>
                </form>

                <p className="text-center font-body text-xs sm:text-sm text-[#526078] mt-3.5 sm:mt-4">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-[#4A8BDF] hover:text-[#2459A8] transition-colors underline decoration-[#4A8BDF]/40 underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ═════════ STEP 2: Continuous Email OTP Verification ═════════ */}
            {currentStep === 2 && (
              <motion.div
                key="step-2-otp"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#EFFAFD] to-[#E0F2FE] text-[#2459A8] border border-[#BAE6FD] flex items-center justify-center shadow-sm mb-3">
                    <ShieldCheck className="h-6 w-6 text-[#2459A8]" />
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#11183D] tracking-tight">
                    Verify your email address
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-[#526078] mt-1">
                    We've sent a 6-digit confirmation code to verify your Rennetus account.
                  </p>
                </div>

                {/* Email address badge with edit link */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">Sent to</p>
                      <p className="font-mono text-xs sm:text-sm font-semibold text-[#11183D] truncate">
                        {form.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#2459A8] hover:text-[#11183D] bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shrink-0 ml-2 cursor-pointer font-body"
                  >
                    Change
                  </button>
                </div>

                {/* 6 Digit Numeric Inputs */}
                <div className="pt-1">
                  <label className="text-xs font-display font-semibold text-[#526078] uppercase tracking-wider block mb-3 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex justify-between gap-1.5 sm:gap-2.5 max-w-sm mx-auto">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-14 sm:w-13 sm:h-16 text-center font-mono text-2xl sm:text-3xl font-extrabold rounded-2xl border-2 transition-all duration-200 outline-none select-none ${
                          digit
                            ? 'border-[#2459A8] bg-[#EFFAFD] text-[#11183D] shadow-sm ring-4 ring-[#4A8BDF]/20'
                            : 'border-[#DCE7F2] bg-white text-[#11183D] hover:border-[#94A3B8] focus:border-[#2459A8] focus:bg-[#EFFAFD]/30 focus:ring-4 focus:ring-[#4A8BDF]/20 shadow-sm'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {otpError && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-body shadow-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{otpError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    isLoading={isVerifyingOtp}
                    onClick={() => handleVerifyOtp()}
                    className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3.5 rounded-2xl shadow-md shadow-[#4A8BDF]/20 transition-all cursor-pointer"
                  >
                    Verify & Continue to Target Track →
                  </Button>

                  <div className="flex items-center justify-between text-xs font-body text-[#526078] px-1 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span>Didn't receive the email?</span>
                      <span className="text-[11px] text-[#7B8799] hidden sm:inline">(Check spam)</span>
                    </span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSendingOtp}
                      onClick={handleResendOtp}
                      className="font-semibold text-[#4A8BDF] hover:text-[#2459A8] disabled:opacity-40 disabled:hover:text-[#526078] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════ STEP 3: Target Role & Experience Level ═════════ */}
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
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#11183D] tracking-tight">
                    What is your target role?
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-[#526078]">
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
                            ? 'border-[#4A8BDF] bg-[#EFF7FD] shadow-sm ring-2 ring-[#4A8BDF]/20'
                            : 'border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/40 hover:bg-[#EFFAFD]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-[#4A8BDF] text-white'
                                : 'bg-[#EFFAFD] text-[#526078]'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#4A8BDF]/15 text-[#4A8BDF]'
                                : 'bg-[#EFFAFD] text-[#7B8799]'
                            }`}
                          >
                            {role.badge}
                          </span>
                        </div>
                        <div>
                          <p
                            className={`font-display font-bold text-xs sm:text-sm leading-snug ${
                              isSelected ? 'text-[#11183D]' : 'text-[#526078]'
                            }`}
                          >
                            {role.title}
                          </p>
                          <p className="font-body text-[10.5px] text-[#7B8799] line-clamp-1 mt-0.5">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Experience Level Segmented Selector */}
                <div>
                  <label className="text-xs font-display font-semibold uppercase tracking-wider text-[#526078] block mb-1.5">
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
                              ? 'border-[#4A8BDF] bg-[#4A8BDF] text-white shadow-sm'
                              : 'border-[#DCE7F2] bg-white hover:bg-[#EFFAFD] text-[#526078]'
                          }`}
                        >
                          <div className="font-display font-bold text-[11px] sm:text-xs">
                            {exp.label}
                          </div>
                          <div
                            className={`text-[9.5px] font-mono ${
                              isSelected ? 'text-slate-200' : 'text-[#7B8799]'
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
                    className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all cursor-pointer"
                  >
                    Continue to Practice Goals →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═════════ STEP 4: Interview Focus & Urgency ═════════ */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5"
              >
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#11183D] tracking-tight">
                    What is your primary interview focus?
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-[#526078]">
                    We will configure your first mock session with calibrated difficulty and live metrics.
                  </p>
                </div>

                {/* Focus Options (4 options - Eggplant AI Signature styling) */}
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
                            ? 'border-[#A0006D] bg-[#F8EAF4] shadow-sm ring-2 ring-[#A0006D]/20'
                            : 'border-[#DCE7F2] bg-white hover:border-[#A0006D]/30 hover:bg-[#F8EAF4]/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-[#A0006D] text-white'
                                : 'bg-[#EFFAFD] text-[#526078]'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#A0006D]/15 text-[#A0006D]'
                                : 'bg-[#EFFAFD] text-[#7B8799]'
                            }`}
                          >
                            {foc.pill}
                          </span>
                        </div>
                        <div>
                          <p
                            className={`font-display font-bold text-xs sm:text-sm ${
                              isSelected ? 'text-[#11183D]' : 'text-[#526078]'
                            }`}
                          >
                            {foc.title}
                          </p>
                          <p className="font-body text-[10.5px] text-[#7B8799] line-clamp-1 mt-0.5">
                            {foc.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Urgency */}
                <div>
                  <label className="text-xs font-display font-semibold uppercase tracking-wider text-[#526078] block mb-1.5">
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
                              ? 'border-[#4A8BDF] bg-[#EFF7FD] ring-2 ring-[#4A8BDF]/20'
                              : 'border-[#DCE7F2] bg-white hover:bg-[#EFFAFD]'
                          }`}
                        >
                          <div
                            className={`font-display font-bold text-xs ${
                              isSelected ? 'text-[#4A8BDF]' : 'text-[#11183D]'
                            }`}
                          >
                            {time.label}
                          </div>
                          <div className="text-[10px] font-body text-[#7B8799]">
                            {time.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    onClick={() => setCurrentStep(5)}
                    className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all cursor-pointer"
                  >
                    Continue to Academic Profile (Optional) →
                  </Button>
                  <button
                    type="button"
                    onClick={handleSubmitFinal}
                    disabled={isRegistering}
                    className="text-xs text-[#526078] hover:text-[#11183D] underline font-medium py-1 transition-colors text-center cursor-pointer"
                  >
                    Skip & Create Account Now
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═════════ STEP 5: Academic & Student Profile (Optional) ═════════ */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF7FD] text-[#2459A8] border border-[#2459A8]/20 mb-1 font-mono uppercase">
                    Optional Profile Setup
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#11183D] tracking-tight">
                    Your Academic & Student Profile
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-[#526078]">
                    Fill these details to pre-populate your resumes and tailored company interview kits. You can also skip and complete later.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Input
                    label="College / University"
                    placeholder="e.g. Stanford University or NIT Trichy"
                    value={form.college}
                    onChange={(e) => updateField('college', e.target.value)}
                    variant="light"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="Degree & Major"
                      placeholder="e.g. B.Tech Computer Science"
                      value={form.degree}
                      onChange={(e) => updateField('degree', e.target.value)}
                      variant="light"
                    />
                    <Input
                      label="Graduation Year"
                      placeholder="e.g. 2025"
                      value={form.graduationYear}
                      onChange={(e) => updateField('graduationYear', e.target.value)}
                      variant="light"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="CGPA / GPA (Optional)"
                      placeholder="e.g. 8.8 / 10 or 3.9 / 4.0"
                      value={form.cgpa}
                      onChange={(e) => updateField('cgpa', e.target.value)}
                      variant="light"
                    />
                    <Input
                      label="Core Skills (comma separated)"
                      placeholder="e.g. React, Python, SQL, Docker"
                      value={form.coreSkills}
                      onChange={(e) => updateField('coreSkills', e.target.value)}
                      variant="light"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="GitHub Profile URL"
                      placeholder="https://github.com/username"
                      value={form.githubUrl}
                      onChange={(e) => updateField('githubUrl', e.target.value)}
                      variant="light"
                    />
                    <Input
                      label="LinkedIn Profile URL"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedinUrl}
                      onChange={(e) => updateField('linkedinUrl', e.target.value)}
                      variant="light"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    type="button"
                    size="lg"
                    fullWidth
                    isLoading={isRegistering}
                    onClick={handleSubmitFinal}
                    className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all cursor-pointer"
                  >
                    Save Profile & Complete Registration →
                  </Button>

                  <button
                    type="button"
                    onClick={handleSubmitFinal}
                    disabled={isRegistering}
                    className="text-xs text-[#526078] hover:text-[#11183D] underline font-medium py-1 transition-colors text-center cursor-pointer"
                  >
                    Skip for now & Create Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Right Column: Royal Blue Full-Bleed Quotation Screen ─── */}
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0.9 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#2459A8] via-[#2459A8] to-[#11183D] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none min-h-screen lg:h-screen shadow-2xl z-10"
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A8BDF]/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A0006D]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" theme="dark" />
          </Link>
        </div>

        {/* Dynamic Quotation Body based on Active Step */}
        <div className="relative z-10 my-auto py-6 space-y-5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md shadow-sm border border-white/10">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <blockquote className="font-editorial font-bold text-2xl xl:text-3xl text-slate-100 leading-snug tracking-tight">
            &ldquo;{currentQuote.quote}&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-semibold text-white">
              — {currentQuote.author}
            </p>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {currentQuote.role}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
