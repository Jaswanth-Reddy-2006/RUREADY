import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Play,
  Clock,
  Code2,
  Terminal,
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
  AlertTriangle,
  Lock,
  Maximize,
  VolumeX,
  Layers,
  Database,
  Bug,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Data Engineer',
  'AI / ML Engineer',
  'DevOps Engineer',
  'Product Engineer',
  'Mobile Developer',
  'QA / Automation Engineer',
  'Systems Software Engineer',
  'Cloud Software Engineer',
];

const POPULAR_COMPANIES = [
  'None / General Target',
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'Uber',
  'Netflix',
  'TCS',
  'Infosys',
  'Accenture',
  'Deloitte',
  'Oracle',
  'Salesforce',
  'Flipkart',
  'Atlassian',
];

const CODING_PRACTICE_AREAS = [
  { id: 'DSA', label: 'DSA / Problem Solving', desc: 'Arrays, Trees, Graphs, DP & Asymptotic Complexity', isRecommended: true },
  { id: 'MachineCoding', label: 'Machine Coding / Low-Level Design', desc: 'Object-Oriented Architecture, In-Memory Systems' },
  { id: 'SQL', label: 'SQL & Database Queries', desc: 'Complex JOINs, Aggregations & Query Optimizations' },
  { id: 'Debugging', label: 'Code Review & Bug Fixing', desc: 'Diagnose runtime errors & concurrency race conditions' },
  { id: 'Backend', label: 'Backend API Implementation', desc: 'REST endpoints, Data parsing & Validation' },
  { id: 'Frontend', label: 'Frontend Component Logic', desc: 'State management, Event loops & UI algorithms' },
  { id: 'Competitive', label: 'Competitive Math & Algorithms', desc: 'Number theory, Bitwise tricks & Greedy optimizations' },
];

const CODING_LANGUAGES = [
  { id: 'python', label: 'Python 3', ext: 'py', badge: 'CPython 3.12' },
  { id: 'javascript', label: 'JavaScript', ext: 'js', badge: 'Node.js 20' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts', badge: 'Strict Types' },
  { id: 'java', label: 'Java 17', ext: 'java', badge: 'OpenJDK 17' },
  { id: 'cpp', label: 'C++', ext: 'cpp', badge: 'GCC 13' },
  { id: 'go', label: 'Go (Golang)', ext: 'go', badge: 'Go 1.22' },
  { id: 'csharp', label: 'C#', ext: 'cs', badge: '.NET 8' },
];

const PREDEFINED_TOPICS = [
  'Arrays', 'Strings', 'Hash Maps', 'Two Pointers', 'Sliding Window',
  'Linked Lists', 'Binary Trees', 'BST', 'Graphs', 'BFS / DFS',
  'Dynamic Programming', 'Recursion & Backtracking', 'Greedy Algorithms',
  'Binary Search', 'Heaps & Priority Queues', 'Trie', 'Bit Manipulation',
  'Sorting & Searching', 'System Architecture', 'Concurrency & Locks',
];

export default function CodingSetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const initialFocus = searchParams.get('focus') || 'DSA';
  const initialRole = searchParams.get('role') || 'Software Engineer';
  const initialCompany = searchParams.get('company') || 'None / General Target';

  // Wizard Step: 1 = Prepare, 2 = Check (Review), 3 = Allow (Device Check)
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Search Filters
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [companySearch, setCompanySearch] = useState<string>('');

  // Form State
  const [targetRole, setTargetRole] = useState<string>(initialRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);

  const [targetCompany, setTargetCompany] = useState<string>(initialCompany);
  const [customCompanyInput, setCustomCompanyInput] = useState<string>('');
  const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);

  const [experienceLevel, setExperienceLevel] = useState<'FRESHER' | 'MID' | 'SENIOR'>('FRESHER');
  const [codingLanguage, setCodingLanguage] = useState<string>('python');
  const [selectedPractice, setSelectedPractice] = useState<string[]>([initialFocus]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [durationMins, setDurationMins] = useState<number>(30);
  const [simulationMode, setSimulationMode] = useState<'PRACTICE' | 'REALISTIC' | 'CHALLENGE'>('REALISTIC');

  // Loading & submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  // Device Check States (Step 3)
  const [cameraStatus, setCameraStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [micStatus, setMicStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [audioStatus, setAudioStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'FAIL'>('IDLE');
  const [fullscreenStatus, setFullscreenStatus] = useState<'IDLE' | 'PASS'>('IDLE');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState<boolean>(false);

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('ru_ready_preferred_language');
    if (saved) setCodingLanguage(saved);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setCodingLanguage(lang);
    localStorage.setItem('ru_ready_preferred_language', lang);
  };

  const togglePractice = (id: string) => {
    if (selectedPractice.includes(id)) {
      if (selectedPractice.length > 1) {
        setSelectedPractice(selectedPractice.filter((p) => p !== id));
      }
    } else {
      setSelectedPractice([...selectedPractice, id]);
    }
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAddCustomTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTopicInput.trim()) {
      e.preventDefault();
      const val = customTopicInput.trim();
      if (!selectedTopics.includes(val)) {
        setSelectedTopics([...selectedTopics, val]);
      }
      setCustomTopicInput('');
    }
  };

  // ─── STEP 3: DEVICE CHECK LOGIC ───
  const startCameraCheck = async () => {
    setCameraStatus('TESTING');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraStatus('PASS');
    } catch {
      setCameraStatus('FAIL');
    }
  };

  const startMicCheck = async () => {
    setMicStatus('TESTING');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let maxVol = 0;
      const interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round(avg * 2)));
        if (avg > maxVol) maxVol = avg;
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        setMicStatus(maxVol > 3 ? 'PASS' : 'FAIL');
      }, 3000);
    } catch {
      setMicStatus('FAIL');
    }
  };

  const startSpeakerCheck = () => {
    setAudioStatus('TESTING');
    setIsPlayingAudioTest(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);

      setTimeout(() => {
        setIsPlayingAudioTest(false);
        setAudioStatus('PASS');
      }, 1000);
    } catch {
      setIsPlayingAudioTest(false);
      setAudioStatus('FAIL');
    }
  };

  const requestFullscreenPermission = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreenStatus('PASS');
      } else {
        setFullscreenStatus('PASS');
      }
    } catch {
      setFullscreenStatus('PASS');
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Launch Coding Session
  const handleLaunchCodingInterview = async () => {
    setIsSubmitting(true);
    setPrepMessage('Initializing observed Monaco IDE & compilation sandbox...');
    try {
      const finalRole = isCustomRole ? customRoleInput || 'Software Engineer' : targetRole;
      const finalCompany = isCustomCompany ? customCompanyInput || 'None / General Target' : targetCompany;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: 'CODING',
        targetRole: finalRole,
        targetCompany: finalCompany,
        industry: 'Technology',
        experienceLevel,
        focusAreas: selectedPractice,
        skills: selectedTopics,
        durationMins,
        jobDescription,
        interviewGoal: `Coding Challenge: ${selectedPractice.join(', ')} in ${codingLanguage.toUpperCase()}`,
      });

      const newSession = sessionResponse.data;
      navigate(`/interview/coding/${newSession.id}`);
    } catch (err) {
      console.warn('Backend unavailable, launching local sandbox session:', err);
      const mockId = `coding-${Date.now()}`;
      navigate(`/interview/coding/${mockId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = POPULAR_ROLES.filter((r) => r.toLowerCase().includes(roleSearch.toLowerCase()));
  const filteredCompanies = POPULAR_COMPANIES.filter((c) => c.toLowerCase().includes(companySearch.toLowerCase()));

  const displayRole = isCustomRole ? customRoleInput || 'Custom Role' : targetRole;
  const displayCompany = isCustomCompany
    ? customCompanyInput || 'Custom Company'
    : targetCompany === 'None / General Target'
    ? 'General Target'
    : targetCompany;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ─── TOP HEADER ROW: Back Button + Stepper Progress Bar ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              if (wizardStep > 1) {
                setWizardStep(wizardStep - 1);
              } else {
                navigate('/coding');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>
              {wizardStep === 1
                ? 'Back to Coding Center'
                : wizardStep === 2
                ? 'Back to Configuration'
                : 'Back to Review'}
            </span>
          </button>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Step 1: Prepare */}
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  wizardStep >= 1
                    ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </div>
              <span
                className={`text-xs font-bold transition-all ${
                  wizardStep === 1 ? 'text-blue-700 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                Prepare
              </span>
            </button>

            <div className="w-6 sm:w-8 h-0.5 bg-slate-200 rounded-full" />

            {/* Step 2: Check */}
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  wizardStep >= 2
                    ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-bold transition-all ${
                  wizardStep === 2 ? 'text-blue-700 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                Check
              </span>
            </button>

            <div className="w-6 sm:w-8 h-0.5 bg-slate-200 rounded-full" />

            {/* Step 3: Allow */}
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  wizardStep >= 3
                    ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
              <span
                className={`text-xs font-bold transition-all ${
                  wizardStep === 3 ? 'text-blue-700 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                Allow
              </span>
            </button>
          </div>
        </div>

        {/* ─── STEP 1: PREPARE / CUSTOMIZE ─── */}
        {wizardStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Observed Live Coding Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                Customize Your Coding Interview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
                Configure your target role, primary programming language, focus topics, and simulation duration. Ava will observe your code execution and test cases in real-time.
              </p>
            </div>

            {/* Main Configuration Card */}
            <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-sm rounded-3xl space-y-8">
              {/* Section 1: Target Role */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Target Job Role</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Select or enter custom</span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search standard roles (e.g. Backend, Full Stack, SDE)..."
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {filteredRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setTargetRole(role);
                        setIsCustomRole(false);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        targetRole === role && !isCustomRole
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomRole(true)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isCustomRole
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    + Custom Role
                  </button>
                </div>

                {isCustomRole && (
                  <input
                    type="text"
                    placeholder="Enter your custom target role..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-white border border-blue-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                  />
                )}
              </div>

              {/* Section 2: Programming Language */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <span>Primary Programming Language</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Monaco Editor runtime</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  {CODING_LANGUAGES.map((lang) => {
                    const isSelected = codingLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleLanguageSelect(lang.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-100'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{lang.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">{lang.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Coding Practice Track */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>Practice Focus Areas</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Select one or more tracks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CODING_PRACTICE_AREAS.map((track) => {
                    const isSelected = selectedPractice.includes(track.id);
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => togglePractice(track.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-100'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{track.label}</span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{track.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Target Company & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Target Company */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Target Company</span>
                    <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                    {filteredCompanies.slice(0, 8).map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => {
                          setTargetCompany(comp);
                          setIsCustomCompany(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          targetCompany === comp && !isCustomCompany
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Experience Level</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'FRESHER', label: 'Entry / 0-2 yrs' },
                      { id: 'MID', label: 'Mid / 2-5 yrs' },
                      { id: 'SENIOR', label: 'Senior / 5+ yrs' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setExperienceLevel(lvl.id as any)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          experienceLevel === lvl.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 5: Specific Algorithmic Topics */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Algorithmic Topics & Data Structures</span>
                    <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Click to select topics</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {PREDEFINED_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Type custom topic & press Enter (e.g. Segment Tree, Fenwick)..."
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  onKeyDown={handleAddCustomTopic}
                  className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Section 6: Duration & Simulation Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Interview Duration</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mins: 15, label: '15 mins (Speed Drill)' },
                      { mins: 30, label: '30 mins (Standard)' },
                      { mins: 45, label: '45 mins (Deep Dive)' },
                    ].map((d) => (
                      <button
                        key={d.mins}
                        type="button"
                        onClick={() => setDurationMins(d.mins)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          durationMins === d.mins
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span>Simulation Mode</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: 'PRACTICE', label: 'Practice (Hints Allowed)' },
                      { mode: 'REALISTIC', label: 'Realistic (Timed + AI)' },
                      { mode: 'CHALLENGE', label: 'Hardcore (Strict Limits)' },
                    ].map((m) => (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => setSimulationMode(m.mode as any)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          simulationMode === m.mode
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Go to Step 2 */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <span>Next Step: Review Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── STEP 2: CHECK / REVIEW SELECTION ─── */}
        {wizardStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Configuration Review</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                Verify Your Coding Interview Plan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
                Review your selected job role, primary programming language, problem tracks, and time allocation before proceeding to device permissions.
              </p>
            </div>

            <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-sm rounded-3xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Job Role</span>
                  <p className="text-sm font-black text-slate-900">{displayRole}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Company</span>
                  <p className="text-sm font-black text-slate-900">{displayCompany}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Language & Runtime</span>
                  <p className="text-sm font-black text-blue-600 uppercase">{codingLanguage}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration & Mode</span>
                  <p className="text-sm font-black text-slate-900">{durationMins} Mins • {simulationMode}</p>
                </div>
              </div>

              {/* Selected Focus Pills */}
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-2">
                <span className="text-xs font-bold text-blue-900">Active Practice Tracks & Topics:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPractice.map((p) => (
                    <Badge key={p} className="bg-blue-600 text-white font-bold text-xs px-3 py-1">
                      Track: {p}
                    </Badge>
                  ))}
                  {selectedTopics.map((t) => (
                    <Badge key={t} className="bg-white text-slate-700 border-slate-200 font-semibold text-xs px-2.5 py-1">
                      {t}
                    </Badge>
                  ))}
                  {selectedTopics.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Adaptive algorithmic problems selected by AI</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Edit Configuration
                </button>

                <Button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <span>Next Step: Check Devices & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── STEP 3: ALLOW / DEVICE CHECK & LAUNCH ─── */}
        {wizardStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-Flight Hardware Check</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                Hardware & Telemetry Verification
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
                Ava requires camera and microphone permissions for live video feedback and speech evaluation. Check your devices below.
              </p>
            </div>

            {/* 4 Light-Theme Device Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Camera Check */}
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Camera & Video Feed</h3>
                      <p className="text-xs text-slate-500">Live AI posture & telemetry</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      cameraStatus === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : cameraStatus === 'FAIL'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }
                  >
                    {cameraStatus === 'PASS' ? 'Ready' : cameraStatus === 'FAIL' ? 'Error' : 'Not Tested'}
                  </Badge>
                </div>

                <div className="w-full h-32 bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                  <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                  {cameraStatus !== 'PASS' && (
                    <span className="text-xs text-slate-500 font-mono">Camera preview will appear here</span>
                  )}
                </div>

                <Button
                  onClick={startCameraCheck}
                  disabled={cameraStatus === 'TESTING'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  {cameraStatus === 'PASS' ? 'Retest Camera' : 'Test Camera'}
                </Button>
              </Card>

              {/* Card 2: Microphone Check */}
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/60">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Microphone & Speech</h3>
                      <p className="text-xs text-slate-500">Voice explanation clarity</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      micStatus === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : micStatus === 'FAIL'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }
                  >
                    {micStatus === 'PASS' ? 'Ready' : micStatus === 'FAIL' ? 'No Input' : 'Not Tested'}
                  </Badge>
                </div>

                <div className="w-full h-32 bg-slate-50 rounded-xl p-4 flex flex-col justify-center gap-2 border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Microphone Input Level</span>
                    <span>{micVolume}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-100"
                      style={{ width: `${micVolume}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 text-center">Speak aloud to calibrate voice levels</span>
                </div>

                <Button
                  onClick={startMicCheck}
                  disabled={micStatus === 'TESTING'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  {micStatus === 'TESTING' ? 'Listening...' : micStatus === 'PASS' ? 'Retest Mic' : 'Test Microphone'}
                </Button>
              </Card>

              {/* Card 3: Speaker Sound Check */}
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200/60">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Speaker Sound Check</h3>
                      <p className="text-xs text-slate-500">AI Recruiter voice playback</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      audioStatus === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }
                  >
                    {audioStatus === 'PASS' ? 'Verified' : 'Not Tested'}
                  </Badge>
                </div>

                <div className="w-full h-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 text-center">
                  <p className="text-xs font-medium text-slate-600">
                    Click Test to play a brief calibration chime. Ensure your volume is audible.
                  </p>
                </div>

                <Button
                  onClick={startSpeakerCheck}
                  disabled={isPlayingAudioTest}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  {isPlayingAudioTest ? 'Playing Chime...' : 'Test Speaker Audio'}
                </Button>
              </Card>

              {/* Card 4: Full-Screen Permissions */}
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                      <Maximize className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Full-Screen Mode</h3>
                      <p className="text-xs text-slate-500">Immersive proctored environment</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      fullscreenStatus === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }
                  >
                    {fullscreenStatus === 'PASS' ? 'Allowed' : 'Optional'}
                  </Badge>
                </div>

                <div className="w-full h-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 text-center">
                  <p className="text-xs font-medium text-slate-600">
                    Full-screen minimizes tab-switching distractions during live code writing.
                  </p>
                </div>

                <Button
                  onClick={requestFullscreenPermission}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  {fullscreenStatus === 'PASS' ? 'Fullscreen Active' : 'Enable Full-Screen'}
                </Button>
              </Card>
            </div>

            {/* Launch Session Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-sm font-black text-slate-900">Ready to start your observed coding interview?</span>
                <p className="text-xs text-slate-500">Ava will launch your Monaco sandbox and explain problem #1 immediately.</p>
              </div>

              <Button
                onClick={handleLaunchCodingInterview}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{prepMessage || 'Launching Sandbox...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Coding Interview</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
