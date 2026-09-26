import React, { useState, useCallback } from 'react';
import AIAvatar, { AvatarState } from '../interview/AIAvatar';
import { AvatarPersona, FacialExpression } from '../interview/AvatarEngine3D';
import { OculusViseme, mapVisemeIdToOculus } from '../interview/visemeMapper';
import { speakWithLipSync, stopAllSpeech, KokoroVoice } from '../../lib/speech';
import { PLATFORM_AVATAR_MODELS, PLATFORM_VOICES } from '../../lib/platformConfig';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Volume2, VolumeX, Sparkles, MessageSquare, User, Smile, Zap } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    label: '👋 Welcome Candidate',
    text: 'Welcome to your RU Ready technical mock interview! I am Ava, your AI interviewer today. Take a moment to adjust your camera and microphone.',
  },
  {
    label: '💡 Ask System Design Question',
    text: 'Let us design a distributed rate limiter for a high-throughput API gateway processing 500,000 requests per second. How would you structure Redis memory and key expiry?',
  },
  {
    label: '⭐ STAR Behavioral Feedback',
    text: 'That is a great explanation of your leadership during the production outage. You clearly outlined the Situation, Task, Action, and Result with quantifiable metrics.',
  },
  {
    label: '⚠️ Probe Edge Case',
    text: 'What happens if a network partition occurs between your primary database node and read replicas? How do you ensure strong consistency versus availability under PACELC?',
  },
];

export default function AdminAvatarPlayground() {
  const [inputText, setInputText] = useState<string>(
    'Hello! Welcome to the RU Ready Admin 3D Avatar & Voice Testing Studio. Type any text below to test speech output, real-time lip sync, and 3D facial expressions.'
  );

  const [persona, setPersona] = useState<AvatarPersona>('AVA');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [expression, setExpression] = useState<FacialExpression>('NEUTRAL');
  const [selectedVoice, setSelectedVoice] = useState<KokoroVoice>('en_us_ava_warm');

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mouthOpenness, setMouthOpenness] = useState<number>(0.05);
  const [activeViseme, setActiveViseme] = useState<OculusViseme>('viseme_sil');
  const [spokenWord, setSpokenWord] = useState<string>('');

  const handleSpeak = useCallback(() => {
    if (!inputText.trim()) return;

    stopAllSpeech();
    setIsSpeaking(true);
    setAvatarState('speaking');
    setSpokenWord('');

    speakWithLipSync(
      inputText,
      {
        onStart: () => {
          setIsSpeaking(true);
          setAvatarState('speaking');
        },
        onEnd: () => {
          setIsSpeaking(false);
          setAvatarState('idle');
          setMouthOpenness(0.05);
          setActiveViseme('viseme_sil');
          setSpokenWord('');
        },
        onViseme: (openness, fragment, _shape, visemeId) => {
          setMouthOpenness(openness);
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
  }, [inputText, selectedVoice]);

  const handleStop = useCallback(() => {
    stopAllSpeech();
    setIsSpeaking(false);
    setAvatarState('idle');
    setMouthOpenness(0.05);
    setActiveViseme('viseme_sil');
    setSpokenWord('');
  }, []);

  return (
    <Card className="p-6 bg-white border-slate-200/90 shadow-sm rounded-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>3D Avatar & Kokoro Voice Testing Studio</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enter any text prompt to test real-time 3D model speech synthesis, visemes, and facial expressions.
          </p>
        </div>

        <Badge className={isSpeaking ? 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse' : 'bg-slate-100 text-slate-700'}>
          {isSpeaking ? '🗣️ Avatar Speaking...' : 'IDLE / Ready'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3D Model Screen Viewport */}
        <div className="lg:col-span-6 space-y-3">
          <div className="w-full aspect-[4/3] min-h-[340px] rounded-3xl overflow-hidden border border-slate-800 bg-[#080d1a] shadow-xl relative">
            <AIAvatar
              state={avatarState}
              expression={expression}
              isSpeaking={isSpeaking}
              mouthOpenness={mouthOpenness}
              activeVisemeShape={activeViseme}
              currentWord={spokenWord}
              persona={persona}
              subtitleText={spokenWord}
              onPersonaChange={setPersona}
              className="w-full h-full"
            />
          </div>

          {spokenWord && (
            <div className="p-3 rounded-2xl bg-slate-900 text-white text-center text-xs font-mono border border-slate-800 shadow-2xs">
              <span className="text-slate-400">Current Viseme Fragment: </span>
              <strong className="text-emerald-400 font-bold">"{spokenWord}"</strong>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Text Entry & Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Text Area Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Enter Text for 3D Model to Speak:</span>
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any sentence here..."
              className="w-full p-3.5 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y font-sans shadow-2xs"
            />
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Preset Test Phrases:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(preset.text)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Persona Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">3D Avatar Character Model:</label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as AvatarPersona)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {PLATFORM_AVATAR_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Model Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Audition English Voice (Female & Male):</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as KokoroVoice)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <optgroup label="─── 👩 Female Voices ───">
                  {PLATFORM_VOICES.filter((v) => v.gender === 'Female').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="─── 👨 Male Voices ───">
                  {PLATFORM_VOICES.filter((v) => v.gender === 'Male').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSpeak}
              disabled={!inputText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-white" />
              <span>Speak Text & Animate 3D Model</span>
            </Button>

            {isSpeaking && (
              <Button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <VolumeX className="w-4 h-4 text-white" />
                <span>Stop</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
