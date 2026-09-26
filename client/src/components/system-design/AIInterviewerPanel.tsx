import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  ChevronRight,
  Award,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';

const STAGE_STEPS = [
  { stage: 1, title: 'Scope' },
  { stage: 2, title: 'Scale' },
  { stage: 3, title: 'HLD' },
  { stage: 4, title: 'Deep Dive' },
  { stage: 5, title: 'Resilience' },
  { stage: 6, title: 'Trade-offs' },
];

export default function AIInterviewerPanel() {
  const {
    session,
    chatMessages,
    isAiThinking,
    isSpeechEnabled,
    toggleSpeech,
    currentStage,
    sendMessageToAI,
    finishInterview,
  } = useSystemDesignStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiThinking]);

  // Setup Web Speech API for voice recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSend = () => {
    if (!inputMessage.trim() || isAiThinking) return;
    sendMessageToAI(inputMessage);
    setInputMessage('');
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (isAiThinking) return;
    sendMessageToAI(suggestionText);
  };

  const lastAiMessage = [...chatMessages].reverse().find((m) => m.role === 'ai');
  const suggestions = lastAiMessage?.suggestions || [];

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* Stage Roadmap Progress Header */}
      <div className="p-3 border-b border-[#DCE7F2] bg-slate-50/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#4A8BDF] text-white flex items-center justify-center">
              <Bot size={14} />
            </div>
            <span className="text-xs font-bold text-slate-800 font-sans">
              AI Staff Interviewer
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSpeech}
              className={clsx(
                'p-1.5 rounded-lg border transition-colors',
                isSpeechEnabled
                  ? 'bg-blue-50 border-blue-200 text-[#4A8BDF]'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              )}
              title={isSpeechEnabled ? 'Mute AI voice' : 'Enable AI voice output'}
            >
              {isSpeechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
            <button
              type="button"
              onClick={() => finishInterview(session?.durationSeconds || 900)}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold font-sans shadow-xs transition-all"
            >
              <Award size={13} />
              <span>Finish & Grade</span>
            </button>
          </div>
        </div>

        {/* 6 Stage Timeline */}
        <div className="grid grid-cols-6 gap-1 pt-1">
          {STAGE_STEPS.map((step) => {
            const isDone = currentStage > step.stage;
            const isCurrent = currentStage === step.stage;

            return (
              <div
                key={step.stage}
                className={clsx(
                  'text-center py-1 px-0.5 rounded-lg text-[10px] font-mono transition-all',
                  isCurrent
                    ? 'bg-[#EFFAFD] text-[#4A8BDF] font-bold border border-blue-200 shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'bg-slate-100 text-slate-400'
                )}
              >
                <div className="truncate">{step.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transcript Chat Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {chatMessages.map((msg) => {
          const isAi = msg.role === 'ai';

          return (
            <div
              key={msg.id}
              className={clsx('flex items-start gap-2.5 text-xs', isAi ? 'justify-start' : 'justify-end')}
            >
              {isAi && (
                <div className="h-6 w-6 rounded-lg bg-[#EFFAFD] text-[#4A8BDF] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} />
                </div>
              )}

              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl p-3 shadow-2xs space-y-1',
                  isAi
                    ? 'bg-white border border-[#DCE7F2] text-slate-800'
                    : 'bg-[#4A8BDF] text-white font-medium'
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
                <div
                  className={clsx(
                    'text-[9px] font-mono',
                    isAi ? 'text-slate-400' : 'text-blue-100'
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {!isAi && (
                <div className="h-6 w-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User size={13} />
                </div>
              )}
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 w-fit">
            <Loader2 size={13} className="animate-spin text-[#4A8BDF]" />
            <span className="font-mono">AI Interviewer is analyzing your architecture...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Socratic Suggestion Chips */}
      {suggestions.length > 0 && !isAiThinking && (
        <div className="px-3 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto select-none">
          <Sparkles size={13} className="text-[#4A8BDF] shrink-0" />
          <div className="flex gap-1.5">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(sug)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-[#EFFAFD] border border-slate-200 hover:border-[#4A8BDF] text-[11px] font-medium text-slate-700 hover:text-[#4A8BDF] rounded-xl transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <div className="p-3 border-t border-[#DCE7F2] bg-white">
        <div className="flex items-center gap-2">
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleRecording}
              className={clsx(
                'p-2 rounded-xl border transition-colors',
                isRecording
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-50 border-[#DCE7F2] text-slate-500 hover:text-slate-800'
              )}
              title={isRecording ? 'Stop voice input' : 'Speak answer (Speech-to-Text)'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          <input
            type="text"
            placeholder={`Ask a question or explain your Stage ${currentStage} design...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isAiThinking}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-[#DCE7F2] rounded-xl focus:outline-none focus:bg-white focus:border-[#4A8BDF] transition-all"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputMessage.trim() || isAiThinking}
            className="p-2 bg-[#4A8BDF] hover:bg-blue-600 disabled:bg-slate-200 text-white rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
