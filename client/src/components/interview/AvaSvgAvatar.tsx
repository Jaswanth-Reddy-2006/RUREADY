import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import type { AvatarState } from './AIAvatar';

interface AvaSvgAvatarProps {
  state: AvatarState;
  isSpeaking: boolean;
  mouthOpenness: number;
  currentWord?: string;
  className?: string;
}

const AvaSvgAvatar: React.FC<AvaSvgAvatarProps> = ({
  state,
  isSpeaking,
  mouthOpenness,
  currentWord,
  className = '',
}) => {
  const isListening = state === 'listening' && !isSpeaking;

  // Dynamic Background & Glow Aura configs
  const stateConfig = useMemo(() => {
    switch (state) {
      case 'thinking':
        return {
          auraColor: 'rgba(139, 92, 246, 0.45)', // Violet
          auraClass: 'from-violet-600/35 via-fuchsia-600/15 to-transparent',
          shadowClass: 'shadow-[0_0_50px_rgba(139,92,246,0.3)]',
          label: 'Cognitive Processing...',
          badgeColor: 'text-violet-400',
        };
      case 'listening':
        return {
          auraColor: 'rgba(16, 185, 129, 0.45)', // Emerald
          auraClass: 'from-emerald-600/35 via-teal-600/15 to-transparent',
          shadowClass: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
          label: 'Listening Closely...',
          badgeColor: 'text-emerald-400',
        };
      case 'speaking':
        return {
          auraColor: 'rgba(245, 166, 35, 0.45)', // Warm Amber
          auraClass: 'from-[#F5A623]/35 via-[#E85D24]/15 to-transparent',
          shadowClass: 'shadow-[0_0_50px_rgba(245,166,35,0.35)]',
          label: 'Speaking...',
          badgeColor: 'text-[#F5A623]',
        };
      case 'pleased':
        return {
          auraColor: 'rgba(20, 184, 166, 0.45)', // Teal
          auraClass: 'from-teal-500/35 via-emerald-500/15 to-transparent',
          shadowClass: 'shadow-[0_0_50px_rgba(20,184,166,0.3)]',
          label: 'Pleased',
          badgeColor: 'text-teal-400',
        };
      case 'concerned':
        return {
          auraColor: 'rgba(239, 68, 68, 0.45)', // Red
          auraClass: 'from-rose-600/35 via-amber-600/15 to-transparent',
          shadowClass: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
          label: 'Analyzing Poise...',
          badgeColor: 'text-rose-400',
        };
      case 'idle':
      default:
        return {
          auraColor: 'rgba(56, 189, 248, 0.2)', // Sky Blue
          auraClass: 'from-sky-500/20 via-blue-600/5 to-transparent',
          shadowClass: 'shadow-[0_0_40px_rgba(56,189,248,0.15)]',
          label: 'Ava (Idle)',
          badgeColor: 'text-sky-400',
        };
    }
  }, [state]);

  const hudColor = useMemo(() => {
    switch (state) {
      case 'thinking': return '#A78BFA'; // Violet-light
      case 'listening': return '#34D399'; // Emerald-light
      case 'speaking': return '#FBBF24'; // Amber-light
      case 'pleased': return '#2DD4BF'; // Teal-light
      case 'concerned': return '#F87171'; // Red-light
      default: return '#38BDF8'; // Sky-light
    }
  }, [state]);

  // Eyeball gaze coordinates shift based on state
  const gaze = useMemo(() => {
    switch (state) {
      case 'thinking':
        return { x: -1.8, y: -2.2 };
      case 'listening':
        return { x: 0.6, y: 0.2 };
      case 'concerned':
        return { x: 0, y: 0.8 };
      case 'pleased':
        return { x: 0, y: 0 };
      case 'speaking':
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }, [state]);

  // Eyebrows angles and offsets
  const leftBrowAnimate = useMemo(() => {
    switch (state) {
      case 'thinking':
        return { y: 2, rotate: 6, originX: 166, originY: 146 };
      case 'concerned':
        return { y: 3.5, rotate: 9, originX: 166, originY: 146 };
      case 'pleased':
        return { y: -2, rotate: -4, originX: 166, originY: 146 };
      default:
        return { y: 0, rotate: 0 };
    }
  }, [state]);

  const rightBrowAnimate = useMemo(() => {
    switch (state) {
      case 'thinking':
        return { y: 2, rotate: -6, originX: 234, originY: 146 };
      case 'concerned':
        return { y: 3.5, rotate: -9, originX: 234, originY: 146 };
      case 'pleased':
        return { y: -2, rotate: 4, originX: 234, originY: 146 };
      default:
        return { y: 0, rotate: 0 };
    }
  }, [state]);

  // Breathing motion for Ava's body, neck, head
  const breathingAnimation = {
    animate: {
      y: [0, -1.8, 0],
    },
    transition: {
      duration: 4.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <div
      className={clsx(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-[#090A0E] border border-white/10 transition-all duration-700 ease-out',
        stateConfig.shadowClass,
        className,
      )}
    >
      {/* 1. Concentric Background Lighting Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.12 + mouthOpenness * 0.08, 1] : [1, 1.05, 1],
            opacity: [0.12, 0.28, 0.12],
          }}
          transition={{
            duration: state === 'thinking' ? 1.8 : 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={clsx(
            'absolute h-[115%] w-[115%] rounded-full bg-gradient-to-r blur-[70px] pointer-events-none',
            stateConfig.auraClass,
          )}
        />
        <motion.div
          animate={{
            scale: state === 'thinking' ? [1.08, 0.96, 1.08] : [1.02, 1.15, 1.02],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: state === 'thinking' ? 2.2 : 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={clsx(
            'absolute h-[85%] w-[85%] rounded-full bg-gradient-to-r blur-[90px] pointer-events-none',
            stateConfig.auraClass,
          )}
        />
      </div>

      {/* 2. Interactive SVG Programmatic Vector Avatar of Ava */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* DEFINITIONS FOR GRADIENTS AND FILTERS */}
          <defs>
            {/* Skin Shading */}
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9D4C2" />
              <stop offset="100%" stopColor="#EAA484" />
            </linearGradient>
            
            {/* Neck Shading */}
            <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D98E6E" />
              <stop offset="100%" stopColor="#BC7050" />
            </linearGradient>

            {/* Blazer Gradient */}
            <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E233D" />
              <stop offset="50%" stopColor="#151829" />
              <stop offset="100%" stopColor="#0E101D" />
            </linearGradient>

            {/* Hair Base */}
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C2418" />
              <stop offset="50%" stopColor="#25140C" />
              <stop offset="100%" stopColor="#150B07" />
            </linearGradient>

            {/* Hair Highlights */}
            <linearGradient id="hairHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5D3A28" stopOpacity="0" />
              <stop offset="50%" stopColor="#7E4D35" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5D3A28" stopOpacity="0" />
            </linearGradient>

            {/* Iris Gradient */}
            <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#36D4C1" />
              <stop offset="70%" stopColor="#0F8B7B" />
              <stop offset="100%" stopColor="#064E45" />
            </radialGradient>

            {/* Glass Lens Gradient Reflection */}
            <linearGradient id="lensRefGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            
            {/* Blouse V-Neck Gradient */}
            <linearGradient id="blouseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EAEBED" />
            </linearGradient>

            {/* Soft Shadow under eyes */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* BACKGROUND DESK LIGHT REFLEX */}
          <path d="M 0,320 Q 200,280 400,320 L 400,400 L 0,400 Z" fill="#0C0D13" opacity="0.45" />

          {/* MAIN AVATAR MOTION GROUP */}
          <motion.g {...breathingAnimation}>
            
            {/* 2.1 HAIR BACK LAYER (Behind ears and head) */}
            <path
              d="M 125,180 Q 95,220 100,290 Q 105,335 125,350 Q 145,295 135,230 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M 275,180 Q 305,220 300,290 Q 295,335 275,350 Q 255,295 265,230 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M 115,220 C 85,250 90,320 110,360 C 130,365 140,340 135,300 C 130,260 120,240 115,220 Z"
              fill="#180B07"
            />
            <path
              d="M 285,220 C 315,250 310,320 290,360 C 270,365 260,340 265,300 C 270,260 280,240 285,220 Z"
              fill="#180B07"
            />

            {/* 2.2 SHOULDERS & PROFESSIONAL CLOTHING */}
            {/* Blazer Back Collar */}
            <path d="M 160,285 Q 200,265 240,285 L 240,300 Q 200,290 160,300 Z" fill="#141725" />
            
            {/* Inner Ivory Blouse (V-Neck) */}
            <path d="M 175,280 L 225,280 L 200,325 Z" fill="url(#blouseGrad)" />
            <line x1="200" y1="300" x2="200" y2="325" stroke="#D3D5DA" strokeWidth="1" />

            {/* Left Blazer Lapel & Jacket Side */}
            <path
              d="M 165,290 L 195,350 L 175,400 L 60,400 C 55,360 85,325 125,305 C 145,295 160,290 165,290 Z"
              fill="url(#blazerGrad)"
            />
            {/* Right Blazer Lapel & Jacket Side */}
            <path
              d="M 235,290 L 205,350 L 225,400 L 340,400 C 345,360 315,325 275,305 C 255,295 240,290 235,290 Z"
              fill="url(#blazerGrad)"
            />
            {/* Blazer Lapel Shadows and Highlights */}
            <path d="M 165,290 L 195,350 L 188,355 L 158,295 Z" fill="#2E355B" opacity="0.35" />
            <path d="M 235,290 L 205,350 L 212,355 L 242,295 Z" fill="#2E355B" opacity="0.35" />
            <path d="M 195,350 L 175,400 L 181,400 L 198,352 Z" fill="#2E355B" opacity="0.35" />
            <path d="M 205,350 L 225,400 L 219,400 L 202,352 Z" fill="#2E355B" opacity="0.35" />

            {/* Elegant Silver/Teal Brooch on Blazer */}
            <circle cx="120" cy="335" r="5" fill="#38BDF8" opacity="0.85" />
            <circle cx="120" cy="335" r="2.5" fill="#FFFFFF" />

            {/* 2.3 NECK */}
            <path
              d="M 172,225 C 172,260 178,285 180,295 C 188,299 212,299 220,295 C 222,285 228,260 228,225 Z"
              fill="url(#neckGrad)"
            />
            {/* Shadow directly under the chin */}
            <path
              d="M 172,225 Q 200,246 228,225 Q 200,234 172,225 Z"
              fill="#A05C3F"
              opacity="0.85"
            />

            {/* 2.4 EARS */}
            {/* Left Ear */}
            <path
              d="M 132,175 C 122,175 120,195 132,205 Z"
              fill="#E09F81"
            />
            <path d="M 129,182 C 124,183 124,192 129,195 Z" fill="#BD7B5E" />
            
            {/* Right Ear */}
            <path
              d="M 268,175 C 278,175 280,195 268,205 Z"
              fill="#E09F81"
            />
            <path d="M 271,182 C 276,183 276,192 271,195 Z" fill="#BD7B5E" />

            {/* 2.5 FACE BASE SHAPE */}
            <path
              d="M 132,165 C 132,118 152,110 200,110 C 248,110 268,118 268,165 C 268,212 248,252 200,252 C 152,252 132,212 132,165 Z"
              fill="url(#skinGrad)"
              filter="url(#softShadow)"
            />
            
            {/* Cheeks blush for pleased state */}
            <motion.ellipse
              cx="150" cy="195" rx="14" ry="7"
              fill="#F472B6"
              initial={{ opacity: 0.1 }}
              animate={state === 'pleased' ? { opacity: 0.38, scale: 1.15 } : { opacity: 0.1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.ellipse
              cx="250" cy="195" rx="14" ry="7"
              fill="#F472B6"
              initial={{ opacity: 0.1 }}
              animate={state === 'pleased' ? { opacity: 0.38, scale: 1.15 } : { opacity: 0.1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* 2.6 NOSE */}
            {/* Nose Bridge line */}
            <path d="M 197,162 L 197,202 Q 200,207 203,202" stroke="#BC7557" strokeWidth="1.25" fill="none" opacity="0.4" />
            {/* Nose Tip Shadow and highlights */}
            <path d="M 194,204 Q 200,208 206,204 Q 200,203 194,204 Z" fill="#BD7050" />
            <path d="M 197,203 Q 200,201 203,203" stroke="#FFF" strokeWidth="0.75" fill="none" opacity="0.3" />

            {/* 2.7 SPECS / GLASSES FRAME BACKGROUND LENSES & DIAGONAL SHINE */}
            {/* Left Glass Lens */}
            <circle cx="168" cy="165" r="22" fill="url(#lensRefGrad)" opacity="0.9" />
            <path d="M 152,152 L 180,180" stroke="#FFF" strokeWidth="0.75" opacity="0.18" />
            
            {/* Right Glass Lens */}
            <circle cx="232" cy="165" r="22" fill="url(#lensRefGrad)" opacity="0.9" />
            <path d="M 216,152 L 244,180" stroke="#FFF" strokeWidth="0.75" opacity="0.18" />

            {/* 2.8 INTERACTIVE EYEBROWS */}
            {/* Left Brow */}
            <motion.path
              d="M 148,150 Q 163,142 181,149"
              fill="none"
              stroke="#2A170F"
              strokeWidth="2.75"
              strokeLinecap="round"
              animate={leftBrowAnimate}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
            {/* Right Brow */}
            <motion.path
              d="M 219,149 Q 237,142 252,150"
              fill="none"
              stroke="#2A170F"
              strokeWidth="2.75"
              strokeLinecap="round"
              animate={rightBrowAnimate}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />

            {/* 2.9 INTERACTIVE EYES (Sclera, Irises, Pupils, Blinking Eyelids) */}
            {/* Left Eye Group */}
            <g>
              {/* White Sclera */}
              <path d="M 153,165 Q 168,154 183,165 Q 168,174 153,165 Z" fill="#FFFFFF" stroke="#D18766" strokeWidth="0.5" />
              
              {/* Iris, Pupil & Specular highlights (Gaze shifting) */}
              <g style={{ clipPath: 'url(#leftEyeClip)' }}>
                <clipPath id="leftEyeClip">
                  <path d="M 153,165 Q 168,154 183,165 Q 168,174 153,165 Z" />
                </clipPath>
                
                <motion.g
                  animate={gaze}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  {/* Iris */}
                  <circle cx="168" cy="165" r="7.5" fill="url(#irisGrad)" />
                  {/* Pupil */}
                  <circle cx="168" cy="165" r="3.75" fill="#090A0D" />
                  {/* Glass Specular Highlights */}
                  <circle cx="165.8" cy="162.8" r="1.3" fill="#FFFFFF" />
                  <circle cx="170" cy="167.5" r="0.6" fill="#FFFFFF" opacity="0.6" />
                </motion.g>
              </g>

              {/* Upper Eyelid fold */}
              <path d="M 151,162 Q 168,151 185,162" fill="none" stroke="#B46648" strokeWidth="0.75" opacity="0.7" />

              {/* BLINKING LAYERS (ScaleY loop blinking) */}
              <motion.path
                d="M 152,158 L 184,158 L 184,171 L 152,171 Z"
                fill="url(#skinGrad)"
                style={{ originY: 0 }}
                animate={{
                  scaleY: [0, 0, 1, 0, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  times: [0, 0.94, 0.96, 0.98, 1],
                  ease: 'easeInOut',
                }}
              />
              {/* Eyelash stroke on blink */}
              <motion.path
                d="M 153,165 Q 168,155 183,165"
                fill="none"
                stroke="#25140C"
                strokeWidth="1.5"
                style={{ originY: 0 }}
                animate={{
                  scaleY: [0, 0, 1, 0, 0],
                  y: [0, 0, 5, 0, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  times: [0, 0.94, 0.96, 0.98, 1],
                  ease: 'easeInOut',
                }}
              />
            </g>

            {/* Right Eye Group */}
            <g>
              {/* White Sclera */}
              <path d="M 217,165 Q 232,154 247,165 Q 232,174 217,165 Z" fill="#FFFFFF" stroke="#D18766" strokeWidth="0.5" />
              
              {/* Iris, Pupil & Highlights */}
              <g style={{ clipPath: 'url(#rightEyeClip)' }}>
                <clipPath id="rightEyeClip">
                  <path d="M 217,165 Q 232,154 247,165 Q 232,174 217,165 Z" />
                </clipPath>
                
                <motion.g
                  animate={gaze}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  {/* Iris */}
                  <circle cx="232" cy="165" r="7.5" fill="url(#irisGrad)" />
                  {/* Pupil */}
                  <circle cx="232" cy="165" r="3.75" fill="#090A0D" />
                  {/* Highlights */}
                  <circle cx="229.8" cy="162.8" r="1.3" fill="#FFFFFF" />
                  <circle cx="234" cy="167.5" r="0.6" fill="#FFFFFF" opacity="0.6" />
                </motion.g>
              </g>

              {/* Upper Eyelid fold */}
              <path d="M 215,162 Q 232,151 249,162" fill="none" stroke="#B46648" strokeWidth="0.75" opacity="0.7" />

              {/* BLINKING LAYERS */}
              <motion.path
                d="M 216,158 L 248,158 L 248,171 L 216,171 Z"
                fill="url(#skinGrad)"
                style={{ originY: 0 }}
                animate={{
                  scaleY: [0, 0, 1, 0, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  times: [0, 0.94, 0.96, 0.98, 1],
                  ease: 'easeInOut',
                }}
              />
              {/* Eyelash stroke on blink */}
              <motion.path
                d="M 217,165 Q 232,155 247,165"
                fill="none"
                stroke="#25140C"
                strokeWidth="1.5"
                style={{ originY: 0 }}
                animate={{
                  scaleY: [0, 0, 1, 0, 0],
                  y: [0, 0, 5, 0, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  times: [0, 0.94, 0.96, 0.98, 1],
                  ease: 'easeInOut',
                }}
              />
            </g>

            {/* 2.10 SPECS FRAMES FRONT BARS */}
            {/* Rims Front Stroke */}
            <circle cx="168" cy="165" r="22" fill="none" stroke="#ECC844" strokeWidth="1.75" />
            <circle cx="232" cy="165" r="22" fill="none" stroke="#ECC844" strokeWidth="1.75" />
            
            {/* Glasses Bridge */}
            <path d="M 190,165 L 210,165" stroke="#ECC844" strokeWidth="2.2" fill="none" />
            
            {/* Sides/Temples */}
            <path d="M 146,165 L 129,173" stroke="#ECC844" strokeWidth="1.5" fill="none" />
            <path d="M 254,165 L 271,173" stroke="#ECC844" strokeWidth="1.5" fill="none" />

            {/* 2.11 MOUTH & DYNAMIC LIP SYNC (Professional structure) */}
            <g>
              {/* Inner Cavity Clip Path for teeth and tongue */}
              <g style={{ clipPath: 'url(#mouthClip)' }}>
                <clipPath id="mouthClip">
                  <motion.path
                    d="M 183,222 C 183,222 200,229 217,222 C 217,222 200,244 183,222 Z"
                    animate={{
                      d: state === 'pleased'
                        ? 'M 181,221 C 181,221 200,233 219,221 C 219,221 200,250 181,221 Z'
                        : state === 'concerned'
                        ? 'M 184,223 C 184,223 200,220 216,223 C 216,223 200,232 184,223 Z'
                        : 'M 183,222 C 183,222 200,229 217,222 C 217,222 200,244 183,222 Z',
                    }}
                    style={{ originX: 200, originY: 222 }}
                  />
                </clipPath>

                {/* Dark Throat backing */}
                <motion.rect
                  x="175" y="210" width="50" height="42"
                  fill="#47141C"
                  animate={{
                    scaleY: isSpeaking ? 0.35 + mouthOpenness * 1.55 : 0.08
                  }}
                  style={{ originX: 200, originY: 222 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 15 }}
                />

                {/* Upper White Teeth Strip */}
                <motion.path
                  d="M 181,221 Q 200,224 219,221 L 219,225 Q 200,227 181,225 Z"
                  fill="#FFFFFF"
                  animate={{
                    y: isSpeaking ? mouthOpenness * -0.5 : 0
                  }}
                  style={{ originX: 200, originY: 222 }}
                />

                {/* Pink Tongue Curve */}
                <motion.path
                  d="M 186,242 Q 200,232 214,242 C 214,242 200,247 186,242 Z"
                  fill="#E07F8E"
                  animate={{
                    y: isSpeaking ? mouthOpenness * 1.2 : 0,
                    scaleX: isSpeaking ? 0.95 + mouthOpenness * 0.05 : 1
                  }}
                  style={{ originX: 200, originY: 236 }}
                />
              </g>

              {/* Bottom Lip */}
              <motion.path
                d="M 182,222 Q 200,232 218,222 Q 200,239 182,222 Z"
                fill="#C66270"
                animate={{
                  d: state === 'pleased'
                    ? 'M 180,221 Q 200,234 220,221 Q 200,246 180,221 Z'
                    : state === 'concerned'
                    ? 'M 183,223 Q 200,222 217,223 Q 200,230 183,223 Z'
                    : 'M 182,222 Q 200,232 218,222 Q 200,239 182,222 Z',
                  scaleY: isSpeaking ? 0.4 + mouthOpenness * 1.35 : 0.2
                }}
                style={{ originX: 200, originY: 222 }}
                transition={{ type: 'spring', stiffness: 280, damping: 15 }}
              />

              {/* Top Lip */}
              <motion.path
                d="M 181,222 Q 200,217 219,222 Q 200,226 181,222 Z"
                fill="#DC7786"
                animate={{
                  d: state === 'pleased'
                    ? 'M 179,221 C 187,214 213,214 221,221 Q 200,225 179,221 Z'
                    : state === 'concerned'
                    ? 'M 182,223 C 188,219 212,219 218,223 Q 200,224 182,223 Z'
                    : 'M 181,222 Q 200,217 219,222 Q 200,226 181,222 Z',
                  scaleY: isSpeaking ? 0.35 + mouthOpenness * 1.25 : 0.25,
                  y: isSpeaking ? mouthOpenness * -2.2 : 0
                }}
                style={{ originX: 200, originY: 222 }}
                transition={{ type: 'spring', stiffness: 280, damping: 15 }}
              />
            </g>

            {/* 2.12 FRONT HAIR LAYER (Layers overlapping forehead & face frame) */}
            {/* Back Head Hair Mass */}
            <path
              d="M 130,150 C 130,110 160,95 200,95 C 240,95 270,110 270,150 C 270,160 266,168 266,168 C 266,168 262,130 200,130 C 138,130 134,168 134,168 Z"
              fill="url(#hairGrad)"
            />
            {/* Front Fringe Left */}
            <path
              d="M 200,128 C 160,128 132,150 132,175 C 132,185 136,172 142,168 C 158,155 185,152 200,155 Z"
              fill="url(#hairGrad)"
            />
            {/* Front Fringe Right Side Swept (The highlight part) */}
            <path
              d="M 200,128 C 235,128 268,145 268,185 C 268,220 258,235 254,235 C 258,215 258,190 248,175 C 235,155 215,150 200,150 Z"
              fill="url(#hairGrad)"
            />
            
            {/* Fine Hair strand locks overlay for depth */}
            <path
              d="M 133,165 Q 140,210 135,235 Q 128,210 133,165 Z"
              fill="#25140C"
            />
            <path
              d="M 267,165 Q 260,210 265,235 Q 272,210 267,165 Z"
              fill="#25140C"
            />
            <path
              d="M 200,132 C 220,132 250,140 258,160 C 248,148 225,142 200,142 Z"
              fill="url(#hairHighlightGrad)"
            />
            <path
              d="M 195,132 C 175,132 150,140 142,160 C 152,148 175,142 195,142 Z"
              fill="url(#hairHighlightGrad)"
            />

          </motion.g>

          {/* 3. FUTURISTIC CYBER HUD TARGET OVERLAYS (Integrated seamlessly with vector) */}
          <g className="pointer-events-none">
            {/* Global Corner Target Frame brackets */}
            <motion.path
              d="M 60,60 L 60,82 M 60,60 L 82,60"
              fill="none" stroke={hudColor} strokeWidth="1.5" opacity="0.45"
              animate={state === 'thinking' ? { x: [0, 3, 0], y: [0, 3, 0] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 340,60 L 340,82 M 340,60 L 318,60"
              fill="none" stroke={hudColor} strokeWidth="1.5" opacity="0.45"
              animate={state === 'thinking' ? { x: [0, -3, 0], y: [0, 3, 0] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 60,340 L 60,318 M 60,340 L 82,340"
              fill="none" stroke={hudColor} strokeWidth="1.5" opacity="0.45"
              animate={state === 'thinking' ? { x: [0, 3, 0], y: [0, -3, 0] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 340,340 L 340,318 M 340,340 L 318,340"
              fill="none" stroke={hudColor} strokeWidth="1.5" opacity="0.45"
              animate={state === 'thinking' ? { x: [0, -3, 0], y: [0, -3, 0] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Left HUD Gaze Tracker Circle Overlay (Aligned to left eye x=168, y=165) */}
            <g opacity="0.6">
              <motion.rect
                x="148" y="145" width="40" height="40" rx="6"
                fill="none" stroke={hudColor} strokeWidth="0.75" strokeDasharray="3 3"
                animate={{
                  scaleY: [1, 1, 0.05, 1, 1],
                  opacity: [0.4, 0.6, 0.1, 0.6, 0.4],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.94, 0.96, 0.98, 1],
                }}
                style={{ originX: '168px', originY: '165px' }}
              />
              <motion.circle
                cx="168" cy="165" r="9"
                fill="none" stroke={hudColor} strokeWidth="0.5"
                animate={state === 'listening' ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <line x1="154" y1="165" x2="182" y2="165" stroke={hudColor} strokeWidth="0.35" opacity="0.3" />
              <line x1="168" y1="151" x2="168" y2="179" stroke={hudColor} strokeWidth="0.35" opacity="0.3" />
            </g>

            {/* Right HUD Gaze Tracker Circle Overlay (Aligned to right eye x=232, y=165) */}
            <g opacity="0.6">
              <motion.rect
                x="212" y="145" width="40" height="40" rx="6"
                fill="none" stroke={hudColor} strokeWidth="0.75" strokeDasharray="3 3"
                animate={{
                  scaleY: [1, 1, 0.05, 1, 1],
                  opacity: [0.4, 0.6, 0.1, 0.6, 0.4],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.94, 0.96, 0.98, 1],
                }}
                style={{ originX: '232px', originY: '165px' }}
              />
              <motion.circle
                cx="232" cy="165" r="9"
                fill="none" stroke={hudColor} strokeWidth="0.5"
                animate={state === 'listening' ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <line x1="218" y1="165" x2="246" y2="165" stroke={hudColor} strokeWidth="0.35" opacity="0.3" />
              <line x1="232" y1="151" x2="232" y2="179" stroke={hudColor} strokeWidth="0.35" opacity="0.3" />
            </g>

            {/* Temple Neural Connections */}
            <motion.path
              d="M 125,130 L 92,102 L 65,102"
              fill="none" stroke={hudColor} strokeWidth="1"
              strokeDasharray="6 3"
              animate={state === 'thinking' ? {
                strokeDashoffset: [0, -20],
                opacity: [0.3, 0.8, 0.3],
              } : { opacity: 0.2 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d="M 275,130 L 308,102 L 335,102"
              fill="none" stroke={hudColor} strokeWidth="1"
              strokeDasharray="6 3"
              animate={state === 'thinking' ? {
                strokeDashoffset: [0, 20],
                opacity: [0.3, 0.8, 0.3],
              } : { opacity: 0.2 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Vocal Ripples during speaking (synced with mouthOpenness) */}
            {isSpeaking && (
              <g>
                <motion.circle
                  cx="200" cy="226" r="14"
                  fill="none" stroke={hudColor} strokeWidth="1.25"
                  animate={{
                    scale: [1, 2.3 + mouthOpenness * 8],
                    opacity: [0.75, 0],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="200" cy="226" r="14"
                  fill="none" stroke={hudColor} strokeWidth="0.75"
                  animate={{
                    scale: [1, 3.4 + mouthOpenness * 14],
                    opacity: [0.45, 0],
                  }}
                  transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
                />
              </g>
            )}

            {/* Pleased sparkles */}
            {state === 'pleased' && (
              <g>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.circle
                    key={i}
                    r="1.8"
                    fill={hudColor}
                    cx={150 + i * 20}
                    animate={{
                      y: [0, -25],
                      opacity: [0, 0.75, 0],
                      scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </g>
            )}

            {/* Concerned scanning line */}
            {state === 'concerned' && (
              <motion.line
                x1="65" y1="180" x2="335" y2="180"
                stroke={hudColor} strokeWidth="0.85"
                animate={{
                  y: [-50, 50, -50],
                  opacity: [0.25, 0.65, 0.25],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </g>
        </svg>

        {/* Floating status details */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
          {state === 'thinking' && (
            <span className="text-[7.5px] uppercase font-bold tracking-widest text-violet-400/80 font-display animate-pulse bg-violet-950/20 px-2 py-0.5 rounded border border-violet-800/10">
              Cognitive Path: Engaged
            </span>
          )}
          {isListening && (
            <span className="text-[7.5px] uppercase font-bold tracking-widest text-emerald-400/80 font-display animate-pulse bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/10">
              Biometric Scan: Locked
            </span>
          )}
        </div>
      </div>

      {/* 3. Subtitle Bottom Gradient Shadow Overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-transparent z-15" />

      {/* 4. Subtitle Floating Glass Badge with Voice Wave Graph */}
      <AnimatePresence>
        {currentWord && isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute bottom-6 left-1/2 z-30 w-[90%] -translate-x-1/2 flex items-center justify-between gap-3 rounded-2xl bg-black/65 border border-white/10 px-4 py-2.5 backdrop-blur-lg shadow-2xl shadow-black/80"
          >
            {/* Visualizer inside the subtitle pill */}
            <div className="flex gap-0.5 items-end h-3 shrink-0">
              {[0, 1, 2, 3].map((i) => {
                const baseVal = 4 + (i % 2) * 4;
                const peakVal = 14 + (i % 3) * 6;
                return (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-gradient-to-t from-[#F5A623] to-[#E85D24] rounded-full"
                    animate={{
                      height: isSpeaking ? [baseVal, peakVal * (0.5 + mouthOpenness * 4), baseVal] : baseVal,
                    }}
                    transition={{
                      duration: 0.5 + i * 0.08,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                );
              })}
            </div>

            {/* Word content */}
            <span className="flex-1 text-center font-display text-sm font-bold tracking-wide text-white/95 truncate">
              {currentWord}
            </span>

            {/* Small microphone speaker icon */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 font-display">
                Ava
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Status Badge at Top-Right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1.5 rounded-full bg-black/45 border border-white/5 px-2.5 py-1 backdrop-blur-sm">
          <motion.div
            className={clsx(
              'h-1.5 w-1.5 rounded-full',
              state === 'thinking'
                ? 'bg-violet-400'
                : state === 'listening'
                ? 'bg-emerald-400'
                : state === 'speaking'
                ? 'bg-[#F5A623]'
                : state === 'concerned'
                ? 'bg-rose-400'
                : 'bg-white/30',
            )}
            animate={
              state === 'listening'
                ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }
                : state === 'speaking'
                ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 font-display">
            {stateConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AvaSvgAvatar);
