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
    <div className="min-h-screen lg:h-screen w-full bg-white text-slate-800 grid grid-cols-1 lg:grid-cols-12 selection:bg-primary-500/20 selection:text-primary-900 overflow-x-hidden lg:overflow-hidden">
      {/* ─── Left Column: Solar Orange Full-Bleed Quotation Screen ─── */}
      <motion.div
        initial={{ x: '-100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#FF7A00] via-[#FF7A00] to-[#E66E00] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none min-h-screen lg:h-screen shadow-2xl z-10"
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link to="/">
            <Logo size="md" theme="dark" />
          </Link>
        </div>

        {/* Quotation Body */}
        <div className="relative z-10 my-auto py-6 space-y-5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md shadow-sm">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <blockquote className="font-display font-black text-2xl xl:text-3xl text-white leading-snug tracking-tight">
            &ldquo;The only way to do great work is to love what you do.&rdquo;
          </blockquote>
          <div className="pt-3 border-t border-white/20">
            <p className="font-mono text-sm uppercase tracking-widest font-bold text-white">
              — Steve Jobs
            </p>
            <p className="text-xs text-white/80 font-body mt-0.5">
              Co-founder, Apple Inc.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Right Column: Clean White Full-Bleed Login Form ─── */}
      <motion.div
        initial={{ x: '60%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-60%', opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 xl:col-span-7 px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-6 xl:px-16 flex flex-col justify-center items-center bg-white min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto"
      >
        <div className="max-w-md w-full my-auto flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4 flex justify-center">
            <Link to="/">
              <Logo size="md" theme="light" />
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 sm:mb-4 font-display self-start"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mb-4 sm:mb-5">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mb-1 tracking-tight">
              Welcome back
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-600">
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
                  className="hover:text-primary-500 text-slate-400 transition-colors cursor-pointer"
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
                className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors font-body cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoggingIn}
              className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-display font-bold text-sm sm:text-base py-3 rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all mt-1 cursor-pointer"
            >
              Sign In →
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center font-body text-xs sm:text-sm text-slate-500 mt-4 sm:mt-5">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-primary-500 hover:text-primary-600 transition-colors underline decoration-primary-500/40 underline-offset-4"
            >
              Get started for free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
