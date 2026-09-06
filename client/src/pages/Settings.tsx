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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-obsidian-950 text-slate-100">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-solar-orange-500/10 border border-solar-orange-500/30 px-3 py-1 text-xs text-solar-orange-400 font-bold font-display mb-2">
          <Sliders size={12} className="text-solar-orange-400" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Settings & Credentials
        </h1>
        <p className="text-xs text-slate-400 font-body">
          Configure interview preferences, AI model persona, voice telemetry, and custom API keys.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Profile Section */}
        <div className="bg-obsidian-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-solar-orange-500/10 text-solar-orange-400 border border-solar-orange-500/20">
                <User size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-white">Candidate Profile</h2>
            </div>
            <Badge variant="orange" size="xs">Verified Account</Badge>
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
        <div className="bg-obsidian-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <Sparkles size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-white">AI Persona & Grading Calibration</h2>
            </div>
            <Badge variant="navy" size="xs">Ava v1.2</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">
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
                        ? 'border-solar-orange-500/60 bg-solar-orange-500/10 ring-1 ring-solar-orange-500/30 text-white'
                        : 'border-white/[0.08] bg-obsidian-950/60 hover:bg-obsidian-800/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display">{tier.title}</span>
                      {strictness === tier.id && <Check size={14} className="text-solar-orange-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display flex items-center justify-between">
                  <span>Voice Synthesis Volume</span>
                  <span className="text-xs font-mono font-bold text-solar-orange-400">{voiceVolume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-solar-orange-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950/60 border border-white/[0.06] space-y-1">
                <span className="text-xs font-bold text-white font-display">Socratic Hint Mode</span>
                <p className="text-[11px] text-slate-400 font-body">
                  When active, Ava guides with conceptual questions rather than giving immediate code answers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Custom Gateway & API Keys */}
        <div className="bg-obsidian-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <Key size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-white">Custom LLM Gateway (BYOK)</h2>
            </div>
            <Badge variant="teal" size="xs">Optional Override</Badge>
          </div>

          <p className="text-xs text-slate-400 font-body leading-relaxed">
            By default, RU READY? uses the hosted cloud AI model. You can optionally supply your own OpenAI-compatible endpoint.
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
        <div className="bg-obsidian-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <Shield size={16} />
              </div>
              <h2 className="text-sm font-bold font-display text-white">Privacy & Telemetry</h2>
            </div>
            <Badge variant="success" size="xs" dot>Secure</Badge>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-950/60 border border-white/[0.08]">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white font-display">Eye-Contact & Facial Stress Telemetry</p>
              <p className="text-[11px] text-slate-400 font-body">
                Processed locally in real-time on your browser canvas. No raw video is stored on disk.
              </p>
            </div>
            <input
              type="checkbox"
              checked={telemetryEnabled}
              onChange={(e) => setTelemetryEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-solar-orange-500 cursor-pointer"
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
