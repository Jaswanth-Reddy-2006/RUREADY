// ═══════════════════════════════════════════════════════════════
// Rennetus — Global Platform AI Model & Neural Voice Configuration
// Authoritative single source of truth for 3D Avatars and Hugging Face Neural Dataset Voices
// ═══════════════════════════════════════════════════════════════

export type AvatarModelId = 'AVA' | 'ELENA' | 'MAYA' | 'PRIYA';

export type PlatformVoiceId =
  // ─── Hugging Face Neural Female Voices ───
  | 'hf_ava_neural'
  | 'hf_elena_neural'
  | 'hf_maya_neural'
  | 'hf_priya_neural'
  // ─── Hugging Face Neural Male Voices ───
  | 'hf_david_neural'
  | 'hf_ryan_neural'
  | 'hf_oliver_neural'
  | 'hf_rohan_neural';

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
  datasetSource: string;
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
    recommendedVoice: 'hf_ava_neural',
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
    recommendedVoice: 'hf_elena_neural',
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
    recommendedVoice: 'hf_maya_neural',
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
    recommendedVoice: 'hf_priya_neural',
    specialization: ['SRE & Observability', 'Multi-Region High Availability', 'CI/CD Pipelines & DevOps', 'Security & Compliance'],
    avatarThumbnail: '/images/avatars/avatar_priya.png',
    modelAssetPath: '/models/interviewer_priya.glb',
    tone: 'Confident, precise, and fast-paced',
    suitColorHex: 0x38121f, // Royal Burgundy Blazer
  },
];

// ─── Curated High-Fidelity Hugging Face & Neural Dataset Voices ───
export const PLATFORM_VOICES: PlatformVoiceMetadata[] = [
  // ═══════════════════════════════════════════════════════════════
  // FEMALE NEURAL VOICES (Hugging Face / Neural Dataset Standards)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'hf_ava_neural',
    name: 'Ava Neural (Hugging Face / Kokoro-82M)',
    gender: 'Female',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Warm, Natural & Empathetic',
    description: 'Gold-standard conversational American English neural voice trained on high-clarity technical dialogue datasets.',
    recommendedRole: 'Technical Recruiter & General Mock Interviews',
    samplePhrase: 'Hello! I am ready to guide you through your technical mock interview today. Let us begin with your background.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['natural', 'jenny', 'aria', 'samantha', 'zira', 'female', 'us', 'en-us'],
    datasetSource: 'Hugging Face Kokoro-82M Studio',
  },
  {
    id: 'hf_elena_neural',
    name: 'Elena Neural (Hugging Face / Piper British HQ)',
    gender: 'Female',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Executive, Refined & Strategic',
    description: 'Sophisticated British English neural voice calibrated for senior engineering leadership and architectural trade-offs.',
    recommendedRole: 'Executive Assessment & Behavioral STAR Evaluation',
    samplePhrase: 'Could you describe a challenging technical initiative you led and the measurable outcomes achieved?',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['sonia', 'libby', 'hazel', 'victoria', 'female', 'gb', 'uk', 'en-gb'],
    datasetSource: 'Hugging Face Piper HQ Studio',
  },
  {
    id: 'hf_maya_neural',
    name: 'Maya Neural (Hugging Face / StyleTTS2 Studio)',
    gender: 'Female',
    accent: 'Australian English',
    countryCode: 'AU',
    tone: 'Articulate, Clear & Engaging',
    description: 'Crystal-clear Australian English neural voice trained for deep dive system explanations and live coding review.',
    recommendedRole: 'Full Stack & Global Engineering',
    samplePhrase: 'Welcome. Today we will walk through database partitioning and distributed cache invalidation strategies.',
    bestPairedModel: 'MAYA',
    voiceMatchKeywords: ['karen', 'catherine', 'natasha', 'au', 'australia', 'female', 'en-au'],
    datasetSource: 'Hugging Face StyleTTS2 Neural',
  },
  {
    id: 'hf_priya_neural',
    name: 'Priya Neural (Hugging Face / Indic-TTS Pro)',
    gender: 'Female',
    accent: 'Indian English',
    countryCode: 'IN',
    tone: 'Confident, Precise & Fast-Paced',
    description: 'Fluent Indian English neural voice optimized for algorithms, data structure explanations, and competitive problem solving.',
    recommendedRole: 'Algorithms & Cloud Infrastructure',
    samplePhrase: 'Let us optimize your solution to achieve linear time complexity without extra space overhead.',
    bestPairedModel: 'PRIYA',
    voiceMatchKeywords: ['heera', 'neerja', 'priya', 'in', 'india', 'female', 'en-in'],
    datasetSource: 'Hugging Face Indic-TTS Studio',
  },

  // ═══════════════════════════════════════════════════════════════
  // MALE NEURAL VOICES (Hugging Face / Neural Dataset Standards)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'hf_david_neural',
    name: 'David Neural (Hugging Face / Kokoro-82M Executive)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Authoritative, Calm & Strategic',
    description: 'Executive-level American male neural voice ideal for senior architecture evaluations and staff engineer tracks.',
    recommendedRole: 'Engineering Leadership & Strategic Architecture',
    samplePhrase: 'Welcome. I am looking forward to discussing your technical architecture and leadership approach.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['david', 'guy', 'mark', 'male', 'us', 'en-us'],
    datasetSource: 'Hugging Face Kokoro-82M Male Studio',
  },
  {
    id: 'hf_ryan_neural',
    name: 'Ryan Neural (Hugging Face / Piper US HQ)',
    gender: 'Male',
    accent: 'US English',
    countryCode: 'US',
    tone: 'Crisp, Technical & Direct',
    description: 'High-energy American male neural voice designed for rapid-fire technical questions and live coding walkthroughs.',
    recommendedRole: 'Live Coding & Backend Systems',
    samplePhrase: 'Let us look at your code structure. Walk me through your time and space complexity considerations.',
    bestPairedModel: 'AVA',
    voiceMatchKeywords: ['guy', 'alex', 'ryan', 'male', 'us', 'en-us'],
    datasetSource: 'Hugging Face Piper US Male',
  },
  {
    id: 'hf_oliver_neural',
    name: 'Oliver Neural (Hugging Face / VITS Refined)',
    gender: 'Male',
    accent: 'British English',
    countryCode: 'GB',
    tone: 'Sophisticated, Academic & Thorough',
    description: 'Polished British male neural voice tailored for deep technical discussions and systemic trade-off analysis.',
    recommendedRole: 'System Design & Distributed Systems',
    samplePhrase: 'How does your architecture handle high-concurrency write bottlenecks under network partition scenarios?',
    bestPairedModel: 'ELENA',
    voiceMatchKeywords: ['oliver', 'george', 'richard', 'male', 'gb', 'uk', 'en-gb'],
    datasetSource: 'Hugging Face VITS British HQ',
  },
  {
    id: 'hf_rohan_neural',
    name: 'Rohan Neural (Hugging Face / Indic-TTS Pro)',
    gender: 'Male',
    accent: 'Indian English',
    countryCode: 'IN',
    tone: 'Energetic, Precise & Analytical',
    description: 'Fluent Indian English male neural voice with dynamic pacing for algorithmic depth and database optimization.',
    recommendedRole: 'Data Structures & Cloud Reliability',
    samplePhrase: 'Notice how your indexing strategy impacts disk I/O. Let us explore an asynchronous write pipeline.',
    bestPairedModel: 'PRIYA',
    voiceMatchKeywords: ['rohan', 'ravi', 'male', 'in', 'india', 'en-in'],
    datasetSource: 'Hugging Face Indic-TTS Male Studio',
  },
];

// Helper accessors
export function getPlatformVoice(): PlatformVoiceId {
  try {
    const saved = localStorage.getItem('rennetus_platform_voice');
    if (saved && PLATFORM_VOICES.some((v) => v.id === saved)) {
      return saved as PlatformVoiceId;
    }
  } catch {}
  return 'hf_ava_neural';
}

export function setPlatformVoice(voiceId: PlatformVoiceId): void {
  try {
    localStorage.setItem('rennetus_platform_voice', voiceId);
    window.dispatchEvent(new CustomEvent('rennetus_platform_config_changed', {
      detail: { model: getPlatformAvatarModel(), voice: voiceId }
    }));
  } catch {}
}

export function getPlatformAvatarModel(): AvatarModelId {
  try {
    const saved = localStorage.getItem('rennetus_platform_avatar');
    if (saved && PLATFORM_AVATAR_MODELS.some((m) => m.id === saved)) {
      return saved as AvatarModelId;
    }
  } catch {}
  return 'AVA';
}

export const getPlatformModel = getPlatformAvatarModel;

export function setPlatformAvatarModel(modelId: AvatarModelId): void {
  try {
    localStorage.setItem('rennetus_platform_avatar', modelId);
    window.dispatchEvent(new CustomEvent('rennetus_platform_config_changed', {
      detail: { model: modelId, voice: getPlatformVoice() }
    }));
  } catch {}
}

export function setPlatformConfig(modelId: AvatarModelId, voiceId: PlatformVoiceId): void {
  try {
    localStorage.setItem('rennetus_platform_avatar', modelId);
    localStorage.setItem('rennetus_platform_voice', voiceId);
    window.dispatchEvent(new CustomEvent('rennetus_platform_config_changed', {
      detail: { model: modelId, voice: voiceId }
    }));
  } catch {}
}

export function getModelAssetPath(persona: AvatarModelId = 'AVA'): string {
  const meta = PLATFORM_AVATAR_MODELS.find((m) => m.id === persona);
  return meta?.modelAssetPath || '/models/interviewer_ava.glb';
}

export function subscribeToPlatformConfig(callback: (config: { model: AvatarModelId; voice: PlatformVoiceId }) => void): () => void {
  const handler = (e: any) => {
    callback(e.detail || { model: getPlatformAvatarModel(), voice: getPlatformVoice() });
  };
  window.addEventListener('rennetus_platform_config_changed', handler);
  return () => window.removeEventListener('rennetus_platform_config_changed', handler);
}
