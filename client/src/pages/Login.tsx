import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Quote } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [form, setForm] = useState({ email: '', password: '' });

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
          <blockquote className="font-editorial font-bold text-2xl xl:text-3xl text-white leading-snug tracking-tight">
            &ldquo;The only way to do great work is to love what you do.&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-semibold text-white">
              — Steve Jobs
            </p>
            <p className="text-xs text-white/80 font-sans mt-0.5">
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
    </div>
  );
}
