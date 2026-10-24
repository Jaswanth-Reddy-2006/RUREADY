import { create } from 'zustand';
import {
  roadmapApi,
  type Roadmap,
  type RoadmapTemplate,
  type RoadmapWorkspaceData,
  type RoadmapInstance,
} from '../api/roadmap';

interface RoadmapState {
  roadmaps: Roadmap[];
  communityRoadmaps: Roadmap[];
  workspace: RoadmapWorkspaceData | null;
  templates: RoadmapTemplate[];
  activeRoadmap: Roadmap | null;
  activeInstance: RoadmapInstance | null;
  isLoading: boolean;
  isWorkspaceLoading: boolean;
  error: string | null;

  loadRoadmaps: () => Promise<void>;
  loadCommunity: (params?: {
    category?: string;
    difficulty?: string;
    search?: string;
    filter?: 'all' | 'verified' | 'endorsed' | 'trending';
    sortBy?: 'trending' | 'rating' | 'followers' | 'newest';
  }) => Promise<void>;
  loadWorkspace: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  selectRoadmap: (roadmap: Roadmap | null) => void;
  deleteRoadmap: (id: string) => Promise<void>;
  toggleFollow: (id: string) => Promise<void>;
  enrollInRoadmap: (id: string, targetPaceHoursPerWeek?: number) => Promise<RoadmapInstance>;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmaps: [],
  communityRoadmaps: [],
  workspace: null,
  templates: [],
  activeRoadmap: null,
  activeInstance: null,
  isLoading: false,
  isWorkspaceLoading: false,
  error: null,

  loadRoadmaps: async () => {
    set({ isLoading: true, error: null });
    try {
      const roadmaps = await roadmapApi.list();
      set({ roadmaps, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to load roadmaps.',
      });
    }
  },

  loadCommunity: async (params) => {
    try {
      const community = await roadmapApi.explore(params);
      set({ communityRoadmaps: community });
    } catch (error) {
      console.error('Failed to load community roadmaps:', error);
    }
  },

  loadWorkspace: async () => {
    set({ isWorkspaceLoading: true });
    try {
      const workspace = await roadmapApi.getWorkspace();
      set({ workspace, isWorkspaceLoading: false });
    } catch (error) {
      set({ isWorkspaceLoading: false });
      console.error('Failed to load workspace:', error);
    }
  },

  loadTemplates: async () => {
    try {
      set({ templates: await roadmapApi.getTemplates() });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to load roadmap templates.',
      });
    }
  },

  selectRoadmap: (activeRoadmap) => set({ activeRoadmap }),

  deleteRoadmap: async (id: string) => {
    try {
      await roadmapApi.delete(id);
      set({
        roadmaps: get().roadmaps.filter((r) => r.id !== id),
        activeRoadmap: get().activeRoadmap?.id === id ? null : get().activeRoadmap,
      });
    } catch (error) {
      throw error;
    }
  },

  toggleFollow: async (id: string) => {
    try {
      const result = await roadmapApi.toggleFollow(id);
      set((state) => ({
        communityRoadmaps: state.communityRoadmaps.map((r) =>
          r.id === id
            ? { ...r, isFollowing: result.following, followerCount: result.followerCount }
            : r
        ),
        activeRoadmap:
          state.activeRoadmap?.id === id
            ? {
                ...state.activeRoadmap,
                isFollowing: result.following,
                followerCount: result.followerCount,
              }
            : state.activeRoadmap,
      }));
    } catch (error) {
      console.error('Toggle follow error:', error);
    }
  },

  enrollInRoadmap: async (id: string, targetPaceHoursPerWeek = 6) => {
    const instance = await roadmapApi.createInstance(id, targetPaceHoursPerWeek);
    await get().loadWorkspace();
    return instance;
  },
}));
