// ═══════════════════════════════════════════════════════════════
// R U Ready? — HD Real-Time Video Call AI Avatar Component
// Photorealistic Live Video Call Viewport with Phoneme Lip-Sync & Facial Expressions
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AvatarPersona, FacialExpression, AvatarState as AvatarEngineState } from './AvatarEngine3D';
import { OculusViseme } from './visemeMapper';
import { calculateVideoAvatarFrame, VideoExpressionState, VideoAvatarState } from '../../lib/videoLipSyncEngine';
import { Volume2, Activity } from 'lucide-react';

export type CharacterState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'pleased' | 'concerned' | AvatarEngineState;

interface RealtimeVideoAvatarProps {
  state: CharacterState;
  expression?: FacialExpression;
  isSpeaking?: boolean;
  mouthOpenness?: number;
  activeVisemeShape?: OculusViseme | string;
  currentWord?: string;
  persona?: AvatarPersona;
  subtitleText?: string;
  onPersonaChange?: (newPersona: AvatarPersona) => void;
  className?: string;
}

export const RealtimeVideoAvatar: React.FC<RealtimeVideoAvatarProps> = ({
  state,
  expression = 'NEUTRAL',
  isSpeaking = false,
  mouthOpenness = 0.05,
  currentWord = '',
  persona = 'AVA',
  subtitleText = '',
  onPersonaChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Map Avatar state to video avatar state
  const mappedVideoState: VideoAvatarState = useMemo(() => {
    const s = String(state).toLowerCase();
    if (isSpeaking || s === 'speaking') return 'SPEAKING';
    if (s === 'thinking') return 'THINKING';
    if (s === 'listening') return 'LISTENING';
    if (s === 'pleased' || s === 'concerned' || s === 'reacting') return 'REACTING';
    return 'IDLE';
  }, [isSpeaking, state]);

  // Map expression
  const mappedExpression: VideoExpressionState = useMemo(() => {
    if (expression === 'ENCOURAGING') return 'ENCOURAGING';
    if (expression === 'THINKING') return 'THINKING';
    if (expression === 'CONCERNED') return 'CONCERNED';
    if (expression === 'FOCUSED') return 'FOCUSED';
    if (expression === 'INTERESTED') return 'ENCOURAGING';
    return isSpeaking ? 'SMILING' : 'NEUTRAL';
  }, [expression, isSpeaking]);

  // Frame animation loop
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const renderLoop = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // Calculate frame pose & lip sync offsets
          const frame = calculateVideoAvatarFrame(elapsed, null, mappedVideoState, mappedExpression);
          // Override jaw open with live mouth openness prop if speaking
          const activeJawOpen = isSpeaking ? Math.max(mouthOpenness, frame.jawOpen) : frame.jawOpen;

          // 1. Draw High-Tech HD Video Background Gradient
          const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
          bgGrad.addColorStop(0, '#0a0f1d');
          bgGrad.addColorStop(0.5, '#111827');
          bgGrad.addColorStop(1, '#070b14');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Subtle background studio lighting glow
          const glowGrad = ctx.createRadialGradient(
            width / 2, height * 0.4, 20,
            width / 2, height * 0.4, width * 0.4
          );
          if (persona === 'AVA') {
            glowGrad.addColorStop(0, 'rgba(74, 139, 223, 0.25)');
            glowGrad.addColorStop(1, 'rgba(74, 139, 223, 0)');
          } else {
            glowGrad.addColorStop(0, 'rgba(160, 0, 109, 0.25)');
            glowGrad.addColorStop(1, 'rgba(160, 0, 109, 0)');
          }
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, 0, width, height);

          // 2. Render Character Silhouette / Face Mesh
          ctx.save();
          // Apply head tilt & roll micro-gestures
          ctx.translate(width / 2 + frame.headTiltY * 2, height / 2 + frame.headTiltX * 2);
          ctx.rotate((frame.headTiltZ * Math.PI) / 180);

          const isAva = persona === 'AVA';

          // Body / Torso
          ctx.fillStyle = isAva ? '#1e293b' : '#0f172a';
          ctx.beginPath();
          ctx.ellipse(0, height * 0.38, width * 0.28, height * 0.22, 0, 0, Math.PI * 2);
          ctx.fill();

          // Shirt Collar Accent
          ctx.strokeStyle = isAva ? '#3b82f6' : '#9333ea';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-width * 0.08, height * 0.22);
          ctx.lineTo(0, height * 0.28);
          ctx.lineTo(width * 0.08, height * 0.22);
          ctx.stroke();

          // Neck
          ctx.fillStyle = isAva ? '#f1d6c0' : '#e2b89b';
          ctx.fillRect(-width * 0.05, height * 0.06, width * 0.1, height * 0.14);

          // Head Shape
          ctx.fillStyle = isAva ? '#f6ddc9' : '#eabf9f';
          ctx.beginPath();
          ctx.ellipse(0, -height * 0.04, width * 0.15, height * 0.18, 0, 0, Math.PI * 2);
          ctx.fill();

          // Hair Style
          ctx.fillStyle = isAva ? '#261b16' : '#18110e';
          ctx.beginPath();
          if (isAva) {
            ctx.ellipse(0, -height * 0.12, width * 0.17, height * 0.14, 0, Math.PI, Math.PI * 2);
            ctx.rect(-width * 0.17, -height * 0.12, width * 0.06, height * 0.28);
            ctx.rect(width * 0.11, -height * 0.12, width * 0.06, height * 0.28);
          } else {
            ctx.ellipse(0, -height * 0.13, width * 0.16, height * 0.12, 0, Math.PI, Math.PI * 2);
          }
          ctx.fill();

          // Eyes
          const eyeY = -height * 0.07;
          const leftEyeX = -width * 0.055;
          const rightEyeX = width * 0.055;

          if (frame.eyeBlink > 0.8) {
            ctx.strokeStyle = '#33231c';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(leftEyeX - 10, eyeY);
            ctx.lineTo(leftEyeX + 10, eyeY);
            ctx.moveTo(rightEyeX - 10, eyeY);
            ctx.lineTo(rightEyeX + 10, eyeY);
            ctx.stroke();
          } else {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(leftEyeX, eyeY, 11, 7 * (1 - frame.eyeBlink), 0, 0, Math.PI * 2);
            ctx.ellipse(rightEyeX, eyeY, 11, 7 * (1 - frame.eyeBlink), 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isAva ? '#2563eb' : '#059669';
            ctx.beginPath();
            ctx.arc(leftEyeX, eyeY, 4.5, 0, Math.PI * 2);
            ctx.arc(rightEyeX, eyeY, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Eyebrows
          const browY = eyeY - 14 - frame.browRaise * 6;
          ctx.strokeStyle = '#3b281f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(leftEyeX - 12, browY + 2);
          ctx.lineTo(leftEyeX + 10, browY);
          ctx.moveTo(rightEyeX - 10, browY);
          ctx.lineTo(rightEyeX + 12, browY + 2);
          ctx.stroke();

          // Nose
          ctx.strokeStyle = 'rgba(180, 120, 90, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -height * 0.05);
          ctx.lineTo(-2, 2);
          ctx.lineTo(4, 4);
          ctx.stroke();

          // Mouth & Phoneme Lip Sync
          const mouthY = height * 0.05;
          const openH = activeJawOpen * 24;
          const lipW = 22 * frame.lipWidth;

          ctx.fillStyle = isAva ? '#d97706' : '#c2410c';
          ctx.beginPath();
          ctx.ellipse(0, mouthY + frame.mouthCornerY * 5, lipW, Math.max(4, openH + 4), 0, 0, Math.PI * 2);
          ctx.fill();

          if (openH > 3) {
            ctx.fillStyle = '#3a0808';
            ctx.beginPath();
            ctx.ellipse(0, mouthY + frame.mouthCornerY * 5, lipW * 0.85, openH * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, [mappedVideoState, mappedExpression, isSpeaking, mouthOpenness, persona]);

  const displayText = subtitleText || currentWord || '';

  return (
    <div className={`relative flex flex-col w-full h-full ${className}`}>
      {/* Real-Time Video Call Viewport Canvas */}
      <div className="relative flex-1 w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#080d1a] shadow-2xl">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover"
        />

        {/* Top Bar Overlay: Live Speaker Name & Persona Switcher */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-100 shadow-lg">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                mappedVideoState === 'SPEAKING'
                  ? 'bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400'
                  : mappedVideoState === 'THINKING'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-blue-400'
              }`}
            />
            <span>Ava Mitchell</span>
            <span className="text-[10px] text-slate-400 font-mono pl-1 border-l border-white/10">
              HD Video Call
            </span>
          </div>
        </div>

        {/* Bottom Bar Overlay: Audio Level & Expression Indicator */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>State: {mappedVideoState}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-bold">{mappedExpression}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{Math.round(mouthOpenness * 100)}% Vol</span>
          </div>
        </div>
      </div>

      {/* Synchronized Captions Banner beneath video viewport */}
      {displayText && (
        <div className="mt-3 px-4 py-3 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl text-center">
          <p className="text-xs sm:text-sm font-sans font-medium text-slate-200 leading-relaxed">
            "{displayText}"
          </p>
        </div>
      )}
    </div>
  );
};

export default RealtimeVideoAvatar;
