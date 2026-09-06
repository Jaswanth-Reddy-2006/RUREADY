import { create } from 'zustand';

export interface CodingSetupState {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  problemCount: number; // 1 to 3
  durationMins: number; // 30 to 90
  selectedTopics: string[]; // Arrays, Strings, Trees, Dynamic Programming, Graphs, etc.
  isSubmitting: boolean;

  setDifficulty: (difficulty: 'EASY' | 'MEDIUM' | 'HARD') => void;
  setProblemCount: (count: number) => void;
  setDurationMins: (mins: number) => void;
  toggleTopic: (topic: string) => void;
  setSubmitting: (submitting: boolean) => void;
  resetStore: () => void;
}

const initialStates = {
  difficulty: 'MEDIUM' as const,
  problemCount: 1,
  durationMins: 45,
  selectedTopics: [] as string[],
  isSubmitting: false,
};

export const useCodingInterviewStore = create<CodingSetupState>((set) => ({
  ...initialStates,

  setDifficulty: (difficulty) => set({ difficulty }),
  setProblemCount: (problemCount) => set({ problemCount }),
  setDurationMins: (durationMins) => set({ durationMins }),
  toggleTopic: (topic) =>
    set((state) => ({
      selectedTopics: state.selectedTopics.includes(topic)
        ? state.selectedTopics.filter((t) => t !== topic)
        : [...state.selectedTopics, topic],
    })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetStore: () => set(initialStates),
}));
