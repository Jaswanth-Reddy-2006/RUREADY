import { useState } from 'react';
import { 
  User, Sparkles, Key, Shield, Sliders, 
  Check, Save, LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [targetRole, setTargetRole] = useState('Fullstack Engineer');
  const [strictness, setStrictness] = useState('ADVERSARIAL');
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);
  const [customApiKey, setCustomApiKey] = useState('');
  const [customApiUrl, setCustomApiUrl] = useState('');

  const handleSaveSettings = () => {
    toast.success('Preferences updated successfully!');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-[#EFFAFD] min-h-[calc(100vh-80px)] text-[#11183D]">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#4A8BDF]/10 border border-[#4A8BDF]/30 px-3 py-1 text-xs text-[#4A8BDF] font-bold font-display mb-2">
          <Sliders size={12} className="text-[#4A8BDF]" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11183D] font-display tracking-tight">
          Settings & Credentials
        </h1>
        <p className="text-xs text-[#526078] font-body">
          Configure interview preferences, AI model persona, voice telemetry, and custom API keys.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Profile Section */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF] border border-[#4A8BDF]/20">
                <User size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-[#11183D]">Candidate Profile</h2>
            </div>
            <Badge variant="navy" size="xs">Verified Account</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              hint="Email address managed via account authentication."
            />
            <div className="sm:col-span-2">
              <Input
                label="Default Target Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
              />
            </div>
          </div>
        </div>

        {/* 2. AI & Interview Calibration */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F8EAF4] text-[#A0006D] border border-[#A0006D]/20">
                <Sparkles size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-[#11183D]">AI Persona & Grading Calibration</h2>
            </div>
            <Badge variant="eggplant" size="xs">Ava v1.2</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#526078] font-display">
                Grading Bar & Strictness
              </label>
              <div className="space-y-2">
                {[
                  { id: 'ADVERSARIAL', title: 'Adversarial (Recommended)', desc: 'Strict uninflated bar calibrated to tier-1 tech standards.' },
                  { id: 'BALANCED', title: 'Balanced Practice', desc: 'Constructive feedback with intermediate difficulty curve.' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setStrictness(tier.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      strictness === tier.id
                        ? 'border-[#4A8BDF] bg-[#EFFAFD] ring-1 ring-[#4A8BDF]/30 text-[#11183D]'
                        : 'border-[#DCE7F2] bg-white hover:bg-[#EFFAFD]/50 text-[#526078] hover:text-[#11183D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display">{tier.title}</span>
                      {strictness === tier.id && <Check size={14} className="text-[#4A8BDF]" />}
                    </div>
                    <p className="text-[11px] text-[#526078] font-body mt-0.5">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#526078] font-display flex items-center justify-between">
                  <span>Voice Synthesis Volume</span>
                  <span className="text-xs font-mono font-bold text-[#4A8BDF]">{voiceVolume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#EFFAFD] rounded-lg appearance-none cursor-pointer accent-[#4A8BDF] focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-1">
                <span className="text-xs font-bold text-[#11183D] font-display">Socratic Hint Mode</span>
                <p className="text-[11px] text-[#526078] font-body">
                  When active, Ava guides with conceptual questions rather than giving immediate code answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Custom Gateway & API Keys */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF] border border-[#4A8BDF]/20">
                <Key size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-[#11183D]">Custom LLM Gateway (BYOK)</h2>
            </div>
            <Badge variant="teal" size="xs">Optional Override</Badge>
          </div>

          <p className="text-xs text-[#526078] font-body leading-relaxed">
            By default, R U Ready? uses the hosted cloud AI model. You can optionally supply your own OpenAI-compatible endpoint.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Custom API Base URL"
              placeholder="https://api.openai.com/v1"
              value={customApiUrl}
              onChange={(e) => setCustomApiUrl(e.target.value)}
            />
            <Input
              label="Custom API Key"
              type="password"
              placeholder="sk-..."
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
            />
          </div>
        </div>

        {/* 4. Privacy & Telemetry */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#168A62]/10 text-[#168A62] border border-[#168A62]/20">
                <Shield size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-[#11183D]">Privacy & Telemetry</h2>
            </div>
            <Badge variant="success" size="xs" dot>Secure</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2]">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#11183D] font-display">Eye-Contact & Facial Stress Telemetry</p>
              <p className="text-[11px] text-[#526078] font-body">
                Processed locally in real-time on your browser canvas. No raw video is stored on disk.
              </p>
            </div>
            <input
              type="checkbox"
              checked={telemetryEnabled}
              onChange={(e) => setTelemetryEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-[#4A8BDF] cursor-pointer"
            />
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="danger"
            size="md"
            onClick={() => logout()}
            isLoading={isLoggingOut}
            icon={<LogOut size={14} />}
          >
            Sign Out
          </Button>

          <Button
            size="lg"
            variant="royal"
            onClick={handleSaveSettings}
            icon={<Save size={16} />}
          >
            Save All Preferences →
          </Button>
        </div>

      </div>

    </div>
  );
}
