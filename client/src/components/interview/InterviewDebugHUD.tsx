import React, { useState } from 'react';
import { Terminal, Activity, CheckCircle, XCircle, ChevronDown, ChevronUp, Cpu, Sliders } from 'lucide-react';
import { EngineState, StructuredEvaluation } from '@ru-ready/shared';

interface DebugHUDProps {
  engineState: EngineState;
  currentQuestion?: {
    orderIndex: number;
    questionText: string;
    questionType: string;
    difficulty: string;
    requiredConcepts?: string[];
    optionalConcepts?: string[];
  };
  lastEvaluation?: StructuredEvaluation | null;
  onSimulateIntent?: (intent: string) => void;
}

export const InterviewDebugHUD: React.FC<DebugHUDProps> = ({
  engineState,
  currentQuestion,
  lastEvaluation,
  onSimulateIntent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'JSON' | 'SIMULATOR'>('OVERVIEW');

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {/* HUD Toggle Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-emerald-400 hover:text-emerald-300 rounded-lg shadow-xl border border-slate-700/80 transition-all hover:scale-105"
      >
        <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="font-semibold tracking-wide">ENGINE HUD</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800/50">
          {engineState}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {/* Expanded HUD Panel */}
      {isOpen && (
        <div className="mt-2 w-[420px] max-h-[520px] bg-slate-950/95 text-slate-200 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* HUD Header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-100 tracking-wider">INTERVIEW CONTROLLER HUD</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 rounded p-0.5">
              {(['OVERVIEW', 'JSON', 'SIMULATOR'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    activeTab === tab ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* HUD Content Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'OVERVIEW' && (
              <>
                {/* Engine Status Card */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Engine FSM State:</span>
                    <span className="font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {engineState}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Active Action:</span>
                    <span className="text-amber-400 font-semibold">
                      {lastEvaluation?.recommendedAction || 'NEXT_QUESTION'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Avatar Emotion / Gesture:</span>
                    <span className="text-emerald-400">
                      {lastEvaluation?.emotion || 'neutral'} / {lastEvaluation?.gesture || 'nod'}
                    </span>
                  </div>
                </div>

                {/* Question & Concept Rubric */}
                {currentQuestion && (
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>Question #{currentQuestion.orderIndex} ({currentQuestion.questionType})</span>
                      <span className="text-slate-400 text-[10px]">{currentQuestion.difficulty}</span>
                    </div>
                    <p className="text-slate-300 text-xs italic line-clamp-2">"{currentQuestion.questionText}"</p>
                    
                    {/* Required Concepts */}
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-1">Target Concepts Rubric:</span>
                      <div className="flex flex-wrap gap-1">
                        {(currentQuestion.requiredConcepts || ['sorted data', 'O(log n)', 'trade-offs']).map((concept) => {
                          const isCovered = lastEvaluation?.coveredConcepts?.includes(concept);
                          return (
                            <span
                              key={concept}
                              className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 border ${
                                isCovered
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : 'bg-slate-900 text-slate-400 border-slate-700'
                              }`}
                            >
                              {isCovered ? <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> : <XCircle className="w-2.5 h-2.5 text-slate-500" />}
                              {concept}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Evaluation Metrics */}
                {lastEvaluation && (
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-center font-semibold text-slate-200">
                      <span>Evaluated Score:</span>
                      <span className={`text-base font-bold ${lastEvaluation.score >= 80 ? 'text-emerald-400' : lastEvaluation.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {lastEvaluation.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>Correctness: {(lastEvaluation.correctness * 100).toFixed(0)}%</div>
                      <div>Coverage: {(lastEvaluation.conceptCoverage * 100).toFixed(0)}%</div>
                      <div>Depth: {(lastEvaluation.depth * 100).toFixed(0)}%</div>
                      <div>Clarity: {(lastEvaluation.clarity * 100).toFixed(0)}%</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 text-[10px]">Spoken Output:</span>
                      <p className="text-cyan-300 italic text-xs mt-0.5">"{lastEvaluation.spokenResponse}"</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'JSON' && (
              <pre className="p-3 bg-slate-900 text-cyan-300 rounded-lg overflow-x-auto text-[10px] leading-relaxed border border-slate-800">
                {JSON.stringify(lastEvaluation || { message: 'No evaluation recorded yet' }, null, 2)}
              </pre>
            )}

            {activeTab === 'SIMULATOR' && (
              <div className="space-y-3">
                <span className="text-slate-400 text-[11px] block">Simulate Candidate Intent:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Repeat Question", intent: "REPEAT_QUESTION" },
                    { label: "Clarify Question", intent: "CLARIFICATION" },
                    { label: "I Don't Know", intent: "DON_T_KNOW" },
                    { label: "I'm Thinking", intent: "THINKING" },
                    { label: "Skip Question", intent: "SKIP_QUESTION" },
                    { label: "Strong Answer", intent: "STRONG_ANSWER" },
                  ].map((btn) => (
                    <button
                      key={btn.intent}
                      onClick={() => onSimulateIntent && onSimulateIntent(btn.intent)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded text-left transition-colors font-sans font-medium"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
