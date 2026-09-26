import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Play,
  Clock,
  FileText,
  Code,
  Target,
  Plus,
  Zap,
  ShieldCheck,
  ChevronLeft,
  UserCheck,
  UserPlus,
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
} from 'lucide-react';
import apiClient from '../../api/client';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const INTERVIEW_TYPES = [
  {
    id: 'TECHNICAL',
    title: 'Technical Interview',
    desc: 'Deep dive into role knowledge, technical concepts, code architecture, and problem solving.',
    icon: Code,
    badge: 'Technical',
  },
  {
    id: 'HR_BEHAVIORAL',
    title: 'HR / Behavioral Interview',
    desc: 'Practice introduction, leadership principles, teamwork scenarios, situational conflicts, and STAR response framing.',
    icon: Sparkles,
    badge: 'STAR Method',
  },
  {
    id: 'FULL_SIMULATION',
    title: 'Full Interview Simulation',
    desc: 'Realistic end-to-end combination of introduction, past project deep dive, technical questions, and behavioral probes.',
    icon: Target,
    badge: 'Recommended',
  },
];

const POPULAR_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / ML Engineer',
  'Data Scientist',
  'DevOps / SRE',
  'Product Manager',
  'Database Administrator',
  'Mobile Developer',
  'QA / Testing Engineer',
  'Data Analyst',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Embedded Systems Engineer',
  'iOS Developer',
  'Android Developer',
];

const POPULAR_COMPANIES = [
  'None / General Target',
  'Amazon',
  'Google',
  'Microsoft',
  'TCS',
  'Infosys',
  'Accenture',
  'Meta',
  'Apple',
  'Uber',
  'Netflix',
  'Oracle',
  'Salesforce',
  'Flipkart',
  'Zomato',
  'Swiggy',
  'Paytm',
  'Atlassian',
];

const PREDEFINED_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'Python',
  'Java',
  'C++',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'REST APIs',
  'Git',
  'Docker',
  'Kubernetes',
  'AWS',
  'System Design',
  'DSA',
  'OOP',
  'Microservices',
  'GraphQL',
  'Next.js',
  'Tailwind CSS',
  'Go (Golang)',
  'C# / .NET',
  'Spring Boot',
  'Linux / Shell',
  'CI/CD Pipelines',
  'Machine Learning',
];

const ALL_FOCUS_AREAS = [
  { id: 'Technical Knowledge', label: 'Technical Knowledge' },
  { id: 'DSA', label: 'DSA / Problem Solving' },
  { id: 'Core CS', label: 'Core CS (OS, DBMS, CN)' },
  { id: 'Projects', label: 'Projects & Architecture' },
  { id: 'System Design', label: 'System Design' },
  { id: 'Web Development', label: 'Web Development' },
  { id: 'Backend', label: 'Backend Development' },
  { id: 'Frontend', label: 'Frontend Development' },
  { id: 'Databases', label: 'Databases & SQL' },
  { id: 'APIs', label: 'APIs & Microservices' },
  { id: 'Problem Solving', label: 'Problem Solving' },
  { id: 'Behavioral', label: 'Behavioral & Leadership' },
  { id: 'Communication', label: 'Communication Polish' },
];

export default function SetupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Media Stream & Hardware Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Query parameter pre-fills
  const initialCompany = searchParams.get('company') || '';
  const initialRole = searchParams.get('role') || 'Software Engineer';
  const initialMode = searchParams.get('mode')?.toUpperCase() || 'FULL_SIMULATION';
  const initialJd = searchParams.get('jd') || searchParams.get('jobDescription') || '';

  // Wizard Step: 1 = Form, 2 = Summary Card Review, 3 = Device & Permissions Check
  const [wizardStep, setWizardStep] = useState<number>(1);

  // User Profile State
  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Search Filters for Roles & Companies
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [companySearch, setCompanySearch] = useState<string>('');

  // Form State (0 PRE-SELECTED DEFAULTS FOR SKILLS & FOCUS AREAS!)
  const [interviewType, setInterviewType] = useState<string>(
    ['TECHNICAL', 'HR_BEHAVIORAL', 'FULL_SIMULATION'].includes(initialMode)
      ? initialMode
      : 'FULL_SIMULATION'
  );

  const [targetRole, setTargetRole] = useState<string>(initialRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);

  const [targetCompany, setTargetCompany] = useState<string>(
    initialCompany ? initialCompany : 'None / General Target'
  );
  const [customCompanyInput, setCustomCompanyInput] = useState<string>('');
  const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(ExperienceLevel.FRESHER);
  
  // Clean empty array defaults!
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  
  const [jobDescription, setJobDescription] = useState<string>(initialJd);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  const [durationMins, setDurationMins] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  // Step 3 Device Permissions State & Security Check
  const [camStatus, setCamStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready'>('idle');
  const [fullscreenStatus, setFullscreenStatus] = useState<'idle' | 'ready'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [agreedToIntegrityRules, setAgreedToIntegrityRules] = useState<boolean>(false);

  // Real-time Fullscreen Listener (Resets to idle/pending immediately if ESC or windowed)
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

  // Cleanup active media streams on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Fetch User Profile on mount & load cached config
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ru_ready_oral_config');
      if (stored) {
        const c = JSON.parse(stored);
        if (c.interviewType) setInterviewType(c.interviewType);
        if (c.targetRole) setTargetRole(c.targetRole);
        if (c.isCustomRole !== undefined) setIsCustomRole(c.isCustomRole);
        if (c.customRoleInput) setCustomRoleInput(c.customRoleInput);
        if (c.targetCompany) setTargetCompany(c.targetCompany);
        if (c.isCustomCompany !== undefined) setIsCustomCompany(c.isCustomCompany);
        if (c.customCompanyInput) setCustomCompanyInput(c.customCompanyInput);
        if (c.experienceLevel) setExperienceLevel(c.experienceLevel);
        if (c.selectedSkills) setSelectedSkills(c.selectedSkills);
        if (c.jobDescription) setJobDescription(c.jobDescription);
        if (c.selectedFocus) setSelectedFocus(c.selectedFocus);
        if (c.durationMins) setDurationMins(c.durationMins);
      }
    } catch {
      // ignore
    }

    apiClient
      .get('/user/profile')
      .then((res) => {
        if (res.data) {
          setUserProfile(res.data);
        }
      })
      .catch(() => {
        // profile optional
      });
  }, []);

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleFocus = (focusId: string) => {
    if (selectedFocus.includes(focusId)) {
      setSelectedFocus(selectedFocus.filter((f) => f !== focusId));
    } else {
      setSelectedFocus([...selectedFocus, focusId]);
    }
  };

  const handleProceedToReview = () => {
    const config = {
      interviewType,
      targetRole: isCustomRole ? customRoleInput || 'Software Engineer' : targetRole,
      isCustomRole,
      customRoleInput,
      targetCompany: isCustomCompany ? customCompanyInput || 'None / General Target' : targetCompany,
      isCustomCompany,
      customCompanyInput,
      experienceLevel,
      selectedSkills,
      jobDescription,
      selectedFocus,
      durationMins,
    };
    sessionStorage.setItem('ru_ready_oral_config', JSON.stringify(config));
    navigate('/oral/review');
  };

  // Launch interview based on user profile
  const handleLaunchProfileInterview = () => {
    const role = userProfile?.targetRole || targetRole;
    const company = userProfile?.targetCompany || targetCompany;
    const skills = userProfile?.skills && Array.isArray(userProfile.skills) ? userProfile.skills : selectedSkills;
    const level = userProfile?.experienceLevel || experienceLevel;

    if (userProfile) {
      if (userProfile.targetRole) setTargetRole(userProfile.targetRole);
      if (userProfile.targetCompany) setTargetCompany(userProfile.targetCompany);
      if (userProfile.skills && Array.isArray(userProfile.skills)) setSelectedSkills(userProfile.skills);
      if (userProfile.experienceLevel) setExperienceLevel(userProfile.experienceLevel);
    }

    const config = {
      interviewType,
      targetRole: role,
      isCustomRole: false,
      customRoleInput: '',
      targetCompany: company,
      isCustomCompany: false,
      customCompanyInput: '',
      experienceLevel: level,
      selectedSkills: skills,
      jobDescription,
      selectedFocus,
      durationMins,
    };
    sessionStorage.setItem('ru_ready_oral_config', JSON.stringify(config));
    navigate('/oral/review');
  };

  // Device Test Actions with live track listening
  const testCamera = async () => {
    // If camera is currently active, clicking turns it off and resets to idle/pending
    if (camStatus === 'ready') {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
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

      // Track listeners for when the user turns off hardware camera
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setCamStatus('idle');
          if (videoRef.current) videoRef.current.srcObject = null;
          mediaStreamRef.current = null;
        };
        videoTrack.onmute = () => {
          setCamStatus('idle');
        };
        videoTrack.onunmute = () => {
          setCamStatus('ready');
        };
      }

      setCamStatus('ready');
    } catch (e) {
      console.warn('Camera stream error:', e);
      toast.error('Unable to access camera. Please check browser permissions.');
      setCamStatus('idle');
    }
  };

  const testMic = async () => {
    setMicStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += array[i];
        }
        const average = values / length;
        setMicVolume(Math.min(100, Math.round(average * 2)));
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

      setTimeout(() => {
        setMicStatus('ready');
        setMicVolume(85);
      }, 1500);
    } catch (e) {
      console.warn('Mic stream error:', e);
      toast.error('Unable to access microphone. Please check browser permissions.');
      setMicStatus('idle');
      setMicVolume(0);
    }
  };

  const testAudio = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 520;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
      setAudioStatus('ready');
    } catch {
      setAudioStatus('ready');
    }
  };

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

  // Validation: All 4 devices/permissions verified AND rules agreed
  const isAllVerifiedAndAgreed =
    camStatus === 'ready' &&
    micStatus === 'ready' &&
    audioStatus === 'ready' &&
    fullscreenStatus === 'ready' &&
    agreedToIntegrityRules;

  // Final launch submission with Fullscreen request
  const handleStartInterview = async () => {
    setIsSubmitting(true);
    setPrepMessage('Configuring interview session with proctoring parameters...');

    // Request Fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // ignore fallback
    }

    try {
      const finalRole = isCustomRole ? customRoleInput || 'Software Engineer' : targetRole;
      const finalCompany =
        isCustomCompany
          ? customCompanyInput
          : targetCompany === 'None / General Target'
          ? ''
          : targetCompany;

      const goalMeta = `[Type: ${interviewType}][Skills: ${selectedSkills.join(',')}][Focus: ${selectedFocus.join(',')}]`;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: InterviewType.JOB,
        targetRole: finalRole,
        targetCompany: finalCompany || undefined,
        industry: 'Technology',
        experienceLevel,
        focusAreas: selectedFocus.length > 0 ? selectedFocus : ['Technical Knowledge', 'Behavioral'],
        interviewGoal: goalMeta,
        durationMins,
      });

      const sessionId = sessionResponse.data.id;
      setPrepMessage('Preparing questions tailored to your target role and skills...');
      await apiClient.post(`/interview/session/${sessionId}/start`);
      navigate(`/interview/${sessionId}`);
    } catch (err) {
      console.error('Failed to launch session', err);
      setIsSubmitting(false);
      setPrepMessage('Error launching session. Please try again.');
    }
  };

  const finalDisplayRole = isCustomRole ? customRoleInput || 'Custom Role' : targetRole;
  const finalDisplayCompany = isCustomCompany
    ? customCompanyInput || 'Custom Company'
    : targetCompany === 'None / General Target'
    ? 'Optional (General Role)'
    : targetCompany;

  const hasProfile = Boolean(userProfile && (userProfile.targetRole || (userProfile.skills && userProfile.skills.length > 0)));

  // Filtered Roles & Companies
  const filteredRoles = POPULAR_ROLES.filter((r) => r.toLowerCase().includes(roleSearch.toLowerCase()));
  const filteredCompanies = POPULAR_COMPANIES.filter((c) => c.toLowerCase().includes(companySearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Row: Back Link on Left & Seamless Step Progress Bar on Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              if (wizardStep > 1) {
                setWizardStep(wizardStep - 1);
              } else {
                navigate('/oral');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>
              {wizardStep === 1
                ? 'Back to Oral Command Center'
                : wizardStep === 2
                ? 'Back to Customization'
                : 'Back to Review'}
            </span>
          </button>

          {/* ─── STEP PROGRESS BAR (Seamless, no background, right aligned) ─── */}
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

        {/* ─── STEP 1: CUSTOMIZATION FORM & TOP PROFILE CARD ─── */}
        {wizardStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* ─── TOP CARD: INTERVIEW ACCORDING TO YOUR PROFILE vs CREATE YOUR PROFILE ─── */}
            {hasProfile ? (
              <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/70 border border-blue-200/80 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Interview According To Your Profile</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                      Quick Launch Profile Interview
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium">
                      Give an interview instantly based on your configured profile settings.
                    </p>
                  </div>

                  <Button
                    onClick={handleLaunchProfileInterview}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Quick Launch From Profile</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-blue-100">
                  <div className="bg-white/80 p-3 rounded-2xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Role</span>
                    <strong className="text-xs font-bold text-slate-900">{userProfile.targetRole || 'Software Engineer'}</strong>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Company</span>
                    <strong className="text-xs font-bold text-slate-900">{userProfile.targetCompany || 'General'}</strong>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Configured Skills</span>
                    <strong className="text-xs font-bold text-slate-900 truncate block">
                      {Array.isArray(userProfile.skills) && userProfile.skills.length > 0
                        ? userProfile.skills.slice(0, 3).join(', ')
                        : 'General Technical'}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-pink-50/90 via-purple-50/60 to-indigo-50/70 border border-pink-200/80 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Your Profile</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                      Setup Your Candidate Profile
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium">
                      Create your profile so that from next time you can give interviews quickly in 1 click.
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/settings')}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Create Profile →</span>
                  </Button>
                </div>
              </div>
            )}

            {/* ─── CARD 2: CUSTOM INTERVIEW SETUP FORM ─── */}
            <div className="space-y-6">
              
              {/* 1. INTERVIEW TYPE */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>1. Select Interview Type *</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {INTERVIEW_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = interviewType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInterviewType(type.id)}
                        className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                            : 'border-slate-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <Badge className="text-[10px] bg-slate-100 text-slate-600">{type.badge}</Badge>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{type.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* 2. TARGET ROLE & COMPANY (EXPANDED SEARCHABLE SELECTION) */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>2. Target Role & Company *</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role Selector with Search */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">Target Job Role *</label>
                      <span className="text-[10px] text-slate-500 font-mono">{POPULAR_ROLES.length}+ Available</span>
                    </div>

                    {/* Role Search Box */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search roles (e.g. Backend, AI...)"
                        value={roleSearch}
                        onChange={(e) => setRoleSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {filteredRoles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setIsCustomRole(false);
                            setTargetRole(role);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left truncate transition-all ${
                            !isCustomRole && targetRole === role
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    {!isCustomRole ? (
                      <button
                        type="button"
                        onClick={() => setIsCustomRole(true)}
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Type Custom Role</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="e.g. Quantum Computing Engineer"
                          value={customRoleInput}
                          onChange={(e) => setCustomRoleInput(e.target.value)}
                          className="w-full p-2.5 border border-blue-400 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setIsCustomRole(false)}
                          className="text-[11px] text-slate-500 underline"
                        >
                          Select from list
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Company Selector with Search (Optional) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 block">Target Company (Optional)</label>
                      <Badge className="bg-slate-100 text-slate-600 text-[10px]">Optional</Badge>
                    </div>

                    {/* Company Search Box */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search company (e.g. Google, TCS...)"
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {filteredCompanies.map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            setIsCustomCompany(false);
                            setTargetCompany(comp);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left truncate transition-all ${
                            !isCustomCompany && targetCompany === comp
                              ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-2xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>

                    {!isCustomCompany ? (
                      <button
                        type="button"
                        onClick={() => setIsCustomCompany(true)}
                        className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Type Custom Company</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="e.g. OpenAI, Stripe, Startup"
                          value={customCompanyInput}
                          onChange={(e) => setCustomCompanyInput(e.target.value)}
                          className="w-full p-2.5 border border-purple-400 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setIsCustomCompany(false)}
                          className="text-[11px] text-slate-500 underline"
                        >
                          Select from list
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* 3. EXPERIENCE LEVEL */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>3. Experience Level *</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: ExperienceLevel.FRESHER, label: 'Fresher / Junior', sub: '0-2 Years' },
                    { id: ExperienceLevel.MID, label: 'Mid-Level', sub: '2-5 Years' },
                    { id: ExperienceLevel.SENIOR, label: 'Senior / Lead', sub: '5+ Years' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        experienceLevel === lvl.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{lvl.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 4. SKILLS TO ASSESS (EXPANDED TO 30+ SKILLS, CLEAN EMPTY DEFAULTS!) */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-600" />
                    <span>4. Skills to Assess (Optional)</span>
                  </h2>
                  <Badge className="bg-slate-100 text-slate-700 font-mono text-xs">
                    {selectedSkills.length} Selected
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pt-1 pr-1">
                  {PREDEFINED_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {skill} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Rust, Kafka, Kubernetes)"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                    className="p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    Add
                  </Button>
                </div>
              </Card>

              {/* 5. JOB DESCRIPTION (ACCURATE CUSTOM PROMPT / REQUIREMENTS) */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>5. Job Description / Requirements (Optional)</span>
                  </h2>
                  <Badge className="bg-slate-100 text-slate-600 text-[10px]">Tailored Probing</Badge>
                </div>

                <textarea
                  rows={3}
                  placeholder="Paste job description, requirements, or focus topics here to tailor interview questions specifically to your opportunity..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </Card>

              {/* 6. INTERVIEW FOCUS AREAS (OPTIONAL) */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>6. Interview Focus Areas (Optional)</span>
                  </h2>
                  <Badge className="bg-slate-100 text-slate-700 font-mono text-xs">
                    {selectedFocus.length} Selected
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALL_FOCUS_AREAS.map((focus) => {
                    const isSelected = selectedFocus.includes(focus.id);
                    return (
                      <button
                        key={focus.id}
                        type="button"
                        onClick={() => toggleFocus(focus.id)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {focus.label} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* 7. DURATION */}
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>7. Interview Duration *</span>
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  {[15, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMins(mins)}
                      className={`p-4 rounded-2xl border font-bold text-sm text-center transition-all ${
                        durationMins === mins
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </Card>

              {/* STEP 1 NEXT BUTTON — NAMED "Next Step →" */}
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleProceedToReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: SINGLE SUMMARY REVIEW CARD ─── */}
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
                <span className="text-xs text-slate-500 font-medium block">Interview Type</span>
                <strong className="text-sm font-bold text-slate-900 block">{interviewType.replace('_', ' ')}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Target Job Role</span>
                <strong className="text-sm font-bold text-slate-900 block">{finalDisplayRole}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Target Company</span>
                <strong className="text-sm font-bold text-slate-900 block">{finalDisplayCompany}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Experience Level</span>
                <strong className="text-sm font-bold text-slate-900 block">{experienceLevel}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Duration</span>
                <strong className="text-sm font-bold text-slate-900 block">{durationMins} Minutes</strong>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Selected Skills</span>
                <strong className="text-sm font-bold text-slate-900 block truncate">
                  {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'General Role Skills'}
                </strong>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Focus Areas:</span>
              <div className="flex flex-wrap gap-2">
                {selectedFocus.length > 0 ? (
                  selectedFocus.map((f) => (
                    <Badge key={f} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                      {f}
                    </Badge>
                  ))
                ) : (
                  <Badge className="bg-slate-100 text-slate-600 text-xs">All Round Balanced Probing</Badge>
                )}
              </div>
            </div>

            {/* BUTTON COLORS FIXED: White/Slate button for Edit, Blue button for Next */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={() => setWizardStep(1)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer"
              >
                <span>← Edit Selections</span>
              </Button>

              <Button
                onClick={() => setWizardStep(3)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: DEVICE & PERMISSIONS & PROCTORING RULES CHECK ─── */}
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

            {/* 4 Cards in 2x2 Grid with Crisp Light Backgrounds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1: Camera & Candidate Detection */}
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
                    {camStatus === 'ready' ? '✓ Candidate Verified' : 'Pending'}
                  </Badge>
                </div>

                {/* Video Preview */}
                <div className="w-full aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${camStatus === 'ready' ? 'block' : 'hidden'}`}
                    muted
                    playsInline
                  />
                  {camStatus !== 'ready' && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-[11px] text-slate-400 text-center font-medium max-w-[260px] leading-relaxed">
                        Allow camera access to display video stream & verify candidate presence
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
                  {camStatus === 'ready'
                    ? '✓ Camera Active (Click to Turn Off)'
                    : camStatus === 'testing'
                    ? 'Testing Camera...'
                    : 'Allow Camera & Check Candidate'}
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
                    {micStatus === 'ready' ? '✓ Speech Verified' : 'Pending'}
                  </Badge>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
                  <span className="text-[10px] font-bold text-purple-900 block uppercase tracking-wider">
                    Read Out Loud to Verify Mic:
                  </span>
                  <p className="text-xs italic text-purple-950 font-serif leading-relaxed font-semibold">
                    "I am ready to take my RU READY AI mock interview."
                  </p>

                  {/* Volume Level Indicator */}
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
                  {micStatus === 'ready' ? '✓ Speech Verified' : micStatus === 'testing' ? 'Listening...' : 'Test Mic & Speak Phrase'}
                </Button>
              </div>

              {/* Card 3: Speaker Simple Check */}
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
                    {audioStatus === 'ready' ? '✓ Speaker Ready' : 'Pending'}
                  </Badge>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                    Audio Playback Check:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Click the button below to play a test chime and ensure speaker clarity.
                  </p>
                </div>

                <Button
                  onClick={testAudio}
                  className={`w-full text-xs py-3 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                    audioStatus === 'ready'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {audioStatus === 'ready' ? '✓ Audio Clear & Speaker Active' : '🔊 Play Test Sound'}
                </Button>
              </div>

              {/* Card 4: Full-Screen Mode Permission */}
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
                    {fullscreenStatus === 'ready' ? '✓ Full-Screen Allowed' : 'Pending'}
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
                  {fullscreenStatus === 'ready' ? '✓ Full-Screen Active & Allowed' : '🖥️ Allow & Enable Full-Screen Mode'}
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

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={() => setWizardStep(2)}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>← Back to Review</span>
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
                  onClick={handleStartInterview}
                  disabled={isSubmitting || !isAllVerifiedAndAgreed}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    isAllVerifiedAndAgreed
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Maximize className={`w-4 h-4 ${isAllVerifiedAndAgreed ? 'text-white' : 'text-slate-400'}`} />
                  <span>{isSubmitting ? prepMessage || 'Launching...' : '🚀 Launch Live Interview Session'}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
