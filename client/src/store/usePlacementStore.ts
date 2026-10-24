import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ApplicationStage = 
  | 'APPLIED' 
  | 'SHORTLISTED' 
  | 'OA' 
  | 'TECHNICAL_1' 
  | 'TECHNICAL_2' 
  | 'MANAGERIAL' 
  | 'HR' 
  | 'OFFERED' 
  | 'REJECTED';

export type RiskLevel = 'CRITICAL' | 'AT_RISK' | 'ON_TRACK';

export type DriveType = 'CAMPUS' | 'OFF_CAMPUS' | 'REFERRAL';

export interface PrepTask {
  id: string;
  applicationId: string;
  title: string;
  category: 'DSA' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'CS_FUNDAMENTALS' | 'COMPANY_RESEARCH' | 'APTITUDE';
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface ApplicationNote {
  id: string;
  date: string;
  stage: ApplicationStage;
  content: string;
  questionsAsked?: string[];
  type: 'NOTE' | 'INTERVIEW_LOG' | 'OA_LOG' | 'FEEDBACK';
}

export interface JobApplication {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  ctc: string;
  location: string;
  driveType: DriveType;
  stage: ApplicationStage;
  appliedDate: string;
  nextDeadlineDate?: string;
  nextDeadlineTitle?: string;
  timeTag?: string; // e.g., "18 hours left", "Tomorrow", "2 days left"
  riskLevel: RiskLevel;
  riskFactors: string[];
  prepScore: number; // 0 - 100
  resumeId?: string;
  resumeTitle?: string;
  jobDescription?: string;
  matchedSkills: string[];
  missingSkills: string[];
  prepTasks: PrepTask[];
  notes: ApplicationNote[];
  rejectionReason?: string;
  rejectionStage?: ApplicationStage;
  rejectionWeakTopics?: string[];
  contactEmail?: string;
  applicationUrl?: string;
}

interface PlacementStoreState {
  applications: JobApplication[];
  selectedApplicationId: string | null;
  activeView: 'KANBAN' | 'TABLE' | 'CALENDAR' | 'ANALYTICS' | 'INTELLIGENCE';
  searchQuery: string;
  filterStage: string;
  filterRisk: string;

  // Actions
  setActiveView: (view: 'KANBAN' | 'TABLE' | 'CALENDAR' | 'ANALYTICS' | 'INTELLIGENCE') => void;
  setSelectedApplicationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStage: (stage: string) => void;
  setFilterRisk: (risk: string) => void;
  
  addApplication: (app: Omit<JobApplication, 'id' | 'appliedDate' | 'prepScore' | 'prepTasks' | 'notes' | 'matchedSkills' | 'missingSkills' | 'riskLevel' | 'riskFactors'> & {
    riskLevel?: RiskLevel;
    riskFactors?: string[];
    matchedSkills?: string[];
    missingSkills?: string[];
  }) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  moveStage: (id: string, newStage: ApplicationStage) => void;
  togglePrepTask: (appId: string, taskId: string) => void;
  addNote: (appId: string, note: Omit<ApplicationNote, 'id' | 'date'>) => void;
  diagnoseRejection: (appId: string, rejectionStage: ApplicationStage, reason: string, weakTopics: string[]) => void;
  analyzeJdAndGeneratePlan: (appId: string, jdText: string) => { matched: string[]; missing: string[]; tasks: PrepTask[] };
  getUrgentAction: () => { app: JobApplication; taskSummary: string; tasks: PrepTask[]; hoursLeft: number } | null;
}

const INITIAL_SEED_APPLICATIONS: JobApplication[] = [];

export const usePlacementStore = create<PlacementStoreState>()(
  persist(
    (set, get) => ({
      applications: INITIAL_SEED_APPLICATIONS,
      selectedApplicationId: null,
      activeView: 'KANBAN',
      searchQuery: '',
      filterStage: 'ALL',
      filterRisk: 'ALL',

      setActiveView: (view) => set({ activeView: view }),
      setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStage: (stage) => set({ filterStage: stage }),
      setFilterRisk: (risk) => set({ filterRisk: risk }),

      addApplication: (appData) => {
        const newId = `app-${Date.now()}`;
        const newApp: JobApplication = {
          ...appData,
          id: newId,
          appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          riskLevel: appData.riskLevel || 'ON_TRACK',
          riskFactors: appData.riskFactors || [],
          prepScore: 70,
          matchedSkills: appData.matchedSkills || ['Problem Solving', 'Data Structures'],
          missingSkills: appData.missingSkills || [],
          prepTasks: [
            { id: `t-${Date.now()}-1`, applicationId: newId, title: `Company Research for ${appData.company}`, category: 'COMPANY_RESEARCH', estimatedMinutes: 20, isCompleted: false },
            { id: `t-${Date.now()}-2`, applicationId: newId, title: 'Review Resume & Project Highlights', category: 'BEHAVIORAL', estimatedMinutes: 25, isCompleted: false },
          ],
          notes: []
        };

        set((state) => ({
          applications: [newApp, ...state.applications],
          selectedApplicationId: newId
        }));
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          )
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          selectedApplicationId: state.selectedApplicationId === id ? null : state.selectedApplicationId
        }));
      },

      moveStage: (id, newStage) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== id) return app;
            return {
              ...app,
              stage: newStage
            };
          })
        }));
      },

      togglePrepTask: (appId, taskId) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            const updatedTasks = app.prepTasks.map((t) =>
              t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
            );

            const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
            const totalCount = updatedTasks.length;
            const scoreBonus = totalCount > 0 ? Math.round((completedCount / totalCount) * 35) : 0;
            const newScore = Math.min(100, Math.max(50, 60 + scoreBonus));

            return {
              ...app,
              prepTasks: updatedTasks,
              prepScore: newScore
            };
          })
        }));
      },

      addNote: (appId, noteData) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            const newNote: ApplicationNote = {
              ...noteData,
              id: `note-${Date.now()}`,
              date: new Date().toISOString().split('T')[0]
            };
            return {
              ...app,
              notes: [newNote, ...app.notes]
            };
          })
        }));
      },

      diagnoseRejection: (appId, rejectionStage, reason, weakTopics) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              stage: 'REJECTED',
              rejectionStage,
              rejectionReason: reason,
              rejectionWeakTopics: weakTopics,
              riskLevel: 'ON_TRACK'
            };
          })
        }));
      },

      analyzeJdAndGeneratePlan: (appId, jdText) => {
        const lowerJd = jdText.toLowerCase();

        const possibleSkills = [
          'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'PostgreSQL', 'Redis',
          'Kafka', 'Docker', 'Kubernetes', 'AWS', 'System Design', 'DSA', 'OOP'
        ];

        const matched: string[] = [];
        const missing: string[] = [];

        possibleSkills.forEach((skill) => {
          if (lowerJd.includes(skill.toLowerCase())) {
            if (['Java', 'C++', 'SQL', 'DSA', 'OOP', 'React'].includes(skill)) {
              matched.push(skill);
            } else {
              missing.push(skill);
            }
          }
        });

        if (matched.length === 0) matched.push('Data Structures', 'Problem Solving', 'OOP');
        if (missing.length === 0) missing.push('System Design (LLD)', 'Distributed Systems');

        const newTasks: PrepTask[] = [
          { id: `jd-t1-${Date.now()}`, applicationId: appId, title: `Targeted practice on missing skill: ${missing[0] || 'System Design'}`, category: 'SYSTEM_DESIGN', estimatedMinutes: 45, isCompleted: false },
          { id: `jd-t2-${Date.now()}`, applicationId: appId, title: `Revise core concepts for ${matched[0] || 'DSA'}`, category: 'DSA', estimatedMinutes: 30, isCompleted: false },
          { id: `jd-t3-${Date.now()}`, applicationId: appId, title: 'Take 30-minute AI Mock Interview tailored to JD', category: 'BEHAVIORAL', estimatedMinutes: 30, isCompleted: false },
        ];

        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              jobDescription: jdText,
              matchedSkills: matched,
              missingSkills: missing,
              prepTasks: [...newTasks, ...app.prepTasks]
            };
          })
        }));

        return { matched, missing, tasks: newTasks };
      },

      getUrgentAction: () => {
        const apps = get().applications.filter((a) => a.id === 'app-google-1');
        const topApp = apps[0] || get().applications[0];
        if (!topApp) return null;

        return {
          app: topApp,
          taskSummary: 'Google Online Challenge',
          tasks: topApp.prepTasks,
          hoursLeft: 18
        };
      }
    }),
    {
      name: 'ru_ready_placement_crm_store_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
