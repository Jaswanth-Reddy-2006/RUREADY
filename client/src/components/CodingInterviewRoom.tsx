import React, { useEffect, useRef, useState } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { Terminal, Play, Check, AlertTriangle, Shield, Volume2 } from 'lucide-react';

interface CodingInterviewRoomProps {
  mediaStream: MediaStream | null;
  aiIsSpeaking: boolean;
  avatarState: AvatarState;
  mouthOpenness: number;
  spokenWord: string;
  currentQuestionText: string;
  candidateTranscription: string;
  onSubmitAnswer: (answer: string) => void;
  onEndInterview: () => void;
  isProcessing: boolean;
  processingLabel: string;
  codeLanguage: string;
  codeValue: string;
  onChangeCode: (code: string) => void;
  onChangeLanguage: (lang: string) => void;
  consoleOutput: string;
  onRunCode: () => void;
  isRunningCode: boolean;
  onClearConsole: () => void;
}

export default function CodingInterviewRoom({
  mediaStream,
  aiIsSpeaking,
  avatarState,
  mouthOpenness,
  spokenWord,
  currentQuestionText,
  candidateTranscription,
  onSubmitAnswer,
  onEndInterview,
  isProcessing,
  processingLabel,
  codeLanguage,
  codeValue,
  onChangeCode,
  onChangeLanguage,
  consoleOutput,
  onRunCode,
  isRunningCode,
  onClearConsole,
}: CodingInterviewRoomProps) {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const [showConsole, setShowConsole] = useState(true);

  // Bind local camera stream
  useEffect(() => {
    if (userVideoRef.current && mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        userVideoRef.current.srcObject = new MediaStream(videoTracks);
      }
    }
  }, [mediaStream]);

  // Tab key keydown interceptor for indents inside code editor textarea
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      onChangeCode(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lineCount = Math.max(1, codeValue.split('\n').length);

  return (
    <div className="flex h-[calc(100vh-60px)] w-full bg-black text-white font-mono rounded-none select-none overflow-hidden border border-zinc-850">
      
      {/* LEFT SIDE (60%): High Performance Code Playground & Terminal */}
      <div className="w-3/5 h-full bg-[#08080a] border-r border-zinc-850 flex flex-col justify-between rounded-none relative min-w-0">
        
        {/* Editor Top Bar Header */}
        <div className="px-6 py-3 border-b border-zinc-850 flex items-center justify-between bg-[#0c0c0e] shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-none bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-550">
              [IDE_PLAYGROUND]
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Dropdown Selector */}
            <div className="relative">
              <select
                value={codeLanguage}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="bg-black border border-zinc-850 px-3 py-1 text-xs text-white uppercase tracking-wider rounded-none font-mono focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            {/* Run Code trigger */}
            <button
              type="button"
              disabled={isRunningCode}
              onClick={onRunCode}
              className={`flex items-center gap-1.5 px-4 py-1 text-xs font-bold uppercase tracking-wider border rounded-none ${
                isRunningCode
                  ? 'border-zinc-800 text-zinc-650 cursor-not-allowed'
                  : 'border-white bg-transparent text-white hover:bg-white hover:text-black transition-all active:scale-[0.98]'
              }`}
            >
              <Play size={10} fill={isRunningCode ? "none" : "currentColor"} />
              <span>{isRunningCode ? 'EXEC_...' : '[RUN_CODE]'}</span>
            </button>
          </div>
        </div>

        {/* Core Editor Textarea Workspace */}
        <div className="flex-1 flex overflow-y-auto relative min-h-0 py-4 bg-black/40">
          {/* Stark Brutalist Line Numbers */}
          <div className="w-12 select-none text-right pr-3 border-r border-zinc-850 text-zinc-650 font-mono text-[11px] leading-6 shrink-0 pt-0.5 select-none">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Editor Input TextArea */}
          <textarea
            value={codeValue}
            onChange={(e) => onChangeCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            placeholder="// Paste or write your DSA program logic here..."
            spellCheck={false}
            className="flex-1 bg-transparent text-white focus:outline-none resize-none px-4 font-mono text-[12px] leading-6 min-h-full placeholder-zinc-800 rounded-none overflow-x-auto"
            style={{ outline: 'none' }}
          />
        </div>

        {/* TOGGLABLE SIMULATED CONSOLE BOX */}
        {showConsole && (
          <div className="h-[180px] border-t border-zinc-850 flex flex-col bg-[#050507] shrink-0 min-h-0">
            {/* Console Header tab */}
            <div className="px-5 py-2 border-b border-zinc-850 flex items-center justify-between bg-[#09090b] shrink-0">
              <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal size={10} className="text-zinc-550" />
                SIMULATED_TERMINAL_OUTPUT
              </span>
              <div className="flex items-center gap-3">
                {consoleOutput && (
                  <button
                    onClick={onClearConsole}
                    className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    [CLEAR_LOGS]
                  </button>
                )}
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  [HIDE]
                </button>
              </div>
            </div>

            {/* Console Outputs */}
            <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto bg-black text-emerald-500/90 select-none">
              {consoleOutput ? (
                <div className="whitespace-pre-wrap">{consoleOutput}</div>
              ) : (
                <div className="text-zinc-700 italic lowercase tracking-wider select-none">
                  // debugger output panel ready. write your program and run tests.
                </div>
              )}
            </div>
          </div>
        )}

        {!showConsole && (
          <div className="px-5 py-2 border-t border-zinc-850 bg-[#09090b] shrink-0 flex justify-end">
            <button
              onClick={() => setShowConsole(true)}
              className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-mono"
            >
              [SHOW_TERMINAL]
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE (40%): Splitted Media Interfaces and Active Prompts */}
      <div className="w-2/5 h-full bg-[#09090b] flex flex-col min-w-0 rounded-none relative">
        
        {/* Top Sub-Box: AI Stream element & Question block */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-850">
          {/* Right Header Status Label */}
          <div className="px-6 py-3 border-b border-zinc-850 flex items-center justify-between bg-[#0c0c0e] shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-550">
              [AVA_STREAM] :: AI_INTERVIEWER
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-none ${avatarState === 'speaking' ? 'bg-[#ff3b30] animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">{avatarState}</span>
            </div>
          </div>

          {/* AI Avatar Preview */}
          <div className="flex-1 flex items-center justify-center p-6 bg-black min-h-0 relative">
            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center bg-[#09090b] border border-zinc-850 p-4 rounded-none relative">
              <AIAvatar
                state={avatarState}
                isSpeaking={aiIsSpeaking}
                mouthOpenness={mouthOpenness}
                currentWord={spokenWord}
                className="w-full h-full object-contain filter grayscale invert"
              />
            </div>
          </div>

          {/* Active Question Box */}
          <div className="bg-[#0c0c0e] border-t border-zinc-850 p-5 space-y-2 shrink-0">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-zinc-850 px-2 py-0.5 w-fit block">
              [CURRENT_DSA_PROMPT]
            </span>
            <div className="max-h-[140px] overflow-y-auto text-xs sm:text-[11px] leading-relaxed text-zinc-300 font-medium uppercase tracking-tight" style={{ scrollbarWidth: 'thin' }}>
              {currentQuestionText || 'AVA is parsing session algorithms...'}
            </div>
          </div>
        </div>

        {/* Bottom Sub-Box: User mirror camera feed */}
        <div className="h-[210px] bg-black border-t border-zinc-850 p-5 flex flex-col justify-between shrink-0 rounded-none relative">
          
          <div className="flex justify-between items-center text-[10px] text-zinc-550 uppercase font-bold tracking-widest mb-2 shrink-0">
            <span>[MONITOR_STREAM] // SECURITY_MIRROR</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-[#ff3b30] rounded-none animate-pulse" />
              <span className="text-[9px] text-[#ff3b30]">LIVE</span>
            </div>
          </div>

          {/* User Small Webcam Preview */}
          <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden relative">
            <div className="h-full aspect-[4/3] bg-[#09090b] border border-zinc-850 relative overflow-hidden rounded-none">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 filter grayscale"
              />
            </div>
          </div>

          {/* Bottom security assurance and action buttons */}
          <div className="border-t border-zinc-850 pt-3 mt-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              <Shield size={10} className="text-emerald-500" />
              <span>SECURED</span>
            </div>
            
            {/* Primary Action Button: Submit Solution */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                onSubmitAnswer(candidateTranscription || "// solution submitted in playground");
              }}
              className="bg-white text-black border border-white hover:bg-black hover:text-white px-5 py-1.5 text-[10px] tracking-widest uppercase font-black transition-all active:scale-[0.98] rounded-none shadow-md"
            >
              [SUBMIT_SOLUTION]
            </button>
          </div>
        </div>

        {/* Local speech indicator / transcription bubble overlay */}
        {candidateTranscription && (
          <div className="absolute top-16 left-4 right-4 bg-black/90 border border-zinc-800 p-3.5 text-xs text-zinc-400 font-mono tracking-tight select-none uppercase z-20">
            <span className="text-[8px] font-bold text-zinc-650 uppercase tracking-widest block mb-1">
              [CAPTURED_SPEECH]
            </span>
            {candidateTranscription}
          </div>
        )}

        {/* Core Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-30 select-none">
            <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-none mb-4" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase mb-1">
              [UPLOADING_COMPILATION_VECTORS]
            </span>
            <p className="text-[9px] text-zinc-600 max-w-[220px] leading-relaxed uppercase">
              {processingLabel || 'Validating solution syntax and algorithmic bounds...'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
