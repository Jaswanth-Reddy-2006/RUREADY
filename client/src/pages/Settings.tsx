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

type TabKey = 'pricing' | 'account' | 'privacy' | 'ai' | 'notifications';

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { profile, preferences, updateProfile, updatePreferences } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();

  const tabQuery = searchParams.get('tab') as TabKey;
  const validTabs: TabKey[] = ['pricing', 'account', 'privacy', 'ai', 'notifications'];
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
  const [tempUsername, setTempUsername] = useState(profile.username || 'Jaswanth_Reddy_2006');
  const [tempEmail, setTempEmail] = useState(profile.email || user?.email || 'jaswanthreddy2006@gmail.com');
  const [tempPhone, setTempPhone] = useState(profile.phoneNumber || '+91 98765 43210');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

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
    { id: 'privacy' as TabKey, label: 'Privacy & Telemetry', icon: Shield },
    { id: 'ai' as TabKey, label: 'AI Persona & Voice', icon: Sparkles },
    { id: 'notifications' as TabKey, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#EFFAFD] text-[#11183D] font-sans pb-16 transition-colors">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] tracking-tight font-display">
            Settings & Customization
          </h1>
          <p className="text-xs text-[#526078] mt-1 font-body">
            Manage your subscription tier, account security credentials, proctoring telemetry, and Ava AI persona calibration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Settings Menu Tabs */}
          <div className="md:col-span-4 lg:col-span-3 bg-white border border-[#DCE7F2] rounded-3xl p-3 shadow-card space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7B8799] font-mono">
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
                        : 'text-[#526078] hover:text-[#11183D]:text-white hover:bg-[#EFFAFD]:bg-white/[0.05]'
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
              <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-6">
                
                {/* Header & Monthly / Annual Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-5">
                  <div>
                    <h2 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
                      <CreditCard size={18} className="text-[#A0006D]" />
                      <span>Subscription Plans & Pricing</span>
                    </h2>
                    <p className="text-xs text-[#526078] mt-0.5">
                      Choose the preparation tier calibrated for your interview schedule
                    </p>
                  </div>

                  <div className="inline-flex items-center bg-[#EFFAFD] border border-[#DCE7F2] p-1 rounded-2xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-[#4A8BDF] text-white shadow-xs'
                          : 'text-[#526078] hover:text-[#11183D]:text-white'
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
                          : 'text-[#526078] hover:text-[#11183D]:text-white'
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
                  <div className="p-5 rounded-3xl bg-[#EFFAFD]/60 border border-[#DCE7F2] flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D]">Free Starter</h3>
                        <Badge variant="navy" size="xs">BASIC</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-[#11183D] font-mono">$0</span>
                        <span className="text-xs text-[#526078]">/ forever</span>
                      </div>
                      <p className="text-[11px] text-[#526078]">Essential tools to test live AI mock interviews and check ATS match.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155]">
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
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#DCE7F2] text-[#526078] text-center cursor-default"
                    >
                      Included
                    </button>
                  </div>

                  {/* Tier 2: Pro Candidate (Featured) */}
                  <div className="p-5 rounded-3xl bg-gradient-to-b from-white to-[#EFFAFD] border-2 border-[#4A8BDF] shadow-lg flex flex-col justify-between space-y-5 relative">
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#A0006D] text-white text-[10px] font-bold tracking-wider font-mono">
                      MOST POPULAR
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D]">Pro Candidate</h3>
                        <Badge variant="teal" size="xs">ACTIVE</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#4A8BDF] font-mono">
                          {billingCycle === 'monthly' ? '$19' : '$15'}
                        </span>
                        <span className="text-xs text-[#526078]">/ month</span>
                      </div>
                      <p className="text-[11px] text-[#526078]">Full unlimited access to senior oral defense rubrics & gaze tracking.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155]">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-[#4A8BDF]" />
                          <strong className="text-[#11183D]">Unlimited Mock Interviews</strong>
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
                  <div className="p-5 rounded-3xl bg-[#EFFAFD]/60 border border-[#DCE7F2] flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold font-display text-[#11183D]">Team & Campus</h3>
                        <Badge variant="eggplant" size="xs">ENTERPRISE</Badge>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-[#11183D] font-mono">$49</span>
                        <span className="text-xs text-[#526078]">/ seat / mo</span>
                      </div>
                      <p className="text-[11px] text-[#526078]">For university cohorts, bootcamps, and hiring recruitment prep.</p>

                      <div className="pt-2 space-y-2 text-xs text-[#334155]">
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
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#11183D] text-white text-center cursor-pointer hover:bg-[#2459A8] transition-colors"
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
                <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-5">
                  <div>
                    <h2 className="text-base font-bold font-display text-[#11183D]">General Account Credentials</h2>
                    <p className="text-xs text-[#526078] mt-0.5">
                      You can log in using your email, phone number, or R U Ready? ID.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] divide-y divide-[#DCE7F2] overflow-hidden shadow-xs">
                    
                    {/* Row 1: R U Ready ID */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(profile.username || 'Jaswanth_Reddy_2006');
                        setModalType('USERNAME');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD]:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <User size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] shrink-0">R U Ready? ID</span>
                          <span className="text-xs text-[#526078] truncate">
                            {profile.username || 'Jaswanth_Reddy_2006'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 2: Email */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempEmail(profile.email || user?.email || 'jaswanthreddy2006@gmail.com');
                        setModalType('EMAIL');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD]:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Mail size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] shrink-0">Email</span>
                          <span className="text-xs text-[#526078] truncate">
                            {maskEmail(profile.email || user?.email || 'jaswanthreddy2006@gmail.com')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 3: Phone Number */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempPhone(profile.phoneNumber || '+91 98765 43210');
                        setModalType('PHONE');
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD]:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Phone size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] shrink-0">Phone Number</span>
                          <span className="text-xs text-[#526078] truncate">
                            {maskPhone(profile.phoneNumber || '+91 80088 88808')}
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal size={16} className="text-[#7B8799] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                    {/* Row 4: Password */}
                    <button
                      type="button"
                      onClick={() => setModalType('PASSWORD')}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#EFFAFD]:bg-white/[0.04] transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Key size={18} className="text-[#4A8BDF] shrink-0" />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="text-sm font-semibold text-[#11183D] shrink-0">Password</span>
                          <span className="text-xs text-[#526078] tracking-widest">••••••••</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#7B8799] group-hover:text-[#4A8BDF] shrink-0" />
                    </button>

                  </div>
                </Card>

                {/* Two-Step Authentication Card */}
                <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card text-center flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-[#EFFAFD] border border-[#DCE7F2] flex items-center justify-center text-[#4A8BDF]">
                    {profile.twoFactorEnabled ? (
                      <ShieldCheck size={28} className="text-[#168A62]" />
                    ) : (
                      <Shield size={28} className="text-[#4A8BDF]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#11183D] font-display">
                      {profile.twoFactorEnabled ? 'Two-step authentication is on' : 'Two-step authentication is off'}
                    </h3>
                    <p className="text-xs text-[#526078] max-w-md mx-auto mt-1">
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
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : 'bg-[#4A8BDF] hover:bg-[#2459A8] text-white'
                    }`}
                  >
                    {profile.twoFactorEnabled ? 'Turn off two-step authentication' : 'Turn on two-step authentication'}
                  </button>
                </Card>
              </div>
            )}

            {/* 3. PRIVACY & TELEMETRY TAB */}
            {activeTab === 'privacy' && (
              <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D]">Privacy & Telemetry Controls</h2>
                  <p className="text-xs text-[#526078] mt-0.5">Control public portfolio visibility and proctoring telemetry settings</p>
                </div>

                <div className="space-y-4">
                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] block">Public Candidate Portfolio</span>
                      <span className="text-xs text-[#526078] block">Allow other users and recruiters to view your public consistency heatmap.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={publicProfile}
                      onChange={(e) => setPublicProfile(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] block">Real-time Eye Gaze Telemetry</span>
                      <span className="text-xs text-[#526078] block">Track eye stability and head orientation feedback during oral assessments.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={eyeTrackingEnabled}
                      onChange={(e) => setEyeTrackingEnabled(e.target.checked)}
                      className="h-4 w-4 accent-[#168A62] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] block">Strict Tab-Deviation Alerts</span>
                      <span className="text-xs text-[#526078] block">Triggers security deviation flags if candidate leaves the active Monaco tab.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={strictProctoring}
                      onChange={(e) => setStrictProctoring(e.target.checked)}
                      className="h-4 w-4 accent-[#168A62] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-[#DCE7F2] flex justify-end">
                  <Button variant="royal" size="md" onClick={handleSavePrivacy} icon={<Save size={15} />}>
                    Save Privacy & Telemetry
                  </Button>
                </div>
              </Card>
            )}

            {/* 4. AI PERSONA & VOICE TAB */}
            {activeTab === 'ai' && (
              <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D]">Ava AI Persona & Calibration</h2>
                  <p className="text-xs text-[#526078] mt-0.5">Customize voice synthesis, grading strictness, and Socratic hints</p>
                </div>

                {/* Voice Model */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
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
                            ? 'border-[#A0006D] bg-[#F8EAF4] ring-2 ring-[#A0006D]/30'
                            : 'border-[#DCE7F2] bg-white hover:bg-[#F8EAF4]/30'
                        }`}
                      >
                        <span className="text-xs font-bold font-display text-[#11183D] block">{v.title}</span>
                        <span className="text-[11px] text-[#526078] font-body">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grading Strictness */}
                <div className="pt-2 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
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
                            ? 'border-[#4A8BDF] bg-[#EFFAFD] ring-2 ring-[#4A8BDF]/30'
                            : 'border-[#DCE7F2] bg-white hover:bg-[#EFFAFD]/50'
                        }`}
                      >
                        <span className="text-xs font-bold font-display text-[#11183D] block">{tier.title}</span>
                        <span className="text-[10px] text-[#526078] font-body">{tier.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Socratic Protocol */}
                <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#11183D] font-display block">Socratic Hint Protocol</span>
                    <span className="text-[11px] text-[#526078] font-body">Guide with conceptual STAR questions rather than giving immediate solutions.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={socraticHintsEnabled}
                    onChange={(e) => setSocraticHintsEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#4A8BDF]"
                  />
                </label>

                <div className="pt-4 border-t border-[#DCE7F2] flex justify-end">
                  <Button variant="royal" size="md" onClick={handleSaveAi} icon={<Save size={15} />}>
                    Save AI Calibration
                  </Button>
                </div>
              </Card>
            )}

            {/* 5. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-6">
                <div>
                  <h2 className="text-base font-bold font-display text-[#11183D]">Notification Preferences</h2>
                  <p className="text-xs text-[#526078] mt-0.5">Configure streak alerts, discussion replies, and security digests</p>
                </div>

                <div className="space-y-4">
                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] flex items-center gap-1.5">
                        <Flame size={14} className="text-orange-500 fill-orange-500" />
                        Daily Streak Preservation Alerts
                      </span>
                      <span className="text-xs text-[#526078] block">Receive an email alert 4 hours prior to midnight if today's session is pending.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailStreakReminders}
                      onChange={(e) => setEmailStreakReminders(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-2xl bg-[#EFFAFD]/40 border border-[#DCE7F2] flex items-center justify-between cursor-pointer">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-sm font-semibold text-[#11183D] block">Community Discuss Replies</span>
                      <span className="text-xs text-[#526078] block">Notifications when fellow engineers comment on your interview solution threads.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={communityDigest}
                      onChange={(e) => setCommunityDigest(e.target.checked)}
                      className="h-4 w-4 accent-[#4A8BDF] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-[#DCE7F2] flex justify-end">
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
              className="w-full max-w-md bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-2xl space-y-5 text-[#11183D]"
            >
              <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
                <h3 className="text-base font-bold font-display text-[#11183D]">
                  {modalType === 'USERNAME' && 'Change R U Ready? ID'}
                  {modalType === 'EMAIL' && 'Change Account Email'}
                  {modalType === 'PHONE' && 'Change Phone Number'}
                  {modalType === 'PASSWORD' && 'Update Password'}
                  {modalType === '2FA' && (profile.twoFactorEnabled ? 'Disable 2-Step Authentication' : 'Enable 2-Step Authentication')}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalType('NONE')}
                  className="p-1 rounded-lg text-[#7B8799] hover:text-[#11183D]:text-white transition-colors"
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
                      <p className="text-xs text-[#526078]">
                        Are you sure you want to disable two-step authentication?
                      </p>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" size="md" onClick={() => setModalType('NONE')}>Cancel</Button>
                        <Button variant="danger" size="md" onClick={handleToggle2FA}>Disable 2FA</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-[#526078]">
                        Scan the authenticator QR code with Google Authenticator or 1Password, then enter the 6-digit code below.
                      </p>
                      <div className="h-28 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] flex flex-col items-center justify-center p-3 text-center">
                        <Smartphone size={22} className="text-[#4A8BDF] mb-1" />
                        <span className="text-[11px] font-mono text-[#526078]">RU-READY-2FA-AUTH-SECRET</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F2] text-[#11183D] text-center font-mono text-sm tracking-widest focus:outline-none focus:border-[#4A8BDF]"
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
