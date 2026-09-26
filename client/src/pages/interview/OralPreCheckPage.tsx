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
} from 'lucide-react';
import apiClient from '../../api/client';
import { InterviewType, ExperienceLevel } from '@ru-ready/shared';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function OralPreCheckPage() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [config, setConfig] = useState<any>({
    interviewType: 'FULL_SIMULATION',
    targetRole: 'Software Engineer',
    targetCompany: 'None / General Target',
    experienceLevel: ExperienceLevel.FRESHER,
    selectedSkills: [],
    jobDescription: '',
    selectedFocus: [],
    durationMins: 30,
  });

  const [camStatus, setCamStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'ready'>('idle');
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready'>('idle');
  const [audioVoicePlaying, setAudioVoicePlaying] = useState<boolean>(false);
  const [audioVoiceHeard, setAudioVoiceHeard] = useState<boolean>(false);
  const [fullscreenStatus, setFullscreenStatus] = useState<'idle' | 'ready'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const [agreedToIntegrityRules, setAgreedToIntegrityRules] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [prepMessage, setPrepMessage] = useState<string>('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ru_ready_oral_config');
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

  // Cleanup active media streams & speech synthesis on unmount
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  const testMic = async () => {
    if (micStatus === 'ready') return;
    setMicStatus('testing');
    setSpokenTranscript('');
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

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error('Speech recognition not supported in this browser. Please use Chrome or Edge.');
        return;
      }

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
        setSpokenTranscript(clean);

        const lower = clean.toLowerCase();
        // Check for required phrase matches
        const matchesTarget =
          lower.includes('ready to start') ||
          lower.includes('start my mock') ||
          lower.includes('ready to start my mock interview') ||
          lower.includes('ready to take my mock interview') ||
          lower.includes('ready to take the ai mock interview') ||
          lower.includes('ready to start the mock interview');

        if (matchesTarget) {
          setMicStatus('ready');
          toast.success('Microphone & speech phrase verified successfully!');
          try {
            rec.stop();
          } catch {
            // ignore
          }
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

      // Also play a test chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 580;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // ignore
      }

      utterance.onend = () => {
        setAudioVoicePlaying(false);
        setAudioVoiceHeard(true);
      };
      utterance.onerror = () => {
        setAudioVoicePlaying(false);
        setAudioVoiceHeard(true);
      };

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Ava') ||
            v.name.includes('Jenny'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
      setAudioVoiceHeard(true);
    } catch (err) {
      console.warn('Audio test error:', err);
      setAudioVoicePlaying(false);
      setAudioVoiceHeard(true);
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

  const isAllVerifiedAndAgreed =
    camStatus === 'ready' &&
    micStatus === 'ready' &&
    audioStatus === 'ready' &&
    fullscreenStatus === 'ready' &&
    agreedToIntegrityRules;

  const handleStartInterview = async () => {
    setIsSubmitting(true);
    setPrepMessage('Configuring interview session with proctoring parameters...');

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // ignore
    }

    try {
      const finalRole = config.isCustomRole && config.customRoleInput ? config.customRoleInput : (config.targetRole || 'Software Engineer');
      const finalCompany =
        config.isCustomCompany && config.customCompanyInput
          ? config.customCompanyInput
          : config.targetCompany === 'None / General Target'
          ? ''
          : config.targetCompany;

      const goalMeta = `[Type: ${config.interviewType || 'FULL_SIMULATION'}][Skills: ${(config.selectedSkills || []).join(',')}][Focus: ${(config.selectedFocus || []).join(',')}]`;

      const sessionResponse = await apiClient.post('/interview/session', {
        interviewType: InterviewType.JOB,
        targetRole: finalRole,
        targetCompany: finalCompany || undefined,
        industry: 'Technology',
        experienceLevel: config.experienceLevel || ExperienceLevel.FRESHER,
        focusAreas: config.selectedFocus && config.selectedFocus.length > 0 ? config.selectedFocus : ['Technical Knowledge', 'Behavioral'],
        interviewGoal: goalMeta,
        durationMins: config.durationMins || 30,
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* TOP BRAND & STEP NAVIGATOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/oral/review')}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Back to Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Oral Mock Interview Setup</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                  AI
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Step 3 of 3: Allow Permissions & Launch
              </p>
            </div>
          </div>

          {/* 3 Step Pill Indicators */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => navigate('/oral/setup')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>1. Config</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/oral/review')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
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

        {/* ─── STEP 3: DEVICE & PERMISSIONS & PROCTORING RULES CHECK ─── */}
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

              {/* Video Preview with Mirroring */}
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
                  "I am ready to start my mock interview."
                </p>

                {spokenTranscript && (
                  <div className="p-2 bg-white rounded-lg border border-purple-200 text-xs text-purple-900 font-mono">
                    <span className="font-bold text-purple-700">Heard: </span>
                    <span>"{spokenTranscript}"</span>
                  </div>
                )}

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
                {micStatus === 'ready'
                  ? '✓ Speech Phrase Verified'
                  : micStatus === 'testing'
                  ? 'Listening for Phrase...'
                  : '🎤 Start Mic & Speak Phrase'}
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
                  Click "Play Voice" to hear Ava speak, then confirm audibility below.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={testAudio}
                  className="w-full text-xs py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  {audioVoicePlaying ? '🔊 Ava is speaking...' : '🔊 Play Voice'}
                </Button>

                {audioVoiceHeard && audioStatus !== 'ready' && (
                  <Button
                    onClick={() => {
                      setAudioStatus('ready');
                      toast.success('Speaker verified successfully!');
                    }}
                    className="w-full text-xs py-2.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    ✓ Yes, the voice is audible
                  </Button>
                )}

                {audioStatus === 'ready' && (
                  <div className="text-center text-xs font-bold text-emerald-700 py-1">
                    ✓ Voice Verified & Clear
                  </div>
                )}
              </div>
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
              onClick={() => navigate('/oral/review')}
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

      </div>
    </div>
  );
}
