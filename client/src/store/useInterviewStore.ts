import { create } from 'zustand';

export type InterviewCategory = 'INTERNSHIP' | 'JOB' | 'PROMOTION' | 'PRACTICE' | 'CODING' | 'HR' | 'LEADERSHIP';
export type ExperienceLevel = 'FRESHER' | 'MID' | 'SENIOR';

export interface SetupFormData {
  category: InterviewCategory | null;
  targetRole: string;
  targetCompany: string;
  industry: string;
  experienceLevel: ExperienceLevel | null;
  focusDomains: string[];
  durationMinutes: number;
  resumeFile: File | null;
  resumeId?: string | null; // For backend persistence integration
  resumeFileName?: string | null;
}

interface InterviewState {
  currentStep: number;
  formData: SetupFormData;
  updateField: <K extends keyof SetupFormData>(field: K, value: SetupFormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  
  // Anti-Cheat & Hardware Diagnostics State
  cameraStatus: 'PENDING' | 'ALLOWED' | 'BLOCKED';
  micStatus: 'PENDING' | 'ALLOWED' | 'BLOCKED';
  antiCheatStatus: 'PENDING' | 'SECURED' | 'FAILED';
  isFullscreenActive: boolean;
  
  setCameraStatus: (status: 'PENDING' | 'ALLOWED' | 'BLOCKED') => void;
  setMicStatus: (status: 'PENDING' | 'ALLOWED' | 'BLOCKED') => void;
  setAntiCheatStatus: (status: 'PENDING' | 'SECURED' | 'FAILED') => void;
  setIsFullscreenActive: (active: boolean) => void;
}

const initialFormData: SetupFormData = {
  category: null,
  targetRole: '',
  targetCompany: '',
  industry: '',
  experienceLevel: null,
  focusDomains: [],
  durationMinutes: 20,
  resumeFile: null,
  resumeId: null,
  resumeFileName: null,
};

export const useInterviewStore = create<InterviewState>((set) => ({
  currentStep: 1,
  formData: initialFormData,

  updateField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
    }),

  // Anti-Cheat & Hardware Status
  cameraStatus: 'PENDING',
  micStatus: 'PENDING',
  antiCheatStatus: 'PENDING',
  isFullscreenActive: false,

  setCameraStatus: (status) => set({ cameraStatus: status }),
  setMicStatus: (status) => set({ micStatus: status }),
  setAntiCheatStatus: (status) => set({ antiCheatStatus: status }),
  setIsFullscreenActive: (active) => set({ isFullscreenActive: active }),
}));
