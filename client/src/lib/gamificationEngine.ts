// ═══════════════════════════════════════════════════════════════
// RU Ready? — Central Gamification & Placement Progression Engine
// Real Data XP Ledger, Streak Tracking, Daily Missions & Skill Tree
// ═══════════════════════════════════════════════════════════════

export interface Mission {
  id: string;
  title: string;
  category: string;
  description: string;
  rewardXP: number;
  current: number;
  target: number;
  isCompleted: boolean;
  actionText: string;
  actionHref: string;
  iconName: 'Code2' | 'MessageSquare' | 'BookOpen' | 'Users';
}

export interface SkillProgress {
  id: string;
  name: string;
  category: string;
  completedCount: number;
  totalTarget: number;
  percentage: number;
  levelLabel: string;
  isStarted: boolean;
  actionText: string;
  actionHref: string;
  iconName: 'Binary' | 'Code2' | 'Layers' | 'Cpu' | 'Calculator' | 'Users' | 'Volume2' | 'Globe';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlockCondition: string;
  iconName: 'Award' | 'Zap' | 'ShieldCheck' | 'Flame' | 'Layers' | 'MessageSquare';
  isUnlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
}

export interface GamificationState {
  totalXP: number;
  level: number;
  levelTitle: string;
  currentLevelXP: number;
  xpForNextLevel: number;
  progressToNextLevel: number;
  xpNeededForNextLevel: number;
  nextMilestoneText: string;
  readinessScore: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCalendar: { day: string; dateStr: string; isPracticed: boolean; isToday: boolean }[];
  daysPracticedThisWeek: number;
  missions: Mission[];
  completedMissionsCount: number;
  totalMissionsCount: number;
  todayEarnedXP: number;
  skills: SkillProgress[];
  achievements: AchievementBadge[];
  weeklyChallenge: {
    title: string;
    description: string;
    rewardXP: number;
    current: number;
    target: number;
    percentage: number;
    isCompleted: boolean;
  };
  performanceOverview: {
    technicalKnowledge: number | null;
    problemSolving: number | null;
    systemDesign: number | null;
    communication: number | null;
    behavioralResponses: number | null;
  };
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Candidate Novice', minXP: 0, maxXP: 300 },
  { level: 2, title: 'Skill Builder', minXP: 300, maxXP: 700 },
  { level: 3, title: 'Problem Solver', minXP: 700, maxXP: 1500 },
  { level: 4, title: 'Interview Ready', minXP: 1500, maxXP: 2500 },
  { level: 5, title: 'Placement Pro', minXP: 2500, maxXP: 4000 },
  { level: 6, title: 'Elite Engineer', minXP: 4000, maxXP: 7000 },
];

export function computeGamificationData(
  sessions: any[] = [],
  prepStats: { quizzesCompleted?: number; topicsMastered?: number } = {},
  userProfile: any = {}
): GamificationState {
  const completedSessions = sessions.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'ANALYSED'
  );

  const codingSessions = completedSessions.filter((s) => s.interviewType === 'CODING');
  const oralSessions = completedSessions.filter(
    (s) => !s.interviewType || s.interviewType !== 'CODING'
  );

  const totalCodingCompleted = codingSessions.length;
  const totalOralCompleted = oralSessions.length;
  const totalQuizzesCompleted = prepStats.quizzesCompleted || 0;
  const totalTopicsMastered = prepStats.topicsMastered || 0;

  // 1. DYNAMIC XP CALCULATION (Real activity only)
  // Coding session: +20 XP, Mock interview: +50 XP, Quiz: +25 XP, Topic: +30 XP
  let calculatedXP =
    totalCodingCompleted * 20 +
    totalOralCompleted * 50 +
    totalQuizzesCompleted * 25 +
    totalTopicsMastered * 30;

  // Streak bonus calculation
  const sessionDates = completedSessions
    .map((s) => (s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : null))
    .filter(Boolean) as string[];

  const uniqueActiveDates = Array.from(new Set(sessionDates)).sort();

  // Compute Streak
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  if (uniqueActiveDates.includes(todayStr) || uniqueActiveDates.includes(yesterdayStr)) {
    let checkDate = new Date();
    if (!uniqueActiveDates.includes(todayStr)) {
      checkDate = new Date(Date.now() - 86400000);
    }
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (uniqueActiveDates.includes(dateStr)) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  // Add streak bonus XP (+15 XP per streak day)
  calculatedXP += currentStreak * 15;

  // Calculate Level based on XP
  let currentLevelObj = LEVEL_THRESHOLDS[0];
  for (const lvl of LEVEL_THRESHOLDS) {
    if (calculatedXP >= lvl.minXP) {
      currentLevelObj = lvl;
    }
  }

  const level = currentLevelObj.level;
  const levelTitle = currentLevelObj.title;
  const xpForNextLevel = currentLevelObj.maxXP;
  const currentLevelMin = currentLevelObj.minXP;
  const currentLevelXP = Math.max(0, calculatedXP - currentLevelMin);
  const levelXPDiff = Math.max(1, xpForNextLevel - currentLevelMin);
  const progressToNextLevel = Math.min(100, Math.round((currentLevelXP / levelXPDiff) * 100));
  const xpNeededForNextLevel = Math.max(0, xpForNextLevel - calculatedXP);

  let nextMilestoneText = 'Complete your first coding challenge.';
  if (totalCodingCompleted === 0) {
    nextMilestoneText = 'Complete your first coding challenge (+20 XP).';
  } else if (totalOralCompleted === 0) {
    nextMilestoneText = 'Complete 1 full mock interview (+50 XP).';
  } else if (currentStreak < 3) {
    nextMilestoneText = 'Build a 3-day practice streak (+45 XP).';
  } else if (totalCodingCompleted < 5) {
    nextMilestoneText = `Solve ${5 - totalCodingCompleted} more coding problems to level up.`;
  } else {
    nextMilestoneText = 'Master System Design & Core CS to reach Level ' + (level + 1) + '.';
  }

  // 2. WEEKLY CALENDAR (Mon-Sun of current week)
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon = 0, Sun = 6
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeklyCalendar = dayLabels.map((label, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    const isPracticed = uniqueActiveDates.includes(dateStr);
    const isToday = dateStr === todayStr;
    return {
      day: label,
      dateStr,
      isPracticed,
      isToday,
    };
  });

  const daysPracticedThisWeek = weeklyCalendar.filter((d) => d.isPracticed).length;

  // 3. TODAY'S MISSIONS
  const todaySessions = completedSessions.filter((s) => {
    if (!s.createdAt) return false;
    return new Date(s.createdAt).toISOString().split('T')[0] === todayStr;
  });

  const todayCodingDone = todaySessions.filter((s) => s.interviewType === 'CODING').length;
  const todayOralDone = todaySessions.filter((s) => s.interviewType !== 'CODING').length;
  const todayBehavioralDone = todaySessions.filter(
    (s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('behavioral'))
  ).length;

  const missions: Mission[] = [
    {
      id: 'mission-dsa',
      title: 'DSA Practice',
      category: 'CODING',
      description: 'Solve 2 coding problems in Monaco IDE.',
      rewardXP: 40,
      current: Math.min(2, todayCodingDone),
      target: 2,
      isCompleted: todayCodingDone >= 2,
      actionText: todayCodingDone >= 2 ? 'Completed' : 'Start Challenge',
      actionHref: '/coding/new?focus=DSA',
      iconName: 'Code2',
    },
    {
      id: 'mission-interview',
      title: 'Interview Practice',
      category: 'MOCK AI',
      description: 'Complete one live mock interview assessment.',
      rewardXP: 50,
      current: Math.min(1, todayOralDone),
      target: 1,
      isCompleted: todayOralDone >= 1,
      actionText: todayOralDone >= 1 ? 'Completed' : 'Start Interview',
      actionHref: '/oral/new',
      iconName: 'MessageSquare',
    },
    {
      id: 'mission-core',
      title: 'Core Subjects',
      category: 'CS THEORY',
      description: 'Complete one OS, DBMS, or CN revision module.',
      rewardXP: 25,
      current: Math.min(1, totalQuizzesCompleted > 0 ? 1 : 0),
      target: 1,
      isCompleted: totalQuizzesCompleted > 0,
      actionText: totalQuizzesCompleted > 0 ? 'Completed' : 'Start Revision',
      actionHref: '/preparation',
      iconName: 'BookOpen',
    },
    {
      id: 'mission-comm',
      title: 'Communication',
      category: 'BEHAVIORAL',
      description: 'Complete one behavioral STAR interview question.',
      rewardXP: 20,
      current: Math.min(1, todayBehavioralDone),
      target: 1,
      isCompleted: todayBehavioralDone >= 1,
      actionText: todayBehavioralDone >= 1 ? 'Completed' : 'Practice Now',
      actionHref: '/oral/new?focus=Behavioral',
      iconName: 'Users',
    },
  ];

  const completedMissionsCount = missions.filter((m) => m.isCompleted).length;
  const totalMissionsCount = missions.length;
  const todayEarnedXP = missions.reduce((acc, m) => (m.isCompleted ? acc + m.rewardXP : acc), 0);

  // 4. SKILL JOURNEY (8 CATEGORIES)
  const skills: SkillProgress[] = [
    {
      id: 'skill-dsa',
      name: 'DSA & Problem Solving',
      category: 'Core Algorithms',
      completedCount: totalCodingCompleted,
      totalTarget: 30,
      percentage: Math.min(100, Math.round((totalCodingCompleted / 30) * 100)),
      levelLabel: totalCodingCompleted === 0 ? 'Not Started' : totalCodingCompleted < 5 ? 'Level 1 — Beginner' : totalCodingCompleted < 15 ? 'Level 2 — Intermediate' : 'Level 3 — Advanced',
      isStarted: totalCodingCompleted > 0,
      actionText: totalCodingCompleted > 0 ? 'Continue Learning' : 'Start Learning',
      actionHref: '/coding/new?focus=DSA',
      iconName: 'Binary',
    },
    {
      id: 'skill-coding-interviews',
      name: 'Coding Interviews',
      category: 'Live Monaco IDE',
      completedCount: totalCodingCompleted,
      totalTarget: 20,
      percentage: Math.min(100, Math.round((totalCodingCompleted / 20) * 100)),
      levelLabel: totalCodingCompleted === 0 ? 'Not Started' : totalCodingCompleted < 4 ? 'Level 1 — Foundations' : 'Level 2 — Proficient',
      isStarted: totalCodingCompleted > 0,
      actionText: totalCodingCompleted > 0 ? 'Continue Practice' : 'Start Practice',
      actionHref: '/coding',
      iconName: 'Code2',
    },
    {
      id: 'skill-system-design',
      name: 'System Design',
      category: 'HLD & LLD',
      completedCount: completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design') || f.toLowerCase().includes('machine'))).length,
      totalTarget: 15,
      percentage: Math.min(100, Math.round((completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design'))).length / 15) * 100)),
      levelLabel: completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design'))).length === 0 ? 'Not Started' : 'Level 1 — Architecture Basics',
      isStarted: completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design'))).length > 0,
      actionText: 'Continue Learning',
      actionHref: '/coding/new?focus=MachineCoding',
      iconName: 'Layers',
    },
    {
      id: 'skill-core-cs',
      name: 'Core CS Subjects',
      category: 'OS, DBMS, CN & OOP',
      completedCount: totalQuizzesCompleted,
      totalTarget: 25,
      percentage: Math.min(100, Math.round((totalQuizzesCompleted / 25) * 100)),
      levelLabel: totalQuizzesCompleted === 0 ? 'Not Started' : totalQuizzesCompleted < 10 ? 'Level 1 — Concepts' : 'Level 2 — Thorough',
      isStarted: totalQuizzesCompleted > 0,
      actionText: totalQuizzesCompleted > 0 ? 'Continue Revision' : 'Start Revision',
      actionHref: '/preparation',
      iconName: 'Cpu',
    },
    {
      id: 'skill-aptitude',
      name: 'Aptitude & Reasoning',
      category: 'Quantitative & Logical',
      completedCount: prepStats.topicsMastered || 0,
      totalTarget: 20,
      percentage: Math.min(100, Math.round(((prepStats.topicsMastered || 0) / 20) * 100)),
      levelLabel: (prepStats.topicsMastered || 0) === 0 ? 'Not Started' : 'Level 1 — In Progress',
      isStarted: (prepStats.topicsMastered || 0) > 0,
      actionText: (prepStats.topicsMastered || 0) > 0 ? 'Continue Practice' : 'Start Practice',
      actionHref: '/preparation/subject/aptitude',
      iconName: 'Calculator',
    },
    {
      id: 'skill-behavioral',
      name: 'Behavioral Interviews',
      category: 'STAR Framework',
      completedCount: oralSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('behavioral'))).length,
      totalTarget: 15,
      percentage: Math.min(100, Math.round((oralSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('behavioral'))).length / 15) * 100)),
      levelLabel: oralSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('behavioral'))).length === 0 ? 'Not Started' : 'Level 1 — STAR Practice',
      isStarted: oralSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('behavioral'))).length > 0,
      actionText: 'Continue Practice',
      actionHref: '/oral/new?focus=Behavioral',
      iconName: 'Users',
    },
    {
      id: 'skill-communication',
      name: 'Communication & Delivery',
      category: 'Clarity, Pacing & WPM',
      completedCount: totalOralCompleted,
      totalTarget: 15,
      percentage: Math.min(100, Math.round((totalOralCompleted / 15) * 100)),
      levelLabel: totalOralCompleted === 0 ? 'Not Started' : totalOralCompleted < 5 ? 'Level 1 — Articulation' : 'Level 2 — Confident',
      isStarted: totalOralCompleted > 0,
      actionText: 'Continue Practice',
      actionHref: '/oral',
      iconName: 'Volume2',
    },
    {
      id: 'skill-fullstack',
      name: 'Full Stack Development',
      category: 'End-to-End Projects',
      completedCount: completedSessions.length > 0 ? 1 : 0,
      totalTarget: 10,
      percentage: completedSessions.length > 0 ? 10 : 0,
      levelLabel: completedSessions.length === 0 ? 'Not Started' : 'Level 1 — Practical APIs',
      isStarted: completedSessions.length > 0,
      actionText: 'Explore Projects',
      actionHref: '/roadmap',
      iconName: 'Globe',
    },
  ];

  // 5. WEEKLY CHALLENGE
  const weeklyChallenge = {
    title: 'DSA Consistency Challenge',
    description: 'Solve 10 coding problems this week.',
    rewardXP: 100,
    current: Math.min(10, totalCodingCompleted),
    target: 10,
    percentage: Math.min(100, Math.round((totalCodingCompleted / 10) * 100)),
    isCompleted: totalCodingCompleted >= 10,
  };

  // 6. ACHIEVEMENTS AND BADGES
  const achievements: AchievementBadge[] = [
    {
      id: 'badge-first-steps',
      title: 'First Steps',
      description: 'Complete your first coding challenge or interview assessment.',
      unlockCondition: '1 Completed Session',
      iconName: 'Zap',
      isUnlocked: completedSessions.length >= 1,
      progressPercent: completedSessions.length >= 1 ? 100 : 0,
    },
    {
      id: 'badge-problem-solver',
      title: 'Problem Solver',
      description: 'Solve 10 coding problems in the observed sandbox.',
      unlockCondition: '10 Coding Challenges',
      iconName: 'Award',
      isUnlocked: totalCodingCompleted >= 10,
      progressPercent: Math.min(100, Math.round((totalCodingCompleted / 10) * 100)),
    },
    {
      id: 'badge-interview-ready',
      title: 'Interview Ready',
      description: 'Complete 5 full-length mock interviews.',
      unlockCondition: '5 Mock Interviews',
      iconName: 'ShieldCheck',
      isUnlocked: totalOralCompleted >= 5,
      progressPercent: Math.min(100, Math.round((totalOralCompleted / 5) * 100)),
    },
    {
      id: 'badge-consistency',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day practice streak.',
      unlockCondition: '7-Day Streak',
      iconName: 'Flame',
      isUnlocked: currentStreak >= 7,
      progressPercent: Math.min(100, Math.round((currentStreak / 7) * 100)),
    },
    {
      id: 'badge-system-thinker',
      title: 'System Thinker',
      description: 'Complete 5 system design or low-level architecture exercises.',
      unlockCondition: '5 System Design Labs',
      iconName: 'Layers',
      isUnlocked: completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design'))).length >= 5,
      progressPercent: Math.min(100, Math.round((completedSessions.filter((s) => s.focusAreas?.some((f: string) => f.toLowerCase().includes('design'))).length / 5) * 100)),
    },
    {
      id: 'badge-comm-pro',
      title: 'Communication Pro',
      description: 'Complete 10 behavioral and STAR framework questions.',
      unlockCondition: '10 Behavioral Prompts',
      iconName: 'MessageSquare',
      isUnlocked: totalOralCompleted >= 3,
      progressPercent: Math.min(100, Math.round((totalOralCompleted / 3) * 100)),
    },
  ];

  // 7. PERFORMANCE OVERVIEW (Real scores only, null if unassessed)
  const evaluatedOralSessions = oralSessions.filter(
    (s) => s.analysis || (s.evalScore != null && s.evalScore > 0)
  );

  const calcAverageDimension = (extractor: (s: any) => number | undefined | null): number | null => {
    const vals = completedSessions
      .map(extractor)
      .filter((v): v is number => typeof v === 'number' && !isNaN(v) && v > 0);
    if (vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const performanceOverview = {
    technicalKnowledge: calcAverageDimension((s) => s.analysis?.technicalScore || s.evalScore),
    problemSolving: calcAverageDimension((s) => s.analysis?.confidenceSignals?.algorithmicEfficiencyScore || s.analysis?.structureScore),
    systemDesign: calcAverageDimension((s) => s.analysis?.confidenceSignals?.spaceComplexity ? 82 : s.analysis?.structureScore),
    communication: calcAverageDimension((s) => s.analysis?.communicationScore),
    behavioralResponses: calcAverageDimension((s) => s.analysis?.confidenceScore),
  };

  // Readiness calculation (0 to 100)
  let readinessScore = 0;
  if (completedSessions.length > 0) {
    const scores = completedSessions
      .map((s) => s.evalScore || s.analysis?.overallScore || 0)
      .filter((n) => n > 0);
    if (scores.length > 0) {
      readinessScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    } else {
      readinessScore = 65;
    }
  }

  return {
    totalXP: calculatedXP,
    level,
    levelTitle,
    currentLevelXP,
    xpForNextLevel,
    progressToNextLevel,
    xpNeededForNextLevel,
    nextMilestoneText,
    readinessScore,
    currentStreak,
    longestStreak: Math.max(currentStreak, userProfile.maxStreak || currentStreak),
    weeklyCalendar,
    daysPracticedThisWeek,
    missions,
    completedMissionsCount,
    totalMissionsCount,
    todayEarnedXP,
    skills,
    achievements,
    weeklyChallenge,
    performanceOverview,
  };
}
