// ═══════════════════════════════════════════════════════════════
// Rennetus — Reset Password Page
// Validates token from email link, collects new password, and updates
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  Quote,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

  const strength = getPasswordStrength(password);

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    {
      label: 'Uppercase & lowercase letters',
      met: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    { label: 'At least one number', met: /[0-9]/.test(password) },
    {
      label: 'At least one special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (password.length > 128) {
      newErrors.password = 'Password must not exceed 128 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your new password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token || !email) {
      setErrors({
        general: 'Missing reset parameters. Please use the exact link sent to your email.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await authApi.resetPassword({
        token,
        email,
        newPassword: password,
      });

      setIsSuccess(true);
      toast.success('Password successfully reset!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to reset password. The link may have expired or is invalid.';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalidLink = !token || !email;

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#EFFAFD] text-[#11183D] grid grid-cols-1 lg:grid-cols-12 selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] overflow-x-hidden lg:overflow-hidden">
      {/* ─── Left Column: Royal Blue Full-Bleed Quotation Screen ─── */}
      <motion.div
        initial={{ x: '-100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#2459A8] via-[#2459A8] to-[#11183D] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none min-h-screen lg:h-screen shadow-2xl z-10"
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A8BDF]/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A0006D]/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link to="/">
            <Logo size="md" theme="dark" />
          </Link>
        </div>

        {/* Quotation Body */}
        <div className="relative z-10 my-auto py-6 space-y-5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md shadow-sm border border-white/10">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <blockquote className="font-editorial font-bold text-2xl xl:text-3xl text-slate-100 leading-snug tracking-tight">
            &ldquo;Security is not a product, but a process.&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-semibold text-white">
              — Bruce Schneier
            </p>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Renowned Security Technologist & Author
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Right Column: Card on Pale Blue Background ─── */}
      <motion.div
        initial={{ x: '60%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-60%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 xl:col-span-7 px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-6 xl:px-16 flex flex-col justify-center items-center bg-[#EFFAFD] min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto"
      >
        <div className="max-w-md w-full my-auto flex flex-col justify-center bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-[#DCE7F2]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4 flex justify-center">
            <Link to="/">
              <Logo size="md" theme="light" />
            </Link>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors mb-4 font-sans self-start"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>

          {isInvalidLink ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-2xl text-[#11183D] mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-xs sm:text-sm text-[#526078] font-body mb-6 leading-relaxed">
                This password reset link is invalid or missing required security parameters. Please request a new link from the login page.
              </p>
              <Button
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                className="bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Return to Login
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-display font-bold text-2xl text-[#11183D] mb-2">
                Password Reset Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-[#526078] font-body mb-6 leading-relaxed">
                Your password for <span className="font-semibold text-[#11183D]">{email}</span> has been securely updated. You can now log in with your new password.
              </p>
              <Button
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                className="bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20"
              >
                Sign In Now →
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2] shrink-0">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-sans font-bold text-2xl text-[#11183D] tracking-tight">
                    Set New Password
                  </h1>
                  <p className="font-sans text-xs text-[#526078]">
                    Resetting password for <span className="font-semibold text-[#2459A8]">{email}</span>
                  </p>
                </div>
              </div>

              {errors.general && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-body mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
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
                {password && (
                  <div className="space-y-1.5 -mt-1">
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
                            className={check.met ? 'text-[#11183D] font-medium' : 'text-[#7B8799]'}
                          >
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Input
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
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
                  isLoading={isSubmitting}
                  className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all mt-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  Update Password & Sign In
                </Button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
