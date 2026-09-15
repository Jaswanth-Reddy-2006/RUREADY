import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FollowerUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  company: string;
  rank: string;
  streak: number;
  isFollowing: boolean;
  mutualCount?: number;
}

export interface ActivityDay {
  date: string;
  count: number;
  codingCount: number;
  oralCount: number;
  roadmapCount: number;
  scoreAvg?: number;
}

export interface CandidateBadge {
  id: string;
  title: string;
  category: 'STREAK' | 'ALGORITHM' | 'ORAL' | 'RESUME' | 'COMMUNITY';
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  description: string;
  unlockedAt?: string;
  progress?: number;
}

export interface ProfilePreferences {
  themeMode: 'light' | 'dark' | 'system';
  accentColor: 'royal' | 'cyan' | 'eggplant' | 'emerald';
  editorTheme: 'vs-dark' | 'vs-light' | 'github-dark' | 'monokai' | 'nord';
  editorFontSize: number;
  editorTabSize: number;
  keybindingMode: 'standard' | 'vim' | 'emacs';
  minimapEnabled: boolean;
  wordWrap: boolean;
  voiceModel: 'ava-uk' | 'ava-us' | 'nova-speed' | 'echo-analytical';
  voiceSpeed: number;
  gradingStrictness: 'ADVERSARIAL' | 'BALANCED' | 'COACHING';
  socraticHintsEnabled: boolean;
  eyeTrackingEnabled: boolean;
  strictProctoring: boolean;
  emailStreakReminders: boolean;
  communityDigest: boolean;
}

export interface UserProfileData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  points: number;
  twoFactorEnabled: boolean;
  headline: string;
  bio: string;
  targetRole: string;
  seniority: 'FRESHER' | 'MID' | 'SENIOR' | 'LEAD';
  targetCompany: string;
  location: string;
  education: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  avatarUrl: string;
  currentStreak: number;
  maxStreak: number;
  totalActiveDays: number;
  globalRankPercentile: number;
  privacySettings: {
    publicProfile: boolean;
    showActivity: boolean;
    showLeaderboard: boolean;
  };
  codingStats: {
    totalSolved: number;
    totalAvailable: number;
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
    acceptanceRate: number;
    beatsPercentage: number;
  };
  oralStats: {
    interviewsCompleted: number;
    avgScore: number;
    starCompliance: number;
    vocalConfidence: number;
    averagePacingWpm: number;
    eyeContactScore: number;
  };
  skills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master'; count: number }>;
  badges: CandidateBadge[];
  recentSubmissions: Array<{
    id: string;
    type: 'CODING' | 'ORAL' | 'ROADMAP' | 'ATS';
    title: string;
    timestamp: string;
    scoreOrResult: string;
    languageOrTopic: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    status: 'PASSED' | 'OPTIMAL' | 'NEEDS_WORK';
  }>;
}

const DEFAULT_FOLLOWERS: FollowerUser[] = [
  {
    id: 'usr-101',
    name: 'Sarah Chen',
    username: 'sarah_codes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Frontend Architect',
    company: 'Meta',
    rank: 'Top 1%',
    streak: 42,
    isFollowing: true,
    mutualCount: 12
  },
  {
    id: 'usr-102',
    name: 'Alex Rivera',
    username: 'alex_distributed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Backend Distributed Systems Engineer',
    company: 'Stripe',
    rank: 'Top 3%',
    streak: 28,
    isFollowing: true,
    mutualCount: 8
  },
  {
    id: 'usr-103',
    name: 'Priya Sharma',
    username: 'priya_algo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Machine Learning Engineer',
    company: 'Google',
    rank: 'Top 2%',
    streak: 19,
    isFollowing: false,
    mutualCount: 5
  },
  {
    id: 'usr-104',
    name: 'Marcus Vance',
    username: 'marcus_vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Engineering Director',
    company: 'Netflix',
    rank: 'Top 0.5%',
    streak: 64,
    isFollowing: true,
    mutualCount: 22
  },
  {
    id: 'usr-105',
    name: 'Elena Rostova',
    username: 'elena_algo_queen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Full Stack Engineer',
    company: 'Uber',
    rank: 'Top 4%',
    streak: 14,
    isFollowing: false,
    mutualCount: 3
  }
];

const DEFAULT_FOLLOWING: FollowerUser[] = [
  {
    id: 'usr-201',
    name: 'Dan Abramov',
    username: 'dan_gaearon',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'Core Systems Developer',
    company: 'Bluesky',
    rank: 'Legend',
    streak: 120,
    isFollowing: true,
    mutualCount: 45
  },
  {
    id: 'usr-101',
    name: 'Sarah Chen',
    username: 'sarah_codes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Frontend Architect',
    company: 'Meta',
    rank: 'Top 1%',
    streak: 42,
    isFollowing: true,
    mutualCount: 12
  },
  {
    id: 'usr-102',
    name: 'Alex Rivera',
    username: 'alex_distributed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Backend Distributed Systems Engineer',
    company: 'Stripe',
    rank: 'Top 3%',
    streak: 28,
    isFollowing: true,
    mutualCount: 8
  }
];

function generateInitialActivityMap(): Record<string, ActivityDay> {
  const map: Record<string, ActivityDay> = {};
  const today = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const activeChance = isWeekend ? 0.75 : 0.60;
    
    if (Math.random() < activeChance) {
      const coding = Math.floor(Math.random() * 4);
      const oral = Math.random() > 0.6 ? 1 : 0;
      const roadmap = Math.random() > 0.7 ? 1 : 0;
      const total = coding + oral + roadmap;
      if (total > 0) {
        map[dateStr] = {
          date: dateStr,
          count: total,
          codingCount: coding,
          oralCount: oral,
          roadmapCount: roadmap,
          scoreAvg: Math.floor(75 + Math.random() * 23)
        };
      }
    }
  }

  // Ensure recent 14 days are active for streak representation
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    map[dateStr] = {
      date: dateStr,
      count: 3 + (i % 3),
      codingCount: 2 + (i % 2),
      oralCount: (i % 2),
      roadmapCount: 1,
      scoreAvg: 88 + (i % 8)
    };
  }

  return map;
}

const DEFAULT_BADGES: CandidateBadge[] = [
  {
    id: 'badge-1',
    title: '14-Day Streak Champion',
    category: 'STREAK',
    icon: 'Flame',
    tier: 'GOLD',
    description: 'Maintained uninterrupted daily technical practice for 14 consecutive days.',
    unlockedAt: '2026-09-10'
  },
  {
    id: 'badge-2',
    title: 'Socratic Defense Ace',
    category: 'ORAL',
    icon: 'Mic',
    tier: 'DIAMOND',
    description: 'Scored 90%+ in STAR structured oral reasoning across 5 consecutive sessions.',
    unlockedAt: '2026-09-08'
  },
  {
    id: 'badge-3',
    title: 'Dynamic Programming Master',
    category: 'ALGORITHM',
    icon: 'Zap',
    tier: 'GOLD',
    description: 'Solved 20+ Medium and Hard DP problems with optimal memory bounds.',
    unlockedAt: '2026-09-02'
  },
  {
    id: 'badge-4',
    title: 'ATS Resume Tier-1 Calibrated',
    category: 'RESUME',
    icon: 'Briefcase',
    tier: 'SILVER',
    description: 'Achieved an ATS score exceeding 92/100 across 3 role benchmarks.',
    unlockedAt: '2026-08-28'
  },
  {
    id: 'badge-5',
    title: 'Community Mentor',
    category: 'COMMUNITY',
    icon: 'Award',
    tier: 'BRONZE',
    description: 'Contributed 10+ verified interview questions and solution breakdowns in the Discuss hub.',
    unlockedAt: '2026-08-15'
  },
  {
    id: 'badge-6',
    title: '30-Day Relentless Habit',
    category: 'STREAK',
    icon: 'Rocket',
    tier: 'DIAMOND',
    description: 'Practice every day for 30 consecutive calendar days.',
    progress: 70
  }
];

interface ProfileStoreState {
  profile: UserProfileData;
  followers: FollowerUser[];
  following: FollowerUser[];
  activityMap: Record<string, ActivityDay>;
  preferences: ProfilePreferences;
  
  toggleFollow: (userId: string) => void;
  updateProfile: (partial: Partial<UserProfileData>) => void;
  updatePreferences: (partial: Partial<ProfilePreferences>) => void;
  recordActivity: (type: 'CODING' | 'ORAL' | 'ROADMAP' | 'ATS', title: string, score: string) => void;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Jaswanth Reddy',
        username: 'Jaswanth_Reddy_2006',
        email: 'jaswanthreddy2006@gmail.com',
        phoneNumber: '+91 98765 43210',
        points: 1250,
        twoFactorEnabled: false,
        headline: 'Aspiring Full Stack Engineer & Distributed Systems Enthusiast',
        bio: 'Passionate software engineer building high-performance systems and preparing for Tier-1 engineering roles. Practicing daily algorithmic problem solving, Socratic STAR interview defenses, and system architecture.',
        targetRole: 'Full Stack Software Engineer',
        seniority: 'MID',
        targetCompany: 'Google / Meta / Stripe',
        location: 'Hyderabad, India',
        education: 'B.Tech in Computer Science & Engineering',
        githubUrl: 'https://github.com/Jaswanth-Reddy-2006',
        linkedinUrl: 'https://linkedin.com/in/jaswanthreddy',
        portfolioUrl: 'https://jaswanthreddy.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        currentStreak: 14,
        maxStreak: 32,
        totalActiveDays: 148,
        globalRankPercentile: 4.2,
        privacySettings: {
          publicProfile: true,
          showActivity: true,
          showLeaderboard: true,
        },
        codingStats: {
          totalSolved: 146,
          totalAvailable: 320,
          easySolved: 58,
          easyTotal: 90,
          mediumSolved: 74,
          mediumTotal: 160,
          hardSolved: 14,
          hardTotal: 70,
          acceptanceRate: 78.4,
          beatsPercentage: 91.6
        },
        oralStats: {
          interviewsCompleted: 24,
          avgScore: 89,
          starCompliance: 94,
          vocalConfidence: 91,
          averagePacingWpm: 136,
          eyeContactScore: 95
        },
        skills: [
          { name: 'Data Structures & Algorithms', level: 'Master', count: 146 },
          { name: 'System Design & Distributed Systems', level: 'Advanced', count: 28 },
          { name: 'Dynamic Programming', level: 'Advanced', count: 34 },
          { name: 'Behavioral & STAR Communication', level: 'Master', count: 24 },
          { name: 'React & TypeScript Architecture', level: 'Master', count: 62 },
          { name: 'Node.js & Go Microservices', level: 'Advanced', count: 45 }
        ],
        badges: DEFAULT_BADGES,
        recentSubmissions: [
          {
            id: 'sub-1',
            type: 'CODING',
            title: 'LRU Cache Implementation (O(1) Get & Put)',
            timestamp: '2 hours ago',
            scoreOrResult: 'All 24/24 Test Cases Passed (4ms, Beats 94%)',
            languageOrTopic: 'TypeScript',
            difficulty: 'HARD',
            status: 'OPTIMAL'
          },
          {
            id: 'sub-2',
            type: 'ORAL',
            title: 'Technical Conflict & Architecture Tradeoffs',
            timestamp: 'Yesterday',
            scoreOrResult: 'Score: 92/100 • STAR Method 96%',
            languageOrTopic: 'System Design Track',
            difficulty: 'MEDIUM',
            status: 'OPTIMAL'
          },
          {
            id: 'sub-3',
            type: 'CODING',
            title: 'Coin Change II (2D Knapsack State Compression)',
            timestamp: '2 days ago',
            scoreOrResult: 'Optimal O(N*W) Space Compression',
            languageOrTopic: 'Python 3',
            difficulty: 'MEDIUM',
            status: 'PASSED'
          },
          {
            id: 'sub-4',
            type: 'ROADMAP',
            title: 'Distributed Message Queues & Kafka Partitioning',
            timestamp: '3 days ago',
            scoreOrResult: 'Step 4 of 6 Completed',
            languageOrTopic: 'Backend Roadmap',
            status: 'PASSED'
          },
          {
            id: 'sub-5',
            type: 'ATS',
            title: 'Senior Backend Engineer ATS Resume Scan',
            timestamp: '5 days ago',
            scoreOrResult: 'Match Score: 94/100 (Tier 1)',
            languageOrTopic: 'Fintech Industry',
            status: 'OPTIMAL'
          }
        ]
      },
      followers: DEFAULT_FOLLOWERS,
      following: DEFAULT_FOLLOWING,
      activityMap: generateInitialActivityMap(),
      preferences: {
        themeMode: 'light',
        accentColor: 'royal',
        editorTheme: 'vs-dark',
        editorFontSize: 14,
        editorTabSize: 2,
        keybindingMode: 'standard',
        minimapEnabled: true,
        wordWrap: true,
        voiceModel: 'ava-uk',
        voiceSpeed: 1.0,
        gradingStrictness: 'ADVERSARIAL',
        socraticHintsEnabled: true,
        eyeTrackingEnabled: true,
        strictProctoring: true,
        emailStreakReminders: true,
        communityDigest: true
      },

      toggleFollow: (userId: string) => {
        set((state) => {
          const userInFollowers = state.followers.find(f => f.id === userId);
          const userInFollowing = state.following.find(f => f.id === userId);
          const currentlyFollowing = userInFollowing ? true : userInFollowers?.isFollowing || false;

          let updatedFollowers = state.followers.map(f => {
            if (f.id === userId) {
              return { ...f, isFollowing: !currentlyFollowing };
            }
            return f;
          });

          let updatedFollowing = [...state.following];
          if (currentlyFollowing) {
            updatedFollowing = updatedFollowing.filter(f => f.id !== userId);
          } else {
            const targetUser = userInFollowers || {
              id: userId,
              name: 'Candidate ' + userId.slice(-3),
              username: 'candidate_' + userId.slice(-3),
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'Software Engineer',
              company: 'Tech Hiring Board',
              rank: 'Top 10%',
              streak: 7,
              isFollowing: true
            };
            updatedFollowing.push({ ...targetUser, isFollowing: true });
          }

          return {
            followers: updatedFollowers,
            following: updatedFollowing
          };
        });
      },

      updateProfile: (partial) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial
          }
        }));
      },

      updatePreferences: (partial) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...partial
          }
        }));
      },

      recordActivity: (type, title, score) => {
        const todayStr = new Date().toISOString().split('T')[0];
        set((state) => {
          const currentDay = state.activityMap[todayStr] || {
            date: todayStr,
            count: 0,
            codingCount: 0,
            oralCount: 0,
            roadmapCount: 0
          };

          const newDay: ActivityDay = {
            ...currentDay,
            count: currentDay.count + 1,
            codingCount: type === 'CODING' ? currentDay.codingCount + 1 : currentDay.codingCount,
            oralCount: type === 'ORAL' ? currentDay.oralCount + 1 : currentDay.oralCount,
            roadmapCount: type === 'ROADMAP' ? currentDay.roadmapCount + 1 : currentDay.roadmapCount
          };

          const newSubmission = {
            id: 'sub-' + Date.now(),
            type,
            title,
            timestamp: 'Just now',
            scoreOrResult: score,
            languageOrTopic: type === 'CODING' ? 'Monaco IDE' : 'Ava Socratic AI',
            status: 'OPTIMAL' as const
          };

          return {
            activityMap: {
              ...state.activityMap,
              [todayStr]: newDay
            },
            profile: {
              ...state.profile,
              recentSubmissions: [newSubmission, ...state.profile.recentSubmissions.slice(0, 9)]
            }
          };
        });
      }
    }),
    {
      name: 'ru-ready-profile-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.preferences) {
          state.preferences.themeMode = 'light';
        }
      }
    }
  )
);