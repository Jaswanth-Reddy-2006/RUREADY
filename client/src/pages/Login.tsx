import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Quote,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [form, setForm] = useState({ email: '', password: '' });

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [forgotSentSuccess, setForgotSentSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleOpenForgot = () => {
    setForgotEmail(form.email.trim());
    setForgotSentSuccess(false);
    setForgotError(null);
    setShowForgotModal(true);
  };

  const handleSendForgot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = forgotEmail.trim();
    if (!clean) {
      setForgotError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setForgotError('Please enter a valid email address');
      return;
    }

    try {
      setIsSendingForgot(true);
      setForgotError(null);
      const res = await authApi.forgotPassword(clean);
      setForgotSentSuccess(true);
      toast.success('Password reset link dispatched!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to dispatch reset link. Please try again.';
      setForgotError(msg);
    } finally {
      setIsSendingForgot(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const trimmedEmail = form.email.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ email: form.email.trim(), password: form.password });
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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
            &ldquo;The only way to do great work is to love what you do.&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-semibold text-white">
              — Steve Jobs
            </p>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Co-founder, Apple Inc.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Right Column: Clean White Card on Pale Blue Background ─── */}
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
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors mb-3 sm:mb-4 font-sans self-start"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mb-4 sm:mb-5">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-[#11183D] mb-1 tracking-tight">
              Welcome back
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#526078]">
              Log in to continue your mock interview calibration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              variant="light"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              autoComplete="current-password"
              variant="light"
            />

            <div className="flex items-center justify-end -mt-1">
              <button
                type="button"
                onClick={handleOpenForgot}
                className="text-xs font-medium text-[#4A8BDF] hover:text-[#2459A8] transition-colors font-body cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoggingIn}
              className="w-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-md shadow-[#4A8BDF]/20 transition-all mt-1 cursor-pointer"
            >
              Sign In →
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center font-body text-xs sm:text-sm text-[#526078] mt-5">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#4A8BDF] hover:text-[#2459A8] transition-colors underline decoration-[#4A8BDF]/40 underline-offset-4"
            >
              Get started for free
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ─── Forgot Password Modal ─── */}
      <AnimatePresence>
        {showForgotModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11183D]/60 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DCE7F2] overflow-hidden"
            >
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#A0006D]" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#7B8799] hover:text-[#11183D] hover:bg-[#EFFAFD] transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {!forgotSentSuccess ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2] shrink-0">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#11183D]">
                        Forgot Password?
                      </h3>
                      <p className="text-xs text-[#526078] font-body">
                        No worries, we'll email you reset instructions.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#526078] font-body leading-relaxed mb-4">
                    Enter the email address tied to your account and we’ll dispatch a secure link to reset your password.
                  </p>

                  <form onSubmit={handleSendForgot} className="space-y-4">
                    <Input
                      label="Registered Email"
                      type="email"
                      placeholder="you@domain.com"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotError) setForgotError(null);
                      }}
                      error={forgotError || undefined}
                      icon={<Mail className="h-4 w-4" />}
                      autoFocus
                      variant="light"
                    />

                    {forgotError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-body">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowForgotModal(false)}
                        className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSendingForgot}
                        className="flex-1 py-2.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white text-xs sm:text-sm font-display font-bold shadow-md shadow-[#4A8BDF]/20"
                      >
                        Send Reset Link
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#11183D] mb-1">
                    Check your email
                  </h3>
                  <p className="text-xs text-[#526078] font-body mb-3">
                    We've dispatched a secure password reset link to:
                  </p>

                  <div className="bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl py-2 px-3 mb-4 font-mono text-xs text-[#2459A8] font-semibold break-all">
                    {forgotEmail}
                  </div>

                  <p className="text-[11px] text-[#7B8799] font-body mb-5 leading-relaxed">
                    Click the link in the email to choose a new password. The link expires in 1 hour. Be sure to check your spam folder if it doesn't arrive shortly.
                  </p>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      fullWidth
                      onClick={() => setShowForgotModal(false)}
                      className="py-2.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white text-xs sm:text-sm font-display font-bold shadow-md"
                    >
                      Return to Login
                    </Button>
                    <button
                      type="button"
                      disabled={isSendingForgot}
                      onClick={() => handleSendForgot()}
                      className="text-xs font-semibold text-[#526078] hover:text-[#4A8BDF] flex items-center justify-center gap-1.5 py-1.5 transition-colors disabled:opacity-50"
                    >
                      <RotateCw className={`h-3 w-3 ${isSendingForgot ? 'animate-spin' : ''}`} />
                      Didn't get the email? Click to resend
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
