// ═══════════════════════════════════════════════════════════════
// Rennetus — Admin AI 3D Models & Voice Studio
// Clean, Focused Studio: 3D Model & Voice Selection with Live Speech
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  User,
  Radio,
  Play,
} from 'lucide-react';
import AvatarEngine3D, { FacialExpression, AvatarState } from '@/components/interview/AvatarEngine3D';
import { OculusViseme, mapVisemeIdToOculus } from '@/components/interview/visemeMapper';
import { speakWithLipSync, stopAllSpeech } from '@/lib/speech';
import {
  PLATFORM_AVATAR_MODELS,
  PLATFORM_VOICES,
  AvatarModelId,
  PlatformVoiceId,
  getPlatformModel,
  getPlatformVoice,
  setPlatformConfig
} from '@/lib/platformConfig';
import toast from 'react-hot-toast';

export default function AdminModels() {
  // Global persisted platform settings
  const [globalModel, setGlobalModel] = useState<AvatarModelId>(getPlatformModel());
  const [globalVoice, setGlobalVoice] = useState<PlatformVoiceId>(getPlatformVoice());

  // Active audition selections
  const [selectedModel, setSelectedModel] = useState<AvatarModelId>(getPlatformModel());
  const [selectedVoice, setSelectedVoice] = useState<PlatformVoiceId>(getPlatformVoice());

  // Dynamic autonomous state
  const [situationalState, setSituationalState] = useState<AvatarState>('IDLE');
  const [expression] = useState<FacialExpression>('NEUTRAL');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeViseme, setActiveViseme] = useState<OculusViseme>('viseme_sil');
  const [spokenWord, setSpokenWord] = useState<string>('');

  // Script text for audition
  const [customText, setCustomText] = useState<string>(
    'Welcome to RU Ready! I am your AI interviewer today. Take a moment to adjust your camera and microphone before we begin our technical assessment.'
  );

  useEffect(() => {
    setGlobalModel(getPlatformModel());
    setGlobalVoice(getPlatformVoice());
    setSelectedModel(getPlatformModel());
    setSelectedVoice(getPlatformVoice());
  }, []);

  const handleSpeak = useCallback(() => {
    if (!customText.trim()) return;

    stopAllSpeech();
    setIsSpeaking(true);
    setSituationalState('SPEAKING');
    setSpokenWord('');

    speakWithLipSync(
      customText,
      {
        onStart: () => {
          setIsSpeaking(true);
          setSituationalState('SPEAKING');
        },
        onEnd: () => {
          setIsSpeaking(false);
          setSituationalState('IDLE');
          setActiveViseme('viseme_sil');
          setSpokenWord('');
        },
        onViseme: (_openness, fragment, _shape, visemeId) => {
          if (visemeId) {
            setActiveViseme(mapVisemeIdToOculus(visemeId));
          }
          if (fragment && fragment.trim()) {
            setSpokenWord(fragment.trim());
          }
        },
      },
      selectedVoice
    );
  }, [customText, selectedVoice]);

  const handleStop = useCallback(() => {
    stopAllSpeech();
    setIsSpeaking(false);
    setSituationalState('IDLE');
    setActiveViseme('viseme_sil');
    setSpokenWord('');
  }, []);

  const handleSaveStandard = () => {
    setPlatformConfig(selectedModel, selectedVoice);
    setGlobalModel(selectedModel);
    setGlobalVoice(selectedVoice);

    const modelName = PLATFORM_AVATAR_MODELS.find((m) => m.id === selectedModel)?.name;
    const voiceName = PLATFORM_VOICES.find((v) => v.id === selectedVoice)?.name;

    toast.success(
      `Saved: ${modelName} with ${voiceName} is now active across all interviews!`,
      { duration: 4000 }
    );
  };

  const isCurrentGlobal = selectedModel === globalModel && selectedVoice === globalVoice;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      {/* ─── Studio Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: 3D Avatar Viewport */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="w-full aspect-[4/3] min-h-[420px] rounded-3xl overflow-hidden border border-[#DCE7F2] bg-[#0A101D] shadow-lg relative flex-1">
            <AvatarEngine3D
              persona={selectedModel}
              state={situationalState}
              expression={expression}
              activeVisemeShape={activeViseme}
              subtitleText={spokenWord}
              className="w-full h-full"
            />

            {/* Speaking Live Indicator */}
            {isSpeaking && (
              <div className="absolute top-4 right-4 z-10">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 animate-pulse shadow-lg">
                  <Volume2 size={13} />
                  <span>Speaking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Clean Studio Controls */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* 1. 3D Avatar Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#11183D] flex items-center gap-1.5">
                <User size={14} className="text-[#2459A8]" />
                <span>3D Avatar Model:</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AvatarModelId)}
                className="w-full p-3 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-xs font-bold text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none cursor-pointer"
              >
                {PLATFORM_AVATAR_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. English Voice Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#11183D] flex items-center gap-1.5">
                <Radio size={14} className="text-[#2459A8]" />
                <span>Audition Voice:</span>
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as PlatformVoiceId)}
                className="w-full p-3 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-xs font-bold text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none cursor-pointer"
              >
                <optgroup label="─── 👩 Female English Voices ───">
                  {PLATFORM_VOICES.filter((v) => v.gender === 'Female').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="─── 👨 Male English Voices ───">
                  {PLATFORM_VOICES.filter((v) => v.gender === 'Male').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 3. Audition Script Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#11183D] flex items-center justify-between">
                <span>Audition Text:</span>
                <span className="text-[11px] font-normal text-[#526078]">{customText.length} chars</span>
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter any text for the 3D model to speak..."
                className="w-full p-3.5 border border-[#DCE7F2] bg-white rounded-2xl text-xs text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] focus:border-[#4A8BDF] outline-none resize-none shadow-2xs leading-relaxed"
              />
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSpeak}
                disabled={!customText.trim() || isSpeaking}
                className="flex-1 bg-[#2459A8] hover:bg-[#1E4A8C] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play size={14} />
                <span>Speak Voice</span>
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="bg-[#E11D48] hover:bg-rose-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <VolumeX size={14} />
                  <span>Stop</span>
                </button>
              )}
            </div>

            {/* Save Platform Standard Button */}
            <button
              type="button"
              onClick={handleSaveStandard}
              disabled={isCurrentGlobal}
              className={`w-full py-3 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCurrentGlobal
                  ? 'bg-slate-100 text-[#526078] cursor-not-allowed border border-[#DCE7F2]'
                  : 'bg-[#168A62] hover:bg-[#11694a] text-white shadow-[#168A62]/20'
              }`}
            >
              <ShieldCheck size={15} />
              <span>{isCurrentGlobal ? 'Active Platform Standard' : 'Save as Platform Standard'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
