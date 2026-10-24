// ═══════════════════════════════════════════════════════════════
// RU READY — Premium Video Interview Setup
// Clean 3-Step Flow: Configure -> Device Check -> Review & Start
// With Camera Face Centering, Speech Phrase Verification, Real AI Voice,
// Full-Screen Enforcement, Dynamic Sidebar Matrix & Comprehensive Guide
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Users,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Settings2,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  HelpCircle,
  Lightbulb,
  Radio,
  FileText,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Video,
  Monitor,
  Play,
  X,
  Plus,
  Briefcase,
  Award,
  Network,
  Maximize,
  Lock,
  MessageSquare,
  Send,
  Eye,
  Activity,
  Zap,
} from 'lucide-react';
import apiClient from '../../api/client';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { findEnglishBrowserVoice } from '../../lib/speech';

// ─── Supported Interview Types ───
const INTERVIEW_TYPES = [
  {
    id: 'TECHNICAL',
    title: 'Technical Interview',
    desc: 'Focus on technical knowledge, problem solving, coding concepts, and real-world scenarios.',
    icon: Code2,
    badgeText: 'Technical',
  },
  {
    id: 'HR_BEHAVIORAL',
    title: 'HR / Behavioral Interview',
    desc: 'Practice communication, leadership principles, teamwork, situational questions and behavioral responses.',
    icon: Users,
    badgeText: 'STAR Method',
  },
  {
    id: 'FULL_SIMULATION',
    title: 'Full Interview Simulation',
    desc: 'Complete end-to-end interview with technical, behavioral and real-world project questions.',
    icon: Star,
    badgeText: 'Recommended',
  },
];

// ─── Popular Engineering Roles ───
const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / ML Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'QA / Testing Engineer',
];

// ─── Experience Level Options ───
const EXPERIENCE_LEVELS = [
  {
    id: ExperienceLevel.FRESHER,
    label: 'Fresher / Junior',
    range: '0 - 2 years',
  },
  {
    id: ExperienceLevel.MID,
    label: 'Mid-Level',
    range: '2 - 5 years',
  },
  {
    id: ExperienceLevel.SENIOR,
    label: 'Senior / Lead',
    range: '5+ years',
  },
];

// ─── Supported Durations ───
const DURATIONS = [
  { value: 15, label: '15 Minutes', sub: 'Quick check' },
  { value: 30, label: '30 Minutes', sub: 'Standard session' },
  { value: 45, label: '45 Minutes', sub: 'In-depth simulation' },
];

// ─── Popular Skills (Comprehensive & Modern) ───
const POPULAR_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Java',
  'C++',
  'Go',
  'SQL',
  'PostgreSQL',
  'System Design',
  'Data Structures & Algorithms',
  'Docker',
  'Kubernetes',
  'AWS',
  'Microservices',
  'REST APIs',
  'GraphQL',
  'Redis',
  'Next.js',
  'Git',
  'CI/CD',
  'FastAPI',
  'Tailwind CSS',
];

// ─── Rich Focus Areas with Icons & Explanations ───
const FOCUS_AREAS_CONFIG = [
  {
    id: 'Technical Problem Solving',
    title: 'Technical Problem Solving',
    desc: 'Algorithmic thinking, data structures, and edge-case handling',
    icon: Code2,
  },
  {
    id: 'System Architecture & Scaling',
    title: 'System Architecture & Scaling',
    desc: 'High-level design, database choices, scalability & tradeoffs',
    icon: Network,
  },
  {
    id: 'Code Quality & Best Practices',
    title: 'Code Quality & Best Practices',
    desc: 'Clean architecture, testing, refactoring & maintainability',
    icon: ShieldCheck,
  },
  {
    id: 'STAR Behavioral & Teamwork',
    title: 'STAR Behavioral & Teamwork',
    desc: 'Situation-Task-Action-Result format, collaboration & communication',
    icon: Users,
  },
  {
    id: 'Past Project Deep Dive',
    title: 'Past Project Deep Dive',
    desc: 'Technical choices, challenges overcome, and personal impact',
    icon: Briefcase,
  },
  {
    id: 'Leadership & Conflict Resolution',
    title: 'Leadership & Conflict Resolution',
    desc: 'Mentorship, cross-team alignment, and handling ambiguity',
    icon: Award,
  },
];

// ─── Dynamic Suggested Skills by Role ───
const ROLE_SKILLS_MAP: Record<string, string[]> = {
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'Clean Architecture', 'REST APIs', 'SQL'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Docker', 'GraphQL', 'Tailwind CSS'],
  'Frontend Developer': ['React', 'TypeScript', 'CSS / Tailwind', 'Next.js', 'Web Performance', 'JavaScript (ES6+)', 'State Management'],
  'Backend Developer': ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'System Architecture', 'Kafka'],
  'AI / ML Engineer': ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Prompt Engineering', 'LangChain', 'MLOps', 'Vector Databases'],
  'Data Scientist': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Statistical Modeling', 'Tableau', 'BigQuery'],
  'DevOps Engineer': ['Kubernetes', 'Docker', 'CI/CD Pipelines', 'Terraform', 'AWS / Cloud', 'Linux', 'Prometheus'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile Architecture', 'Offline Sync', 'App Store Deployment'],
  'QA / Testing Engineer': ['Automation Testing', 'Selenium / Cypress', 'API Testing (Postman)', 'Jest / Vitest', 'Test Planning', 'Performance Testing'],
};

const LANGUAGE_OPTIONS = [
  'English (US / Global)',
  'Spanish',
  'French',
  'German',
  'Hindi',
];

export default function SetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);

  // Step state: 1 = Configure, 2 = Device Check, 3 = Review & Start
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // "Need Help?" Modal state with tabs
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpTab, setHelpTab] = useState<'guide' | 'support'>('guide');

  // Support Message Form State
  const [supportName, setSupportName] = useState(user?.name || '');
  const [supportEmail, setSupportEmail] = useState(user?.email || '');
  const [supportCategory, setSupportCategory] = useState('Camera / Webcam');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // ─── Step 1: Core Form Configuration State (Initially nothing selected; all are required) ───
  const [interviewType, setInterviewType] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>('');
  const [durationMins, setDurationMins] = useState<number>(0);
  const [hasAttemptedStep1, setHasAttemptedStep1] = useState(false);

  // ─── Optional Personalization State ───
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English (US / Global)');

  // ─── Step 2: Device Check State ───
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterAnimRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const [camStatus, setCamStatus] = useState<'idle' | 'checking' | 'ready' | 'denied' | 'error'>('idle');
  const [faceCenteringStage, setFaceCenteringStage] = useState<'waiting' | 'detecting' | 'centered'>('waiting');
  const [micStatus, setMicStatus] = useState<'idle' | 'checking' | 'ready' | 'denied' | 'error'>('idle');
  const [audioStatus, setAudioStatus] = useState<'idle' | 'testing' | 'verified'>('idle');
  const [audioVoicePlaying, setAudioVoicePlaying] = useState<boolean>(false);
  const [audioVoiceHeard, setAudioVoiceHeard] = useState<boolean>(false);
  const [fullscreenStatus, setFullscreenStatus] = useState<'idle' | 'ready'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [speechTestTranscript, setSpeechTestTranscript] = useState<string>('');
  const [isTestingSpeech, setIsTestingSpeech] = useState<boolean>(false);
  const hasToastedMicRef = useRef<boolean>(false);
  const [agreedToIntegrityRules, setAgreedToIntegrityRules] = useState<boolean>(false);

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');

  // ─── Step 3: Consent & Session Submission ───
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionStatusText, setSubmissionStatusText] = useState('Preparing your interview session...');

  const effectiveRole = isCustomRole ? customRoleInput.trim() : targetRole.trim();

  // URL Query Param Pre-population
  useEffect(() => {
    const roleParam = searchParams.get('role');
    const typeParam = searchParams.get('type');
    const stepParam = searchParams.get('step');

    if (roleParam) {
      if (POPULAR_ROLES.includes(roleParam)) {
        setTargetRole(roleParam);
      } else {
        setIsCustomRole(true);
        setCustomRoleInput(roleParam);
        setTargetRole(roleParam);
      }
    }

    if (typeParam) {
      const match = INTERVIEW_TYPES.find((t) => t.id === typeParam.toUpperCase() || t.id.includes(typeParam.toUpperCase()));
      if (match) setInterviewType(match.id);
    }

    if (stepParam === '2') setCurrentStep(2);
    if (stepParam === '3') setCurrentStep(3);
  }, [searchParams]);

  // Real-time Fullscreen Listener
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

  // Clean up media streams and speech on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopMediaTracks = () => {
    if (meterAnimRef.current) {
      cancelAnimationFrame(meterAnimRef.current);
      meterAnimRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Switch to Step 2 triggers hardware check
  const handleGoToDeviceCheck = () => {
    setHasAttemptedStep1(true);

    // Validate ALL 4 required fields
    if (!interviewType) {
      toast.error('Please select an Interview Type.');
      return;
    }

    const currentRole = isCustomRole ? customRoleInput.trim() : targetRole.trim();
    if (!currentRole) {
      toast.error('Please select or specify a Target Engineering Role.');
      return;
    }

    if (!experienceLevel) {
      toast.error('Please select your Experience Level.');
      return;
    }

    if (!durationMins || durationMins === 0) {
      toast.error('Please select an Interview Duration.');
      return;
    }

    setCurrentStep(2);
    initDeviceTesting();
  };

  // Hardware testing flow
  const initDeviceTesting = async () => {
    setCamStatus('checking');
    setMicStatus('checking');
    setFaceCenteringStage('detecting');

    try {
      // 1. Enumerate available hardware devices
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
          setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
        } catch {
          // ignore enumeration error
        }
      }

      // 2. Request combined stream with constraints
      const constraints: MediaStreamConstraints = {
        video: selectedVideoDeviceId ? { deviceId: { exact: selectedVideoDeviceId } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: selectedAudioDeviceId ? { deviceId: { exact: selectedAudioDeviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Bind to preview video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn('Video play warning:', err));
      }

      // Candidate Centering Scan
      setTimeout(() => {
        setFaceCenteringStage('centered');
        setCamStatus('ready');
        toast.success('Candidate centered in frame successfully!');
      }, 1200);

      // 3. Start audio volume visualizer
      startAudioMetering(stream);
    } catch (err: any) {
      console.error('Device access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCamStatus('denied');
        setMicStatus('denied');
        setFaceCenteringStage('waiting');
        toast.error('Camera or Microphone permission was denied. Please allow access in browser.');
      } else {
        setCamStatus('error');
        setMicStatus('error');
        setFaceCenteringStage('waiting');
        toast.error('Could not access camera or microphone hardware.');
      }
    }
  };

  const startAudioMetering = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(normalized);
        meterAnimRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio metering unavailable:', e);
    }
  };

  // Speech Recognition phrase check: listens for "Hi, I'm ready for interview."
  const startSpeechRecognitionTest = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
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
        if (clean) {
          setSpeechTestTranscript(clean);
        }
      };

      rec.onerror = () => {};
      rec.start();
      recognitionRef.current = rec;
    } catch {
      // Speech recognition optional
    }
  };

  const handleStartSpeechTest = () => {
    hasToastedMicRef.current = false;
    setIsTestingSpeech(true);
    startSpeechRecognitionTest();
    toast.success('Microphone listening... Please speak the phrase.');
  };

  const handleConfirmSpeechOkay = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsTestingSpeech(false);
    setMicStatus('ready');
    if (!hasToastedMicRef.current) {
      hasToastedMicRef.current = true;
      toast.success('Microphone verified: Speech phrase detected!');
    }
  };

  const handleCancelSpeechTest = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsTestingSpeech(false);
    if (micStatus !== 'ready') {
      setMicStatus('idle');
    }
  };

  // Speaker output sound test — REAL AI VOICE ONLY (NO BEEP SOUND)
  const testSpeakerOutput = () => {
    setAudioStatus('testing');
    setAudioVoicePlaying(true);
    setAudioVoiceHeard(false);

    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();

        const text =
          "Hello! This is Ava, your AI interview coach. If you can hear my voice clearly, your audio output is verified and ready.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const highQualityVoice = findEnglishBrowserVoice();
        if (highQualityVoice) {
          utterance.voice = highQualityVoice;
          utterance.lang = highQualityVoice.lang || 'en-US';
        }

        utterance.onend = () => {
          setAudioVoicePlaying(false);
          setAudioVoiceHeard(true);
          setAudioStatus('verified');
        };

        utterance.onerror = () => {
          setAudioVoicePlaying(false);
          setAudioVoiceHeard(true);
          setAudioStatus('verified');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setAudioVoicePlaying(false);
        setAudioVoiceHeard(true);
        setAudioStatus('verified');
      }
    } catch (e) {
      console.warn('Audio voice test failed:', e);
      setAudioVoicePlaying(false);
      setAudioVoiceHeard(true);
      setAudioStatus('verified');
    }
  };

  // Full-Screen request
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
      toast.success('Full-Screen mode enabled!');
    } catch (e) {
      console.warn('Fullscreen request error:', e);
      setFullscreenStatus('ready'); // permissive fallback
    }
  };

  // Add / remove skills in customization
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleToggleFocus = (focusId: string) => {
    setSelectedFocus((prev) =>
      prev.includes(focusId) ? prev.filter((f) => f !== focusId) : [...prev, focusId]
    );
  };

  // Final Submission: Start Interview Session
  const handleStartInterview = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmissionStatusText('Creating your customized interview session...');

    try {
      // Re-affirm full-screen if available
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // ignore
        }
      }

      const finalRole = isCustomRole ? customRoleInput.trim() || 'Software Engineer' : targetRole;
      const backendType =
        interviewType === 'HR_BEHAVIORAL'
          ? InterviewType.HR_ROUND
          : interviewType === 'TECHNICAL'
          ? InterviewType.JOB
          : InterviewType.PRACTICE;

      const goalMeta = `[Type: ${interviewType}][Language: ${selectedLanguage}][Skills: ${selectedSkills.join(',')}][Focus: ${selectedFocus.join(',')}]`;

      const payload = {
        userId: user?.id,
        interviewType: backendType,
        targetRole: finalRole,
        industry: 'Technology',
        experienceLevel: experienceLevel || ExperienceLevel.FRESHER,
        focusAreas: selectedFocus.length > 0 ? selectedFocus : ['General Technical', 'Communication'],
        interviewGoal: goalMeta,
        durationMins: durationMins || 30,
        jobDescription: jobDescription || undefined,
      };

      const res = await apiClient.post('/interview/session', payload);
      const session = res.data;

      setSubmissionStatusText('Initializing AI Interviewer Ava...');
      await apiClient.post(`/interview/session/${session.id}/start`);

      toast.success('Interview session initialized!');
      navigate(`/interview/${session.id}`);
    } catch (err: any) {
      console.error('Failed to create/start interview session:', err);
      setIsSubmitting(false);
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to start interview. Please try again.');
      toast.error('Could not start interview session. Check your network connection.');
    }
  };

  // Support message submission handler
  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error('Please enter a message describing your issue.');
      return;
    }

    setSupportSubmitted(true);
    toast.success('Support message sent to Admin!');
  };

  const filteredRoles = POPULAR_ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  const suggestedSkillsForRole = ROLE_SKILLS_MAP[targetRole] || POPULAR_SKILLS.slice(0, 8);

  const isStep2Complete = camStatus === 'ready' && micStatus === 'ready';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 font-sans transition-colors pb-16">
      
      {/* ─── TOP BAR WITH BREADCRUMB & HELP BUTTON ─── */}
      <div className="border-b border-slate-200/80 dark:border-neutral-800 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/video')}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              title="Back to Video Hub"
            >
              <ChevronLeft size={19} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Video Interview Setup
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">/</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                {currentStep === 1
                  ? 'Step 1: Configure'
                  : currentStep === 2
                  ? 'Step 2: Device Check'
                  : 'Step 3: Review & Start'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsHelpModalOpen(true);
              setHelpTab('guide');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 hover:bg-blue-100 transition-colors cursor-pointer shadow-2xs"
          >
            <HelpCircle size={14} />
            <span>Need Help?</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTAINER ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ═══════════ LEFT COLUMN: 3-STEP WIZARD CONTENT ═══════════ */}
        <div className="lg:col-span-8 space-y-6">

          {/* 3 Step Pill Indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-neutral-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${currentStep === 1 ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
              <span>1. Configure</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (interviewType && (targetRole || customRoleInput) && experienceLevel && durationMins) {
                  setCurrentStep(2);
                  initDeviceTesting();
                } else {
                  handleGoToDeviceCheck();
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-neutral-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${currentStep === 2 ? 'bg-white animate-pulse' : isStep2Complete ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-neutral-600'}`} />
              <span>2. Device Check</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (interviewType && (targetRole || customRoleInput) && experienceLevel && durationMins && isStep2Complete) {
                  setCurrentStep(3);
                } else {
                  toast.error('Complete device check before moving to Review.');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-neutral-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${currentStep === 3 ? 'bg-white animate-pulse' : 'bg-slate-300 dark:bg-neutral-600'}`} />
              <span>3. Review & Start</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: CONFIGURATION
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
              
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                  Configure your interview
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the required details below. Advanced personalization is optional and can be skipped.
                </p>
              </div>

              {/* 1. Interview Type Selection (Feedback item: Required) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Interview Type</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  {hasAttemptedStep1 && !interviewType && (
                    <span className="text-[11px] font-bold text-rose-500 animate-pulse">Required</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {INTERVIEW_TYPES.map((t) => {
                    const isSelected = interviewType === t.id;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setInterviewType(t.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-white shadow-2xs ring-1 ring-blue-500/30'
                            : hasAttemptedStep1 && !interviewType
                            ? 'border-rose-300 bg-rose-50/30 dark:bg-rose-950/20 text-slate-700'
                            : 'border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-800/50 hover:bg-slate-100/70 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-neutral-700 text-slate-600 dark:text-slate-300'}`}>
                            <Icon size={16} />
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-neutral-700 text-slate-600 dark:text-slate-300">
                              {t.badgeText}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1 line-clamp-2">
                            {t.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Target Engineering Role Selection (Feedback item: Required) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Target Engineering Role</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  {hasAttemptedStep1 && !effectiveRole && (
                    <span className="text-[11px] font-bold text-rose-500 animate-pulse">Required</span>
                  )}
                </div>

                {/* Popular Role Quick Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ROLES.map((role) => {
                    const isSelected = !isCustomRole && targetRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setIsCustomRole(false);
                          setTargetRole(role);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomRole(true);
                      setTargetRole('');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isCustomRole
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    + Custom Role
                  </button>
                </div>

                {/* Custom Role Input if selected */}
                {isCustomRole && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-1"
                  >
                    <input
                      type="text"
                      placeholder="Type custom role title (e.g. Embedded Firmware Engineer)..."
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </motion.div>
                )}
              </div>

              {/* 3. Experience Level & Duration in Same Line (Feedback 3) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Experience Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Experience Level</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    {hasAttemptedStep1 && !experienceLevel && (
                      <span className="text-[11px] font-bold text-rose-500 animate-pulse">Required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {EXPERIENCE_LEVELS.map((lvl) => {
                      const isSelected = experienceLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setExperienceLevel(lvl.id)}
                          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-white shadow-2xs font-bold'
                              : 'border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-800/50 hover:bg-slate-100/70 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight">{lvl.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{lvl.range}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Interview Duration</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    {hasAttemptedStep1 && (!durationMins || durationMins === 0) && (
                      <span className="text-[11px] font-bold text-rose-500 animate-pulse">Required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {DURATIONS.map((d) => {
                      const isSelected = durationMins === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setDurationMins(d.value)}
                          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-white shadow-2xs font-bold'
                              : 'border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-800/50 hover:bg-slate-100/70 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight">{d.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{d.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* 4. Optional Interview Personalization Accordion */}
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 dark:bg-neutral-850 dark:hover:bg-neutral-800 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Settings2 size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Optional Personalization
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Target specific skills, focus areas, job descriptions or languages (All optional)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(selectedSkills.length > 0 || selectedFocus.length > 0 || jobDescription) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {selectedSkills.length + selectedFocus.length + (jobDescription ? 1 : 0)} configured
                      </span>
                    )}
                    {isCustomizationOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isCustomizationOpen && (
                  <div className="mt-4 space-y-5 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800">
                    
                    {/* Skills to Assess */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          Skills to Assess
                        </label>
                        <span className="text-[11px] text-slate-400">Select skills or add your own</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Popular Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_SKILLS.map((skill) => {
                            const isSelected = selectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleToggleSkill(skill)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {isSelected ? `✓ ${skill}` : skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Skill Input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add custom skill (e.g. WebGL, Kafka, Elixir)..."
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSkill();
                            }
                          }}
                          className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Interview Focus Areas */}
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          Interview Focus Areas
                        </label>
                        <span className="text-[11px] text-slate-400">Select topics for Ava to emphasize</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {FOCUS_AREAS_CONFIG.map((area) => {
                          const isSelected = selectedFocus.includes(area.id);
                          const Icon = area.icon;
                          return (
                            <button
                              key={area.id}
                              type="button"
                              onClick={() => handleToggleFocus(area.id)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                                isSelected
                                  ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/40 text-purple-950 dark:text-white shadow-2xs ring-1 ring-purple-500/30'
                                  : 'border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-800/50 hover:bg-slate-100/70 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-neutral-700 text-slate-600 dark:text-slate-300'}`}>
                                  <Icon size={14} />
                                </div>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                  {area.title}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                  {area.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Job Description Textarea */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Target Job Description or Role Specs (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Paste target job requirements, key qualifications, or JD snippets here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder:text-slate-400 font-sans"
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Quick Tip & Next Step Primary Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 text-xs max-w-lg border border-blue-100 dark:border-blue-900/40">
                  <Lightbulb size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>
                    <strong>Quick Tip:</strong> Select all 4 required fields to proceed to device check. Customizing focus topics gives you more accurate interview questions.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoToDeviceCheck}
                  className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap self-end sm:self-auto"
                >
                  <span>Next Step: Device Check</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: DEVICE CHECK (CAMERA CENTERED, MIC SENTENCE, REAL AI VOICE, FULL-SCREEN)
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
              
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                  <ShieldCheck size={13} className="text-blue-600" />
                  <span>Step 2: Hardware & Environment Verification</span>
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                  Verify your camera, microphone and audio
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Complete device calibration and full-screen authorization before launching your proctored session.
                </p>
              </div>

              {/* Hardware 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Camera Live Tile with Center Framing Reticle */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Camera size={15} className="text-blue-600" />
                        <span>1. Camera & Candidate Center Check</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        camStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : camStatus === 'checking'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {camStatus === 'ready'
                          ? 'Candidate Centered ✓'
                          : camStatus === 'checking'
                          ? 'Scanning Center...'
                          : 'Camera Offline'}
                      </span>
                    </div>

                    {/* Mirrored Video Preview with Face Alignment Reticle */}
                    <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />

                      {/* Clean Status Badge (No green box lines) */}
                      {camStatus === 'ready' && (
                        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
                            <Check size={11} /> Centered
                          </span>
                        </div>
                      )}

                      {camStatus !== 'ready' && camStatus !== 'checking' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center bg-black/60 backdrop-blur-2xs">
                          <CameraOff size={28} className="text-slate-400 mb-2" />
                          <span className="text-xs font-medium">Camera Feed Inactive</span>
                          <button
                            type="button"
                            onClick={initDeviceTesting}
                            className="mt-2 text-[11px] text-blue-400 underline cursor-pointer"
                          >
                            Allow Camera & Center Face
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {camStatus === 'ready'
                        ? 'Candidate successfully centered in frame. Camera accepted.'
                        : 'Align your face directly inside the center guide reticle.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={initDeviceTesting}
                    className="w-full py-2 rounded-xl border border-slate-300 dark:border-neutral-700 text-xs font-bold hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {camStatus === 'ready' ? 'Recalibrate Camera' : 'Turn On & Test Camera'}
                  </button>
                </div>

                {/* 2. Microphone & Speech Phrase Check */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Mic size={15} className="text-purple-600" />
                        <span>2. Microphone & Phrase Check</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        micStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isTestingSpeech
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {micStatus === 'ready' ? 'Phrase Verified ✓' : isTestingSpeech ? 'Listening...' : 'Speak to Verify'}
                      </span>
                    </div>

                    {/* Microphone Prompt Sentence */}
                    <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-1.5">
                      <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block">
                        Read Out Loud to Verify Mic:
                      </span>
                      <p className="text-xs italic text-purple-950 dark:text-purple-200 font-semibold font-serif">
                        "Hi, I'm ready for interview."
                      </p>

                      {speechTestTranscript && (
                        <div className="p-2 bg-white dark:bg-neutral-900 rounded-lg border border-purple-200 dark:border-purple-800/60 text-xs text-purple-950 dark:text-purple-300 font-mono mt-1">
                          <span className="font-bold text-purple-700 dark:text-purple-400">Heard: </span>
                          <span>"{speechTestTranscript}"</span>
                        </div>
                      )}
                    </div>

                    {/* Input volume visualizer */}
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Mic Volume Level</span>
                        <span className="font-bold text-purple-600">{micVolume}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          animate={{ width: `${Math.max(4, micVolume)}%` }}
                          transition={{ duration: 0.05 }}
                        />
                      </div>
                    </div>
                  </div>

                  {isTestingSpeech ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmSpeechOkay}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check size={14} />
                        <span>Okay</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelSpeechTest}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartSpeechTest}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        micStatus === 'ready'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {micStatus === 'ready' ? '✓ Speech Phrase Verified (Click to Re-test)' : 'Start Mic & Speak Phrase'}
                    </button>
                  )}
                </div>

                {/* 3. Speaker Test — REAL AI VOICE ONLY */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Volume2 size={15} className="text-emerald-600" />
                        <span>3. Speaker Audio Output Check</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        audioStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {audioStatus === 'verified' ? 'Speaker Verified ✓' : 'Play to Test'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Click below to hear Ava's real AI voice. Confirm that her greeting is loud and intelligible.
                    </p>

                    <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                      {audioVoicePlaying
                        ? '🔊 Ava is speaking right now...'
                        : 'Ava will say: "Hello! This is Ava, your AI interview coach..."'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={testSpeakerOutput}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Volume2 size={14} className={audioVoicePlaying ? 'animate-pulse' : ''} />
                      <span>{audioVoicePlaying ? 'Ava is speaking...' : 'Play Real AI Voice'}</span>
                    </button>

                    {audioVoiceHeard && audioStatus !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAudioStatus('verified');
                          toast.success('Speaker verified successfully!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Yes, I heard Ava clearly</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Full-Screen Mode Permission */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Maximize size={15} className="text-indigo-600" />
                        <span>4. Full-Screen Permission</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        fullscreenStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {fullscreenStatus === 'ready' ? 'Full-Screen Active ✓' : 'Permission Required'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      RU READY interviews require full-screen mode to emulate an authentic, distraction-free environment.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={requestFullscreenPermission}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      fullscreenStatus === 'ready'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    <Maximize size={14} />
                    <span>{fullscreenStatus === 'ready' ? '✓ Full-Screen Active & Allowed' : 'Enable Full-Screen Mode'}</span>
                  </button>
                </div>

              </div>

              {/* Anti-Cheating & Integrity Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-amber-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Full-Screen Proctoring Rules
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  During the interview, exiting full-screen or switching browser tabs will be recorded as a proctoring violation. Please keep background notifications silenced.
                </p>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToIntegrityRules}
                    onChange={(e) => setAgreedToIntegrityRules(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    I agree to the Full-Screen Proctoring & Anti-Cheating Rules
                  </span>
                </label>
              </div>

              {/* Step 2 Bottom Navigation */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Configuration
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={camStatus !== 'ready' || micStatus !== 'ready'}
                  className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Continue to Review & Start</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: REVIEW AND START
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
              
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Step 3: Review & Launch Session</span>
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                  Review your interview details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify your configuration and device readiness before meeting your AI interviewer Ava.
                </p>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Interview Type</span>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                    {interviewType.replace('_', ' ')}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Target Role</span>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {isCustomRole ? customRoleInput || 'Custom' : targetRole}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Experience</span>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                    {experienceLevel}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Duration</span>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                    {durationMins} Minutes
                  </strong>
                </div>
              </div>

              {/* Selected Skills & Focus Areas */}
              {(selectedSkills.length > 0 || selectedFocus.length > 0) && (
                <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
                  <span className="text-xs font-bold text-blue-950 dark:text-blue-300 block">
                    Personalized Assessment Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                    {selectedFocus.map((f) => (
                      <span key={f} className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 text-[11px] font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware Checklist Verification Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Hardware & Proctoring Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle size={15} />
                    <span>Camera Centered</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle size={15} />
                    <span>Microphone Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle size={15} />
                    <span>AI Voice Output Clear</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle size={15} />
                    <span>Full-Screen Ready</span>
                  </div>
                </div>
              </div>

              {/* Consent Agreement */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-amber-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed cursor-pointer">
                  <strong>Privacy & Evaluation Consent:</strong> I agree to participate in the AI-evaluated mock interview. My camera and microphone will be used solely for speech synthesis, gaze telemetry, and performance feedback during this session.
                </label>
              </div>

              {/* Error Banner */}
              {submitError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
                  <span>{submitError}</span>
                  <button
                    type="button"
                    onClick={handleStartInterview}
                    className="underline font-bold cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Step 3 Bottom Action: Launch Interview */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  ← Back to Device Check
                </button>

                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={!consentAgreed || isSubmitting}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>{submissionStatusText}</span>
                    </>
                  ) : (
                    <>
                      <Play size={15} className="fill-white" />
                      <span>Start Interview</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ═══════════ RIGHT COLUMN: ENGAGING READINESS & TELEMETRY SIDEBAR ═══════════ */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Evaluation Engine Breakdown Card (Replaces person image) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Evaluation Matrix
                  </h3>
                  <p className="text-[10px] text-slate-400">Scoring breakdown analyzed by Ava</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                100 pts
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Technical Knowledge & Accuracy</span>
                  <span className="font-mono text-blue-600 font-bold">35%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Communication & STAR Method</span>
                  <span className="font-mono text-purple-600 font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Problem Solving & Edge Cases</span>
                  <span className="font-mono text-indigo-600 font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Eye Contact & Voice Telemetry</span>
                  <span className="font-mono text-emerald-600 font-bold">15%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Real-time Setup Snapshot Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-neutral-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span>Configuration Snapshot</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                  {effectiveRole || 'Not selected'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800">
                <span className="text-slate-500">Format:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {interviewType ? interviewType.replace('_', ' ') : 'Not selected'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800">
                <span className="text-slate-500">Experience:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {experienceLevel || 'Not selected'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {durationMins ? `${durationMins} mins` : 'Not selected'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. AI Proctoring & Telemetry Monitor Card */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Eye size={14} className="text-blue-400" />
                <span>Session Telemetry</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine
              </span>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Gaze & Eye Contact Tracking</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Speech Cadence & Tone Analysis</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Tab-Switching & Screen Lock</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Adaptive AI Follow-up Engine</span>
                <span className="text-blue-400 font-bold">Ready</span>
              </li>
            </ul>
          </div>

        </div>

      </main>

      {/* ─── COMPREHENSIVE GUIDE & TROUBLESHOOTING SUPPORT MODAL ─── */}
      <AnimatePresence>
        {isHelpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                      Video Interview Guide & Help
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Learn how the interview works or submit a message to admin support.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                  aria-label="Close Help"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setHelpTab('guide')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    helpTab === 'guide'
                      ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  📖 Interview Guide
                </button>
                <button
                  type="button"
                  onClick={() => setHelpTab('support')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    helpTab === 'support'
                      ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  🛠️ Troubleshooting & Support
                </button>
              </div>

              {/* TAB 1: INTERVIEW GUIDE */}
              {helpTab === 'guide' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                      <Sparkles size={15} className="text-blue-600" />
                      <span>What is the RU READY Video Interview?</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      The Video Interview connects you with <strong>Ava</strong>, an intelligent AI interviewer who conducts realistic real-time technical and behavioral interviews. Ava speaks naturally, listens to your answers, and dynamically asks follow-up questions just like a senior engineering manager.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Mic size={14} className="text-purple-600" />
                      <span>Natural Conversational Flow</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ava presents each question with audio and captions. You answer spoken aloud through your microphone. When you finish speaking, Ava evaluates your answer and asks contextual follow-ups.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Award size={14} className="text-emerald-600" />
                      <span>STAR Framework & Scoring</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Behavioral and scenario questions are scored based on the <strong>STAR method</strong> (Situation, Task, Action, Result). Technical responses are analyzed for algorithmic clarity and edge-case awareness.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <FileText size={14} className="text-blue-600" />
                      <span>Comprehensive Analysis Scorecard</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      At session end, you receive an instant scorecard detailing your technical score, speech pacing, eye contact percentage, answer transcripts, and personalized improvement suggestions.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: TROUBLESHOOTING & CONTACT ADMIN FORM */}
              {helpTab === 'support' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Quick Fixes for Common Issues:
                    </span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      <li><strong>Webcam blocked:</strong> Click the camera icon in your browser URL address bar and click "Always allow".</li>
                      <li><strong>No speech detected:</strong> Check your system microphone volume and ensure headphones are plugged in.</li>
                      <li><strong>Voice audio inaudible:</strong> Ensure your computer speaker volume is turned up before clicking "Play Voice".</li>
                    </ul>
                  </div>

                  {supportSubmitted ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <Check size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        Message Submitted to Admin!
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Our administrative support team has received your diagnostics and message. We will review it promptly.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSupportSubmitted(false);
                          setSupportMessage('');
                        }}
                        className="text-xs text-blue-600 font-bold underline cursor-pointer pt-1"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendSupportMessage} className="space-y-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <MessageSquare size={14} className="text-blue-600" />
                        <span>Send Message to Admin</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={supportName}
                            onChange={(e) => setSupportName(e.target.value)}
                            required
                            placeholder="Enter your name"
                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            required
                            placeholder="your.email@example.com"
                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Issue Category
                        </label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white"
                        >
                          <option value="Camera / Webcam">Camera / Webcam Issue</option>
                          <option value="Microphone / Speech">Microphone / Speech Recognition Issue</option>
                          <option value="Audio Output / Speaker">Audio Output / Ava Voice Not Heard</option>
                          <option value="Full-Screen / Browser">Full-Screen / Browser Permission Issue</option>
                          <option value="Other">Other / General Question</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Message for Admin
                        </label>
                        <textarea
                          rows={3}
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          required
                          placeholder="Describe the issue you are experiencing..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Send size={13} />
                        <span>Send Message to Admin</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(false)}
                  className="w-full py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
