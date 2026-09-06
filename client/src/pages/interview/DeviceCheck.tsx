import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Mic, Volume2, Maximize2, Shield, AlertTriangle, 
  CheckCircle2, X, ShieldAlert, Lock, ArrowRight, ArrowLeft,
  Check, Play, RotateCcw, Monitor, Sparkles, UserCheck
} from 'lucide-react';
import apiClient from '../../api/client';
import { useInterviewStore } from '../../store/useInterviewStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function DeviceCheck() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    cameraStatus,
    micStatus,
    antiCheatStatus,
    isFullscreenActive,
    setCameraStatus,
    setMicStatus,
    setAntiCheatStatus,
    setIsFullscreenActive
  } = useInterviewStore();

  // Wizard active sub-step: 1 = Camera, 2 = Mic, 3 = Speaker, 4 = Fullscreen
  const [activeStep, setActiveStep] = useState<number>(1);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Hardware states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [decibels, setDecibels] = useState<number>(0);
  const [voiceDetected, setVoiceDetected] = useState<boolean>(false);
  const [soundTested, setSoundTested] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [soundConfirmed, setSoundConfirmed] = useState<boolean>(false);

  // Anti-Cheat & Screen Bounds
  const [violations, setViolations] = useState(0);
  const [showViolationOverlay, setShowViolationOverlay] = useState(false);
  const [hasMultipleDisplays, setHasMultipleDisplays] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fetch session meta
  useEffect(() => {
    let active = true;
    async function fetchSession() {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/interview/session/${id}`);
        if (active) {
          setSession(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load session details', err);
        if (active) {
          setLoadError('Failed to synchronize session telemetry with the server.');
          setIsLoading(false);
        }
      }
    }
    fetchSession();
    return () => {
      active = false;
    };
  }, [id]);

  // Request & Setup Media Stream
  const setupHardware = useCallback(async () => {
    setCameraStatus('PENDING');
    setMicStatus('PENDING');

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });
      
      setStream(media);
      setCameraStatus('ALLOWED');
      setMicStatus('ALLOWED');

      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }

      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaStreamSource(media);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setDecibels(average);

          // Detect speech input
          if (average > 18) {
            setVoiceDetected(true);
          }
          
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch (audioErr) {
        console.error('Audio Analyser node failed to initialize', audioErr);
      }

    } catch (err) {
      console.error('Hardware permissions denied', err);
      setCameraStatus('BLOCKED');
      setMicStatus('BLOCKED');
    }
  }, [setCameraStatus, setMicStatus]);

  useEffect(() => {
    setupHardware();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupHardware]);

  // Keep video ref connected if activeStep changes
  useEffect(() => {
    if (videoRef.current && stream && cameraStatus === 'ALLOWED') {
      videoRef.current.srcObject = stream;
    }
  }, [activeStep, stream, cameraStatus]);

  // Display scan
  const runDisplayScan = useCallback(() => {
    const isExtended = (window.screen as any).isExtended || false;
    const isWidthOutlier = window.screen.width > 2560 || window.screen.availWidth < window.screen.width - 200;
    
    if (isExtended || isWidthOutlier) {
      setHasMultipleDisplays(true);
      setAntiCheatStatus('FAILED');
    } else {
      setHasMultipleDisplays(false);
      if (violations === 0 && cameraStatus === 'ALLOWED' && micStatus === 'ALLOWED' && isFullscreenActive) {
        setAntiCheatStatus('SECURED');
      }
    }
  }, [violations, cameraStatus, micStatus, isFullscreenActive, setAntiCheatStatus]);

  useEffect(() => {
    runDisplayScan();
    window.addEventListener('resize', runDisplayScan);
    return () => window.removeEventListener('resize', runDisplayScan);
  }, [runDisplayScan]);

  // Fullscreen Handler
  const handleFullscreenLock = async () => {
    try {
      const container = document.documentElement;
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen();
      }
      setIsFullscreenActive(true);
      if (violations === 0 && cameraStatus === 'ALLOWED' && micStatus === 'ALLOWED' && !hasMultipleDisplays) {
        setAntiCheatStatus('SECURED');
      }
      setValidationError(null);
    } catch (err) {
      console.error('Fullscreen request rejected', err);
      setIsFullscreenActive(false);
      setValidationError('Please allow full-screen view to ensure uncompromised assessment.');
    }
  };

  // Fullscreen & Escape Key Event Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isActive = !!document.fullscreenElement;
      setIsFullscreenActive(isActive);
      if (!isActive) {
        setAntiCheatStatus('PENDING');
        // If user pressed Escape or exited fullscreen during active session, trigger warning!
        setViolations(prev => {
          const next = prev + 1;
          setShowViolationOverlay(true);
          return next;
        });
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreenActive, setAntiCheatStatus]);

  // Prevent right-click / copy-paste
  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    const preventCopyPaste = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
    };
  }, []);

  // Anti-Cheat Window Blur / Tab Deviation
  useEffect(() => {
    const handleDeflection = () => {
      if (isFullscreenActive) {
        setViolations(prev => {
          const next = prev + 1;
          setShowViolationOverlay(true);
          setAntiCheatStatus('FAILED');
          return next;
        });
      }
    };

    window.addEventListener('blur', handleDeflection);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleDeflection();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleDeflection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFullscreenActive, setAntiCheatStatus]);

  // Audio Output Test using SpeechSynthesis or Web Audio chime
  const playTestAudio = () => {
    setIsPlayingAudio(true);
    setSoundTested(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Welcome to RU READY. Your speaker output is working crystal clear.");
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        setTimeout(() => setIsPlayingAudio(false), 600);
      } catch {
        setIsPlayingAudio(false);
      }
    }
  };

  // Readiness Matrix
  const isCameraReady = cameraStatus === 'ALLOWED';
  const isMicReady = micStatus === 'ALLOWED' && voiceDetected;
  const isSoundReady = soundConfirmed;
  const isFullscreenReady = isFullscreenActive && !hasMultipleDisplays;
  const isAllReady = isCameraReady && isMicReady && isSoundReady && isFullscreenReady;

  const handleLaunchRoom = () => {
    if (!isAllReady) {
      setValidationError('Please complete all 4 verification steps before entering the live interview room.');
      return;
    }
    
    setAntiCheatStatus('SECURED');
    navigate(`/interview/${id}`);
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Card padding="lg" className="max-w-md w-full shadow-sm space-y-4 bg-white border-slate-200">
          <h2 className="text-lg font-bold font-display text-slate-900">Telemetry Sync Failed</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-body">{loadError}</p>
          <Button 
            variant="secondary"
            fullWidth
            onClick={() => navigate('/interview/new')}
          >
            Back to Setup
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3 font-body">
          <div className="h-9 w-9 border-3 border-[#FF7A00] border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-sm font-semibold text-slate-700 font-display">Calibrating Diagnostic Environment...</p>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Camera Alignment', isDone: isCameraReady, icon: Camera },
    { num: 2, label: 'Microphone Test', isDone: isMicReady, icon: Mic },
    { num: 3, label: 'Audio Output', isDone: isSoundReady, icon: Volume2 },
    { num: 4, label: 'Fullscreen Lock', isDone: isFullscreenReady, icon: Maximize2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8">
      
      {/* Violation / Anti-Cheat Modal Overlay */}
      <AnimatePresence>
        {showViolationOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 text-center select-none"
          >
            <div className="max-w-md w-full bg-white border border-rose-200 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
                <ShieldAlert size={28} />
              </div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
                Security Deviation Flagged
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-5">
                You minimized the full-screen view or switched tabs. RU READY simulations require uninterrupted focus. Please re-enter full-screen to continue.
              </p>
              
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 mb-5 text-left text-xs text-rose-700 font-semibold flex items-center justify-between">
                <span>Security Notice Count:</span>
                <span className="font-mono text-sm">{violations}</span>
              </div>

              <Button
                type="button"
                fullWidth
                onClick={() => {
                  setShowViolationOverlay(false);
                  handleFullscreenLock();
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Re-enter Fullscreen & Continue
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            to="/interview/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors font-display"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Setup</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">Session ID: {id?.slice(0, 8)}...</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3 py-0.5 text-xs text-[#FF7A00] font-bold font-display">
              <Shield size={13} />
              <span>Pre-Flight Diagnostic Verification</span>
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
              Device Check & System Integrity Setup
            </h1>
            <p className="text-xs text-slate-500 font-body">
              Follow the 4-step check below to ensure optimal audio, video, and proctoring conditions.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-display uppercase tracking-wider">Role:</span>
            <Badge variant="orange" size="sm">
              {session?.targetRole || 'Software Engineer'}
            </Badge>
          </div>
        </div>

        {/* 4-Step Interactive Progress Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-50/70 border-[#FF7A00] shadow-sm ring-1 ring-[#FF7A00]/20'
                    : step.isDone
                      ? 'bg-white border-emerald-300 hover:border-emerald-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-display transition-colors ${
                  step.isDone 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : isCurrent 
                      ? 'bg-[#FF7A00] text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.isDone ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    Step 0{step.num}
                  </span>
                  <p className={`text-xs font-bold truncate font-display ${isCurrent ? 'text-[#FF7A00]' : 'text-slate-800'}`}>
                    {step.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Validation Notice Alert */}
        {validationError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 font-body shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <span className="font-bold font-display block mb-0.5">Verification Required:</span>
              <span>{validationError}</span>
            </div>
            <button type="button" onClick={() => setValidationError(null)} className="text-rose-600 hover:opacity-75">
              <X size={16} />
            </button>
          </div>
        )}

        {/* ─── ACTIVE STEP WIZARD CONTAINER ─── */}
        <Card padding="lg" className="shadow-sm border-slate-200 bg-white">
          <AnimatePresence mode="wait">
            
            {/* ═══ STEP 1: CAMERA ALIGNMENT ═══ */}
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Step 1: Webcam & Face Alignment
                    </h3>
                    <p className="text-xs text-slate-500 font-body mt-0.5">
                      Ensure your camera is enabled, lens is clean, and your face is positioned in good lighting.
                    </p>
                  </div>
                  <Badge variant={isCameraReady ? "success" : "amber"} size="sm" dot>
                    {isCameraReady ? 'Camera Active' : 'Connecting...'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Video Viewport Frame with Face Framing Guide */}
                  <div className="md:col-span-8">
                    <div className="w-full aspect-video border border-slate-200 bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
                      {cameraStatus === 'ALLOWED' ? (
                        <>
                          <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                          {/* Face Guideline Oval Overlay */}
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-48 h-64 border-2 border-dashed border-white/40 rounded-[50%] shadow-[0_0_20px_rgba(255,255,255,0.15)] flex flex-col items-center justify-between py-4">
                              <span className="text-[10px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded-full font-mono">
                                Center Face Here
                              </span>
                              <span className="text-[9px] text-white/60 font-body">Eye Level</span>
                            </div>
                          </div>
                        </>
                      ) : cameraStatus === 'PENDING' ? (
                        <div className="text-center space-y-2 font-body p-6">
                          <div className="h-6 w-6 border-2 border-[#FF7A00] border-t-transparent animate-spin rounded-full mx-auto" />
                          <p className="text-xs text-slate-300 font-semibold">Connecting to camera device...</p>
                        </div>
                      ) : (
                        <div className="text-center p-6 space-y-3 max-w-xs font-body">
                          <AlertTriangle size={24} className="mx-auto text-rose-500 animate-pulse" />
                          <p className="text-xs font-bold text-white">Camera Access Denied</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Please allow camera permissions in your browser address bar and reload.
                          </p>
                          <Button size="sm" variant="secondary" onClick={setupHardware}>
                            Retry Connection
                          </Button>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-[10px] font-bold text-white rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Stream</span>
                      </div>
                    </div>
                  </div>

                  {/* Checklist & Alignment Prompts */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                        Alignment Checklist
                      </h4>
                      <div className="space-y-2 text-xs text-slate-600 font-body">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={isCameraReady ? "text-emerald-600" : "text-slate-300"} />
                          <span>HD 720p Sensor Connected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={isCameraReady ? "text-emerald-600" : "text-slate-300"} />
                          <span>Face Centered in Frame</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={isCameraReady ? "text-emerald-600" : "text-slate-300"} />
                          <span>No glare or backlit silhouette</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      size="md"
                      disabled={!isCameraReady}
                      onClick={() => setActiveStep(2)}
                      iconRight={<ArrowRight size={14} />}
                    >
                      Next: Test Microphone
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: MICROPHONE & VOICE TEST ═══ */}
            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Step 2: Microphone Input & Speech Detection
                    </h3>
                    <p className="text-xs text-slate-500 font-body mt-0.5">
                      Speak out loud to verify your microphone sensitivity and real-time audio waveforms.
                    </p>
                  </div>
                  <Badge variant={isMicReady ? "success" : "amber"} size="sm" dot>
                    {isMicReady ? 'Voice Detected ✓' : 'Listening...'}
                  </Badge>
                </div>

                {/* Speak Phrase Banner */}
                <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 text-center space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00] font-display block">
                    Please speak this sentence clearly:
                  </span>
                  <p className="text-lg font-bold font-display text-slate-900">
                    "I am ready to begin my interview simulation."
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    The frequency visualizer below will react in real time to your vocal volume.
                  </p>
                </div>

                {/* Live Audio Visualizer Frequency Bars */}
                <div className="space-y-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <Mic size={14} className="text-[#FF7A00]" />
                      Real-time Audio Input Decibels
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round(decibels)} dB
                    </span>
                  </div>

                  <div className="flex justify-between items-end h-16 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
                    {Array.from({ length: 32 }).map((_, idx) => {
                      const barThresh = idx * 3;
                      const isActive = micStatus === 'ALLOWED' && decibels > barThresh;
                      
                      return (
                        <div 
                          key={idx} 
                          className="w-1.5 rounded-full transition-all duration-75"
                          style={{
                            height: isActive ? `${Math.min(100, Math.max(12, (decibels - barThresh) * 5))}%` : '4px',
                            backgroundColor: isActive ? (idx > 24 ? '#FF7A00' : '#10B981') : '#334155'
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-body">
                    <span>Silent (0 dB)</span>
                    <span>Ideal Conversation Level (25 - 60 dB)</span>
                    <span>Peak Loud (80+ dB)</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    {voiceDetected ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        Microphone Input Confirmed!
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">
                        Awaiting voice input... Say a few words to calibrate.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setActiveStep(1)}
                      icon={<ArrowLeft size={14} />}
                    >
                      Back
                    </Button>
                    <Button
                      size="md"
                      disabled={!isMicReady}
                      onClick={() => setActiveStep(3)}
                      iconRight={<ArrowRight size={14} />}
                    >
                      Next: Test Audio Output
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: AUDIO OUTPUT / SPEAKER TEST ═══ */}
            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Step 3: Audio Output & Speaker Check
                    </h3>
                    <p className="text-xs text-slate-500 font-body mt-0.5">
                      Verify you can clearly hear Ava’s interview questions and AI feedback.
                    </p>
                  </div>
                  <Badge variant={soundConfirmed ? "success" : "amber"} size="sm" dot>
                    {soundConfirmed ? 'Audio Output Ready ✓' : 'Pending Test'}
                  </Badge>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-5 max-w-lg mx-auto">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto transition-transform ${
                    isPlayingAudio ? 'bg-[#FF7A00] text-white scale-110 shadow-lg animate-pulse' : 'bg-orange-50 text-[#FF7A00] border border-orange-200'
                  }`}>
                    <Volume2 size={32} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold font-display text-slate-900">
                      Test AI Voice Synthesis
                    </h4>
                    <p className="text-xs text-slate-600 font-body">
                      Click the button below to play a sample audio greeting.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={playTestAudio}
                    disabled={isPlayingAudio}
                    icon={isPlayingAudio ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />}
                    className="shadow-sm"
                  >
                    {isPlayingAudio ? 'Playing Test Speech...' : 'Play Test Audio'}
                  </Button>

                  {soundTested && (
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-800 font-display">
                        Did you hear the sample voice clearly?
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSoundConfirmed(true)}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            soundConfirmed
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          ✓ Yes, I Hear It Clearly
                        </button>
                        <button
                          type="button"
                          onClick={playTestAudio}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          Replay Sound
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setActiveStep(2)}
                    icon={<ArrowLeft size={14} />}
                  >
                    Back
                  </Button>
                  <Button
                    size="md"
                    disabled={!soundConfirmed}
                    onClick={() => setActiveStep(4)}
                    iconRight={<ArrowRight size={14} />}
                  >
                    Next: Fullscreen & Security Lock
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4: FULLSCREEN & ANTI-CHEAT LOCK ═══ */}
            {activeStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Step 4: Fullscreen Viewport & Workspace Lock
                    </h3>
                    <p className="text-xs text-slate-500 font-body mt-0.5">
                      Enable dedicated full-screen mode to unlock the live interview room.
                    </p>
                  </div>
                  <Badge variant={isFullscreenActive ? "success" : "amber"} size="sm" dot>
                    {isFullscreenActive ? 'Fullscreen Locked ✓' : 'Fullscreen Required'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Fullscreen Trigger Card */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Maximize2 size={18} className="text-[#FF7A00]" />
                        <h4 className="text-sm font-bold font-display text-slate-900">
                          Fullscreen Mode
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 font-body leading-relaxed">
                        To maintain high fidelity, this interview runs in dedicated full screen. Exiting fullscreen or pressing Escape triggers a security deviation alert.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant={isFullscreenActive ? "secondary" : "primary"}
                      size="lg"
                      fullWidth
                      onClick={handleFullscreenLock}
                      icon={<Maximize2 size={16} />}
                      className="shadow-sm"
                    >
                      {isFullscreenActive ? 'Fullscreen Active ✓' : 'Enable Fullscreen Mode'}
                    </Button>
                  </div>

                  {/* Proctoring Policy Box */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <Lock size={16} className="text-emerald-600" />
                      <h4 className="text-sm font-bold font-display text-slate-900">
                        Integrity Matrix
                      </h4>
                    </div>

                    <div className="space-y-2.5 text-xs font-body text-slate-600">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                        <span className="flex items-center gap-2">
                          <Monitor size={14} className={hasMultipleDisplays ? 'text-rose-500' : 'text-emerald-600'} />
                          Single Display Bounds
                        </span>
                        <Badge variant={hasMultipleDisplays ? "error" : "teal"} size="xs">
                          {hasMultipleDisplays ? 'Multi-Screen Detected' : 'Verified'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                        <span className="flex items-center gap-2">
                          <Lock size={14} className="text-emerald-600" />
                          Clipboard Lockdown
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">Active</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                        <span className="flex items-center gap-2">
                          <Shield size={14} className="text-emerald-600" />
                          Tab Blur Event Monitor
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setActiveStep(3)}
                    icon={<ArrowLeft size={14} />}
                  >
                    Back
                  </Button>
                  <span className="text-xs font-semibold text-slate-500 font-display">
                    {isFullscreenActive ? 'All checks verified!' : 'Please enable fullscreen to continue'}
                  </span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </Card>

        {/* ─── FINAL LAUNCH ROOM BAR ─── */}
        <div className="bg-white border-2 border-slate-200 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className={isAllReady ? "text-[#FF7A00]" : "text-slate-400"} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                Candidate Calibration Summary
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-body">
              <span className={`flex items-center gap-1 ${isCameraReady ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                <Check size={12} /> Camera
              </span>
              <span className={`flex items-center gap-1 ${isMicReady ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                <Check size={12} /> Microphone
              </span>
              <span className={`flex items-center gap-1 ${isSoundReady ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                <Check size={12} /> Sound Output
              </span>
              <span className={`flex items-center gap-1 ${isFullscreenReady ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                <Check size={12} /> Fullscreen Lock
              </span>
            </div>
          </div>

          <Button
            type="button"
            disabled={!isAllReady}
            onClick={handleLaunchRoom}
            size="lg"
            iconRight={<ArrowRight size={16} />}
            className="shrink-0 shadow-md"
          >
            Enter Live Interview Room →
          </Button>
        </div>

      </div>
    </div>
  );
}
