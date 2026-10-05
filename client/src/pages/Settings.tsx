import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Key, Shield, ShieldCheck, 
  ChevronRight, ExternalLink, MoreHorizontal, Check, 
  CreditCard, Coins, Receipt, Bell, Lock, Eye, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Flame, X, Save, ShieldAlert, Laptop, Moon, Sun, Smartphone,
  RefreshCw, LogOut, HelpCircle, Sliders, Volume2, Video, Zap
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/useProfileStore';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

type TabKey = 'pricing' | 'account' | 'appearance' | 'privacy' | 'ai' | 'notifications';

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { profile, preferences, updateProfile, updatePreferences } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();

  const tabQuery = searchParams.get('tab') as TabKey;
  const validTabs: TabKey[] = ['pricing', 'account', 'appearance', 'privacy', 'ai', 'notifications'];
  const [activeTab, setActiveTab] = useState<TabKey>(
    tabQuery && validTabs.includes(tabQuery) ? tabQuery : 'pricing'
  );

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const currentTab = searchParams.get('tab') as TabKey;
    if (currentTab && validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  // Interactive Modals for Credentials
  const [modalType, setModalType] = useState<'NONE' | 'USERNAME' | 'EMAIL' | 'PHONE' | 'PASSWORD' | '2FA'>('NONE');

  // Modal Form States
  const [tempUsername, setTempUsername] = useState(
    user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : (profile.username || 'user')
  );
  const [tempEmail, setTempEmail] = useState(user?.email || profile.email || '');
  const [tempPhone, setTempPhone] = useState(profile.phoneNumber || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Appearance states
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(preferences.themeMode || 'light');
  const [accentColor, setAccentColor] = useState(preferences.accentColor || 'royal');
  const [editorTheme, setEditorTheme] = useState(preferences.editorTheme || 'vs-dark');
  const [editorFontSize, setEditorFontSize] = useState(preferences.editorFontSize || 14);
  const [editorTabSize, setEditorTabSize] = useState(preferences.editorTabSize || 2);
  const [minimapEnabled, setMinimapEnabled] = useState(preferences.minimapEnabled ?? true);
  const [wordWrap, setWordWrap] = useState(preferences.wordWrap ?? true);

  // Sync theme mode state with preferences
  useEffect(() => {
    if (preferences.themeMode) {
      setThemeMode(preferences.themeMode);
    }
  }, [preferences.themeMode]);

  // Privacy states
  const [publicProfile, setPublicProfile] = useState(profile.privacySettings?.publicProfile ?? true);
  const [showActivity, setShowActivity] = useState(profile.privacySettings?.showActivity ?? true);
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(preferences.eyeTrackingEnabled ?? true);
  const [strictProctoring, setStrictProctoring] = useState(preferences.strictProctoring ?? false);

  // AI states
  const [voiceModel, setVoiceModel] = useState(preferences.voiceModel || 'ava-uk');
  const [gradingStrictness, setGradingStrictness] = useState(preferences.gradingStrictness || 'BALANCED');
  const [socraticHintsEnabled, setSocraticHintsEnabled] = useState(preferences.socraticHintsEnabled ?? true);

  // Notification states
  const [emailStreakReminders, setEmailStreakReminders] = useState(preferences.emailStreakReminders ?? true);
  const [communityDigest, setCommunityDigest] = useState(preferences.communityDigest ?? true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Masking helpers
  const maskEmail = (emailStr: string) => {
    if (!emailStr) return 'jaswant****@gmail.com';
    const parts = emailStr.split('@');
    if (parts.length < 2) return emailStr;
    const name = parts[0];
    const visible = name.slice(0, Math.min(6, name.length));
    return `${visible}****@${parts[1]}`;
  };

  const maskPhone = (phoneStr: string) => {
    if (!phoneStr) return '+91 800****808';
    if (phoneStr.length < 6) return phoneStr;
    return `${phoneStr.slice(0, 6)}****${phoneStr.slice(-3)}`;
  };

  const handleSaveUsername = () => {
    if (!tempUsername.trim()) {
      toast.error('Candidate ID cannot be empty');
      return;
    }
    updateProfile({ username: tempUsername.trim() });
    setModalType('NONE');
    toast.success('R U Ready? ID updated successfully');
  };

  const handleSaveEmail = () => {
    if (!tempEmail.includes('@')) {
      toast.error('Please provide a valid email address');
      return;
    }
    updateProfile({ email: tempEmail.trim() });
    setModalType('NONE');
    toast.success('Account email updated successfully');
  };

  const handleSavePhone = () => {
    if (!tempPhone.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    updateProfile({ phoneNumber: tempPhone.trim() });
    setModalType('NONE');
    toast.success('Phone number updated successfully');
  };

  const handleSavePassword = () => {
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setModalType('NONE');
    toast.success('Password updated successfully');
  };

  const handleToggle2FA = () => {
    const nextState = !profile.twoFactorEnabled;
    updateProfile({ twoFactorEnabled: nextState });
    setModalType('NONE');
    if (nextState) {
      toast.success('Two-step authentication enabled');
    } else {
      toast.success('Two-step authentication disabled');
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setThemeMode(newMode);
    updatePreferences({ themeMode: newMode });

    const root = document.documentElement;
    if (newMode === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (newMode === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else if (newMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    }

    toast.success(`Theme set to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)} Mode`);
  };

  const handleSaveAppearance = () => {
    updatePreferences({
      themeMode,
      accentColor,
      editorTheme,
      editorFontSize,
      editorTabSize,
      minimapEnabled,
      wordWrap,
    });
    toast.success('Appearance & theme preferences saved');
  };

  const handleSavePrivacy = () => {
    updateProfile({
      privacySettings: {
        publicProfile,
        showActivity,
        showLeaderboard: true
      }
    });
    updatePreferences({
      eyeTrackingEnabled,
      strictProctoring
    });
    toast.success('Privacy and telemetry settings saved');
  };

  const handleSaveAi = () => {
    updatePreferences({
      voiceModel,
      gradingStrictness,
      socraticHintsEnabled
    });
    toast.success('Ava AI persona calibration saved');
  };

  const handleSaveNotifications = () => {
    updatePreferences({
      emailStreakReminders,
      communityDigest
    });
    toast.success('Notification preferences updated');
  };

  const navItems = [
    { id: 'pricing' as TabKey, label: 'Pricing & Plans', icon: CreditCard },
    { id: 'account' as TabKey, label: 'General & Security', icon: Key },
    { id: 'appearance' as TabKey, label: 'Appearance & Theme', icon: Moon },
    { id: 'privacy' as TabKey, label: 'Privacy & Telemetry', icon: Shield },
    { id: 'ai' as TabKey, label: 'AI Persona & Voice', icon: Sparkles },
    { id: 'notifications' as TabKey, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#EFFAFD] dark:bg-[#0B0F28] text-[#11183D] dark:text-[#F1F5F9] font-sans pb-16 transition-colors">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] dark:text-white tracking-tight font-display">
            Settings & Customization
          </h1>
          <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-1 font-body">
            Manage your subscription tier, theme appearance, security credentials, proctoring telemetry, and Ava AI persona calibration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Settings Menu Tabs */}
          <div className="md:col-span-4 lg:col-span-3 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl p-3 shadow-card space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7B8799] dark:text-[#94A3B8] font-mono">
              Configuration
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-3 ${
                      isActive 
                        ? 'bg-[#4A8BDF] text-white shadow-xs' 
                        : 'text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white hover:bg-[#EFFAFD] dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-[#4A8BDF]'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 mt-2 border-t border-[#DCE7F2]">
                {/* Profile Settings External Link to /profile */}
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#526078] hover:text-[#11183D]:text-white hover:bg-[#EFFAFD]:bg-white/[0.05] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <User size={16} className="text-[#4A8BDF]" />
                    <span>Candidate Profile</span>
                  </span>
                  <ExternalLink size={14} className="text-[#7B8799] group-hover:text-[#11183D]:text-white" />
                </button>
              </div>
            </nav>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* 1. PRICING & SUBSCRIPTION TAB */}
            {activeTab === 'pricing' && (
              <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-6">
                
                {/* Header & Monthly / Annual Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] dark:border-[#1E293B] pb-5">
                  <div>
                    <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white flex items-center gap-2">
                      <CreditCard size={18} className="text-[#A0006D]" />
                      <span>Subscription Plans & Pricing</span>
                    </h2>
                    <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">
                      Choose the preparation tier calibrated for your interview schedule
                    </p>
                  </div>

                  <div className="inline-flex items-center bg-[#EFFAFD] dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] p-1 rounded-2xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-[#4A8BDF] text-white shadow-xs'
                          : 'text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        billingCycle === 'annual'
                          ? 'bg-[#4A8BDF] text-white shadow-xs'
                          : 'text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-white font-mono">SAVE 20%</span>
                    </button>
                  </div>
                </div>

                {/* 3 Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Tier 1: Free Starter */}
                  <div className="p-5 rounded-3xl bg-[#EFFAFD]/60 dark:bg-[#152046]/40 border border-[#DCE7F2] dark:border-[#1E293B] flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D] dark:text-white">Free Starter</h3>
                        <Badge variant="navy" size="xs">BASIC</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-[#11183D] dark:text-white font-mono">$0</span>
                        <span className="text-xs text-[#526078] dark:text-[#94A3B8]">/ forever</span>
                      </div>
                      <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">Essential tools to test live AI mock interviews and check ATS match.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#168A62]" />
                          <span>3 AI Mock Sessions / mo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#168A62]" />
                          <span>Monaco Coding Sandbox</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#168A62]" />
                          <span>Basic ATS Keyword Scan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#168A62]" />
                          <span>Discuss Hub Read Access</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#DCE7F2] dark:bg-[#1E293B] text-[#526078] dark:text-[#94A3B8] text-center cursor-default"
                    >
                      Included
                    </button>
                  </div>

                  {/* Tier 2: Pro Candidate (Featured) */}
                  <div className="p-5 rounded-3xl bg-gradient-to-b from-white to-[#EFFAFD] dark:from-[#11183D] dark:to-[#152046] border-2 border-[#4A8BDF] shadow-lg flex flex-col justify-between space-y-5 relative">
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#A0006D] text-white text-[10px] font-bold tracking-wider font-mono">
                      MOST POPULAR
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D] dark:text-white">Pro Candidate</h3>
                        <Badge variant="teal" size="xs">ACTIVE</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#4A8BDF] font-mono">
                          {billingCycle === 'monthly' ? '$19' : '$15'}
                        </span>
                        <span className="text-xs text-[#526078] dark:text-[#94A3B8]">/ month</span>
                      </div>
                      <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">Full unlimited access to senior oral defense rubrics & gaze tracking.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <strong className="text-[#11183D] dark:text-white">Unlimited Mock Interviews</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <span>STAR & Eye Gaze Telemetry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <span>Full ATS Semantic Bullet Rewrites</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <span>1-Year Streak Heatmap History</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <span>Priority Ava Speech Models</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="royal"
                      size="md"
                      fullWidth
                      onClick={() => toast.success('Pro Candidate subscription active!')}
                    >
                      Active Plan
                    </Button>
                  </div>

                  {/* Tier 3: Team / Enterprise */}
                  <div className="p-5 rounded-3xl bg-[#EFFAFD]/60 dark:bg-[#152046]/40 border border-[#DCE7F2] dark:border-[#1E293B] flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D] dark:text-white">Team & Campus</h3>
                        <Badge variant="eggplant" size="xs">ENTERPRISE</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-[#11183D] dark:text-white font-mono">$49</span>
                        <span className="text-xs text-[#526078] dark:text-[#94A3B8]">/ seat / mo</span>
                      </div>
                      <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">For university cohorts, bootcamps, and hiring recruitment prep.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#A0006D]" />
                          <span>Everything in Pro</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#A0006D]" />
                          <span>Cohort Recruiter Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#A0006D]" />
                          <span>Custom JD Diagnostic Benchmarks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#A0006D]" />
                          <span>Dedicated Campus Roadmaps</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toast.success('Connecting with RU Ready enterprise sales...')}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#11183D] dark:bg-[#4A8BDF] text-white text-center cursor-pointer hover:bg-[#2459A8] transition-colors"
                    >
                      Contact Sales
                    </button>
                  </div>

                </div>

              </Card>
            )}

            {/* 2. GENERAL & CREDENTIALS TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-5">
                  <div>
                    <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white">General Account Credentials</h2>
                    <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">
                      You can log in using your email, phone number, or R U Ready? ID.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] divide-y divide-[#DCE7F2] dark:divide-[#1E293B] overflow-hidden shadow-xs">
                    
                    {/* Row 1: R U Ready ID */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : (profile.username || 'user'));
                        setModalType('USERNAME');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <User size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] dark:text-white shrink-0">R U Ready? ID</span>
                          <span className="text-xs text-[#526078] dark:text-[#94A3B8] truncate">
                            {user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : (profile.username || 'user')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] dark:text-[#64748B] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 2: Email */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempEmail(user?.email || profile.email || '');
                        setModalType('EMAIL');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Mail size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] dark:text-white shrink-0">Email</span>
                          <span className="text-xs text-[#526078] dark:text-[#94A3B8] truncate">
                            {maskEmail(user?.email || profile.email || '')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] dark:text-[#64748B] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 3: Phone Number */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempPhone(profile.phoneNumber || '+91 98765 43210');
                        setModalType('PHONE');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Phone size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] dark:text-white shrink-0">Phone Number</span>
                          <span className="text-xs text-[#526078] dark:text-[#94A3B8] truncate">
                            {maskPhone(profile.phoneNumber || '+91 80088 88808')}
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal size={16} className="text-[#7B8799] dark:text-[#64748B] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 4: Password */}
                    <button
                      type="button"
                      onClick={() => setModalType('PASSWORD')}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Key size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] dark:text-white shrink-0">Password</span>
                          <span className="text-xs text-[#526078] dark:text-[#94A3B8] tracking-widest">••••••••</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] dark:text-[#64748B] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                  </div>
                </Card>

                {/* Two-Step Authentication Card */}
                <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card text-center flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-[#EFFAFD] dark:bg-[#152046] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-center text-[#4A8BDF]">
                    {profile.twoFactorEnabled ? (
                      <ShieldCheck size={28} className="text-[#168A62]" />
                    ) : (
                      <Shield size={28} className="text-[#4A8BDF]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#11183D] dark:text-white font-display">
                      {profile.twoFactorEnabled ? 'Two-step authentication is on' : 'Two-step authentication is off'}
                    </h3>
                    <p className="text-xs text-[#526078] dark:text-[#94A3B8] max-w-md mx-auto mt-1">
                      {profile.twoFactorEnabled
                        ? 'Your candidate account is shielded with multi-factor verification code prompts.'
                        : "Add a second step at sign-in, so a password alone isn't enough to access your account."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalType('2FA')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      profile.twoFactorEnabled
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-100'
                        : 'bg-[#4A8BDF] hover:bg-[#2459A8] text-white'
                    }`}
                  >
                    {profile.twoFactorEnabled ? 'Turn off two-step authentication' : 'Turn on two-step authentication'}
                  </button>
                </Card>
              </div>
            )}

            {/* 3. APPEARANCE & THEME TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-6">
                  <div>
                    <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white flex items-center gap-2">
                      <Moon size={18} className="text-[#4A8BDF]" />
                      <span>Appearance & UI Theme</span>
                    </h2>
                    <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">
                      Choose your preferred interface theme mode and calibrate code editor visuals.
                    </p>
                  </div>

                  {/* Theme Mode Selection Cards */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] dark:text-white font-display">
                      Interface Theme Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          id: 'light',
                          title: 'Light Theme',
                          desc: 'Crisp SaaS pale-blue aesthetic designed for bright environments.',
                          icon: Sun,
                          previewBg: 'bg-[#EFFAFD] border-[#DCE7F2]',
                          previewCard: 'bg-white border-[#DCE7F2]',
                          previewBar: 'bg-[#4A8BDF]',
                        },
                        {
                          id: 'dark',
                          title: 'Dark Theme',
                          desc: 'Deep obsidian contrast calibrated for low-light coding sessions.',
                          icon: Moon,
                          previewBg: 'bg-[#0B0F28] border-[#1E293B]',
                          previewCard: 'bg-[#11183D] border-[#1E293B]',
                          previewBar: 'bg-[#4A8BDF]',
                        },
                        {
                          id: 'system',
                          title: 'System Default',
                          desc: 'Automatically adapts to your operating system appearance preference.',
                          icon: Laptop,
                          previewBg: 'bg-gradient-to-r from-[#EFFAFD] to-[#0B0F28] border-[#DCE7F2]',
                          previewCard: 'bg-white/90 dark:bg-[#11183D]/90 border-[#DCE7F2] dark:border-[#1E293B]',
                          previewBar: 'bg-[#4A8BDF]',
                        },
                      ].map((mode) => {
                        const isSelected = themeMode === mode.id;
                        const Icon = mode.icon;

                        return (
                          <div
                            key={mode.id}
                            onClick={() => handleThemeChange(mode.id as any)}
                            className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
                              isSelected
                                ? 'border-[#4A8BDF] bg-[#EFFAFD]/80 dark:bg-[#4A8BDF]/10 shadow-md ring-2 ring-[#4A8BDF]/20'
                                : 'border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D]/60 hover:border-[#4A8BDF]/50 hover:bg-[#EFFAFD]/30 dark:hover:bg-white/[0.03]'
                            }`}
                          >
                            {/* Miniature UI Mock Preview */}
                            <div className={`h-24 rounded-2xl p-2.5 border flex flex-col justify-between ${mode.previewBg}`}>
                              <div className="flex items-center justify-between">
                                <div className={`h-2.5 w-12 rounded-full ${mode.previewBar}`} />
                                <div className="flex gap-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />
                                </div>
                              </div>
                              <div className={`p-2 rounded-xl border flex items-center justify-between ${mode.previewCard}`}>
                                <div className="space-y-1">
                                  <div className={`h-2 w-16 rounded ${mode.previewBar}`} />
                                  <div className="h-1.5 w-10 rounded bg-slate-300 dark:bg-slate-700" />
                                </div>
                                <div className="h-4 w-4 rounded-full bg-[#168A62]/20 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-[#168A62]" />
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon size={16} className={isSelected ? 'text-[#4A8BDF]' : 'text-[#7B8799] dark:text-[#94A3B8]'} />
                                  <h4 className="text-xs font-bold font-display text-[#11183D] dark:text-white">
                                    {mode.title}
                                  </h4>
                                </div>
                                {isSelected && (
                                  <div className="h-5 w-5 rounded-full bg-[#4A8BDF] text-white flex items-center justify-center shadow-xs">
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-[#526078] dark:text-[#94A3B8] font-body mt-1">
                                {mode.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accent Color Selection */}
                  <div className="pt-3 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] dark:text-white font-display">
                      Signature Brand Accent
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'royal', label: 'Royal Blue', bgClass: 'bg-[#4A8BDF]' },
                        { id: 'eggplant', label: 'AI Magenta', bgClass: 'bg-[#A0006D]' },
                        { id: 'emerald', label: 'Emerald Algo', bgClass: 'bg-[#168A62]' },
                        { id: 'cyber', label: 'Cyber Violet', bgClass: 'bg-[#8B5CF6]' },
                      ].map((accent) => {
                        const isSelected = (accentColor || 'royal') === accent.id;
                        return (
                          <button
                            key={accent.id}
                            type="button"
                            onClick={() => setAccentColor(accent.id as any)}
                            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#4A8BDF] bg-[#EFFAFD] dark:bg-[#4A8BDF]/20 shadow-xs'
                                : 'border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D]/60 hover:bg-[#EFFAFD]/30 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className={`h-5 w-5 rounded-full ${accent.bgClass} shadow-sm shrink-0 flex items-center justify-center`}>
                              {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                            </span>
                            <span className="text-xs font-semibold text-[#11183D] dark:text-[#F1F5F9] truncate">
                              {accent.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monaco Code Editor Preferences */}
                  <div className="pt-3 space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] dark:text-white font-display flex items-center gap-2">
                      <Sliders size={14} className="text-[#4A8BDF]" />
                      <span>Monaco Code Editor Calibration</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Editor Theme */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#526078] dark:text-[#94A3B8]">
                          Editor Theme
                        </label>
                        <select
                          value={editorTheme}
                          onChange={(e) => setEditorTheme(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] text-[#11183D] dark:text-white text-xs font-sans focus:outline-none focus:border-[#4A8BDF]"
                        >
                          <option value="vs-dark">VS Dark (Default)</option>
                          <option value="vs-light">VS Light</option>
                          <option value="github-dark">GitHub Dark</option>
                          <option value="monokai">Monokai Pro</option>
                          <option value="hc-black">High Contrast</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#526078] dark:text-[#94A3B8]">
                          Font Size (px)
                        </label>
                        <select
                          value={editorFontSize}
                          onChange={(e) => setEditorFontSize(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] text-[#11183D] dark:text-white text-xs font-sans focus:outline-none focus:border-[#4A8BDF]"
                        >
                          <option value={12}>12px (Compact)</option>
                          <option value={14}>14px (Standard)</option>
                          <option value={16}>16px (Comfortable)</option>
                          <option value={18}>18px (Large)</option>
                        </select>
                      </div>

                      {/* Tab Size */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#526078] dark:text-[#94A3B8]">
                          Tab Indentation
                        </label>
                        <select
                          value={editorTabSize}
                          onChange={(e) => setEditorTabSize(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] text-[#11183D] dark:text-white text-xs font-sans focus:outline-none focus:border-[#4A8BDF]"
                        >
                          <option value={2}>2 Spaces (JavaScript/TS)</option>
                          <option value={4}>4 Spaces (Python/Java/C++)</option>
                        </select>
                      </div>
                    </div>

                    {/* Toggle row: Minimap and Word Wrap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <label className="p-3.5 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#11183D] dark:text-white block">Code Minimap</span>
                          <span className="text-[11px] text-[#526078] dark:text-[#94A3B8] block">Show outline overview scrollbar</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={minimapEnabled}
                          onChange={(e) => setMinimapEnabled(e.target.checked)}
                          className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                        />
                      </label>

                      <label className="p-3.5 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#11183D] dark:text-white block">Word Wrap</span>
                          <span className="text-[11px] text-[#526078] dark:text-[#94A3B8] block">Wrap long algorithmic lines</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={wordWrap}
                          onChange={(e) => setWordWrap(e.target.checked)}
                          className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DCE7F2] dark:border-[#1E293B] flex justify-end">
                    <Button variant="royal" size="md" onClick={handleSaveAppearance} icon={<Save size={15} />}>
                      Save Appearance Preferences
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* 4. PRIVACY & TELEMETRY TAB */}
            {activeTab === 'privacy' && (
              <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white">Privacy & Telemetry Controls</h2>
                  <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">Control public portfolio visibility and proctoring telemetry settings</p>
                </div>

                <div className="space-y-4">
                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] dark:text-white block">Public Candidate Portfolio</span>
                      <span className="text-xs text-[#526078] dark:text-[#94A3B8] block">Allow other users and recruiters to view your public consistency heatmap.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={publicProfile}
                      onChange={(e) => setPublicProfile(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] dark:text-white block">Real-time Eye Gaze Telemetry</span>
                      <span className="text-xs text-[#526078] dark:text-[#94A3B8] block">Track eye stability and head orientation feedback during oral assessments.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={eyeTrackingEnabled}
                      onChange={(e) => setEyeTrackingEnabled(e.target.checked)}
                      className="h-4 w-4 accent-[#168A62] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] dark:text-white block">Strict Tab-Deviation Alerts</span>
                      <span className="text-xs text-[#526078] dark:text-[#94A3B8] block">Triggers security deviation flags if candidate leaves the active Monaco tab.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={strictProctoring}
                      onChange={(e) => setStrictProctoring(e.target.checked)}
                      className="h-4 w-4 accent-[#168A62] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-[#DCE7F2] dark:border-[#1E293B] flex justify-end">
                  <Button variant="royal" size="md" onClick={handleSavePrivacy} icon={<Save size={15} />}>
                    Save Privacy & Telemetry
                  </Button>
                </div>
              </Card>
            )}

            {/* 5. AI PERSONA & VOICE TAB */}
            {activeTab === 'ai' && (
              <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white">Ava AI Persona & Calibration</h2>
                  <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">Customize voice synthesis, grading strictness, and Socratic hints</p>
                </div>

                {/* Voice Model */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] dark:text-white font-display">
                    AI Speech Synthesis Model
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'ava-uk', title: 'Ava (British Professional)', desc: 'Articulate pacing calibrated for senior leadership interviews.' },
                      { id: 'ava-us', title: 'Ava (US Tech Recruiter)', desc: 'Fast-paced direct questions for coding assessments.' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVoiceModel(v.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          voiceModel === v.id
                            ? 'border-[#A0006D] bg-[#F8EAF4] dark:bg-[#2A0E2E] ring-2 ring-[#A0006D]/30'
                            : 'border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] hover:bg-[#F8EAF4]/30 dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="text-xs font-bold font-display text-[#11183D] dark:text-white block">{v.title}</span>
                        <span className="text-[11px] text-[#526078] dark:text-[#94A3B8] font-body">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grading Strictness */}
                <div className="pt-2 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] dark:text-white font-display">
                    Evaluation Strictness Bar
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'ADVERSARIAL', title: 'Adversarial (FAANG)', desc: 'Strict bar testing asymptotic bounds & trade-offs.' },
                      { id: 'BALANCED', title: 'Balanced Practice', desc: 'Constructive coaching with progressive hints.' },
                      { id: 'COACHING', title: 'Supportive Mentorship', desc: 'Guided scaffolding for step-by-step learning.' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setGradingStrictness(tier.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          gradingStrictness === tier.id
                            ? 'border-[#4A8BDF] bg-[#EFFAFD] dark:bg-[#4A8BDF]/20 ring-2 ring-[#4A8BDF]/30'
                            : 'border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] hover:bg-[#EFFAFD]/50 dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="text-xs font-bold font-display text-[#11183D] dark:text-white block">{tier.title}</span>
                        <span className="text-[10px] text-[#526078] dark:text-[#94A3B8] font-body">{tier.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Socratic Protocol */}
                <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#11183D] dark:text-white font-display block">Socratic Hint Protocol</span>
                    <span className="text-[11px] text-[#526078] dark:text-[#94A3B8] font-body">Guide with conceptual STAR questions rather than giving immediate solutions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={socraticHintsEnabled}
                    onChange={(e) => setSocraticHintsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#4A8BDF]"
                  />
                </label>

                <div className="pt-4 border-t border-[#DCE7F2] dark:border-[#1E293B] flex justify-end">
                  <Button variant="royal" size="md" onClick={handleSaveAi} icon={<Save size={15} />}>
                    Save AI Calibration
                  </Button>
                </div>
              </Card>
            )}

            {/* 6. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <Card padding="lg" className="border-[#DCE7F2] dark:border-[#1E293B] bg-white dark:bg-[#11183D] shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D] dark:text-white">Notification Preferences</h2>
                  <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-0.5">Configure streak alerts, discussion replies, and security digests</p>
                </div>

                <div className="space-y-4">
                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] dark:text-white flex items-center gap-1.5">
                        <Flame size={14} className="text-orange-500 fill-orange-500" />
                        Daily Streak Preservation Alerts
                      </span>
                      <span className="text-xs text-[#526078] dark:text-[#94A3B8] block">Receive an email alert 4 hours prior to midnight if today's session is pending.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailStreakReminders}
                      onChange={(e) => setEmailStreakReminders(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 dark:bg-white/[0.02] border border-[#DCE7F2] dark:border-[#1E293B] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] dark:text-white block">Community Discuss Replies</span>
                      <span className="text-xs text-[#526078] dark:text-[#94A3B8] block">Notifications when fellow engineers comment on your interview solution threads.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={communityDigest}
                      onChange={(e) => setCommunityDigest(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-[#DCE7F2] dark:border-[#1E293B] flex justify-end">
                  <Button variant="royal" size="md" onClick={handleSaveNotifications} icon={<Save size={15} />}>
                    Save Notification Preferences
                  </Button>
                </div>
              </Card>
            )}

          </div>

        </div>

      </div>

      {/* CREDENTIALS EDIT MODALS */}
      <AnimatePresence>
        {modalType !== 'NONE' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-5 text-[#11183D] dark:text-[#F1F5F9]"
            >
              <div className="flex items-center justify-between border-b border-[#DCE7F2] dark:border-[#1E293B] pb-4">
                <h3 className="text-base font-bold font-display text-[#11183D] dark:text-white">
                  {modalType === 'USERNAME' && 'Change R U Ready? ID'}
                  {modalType === 'EMAIL' && 'Change Account Email'}
                  {modalType === 'PHONE' && 'Change Phone Number'}
                  {modalType === 'PASSWORD' && 'Update Password'}
                  {modalType === '2FA' && (profile.twoFactorEnabled ? 'Disable 2-Step Authentication' : 'Enable 2-Step Authentication')}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalType('NONE')}
                  className="p-1 rounded-lg text-[#7B8799] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* USERNAME EDIT */}
              {modalType === 'USERNAME' && (
                <div className="space-y-4">
                  <Input
                    label="R U Ready? ID / Handle"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="username"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                    <Button variant="royal" size="md" onClick={handleSaveUsername}>Save ID</Button>
                  </div>
                </div>
              )}

              {/* EMAIL EDIT */}
              {modalType === 'EMAIL' && (
                <div className="space-y-4">
                  <Input
                    label="New Email Address"
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="user@ruready.app"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                    <Button variant="royal" size="md" onClick={handleSaveEmail}>Update Email</Button>
                  </div>
                </div>
              )}

              {/* PHONE EDIT */}
              {modalType === 'PHONE' && (
                <div className="space-y-4">
                  <Input
                    label="Phone Number with Country Code"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                    <Button variant="royal" size="md" onClick={handleSavePhone}>Save Phone</Button>
                  </div>
                </div>
              )}

              {/* PASSWORD EDIT */}
              {modalType === 'PASSWORD' && (
                <div className="space-y-3">
                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                    <Button variant="royal" size="md" onClick={handleSavePassword}>Update Password</Button>
                  </div>
                </div>
              )}

              {/* 2FA TOGGLE */}
              {modalType === '2FA' && (
                <div className="space-y-4">
                  {profile.twoFactorEnabled ? (
                    <div className="space-y-3">
                      <p className="text-xs text-[#526078] dark:text-[#94A3B8]">
                        Are you sure you want to disable two-step authentication?
                      </p>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                        <Button variant="danger" size="md" onClick={handleToggle2FA}>Disable 2FA</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-[#526078] dark:text-[#94A3B8]">
                        Scan the authenticator QR code with Google Authenticator or 1Password, then enter the 6-digit code below.
                      </p>
                      <div className="h-28 rounded-2xl bg-[#EFFAFD] dark:bg-[#152046] border border-[#DCE7F2] dark:border-[#1E293B] flex flex-col items-center justify-center p-3 text-center">
                        <Smartphone size={22} className="text-[#4A8BDF] mb-1" />
                        <span className="text-[11px] font-mono text-[#526078] dark:text-[#94A3B8]">RU-READY-2FA-AUTH-SECRET</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] text-[#11183D] dark:text-white text-center font-mono text-sm tracking-widest focus:outline-none focus:border-[#4A8BDF]"
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                        <Button variant="royal" size="md" onClick={handleToggle2FA}>Activate 2FA</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
