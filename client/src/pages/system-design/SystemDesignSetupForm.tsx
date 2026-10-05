import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  Play,
  Clock,
  Target,
  Plus,
  Zap,
  ShieldCheck,
  ChevronLeft,
  Camera,
  Mic,
  Volume2,
  ArrowRight,
  Search,
  Check,
  Maximize,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  Network,
  Globe,
  HardDrive,
  Radio,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { systemDesignApi } from '../../api/systemDesign';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

const POPULAR_ROLES = [
  'Software Engineer',
  'Senior Software Engineer (SDE-2)',
  'Staff Systems Architect',
  'Backend Architect',
  'Full Stack Engineer',
  'Distributed Systems Lead',
  'Cloud Infrastructure Architect',
  'Data Platform Engineer',
];

const ARCHITECTURE_DOMAINS = [
  {
    id: 'STORAGE',
    title: 'Distributed Storage & Caching',
    desc: 'Consistent Hashing, LRU Eviction, Replication, Partitioning & CAP Theorem.',
    icon: HardDrive,
    badge: 'Core Infra',
  },
  {
    id: 'REAL_TIME',
    title: 'Real-time & Streaming Systems',
    desc: 'WebSockets, Pub/Sub Event Queues, Message Brokers, Live Notification Pipelines.',
    icon: Radio,
    badge: 'High Throughput',
  },
  {
    id: 'FINTECH',
    title: 'Financial & Transactional Systems',
    desc: 'Idempotency Keys, 2-Phase Commit, Distributed Locking, ACID Guarantees.',
    icon: Database,
    badge: 'Mission Critical',
  },
  {
    id: 'WEB_SCALE',
    title: 'High-Scale Web Services',
    desc: 'URL Shortener, Rate Limiters, Global CDN, Geo-DNS & Load Balancing.',
    icon: Globe,
    badge: 'FAANG Standard',
  },
];

export default function SystemDesignSetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createAndLoadSession } = useSystemDesignStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const initialRole = searchParams.get('role') || 'Senior Software Engineer (SDE-2)';
  const initialDomain = searchParams.get('domain') || 'STORAGE';

  // Wizard Step: 1 = Prepare, 2 = Check (Review), 3 = Allow (Device Check), 4 = Hello / Launch
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form State
  const [targetRole, setTargetRole] = useState<string>(initialRole);
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [durationMins, setDurationMins] = useState<number>(45);
  const [simulationMode, setSimulationMode] = useState<'PRACTICE' | 'REALISTIC' | 'CHALLENGE'>('REALISTIC');

  // Loading & session state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);

  // Device Check States (Step 3)
  const [cameraStatus, setCameraStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [micStatus, setMicStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [audioStatus, setAudioStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [fullscreenStatus, setFullscreenStatus] = useState<'IDLE' | 'PASS'>('IDLE');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState<boolean>(false);

  const filteredRoles = POPULAR_ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  // Hardware Initialization for Step 3
  useEffect(() => {
    if (wizardStep !== 3) {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
      return;
    }

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animFrame: number | null = null;

    async function initMedia() {
      setCameraStatus('TESTING');
      setMicStatus('TESTING');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        setMediaStream(stream);
        setCameraStatus('PASS');
        setMicStatus('PASS');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContext = new AudioContextClass();
          const source = audioContext.createMediaStreamSource(stream);
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
            animFrame = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.error('Failed to access camera/mic:', err);
        setCameraStatus('FAIL');
        setMicStatus('FAIL');
      }
    }

    initMedia();

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (audioContext) {
        try { audioContext.close(); } catch {}
      }
    };
  }, [wizardStep]);

  const handleTestAudioPlayback = () => {
    setIsPlayingAudioTest(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setTimeout(() => {
        setIsPlayingAudioTest(false);
        setAudioStatus('PASS');
      }, 1300);
    } catch {
      setIsPlayingAudioTest(false);
      setAudioStatus('FAIL');
    }
  };

  const handleRequestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setFullscreenStatus('PASS');
    } catch {
      setFullscreenStatus('PASS');
    }
  };

  const handleProceedToLaunch = async () => {
    setIsSubmitting(true);
    try {
      const probs = await systemDesignApi.getProblems();
      const targetProb = probs.find((p) => p.category === selectedDomain) || probs[0] || { id: 'tinyurl' };
      const sessionId = await createAndLoadSession(targetProb.id);
      setCreatedSessionId(sessionId);
      setWizardStep(4);
    } catch (err) {
      console.warn('System design session launch fallback:', err);
      const fallbackId = `sd-${Date.now()}`;
      setCreatedSessionId(fallbackId);
      setWizardStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartStudio = () => {
    const targetId = createdSessionId || `sd-${Date.now()}`;
    navigate(`/system-design/studio/${targetId}`);
  };

  const selectedDomainObj = ARCHITECTURE_DOMAINS.find((d) => d.id === selectedDomain) || ARCHITECTURE_DOMAINS[0];

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (wizardStep > 1) {
                setWizardStep(wizardStep - 1);
              } else {
                navigate('/system-design');
              }
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>{wizardStep === 1 ? 'Back to Command Center' : 'Previous Step'}</span>
          </button>

          {/* Stepper Progress */}
          <div className="flex items-center gap-3">
            {[
              { num: 1, label: 'Prepare' },
              { num: 2, label: 'Review' },
              { num: 3, label: 'Pre-Flight Check' },
              { num: 4, label: 'Launch' },
            ].map((step) => {
              const isActive = wizardStep === step.num;
              const isPast = wizardStep > step.num;

              return (
                <div key={step.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check size={12} strokeWidth={3} /> : step.num}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline font-bold ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.num < 4 && <div className="w-3 h-0.5 bg-slate-200 ml-1 hidden sm:block" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STEP 1: CONFIGURE (PREPARE) ─── */}
        {wizardStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Sparkles size={13} />
                <span>AI System Design Studio Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
                Customize Your System Design Round
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose your target engineering seniority and architecture domain to initialize the interactive whiteboard canvas.
              </p>
            </div>

            {/* 1. Target Seniority / Role */}
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Briefcase size={16} className="text-blue-600" />
                  <span>1. Target Engineering Role & Level</span>
                </div>
                <p className="text-xs text-slate-500">
                  Select your seniority level to adjust Socratic depth, SPOF detection, and rubric scoring.
                </p>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role / seniority..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredRoles.map((role) => {
                  const isSelected = targetRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 2. Architecture Domain */}
            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Network size={16} className="text-purple-600" />
                  <span>2. Architecture Domain</span>
                </div>
                <p className="text-xs text-slate-500">
                  Select the system architecture domain you want to design and defend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ARCHITECTURE_DOMAINS.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = selectedDomain === domain.id;

                  return (
                    <div
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {domain.badge}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{domain.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{domain.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 3. Duration & Strictness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Clock size={16} className="text-blue-600" />
                    <span>3. Session Duration</span>
                  </div>
                  <p className="text-xs text-slate-500">Design whiteboard time limit.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMins(mins)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        durationMins === mins
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>4. Simulation Strictness</span>
                  </div>
                  <p className="text-xs text-slate-500">AI probing frequency & hint mode.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PRACTICE', label: 'Learning', sub: 'Hints enabled' },
                    { id: 'REALISTIC', label: 'Realistic', sub: 'FAANG strict' },
                    { id: 'CHALLENGE', label: 'Hardcore', sub: 'Staff level' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSimulationMode(mode.id as any)}
                      className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                        simulationMode === mode.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-bold block">{mode.label}</span>
                      <span className={`text-[10px] block opacity-80 ${
                        simulationMode === mode.id ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {mode.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setWizardStep(2)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Review & Confirm Plan</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: REVIEW ─── */}
        {wizardStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>Architecture Blueprint</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
                Review Your System Design Plan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Verify your chosen architecture domain and duration before device check.
              </p>
            </div>

            <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-6 divide-y divide-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Seniority</span>
                  <p className="text-base font-black text-slate-900">{targetRole}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Architecture Domain</span>
                  <p className="text-base font-black text-slate-900">{selectedDomainObj.title}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Whiteboard Duration</span>
                  <p className="text-base font-black text-slate-900">{durationMins} Minutes Timed</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Simulation Strictness</span>
                  <p className="text-base font-black text-slate-900">
                    {simulationMode === 'PRACTICE' ? 'Learning Mode (Hints Allowed)' : simulationMode === 'REALISTIC' ? 'Realistic FAANG Standard' : 'Hardcore Staff Level'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                onClick={() => setWizardStep(1)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-6 py-3 rounded-full"
              >
                Back to Edit
              </Button>

              <Button
                onClick={() => setWizardStep(3)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Pre-Flight Check</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: DEVICE CHECK ─── */}
        {wizardStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <ShieldCheck size={13} />
                <span>Device Verification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
                Pre-Flight Hardware Check
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Verify your camera, microphone, and audio to interact with your Socratic AI Architect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-6 p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Camera size={16} className="text-blue-600" />
                    <span>Live Video Feed</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cameraStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cameraStatus === 'PASS' ? 'Camera Connected' : 'Checking...'}
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Mic size={14} className="text-purple-600" />
                      <span>Microphone Level</span>
                    </span>
                    <span className="font-mono text-slate-900">{micVolume}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-100"
                      style={{ width: `${micVolume}%` }}
                    />
                  </div>
                </div>
              </Card>

              <div className="md:col-span-6 space-y-4">
                <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Volume2 size={16} className="text-amber-600" />
                      <span>Speaker / Audio Output</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      audioStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {audioStatus === 'PASS' ? 'Audio Verified' : 'Untested'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Test your audio output to ensure you can hear the AI Architect's questions.
                  </p>

                  <Button
                    type="button"
                    onClick={handleTestAudioPlayback}
                    disabled={isPlayingAudioTest}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Volume2 size={14} />
                    <span>{isPlayingAudioTest ? 'Playing Test Sound...' : 'Play Test Tone'}</span>
                  </Button>
                </Card>

                <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Maximize size={16} className="text-indigo-600" />
                      <span>Fullscreen Whiteboard Canvas</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      fullscreenStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {fullscreenStatus === 'PASS' ? 'Fullscreen Ready' : 'Optional'}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleRequestFullscreen}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-200"
                  >
                    <Maximize size={14} />
                    <span>Enable Fullscreen Mode</span>
                  </Button>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                onClick={() => setWizardStep(2)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-6 py-3 rounded-full"
              >
                Back to Review
              </Button>

              <Button
                onClick={handleProceedToLaunch}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Booting Studio Canvas...' : 'Proceed to Launch Canvas'}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 4: LAUNCH (HELLO) ─── */}
        {wizardStep === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs text-center space-y-6 max-w-2xl mx-auto">
              
              <div className="relative w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-lg shadow-blue-500/25">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src="/images/male_interviewer_3d.jpg"
                    alt="AI Architect"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-display tracking-tight">
                  Your AI Architect is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Design your architecture graph on the canvas, calculate capacity, and defend your design decisions.
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Domain:</span>
                  <span className="text-blue-700">{selectedDomainObj.title}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Level:</span>
                  <span className="text-slate-900">{targetRole}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Time Limit:</span>
                  <span className="font-mono text-slate-900">{durationMins} Minutes</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleStartStudio}
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Enter System Design Studio</span>
                </Button>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
