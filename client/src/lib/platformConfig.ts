// ═══════════════════════════════════════════════════════════════
// Rennetus — Global Platform AI Model & Female Voice Configuration
// Authoritative single source of truth for 3D Female Avatars and English Female Voices
// ═══════════════════════════════════════════════════════════════

export type AvatarModelId = 'AVA' | 'ELENA' | 'MAYA' | 'PRIYA';

export type PlatformVoiceId =
  // ─── Female English Voices ───
  | 'en_us_ava_warm'
  | 'en_us_michelle_crystal'
  | 'en_gb_elena_refined'
  | 'en_us_sarah_dynamic'
  | 'en_au_chloe_articulate'
  | 'en_in_priya_fluent'
  | 'en_gb_hazel_formal'
  | 'en_us_emily_coach'
  // ─── Male English Voices ───
  | 'en_us_david_executive'
  | 'en_us_ryan_technical'
  | 'en_gb_oliver_refined'
  | 'en_gb_george_formal'
  | 'en_au_liam_articulate'
  | 'en_in_rohan_tech'
  | 'en_us_guy_natural'
  | 'en_us_james_mentor';

export type KokoroVoiceId = PlatformVoiceId;

export interface AvatarModelMetadata {
  id: AvatarModelId;
  name: string;
  title: string;
  roleDescription: string;
  gender: 'Female' | 'Male';
  accentRecommendation: string;
  recommendedVoice: PlatformVoiceId;
  specialization: string[];
  avatarThumbnail: string;
  modelAssetPath: string;
  tone: string;
  suitColorHex: number;
}

export interface PlatformVoiceMetadata {
  id: PlatformVoiceId;
  name: string;
  gender: 'Female' | 'Male';
  accent: 'US English' | 'British English' | 'Australian English' | 'Indian English';
  countryCode: 'US' | 'GB' | 'AU' | 'IN';
  tone: string;
  description: string;
  recommendedRole: string;
  samplePhrase: string;
  bestPairedModel: AvatarModelId;
  voiceMatchKeywords: string[];
}

export type KokoroVoiceMetadata = PlatformVoiceMetadata;

// ─── Active Platform Avatar Models (4 Distinct Verified Professional 3D Models) ───
export const PLATFORM_AVATAR_MODELS: AvatarModelMetadata[] = [
  {
    id: 'AVA',
    name: 'Ava Mitchell',
    title: 'Principal AI Technical Recruiter',
    roleDescription: 'Empathetic, articulate, and thorough. Calibrated for full-stack depth, behavioral STAR frameworks, and candidate evaluation.',
    gender: 'Female',
    accentRecommendation: 'Warm US English',
    recommendedVoice: 'en_us_ava_warm',
    specialization: ['Full Stack Systems', 'System Architecture', 'Behavioral STAR Calibration', 'Leadership & Team Dynamics'],
    avatarThumbnail: '/images/avatars/avatar_ava.png',
    modelAssetPath: '/models/interviewer_ava.glb',
    tone: 'Warm, encouraging, and articulate',
    suitColorHex: 0x162234, // Navy Executive Blazer
  },
  {
    id: 'ELENA',
    name: 'Elena Rostova',
    title: 'Executive VP of Engineering & Strategy',
    roleDescription: 'Executive evaluator probing organizational leadership, cross-functional conflict resolution, and architectural vision.',
    gender: 'Female',
    accentRecommendation: 'Sophisticated British English',
    recommendedVoice: 'en_gb_elena_refined',
    specialization: ['Engineering Leadership', 'Cross-Functional Strategy', 'System Tradeoffs', 'Executive Communication'],
    avatarThumbnail: '/images/avatars/avatar_alex.png',
    modelAssetPath: '/models/interviewer_elena.glb',
    tone: 'Executive, polished, and perceptive',
    suitColorHex: 0x0f1c3f, // Midnight Sapphire Suit
  },
  {
    id: 'MAYA',
    name: 'Maya Lin',
    title: 'Lead AI Research & Deep Learning Engineer',
    roleDescription: 'Specialized evaluator for Machine Learning systems, Transformer architectures, vector search pipelines, and ML Ops deployment.',
    gender: 'Female',
    accentRecommendation: 'Articulate Australian English',
    recommendedVoice: 'en_au_chloe_articulate',
    specialization: ['Machine Learning & LLMs', 'Vector Databases & RAG', 'ML Ops & Model Deployment', 'Python / PyTorch Internals'],
    avatarThumbnail: '/images/avatars/avatar_maya.png',
    modelAssetPath: '/models/interviewer_maya.glb',
    tone: 'Inquisitive, thoughtful, and articulate',
    suitColorHex: 0x0f332d, // Modern Emerald Teal Blazer
  },
  {
    id: 'PRIYA',
    name: 'Priya Sharma',
    title: 'Director of Cloud Infrastructure & Reliability',
    roleDescription: 'Probing site reliability engineering, zero-downtime migrations, disaster recovery, fault tolerance, and multi-region networking.',
    gender: 'Female',
    accentRecommendation: 'Fluent Global Tech Indian English',
    recommendedVoice: 'en_in_priya_fluent',
    specialization: ['SRE & Observability', 'Multi-Region High Availability', 'CI/CD Pipelines & DevOps', 'Security & Compliance'],
    avatarThumbnail: '/images/avatars/avatar_priya.png',
    modelAssetPath: '/models/interviewer_priya.glb',
    tone: 'Confident, precise, and fast-paced',
    suitColorHex: 0x38121f, // Royal Burgundy Blazer
  },
];

export const PLATFORM_VOICES: PlatformVoiceMetadata[] = [
  // ═══════════════════════════════════════════════════════════════
  // FEMALE VOICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'en_us_ava_warm',
    name: 'Ava — Warm Natural (US Female)',
    gender: 'Female',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Warm, Natural & Conversational',
    description: 'Gold-standard conversational American English female voice with warm natural pacing and clear enunciation.',
    recommendedRole: 'Technical Recruiter & General Mock Interviews',
    samplePhrase: 'Hello! I am ready to guide you through your technical mock interview today. Let us begin with your background.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['natural', 'jenny', 'aria', 'samantha', 'zira', 'female', 'us'],
  },
  {
    id: 'en_us_michelle_crystal',
    name: 'Sarah — Crystal Clear Technical (US Female)',
    gender: 'Female',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Crisp, Direct & Technical',
    description: 'High-clarity American female voice designed for rapid-fire technical questions and code walkthroughs.',
    recommendedRole: 'Live Coding & System Architecture',
    samplePhrase: 'Take a look at the code editor on your screen. When you are ready, explain your initial approach.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['aria', 'ana', 'jenny', 'samantha', 'female', 'us'],
  },
  {
    id: 'en_gb_elena_refined',
    name: 'Elena — Sophisticated British (UK Female)',
    gender: 'Female',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Sophisticated, Paced & Refined',
    description: 'Distinguished Received Pronunciation British English female voice with crystal-clear enunciation.',
    recommendedRole: 'Executive Assessment & Behavioral STAR Evaluation',
    samplePhrase: 'Could you describe a challenging technical initiative you led and the measurable outcomes achieved?',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['sonia', 'libby', 'hazel', 'victoria', 'female', 'gb', 'uk'],
  },
  {
    id: 'en_us_sarah_dynamic',
    name: 'Victoria — Dynamic Executive (US Female)',
    gender: 'Female',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Polished, Energetic & Professional',
    description: 'Modern executive delivery tailored for system design feedback and comprehensive interview scoring.',
    recommendedRole: 'Executive Presentation & System Tradeoffs',
    samplePhrase: 'Your approach to edge case handling is well structured. Let us proceed to the time complexity analysis.',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['jenny', 'samantha', 'female', 'en-us'],
  },
  {
    id: 'en_au_chloe_articulate',
    name: 'Maya — Articulate Australian (AU Female)',
    gender: 'Female',
    accent: 'Australian English',
    countryCode: 'AU',
    tone: 'Articulate, Clear & Engaging',
    description: 'Clear, modern Australian English female voice with natural cadence for international tech interviews.',
    recommendedRole: 'Full Stack & Global Engineering',
    samplePhrase: 'Welcome. Today we will walk through database partitioning and distributed cache invalidation strategies.',
    bestPairedModel: 'MAYA',
    voiceMatchKeywords: ['karen', 'catherine', 'natasha', 'au', 'australia', 'female'],
  },
  {
    id: 'en_in_priya_fluent',
    name: 'Priya — Fluent Global Tech (IN Female)',
    gender: 'Female',
    accent: 'Indian English',
    countryCode: 'IN',
    tone: 'Confident, Precise & Fast-Paced',
    description: 'Fluent Indian English female voice tailored for competitive algorithms and coding walkthroughs.',
    recommendedRole: 'Algorithms & Data Structures',
    samplePhrase: 'Let us optimize your solution to achieve linear time complexity without extra space overhead.',
    bestPairedModel: 'PRIYA',
    voiceMatchKeywords: ['heera', 'neerja', 'priya', 'in', 'india', 'female'],
  },
  {
    id: 'en_gb_hazel_formal',
    name: 'Hazel — Formal RP British (UK Female)',
    gender: 'Female',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Formal, Thoughtful & Precise',
    description: 'Classic British cadence tailored for structured academic and rubric-based evaluations.',
    recommendedRole: 'Formal Assessment & Rubric Feedback',
    samplePhrase: 'Let us analyze your concurrency design and evaluate how your system prevents deadlock conditions.',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['hazel', 'libby', 'sonia', 'gb', 'female'],
  },
  {
    id: 'en_us_emily_coach',
    name: 'Emily — Empathetic STAR Coach (US Female)',
    gender: 'Female',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Warm, Encouraging & Mentoring',
    description: 'Supportive coaching voice calibrated for behavioral feedback and candidate confidence building.',
    recommendedRole: 'Behavioral Mentoring & STAR Scoring',
    samplePhrase: 'You did a great job explaining the team trade-offs. Now let us reflect on what you would do differently.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['samantha', 'jenny', 'zira', 'female', 'us'],
  },

  // ═══════════════════════════════════════════════════════════════
  // MALE VOICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'en_us_david_executive',
    name: 'David — Executive Engineering VP (US Male)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Authoritative, Calm & Strategic',
    description: 'Executive-level American male voice ideal for senior architecture evaluations and leadership interviews.',
    recommendedRole: 'Engineering Leadership & Strategic Architecture',
    samplePhrase: 'Welcome. I am looking forward to discussing your technical architecture and leadership approach.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['david', 'mark', 'guy', 'male', 'en-us'],
  },
  {
    id: 'en_us_ryan_technical',
    name: 'Ryan — Staff Technical Lead (US Male)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Crisp, Analytical & Direct',
    description: 'Modern technical American male voice calibrated for deep-dive coding reviews and algorithmic complexity.',
    recommendedRole: 'Full Stack & Live Coding Assessment',
    samplePhrase: 'Let us review the code structure. Can you explain your concurrency choices and edge case handling?',
    bestPairedModel: 'MAYA',
    voiceMatchKeywords: ['ryan', 'guy', 'brian', 'male', 'us'],
  },
  {
    id: 'en_gb_oliver_refined',
    name: 'Oliver — Sophisticated British (UK Male)',
    gender: 'Male',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Sophisticated, Paced & Refined',
    description: 'Polished Received Pronunciation British male voice for senior executive and rubric assessments.',
    recommendedRole: 'Executive Assessment & STAR Evaluation',
    samplePhrase: 'Could you elaborate on the architectural tradeoffs and how you led your team through deployment?',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['oliver', 'george', 'ryan', 'male', 'gb', 'uk'],
  },
  {
    id: 'en_gb_george_formal',
    name: 'George — Formal Cambridge RP (UK Male)',
    gender: 'Male',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Formal, Academic & Clear',
    description: 'Distinguished British male voice tailored for rigorous technical deep dives and rubric evaluations.',
    recommendedRole: 'Formal Assessment & Concurrency Review',
    samplePhrase: 'Let us examine how your distributed cache handles network partitions and cache stampedes.',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['george', 'oliver', 'male', 'gb'],
  },
  {
    id: 'en_au_liam_articulate',
    name: 'Liam — Articulate Australian (AU Male)',
    gender: 'Male',
    accent: 'Australian English',
    countryCode: 'AU',
    tone: 'Engaging, Modern & Articulate',
    description: 'Natural Australian English male voice designed for global engineering and cloud systems interviews.',
    recommendedRole: 'Cloud Infrastructure & Global Engineering',
    samplePhrase: 'G\'day. Today we will assess your multi-region failover and Kubernetes orchestration design.',
    bestPairedModel: 'MAYA',
    voiceMatchKeywords: ['liam', 'james', 'male', 'au', 'australia'],
  },
  {
    id: 'en_in_rohan_tech',
    name: 'Rohan — Fluent Global Algorithms (IN Male)',
    gender: 'Male',
    accent: 'Indian English',
    countryCode: 'IN',
    tone: 'Confident, Fast-Paced & Technical',
    description: 'Fluent Indian English male voice tailored for competitive programming and distributed systems.',
    recommendedRole: 'Data Structures & Algorithmic Design',
    samplePhrase: 'Let us optimize your algorithm to achieve logarithmic time complexity with constant auxiliary memory.',
    bestPairedModel: 'PRIYA',
    voiceMatchKeywords: ['rohan', 'ravi', 'male', 'in', 'india'],
  },
  {
    id: 'en_us_guy_natural',
    name: 'Guy — Natural Conversational (US Male)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Approachable, Conversational & Warm',
    description: 'Natural, warm American male delivery suitable for behavioral screens and cultural calibration.',
    recommendedRole: 'Behavioral Screen & Culture Fit',
    samplePhrase: 'Thanks for taking the time to meet today. Tell me about a technical project you are proud of.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['guy', 'natural', 'david', 'male', 'us'],
  },
  {
    id: 'en_us_james_mentor',
    name: 'James — Senior Systems Mentor (US Male)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Thoughtful, Insightful & Constructive',
    description: 'Experienced mentor delivery designed for comprehensive interview feedback and scoring walkthroughs.',
    recommendedRole: 'Comprehensive Rubric Feedback & Mentorship',
    samplePhrase: 'Your approach to distributed transactions demonstrates solid architectural maturity.',
    bestPairedModel: 'PRIYA',
    voiceMatchKeywords: ['james', 'john', 'paul', 'male', 'us'],
  },
];

export const PLATFORM_KOKORO_VOICES = PLATFORM_VOICES;

const STORAGE_KEY_MODEL = 'rennetus_platform_model';
const STORAGE_KEY_VOICE = 'rennetus_platform_voice';
const CONFIG_CHANGE_EVENT = 'rennetus_platform_config_changed';

/** Get globally configured active platform 3D avatar model */
export function getPlatformModel(): AvatarModelId {
  if (typeof window === 'undefined') return 'AVA';
  const stored = localStorage.getItem(STORAGE_KEY_MODEL) || localStorage.getItem('ruready_platform_model');
  if (
    stored &&
    PLATFORM_AVATAR_MODELS.some((m) => m.id === stored)
  ) {
    return stored as AvatarModelId;
  }
  return 'AVA';
}

/** Get the asset URL for a given avatar model ID */
export function getModelAssetPath(modelId: AvatarModelId): string {
  const meta = PLATFORM_AVATAR_MODELS.find(m => m.id === modelId);
  return meta ? meta.modelAssetPath : '/models/interviewer_ava.glb';
}

/** Get globally configured active platform female voice */
export function getPlatformVoice(): PlatformVoiceId {
  if (typeof window === 'undefined') return 'en_us_ava_warm';
  const stored = localStorage.getItem(STORAGE_KEY_VOICE) || localStorage.getItem('ruready_platform_voice');
  if (
    stored &&
    PLATFORM_VOICES.some((v) => v.id === stored)
  ) {
    return stored as PlatformVoiceId;
  }
  return 'en_us_ava_warm';
}

/** Set globally configured active platform 3D avatar model & voice */
export function setPlatformConfig(modelId: AvatarModelId, voiceId: PlatformVoiceId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODEL, modelId);
  localStorage.setItem(STORAGE_KEY_VOICE, voiceId);
  localStorage.setItem('ruready_platform_model', modelId);
  localStorage.setItem('ruready_platform_voice', voiceId);

  window.dispatchEvent(
    new CustomEvent(CONFIG_CHANGE_EVENT, {
      detail: { model: modelId, voice: voiceId },
    })
  );
}

/** Subscribe to platform model/voice configuration changes */
export function subscribeToPlatformConfig(callback: (config: { model: AvatarModelId; voice: PlatformVoiceId }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ model: AvatarModelId; voice: PlatformVoiceId }>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback({ model: getPlatformModel(), voice: getPlatformVoice() });
    }
  };

  window.addEventListener(CONFIG_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(CONFIG_CHANGE_EVENT, handler);
  };
}
