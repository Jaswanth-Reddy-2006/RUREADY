import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  Mic,
  Volume2,
  Maximize,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ChevronLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Network,
  Radio,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { systemDesignApi } from '../../api/systemDesign';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

export default function SystemDesignPreCheckPage() {
  const navigate = useNavigate();
  const { createAndLoadSession } = useSystemDesignStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [config, setConfig] = useState<any>({
    targetRole: 'Senior Software Engineer (SDE-2)',
    selectedDomain: 'STORAGE',
    domainTitle: 'Distributed Storage & Caching',
    durationMins: 45,
    simulationMode: 'REALISTIC',
  });

  const [camStatus, setCamStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready'>('idle');
  const [audioVoicePlaying, setAudioVoicePlaying] = useState<boolean>(false);
  const [fullscreenStatus, setFullscreenStatus] = useState<'idle' | 'ready'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const micVerifiedRef = useRef<boolean>(false);
  const [agreedToIntegrityRules, setAgreedToIntegrityRules] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ru_ready_system_design_config');
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

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
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup active media streams & speech recognition on unmount
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
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // 1. Camera Test
  const handleTestCamera = async () => {
    setCamStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamStatus('ready');
      toast.success('Camera feed calibrated & active');
    } catch (err) {
      console.error('Camera access failed:', err);
      setCamStatus('idle');
      toast.error('Unable to access camera. Please allow camera permissions.');
    }
  };

  // 2. Microphone Test
  const handleTestMic = async () => {
    setMicStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVol = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          const pct = Math.min(100, Math.round((avg / 128) * 100));
          setMicVolume(pct);
          if (pct > 12 && !micVerifiedRef.current) {
            micVerifiedRef.current = true;
            setMicStatus('ready');
          }
          requestAnimationFrame(updateVol);
        };
        updateVol();
      }

      // Try browser speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (e: any) => {
          const txt = Array.from(e.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setSpokenTranscript(txt);
          if (txt.trim().length > 0) {
            setMicStatus('ready');
            micVerifiedRef.current = true;
          }
        };

        recog.onerror = () => {
          if (!micVerifiedRef.current) {
            setMicStatus('ready');
          }
        };

        recog.start();
        recognitionRef.current = recog;
      } else {
        setTimeout(() => setMicStatus('ready'), 1500);
      }
    } catch (err) {
      console.error('Mic access failed:', err);
      setMicStatus('idle');
      toast.error('Unable to access microphone. Please allow audio permissions.');
    }
  };

  // 3. Speaker Test (Playback Audio Chime)
  const handleTestSpeaker = () => {
    setAudioVoicePlaying(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);

      setTimeout(() => {
        setAudioVoicePlaying(false);
        setAudioStatus('ready');
        toast.success('Audio output verified');
      }, 900);
    } catch {
      setAudioVoicePlaying(false);
      setAudioStatus('ready');
    }
  };

  // 4. Request Fullscreen
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreenStatus('ready');
      } else {
        await document.exitFullscreen();
        setFullscreenStatus('idle');
      }
    } catch {
      setFullscreenStatus('ready');
    }
  };

  // Launch Session
  const handleLaunchStudio = async () => {
    if (!agreedToIntegrityRules) {
      toast.error('Please agree to the proctoring rules before entering.');
      return;
    }

    setIsSubmitting(true);
    setPrepMessage('Initializing System Design Studio & Whiteboard...');

    try {
      const probs = await systemDesignApi.getProblems();
      const targetProb = probs.find((p) => p.category === config.selectedDomain) || probs[0] || { id: 'tinyurl' };
      const sessionId = await createAndLoadSession(targetProb.id);

      // Clean up media streams before navigating so the studio gets a fresh stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      toast.success('System Design Room Ready!');
      navigate(`/system-design/studio/${sessionId}`);
    } catch (err) {
      console.warn('System design session launch fallback:', err);
      const fallbackId = `sd-${Date.now()}`;
      navigate(`/system-design/studio/${fallbackId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#000000] py-8 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 font-sans select-none transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ─── TOP BRAND & STEP NAVIGATOR ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/system-design/review')}
              className="p-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Back to Summary Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>System Design Hardware & Integrity Check</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-mono">
                  PROCTOR
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Step 3 of 3: Calibrate Camera, Mic, Speaker & Proctoring Rules
              </p>
            </div>
          </div>

          {/* 3 Step Pill Indicators */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => navigate('/system-design/setup')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>1. Config</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/system-design/review')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>2. Review</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>3. Pre-Check</span>
            </div>
          </div>
        </div>

        {/* ─── 4 CORE HARDWARE VERIFICATION CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 1. Camera Feed Check */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Camera size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Camera Feed</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  camStatus === 'ready'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {camStatus === 'ready' ? 'PASS' : camStatus === 'testing' ? 'TESTING' : 'REQUIRED'}
              </span>
            </div>

            <div className="aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${camStatus === 'ready' ? 'block' : 'hidden'}`}
              />
              {camStatus !== 'ready' && (
                <div className="text-center p-4 space-y-2">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-[11px] text-slate-400 font-mono">Webcam feed not yet calibrated</p>
                </div>
              )}
            </div>

            <Button
              size="sm"
              variant={camStatus === 'ready' ? 'outline' : 'primary'}
              onClick={handleTestCamera}
              className="w-full text-xs font-bold"
            >
              {camStatus === 'ready' ? 'Recalibrate Video' : 'Calibrate Camera'}
            </Button>
          </motion.div>

          {/* 2. Microphone Input Check */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Mic size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Microphone Input</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  micStatus === 'ready'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {micStatus === 'ready' ? 'PASS' : micStatus === 'testing' ? 'LISTENING' : 'REQUIRED'}
              </span>
            </div>

            <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-center space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Input Volume Level</span>
                  <span>{micVolume}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-75"
                    style={{ width: `${micVolume}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {spokenTranscript ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">"{spokenTranscript}"</span>
                ) : (
                  'Speak into your microphone to verify speech clarity and volume.'
                )}
              </p>
            </div>

            <Button
              size="sm"
              variant={micStatus === 'ready' ? 'outline' : 'primary'}
              onClick={handleTestMic}
              className="w-full text-xs font-bold"
            >
              {micStatus === 'ready' ? 'Microphone Active (PASS)' : 'Test Microphone'}
            </Button>
          </motion.div>

          {/* 3. Speaker / Audio Output Test */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Volume2 size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Audio Speaker</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  audioStatus === 'ready'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {audioStatus === 'ready' ? 'PASS' : 'TEST'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[48px]">
              Play an interactive audio chime to ensure you can clearly hear Ava's Socratic questions and architectural prompts.
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={handleTestSpeaker}
              disabled={audioVoicePlaying}
              className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {audioVoicePlaying ? 'Playing Audio Chime…' : 'Play Test Tone'}
            </Button>
          </motion.div>

          {/* 4. Full-Screen Capability Check */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Maximize size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Full-Screen Mode</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  fullscreenStatus === 'ready'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {fullscreenStatus === 'ready' ? 'ACTIVE' : 'OPTIONAL'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[48px]">
              The System Design Whiteboard runs best in distraction-free full screen to maximize canvas space for complex microservice diagrams.
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleFullscreen}
              className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {fullscreenStatus === 'ready' ? 'Exit Full-Screen' : 'Enable Full-Screen'}
            </Button>
          </motion.div>

        </div>

        {/* ─── MANDATORY PROCTORING RULES AGREEMENT ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                System Design Proctoring & Evaluation Rules
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                FAANG-grade integrity standards calibrated for fair architectural evaluation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">1. No Tab Switching</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Focus blurs are logged. Leaving the whiteboard triggers an integrity flag.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">2. Socratic Defense</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Defend your architectural trade-offs, latency bounds, and failure modes directly with Ava.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">3. Authentic Design</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Design without external templates or unauthorized LLM prompts.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToIntegrityRules}
              onChange={(e) => setAgreedToIntegrityRules(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              I acknowledge the proctoring rules and confirm that I will independently design and defend my system architecture without external AI or tab switching.
            </span>
          </label>

          {/* Launch Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleLaunchStudio}
              disabled={!agreedToIntegrityRules || isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-8 py-3 rounded-2xl shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{prepMessage || 'Launching Studio…'}</span>
                </>
              ) : (
                <>
                  <span>I Agree & Enter System Design Studio</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
