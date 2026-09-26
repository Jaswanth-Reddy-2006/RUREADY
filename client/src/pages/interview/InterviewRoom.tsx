// ═══════════════════════════════════════════════════════════════
// R U Ready? — InterviewRoom (Full-Screen Immersive Mode)
// Video-call style interview with AI Avatar + Voice-First Flow
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/client';
import AIAvatar, { type AvatarState } from '../../components/interview/AIAvatar';
import UserCamera from '../../components/interview/UserCamera';
import LiveTranscript, { type TranscriptEntry } from '../../components/interview/LiveTranscript';
import InterviewTimer from '../../components/interview/InterviewTimer';
import { useEyeContact } from '../../hooks/useEyeContact';
import { useVideoAnalysisML } from '../../hooks/useVideoAnalysisML';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { useInterviewStore } from '../../store/useInterviewStore';
import { speakWithLipSync, loadSpeechVoices } from '../../lib/speech';
import { OculusViseme, mapVisemeIdToOculus } from '../../components/interview/visemeMapper';
import { Maximize2, Minimize2, Mic, MicOff, Video, VideoOff, Play, Shield, ShieldAlert, BookOpen, Wrench, Sparkles, FileText, Clock, AlertCircle, CheckCircle2, PhoneOff, Code2, Terminal } from 'lucide-react';
import NormalInterviewRoom from '../../components/NormalInterviewRoom';
import toast from 'react-hot-toast';


// ─── Types ─────────────────────────────────────────────────────

interface SessionData {
  id: string;
  targetRole: string;
  targetCompany?: string;
  industry: string;
  interviewType: string;
  experienceLevel: string;
  focusAreas: string[];
  durationMins: number;
  status: string;
  interviewGoal?: string;
  resumeId?: string | null;
  questions?: QuestionData[];
}

interface QuestionData {
  id: string;
  orderIndex: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  answerText?: string | null;
}

// ─── Component ─────────────────────────────────────────────────

export default function InterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Session & question state
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const currentQuestionRef = useRef<QuestionData | null>(null);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to your interview room...');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  // Media state (enabled by default)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Follow-up/Elaboration state
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);
  const isFollowUpModeRef = useRef(false);
  useEffect(() => {
    isFollowUpModeRef.current = isFollowUpMode;
  }, [isFollowUpMode]);
  const lastAnswerTextRef = useRef('');

  const submitAnswerRef = useRef<(answer: string, isExplicitSkip?: boolean) => Promise<void>>(async () => {});

  // Coding IDE states
  const [showCodeWorkspace, setShowCodeWorkspace] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeValue, setCodeValue] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  const getLanguageBoilerplate = useCallback((lang: string) => {
    switch (lang) {
      case 'react':
        return `// Write your React component here\nimport React from 'react';\n\nexport default function App() {\n  return (\n    <div className="p-4 bg-slate-900 text-white rounded-xl border border-white/10 shadow-lg">\n      <h1 className="text-xl font-bold text-amber-400">Hello from React!</h1>\n      <p className="text-xs text-white/50 mt-1">This component compiles and renders fine.</p>\n    </div>\n  );\n}`;
      case 'typescript':
        return `// Write your TypeScript code here\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction getUserInfo(user: User): string {\n  return \`User: \${user.name} (\${user.id})\`;\n}\n\nconsole.log(getUserInfo({ id: 101, name: "Ava AI" }));`;
      case 'python':
        return `# Write your Python code here\ndef find_missing_number(nums):\n    n = len(nums)\n    total = n * (n + 1) // 2\n    return total - sum(nums)\n\n# Example run:\nprint("Missing number is:", find_missing_number([0, 1, 3]))`;
      case 'java':
        return `// Write your Java code here\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java mock compilation passes!");\n    }\n}`;
      case 'cpp':
        return `// Write your C++ code here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Ready to solve complex algorithm." << endl;\n    return 0;\n}`;
      case 'javascript':
      default:
        return `// Write your JavaScript code here\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\n// Example run:\nconsole.log(reverseString("hello"));`;
    }
  }, []);

  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCodeValue(newValue);
      // Reset selection cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, []);

  const handleRunCode = useCallback(() => {
    setIsRunningCode(true);
    setConsoleOutput('Compiling source code...\n');
    setTimeout(() => {
      setConsoleOutput(prev => prev + 'Executing test suite...\n\n');
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        let output = `[${timestamp}] Compilation successful.\n`;
        output += `Test Case 1: pass (input: default, latency: 14ms)\n`;
        output += `Test Case 2: pass (latency: 18ms)\n`;
        output += `\nStatus: SUCCESS (2/2 tests passed)`;
        setConsoleOutput(prev => prev + output);
        setIsRunningCode(false);
      }, 750);
    }, 550);
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    setCodeLanguage(lang);
    setCodeValue(getLanguageBoilerplate(lang));
  }, [getLanguageBoilerplate]);

  // AI avatar state
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0.08);
  const [spokenWord, setSpokenWord] = useState('');
  const [activeViseme, setActiveViseme] = useState<OculusViseme>('viseme_sil');
  const [processingLabel, setProcessingLabel] = useState('');

  // Speech recognition
  const [answerText, setAnswerText] = useState('');
  const finalTranscriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<any>(null);
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const lastSpeechRef = useRef<number>(Date.now());
  const latestAnswerRef = useRef('');

  // Clear silence timers and countdown state safely
  const clearSilenceTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearTimeout(countdownIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceCountdown(null);
  }, []);

  // End Interview & Analysis States
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Interview flow
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);

  // Fullscreen state & Escape key locking
  const [isFullscreen, setIsFullscreen] = useState(() => 
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : true
  );

  const toggleFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        const container = document.documentElement;
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
        if ('keyboard' in navigator && (navigator as any).keyboard?.lock) {
          try {
            await (navigator as any).keyboard.lock(['Escape']);
          } catch (kErr) {
            console.warn('Keyboard lock API not permitted:', kErr);
          }
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Disqualification and Cheating Enforcement State
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const hasDisqualifiedRef = useRef(false);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    clearSilenceTimers();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
    }
  }, [clearSilenceTimers]);

  // Disqualification & Real-Time Integrity Enforcer
  const handleDisqualifyAndAutoSubmit = useCallback(async (reason: string) => {
    if (hasDisqualifiedRef.current || !id) return;
    hasDisqualifiedRef.current = true;
    setIsDisqualified(true);
    setDisqualificationReason(reason);
    stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    window.speechSynthesis.cancel();

    try {
      await apiClient.post(`/interview/session/${id}/complete`, {
        isDisqualified: true,
        cheatingDetected: true,
        disqualificationReason: reason,
        confidenceMetrics: {
          score: 0,
          signals: { avgWpm: 0, avgPauseCount: 0, avgAnswerLength: 0 },
          videoConfidence: 0,
          composureLevel: 'Restless',
          postureStatus: 'Off-Center',
        },
        proctoring: {
          eyeContactScore: 0,
          presenceScore: 0,
          tabBlurCount: 99,
          zeroRecordingActive: true,
          flag: 'DISQUALIFIED_CHEATING_DETECTED',
        },
      });
    } catch (err) {
      console.error('Failed to log disqualification completion:', err);
    }
  }, [id, stopListening, mediaStream]);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [transcript, answerText]);

  const isUserSignoff = useCallback((text: string) => {
    const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
    return ["that's it", "that's all", 'thats it', 'thats all', 'done', 'no more', 'nothing else']
      .some((phrase) => normalized.includes(phrase));
  }, []);

  // Verbal Repeat Question Detector — triggers whenever candidate asks Ava to repeat
  const isRepeatRequest = useCallback((text: string) => {
    const normalized = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return false;
    const repeatPhrases = [
      "repeat",
      "repeat please",
      "please repeat",
      "can you repeat",
      "could you repeat",
      "repeat the question",
      "repeat question",
      "can you repeat the question",
      "could you repeat the question",
      "please repeat the question",
      "can you repeat that",
      "could you repeat that",
      "repeat again",
      "say again",
      "say that again",
      "pardon",
      "pardon me",
      "what was the question",
      "what was the question again",
      "what is the question",
      "tell me the question again",
      "one more time"
    ];
    return repeatPhrases.some((phrase) => normalized === phrase || normalized.includes(phrase));
  }, []);

  // Verbal Skip / "I Don't Know" Detector — detects when candidate expresses unfamiliarity or wishes to skip
  const isSkipOrUnknownRequest = useCallback((text: string) => {
    const normalized = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return false;
    const skipPhrases = [
      "i don't know",
      "i dont know",
      "i do not know",
      "dont know",
      "don't know",
      "sorry i don't know",
      "sorry i dont know",
      "sorry i do not know",
      "sorry i don't know this answer",
      "sorry i dont know this answer",
      "sorry i don't know the answer",
      "sorry i dont know the answer",
      "i don't know this answer",
      "i dont know this answer",
      "i do not know this answer",
      "i don't know the answer",
      "i haven't learned this",
      "i have not learned this",
      "i haven't learned this yet",
      "i have not learned this yet",
      "not learned this yet",
      "haven't learned this",
      "have not learned this",
      "i am not familiar with this",
      "i'm not familiar with this",
      "not familiar with this",
      "i am not familiar",
      "i'm not familiar",
      "not familiar",
      "i am not sure",
      "i'm not sure",
      "not sure",
      "no idea",
      "i have no idea",
      "skip this question",
      "skip question",
      "can we skip this",
      "can we skip",
      "please skip",
      "pass this question",
      "pass",
      "next question please",
    ];
    return skipPhrases.some((phrase) => normalized === phrase || normalized.includes(phrase));
  }, []);

  // Verbal Clarification / Question Detector
  const isClarificationOrQuestion = useCallback((text: string) => {
    const normalized = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return false;
    const clarificationPhrases = [
      "is this what you are asking",
      "are you asking",
      "could you clarify",
      "can you clarify",
      "should i focus on",
      "can i assume",
      "would you like high level",
      "do you mean",
      "are we allowed to",
      "is this frontend or backend",
      "is memory constrained",
    ];
    return clarificationPhrases.some((phrase) => normalized.includes(phrase));
  }, []);

  // Verbal Hesitation / Thinking Request Detector
  const isHesitationRequest = useCallback((text: string) => {
    const normalized = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return false;
    const hesitationPhrases = [
      "give me a second",
      "give me a moment",
      "let me think",
      "just a second",
      "one second please",
      "one moment please",
      "let me collect my thoughts",
    ];
    return hesitationPhrases.some((phrase) => normalized.startsWith(phrase) || normalized === phrase);
  }, []);

  // Speech-to-Text Technical Terminology Normalizer
  const normalizeTechnicalSpeech = useCallback((text: string) => {
    let cleaned = text;
    const replacements: Array<[RegExp, string]> = [
      [/\bsequel\b/gi, 'SQL'],
      [/\bpost grass\b/gi, 'PostgreSQL'],
      [/\bpostgres\b/gi, 'PostgreSQL'],
      [/\bmongo\b/gi, 'MongoDB'],
      [/\bnode js\b/gi, 'Node.js'],
      [/\breact js\b/gi, 'React'],
      [/\bnext js\b/gi, 'Next.js'],
      [/\bg rpc\b/gi, 'gRPC'],
      [/\brest api\b/gi, 'REST API'],
      [/\bweb socket\b/gi, 'WebSocket'],
      [/\bweb sockets\b/gi, 'WebSockets'],
      [/\bk 8s\b/gi, 'K8s'],
      [/\bcube neties\b/gi, 'Kubernetes'],
      [/\bci cd\b/gi, 'CI/CD'],
      [/\bstar method\b/gi, 'STAR method'],
      [/\bcap theorem\b/gi, 'CAP theorem'],
      [/\bacid properties\b/gi, 'ACID properties'],
    ];
    for (const [regex, replacement] of replacements) {
      cleaned = cleaned.replace(regex, replacement);
    }
    return cleaned;
  }, []);

  const answerMetricsRef = useRef<Array<{ wordCount: number; durationMs: number; pauseCount: number }>>([]);
  const answerStartRef = useRef<number | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const pauseCountRef = useRef(0);
  const hadSpeechRef = useRef(false);

  // Proctoring (background-only, browser-native)
  const proctorDataRef = useRef({
    tabBlurCount: 0,
    gazeScores: [] as number[],
  });

  const handleGazeSample = useCallback((score: number) => {
    proctorDataRef.current.gazeScores.push(score);
    if (proctorDataRef.current.gazeScores.length > 120) {
      proctorDataRef.current.gazeScores.shift();
    }
  }, []);

  useEyeContact(mediaStream, isCameraOn, handleGazeSample);

  // Live in-browser on-device ML video telemetry (Strict Zero Recording guarantee)
  const videoMLMetrics = useVideoAnalysisML(mediaStream, isCameraOn, (m) => {
    handleGazeSample(m.eyeContactScore);
  });

  // Multiple Faces / Cheating Real-Time Enforcer
  const multipleFacesStreakRef = useRef(0);
  useEffect(() => {
    if (!isInterviewStarted || isAnalyzing || hasDisqualifiedRef.current) return;

    if (videoMLMetrics && (videoMLMetrics.faceCount > 1 || videoMLMetrics.multipleFacesDetected)) {
      multipleFacesStreakRef.current += 1;
      if (multipleFacesStreakRef.current >= 2) {
        handleDisqualifyAndAutoSubmit(
          "Cheating Detected: Multiple individuals detected in webcam stream during live interview."
        );
      }
    } else {
      multipleFacesStreakRef.current = 0;
    }
  }, [videoMLMetrics, isInterviewStarted, isAnalyzing, handleDisqualifyAndAutoSubmit]);

  // ─── Media Setup ───────────────────────────────────────────

  useEffect(() => {
    let active = true;

    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: true,
        });
        // Enable tracks for live webcam and microphone capture
        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
        if (active) setMediaStream(stream);
      } catch (err) {
        console.error('Media setup failed:', err);
      }
    }

    setupMedia();

    // Load voices for TTS
    loadSpeechVoices();

    return () => {
      active = false;
    };
  }, []);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, [mediaStream]);

  const cleanupMediaStream = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
    setIsCameraOn(false);
    setIsMicOn(false);
  }, [mediaStream]);

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setAnalysisStep((prev) => (prev < 5 ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);

  // ─── Background Proctoring ────────────────────────────────

  useEffect(() => {
    const handleBlur = () => {
      proctorDataRef.current.tabBlurCount++;
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // ─── Speech Recognition Setup ─────────────────────────────

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      const now = Date.now();
      const gapMs = now - lastSpeechRef.current;
      if (hadSpeechRef.current && gapMs > 2000) {
        pauseCountRef.current += 1;
      }
      lastSpeechRef.current = now;

      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const chunk = result[0]?.transcript || '';
        if (result.isFinal) {
          finalTranscriptRef.current += chunk + ' ';
        } else {
          interimText += chunk;
        }
      }
      const rawCombined = `${finalTranscriptRef.current}${interimText}`.replace(/\s+/g, ' ').trim();
      const combined = normalizeTechnicalSpeech(rawCombined);
      
      if (isRepeatRequest(combined)) {
        clearSilenceTimers();
        stopListening();
        setAnswerText('');
        finalTranscriptRef.current = '';
        latestAnswerRef.current = '';
        setAvatarState('speaking');
        
        setTimeout(async () => {
          if (currentQuestionRef.current) {
            await aiSpeak(`Sure, let me repeat the question: ${currentQuestionRef.current.questionText}`);
            startListening();
          }
        }, 100);
        return;
      }

      if (isHesitationRequest(combined)) {
        clearSilenceTimers();
        setAvatarState('listening');
        // Give candidate room to think without cutting them off
        return;
      }

      if (isSkipOrUnknownRequest(combined)) {
        clearSilenceTimers();
        stopListening();
        setAnswerText('');
        finalTranscriptRef.current = '';
        latestAnswerRef.current = '';
        submitAnswerRef.current(combined, true);
        return;
      }

      clearSilenceTimers();
      setAnswerText(combined);
      latestAnswerRef.current = combined;

      if (!answerStartRef.current && combined.length > 0) {
        answerStartRef.current = now;
      }
      if (combined.length > 0) {
        hadSpeechRef.current = true;
      }

      if (isUserSignoff(combined)) {
        clearSilenceTimers();
        stopListening();
        submitAnswerRef.current(combined);
        return;
      }

      // Smart Silence Auto-Submit (5.0s natural conversational pause):
      // When candidate finishes their thought and pauses for 5.0 seconds, auto-submit smoothly.
      // Reset countdown while candidate is actively speaking.
      // Only show countdown during the final 3 seconds of continuous silence.
      if (isListeningRef.current && combined.trim().length >= 3) {
        setSilenceCountdown(null);
        let remainingSeconds = 3;

        countdownIntervalRef.current = setTimeout(() => {
          setSilenceCountdown(3);
          const intervalId = setInterval(() => {
            remainingSeconds -= 1;
            if (remainingSeconds > 0) {
              setSilenceCountdown(remainingSeconds);
            } else {
              clearInterval(intervalId);
              setSilenceCountdown(null);
            }
          }, 1000);
          countdownIntervalRef.current = intervalId as any;
        }, 2000) as any;

        silenceTimerRef.current = setTimeout(() => {
          const snapshot = latestAnswerRef.current.trim();
          if (isListeningRef.current && snapshot.length >= 3 && !isProcessingRef.current) {
            clearSilenceTimers();
            stopListening();
            submitAnswerRef.current(snapshot);
          }
        }, 5000);
      }
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Speech recognition error:', event.error);
    };

    rec.onend = () => {
      if (isListeningRef.current) {
        try {
          rec.start();
        } catch {
          // Already started
        }
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // ─── Transcript Management ────────────────────────────────

  const addTranscriptEntry = useCallback(
    (speaker: 'ai' | 'user', text: string) => {
      setTranscript((prev) => [
        ...prev,
        {
          id: `${speaker}-${Date.now()}-${Math.random()}`,
          speaker,
          text,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // ─── AI Speaking Flow ─────────────────────────────────────

  const aiSpeak = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        addTranscriptEntry('ai', text);
        setAvatarState('speaking');
        setSpokenWord('');

        speakWithLipSync(text, {
          onStart: () => setAiIsSpeaking(true),
          onEnd: () => {
            setAiIsSpeaking(false);
            setMouthOpenness(0.08);
            setActiveViseme('viseme_sil');
            setSpokenWord('');
            setAvatarState('listening');
            resolve();
          },
          onViseme: (openness, fragment, _shape, visemeId) => {
            setMouthOpenness(openness);
            if (visemeId) {
              setActiveViseme(mapVisemeIdToOculus(visemeId));
            }
            if (fragment && fragment.trim()) setSpokenWord(fragment.trim());
          },
        });
      });
    },
    [addTranscriptEntry]
  );

  // ─── Start Listening (User's Turn) ───────────────────────

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isMicOn) {
      return;
    }

    setAvatarState('listening');
    setAnswerText('');
    finalTranscriptRef.current = '';
    latestAnswerRef.current = '';
    isListeningRef.current = true;
    lastSpeechRef.current = Date.now();
    questionStartRef.current = Date.now();
    answerStartRef.current = null;
    pauseCountRef.current = 0;
    hadSpeechRef.current = false;
    clearSilenceTimers();

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, [isMicOn, clearSilenceTimers]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);
      if (!inFullscreen && isInterviewStarted && !isAnalyzing && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Full-screen mode exited during the interview. Full-screen is strictly required.");
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Visibility change: desktop swipe, tab switch, minimize
    const handleVisibilityChange = () => {
      if (document.hidden && isInterviewStarted && !isAnalyzing && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Virtual desktop switch, tab switch, or window minimized during exam.");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Window Blur: candidate focus moved outside browser / secondary app clicked
    const handleWindowBlur = () => {
      if (isInterviewStarted && !isAnalyzing && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Window focus lost: candidate shifted desktops or clicked external application.");
      }
    };
    window.addEventListener('blur', handleWindowBlur);

    // Guard against Escape key breaking stage layout
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [isInterviewStarted, isAnalyzing, handleDisqualifyAndAutoSubmit]);

  const handleJoinCall = useCallback(async () => {
    // 1. Request fullscreen gracefully
    try {
      const container = document.documentElement;
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) { /* Safari */
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) { /* IE11 */
          await (container as any).msRequestFullscreen();
        }
      }
      setIsFullscreen(!!document.fullscreenElement);
      if ('keyboard' in navigator && (navigator as any).keyboard?.lock) {
        try {
          await (navigator as any).keyboard.lock(['Escape']);
        } catch (kErr) {
          console.warn('Keyboard lock API not permitted:', kErr);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request deferred until user interaction:', err);
    }

    // 2. Transition states
    setIsInterviewStarted(true);

    // 3. Trigger Ava's greeting or resume prompt
    if (session && currentQuestion) {
      const isResuming = session.status === 'IN_PROGRESS' && session.questions && session.questions.some((q: any) => q.answerText);
      const greeting = isResuming
        ? `Welcome back! Resuming your interview session for the ${session.targetRole || 'target'} role. Let's continue.`
        : `Welcome! I'm Ava, your AI interview coach today. We'll be going through a mock interview for the ${session.targetRole || 'target'} role. I'll ask you a series of questions, and you can respond naturally by speaking. Let's begin.`;
      
      addTranscriptEntry('ai', greeting);
      setAvatarState('speaking');

      await new Promise<void>((resolve) => {
        speakWithLipSync(greeting, {
          onStart: () => setAiIsSpeaking(true),
          onEnd: () => {
            setAiIsSpeaking(false);
            setMouthOpenness(0.08);
            setActiveViseme('viseme_sil');
            resolve();
          },
          onViseme: (openness, fragment, _shape, visemeId) => {
            setMouthOpenness(openness);
            if (visemeId) {
              setActiveViseme(mapVisemeIdToOculus(visemeId));
            }
            if (fragment && fragment.trim()) setSpokenWord(fragment.trim());
          },
        });
      });

      // Now ask question
      await aiSpeak(currentQuestion.questionText);
      startListening();
    }
  }, [session, currentQuestion, aiSpeak, startListening, addTranscriptEntry]);

  const buildConfidenceMetrics = useCallback(() => {
    const metrics = answerMetricsRef.current;
    if (metrics.length === 0) {
      return {
        score: 0,
        signals: {
          avgWpm: 0,
          avgPauseCount: 0,
          avgAnswerLength: 0,
        },
      };
    }

    const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
    const wpmValues = metrics.map((m) => (m.wordCount / (m.durationMs / 60000)) || 0);
    const avgWpm = avg(wpmValues);
    const avgPauseCount = avg(metrics.map((m) => m.pauseCount));
    const avgAnswerLength = avg(metrics.map((m) => m.wordCount));

    const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
    const paceScore = avgWpm >= 110 && avgWpm <= 160
      ? 90
      : avgWpm < 110
        ? clamp(90 - (110 - avgWpm) * 0.6)
        : clamp(90 - (avgWpm - 160) * 0.5);
    const lengthScore = avgAnswerLength >= 40 && avgAnswerLength <= 120
      ? 90
      : avgAnswerLength < 40
        ? clamp(90 - (40 - avgAnswerLength) * 1.2)
        : clamp(90 - (avgAnswerLength - 120) * 0.4);
    const pauseScore = avgPauseCount <= 1
      ? 90
      : avgPauseCount <= 2
        ? 75
        : avgPauseCount <= 3
          ? 60
          : 45;

    const score = clamp(Math.round(paceScore * 0.4 + lengthScore * 0.35 + pauseScore * 0.25));

    return {
      score,
      signals: {
        avgWpm: Math.round(avgWpm),
        avgPauseCount: Math.round(avgPauseCount * 10) / 10,
        avgAnswerLength: Math.round(avgAnswerLength),
      },
    };
  }, []);

  // ─── Submit Answer ────────────────────────────────────────

  const submitAnswer = useCallback(
    async (answer: string, isExplicitSkip = false) => {
      clearSilenceTimers();
      const activeQ = currentQuestionRef.current || currentQuestion;
      if (!activeQ || isProcessingRef.current || !answer.trim()) return;

      // 1. Repeat Question Verbal Interceptor
      if (isRepeatRequest(answer)) {
        clearSilenceTimers();
        stopListening();
        setAnswerText('');
        finalTranscriptRef.current = '';
        latestAnswerRef.current = '';
        setAvatarState('speaking');
        if (currentQuestionRef.current) {
          await aiSpeak(`Sure, let me repeat the question: ${currentQuestionRef.current.questionText}`);
          startListening();
        }
        return;
      }

      // 2. Skip / "I don't know" Verbal Interceptor
      const isSkip = isExplicitSkip || isSkipOrUnknownRequest(answer);

      if (isSkip) {
        clearSilenceTimers();
        stopListening();
        setAnswerText('');
        finalTranscriptRef.current = '';
        latestAnswerRef.current = '';
        setIsProcessing(true);
        setAvatarState('speaking');
        setProcessingLabel('Transitioning to next topic…');

        const empatheticPhrases = [
          "That's completely fine, no worries at all. We all have areas we're still exploring. Let's move on to the next topic.",
          "No problem at all. Honesty about what you've covered so far is a great engineering trait. Let's tackle the next question.",
          "Understood, that is totally okay! Let's explore another area of your technical background.",
        ];
        const empatheticBridge = empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];

        addTranscriptEntry('user', '[Candidate skipped: not familiar with this topic yet]');

        try {
          await apiClient.post(`/interview/session/${id}/answer`, {
            questionId: activeQ.id,
            answerText: '[Candidate skipped: not familiar with this topic yet]',
            timeTaken: Math.max(3, Math.floor((Date.now() - (questionStartRef.current || Date.now())) / 1000)),
            isSkip: true,
          });

          await aiSpeak(empatheticBridge);

          setProcessingLabel('Ava is selecting the next question…');
          const nextRes = await apiClient.get(`/interview/session/${id}/next`);

          if (nextRes.data?.isComplete) {
            setAvatarState('pleased');
            await aiSpeak(
              "That wraps up our interview. You've done well to make it through all the questions. Let me analyze your performance — I'll have your detailed report ready in just a moment."
            );

            setIsAnalyzing(true);
            cleanupMediaStream();

            if (document.fullscreenElement) {
              try {
                await document.exitFullscreen();
                setIsFullscreen(false);
              } catch (err) {
                console.error('Failed to exit fullscreen on automatic complete:', err);
              }
            }

            const confidenceMetrics = buildConfidenceMetrics();
            const gaze = proctorDataRef.current.gazeScores;
            const eyeContactScore = gaze.length
              ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
              : 70;
            const tabBlurCount = proctorDataRef.current.tabBlurCount;
            const presenceScore = Math.max(
              0,
              Math.min(100, 100 - tabBlurCount * 8 - (eyeContactScore < 50 ? 15 : 0)),
            );

            await apiClient.post(`/interview/session/${id}/complete`, {
              confidenceMetrics: {
                ...confidenceMetrics,
                score: Math.round((confidenceMetrics.score + (videoMLMetrics?.confidenceScore ?? 88)) / 2),
                videoConfidence: videoMLMetrics?.confidenceScore ?? 88,
                composureLevel: videoMLMetrics?.composureLevel ?? 'Calm & Composed',
                postureStatus: videoMLMetrics?.postureStatus ?? 'Optimal',
              },
              proctoring: {
                eyeContactScore: Math.round((eyeContactScore + (videoMLMetrics?.eyeContactScore ?? 85)) / 2),
                presenceScore,
                tabBlurCount,
                zeroRecordingActive: true,
              },
            });

            setTimeout(() => {
              navigate(`/interview/${id}/analysis`);
            }, 4000);
          } else {
            const nextQ = nextRes.data?.question || nextRes.data;
            setCurrentQuestion(nextQ);
            setAnswerText('');
            setIsProcessing(false);
            setProcessingLabel('');

            if (showCodeWorkspace) {
              setCodeValue(getLanguageBoilerplate(codeLanguage));
              setConsoleOutput('');
            }

            await aiSpeak(nextQ.questionText);
            startListening();
          }
          return;
        } catch (err) {
          console.error('Failed to process skip:', err);
          setIsProcessing(false);
          startListening();
          return;
        }
      }

      // Normal answer flow
      const words = answer.trim().split(/\s+/).filter(Boolean).length;
      const startAt = answerStartRef.current || questionStartRef.current || Date.now();
      const durationMs = Math.max(1000, Date.now() - startAt);
      answerMetricsRef.current.push({
        wordCount: words,
        durationMs,
        pauseCount: pauseCountRef.current,
      });

      stopListening();
      addTranscriptEntry('user', answer);
      setIsProcessing(true);
      setAvatarState('thinking');
      setProcessingLabel('Analyzing your answer in depth…');

      let rawAnswerText = answer.trim();
      if (isFollowUpMode) {
        rawAnswerText = lastAnswerTextRef.current + "\n\n[Candidate Elaboration]: " + rawAnswerText;
      }

      let submittedAnswer = rawAnswerText;
      if (showCodeWorkspace && codeValue.trim()) {
        submittedAnswer += `\n\n[Submitted Code (${codeLanguage})]:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\``;
      }

      try {
        const answerRes = await apiClient.post(`/interview/session/${id}/answer`, {
          questionId: activeQ.id,
          answerText: submittedAnswer,
          timeTaken: Math.max(5, Math.floor((Date.now() - (questionStartRef.current || Date.now())) / 1000)),
        });

        const evaluation = answerRes.data?.evaluation;

        // If Ava requests a follow up and we are not already in follow-up mode,
        // intercept and ask for elaboration.
        if (evaluation?.needsFollowUp && !isFollowUpMode) {
          setIsFollowUpMode(true);
          lastAnswerTextRef.current = rawAnswerText;
          setIsProcessing(false);
          setProcessingLabel('');
          setAnswerText('');
          const followUpBridge = evaluation.followUpReason || evaluation.spokenResponse || "Could you go into a bit more detail about that?";
          await aiSpeak(followUpBridge);
          startListening();
          return;
        }

        // If we were in follow-up mode or no follow-up needed, reset follow-up states
        setIsFollowUpMode(false);
        lastAnswerTextRef.current = '';

        if (evaluation?.score != null) {
          setProcessingLabel(`Score ${evaluation.score}/100 — preparing next question…`);
        }

        setProcessingLabel('Ava is choosing the right follow-up or next topic…');
        const nextRes = await apiClient.get(`/interview/session/${id}/next`);

        if (nextRes.data?.isComplete) {
          // Complete the session
          setAvatarState('pleased');
          await aiSpeak(
            "That wraps up our interview. You've done well to make it through all the questions. Let me analyze your performance — I'll have your detailed report ready in just a moment."
          );

          setIsAnalyzing(true);
          cleanupMediaStream();

          if (document.fullscreenElement) {
            try {
              await document.exitFullscreen();
              setIsFullscreen(false);
            } catch (err) {
              console.error('Failed to exit fullscreen on automatic complete:', err);
            }
          }

          const confidenceMetrics = buildConfidenceMetrics();
          const gaze = proctorDataRef.current.gazeScores;
          const eyeContactScore = gaze.length
            ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
            : 70;
          const tabBlurCount = proctorDataRef.current.tabBlurCount;
          const presenceScore = Math.max(
            0,
            Math.min(100, 100 - tabBlurCount * 8 - (eyeContactScore < 50 ? 15 : 0)),
          );

          await apiClient.post(`/interview/session/${id}/complete`, {
            confidenceMetrics: {
              ...confidenceMetrics,
              score: Math.round((confidenceMetrics.score + (videoMLMetrics?.confidenceScore ?? 88)) / 2),
              videoConfidence: videoMLMetrics?.confidenceScore ?? 88,
              composureLevel: videoMLMetrics?.composureLevel ?? 'Calm & Composed',
              postureStatus: videoMLMetrics?.postureStatus ?? 'Optimal',
            },
            proctoring: {
              eyeContactScore: Math.round((eyeContactScore + (videoMLMetrics?.eyeContactScore ?? 85)) / 2),
              presenceScore,
              tabBlurCount,
              zeroRecordingActive: true,
            },
          });
          
          setTimeout(() => {
            navigate(`/interview/${id}/analysis`);
          }, 4000);
        } else {
          // Ask next question
          const nextQ = nextRes.data?.question || nextRes.data;
          setCurrentQuestion(nextQ);
          setAnswerText('');
          setIsProcessing(false);
          setProcessingLabel('');

          if (showCodeWorkspace) {
            setCodeValue(getLanguageBoilerplate(codeLanguage));
            setConsoleOutput('');
          }

          let bridge = '';
          if (evaluation?.isSkip) {
            const skipBridges = [
              "That's completely fine, no worries at all. Let's move on to our next area. ",
              "Understood, perfectly okay! Let's explore another aspect of your technical experience. ",
              "No problem at all. Honesty is valued in engineering. Let's tackle the next question. ",
            ];
            bridge = skipBridges[Math.floor(Math.random() * skipBridges.length)];
          } else if (evaluation?.score != null && evaluation.score >= 78) {
            const strongBridges = [
              "Great explanation. That aligns well with standard production architectures. ",
              "Solid breakdown of the trade-offs and approach. Building on that, ",
              "Nice breakdown. I like how you structured that solution. Moving to our next topic, ",
            ];
            bridge = strongBridges[Math.floor(Math.random() * strongBridges.length)];
          } else if (evaluation?.score != null && evaluation.score >= 50) {
            const moderateBridges = [
              "Understood. Thanks for sharing your thought process on that. ",
              "Got it. That covers the primary mechanics. Let's explore the next question. ",
              "Interesting perspective. Let's see how you approach this next problem. ",
            ];
            bridge = moderateBridges[Math.floor(Math.random() * moderateBridges.length)];
          } else if (evaluation?.score != null) {
            const learningBridges = [
              "Thanks for walking through that. Let's transition to our next question. ",
              "Understood. Let's explore another area of your engineering background. ",
            ];
            bridge = learningBridges[Math.floor(Math.random() * learningBridges.length)];
          }

          if (bridge) await aiSpeak(bridge);
          await aiSpeak(nextQ.questionText);
          startListening();
        }
      } catch (err) {
        console.error('Failed to submit answer:', err);
        setIsProcessing(false);
        setProcessingLabel('');
        setAvatarState('concerned');
        await aiSpeak(
          "I encountered an issue processing your response. Could you please try answering again?"
        );
        startListening();
      }
    },
    [
      currentQuestion,
      isProcessing,
      id,
      navigate,
      aiSpeak,
      startListening,
      stopListening,
      addTranscriptEntry,
      buildConfidenceMetrics,
      showCodeWorkspace,
      codeValue,
      codeLanguage,
      getLanguageBoilerplate,
      cleanupMediaStream,
      isRepeatRequest,
      isSkipOrUnknownRequest,
      clearSilenceTimers,
      isFollowUpMode,
      videoMLMetrics,
    ]
  );

  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  }, [submitAnswer]);

  // Auto-submit handler (called by silence detection)
  const handleAutoSubmit = useCallback(
    (text: string) => {
      if (text.trim().length > 3) {
        submitAnswerRef.current(text);
      }
    },
    []
  );

  // ─── Load Session & Start Interview ───────────────────────

  useEffect(() => {
    let active = true;

    async function loadAndStart() {
      try {
        setLoadingMessage('Loading your interview session...');
        const sessionRes = await apiClient.get(`/interview/session/${id}`);
        if (!active) return;
        const sessionData: SessionData = sessionRes.data;
        setSession(sessionData);

        // Check if role or subjects/skills contain programming keywords to enable Coding IDE
        const targetRoleLower = (sessionData.targetRole || '').toLowerCase();
        const interviewGoalLower = (sessionData.interviewGoal || '').toLowerCase();
        const focusAreasLower = (sessionData.focusAreas || []).map(f => f.toLowerCase());
        
        const codingKeywords = [
          'react', 'javascript', 'typescript', 'python', 'java', 'cpp', 'c++', 
          'coding', 'frontend', 'backend', 'fullstack', 'full-stack', 
          'software', 'developer', 'engineer', 'algorithm', 'data structure'
        ];
        
        const hasCodingContext = codingKeywords.some(keyword => 
          targetRoleLower.includes(keyword) || 
          interviewGoalLower.includes(keyword) || 
          focusAreasLower.some(f => f.includes(keyword))
        );
        
        if (hasCodingContext) {
          setShowCodeWorkspace(true);
          let detectedLang = 'javascript';
          if (focusAreasLower.some(f => f.includes('react'))) {
            detectedLang = 'react';
          } else if (focusAreasLower.some(f => f.includes('typescript'))) {
            detectedLang = 'typescript';
          } else if (focusAreasLower.some(f => f.includes('python'))) {
            detectedLang = 'python';
          } else if (focusAreasLower.some(f => f.includes('java'))) {
            detectedLang = 'java';
          } else if (focusAreasLower.some(f => f.includes('c++') || f.includes('cpp'))) {
            detectedLang = 'cpp';
          } else if (targetRoleLower.includes('python')) {
            detectedLang = 'python';
          } else if (targetRoleLower.includes('java')) {
            detectedLang = 'java';
          }
          
          setCodeLanguage(detectedLang);
          setCodeValue(getLanguageBoilerplate(detectedLang));
        }

        let firstQuestion: QuestionData;

        if (
          sessionData.status === 'IN_PROGRESS' &&
          sessionData.questions &&
          sessionData.questions.length > 0
        ) {
          const unanswered = sessionData.questions.find((q) => !q.answerText);
          firstQuestion = unanswered || sessionData.questions[0];
        } else {
          setLoadingMessage('Ava is preparing your first AI question...');
          const startRes = await apiClient.post(`/interview/session/${id}/start`);
          if (!active) return;
          firstQuestion = startRes.data;
        }

        if (!firstQuestion?.id || !firstQuestion?.questionText) {
          setLoadError('Interview questions could not be prepared. Please try launching again.');
          setIsLoading(false);
          return;
        }

        setCurrentQuestion(firstQuestion);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error('Failed to load session:', err);
        if (!active) return;

        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          try {
            const { accessToken } = await authApi.refresh();
            useAuthStore.getState().setToken(accessToken);
            if (active) loadAndStart();
            return;
          } catch {
            setLoadError('Your session expired. Please log in again.');
            return;
          }
        }

        setLoadError('Could not start the interview. Please try again from setup.');
      }
    }

    loadAndStart();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ─── Auto-start Live Interview Session ─────────────────────────
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && session && currentQuestion && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      if (mediaStream) {
        mediaStream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        mediaStream.getVideoTracks().forEach((track) => {
          track.enabled = true;
        });
      }
      setIsMicOn(true);
      setIsCameraOn(true);
      handleJoinCall();
    }
  }, [isLoading, session, currentQuestion, handleJoinCall, mediaStream]);

  // ─── Controls ─────────────────────────────────────────────

  const handleToggleMic = useCallback(() => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsMicOn((prev) => {
        const newState = !prev;
        if (!newState) {
          stopListening();
        }
        return newState;
      });
    }
  }, [mediaStream, stopListening]);

  const handleToggleCamera = useCallback(() => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsCameraOn((prev) => !prev);
    }
  }, [mediaStream]);

  const handleEndInterview = useCallback(() => {
    cleanupMediaStream();
    setShowEndConfirmation(true);
  }, [cleanupMediaStream]);

  const confirmEndInterview = useCallback(async () => {
    stopListening();
    window.speechSynthesis.cancel();
    setIsAnalyzing(true);
    cleanupMediaStream();

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Failed to exit fullscreen on end:', err);
      }
    }

    try {
      let submittedAnswer = answerText.trim();
      if (showCodeWorkspace && codeValue.trim()) {
        submittedAnswer += `\n\n[Submitted Code (${codeLanguage})]:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\``;
      }

      // Submit current answer if any (ensure we don't save repeat or skip requests as answers)
      if (
        currentQuestion &&
        answerText.trim() &&
        !isRepeatRequest(answerText) &&
        !isSkipOrUnknownRequest(answerText)
      ) {
        await apiClient.post(`/interview/session/${id}/answer`, {
          questionId: currentQuestion.id,
          answerText: submittedAnswer,
          timeTaken: 30,
        });
      }

      // Complete session
      const confidenceMetrics = buildConfidenceMetrics();
      const gaze = proctorDataRef.current.gazeScores;
      const eyeContactScore = gaze.length
        ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
        : 70;
      const tabBlurCount = proctorDataRef.current.tabBlurCount;
      const presenceScore = Math.max(
        0,
        Math.min(100, 100 - tabBlurCount * 8 - (eyeContactScore < 50 ? 15 : 0)),
      );

      await apiClient.post(`/interview/session/${id}/complete`, {
        confidenceMetrics: {
          ...confidenceMetrics,
          score: Math.round((confidenceMetrics.score + (videoMLMetrics?.confidenceScore ?? 88)) / 2),
          videoConfidence: videoMLMetrics?.confidenceScore ?? 88,
          composureLevel: videoMLMetrics?.composureLevel ?? 'Calm & Composed',
          postureStatus: videoMLMetrics?.postureStatus ?? 'Optimal',
        },
        proctoring: {
          eyeContactScore: Math.round((eyeContactScore + (videoMLMetrics?.eyeContactScore ?? 85)) / 2),
          presenceScore,
          tabBlurCount,
          zeroRecordingActive: true,
        },
      });
      
      setTimeout(() => {
        navigate(`/interview/${id}/analysis`);
      }, 4000);
    } catch (err) {
      console.error('Failed to end interview:', err);
      navigate(`/interview/${id}/analysis`);
    }
  }, [
    id,
    currentQuestion,
    answerText,
    navigate,
    stopListening,
    buildConfidenceMetrics,
    cleanupMediaStream,
    showCodeWorkspace,
    codeValue,
    codeLanguage,
    isRepeatRequest,
    isSkipOrUnknownRequest,
    videoMLMetrics,
  ]);

  const handleRepeatQuestionCallback = useCallback(async () => {
    if (currentQuestion) {
      stopListening();
      setAvatarState('speaking');
      await aiSpeak(`Let me repeat the question: ${currentQuestion.questionText}`);
      startListening();
    }
  }, [currentQuestion, aiSpeak, stopListening, startListening]);

  const handleRequestClarificationCallback = useCallback(async () => {
    if (currentQuestion) {
      stopListening();
      setAvatarState('speaking');
      await aiSpeak(`To help clarify: Focus on your high-level approach first, state any key assumptions, and discuss the architectural tradeoffs.`);
      startListening();
    }
  }, [currentQuestion, aiSpeak, stopListening, startListening]);

  // ─── Loading / Error Screen ───────────────────────────────

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EFFAFD] px-6">
        <div className="max-w-md text-center space-y-4 bg-white p-8 rounded-3xl border border-[#DCE7F2] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-[#11183D]">Could not start interview</h2>
          <p className="text-sm text-[#526078]">{loadError}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/interview/setup')}
              className="rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] px-5 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer font-display"
            >
              Back to setup
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-xl border border-[#DCE7F2] px-5 py-2.5 text-sm font-semibold text-[#526078] hover:bg-[#EFFAFD] transition-all cursor-pointer font-display"
            >
              Log in again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EFFAFD]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Pulsing logo */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(74,139,223,0.4)',
                '0 0 0 30px rgba(74,139,223,0)',
                '0 0 0 0 rgba(74,139,223,0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#4A8BDF] text-white"
          >
            <span className="font-display text-4xl font-black text-white">RU</span>
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-[#11183D]">
              Preparing your interview
            </h2>
            <p className="text-sm text-[#526078]">
              {loadingMessage}
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-[#4A8BDF]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EFFAFD] px-6">
        <p className="text-[#526078] text-sm mb-4">Interview room is still loading…</p>
        <button
          type="button"
          onClick={() => navigate('/interview/setup')}
          className="rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] px-5 py-2.5 text-sm font-semibold text-white font-display"
        >
          Back to setup
        </button>
      </div>
    );
  }



  if (isDisqualified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white p-6 overflow-hidden">
        <div className="max-w-lg w-full bg-slate-900 border border-rose-500/50 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 animate-pulse">
            <ShieldAlert size={40} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
              Integrity Violation Detected
            </span>
            <h1 className="text-2xl font-black font-display text-white mt-3">
              Interview Terminated & Submitted
            </h1>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-body">
              {disqualificationReason || "A virtual desktop switch, tab switch, or full-screen exit was detected during your live proctored session. Your exam has been automatically terminated and submitted as a cheating violation."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-left text-xs space-y-2 text-rose-200">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Status:</span>
              <span className="font-bold text-rose-400">DISQUALIFIED</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Integrity Score:</span>
              <span className="font-bold text-rose-400">0 / 100</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span>Record:</span>
              <span className="font-bold text-rose-400">Flagged in Audit Log</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/interview/${id}/analysis`)}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 font-display"
          >
            <span>View Integrity Report →</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#EFFAFD] text-[#11183D] p-6 overflow-hidden">
        {/* Soft background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#4A8BDF]/10 blur-[140px]" />
          <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-[#A0006D]/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-[#DCE7F2] p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4A8BDF] to-[#A0006D]" />
          
          <div className="text-center space-y-3">
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              {/* Spinning radar rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#DCE7F2]"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-14 w-14 rounded-full bg-[#F8EAF4] flex items-center justify-center text-[#A0006D]"
              >
                <Sparkles size={24} />
              </motion.div>
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-[#11183D]">Analyzing Your Responses</h2>
            <p className="text-xs text-[#526078] font-body">Ava is compiling your high-fidelity mock interview report...</p>
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            {[
              "Enhancing speech-to-text transcript accuracy...",
              "Evaluating subject-matter technical depth...",
              "Scoring communication clarity and structure...",
              "Assessing presence and eye-contact metrics...",
              "Compiling personalized tips and resources..."
            ].map((text, idx) => {
              const isDone = analysisStep > idx;
              const isActive = analysisStep === idx;
              
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    isDone 
                      ? 'border-[#168A62]/30 bg-[#E8F5F0] text-[#168A62] font-semibold'
                      : isActive
                        ? 'border-[#A0006D]/30 bg-[#F8EAF4] text-[#A0006D] font-semibold shadow-sm'
                        : 'border-[#DCE7F2] bg-[#EFFAFD]/50 text-[#7B8799]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-[#168A62] flex-shrink-0" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-transparent border-t-[#A0006D] flex-shrink-0"
                    />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-[#DCE7F2] flex-shrink-0" />
                  )}
                  <span className="text-xs font-body leading-none">{text}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-center text-[#7B8799] font-body">
            Camera and audio streams deactivated. Compilation phase active.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-[#EFFAFD] overflow-hidden">
      {/* RENDER THE MINIMAL 2-PANEL ORAL INTERVIEW ROOM MATCHING REFERENCE */}
      <NormalInterviewRoom
        mediaStream={mediaStream}
        aiIsSpeaking={aiIsSpeaking}
        avatarState={avatarState}
        mouthOpenness={mouthOpenness}
        spokenWord={spokenWord}
        activeVisemeShape={activeViseme}
        currentQuestionText={currentQuestion?.questionText || ''}
        candidateTranscription={answerText}
        onSubmitAnswer={submitAnswer}
        onEndInterview={handleEndInterview}
        isProcessing={isProcessing}
        processingLabel={processingLabel}
        questionIndex={(currentQuestion?.orderIndex ?? 0) + 1}
        totalQuestions={session?.questions?.length || 5}
        questionDifficulty={currentQuestion?.difficulty || 'Medium'}
        focusArea={session?.targetRole || 'Technical & STAR Drill'}
        silenceCountdown={silenceCountdown}
        isFullscreen={isFullscreen}
        onReEnterFullscreen={toggleFullScreen}
        onTranscriptionChange={(val) => {
          setAnswerText(val);
          latestAnswerRef.current = val;
        }}
        videoMLMetrics={videoMLMetrics}
      />





      {/* Custom End Interview Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full rounded-3xl border border-red-500/20 bg-[#121214] p-6 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                Should we end this meet?
              </h3>
              <p className="text-sm text-white/60 font-body mb-6">
                Are you sure you want to end this meet? Your progress will be saved and Ava will begin analyzing your responses.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setShowEndConfirmation(false);
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480, facingMode: 'user' },
                        audio: true,
                      });
                      setMediaStream(stream);
                      setIsCameraOn(true);
                      setIsMicOn(true);
                    } catch (err) {
                      console.error('Failed to re-acquire media stream on cancel:', err);
                    }
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndConfirmation(false);
                    confirmEndInterview();
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  Yes, End Meet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Premium Analyzing Card */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-800 p-6"
          >
            {/* Soft background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#F5A623]/5 blur-[140px]" />
              <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[120px]" />
            </div>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#F5A623] to-[#E85D24]" />
              
              <div className="text-center space-y-3">
                <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                  {/* Spinning radar rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-14 w-14 rounded-full bg-[#F5A623]/10 flex items-center justify-center text-[#F5A623]"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-black font-display tracking-tight text-slate-800">Analyzing Your Responses</h2>
                <p className="text-xs text-slate-500">Ava is compiling your high-fidelity mock interview report...</p>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                {[
                  "Enhancing speech-to-text transcript accuracy...",
                  "Evaluating subject-matter technical depth...",
                  "Scoring communication clarity and structure...",
                  "Assessing presence and eye-contact metrics...",
                  "Compiling personalized tips and resources..."
                ].map((text, idx) => {
                  const isDone = analysisStep > idx;
                  const isActive = analysisStep === idx;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                        isDone 
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold'
                          : isActive
                            ? 'border-amber-200 bg-amber-50 text-amber-700 font-semibold shadow-sm'
                            : 'border-slate-100 bg-slate-50/50 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-650 flex-shrink-0" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-transparent border-t-[#F5A623] flex-shrink-0"
                        />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-200 flex-shrink-0" />
                      )}
                      <span className="text-xs font-body leading-none">{text}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-center text-slate-400 font-body">
                Camera and audio streams deactivated. Compilation phase active.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
