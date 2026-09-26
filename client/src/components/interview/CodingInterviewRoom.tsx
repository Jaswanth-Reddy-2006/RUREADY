import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, Play, Clock, Code2, Lightbulb, Mic, MicOff, Video, VideoOff, 
  Terminal, Shield, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle, 
  X, ChevronDown, ChevronUp, AlertTriangle, Send,
  MessageSquare, Layers, Check, Volume2, Cpu, Eye, ShieldCheck, ShieldAlert
} from 'lucide-react';
import apiClient from '../../api/client';
import { codingApi, type CodeEvaluationResponse, type IdealSolutionResponse } from '../../api/coding';
import toast from 'react-hot-toast';
import AIAvatar, { type AvatarState } from './AIAvatar';
import { mapVisemeIdToOculus, type OculusViseme } from './visemeMapper';
import UserCamera from './UserCamera';
import LiveTranscript, { type TranscriptEntry } from './LiveTranscript';
import InterviewTimer from './InterviewTimer';
import { speakWithLipSync, loadSpeechVoices } from '../../lib/speech';
import { useFaceTelemetry } from '../../hooks/useFaceTelemetry';
import { useCandidateAnalysis } from '../../hooks/useCandidateAnalysis';
import ExitConfirmationModal from './ExitConfirmationModal';
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
  difficulty?: string;
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
  { value: 'java', label: 'Java 17' },
  { value: 'cpp', label: 'C++ (GCC)' },
  { value: 'go', label: 'Go (Golang)' }
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
}`,
  cpp: `// Write your C++ solution here
#include <iostream>
#include <vector>

class Solution {
public:
    void solve() {
        // 1. Clarify constraints & edge cases
        // 2. Implement your optimal algorithm
    }
};

int main() {
    std::cout << "Solution initialized." << std::endl;
    return 0;
}`,
  go: `// Write your Go solution here
package main

import "fmt"

func solve() {
    // 1. Clarify constraints & edge cases
    // 2. Implement your optimal algorithm
}

func main() {
    fmt.Println("Solution initialized.")
}`
};

const FALLBACK_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'EASY',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

### Example 1:
\`\`\`text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`text
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Example 3:
\`\`\`text
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

### Constraints:
• \`2 <= nums.length <= 10^4\`
• \`-10^9 <= nums[i] <= 10^9\`
• \`-10^9 <= target <= 10^9\`
• Only one valid answer exists.`,
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your optimal solution here\n  return [0, 1];\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Write your optimal solution here\n  return [0, 1];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your optimal solution here\n    return [0, 1]`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your optimal solution here\n        return new int[]{0, 1};\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        return {0, 1};\n    }\n};`,
      go: `package main\n\nfunc twoSum(nums []int, target int) []int {\n    return []int{0, 1}\n}`
    }
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'EASY',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.

### Example 1:
\`\`\`text
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

### Example 2:
\`\`\`text
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
\`\`\`

### Constraints:
• \`1 <= s.length <= 2 * 10^5\`
• \`s\` consists only of printable ASCII characters.`,
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n  // Write your optimal solution here\n  return true;\n}`,
      typescript: `function isPalindrome(s: string): boolean {\n  // Write your optimal solution here\n  return true;\n}`,
      python: `def isPalindrome(s: str) -> bool:\n    # Write your optimal solution here\n    return True`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    bool isPalindrome(std::string s) {\n        return true;\n    }\n};`,
      go: `package main\n\nfunc isPalindrome(s string) bool {\n    return true\n}`
    }
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'EASY',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

### Example 1:
\`\`\`text
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
\`\`\`

### Example 2:
\`\`\`text
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
\`\`\`

### Constraints:
• \`1 <= prices.length <= 10^5\`
• \`0 <= prices[i] <= 10^4\``,
    starterCode: {
      javascript: `/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Write your optimal solution here\n  return 0;\n}`,
      typescript: `function maxProfit(prices: number[]): number {\n  // Write your optimal solution here\n  return 0;\n}`,
      python: `def maxProfit(prices: list[int]) -> int:\n    # Write your optimal solution here\n    return 0`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int maxProfit(std::vector<int>& prices) {\n        return 0;\n    }\n};`,
      go: `package main\n\nfunc maxProfit(prices []int) int {\n    return 0\n}`
    }
  }
];

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

  // Active Console Tab
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'terminal'>('testcases');

  // Multi-Problem Catalog & Active Problem State (Total count hidden from candidate)
  const [problems, setProblems] = useState<any[]>(FALLBACK_PROBLEMS);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [currentProblem, setCurrentProblem] = useState<any>(FALLBACK_PROBLEMS[0]);
  const [savedCodes, setSavedCodes] = useState<Record<string, Record<string, string>>>({});

  // Real-time Captions State
  const [activeCaption, setActiveCaption] = useState<{ speaker: 'ava' | 'user'; text: string } | null>({
    speaker: 'ava',
    text: "Welcome to your technical coding assessment. Review the problem on the left and run test cases when you write code."
  });

  // Socratic Coding States
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeValue, setCodeValue] = useState(LANGUAGE_BOILERPLATES.javascript);
  const [hintCount, setLocalHintCount] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState('Terminal sandbox initialized. Click [Run Test Cases] to execute.');
  const [consoleColor, setConsoleColor] = useState('text-slate-300');
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<CodeEvaluationResponse | null>(null);
  const [interviewerFeedback, setInterviewerFeedback] = useState<any>(null);

  // Audio/Video Hardware Telemetry
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // AI Speech/Avatar Animation States
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0.08);
  const [spokenWord, setSpokenWord] = useState('');
  const [activeViseme, setActiveViseme] = useState<OculusViseme>('viseme_sil');
  const [clarificationInput, setClarificationInput] = useState('');

  // Speech Recognition States (Web Speech API)
  const [answerText, setAnswerText] = useState('');
  const finalTranscriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const latestAnswerRef = useRef('');

  // Interview History
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

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

  // Face telemetry & Proctoring engine
  const { stressCoefficient, isOffGaze, eyeGazeScore } = useFaceTelemetry(mediaStream, isCameraOn, id);

  // Multi-Modal Behavioral & Speech Telemetry Engine
  const candidateMetrics = useCandidateAnalysis(mediaStream, isCameraOn, isMicOn, id, answerText);

  useEffect(() => {
    if (isCameraOn && mediaStream) {
      proctorDataRef.current.gazeScores.push(eyeGazeScore);
      if (proctorDataRef.current.gazeScores.length > 200) {
        proctorDataRef.current.gazeScores.shift();
      }
    }
  }, [eyeGazeScore, isCameraOn, mediaStream]);

  // Disqualification and Cheating Enforcement
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const hasDisqualifiedRef = useRef(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleDisqualifyAndAutoSubmit = useCallback(async (reason: string) => {
    if (hasDisqualifiedRef.current || !id) return;
    hasDisqualifiedRef.current = true;
    setIsDisqualified(true);
    setDisqualificationReason(reason);
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
    }
    window.speechSynthesis.cancel();

    try {
      await apiClient.post(`/interview/session/${id}/complete`, {
        isDisqualified: true,
        cheatingDetected: true,
        disqualificationReason: reason,
        confidenceMetrics: {
          score: 0,
          signals: { avgWpm: 0, avgPauseCount: 0, avgAnswerLength: 0 }
        },
        proctoring: {
          eyeContactScore: 0,
          presenceScore: 0,
          tabBlurCount: 99,
          flag: 'DISQUALIFIED_CHEATING_DETECTED'
        }
      });
    } catch (err) {
      console.error('Failed to log coding disqualification:', err);
    }
  }, [id, mediaStream]);

  // Browser anti-cheat blocks & desktop switch detection
  useEffect(() => {
    if (!currentProblem || isLoading || hasDisqualifiedRef.current) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Full-screen mode exited or candidate gestured to desktop.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Virtual desktop switch, tab switch, or window minimized during exam.");
      }
    };

    const handleBlur = () => {
      if (!hasDisqualifiedRef.current) {
        handleDisqualifyAndAutoSubmit("Window focus lost: candidate shifted desktops or clicked external application.");
      }
    };

    const blockBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBackNavigation);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, [currentProblem, isLoading, handleDisqualifyAndAutoSubmit]);

  // Algorithmic approach analyzer (Brute Force vs Optimal vs Binary Search)
  const analyzeApproach = (code: string) => {
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // Check for nested loops or quadratic iterations (Brute Force)
    const hasNestedLoops = /(for|while)\s*\(.*?\)\s*\{[^{}]*(for|while)\s*\(|(for|while)\s*\(.*?\)[\s\S]*?(for|while)\s*\(|\.forEach\([^)]*?\([^)]*?=>[\s\S]*?\.forEach|for\s*\(.*?\)[\s\S]*?(\.indexOf|\.includes|\.findIndex)/i.test(cleanCode);

    // Check for hash map / dictionary lookup (Optimal)
    const hasHashMap = /(new Map\(|Map<|unordered_map|HashMap|seen\[|dict\[|lookup\[|memo\[|\.has\(|\.set\(|\.get\()/i.test(cleanCode);

    // Check for binary search / two-pointer pattern
    const hasBinarySearchOrTwoPointers = /(binarySearch|left\s*<=?\s*right|low\s*<=?\s*high|mid\s*=|Math\.floor\(\s*\(\s*left|\/\s*2\b|while\s*\(\s*left\s*<\s*right)/i.test(cleanCode);

    return {
      hasNestedLoops,
      hasHashMap,
      hasBinarySearchOrTwoPointers,
    };
  };

  // Compile and execute candidate code against sandbox test cases
  const handleRunCode = async () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    setConsoleColor('text-slate-400 animate-pulse');
    setConsoleOutput('Compiling code and running sandboxed hidden test suite...\n');
    setConsoleTab('testcases');

    try {
      const result = await codingApi.runTestCases(
        id || 'session',
        codeValue,
        codeLanguage,
        selectedProblemId
      );

      setTestResults(result);
      const timestamp = new Date().toLocaleTimeString();

      if (result.interviewerResponse) {
        setInterviewerFeedback(result.interviewerResponse);
        if (result.interviewerResponse.avatarEmotion) {
          setAvatarState(result.interviewerResponse.avatarEmotion as any);
        }
      }

      if (result.success) {
        setConsoleColor('text-emerald-400');
        let logs = `[${timestamp}] COMPILATION & TEST SUITE PASSED\n`;
        logs += `==========================================\n`;
        logs += `Status: SUCCESS (${result.passedCount}/${result.totalCount} hidden test cases passed)\n\n`;
        logs += `All hidden test cases passed. Your code is verified!`;
        setConsoleOutput(logs);
        toast.success(`Passed all ${result.passedCount}/${result.totalCount} hidden test cases!`);

        // Detect candidate approach
        const approach = analyzeApproach(codeValue);
        let feedbackMessage = "";

        if (approach.hasNestedLoops && !approach.hasHashMap) {
          feedbackMessage = "Okay, you have been successfully completed in brute force. Can you complete this in an optimal way?";
        } else if (approach.hasHashMap) {
          feedbackMessage = "Outstanding! You solved this in an optimal way. There is another solution in binary search. Can you do in that thing?";
        } else if (approach.hasBinarySearchOrTwoPointers) {
          feedbackMessage = "Brilliant work! You've demonstrated the binary search approach as well. Excellent algorithmic adaptability!";
        } else {
          feedbackMessage = "Great job! All hidden test cases passed cleanly. How would you defend your time and space complexity?";
        }

        await aiSpeak(feedbackMessage);
      } else {
        setConsoleColor('text-orange-400');
        let logs = `[${timestamp}] TEST SUITE NOTICE\n`;
        logs += `==========================================\n`;
        logs += `Passed: ${result.passedCount}/${result.totalCount} hidden test cases\n\n`;
        logs += `${result.errorDetails || 'Incorrect return value for edge cases.'}`;
        setConsoleOutput(logs);
        toast.error(`Passed ${result.passedCount}/${result.totalCount} hidden test cases. Check edge conditions.`);

        const feedbackMessage = result.errorDetails && result.errorDetails.includes('Compilation')
          ? "Don't worry, syntax hiccups happen under interview pressure. Review the error in compiler output and let's run it again."
          : `You passed ${result.passedCount} of ${result.totalCount} hidden test cases. Think about boundary conditions, empty values, or duplicates, and test again.`;
        await aiSpeak(feedbackMessage);
      }
    } catch (err: any) {
      setConsoleColor('text-rose-400');
      const errMsg = err.response?.data?.error || err.message || 'Execution error';
      setConsoleOutput(`[COMPILER ERROR] Execution halted: ${errMsg}`);
      toast.error('Code execution failed. Check syntax.');
      await aiSpeak("Don't worry, syntax hiccups happen under interview pressure. Review the error in compiler output and let's run it again.");
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleRequestHint = async () => {
    if (isProcessing) return;
    const nextCount = Math.min(3, hintCount + 1);
    setLocalHintCount(nextCount);
    toast.success(`Requested Level ${nextCount} hint`);
    await aiSpeak(`Here is a Level ${nextCount} progressive hint for your problem: Consider tracking previously seen elements using an auxiliary Hash Map structure for constant-time lookup.`);
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

  // AI Voice speech synthesizer (also updates live on-screen captions)
  const aiSpeak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      addTranscriptEntry('ai', text);
      setActiveCaption({ speaker: 'ava', text });
      setAvatarState('speaking');
      setSpokenWord('');
      setActiveViseme('viseme_sil');

      speakWithLipSync(text, {
        onStart: () => setAiIsSpeaking(true),
        onEnd: () => {
          setAiIsSpeaking(false);
          setMouthOpenness(0.08);
          setSpokenWord('');
          setActiveViseme('viseme_sil');
          setAvatarState('listening');
          resolve();
        },
        onViseme: (openness, fragment, _shape, visemeId) => {
          setMouthOpenness(openness);
          if (fragment && fragment.trim()) setSpokenWord(fragment.trim());
          if (visemeId) {
            setActiveViseme(mapVisemeIdToOculus(visemeId));
          }
        }
      });
    });
  }, [addTranscriptEntry]);

  // Switch to next problem seamlessly without revealing total question count
  const handleSkipQuestion = async () => {
    const nextIndex = currentProblemIndex + 1;
    const targetList = problems.length > 0 ? problems : FALLBACK_PROBLEMS;
    const nextProb = targetList[nextIndex % targetList.length];

    // Save current problem code
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    setCurrentProblemIndex(nextIndex);
    setSelectedProblemId(nextProb.id);
    setCurrentProblem(nextProb);

    // Restore saved code if available, else starter code
    const restoredCode = savedCodes[nextProb.id]?.[codeLanguage] || nextProb.starterCode?.[codeLanguage] || LANGUAGE_BOILERPLATES[codeLanguage] || '';
    setCodeValue(restoredCode);
    setTestResults(null);
    setInterviewerFeedback(null);
    toast.success('Loaded next question');

    const message = "Okay, let us go to our next question. Take a breath, review the new problem statement on the left, and let me know your thoughts.";
    await aiSpeak(message);
    startListening();
  };

  // Return to first problem and restore its code
  const handleReturnToFirstQuestion = async () => {
    const targetList = problems.length > 0 ? problems : FALLBACK_PROBLEMS;
    const firstProb = targetList[0];

    // Save current question code
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    setCurrentProblemIndex(0);
    setSelectedProblemId(firstProb.id);
    setCurrentProblem(firstProb);

    const restoredCode = savedCodes[firstProb.id]?.[codeLanguage] || firstProb.starterCode?.[codeLanguage] || LANGUAGE_BOILERPLATES[codeLanguage] || '';
    setCodeValue(restoredCode);
    setTestResults(null);
    setInterviewerFeedback(null);
    toast.success('Returned to first question');

    const message = "Okay, let's go back to your first solution again! Here is your first question and the code you were working on.";
    await aiSpeak(message);
    startListening();
  };

  // Interactive Conversational Handler (Intent detection)
  const handleConversationalInput = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text || isProcessing) return;

    addTranscriptEntry('user', text);
    setActiveCaption({ speaker: 'user', text });
    setClarificationInput('');
    setAnswerText('');
    finalTranscriptRef.current = '';

    const lower = text.toLowerCase();

    // 1. Skip / don't know intent
    if (
      lower.includes("don't know") ||
      lower.includes("dont know") ||
      lower.includes("skip this question") ||
      lower.includes("skip question") ||
      lower.includes("next question") ||
      lower.includes("next problem") ||
      lower.includes("cannot solve") ||
      lower.includes("can't solve")
    ) {
      await handleSkipQuestion();
      return;
    }

    // 2. Return to first question intent
    if (
      lower.includes("first question") ||
      lower.includes("first solution") ||
      lower.includes("remember my first") ||
      lower.includes("remember the first") ||
      lower.includes("back to the first") ||
      lower.includes("back to question 1") ||
      lower.includes("go back to my first")
    ) {
      await handleReturnToFirstQuestion();
      return;
    }

    // 3. General Socratic Dialogue
    setIsProcessing(true);
    setAvatarState('thinking');
    setProcessingLabel('Ava is analyzing your approach...');

    try {
      const dialogueRes = await codingApi.sendDialogue(id || '', selectedProblemId, text, codeValue);
      setIsProcessing(false);
      setProcessingLabel('');
      setAvatarState(dialogueRes.emotion || 'speaking');
      await aiSpeak(dialogueRes.reply);
      startListening();
    } catch {
      setIsProcessing(false);
      setProcessingLabel('');
      await aiSpeak("I understand your question. Review the constraints on the left, and explain your intuition step by step.");
      startListening();
    }
  };

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

        const gaze = proctorDataRef.current.gazeScores;
        const eyeContactScore = gaze.length
          ? Math.round(gaze.reduce((a, b) => a + b, 0) / gaze.length)
          : 85;
        const tabBlurCount = proctorDataRef.current.tabBlurCount;
        const presenceScore = Math.max(0, Math.min(100, 100 - tabBlurCount * 15));

        const confidenceMetrics = {
          score: candidateMetrics.speakingConfidence || 85,
          signals: {
            avgWpm: candidateMetrics.speechRateWpm || 125,
            avgPauseCount: candidateMetrics.fidgetIndex || 0,
            avgAnswerLength: candidateMetrics.expressionBreakdown?.focused ?? 50,
          },
        };

        await apiClient.post(`/interview/session/${id}/complete`, {
          confidenceMetrics,
          proctoring: {
            eyeContactScore,
            presenceScore,
            tabBlurCount,
          },
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

  const handleSaveAndExit = useCallback(() => {
    if (currentProblem && id) {
      localStorage.setItem(`coding_session_code_${id}_${currentProblem.id}`, codeValue);
    }
    stopListening();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });
    }
    navigate('/interview');
  }, [currentProblem, id, codeValue, stopListening, mediaStream, navigate]);

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
          const lowerChunk = chunk.toLowerCase().trim();
          if (
            lowerChunk.includes("don't know this question") ||
            lowerChunk.includes("skip question") ||
            lowerChunk.includes("next question")
          ) {
            handleSkipQuestion();
            return;
          }
          if (
            lowerChunk.includes("remember my first question") ||
            lowerChunk.includes("first solution again") ||
            lowerChunk.includes("back to my first")
          ) {
            handleReturnToFirstQuestion();
            return;
          }
        } else {
          interimText += chunk;
        }
      }
      const combined = `${finalTranscriptRef.current}${interimText}`.replace(/\s+/g, ' ').trim();
      setAnswerText(combined);
      latestAnswerRef.current = combined;
      if (combined) {
        setActiveCaption({ speaker: 'user', text: combined });
      }
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
    };
  }, []);

  // Fetch Session data on mount
  useEffect(() => {
    async function loadSession() {
      try {
        setLoadingMessage('Configuring secure IDE container & loading problem catalog...');

        // 1. Load Problem Catalog
        let problemList: any[] = [];
        try {
          problemList = await codingApi.getProblems();
          if (Array.isArray(problemList) && problemList.length > 0) {
            setProblems(problemList);
          } else {
            setProblems(FALLBACK_PROBLEMS);
            problemList = FALLBACK_PROBLEMS;
          }
        } catch (catErr) {
          console.warn('Failed to load catalog:', catErr);
          setProblems(FALLBACK_PROBLEMS);
          problemList = FALLBACK_PROBLEMS;
        }

        // 2. Load Session details
        let sessionData: any = null;
        try {
          sessionData = await codingApi.getSession(id || '');
        } catch {
          try {
            const fallbackRes = await apiClient.get(`/interview/session/${id}`);
            sessionData = fallbackRes.data;
          } catch {}
        }

        setSession(sessionData);

        // 3. Resolve active problem
        const targetProbId = sessionData?.problemId || (problemList.length > 0 ? problemList[0].id : 'two-sum');
        setSelectedProblemId(targetProbId);

        const initialIndex = problemList.findIndex((p: any) => p.id === targetProbId);
        setCurrentProblemIndex(initialIndex >= 0 ? initialIndex : 0);

        let activeProb = problemList.find((p: any) => p.id === targetProbId) || problemList[0];
        if (!activeProb) {
          try {
            activeProb = await codingApi.getProblemById(targetProbId);
          } catch {}
        }
        if (!activeProb) {
          activeProb = FALLBACK_PROBLEMS[0];
        }

        setCurrentProblem(activeProb);
        if (activeProb.starterCode?.[codeLanguage]) {
          setCodeValue(activeProb.starterCode[codeLanguage]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to bootstrap coding session:', err);
        setLoadError('Failed to initialize coding playground session.');
        setIsLoading(false);
      }
    }

    loadSession();
  }, [id, codeLanguage]);

  // Language switch handler with code preservation
  const handleLanguageChange = async (newLang: string) => {
    if (currentProblem) {
      setSavedCodes((prev) => ({
        ...prev,
        [currentProblem.id]: {
          ...(prev[currentProblem.id] || {}),
          [codeLanguage]: codeValue,
        },
      }));
    }

    setCodeLanguage(newLang);
    const restored = savedCodes[currentProblem?.id]?.[newLang] || currentProblem?.starterCode?.[newLang] || LANGUAGE_BOILERPLATES[newLang] || LANGUAGE_BOILERPLATES.javascript;
    setCodeValue(restored);
    toast.success(`Switched to ${newLang.toUpperCase()}`);
  };

  // Auto-start coding interview session
  const hasAutoStartedRef = useRef(false);

  const handleJoinCall = useCallback(async () => {
    try {
      const container = document.documentElement;
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch {}

    if (currentProblem) {
      const intro = `Welcome to your technical coding assessment. I am Alex, your interviewer today. I'll be reviewing your algorithmic reasoning, problem-solving approach, and code implementation. Take your time to review "${currentProblem.title}" on the left, speak your thoughts out loud, and run test cases when you are ready. Let's begin!`;
      await aiSpeak(intro);
    }
  }, [currentProblem, aiSpeak]);

  useEffect(() => {
    if (!isLoading && currentProblem && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      handleJoinCall();
    }
  }, [isLoading, currentProblem, handleJoinCall]);

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
              Coding Exam Terminated & Submitted
            </h1>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-body">
              {disqualificationReason || "A virtual desktop switch, tab switch, or full-screen exit was detected during your live coding assessment. Your exam has been automatically terminated and submitted as a cheating violation."}
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
              <span>Violation:</span>
              <span className="font-bold text-rose-400">Recorded in Proctoring Log</span>
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#11183D] text-white font-body">
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#4A8BDF] to-[#2459A8] shadow-2xl animate-pulse">
            <Code2 className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold font-display text-white tracking-tight">SECURE CODING SANDBOX</h2>
            <p className="text-xs text-[#DCE7F2] font-body">{loadingMessage}</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#11183D]/60 backdrop-blur-sm"
          >
            <div className="max-w-md w-full bg-white border border-[#DCE7F2] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="mx-auto h-12 w-12 border-3 border-[#A0006D] border-t-transparent animate-spin rounded-full" />
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[#11183D]">Ava Socratic AI Engine</h3>
                <p className="text-xs text-[#526078] mt-1 font-body">{processingLabel}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="h-14 border-b border-[#DCE7F2] bg-white/95 backdrop-blur px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#4A8BDF] to-[#2459A8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <Code2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#11183D] font-display tracking-tight block">
              R U Ready? Technical Coding Assessment
            </span>
            <span className="text-[10px] text-[#526078] font-mono">
              {session?.targetRole || 'Fullstack Engineer'} • {currentProblem?.difficulty || session?.difficulty || 'MEDIUM'} Track
            </span>
          </div>
        </div>

        {/* Top Header Actions: Media Controls & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 border border-[#DCE7F2]">
            <button
              type="button"
              onClick={() => setIsMicOn((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMicOn ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
            </button>
            <button
              type="button"
              onClick={() => setIsCameraOn((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isCameraOn ? 'text-[#4A8BDF] hover:bg-blue-50' : 'text-rose-600 bg-rose-50'
              }`}
              title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCameraOn ? <Video size={14} /> : <VideoOff size={14} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <InterviewTimer isRunning={true} />
            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-[#DCE7F2] text-xs font-bold font-sans transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio 2-Pane Split */}
      <main className="flex-1 flex overflow-hidden min-h-0 bg-[#EFFAFD]">
        
        {/* LEFT PANE (42vw): Alex Technical Interviewer Avatar + Problem Statement */}
        <section className="w-[42vw] h-full flex flex-col border-r border-[#DCE7F2] bg-white min-w-[380px] overflow-hidden">
          
          {/* Top Section: Technical Interviewer Avatar (Alex in front of laptop) */}
          <div className="p-3.5 bg-slate-950 border-b border-[#DCE7F2] shrink-0 space-y-2.5">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
              <img
                src="/images/interviewer_alex_laptop.jpg"
                alt="Alex - Senior Technical Interviewer"
                className="w-full h-full object-cover object-top"
              />
              
              {/* Subtle Ambient Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Status Badge & Equalizer */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 text-[10px] font-mono text-emerald-400 font-semibold shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{aiIsSpeaking ? 'Alex Speaking' : isProcessing || isRunningCode ? 'Evaluating Code...' : 'Alex • Listening'}</span>
                {aiIsSpeaking && (
                  <span className="flex items-end gap-0.5 h-3 ml-0.5">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-3" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-1.5" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_150ms] h-2.5" />
                  </span>
                )}
              </div>

              {/* Proctoring Status Pill */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/80 text-[10px] font-mono text-slate-300 shadow-sm">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Proctor Active</span>
              </div>

              {/* Candidate Picture-in-Picture Webcam */}
              <div className="absolute bottom-2.5 right-2.5 w-28 h-20 rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950">
                {isCameraOn && mediaStream ? (
                  <video
                    ref={(ref) => {
                      if (ref && mediaStream && ref.srcObject !== mediaStream) {
                        ref.srcObject = mediaStream;
                      }
                    }}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                    <VideoOff size={14} className="mb-0.5 text-slate-600" />
                    <span className="text-[8px] font-mono">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-slate-900/90 backdrop-blur px-1 py-0.5 rounded text-[8px] font-mono text-slate-200">
                  Candidate
                </div>
              </div>

              {/* Interviewer Persona Info */}
              <div className="absolute bottom-2.5 left-2.5 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-display drop-shadow">
                    Alex Mitchell
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#4A8BDF] text-white font-mono uppercase">
                    Tech Lead
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono drop-shadow">
                  Algorithms & Code Evaluator
                </span>
              </div>
            </div>

            {/* Live Synchronized Subtitles */}
            <div className="rounded-xl bg-slate-900/95 border border-slate-800 p-2.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A8BDF] font-mono flex items-center gap-1">
                  <Volume2 size={10} /> Live Audio Transcript
                </span>
                {activeCaption?.speaker === 'user' && (
                  <span className="text-[9px] text-emerald-400 font-mono">Candidate speaking...</span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans line-clamp-2">
                {activeCaption?.text || 'Welcome to your technical assessment. Read through the problem below, explain your initial thoughts, and write your solution.'}
              </p>
            </div>
          </div>

          {/* Main Problem Statement Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between gap-2 border-b border-[#DCE7F2] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
                    Q{currentProblemIndex + 1}
                  </span>
                  <h2 className="text-sm font-bold text-[#11183D] font-display">
                    {currentProblem?.title || 'Problem Statement'}
                  </h2>
                </div>
                <Badge variant={currentProblem?.difficulty === 'EASY' ? 'success' : currentProblem?.difficulty === 'HARD' ? 'error' : 'warning'} size="xs">
                  {currentProblem?.difficulty || 'MEDIUM'}
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-[#EFFAFD]/60 border border-[#DCE7F2] text-xs leading-relaxed text-[#11183D] font-body shadow-xs">
                <div className="whitespace-pre-wrap font-sans text-xs text-[#334155] leading-relaxed">
                  {currentProblem?.description || 'Given an array of integers, return the indices of two numbers that add up to target.'}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* RIGHT PANE (58vw): Monaco Code Studio & Integrated Candidate Video + Test Console */}
        <section className="flex-1 h-full flex flex-col bg-[#EFFAFD] min-w-[500px]">
          
          {/* Top IDE Toolbar */}
          <div className="h-11 shrink-0 bg-white border-b border-[#DCE7F2] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#526078] uppercase font-mono">Language:</span>
              <select
                value={codeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-semibold text-[#11183D] px-2.5 py-1 rounded-lg focus:outline-none focus:border-[#4A8BDF] cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => aiSpeak("Walk me through your high-level approach before coding.")}
                className="px-2.5 py-1.5 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] text-xs font-bold rounded-lg border border-[#DCE7F2] transition-colors"
              >
                Explain Approach
              </button>
              <button
                type="button"
                onClick={() => handleRequestHint()}
                disabled={isProcessing}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
              >
                <Lightbulb size={12} className="text-amber-600" />
                Hint ({hintCount}/3)
              </button>
              <Button
                size="sm"
                variant="royal"
                onClick={() => handleRunCode()}
                disabled={isRunningCode || isProcessing}
                icon={<Play size={12} className="text-white" />}
              >
                {isRunningCode ? 'Running Sandbox...' : 'Run Test Cases'}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => submitSolution()}
                disabled={isRunningCode || isProcessing}
                icon={<CheckCircle2 size={12} className="text-white" />}
              >
                {isProcessing ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </div>
          </div>


          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-0 relative bg-[#1E1E1E]">
            <Editor
              height="100%"
              language={
                codeLanguage === 'cpp' ? 'cpp' :
                codeLanguage === 'go' ? 'go' :
                codeLanguage === 'python' ? 'python' :
                codeLanguage === 'java' ? 'java' :
                codeLanguage === 'typescript' ? 'typescript' :
                'javascript'
              }
              theme="vs-dark"
              value={codeValue}
              onChange={(val) => setCodeValue(val || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                tabSize: 2,
                cursorBlinking: 'smooth',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollBeyondLastLine: false,
                bracketPairColorization: { enabled: true },
                formatOnType: true,
              }}
            />
          </div>

          {/* Hidden Test Cases & Compiler Output Console */}
          <div className={`shrink-0 border-t border-[#DCE7F2] bg-white flex flex-col transition-all duration-300 ${isConsoleOpen ? 'h-64' : 'h-10'}`}>
            
            {/* Console Header Bar */}
            <div className="h-10 border-b border-[#DCE7F2] bg-[#EFFAFD] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('testcases');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'testcases' ? 'bg-white text-[#4A8BDF] border border-[#DCE7F2] shadow-xs' : 'text-[#526078] hover:text-[#11183D]'
                  }`}
                >
                  Hidden Test Cases {testResults ? `(${testResults.passedCount}/${testResults.totalCount || 5})` : ''}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab('terminal');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    consoleTab === 'terminal' ? 'bg-white text-[#4A8BDF] border border-[#DCE7F2] shadow-xs' : 'text-[#526078] hover:text-[#11183D]'
                  }`}
                >
                  Compiler Output
                </button>
              </div>

              {/* Collapse / Expand Control */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setIsConsoleOpen((prev) => !prev)}
                  className="text-xs text-[#526078] hover:text-[#11183D] transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isConsoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span>{isConsoleOpen ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
            </div>

            {/* Console Body: Sandboxed Test Matrix or Terminal */}
            {isConsoleOpen && (
              <div className="flex-1 flex overflow-hidden bg-[#11183D]">
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-100">
                  {consoleTab === 'testcases' ? (
                    <div className="space-y-3">
                      {testResults ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">Execution Result:</span>
                              <span className="text-slate-400 text-[11px]">({codeLanguage} sandbox runtime)</span>
                            </div>
                            <Badge variant={testResults.success ? "success" : "error"} size="xs">
                              {testResults.success ? 'All Hidden Cases Passed ✓' : `${testResults.passedCount}/${testResults.totalCount} Passed`}
                            </Badge>
                          </div>

                          {/* Hidden Test Cases Matrix (Inputs/Outputs Strictly Hidden) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {(testResults.testResults || [1, 2, 3, 4, 5]).map((tc: any, i: number) => {
                              const isPassed = typeof tc === 'object' ? tc.passed : false;
                              const time = typeof tc === 'object' && tc.executionTimeMs ? `${tc.executionTimeMs}ms` : '12ms';
                              return (
                                <div
                                  key={i}
                                  className={`p-3 rounded-xl border text-xs flex items-center justify-between font-mono transition-all ${
                                    isPassed
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                      : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${isPassed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                    <span>Hidden Test Case #{i + 1}</span>
                                  </span>
                                  <span className="text-[10px] font-bold">
                                    {isPassed ? `Passed (${time}) ✓` : `Failed (${time}) ✗`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {testResults.errorDetails && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                              {testResults.errorDetails}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield size={14} className="text-[#4A8BDF]" />
                              <span className="font-bold text-white text-xs">Hidden Test Suite (Sandboxed Matrix)</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">5 Hidden Cases Locked</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5].map((caseNum) => (
                              <div key={caseNum} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
                                <span className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                                  <span>Hidden Test Case #{caseNum}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                                  Locked
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-[#4A8BDF]/10 border border-[#4A8BDF]/20 text-xs text-[#DCE7F2] font-sans">
                            All test cases are strictly hidden to evaluate true algorithmic correctness. Click <strong className="text-white font-mono">[Run Test Cases]</strong> to execute your code against this sandbox.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <pre className={`whitespace-pre-wrap leading-relaxed select-text ${consoleColor}`}>
                      {consoleOutput}
                    </pre>
                  )}
                </div>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Exit & Session Preservation Modal */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onEndAndSubmit={submitSolution}
        interviewType="CODING"
      />
    </div>
  );
}
