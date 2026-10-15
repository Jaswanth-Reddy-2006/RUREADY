import { create } from 'zustand';
import { roadmapApi, type Roadmap, type RoadmapTemplate } from '../api/roadmap';

interface RoadmapState {
  roadmaps: Roadmap[];
  templates: RoadmapTemplate[];
  activeRoadmap: Roadmap | null;
  isLoading: boolean;
  error: string | null;
  loadRoadmaps: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  selectRoadmap: (roadmap: Roadmap | null) => void;
  deleteRoadmap: (id: string) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  roadmaps: [],
  templates: [],
  activeRoadmap: null,
  isLoading: false,
  error: null,
  loadRoadmaps: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ roadmaps: await roadmapApi.list(), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to load roadmaps.' });
    }
  },
  loadTemplates: async () => {
    try {
      set({ templates: await roadmapApi.getTemplates() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unable to load roadmap templates.' });
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
}));

