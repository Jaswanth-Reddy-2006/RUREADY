import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, Play, Clock, Code2, Lightbulb, Mic, MicOff, Video, VideoOff, 
  Terminal, Shield, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle, 
  X, ChevronDown, ChevronUp, Copy, BookOpen, AlertTriangle, Send,
  MessageSquare, Layers, Check, Volume2, Cpu, FileCode2, Eye
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import AIAvatar, { type AvatarState } from './AIAvatar';
import UserCamera from './UserCamera';
import LiveTranscript, { type TranscriptEntry } from './LiveTranscript';
import InterviewTimer from './InterviewTimer';
import { speakWithLipSync, loadSpeechVoices } from '../../lib/speech';
import { useFaceTelemetry } from '../../hooks/useFaceTelemetry';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

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
  hintCount: number;
}

interface QuestionData {
  id: string;
  orderIndex: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  answerText?: string | null;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python 3' },
  { value: 'java', label: 'Java 17' }
];

const LANGUAGE_BOILERPLATES: Record<string, string> = {
  javascript: `// Write your JavaScript solution here
function solve(input) {
  // 1. Clarify constraints & edge cases
  // 2. Implement your optimal algorithm
  return null;
}

// Example local test call:
console.log(solve([2, 7, 11, 15]));`,
  typescript: `// Write your TypeScript solution here
function solve(input: any): any {
  // 1. Clarify constraints & edge cases
  // 2. Implement your optimal algorithm
  return null;
}

console.log(solve([2, 7, 11, 15]));`,
  python: `# Write your Python solution here
def solve(input_val):
    # 1. Clarify constraints & edge cases
    # 2. Implement your optimal algorithm
    return None

print(solve([2, 7, 11, 15]))`,
  java: `// Write your Java solution here
import java.util.*;

public class Solution {
    public static Object solve(Object input) {
        return null;
    }

    public static void main(String[] args) {
        System.out.println("Solution initialized.");
    }
}`
};

export default function CodingInterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Core Room States
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Booting up Monaco compiler engine...');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');

  // Active Panel Tabs
  const [leftTab, setLeftTab] = useState<'problem' | 'dialogue' | 'hints'>('problem');
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'terminal'>('testcases');

  // Socratic Coding States
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeValue, setCodeValue] = useState(LANGUAGE_BOILERPLATES.javascript);
  const [hintCount, setLocalHintCount] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState('Terminal sandbox initialized. Click [Run Test Cases] to execute.');
  const [consoleColor, setConsoleColor] = useState('text-slate-300');
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<{
    passedCount: number;
    totalCount: number;
    success: boolean;
    errorDetails?: string;
    language?: string;
    stdout?: string;
    runtimeMs?: number;
    testResults?: Array<{
      testCaseIndex: number;
      passed: boolean;
      input: any;
      expected: any;
      actual?: any;
      executionTimeMs?: number;
      error?: string;
    }>;
  } | null>(null);

  // Audio/Video Hardware Telemetry
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // AI Speech/Avatar Animation States
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0.08);
  const [spokenWord, setSpokenWord] = useState('');
  const [clarificationInput, setClarificationInput] = useState('');

  // Speech Recognition States (Web Speech API)
  const [answerText, setAnswerText] = useState('');
  const finalTranscriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const latestAnswerRef = useRef('');

  // Interview History
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isLobbyOpen, setIsLobbyOpen] = useState(true);
  const [verifyingSystem, setVerifyingSystem] = useState(true);

  // Proctoring telemetry logs
  const proctorDataRef = useRef({
    tabBlurCount: 0,
    gazeScores: [] as number[],
  });

  const questionStartRef = useRef<number | null>(null);
  const currentQuestionRef = useRef<QuestionData | null>(null);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // Face telemetry tracking engine
  const { stressCoefficient, isOffGaze, eyeGazeScore } = useFaceTelemetry(mediaStream, isCameraOn, id);

  useEffect(() => {
    if (isCameraOn && mediaStream) {
      proctorDataRef.current.gazeScores.push(eyeGazeScore);
      if (proctorDataRef.current.gazeScores.length > 200) {
        proctorDataRef.current.gazeScores.shift();
      }
    }
  }, [eyeGazeScore, isCameraOn, mediaStream]);

  // Browser anti-cheat blocks
  useEffect(() => {
    const handleBlur = () => {
      proctorDataRef.current.tabBlurCount++;
      toast.error('SECURITY ALERT: Tab deviation detected. Please keep focus on your coding workspace.', {
        duration: 4000
      });
    };

    const blockBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('blur', handleBlur);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBackNavigation);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, []);

  // Compile and execute candidate code against sandbox test cases
  const handleRunCode = async () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    setConsoleColor('text-slate-400 animate-pulse');
    setConsoleOutput('Compiling code and running sandboxed test matrix...\n');
    setConsoleTab('testcases');

    try {
      const response = await apiClient.post(`/interview/session/${id}/run`, {
        code: codeValue,
        language: codeLanguage
      });

      const result = response.data;
      setTestResults(result);
      const timestamp = new Date().toLocaleTimeString();

      if (result.success) {
        setConsoleColor('text-emerald-400');
        let logs = `[${timestamp}] COMPILATION & TEST SUITE PASSED\n`;
        logs += `==========================================\n`;
        logs += `Status: SUCCESS (${result.passedCount}/${result.totalCount} test cases passed)\n\n`;
        logs += `All test cases passed. Your code is verified for algorithmic submission!`;
        setConsoleOutput(logs);
        toast.success(`Passed all ${result.passedCount}/${result.totalCount} test cases!`);

        // Ava acknowledges successful execution
        setAvatarState('pleased');
        await aiSpeak("Great job! All unit test cases passed. When you are ready, explain your time and space complexity and submit your final solution.");
      } else {
        setConsoleColor('text-orange-400');
        let logs = `[${timestamp}] TEST SUITE NOTICE\n`;
        logs += `==========================================\n`;
        logs += `Passed: ${result.passedCount}/${result.totalCount} test cases\n\n`;
        logs += `${result.errorDetails || 'Incorrect return value for edge cases.'}`;
        setConsoleOutput(logs);
        toast.error(`Passed ${result.passedCount}/${result.totalCount} test cases. Check edge conditions.`);
      }
    } catch (err: any) {
      setConsoleColor('text-rose-400');
      const errMsg = err.response?.data?.error || err.message || 'Execution error';
      setConsoleOutput(`[COMPILER ERROR] Execution halted: ${errMsg}`);
      toast.error('Code execution failed. Check syntax.');
    } finally {
      setIsRunningCode(false);
    }
  };

  // Add system speaker transcript entries
  const addTranscriptEntry = useCallback((speaker: 'ai' | 'user', text: string) => {
    setTranscript((prev) => [
      ...prev,
      {
        id: `${speaker}-${Date.now()}-${Math.random()}`,
        speaker,
        text,
        timestamp: Date.now()
      }
    ]);
  }, []);

  // AI Voice speech synthesizer
  const aiSpeak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      addTranscriptEntry('ai', text);
      setAvatarState('speaking');
      setSpokenWord('');

      speakWithLipSync(text, {
        onStart: () => setAiIsSpeaking(true),
        onEnd: () => {
          setAiIsSpeaking(false);
          setMouthOpenness(0.08);
          setSpokenWord('');
          setAvatarState('listening');
          resolve();
        },
        onViseme: (openness, fragment) => {
          setMouthOpenness(openness);
          if (fragment.trim()) setSpokenWord(fragment.trim());
        }
      });
    });
  }, [addTranscriptEntry]);

  // Speech Recognition control hooks
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isMicOn) return;

    setAvatarState('listening');
    setAnswerText('');
    finalTranscriptRef.current = '';
    isListeningRef.current = true;

    try {
      recognitionRef.current.start();
    } catch {
      // Already running
    }
  }, [isMicOn]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
    }
  }, []);

  // Socratic Progressive Hint protocol
  const handleAskForHint = async () => {
    if (isProcessing || hintCount >= 3) return;
    
    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is analyzing your approach to generate a progressive hint...');

    try {
      const hintRes = await apiClient.post(`/interview/session/${id}/hint`);
      const newCount = hintRes.data.hintCount;
      setLocalHintCount(newCount);

      const hintPrompt = `[System Intervention]: Candidate requested Hint Level ${newCount}. Current Code in Monaco IDE:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\`\nProvide a subtle progressive Socratic hint without revealing complete code.`;
      
      const answerRes = await apiClient.post(`/interview/session/${id}/answer`, {
        questionId: currentQuestion?.id || '',
        answerText: hintPrompt,
        timeTaken: 10
      });

      const evaluation = answerRes.data.evaluation;
      const hintText = evaluation?.feedback || (
        newCount === 1 
          ? "Consider whether a two-pointer technique or hash table could reduce your lookup complexity from O(N²) to O(N)."
          : newCount === 2
            ? "Think about tracking elements you've already seen in a frequency map or Set while traversing the array."
            : "Review your loop bounds and edge cases when the input list has duplicate numbers or is empty."
      );

      setUnlockedHints(prev => [...prev, hintText]);
      setLeftTab('hints');
      setIsProcessing(false);
      setProcessingLabel('');

      await aiSpeak(hintText);
      startListening();
      toast.success(`Progressive Hint ${newCount}/3 unlocked!`);
    } catch (err) {
      console.error('Failed to retrieve hint:', err);
      setIsProcessing(false);
      setProcessingLabel('');
      toast.error('Ava could not formulate a hint right now.');
    }
  };

  // Interactive Clarification or Speech Submission to Ava
  const handleSendClarificationToAva = async (textToSend?: string) => {
    const text = (textToSend || clarificationInput || answerText).trim();
    if (!text || isProcessing) return;

    setClarificationInput('');
    setAnswerText('');
    finalTranscriptRef.current = '';
    addTranscriptEntry('user', text);
    stopListening();

    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is reviewing your reasoning...');

    try {
      const response = await apiClient.post(`/interview/session/${id}/answer`, {
        questionId: currentQuestion?.id || '',
        answerText: `[Candidate Speech to Interviewer]: ${text}\n[Current Code Snapshot]:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\``,
        timeTaken: 15
      });

      const evalFeedback = response.data?.evaluation?.feedback || 
        "That's a sound way to approach it. How does the space complexity scale as the input size grows?";

      setIsProcessing(false);
      setProcessingLabel('');
      setLeftTab('dialogue');
      await aiSpeak(evalFeedback);
      startListening();
    } catch (err) {
      console.error('Failed to communicate with Ava:', err);
      setIsProcessing(false);
      setProcessingLabel('');
      startListening();
    }
  };

  // Submit code solution & transcript
  const submitSolution = useCallback(async () => {
    if (!currentQuestion || isProcessing) return;

    const spokenAnswer = latestAnswerRef.current.trim();
    stopListening();
    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is compiling your final code solution and STAR score metrics...');

    try {
      await apiClient.post(`/interview/session/${id}/answer`, {
        questionId: currentQuestion.id,
        answerText: `[Final Submission in ${codeLanguage}]:\n\`\`\`${codeLanguage}\n${codeValue}\n\`\`\`\n[Candidate Final Verbal Defense]: ${spokenAnswer || 'Complete solution submitted.'}`,
        timeTaken: Math.max(10, Math.floor((Date.now() - (questionStartRef.current || Date.now())) / 1000)),
      });
      
      const nextRes = await apiClient.get(`/interview/session/${id}/next`);

      if (nextRes.data.isComplete) {
        setAvatarState('pleased');
        await aiSpeak(
          "Outstanding work! You have completed the coding evaluation round. I am generating your granular readiness report and technical scorecard now."
        );
        
        if (mediaStream) {
          mediaStream.getTracks().forEach((t) => t.stop());
        }

        const confidenceMetrics = {
          score: 88,
          signals: {
            avgWpm: 130,
            avgPauseCount: 1.2,
            avgAnswerLength: 95
          }
        };

        const gaze = proctorDataRef.current.gazeScores;
        const eyeContactScore = gaze.length
          ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
          : 85;
        const tabBlurCount = proctorDataRef.current.tabBlurCount;
        const presenceScore = Math.max(0, Math.min(100, 100 - tabBlurCount * 10));

        await apiClient.post(`/interview/session/${id}/complete`, {
          confidenceMetrics,
          proctoring: {
            eyeContactScore,
            presenceScore,
            tabBlurCount
          }
        });

        toast.success('Coding Assessment Completed!');
        navigate(`/interview/${id}/analysis`);
      } else {
        const nextQ = nextRes.data.question;
        setCurrentQuestion(nextQ);
        setAnswerText('');
        latestAnswerRef.current = '';
        setIsProcessing(false);
        setProcessingLabel('');
        
        await aiSpeak(`Great progress. Here is your next problem: ${nextQ.questionText}`);
        startListening();
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setIsProcessing(false);
      setProcessingLabel('');
      toast.error('Failed to submit solution. Please try again.');
      startListening();
    }
  }, [id, currentQuestion, isProcessing, codeValue, codeLanguage, aiSpeak, startListening, stopListening, navigate, mediaStream]);

  // Speech Recognition lifecycle setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
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
      const combined = `${finalTranscriptRef.current}${interimText}`.replace(/\s+/g, ' ').trim();
      setAnswerText(combined);
      latestAnswerRef.current = combined;
    };

    rec.onend = () => {
      if (isListeningRef.current) {
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Hardware setups
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    let active = true;
    let localStream: MediaStream | null = null;

    async function setupHardware() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: true,
        });
        if (active) {
          setMediaStream(stream);
          localStream = stream;
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.error('Failed to secure proctoring cameras:', err);
        toast.error('Camera/Mic access is required for proctoring.');
      }
    }

    setupHardware();
    loadSpeechVoices();

    return () => {
      active = false;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
      }
      if (editorRef.current) {
        try {
          editorRef.current.dispose();
        } catch {}
      }
    };
  }, []);

  // Fetch Session data on mount
  useEffect(() => {
    async function loadSession() {
      try {
        setLoadingMessage('Configuring secure IDE container...');
        const sessionRes = await apiClient.get(`/interview/session/${id}`);
        setSession(sessionRes.data);
        setLocalHintCount(sessionRes.data.hintCount || 0);

        setLoadingMessage('Calibrating Ava Socratic intelligence...');
        let activeQuestion: QuestionData;
        
        if (sessionRes.data.status === 'IN_PROGRESS' && sessionRes.data.questions?.length > 0) {
          const unanswered = sessionRes.data.questions.find((q: any) => !q.answerText);
          activeQuestion = unanswered || sessionRes.data.questions[0];
        } else {
          const startRes = await apiClient.post(`/interview/session/${id}/start`);
          activeQuestion = startRes.data;
        }

        setCurrentQuestion(activeQuestion);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to bootstrap coding session:', err);
        setLoadError('Failed to initialize coding playground session.');
        setIsLoading(false);
      }
    }

    loadSession();
  }, [id]);

  // Join full screen from Lobby
  const handleJoinCall = async () => {
    try {
      const container = document.documentElement;
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch {}

    setIsLobbyOpen(false);

    if (session && currentQuestion) {
      const intro = `Welcome to the live technical coding assessment. I am Ava. I will evaluate your algorithmic reasoning, code structuring, and complexity defense. Take your time to review the problem statement on the left, discuss your approach with me, and run test cases when you write code. Let's begin: ${currentQuestion.questionText}`;
      await aiSpeak(intro);
      startListening();
    }
  };

  // Language switch handler with boilerplate updates
  const handleLanguageChange = (newLang: string) => {
    setCodeLanguage(newLang);
    setCodeValue(LANGUAGE_BOILERPLATES[newLang] || LANGUAGE_BOILERPLATES.javascript);
    toast.success(`Switched to ${newLang.toUpperCase()}`);
  };

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 px-6 text-white font-body">
        <div className="max-w-md w-full border border-rose-200 bg-white rounded-3xl p-8 text-center space-y-5 shadow-2xl text-slate-800">
          <AlertCircle size={48} className="text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold font-display text-slate-900">Session Initialization Failed</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{loadError}</p>
          <Button onClick={() => navigate('/dashboard')} fullWidth>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white font-body">
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FF7A00] to-[#E66E00] shadow-xl animate-pulse">
            <Code2 className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-display text-white">SECURE CODING SANDBOX</h2>
            <p className="text-xs text-slate-400 font-body">{loadingMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Pre-interview Lobby View
  if (isLobbyOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white p-4 font-body select-none overflow-y-auto">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          
          {/* Camera Telemetry Feed */}
          <div className="lg:col-span-7 flex flex-col space-y-4 w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-display">
              <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span>LIVE PROCTORING HARDWARE FEED</span>
            </div>
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shadow-2xl relative">
              <UserCamera
                stream={mediaStream}
                isMicActive={isMicOn}
                isCameraOn={isCameraOn}
                className="w-full h-full object-cover scale-x-[-1]"
                userName="Identity Preview Feed"
              />
            </div>
          </div>

          {/* Session Info & Enter CTA */}
          <div className="lg:col-span-5 flex flex-col space-y-6 w-full">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF7A00] to-orange-400" />
              
              <div>
                <span className="text-[11px] font-bold uppercase text-[#FF7A00] tracking-wider font-mono">
                  Socratic Algorithm Assessment
                </span>
                <h1 className="text-2xl font-black font-display text-white tracking-tight mt-1">
                  Ready to solve?
                </h1>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Monaco compiler sandbox running under anti-cheat isolation layers is fully calibrated.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <span className="text-xs font-semibold text-slate-400">Target Role</span>
                  <span className="text-xs font-bold text-white bg-[#FF7A00]/20 border border-[#FF7A00]/40 px-3 py-1 rounded-lg">
                    {session?.targetRole || 'Software Engineer'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Seniority</span>
                    <span className="text-xs font-bold text-white mt-1 capitalize">{session?.experienceLevel || 'Fresher'}</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Interviewer</span>
                    <span className="text-xs font-bold text-[#FF7A00] mt-1">Ava Socratic AI</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleJoinCall}
                  size="lg"
                  fullWidth
                  iconRight={<ChevronRight size={16} />}
                  className="shadow-lg shadow-orange-500/20"
                >
                  Enter Live Coding Studio →
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-body text-slate-200 select-none"
      onCopy={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard copying is locked during interview.'); }}
      onCut={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard cutting is locked during interview.'); }}
      onPaste={(e) => { e.preventDefault(); toast.error('SECURITY: Clipboard pasting is locked during interview.'); }}
    >
      {/* AI Compiler Thinking Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          >
            <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="mx-auto h-12 w-12 border-3 border-[#FF7A00] border-t-transparent animate-spin rounded-full" />
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">Ava Socratic Engine</h3>
                <p className="text-xs text-slate-400 mt-1 font-body">{processingLabel}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E66E00] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <Code2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-white font-display tracking-tight block">
              RU READY Technical Coding Assessment
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {session?.targetRole || 'Software Engineer'} • {currentQuestion?.difficulty || 'MEDIUM'} Track
            </span>
          </div>
        </div>

        {/* Telemetry & Timer */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">Eye Gaze:</span>
            <span className="text-emerald-400 font-bold">{eyeGazeScore}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <Shield size={13} />
            <span className="hidden md:inline">ANTI-CHEAT ACTIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <InterviewTimer isRunning={!isLobbyOpen} />
          </div>
        </div>
      </header>

      {/* Main Studio 2-Pane Split */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        
        {/* LEFT PANE (42vw): Problem Details, Socratic Dialogue & Ava AI Avatar */}
        <section className="w-[42vw] h-full flex flex-col border-r border-slate-800 bg-slate-900 min-w-[380px] overflow-hidden">
          
          {/* Left Navigation Tabs */}
          <div className="h-11 shrink-0 bg-slate-950/80 border-b border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[
                { id: 'problem', label: 'Problem', icon: BookOpen },
                { id: 'dialogue', label: 'Ava Dialogue', icon: MessageSquare },
                { id: 'hints', label: `Hints (${hintCount}/3)`, icon: Lightbulb },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = leftTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLeftTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon size={13} className={isSelected ? 'text-[#FF7A00]' : ''} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAskForHint}
              disabled={isProcessing || hintCount >= 3}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold rounded-lg text-xs cursor-pointer transition-all active:scale-[0.98]"
              title="Get a progressive Socratic hint from Ava"
            >
              <Lightbulb size={12} />
              <span>Hint ({3 - hintCount} left)</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* TAB 1: Problem Statement */}
            {leftTab === 'problem' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-display text-white">
                    {currentQuestion?.questionText.split('\n')[0] || 'Algorithmic Problem'}
                  </h2>
                  <Badge variant="orange" size="xs">
                    {currentQuestion?.difficulty || 'Medium'}
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs leading-relaxed text-slate-300 font-body space-y-3">
                  <p className="whitespace-pre-wrap">
                    {currentQuestion?.questionText || 'Given an array of integers, return the indices of two numbers that add up to target.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                    Constraints & Socratic Goals
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1 font-body list-disc list-inside">
                    <li>Optimal Time Complexity: \(O(N)\) or \(O(N \log N)\)</li>
                    <li>Auxiliary Space Complexity: \(O(1)\) to \(O(N)\)</li>
                    <li>Handle edge cases with empty arrays or negative values.</li>
                  </ul>
                </div>

                {/* Quick Approach Review CTA */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-slate-950 to-slate-950 border border-orange-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FF7A00]" />
                    <span className="text-xs font-bold text-white font-display">Discuss with Ava</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-body">
                    Explain your algorithmic approach or brute-force intuition out loud to receive immediate feedback.
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSendClarificationToAva("Ava, I'd like to clarify my approach before coding.")}
                    icon={<Mic size={12} />}
                  >
                    Discuss Approach with Ava
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: Ava Dialogue & Transcript */}
            {leftTab === 'dialogue' && (
              <div className="space-y-3 h-full flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed font-body ${
                        entry.speaker === 'ai'
                          ? 'bg-slate-800/70 border border-slate-700/60 text-slate-200 ml-0 mr-4'
                          : 'bg-orange-500/15 border border-orange-500/30 text-orange-200 ml-4 mr-0'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1 font-display text-[10px] uppercase">
                        {entry.speaker === 'ai' ? (
                          <span className="text-[#FF7A00] flex items-center gap-1">
                            <Sparkles size={10} /> Ava Socratic AI
                          </span>
                        ) : (
                          <span className="text-slate-300">You (Candidate)</span>
                        )}
                      </div>
                      <p>{entry.text}</p>
                    </div>
                  ))}
                </div>

                {/* Voice / Text Question Box to Ava */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask Ava for clarification or complexity feedback..."
                    value={clarificationInput}
                    onChange={(e) => setClarificationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendClarificationToAva()}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                  <button
                    onClick={() => handleSendClarificationToAva()}
                    disabled={isProcessing || !clarificationInput.trim()}
                    className="p-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#E66E00] text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Progressive Hints */}
            {leftTab === 'hints' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                    Socratic Hints Protocol
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    Level {hintCount} of 3
                  </span>
                </div>

                {unlockedHints.length === 0 ? (
                  <div className="text-center py-10 space-y-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <Lightbulb size={24} className="text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-body">
                      No hints consumed yet. Try solving first, or click [Hint] if you get stuck.
                    </p>
                    <Button size="sm" onClick={handleAskForHint} disabled={hintCount >= 3}>
                      Unlock Level 1 Hint
                    </Button>
                  </div>
                ) : (
                  unlockedHints.map((hint, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                        Progressive Hint Level 0{idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 font-body leading-relaxed">{hint}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Bottom Left: Ava AI Avatar & Candidate Video Strip */}
          <div className="h-44 shrink-0 border-t border-slate-800 bg-slate-950 p-4 grid grid-cols-2 gap-3 items-center">
            {/* Ava AI Avatar Box */}
            <div className="h-full rounded-2xl bg-slate-900 border border-slate-800 p-3 flex items-center gap-3 relative overflow-hidden">
              <div className="h-16 w-16 rounded-xl bg-slate-950 border border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                <AIAvatar
                  state={avatarState}
                  isSpeaking={aiIsSpeaking}
                  mouthOpenness={mouthOpenness}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold text-white font-display">Ava AI</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug truncate">
                  {aiIsSpeaking ? spokenWord || 'Speaking...' : 'Listening to candidate...'}
                </p>
              </div>
            </div>

            {/* Candidate User Video Box */}
            <div className="h-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center">
              <UserCamera
                stream={mediaStream}
                isMicActive={isMicOn}
                isCameraOn={isCameraOn}
                className="w-full h-full object-cover scale-x-[-1]"
                userName="You"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified</span>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT PANE (58vw): Monaco Code Studio & Interactive Test Console */}
        <section className="flex-1 h-full flex flex-col bg-slate-950 min-w-[500px]">
          
          {/* Top IDE Toolbar */}
          <div className="h-11 shrink-0 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">Language:</span>
              <select
                value={codeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs font-semibold text-white px-2.5 py-1 rounded-lg focus:outline-none focus:border-[#FF7A00] cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRunCode}
                disabled={isRunningCode || isProcessing}
                icon={<Play size={12} className="text-[#FF7A00]" />}
              >
                {isRunningCode ? 'Running Sandbox...' : 'Run Test Cases'}
              </Button>

              <Button
                size="sm"
                onClick={submitSolution}
                disabled={isProcessing}
                iconRight={<ChevronRight size={14} />}
              >
                Submit Solution
              </Button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-0 relative bg-[#1E1E1E]">
            <Editor
              height="100%"
              language={codeLanguage === 'python' ? 'python' : codeLanguage === 'java' ? 'java' : 'javascript'}
              theme="vs-dark"
              value={codeValue}
              onChange={(val) => setCodeValue(val || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                tabSize: 2,
                cursorBlinking: 'smooth',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Bottom Expandable Test Cases & Compiler Console */}
          <div className={`shrink-0 border-t border-slate-800 bg-slate-900 flex flex-col transition-all duration-300 ${isConsoleOpen ? 'h-52' : 'h-10'}`}>
            
            {/* Console Header Bar */}
            <div className="h-10 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('testcases');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'testcases' ? 'bg-slate-800 text-[#FF7A00]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unit Test Cases {testResults ? `(${testResults.passedCount}/${testResults.totalCount})` : ''}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('terminal');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'terminal' ? 'bg-slate-800 text-[#FF7A00]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compiler Output
                </button>
              </div>

              <button
                onClick={() => setIsConsoleOpen(prev => !prev)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                {isConsoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                <span>{isConsoleOpen ? 'Collapse' : 'Expand'}</span>
              </button>
            </div>

            {/* Console Body */}
            {isConsoleOpen && (
              <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs">
                {consoleTab === 'testcases' ? (
                  <div className="space-y-3">
                    {testResults ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Execution Result:</span>
                            <span className="text-slate-400 text-[11px]">({testResults.language || codeLanguage} runtime)</span>
                          </div>
                          <Badge variant={testResults.success ? "success" : "error"} size="xs">
                            {testResults.success ? 'All Passed ✓' : `${testResults.passedCount}/${testResults.totalCount} Passed`}
                          </Badge>
                        </div>

                        {/* Individual Test Cases Matrix */}
                        {testResults.testResults && testResults.testResults.length > 0 && (
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {testResults.testResults.map((tc: any, i: number) => (
                              <div
                                key={i}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                                  tc.passed
                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                    : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span className="flex items-center gap-1.5 font-display">
                                    <span className={`h-2 w-2 rounded-full ${tc.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                    Test Case #{tc.testCaseIndex || i + 1}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {tc.executionTimeMs ? `${tc.executionTimeMs}ms` : 'Passed'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-300">
                                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Input:</span>
                                    <span className="truncate block">{JSON.stringify(tc.input)}</span>
                                  </div>
                                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Expected:</span>
                                    <span className="truncate block text-emerald-400">{JSON.stringify(tc.expected)}</span>
                                  </div>
                                </div>
                                {tc.actual !== undefined && !tc.passed && (
                                  <div className="bg-rose-950/50 p-1.5 rounded-lg border border-rose-800 text-[11px]">
                                    <span className="text-rose-400 font-bold block text-[9px] uppercase">Got:</span>
                                    <span className="text-rose-200">{JSON.stringify(tc.actual)}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {testResults.errorDetails && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                            {testResults.errorDetails}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic p-4 text-center">
                        Click [Run Test Cases] to test your code against sandbox test cases.
                      </div>
                    )}
                  </div>
                ) : (
                  <pre className={`whitespace-pre-wrap leading-relaxed select-text ${consoleColor}`}>
                    {consoleOutput}
                  </pre>
                )}
              </div>
            )}

          </div>

        </section>

      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 shrink-0 border-t border-slate-800 bg-slate-950 px-6 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Monaco Sandbox Node.js VM • Sandboxed</span>
        </div>

        {answerText && (
          <div className="flex items-center gap-2 text-orange-400 font-sans italic truncate max-w-md">
            <Mic size={12} className="animate-pulse" />
            <span className="truncate">"{answerText}"</span>
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to exit the assessment?")) {
              navigate('/dashboard');
            }
          }}
          className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          Abandon Assessment
        </button>
      </footer>
    </div>
  );
}

