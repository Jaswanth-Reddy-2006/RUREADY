import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  Clock,
  Code2,
  Terminal,
  Target,
  Plus,
  ShieldCheck,
  ChevronLeft,
  Camera,
  Mic,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Lock,
  Maximize,
  Layers,
  Database,
  Cpu,
  Building2,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';
import { findEnglishBrowserVoice } from '../../lib/speech';

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'AI / ML Engineer',
  'Data Engineer',
  'DevOps / SRE',
  'Mobile Developer',
  'Systems Software Engineer',
  'Cloud Software Engineer',
  'QA / Automation Engineer',
];

const POPULAR_COMPANIES = [
  'None / General Target',
  'Amazon',
  'Google',
  'Microsoft',
  'Meta',
  'Apple',
  'Uber',
  'Netflix',
  'Oracle',
  'Salesforce',
  'TCS',
  'Infosys',
  'Accenture',
  'Flipkart',
  'Atlassian',
  'Custom Company',
];

const CODING_PRACTICE_TRACKS = [
  {
    id: 'DSA',
    title: 'Data Structures & Algorithms (DSA)',
    desc: 'Arrays, Two Pointers, Trees, Graphs, Dynamic Programming & Asymptotic Complexity.',
    icon: Code2,
    badge: 'Popular',
  },
  {
    id: 'MachineCoding',
    title: 'Machine Coding & Low-Level Design (LLD)',
    desc: 'Clean Architecture, In-Memory Caching, Rate Limiters, Event Emitters & Object-Oriented Systems.',
    icon: Layers,
    badge: 'FAANG / Tier-1',
  },
  {
    id: 'SQL',
    title: 'SQL & Database Query Internals',
    desc: 'Complex Multi-Table JOINs, Window Functions, Indexing Strategy & Schema Optimizations.',
    icon: Database,
    badge: 'Data & Backend',
  },
  {
    id: 'Frontend',
    title: 'Frontend Architecture & JavaScript',
    desc: 'Async Concurrent Task Queues, Deep Cloning, Custom Hooks, DOM Engines & Event Loop.',
    icon: Cpu,
    badge: 'UI & Systems',
  },
  {
    id: 'Backend',
    title: 'Backend & Distributed Primitives',
    desc: 'Thread-Safe LRU Cache, Consistent Hashing Ring, Concurrency Locks & Circuit Breakers.',
    icon: Terminal,
    badge: 'High Scale',
  },
];

const PREDEFINED_ALGORITHMS = [
  'Two Pointers',
  'Sliding Window',
  'Dynamic Programming',
  'Binary Trees & BST',
  'Graphs & BFS/DFS',
  'Binary Search',
  'Heaps & Priority Queues',
  'Trie / Prefix Trees',
  'In-Memory Key-Value Store',
  'Token Bucket Rate Limiting',
  'Async Task Queue',
  'Consistent Hashing',
  'SQL Window Functions',
  'Indexing & Query Optimization',
];

export default function CodingSetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const micVerifiedRef = useRef<boolean>(false);

  const initialFocus = searchParams.get('focus') || '';
  const initialRole = searchParams.get('role') || '';

  // 3-Step Wizard: 1 = Config, 2 = Review, 3 = Pre-Check
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form Configuration State
  const [targetRole, setTargetRole] = useState<string>(initialRole);
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');

  const [targetCompany, setTargetCompany] = useState<string>('None / General Target');
  const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);
  const [customCompanyInput, setCustomCompanyInput] = useState<string>('');

  const [selectedTrack, setSelectedTrack] = useState<string>(initialFocus);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [customAlgoInput, setCustomAlgoInput] = useState<string>('');
  const [durationMins, setDurationMins] = useState<number>(0);
  const [simulationMode, setSimulationMode] = useState<'PRACTICE' | 'REALISTIC' | 'CHALLENGE'>('REALISTIC');
  const [hasAttemptedStep1, setHasAttemptedStep1] = useState<boolean>(false);

  // Loading & Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  // Step 3: Hardware Verification States (Exact parity with OralPreCheckPage)
  const [camStatus, setCamStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready'>('idle');
  const [audioVoicePlaying, setAudioVoicePlaying] = useState<boolean>(false);
  const [audioVoiceHeard, setAudioVoiceHeard] = useState<boolean>(false);
  const [fullscreenStatus, setFullscreenStatus] = useState<'idle' | 'ready'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [agreedToIntegrityRules, setAgreedToIntegrityRules] = useState<boolean>(false);

  // Filtered roles
  const filteredRoles = POPULAR_ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const toggleAlgorithm = (algo: string) => {
    setSelectedAlgorithms((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo]
    );
  };

  const handleProceedToReview = () => {
    setHasAttemptedStep1(true);
    const effRole = isCustomRole ? customRoleInput.trim() : targetRole.trim();
    if (!effRole) {
      toast.error('Please select or specify a Target Engineering Role.');
      return;
    }
    if (!selectedTrack) {
      toast.error('Please select a Coding Practice Track.');
      return;
    }
    if (!durationMins || durationMins === 0) {
      toast.error('Please select an Interview Duration.');
      return;
    }
    setWizardStep(2);
  };

  const handleAddCustomAlgo = () => {
    const trimmed = customAlgoInput.trim();
    if (trimmed && !selectedAlgorithms.includes(trimmed)) {
      setSelectedAlgorithms((prev) => [...prev, trimmed]);
      setCustomAlgoInput('');
    }
  };

  // Fullscreen Listener for Step 3
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setFullscreenStatus('ready');
      } else {
        setFullscreenStatus('idle');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Cleanup active media streams & speech on unmount or step change
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [wizardStep]);

  // Hardware Checks (Camera)
  const testCamera = async () => {
    if (camStatus === 'ready' && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCamStatus('idle');
      return;
    }

    setCamStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setCamStatus('idle');
          if (videoRef.current) videoRef.current.srcObject = null;
          mediaStreamRef.current = null;
        };
        videoTrack.onmute = () => setCamStatus('idle');
        videoTrack.onunmute = () => setCamStatus('ready');
      }

      setCamStatus('ready');
    } catch (e) {
      console.warn('Camera stream error:', e);
      toast.error('Unable to access camera. Please check browser permissions.');
      setCamStatus('idle');
    }
  };

  // Hardware Checks (Microphone & Spoken Sentence Test)
  const testMic = async () => {
    if (micStatus === 'ready') return;
    micVerifiedRef.current = false;
    setMicStatus('testing');
    setSpokenTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
          sum += array[i];
        }
        const avg = sum / array.length;
        setMicVolume(Math.min(100, Math.round(avg * 2)));
      };

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.onended = () => {
          setMicStatus('idle');
          setMicVolume(0);
        };
        audioTrack.onmute = () => {
          setMicStatus('idle');
          setMicVolume(0);
        };
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error('Speech recognition not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0]?.transcript || '';
        }
        const clean = transcript.trim();
        setSpokenTranscript(clean);

        const lower = clean.toLowerCase();
        const matchesTarget =
          lower.includes('ready to start') ||
          lower.includes('start my mock') ||
          lower.includes('ready to start my mock interview') ||
          lower.includes('ready to take my mock interview') ||
          lower.includes('ready to take the ai mock interview') ||
          lower.includes('ready to start the mock interview') ||
          lower.includes('ready to start coding') ||
          lower.includes('start coding interview');

        if (matchesTarget) {
          if (micVerifiedRef.current) return;
          micVerifiedRef.current = true;
          setMicStatus('ready');
          toast.success('Microphone & speech phrase verified successfully!');
          try {
            rec.stop();
          } catch {}
          try {
            rec.abort();
          } catch {}
        }
      };

      rec.onerror = (e: any) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('Speech recognition test error:', e);
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (e) {
      console.warn('Mic stream error:', e);
      toast.error('Unable to access microphone. Please check browser permissions.');
      setMicStatus('idle');
      setMicVolume(0);
    }
  };

  // Hardware Checks (Speaker & Tone Playback)
  const testAudio = () => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setAudioVoicePlaying(true);
      const text =
        "Hello! This is Ava, your AI interview coach. If you can hear my voice clearly, please click the confirmation button below.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Play audio chime
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 580;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {}

      utterance.onend = () => {
        setAudioVoicePlaying(false);
        setAudioVoiceHeard(true);
      };
      utterance.onerror = () => {
        setAudioVoicePlaying(false);
        setAudioVoiceHeard(true);
      };

      const preferredVoice = findEnglishBrowserVoice();
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
      setAudioVoiceHeard(true);
    } catch (err) {
      console.warn('Audio test error:', err);
      setAudioVoicePlaying(false);
      setAudioVoiceHeard(true);
    }
  };

  // Fullscreen Request
  const requestFullscreenPermission = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        }
      }
      setFullscreenStatus('ready');
    } catch (e) {
      console.warn('Fullscreen request error:', e);
      toast.error('Fullscreen request was denied or blocked by browser.');
      setFullscreenStatus('idle');
    }
  };

  // Strict All-Checks Pass Condition
  const isAllVerifiedAndAgreed =
    camStatus === 'ready' &&
    micStatus === 'ready' &&
    audioStatus === 'ready' &&
    fullscreenStatus === 'ready' &&
    agreedToIntegrityRules;

  const finalDisplayRole = isCustomRole && customRoleInput ? customRoleInput : targetRole;
  const finalDisplayCompany = isCustomCompany && customCompanyInput ? customCompanyInput : targetCompany;

  // Final Launch Action directly into live coding room
  const handleStartCodingSession = async () => {
    setIsSubmitting(true);
    setPrepMessage('Configuring secure IDE container with proctoring parameters...');

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {}

    try {
      const cleanCompany = finalDisplayCompany === 'None / General Target' ? undefined : finalDisplayCompany;
      const response = await apiClient.post('/interview/coding/session', {
        targetRole: finalDisplayRole,
        targetCompany: cleanCompany,
        track: selectedTrack,
        focusAreas: selectedAlgorithms.length > 0 ? selectedAlgorithms : [selectedTrack],
        durationMins,
        simulationMode,
        difficulty: simulationMode === 'CHALLENGE' ? 'HARD' : 'MEDIUM',
      });

      const newSession = response.data?.session || response.data;
      const sessionId = newSession?.id || `coding-${Date.now()}`;
      navigate(`/coding/${sessionId}`);
    } catch (err) {
      console.error('Failed to create coding interview session:', err);
      setIsSubmitting(false);
      setPrepMessage('Unable to create a coding session. Check the API services and try again.');
      toast.error('Coding session could not be created.');
    }
  };

  const selectedTrackObj =
    CODING_PRACTICE_TRACKS.find((t) => t.id === selectedTrack) || CODING_PRACTICE_TRACKS[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* TOP BRAND & STEP NAVIGATOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (wizardStep === 1) {
                  navigate('/coding');
                } else {
                  setWizardStep(wizardStep - 1);
                }
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Coding Mock Interview Setup</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                  AI
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {wizardStep === 1
                  ? 'Step 1 of 3: Configure Assessment'
                  : wizardStep === 2
                  ? 'Step 2 of 3: Summary Review & Readiness Check'
                  : 'Step 3 of 3: Allow Permissions & Launch'}
              </p>
            </div>
          </div>

          {/* 3 Step Pill Indicators (Matching OralReviewPage / OralPreCheckPage) */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                wizardStep === 1
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${wizardStep === 1 ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
              <span>1. Config</span>
            </button>

            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                wizardStep === 2
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : wizardStep > 2
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${wizardStep === 2 ? 'bg-white animate-pulse' : wizardStep > 2 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>2. Review</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (wizardStep >= 2) setWizardStep(3);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                wizardStep === 3
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${wizardStep === 3 ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              <span>3. Pre-Check</span>
            </button>
          </div>
        </div>

        {/* ─── STEP 1: CONFIGURE ASSESSMENT ─── */}
        {wizardStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Sparkles size={13} />
                <span>AI Coding Assessment Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-display">
                Customize Your Coding Session
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose your target engineering role, company, and practice track. You can write your solution in JavaScript, TypeScript, Python, Java, C++, or Go inside the room.
              </p>
            </div>

            {/* 1. Target Engineering Role */}
            <Card className="p-6 bg-white border-slate-200/90 shadow-xs rounded-3xl space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Briefcase size={16} className="text-blue-600" />
                  <span>1. Target Engineering Role</span>
                </div>
                <p className="text-xs text-slate-500">
                  Select the role you are targeting to tailor the algorithmic complexity and discussion.
                </p>
              </div>

              {/* Role Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role (e.g. Frontend, Backend, AI/ML, Full Stack)..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Role Badges */}
              <div className="flex flex-wrap gap-2">
                {filteredRoles.map((role) => {
                  const isSelected = !isCustomRole && targetRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setIsCustomRole(false);
                        setTargetRole(role);
                      }}
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

              {/* Custom Role Input */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomRole((prev) => !prev)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>{isCustomRole ? 'Choose from predefined roles' : 'Specify custom job role'}</span>
                </button>
                {isCustomRole && (
                  <input
                    type="text"
                    placeholder="Enter custom role (e.g. Distributed Systems Engineer)..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                )}
              </div>
            </Card>

            {/* 2. Practice Domain / Track */}
            <Card className="p-6 bg-white border-slate-200/90 shadow-xs rounded-3xl space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Code2 size={16} className="text-purple-600" />
                  <span>3. Practice Track & Problem Domain</span>
                </div>
                <p className="text-xs text-slate-500">
                  What would you like to practice in this session?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {CODING_PRACTICE_TRACKS.map((track) => {
                  const Icon = track.icon;
                  const isSelected = selectedTrack === track.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedTrack(track.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {track.badge}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{track.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{track.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 4. Optional Specific Topics */}
            <Card className="p-6 bg-white border-slate-200/90 shadow-xs rounded-3xl space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Target size={16} className="text-amber-600" />
                  <span>4. Specific Topics / Algorithms (Optional)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Select specific algorithms or topics you want Ava to emphasize during the session.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PREDEFINED_ALGORITHMS.map((algo) => {
                  const isSelected = selectedAlgorithms.includes(algo);
                  return (
                    <button
                      key={algo}
                      type="button"
                      onClick={() => toggleAlgorithm(algo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? `✓ ${algo}` : algo}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom topic (e.g. Radix Sort, Segment Tree, Redux Thunk)..."
                  value={customAlgoInput}
                  onChange={(e) => setCustomAlgoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAlgo())}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomAlgo}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
            </Card>

            {/* 5. Duration & Simulation Strictness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-white border-slate-200/90 shadow-xs rounded-3xl space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Clock size={16} className="text-blue-600" />
                    <span>5. Session Duration</span>
                  </div>
                  <p className="text-xs text-slate-500">Set total interview time limit.</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
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

              <Card className="p-6 bg-white border-slate-200/90 shadow-xs rounded-3xl space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>6. Simulation Strictness</span>
                  </div>
                  <p className="text-xs text-slate-500">AI hint allowance and timer behavior.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PRACTICE', label: 'Learning', sub: 'Hints allowed' },
                    { id: 'REALISTIC', label: 'Realistic', sub: 'FAANG level' },
                    { id: 'CHALLENGE', label: 'Hardcore', sub: 'Strict & timed' },
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
                      <span
                        className={`text-[10px] block opacity-80 ${
                          simulationMode === mode.id ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {mode.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bottom Proceed Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setWizardStep(2)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Review Plan</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: SUMMARY REVIEW CARD (Parity with OralReviewPage) ─── */}
        {wizardStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200/90 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Selected Interview Configuration Details
              </span>
              <Badge className="bg-blue-50 text-blue-700 font-mono text-xs border-blue-200">
                Step 2 of 3: Summary Review
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Practice Track</span>
                <strong className="text-sm font-bold text-slate-900 block">{selectedTrackObj.title}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Target Engineering Role</span>
                <strong className="text-sm font-bold text-slate-900 block">{finalDisplayRole}</strong>
              </div>

              

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Simulation Mode</span>
                <strong className="text-sm font-bold text-slate-900 block">
                  {simulationMode === 'PRACTICE'
                    ? 'Learning Mode (Hints Allowed)'
                    : simulationMode === 'REALISTIC'
                    ? 'Realistic FAANG Standard'
                    : 'Hardcore Timed Challenge'}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Session Duration</span>
                <strong className="text-sm font-bold text-slate-900 block">{durationMins} Minutes Timed</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">IDE Multi-Language</span>
                <strong className="text-sm font-bold text-slate-900 block">JS, TS, Python, Java, C++, Go</strong>
              </div>
            </div>

            {selectedAlgorithms.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">Specific Topics Selected:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedAlgorithms.map((algo) => (
                    <Badge key={algo} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                      {algo}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
              <Code2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Monaco Assessment Sandbox:</strong> During the interview, you will have access to syntax highlighting, auto-completion, and sandboxed test execution. You can toggle between White and Dark themes directly inside the room.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={() => setWizardStep(1)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Configuration</span>
              </Button>

              <Button
                onClick={() => setWizardStep(3)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Proceed to Pre-Flight Check</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: PRE-FLIGHT CHECK (Exact Parity with OralPreCheckPage) ─── */}
        {wizardStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200/90 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Device Permissions & Integrity Verification
              </span>
              <Badge className="bg-blue-50 text-blue-700 font-mono text-xs border-blue-200">
                Step 3 of 3: Allow & Launch
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Complete permissions check for your Camera, Microphone, Speaker, and Full-Screen Mode before launching the proctored interview.
            </p>

            {/* 4 Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1: Camera & Candidate Check */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 space-y-3.5 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">1. Camera & Candidate Check</span>
                  </div>
                  <Badge
                    className={
                      camStatus === 'ready'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  >
                    {camStatus === 'ready' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Candidate Verified
                      </span>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>

                <div className="w-full aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover transform scale-x-[-1] ${camStatus === 'ready' ? 'block' : 'hidden'}`}
                    muted
                    playsInline
                  />
                  {camStatus !== 'ready' && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-[11px] text-slate-400 text-center font-medium max-w-[260px] leading-relaxed">
                        Allow camera access to display mirrored video stream & verify candidate presence
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={testCamera}
                  className={`w-full text-xs py-3 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                    camStatus === 'ready'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {camStatus === 'ready' ? (
                    <>
                      <Check className="w-4 h-4" /> Camera Active (Click to Turn Off)
                    </>
                  ) : camStatus === 'testing' ? (
                    'Testing Camera...'
                  ) : (
                    <>
                      <Camera className="w-4 h-4" /> Allow Camera & Check Candidate
                    </>
                  )}
                </Button>
              </div>

              {/* Card 2: Microphone & Speech Sentence Test */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 space-y-3.5 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900">2. Microphone & Speech Check</span>
                  </div>
                  <Badge
                    className={
                      micStatus === 'ready'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  >
                    {micStatus === 'ready' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Speech Verified
                      </span>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
                  <span className="text-[10px] font-bold text-purple-900 block uppercase tracking-wider">
                    Read Out Loud to Verify Mic:
                  </span>
                  <p className="text-xs italic text-purple-950 font-serif leading-relaxed font-semibold">
                    "Hi, I'm ready for interview."
                  </p>

                  {spokenTranscript && (
                    <div className="p-2 bg-white rounded-lg border border-purple-200 text-xs text-purple-900 font-mono">
                      <span className="font-bold text-purple-700">Heard: </span>
                      <span>"{spokenTranscript}"</span>
                    </div>
                  )}

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Audio Input Level</span>
                      <span>{micVolume}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 transition-all duration-150"
                        style={{ width: `${micVolume}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={testMic}
                  className={`w-full text-xs py-3 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                    micStatus === 'ready'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  {micStatus === 'ready' ? (
                    <>
                      <Check className="w-4 h-4" /> Speech Phrase Verified
                    </>
                  ) : micStatus === 'testing' ? (
                    'Listening for Phrase...'
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Start Mic & Speak Phrase
                    </>
                  )}
                </Button>
              </div>

              {/* Card 3: Speaker Sound Check */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 space-y-3.5 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">3. Speaker Sound Check</span>
                  </div>
                  <Badge
                    className={
                      audioStatus === 'ready'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  >
                    {audioStatus === 'ready' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Speaker Ready
                      </span>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                    Audio Playback Check:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Click "Play Voice" to hear Ava speak, then confirm audibility below.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={testAudio}
                    className="w-full text-xs py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    {audioVoicePlaying ? 'Ava is speaking...' : 'Play Voice'}
                  </Button>

                  {audioVoiceHeard && audioStatus !== 'ready' && (
                    <Button
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        setAudioVoicePlaying(false);
                        setAudioStatus('ready');
                        toast.success('Speaker verified successfully!');
                      }}
                      className="w-full text-xs py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Yes, the voice is audible
                    </Button>
                  )}

                  {audioStatus === 'ready' && (
                    <div className="text-center text-xs font-bold text-emerald-700 py-1 flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Voice Verified & Clear
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Full-Screen Permission */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-900 space-y-3.5 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">4. Full-Screen Permission</span>
                  </div>
                  <Badge
                    className={
                      fullscreenStatus === 'ready'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  >
                    {fullscreenStatus === 'ready' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Full-Screen Allowed
                      </span>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>

                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-900 block uppercase tracking-wider">
                    Screen Mode Enforcement:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Allow full-screen mode to ensure an authentic, distraction-free interview session.
                  </p>
                </div>

                <Button
                  onClick={requestFullscreenPermission}
                  className={`w-full text-xs py-3 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                    fullscreenStatus === 'ready'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {fullscreenStatus === 'ready' ? (
                    <>
                      <Check className="w-4 h-4" /> Full-Screen Active & Allowed
                    </>
                  ) : (
                    <>
                      <Maximize className="w-4 h-4" /> Allow & Enable Full-Screen Mode
                    </>
                  )}
                </Button>
              </div>

            </div>

            {/* Anti-Cheating & Full-Screen Proctoring Rules Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Proctoring & Anti-Cheating Integrity Rules
                </span>
              </div>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-amber-800 leading-relaxed font-medium">
                <li>
                  <strong>Full-Screen Enforcement:</strong> The interview will run in strict full-screen. Pressing ESC, switching tabs, or minimizing window will trigger proctoring violations.
                </li>
                <li>
                  <strong>Device & Window Locking:</strong> If third-party devices, mobile phones, or background tab switches are detected, you will be automatically terminated from the session.
                </li>
              </ul>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToIntegrityRules}
                  onChange={(e) => setAgreedToIntegrityRules(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900">
                  I agree to the Full-Screen Proctoring & Anti-Cheating Rules
                </span>
              </label>
            </div>

            {/* Bottom Actions with Strict Disabled State until All 4 Checks Pass */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={() => setWizardStep(2)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Review</span>
              </Button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {!isAllVerifiedAndAgreed && (
                  <span className="text-[11px] font-mono text-amber-700 font-semibold text-center sm:text-right">
                    {[
                      camStatus !== 'ready' && 'Camera',
                      micStatus !== 'ready' && 'Mic',
                      audioStatus !== 'ready' && 'Speaker',
                      fullscreenStatus !== 'ready' && 'Full-Screen',
                      !agreedToIntegrityRules && 'Rules Agreement',
                    ]
                      .filter(Boolean)
                      .join(', ')}{' '}
                    pending
                  </span>
                )}

                <Button
                  onClick={handleStartCodingSession}
                  disabled={isSubmitting || !isAllVerifiedAndAgreed}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    isAllVerifiedAndAgreed
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Maximize
                    className={`w-4 h-4 ${isAllVerifiedAndAgreed ? 'text-white' : 'text-slate-400'}`}
                  />
                  <span>
                    {isSubmitting
                      ? prepMessage || 'Launching...'
                      : 'Launch Live Coding Session'}
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
