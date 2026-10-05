import { create } from 'zustand';
import apiClient from '../api/client';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
}

const DEFAULT_FEATURE_FLAGS: Record<string, FeatureFlag> = {
  video_interview: {
    id: 'video_interview',
    name: 'Video Interview',
    description: 'AI Video Mock Interviews with 3D avatar & speech recognition',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  coding_interview: {
    id: 'coding_interview',
    name: 'Coding Interview',
    description: 'Live Monaco coding sandbox with automated test execution',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  system_design_interview: {
    id: 'system_design_interview',
    name: 'System Design Interview',
    description: 'Interactive architecture whiteboard with AI Staff Interviewer',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  company_wise_interview: {
    id: 'company_wise_interview',
    name: 'Company-wise Tracks',
    description: 'Targeted Google, Amazon, Microsoft, and Meta interview prep',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  challenges_arena: {
    id: 'challenges_arena',
    name: 'Challenges Arena',
    description: 'Daily competitive coding challenges and global leaderboard',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  ai_resume_ats: {
    id: 'ai_resume_ats',
    name: 'AI Resume & ATS',
    description: 'Automated resume parser, keyword scoring, and ATS checker',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
  placement_crm: {
    id: 'placement_crm',
    name: 'Placement CRM',
    description: 'Job application pipeline, company offers, and interview tracking',
    enabled: true,
    updatedAt: new Date().toISOString(),
  },
};

interface FeatureFlagsState {
  features: Record<string, FeatureFlag>;
  isLoading: boolean;
  error: string | null;
  fetchFeatures: () => Promise<void>;
  updateFeature: (key: string, updates: Partial<FeatureFlag>) => Promise<void>;
  isFeatureEnabled: (key: string) => boolean;
}

const STORAGE_KEY = 'rennetus_feature_flags';
const CHANNEL_NAME = 'ruready_feature_flags_channel';

// Cross-tab broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported:', e);
  }
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
  features: (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_FEATURE_FLAGS;
  })(),
  isLoading: false,
  error: null,

  fetchFeatures: async () => {
    try {
      const res = await apiClient.get('/admin/features');
      if (res.data?.features) {
        const merged = { ...DEFAULT_FEATURE_FLAGS, ...res.data.features };
        set({ features: merged, isLoading: false });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {}
      }
    } catch {
      // Keep local state
    }
  },

  updateFeature: async (key: string, updates: Partial<FeatureFlag>) => {
    const current = get().features;
    const target = current[key] || DEFAULT_FEATURE_FLAGS[key];
    if (!target) return;

    const updated: FeatureFlag = {
      ...target,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const newFeatures = { ...current, [key]: updated };
    
    // 1. Immediately update Zustand state for instant reactive UI update
    set({ features: newFeatures });

    // 2. Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFeatures));
    } catch {}

    // 3. Broadcast to all open browser tabs
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'FEATURE_FLAGS_UPDATED', features: newFeatures });
      }
    } catch {}

    // 4. Update backend
    try {
      await apiClient.patch(`/admin/features/${key}`, updates);
    } catch (e) {
      console.warn('Backend feature flag update synced locally:', e);
    }
  },

  isFeatureEnabled: (key: string) => {
    const flag = get().features[key];
    if (!flag) return true; // Default to true if flag is unrecognized
    return Boolean(flag.enabled);
  },
}));

// Initialize real-time cross-tab & storage synchronization
if (typeof window !== 'undefined') {
  // Listen to BroadcastChannel messages from other tabs
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'FEATURE_FLAGS_UPDATED' && event.data?.features) {
        useFeatureFlagsStore.setState({ features: event.data.features });
      }
    };
  }

  // Listen to window storage event
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        useFeatureFlagsStore.setState({ features: { ...DEFAULT_FEATURE_FLAGS, ...parsed } });
      } catch {}
    }
  });

  // Background sync every 4 seconds
  setInterval(() => {
    useFeatureFlagsStore.getState().fetchFeatures();
  }, 4000);
}

export function useFeatureFlags() {
  const features = useFeatureFlagsStore((state) => state.features);
  const isLoading = useFeatureFlagsStore((state) => state.isLoading);
  const fetchFeatures = useFeatureFlagsStore((state) => state.fetchFeatures);
  const updateFeature = useFeatureFlagsStore((state) => state.updateFeature);
  const isFeatureEnabled = useFeatureFlagsStore((state) => state.isFeatureEnabled);

  return {
    features,
    isLoading,
    fetchFeatures,
    updateFeature,
    isFeatureEnabled,
  };
}
