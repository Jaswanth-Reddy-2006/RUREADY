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

const INITIAL_SEED_APPLICATIONS: JobApplication[] = [
  // 1. Applied Column
  {
    id: 'app-google-1',
    company: 'Google',
    companyLogo: 'https://www.google.com/favicon.ico',
    role: 'Software Engineer Intern',
    ctc: '₹80K/month',
    location: 'Hyderabad',
    driveType: 'CAMPUS',
    stage: 'APPLIED',
    appliedDate: 'Sep 12, 2026',
    nextDeadlineDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Coding & Debugging',
    timeTag: '18 hours left',
    riskLevel: 'AT_RISK',
    riskFactors: ['OA in 18 hours', 'Graph prep task incomplete'],
    prepScore: 78,
    resumeTitle: 'SWE_Resume_v4.pdf',
    matchedSkills: ['C++', 'Data Structures', 'Algorithms'],
    missingSkills: ['Advanced Graph Theory'],
    prepTasks: [
      { id: 't1', applicationId: 'app-google-1', title: 'Solve 2 Medium Graph/BFS problems', category: 'DSA', estimatedMinutes: 45, isCompleted: true },
      { id: 't2', applicationId: 'app-google-1', title: 'Complete 30-min AI Coding Sandbox Drill', category: 'DSA', estimatedMinutes: 30, isCompleted: true },
      { id: 't3', applicationId: 'app-google-1', title: 'Review Google past interview questions', category: 'COMPANY_RESEARCH', estimatedMinutes: 30, isCompleted: true },
      { id: 't4', applicationId: 'app-google-1', title: 'Read company-specific tips', category: 'COMPANY_RESEARCH', estimatedMinutes: 15, isCompleted: true },
    ],
    notes: []
  },
  {
    id: 'app-msft-2',
    company: 'Microsoft',
    companyLogo: 'https://www.microsoft.com/favicon.ico',
    role: 'SDE-1',
    ctc: '₹51.0 LPA',
    location: 'Bengaluru',
    driveType: 'CAMPUS',
    stage: 'APPLIED',
    appliedDate: 'Sep 14, 2026',
    nextDeadlineDate: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Data Structures & OOP',
    timeTag: 'Tomorrow',
    riskLevel: 'CRITICAL',
    riskFactors: ['Technical Interview tomorrow'],
    prepScore: 65,
    resumeTitle: 'SWE_Resume_Microsoft.pdf',
    matchedSkills: ['Java', 'OOP', 'SQL'],
    missingSkills: ['LLD Design'],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-zoho-3',
    company: 'Zoho',
    role: 'Full Stack Developer',
    ctc: '₹18 LPA',
    location: 'Remote',
    driveType: 'OFF_CAMPUS',
    stage: 'APPLIED',
    appliedDate: 'Sep 15, 2026',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 82,
    resumeTitle: 'Fullstack_Resume.pdf',
    matchedSkills: ['React', 'Node.js'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },

  // 2. OA Stage Column
  {
    id: 'app-tcs-4',
    company: 'TCS Digital',
    role: 'Systems Engineer',
    ctc: '₹9.0 LPA',
    location: 'Remote',
    driveType: 'CAMPUS',
    stage: 'OA',
    appliedDate: 'Sep 18, 2026',
    nextDeadlineDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Aptitude & Coding',
    timeTag: '2 days left',
    riskLevel: 'AT_RISK',
    riskFactors: ['Aptitude speed drill pending'],
    prepScore: 74,
    matchedSkills: ['Python', 'SQL', 'Aptitude'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-accenture-5',
    company: 'Accenture',
    role: 'Application Developer',
    ctc: '₹7.5 LPA',
    location: 'Bengaluru',
    driveType: 'CAMPUS',
    stage: 'OA',
    appliedDate: 'Sep 19, 2026',
    nextDeadlineDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Cognitive & Technical Assessment',
    timeTag: '3 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 85,
    matchedSkills: ['Java', 'SQL', 'Pseudocode'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-cognizant-6',
    company: 'Cognizant',
    role: 'Programmer Analyst',
    ctc: '₹6.75 LPA',
    location: 'Chennai',
    driveType: 'CAMPUS',
    stage: 'OA',
    appliedDate: 'Sep 21, 2026',
    nextDeadlineDate: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'GenC Next Coding Test',
    timeTag: '5 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 80,
    matchedSkills: ['C++', 'DBMS'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },

  // 3. Technical Interview Column
  {
    id: 'app-amazon-7',
    company: 'Amazon',
    companyLogo: 'https://www.amazon.com/favicon.ico',
    role: 'SDE Intern',
    ctc: '₹11L/month',
    location: 'Hyderabad',
    driveType: 'CAMPUS',
    stage: 'TECHNICAL_1',
    appliedDate: 'Sep 19, 2026',
    nextDeadlineDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Technical Round 1',
    timeTag: 'Tomorrow',
    riskLevel: 'CRITICAL',
    riskFactors: ['Interview in 24 hours'],
    prepScore: 88,
    matchedSkills: ['Java', 'Trees', 'Leadership Principles'],
    missingSkills: ['DynamoDB'],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-deloitte-8',
    company: 'Deloitte',
    role: 'Analyst',
    ctc: '₹7.6 LPA',
    location: 'Hyderabad',
    driveType: 'CAMPUS',
    stage: 'TECHNICAL_1',
    appliedDate: 'Sep 20, 2026',
    nextDeadlineDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Consulting Tech Interview',
    timeTag: '2 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 82,
    matchedSkills: ['SQL', 'Python'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-infosys-9',
    company: 'Infosys',
    role: 'Systems Engineer',
    ctc: '₹6.5 LPA',
    location: 'Pune',
    driveType: 'CAMPUS',
    stage: 'TECHNICAL_1',
    appliedDate: 'Sep 22, 2026',
    nextDeadlineDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'DSE Tech Interview',
    timeTag: '4 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 79,
    matchedSkills: ['Java', 'DBMS'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },

  // 4. HR Round Column
  {
    id: 'app-adobe-10',
    company: 'Adobe',
    role: 'Software Engineer',
    ctc: '₹10 LPA',
    location: 'Noida',
    driveType: 'CAMPUS',
    stage: 'HR',
    appliedDate: 'Sep 21, 2026',
    nextDeadlineDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'Behavioral & HR Round',
    timeTag: '3 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 90,
    matchedSkills: ['Behavioral', 'C++'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-wipro-11',
    company: 'Wipro',
    role: 'Project Engineer',
    ctc: '₹6.2 LPA',
    location: 'Bengaluru',
    driveType: 'CAMPUS',
    stage: 'HR',
    appliedDate: 'Sep 24, 2026',
    nextDeadlineDate: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(),
    nextDeadlineTitle: 'HR Discussion',
    timeTag: '5 days left',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 86,
    matchedSkills: ['Communication', 'Java'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },

  // 5. Offers Column
  {
    id: 'app-capgemini-12',
    company: 'Capgemini',
    role: 'Software Engineer',
    ctc: '₹8.5 LPA',
    location: 'Hyderabad',
    driveType: 'CAMPUS',
    stage: 'OFFERED',
    appliedDate: 'Sep 10, 2026',
    timeTag: 'Offer',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 98,
    matchedSkills: ['Java', 'SQL', 'C++'],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },

  // 6. Rejected Column
  {
    id: 'app-ibm-13',
    company: 'IBM',
    role: 'SDE Intern',
    ctc: '₹40K/month',
    location: 'Bengaluru',
    driveType: 'OFF_CAMPUS',
    stage: 'REJECTED',
    appliedDate: 'Aug 28, 2026',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 55,
    matchedSkills: [],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-hcl-14',
    company: 'HCL',
    role: 'Software Engineer',
    ctc: '₹5.5 LPA',
    location: 'Noida',
    driveType: 'CAMPUS',
    stage: 'REJECTED',
    appliedDate: 'Aug 20, 2026',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 50,
    matchedSkills: [],
    missingSkills: [],
    prepTasks: [],
    notes: []
  },
  {
    id: 'app-lnt-15',
    company: 'L&T',
    role: 'Graduate Engineer Trainee',
    ctc: '₹6.0 LPA',
    location: 'Mumbai',
    driveType: 'CAMPUS',
    stage: 'REJECTED',
    appliedDate: 'Aug 15, 2026',
    riskLevel: 'ON_TRACK',
    riskFactors: [],
    prepScore: 48,
    matchedSkills: [],
    missingSkills: [],
    prepTasks: [],
    notes: []
  }
];

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
          appliedDate: 'Sep 18, 2026',
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
