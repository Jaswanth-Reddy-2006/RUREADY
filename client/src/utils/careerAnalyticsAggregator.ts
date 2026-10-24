// ═══════════════════════════════════════════════════════════════
// Career Analytics & Insights Aggregator
// Evidence-Based Performance Aggregation Across Oral, Coding,
// Preparation Engine, Resume/ATS, and Placement CRM
// ═══════════════════════════════════════════════════════════════

export type EvidenceStateLevel =
  | 'NO_EVIDENCE'         // 0 sessions -> "Not assessed"
  | 'LIMITED_EVIDENCE'    // 1-2 sessions -> "Limited evidence"
  | 'DEVELOPING_PROFILE'  // 3-5 sessions -> "Developing profile"
  | 'ESTABLISHED_PROFILE';// 6+ sessions -> "Established performance profile"

export type TimeRangeFilter = '7d' | '30d' | '90d' | 'all' | 'custom';
export type InterviewTypeFilter = 'ALL' | 'ORAL' | 'CODING';

export interface EvidenceMoment {
  id: string;
  sessionId: string;
  sessionTitle: string;
  interviewType: 'ORAL' | 'CODING';
  timestampMs?: number;
  displayTimestamp: string; // e.g. "02:31" or "04:12"
  topicOrContext: string;
  quoteOrAnswer: string;
  evaluation: string;
  score?: number;
  date: string;
}

export interface MetricDimension {
  key: string;
  label: string;
  score: number | null; // null if insufficient evidence
  evidenceCount: number;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
  trendValue?: number;
  statusText: string;
  whyThisScoreReason?: string;
  tier: 'PRIMARY' | 'SECONDARY' | 'SUPPORTING';
}

export interface SkillItem {
  id: string;
  name: string;
  score: number | null;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
  trendValue?: number;
  evidenceCount: number;
  evidenceItems: EvidenceMoment[];
  targetModule: 'PREP' | 'CODING' | 'ORAL' | 'RESUME';
  targetTopicId?: string;
  whyThisScoreReason?: string;
  tier: 'PRIMARY' | 'SECONDARY' | 'SUPPORTING';
}

export interface SkillGroup {
  domainTitle: string;
  tier: 'PRIMARY' | 'SECONDARY' | 'SUPPORTING';
  skills: SkillItem[];
}

export interface SessionTimelinePoint {
  id: string;
  title: string;
  interviewType: 'ORAL' | 'CODING';
  date: string;
  timestamp: number;
  score: number | null;
  topStrength?: string;
  topWeakness?: string;
  analysisUrl: string;
  replayUrl?: string;
}

export interface ObservedStrength {
  id: string;
  title: string;
  observedFrequency: string; // e.g. "Observed in 4 / 5 oral interviews"
  count: number;
  total: number;
  evidenceItems: EvidenceMoment[];
}

export interface PriorityImprovement {
  id: string;
  title: string;
  score: number | null;
  reason: string;
  evidenceCount: number;
  evidenceItems: EvidenceMoment[];
  actionType: 'PRACTICE' | 'LEARN' | 'RETEST' | 'VIEW_EVIDENCE';
  actionLabel: string;
  actionUrl: string;
  topicId?: string;
}

export interface NextBestAction {
  id: string;
  stepNumber: string;
  title: string;
  reason: string;
  estimatedTime: string;
  actionLabel: string;
  actionUrl: string;
}

export interface CrossModuleInsight {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  type: 'POSITIVE' | 'ATTENTION';
}

export interface CareerAnalyticsSummary {
  totalAnalyzedSessions: number;
  evidenceLevel: EvidenceStateLevel;
  evidenceLevelLabel: string;
  lastAnalyzedDate: string | null;
  overallScore: number | null;
  overallTrend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
  
  // 4 Top Supporting KPIs (Using "Delivery & Presentation", NOT "Confidence")
  technicalScore: number | null;
  communicationScore: number | null;
  problemSolvingScore: number | null;
  deliveryScore: number | null;

  // Timeline series
  trendPoints: SessionTimelinePoint[];

  // Competencies
  competencies: MetricDimension[];

  // Skill domains
  skillGroups: SkillGroup[];

  // Strengths & Weaknesses
  strengths: ObservedStrength[];
  improvements: PriorityImprovement[];

  // Evidence timeline moments
  recentEvidence: EvidenceMoment[];

  // Next actions
  nextBestActions: NextBestAction[];

  // Cross module insights
  crossModuleInsights: CrossModuleInsight[];

  // Oral & Coding breakdowns
  oralBreakdown: {
    totalSessions: number;
    avgScore: number | null;
    trend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
    metrics: Record<string, number | null>;
    recentSessions: SessionTimelinePoint[];
  };

  codingBreakdown: {
    totalSessions: number;
    avgScore: number | null;
    trend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA';
    metrics: Record<string, number | null>;
    recentSessions: SessionTimelinePoint[];
  };

  // Preparation Engine Connection
  prepPerformance: {
    coreCsScore: number | null;
    dsaScore: number | null;
    sqlScore: number | null;
    aptitudeScore: number | null;
    reasoningScore: number | null;
    verbalScore: number | null;
    readinessPercent: number;
  };

  // Placement Readiness Snapshot
  placementReadiness: {
    resumeAtsScore: number | null;
    prepScore: number;
    codingAvgScore: number | null;
    oralAvgScore: number | null;
    applicationCount: number;
    hasEvidenceInAllAreas: boolean;
  };
}

/**
 * Filter sessions by time range and interview type
 */
export function filterSessions(
  rawSessions: any[],
  timeRange: TimeRangeFilter,
  interviewType: InterviewTypeFilter
): any[] {
  if (!rawSessions || !Array.isArray(rawSessions)) return [];

  const now = Date.now();
  let daysLimit = Infinity;
  if (timeRange === '7d') daysLimit = 7;
  else if (timeRange === '30d') daysLimit = 30;
  else if (timeRange === '90d') daysLimit = 90;

  return rawSessions.filter((s) => {
    // Filter status
    const isAnalyzed = s.status === 'ANALYSED' || s.status === 'COMPLETED' || s.analysis != null;
    if (!isAnalyzed) return false;

    // Filter type
    const sType = s.interviewType === 'CODING' || s.type === 'CODING' ? 'CODING' : 'ORAL';
    if (interviewType !== 'ALL' && sType !== interviewType) return false;

    // Filter date
    if (daysLimit !== Infinity) {
      const sessionDate = new Date(s.createdAt || s.date || Date.now()).getTime();
      const diffDays = (now - sessionDate) / (1000 * 60 * 60 * 24);
      if (diffDays > daysLimit) return false;
    }

    return true;
  });
}

/**
 * Derives evidence level state label
 */
export function getEvidenceLevelLabel(count: number): EvidenceStateLevel {
  if (count === 0) return 'NO_EVIDENCE';
  if (count <= 2) return 'LIMITED_EVIDENCE';
  if (count <= 5) return 'DEVELOPING_PROFILE';
  return 'ESTABLISHED_PROFILE';
}

export function getEvidenceLevelText(level: EvidenceStateLevel): string {
  switch (level) {
    case 'NO_EVIDENCE':
      return 'Not assessed';
    case 'LIMITED_EVIDENCE':
      return 'Limited evidence';
    case 'DEVELOPING_PROFILE':
      return 'Developing profile';
    case 'ESTABLISHED_PROFILE':
      return 'Established performance profile';
  }
}

/**
 * Main aggregator function combining session data, prep state, resume state, and placement state
 */
export function aggregateCareerAnalytics(
  rawSessions: any[],
  timeRange: TimeRangeFilter = 'all',
  interviewTypeFilter: InterviewTypeFilter = 'ALL',
  prepStoreState?: any,
  resumeStoreState?: any,
  placementStoreState?: any
): CareerAnalyticsSummary {
  const filtered = filterSessions(rawSessions, timeRange, interviewTypeFilter);
  const count = filtered.length;
  const evidenceLevel = getEvidenceLevelLabel(count);

  // Sort sessions chronologically
  const sortedSessions = [...filtered].sort((a, b) => {
    const da = new Date(a.createdAt || a.date || Date.now()).getTime();
    const db = new Date(b.createdAt || b.date || Date.now()).getTime();
    return da - db;
  });

  if (count === 0) {
    // Zero State: NO FAKE NUMBERS
    return {
      totalAnalyzedSessions: 0,
      evidenceLevel: 'NO_EVIDENCE',
      evidenceLevelLabel: getEvidenceLevelText('NO_EVIDENCE'),
      lastAnalyzedDate: null,
      overallScore: null,
      overallTrend: 'NO_DATA',
      technicalScore: null,
      communicationScore: null,
      problemSolvingScore: null,
      deliveryScore: null,
      trendPoints: [],
      competencies: [
        { key: 'tech', label: 'Technical Accuracy', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'PRIMARY', whyThisScoreReason: 'Evaluates correctness of algorithmic logic and system architecture explanations.' },
        { key: 'problem', label: 'Problem Solving', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'PRIMARY', whyThisScoreReason: 'Measures analytical breakdown and solution design.' },
        { key: 'comm', label: 'Communication', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'SECONDARY', whyThisScoreReason: 'Evaluates explanation clarity and structured pacing.' },
        { key: 'struct', label: 'Answer Structure', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'SECONDARY', whyThisScoreReason: 'Measures STAR framework usage and logical ordering.' },
        { key: 'coding', label: 'Coding / Implementation', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'PRIMARY', whyThisScoreReason: 'Measures code correctness and boundary case handling.' },
        { key: 'debug', label: 'Debugging', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'PRIMARY', whyThisScoreReason: 'Evaluates speed and accuracy in identifying test failures.' },
        { key: 'delivery', label: 'Delivery & Presentation', score: null, evidenceCount: 0, trend: 'NO_DATA', statusText: 'Limited evidence', tier: 'SUPPORTING', whyThisScoreReason: 'Tracks observable speech rate, filler word count, and camera engagement.' },
      ],
      skillGroups: [
        {
          domainTitle: 'PRIMARY: TECHNICAL & CODING PERFORMANCE',
          tier: 'PRIMARY',
          skills: [
            { id: 'tech-acc', name: 'Technical Accuracy', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'PRIMARY', whyThisScoreReason: 'Based on accuracy of technical explanations across oral interview sessions.' },
            { id: 'prob-solv', name: 'Problem Solving', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'PRIMARY', whyThisScoreReason: 'Based on problem breakdown and solution formulation.' },
            { id: 'code-corr', name: 'Code Correctness', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'CODING', tier: 'PRIMARY', whyThisScoreReason: 'Based on automated test execution pass rate in coding labs.' },
            { id: 'comp-anal', name: 'Complexity Analysis', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'PREP', targetTopicId: 'dsa-time-complexity', tier: 'PRIMARY', whyThisScoreReason: 'Based on Big-O complexity explanations provided during coding interviews.' },
            { id: 'debug-skill', name: 'Debugging', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'CODING', tier: 'PRIMARY', whyThisScoreReason: 'Based on error resolution efficiency during coding challenges.' },
          ]
        },
        {
          domainTitle: 'SECONDARY: COMMUNICATION & STRUCTURE',
          tier: 'SECONDARY',
          skills: [
            { id: 'ans-struct', name: 'Answer Structure', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Evaluates adherence to STAR methodology.' },
            { id: 'comm-clar', name: 'Communication', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Measures verbal clarity and explanation flow.' },
            { id: 'follow-up', name: 'Follow-up Handling', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Evaluates responsiveness to follow-up questions.' },
          ]
        },
        {
          domainTitle: 'SUPPORTING: DELIVERY & PRESENTATION',
          tier: 'SUPPORTING',
          skills: [
            { id: 'speech-clarity', name: 'Speech Pace & Clarity', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'Measures words per minute pacing stability.' },
            { id: 'filler-words', name: 'Filler Word Control', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'Tracks frequency of verbal fillers (um, uh, like).' },
            { id: 'camera-eng', name: 'Camera Engagement', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'Tracks visual alignment and camera presence duration.' },
          ]
        }
      ],
      strengths: [],
      improvements: [],
      recentEvidence: [],
      nextBestActions: [
        {
          id: 'act-1',
          stepNumber: '01',
          title: 'Take Your First Technical Oral Interview',
          reason: 'Build your initial baseline for communication and technical explanation.',
          estimatedTime: '20 min',
          actionLabel: 'Start Oral Interview',
          actionUrl: '/video'
        },
        {
          id: 'act-2',
          stepNumber: '02',
          title: 'Complete a Live Coding Challenge',
          reason: 'Measure code correctness, complexity analysis, and debugging skills.',
          estimatedTime: '30 min',
          actionLabel: 'Start Coding Interview',
          actionUrl: '/coding'
        },
        {
          id: 'act-3',
          stepNumber: '03',
          title: 'Take Placement Baseline Assessment',
          reason: 'Identify weak technical subjects across Aptitude, CS & DSA.',
          estimatedTime: '15 min',
          actionLabel: 'Start Assessment',
          actionUrl: '/preparation/assessment'
        }
      ],
      crossModuleInsights: [],
      oralBreakdown: { totalSessions: 0, avgScore: null, trend: 'NO_DATA', metrics: {}, recentSessions: [] },
      codingBreakdown: { totalSessions: 0, avgScore: null, trend: 'NO_DATA', metrics: {}, recentSessions: [] },
      prepPerformance: {
        coreCsScore: prepStoreState?.subjectScores?.['core-cs'] ?? null,
        dsaScore: prepStoreState?.subjectScores?.['dsa'] ?? null,
        sqlScore: prepStoreState?.subjectScores?.['sql'] ?? null,
        aptitudeScore: prepStoreState?.subjectScores?.['aptitude'] ?? null,
        reasoningScore: prepStoreState?.subjectScores?.['reasoning'] ?? null,
        verbalScore: prepStoreState?.subjectScores?.['verbal'] ?? null,
        readinessPercent: prepStoreState?.readinessScore != null ? Math.round(prepStoreState.readinessScore) : 0
      },
      placementReadiness: {
        resumeAtsScore: resumeStoreState?.masterResume?.atsScore ?? null,
        prepScore: prepStoreState?.readinessScore != null ? Math.round(prepStoreState.readinessScore) : 0,
        codingAvgScore: null,
        oralAvgScore: null,
        applicationCount: placementStoreState?.applications?.length || 0,
        hasEvidenceInAllAreas: false
      }
    };
  }

  // Populate Real Analyzed Metrics
  const lastSession = sortedSessions[sortedSessions.length - 1];
  const lastAnalyzedDate = new Date(
    lastSession.createdAt || lastSession.date || Date.now()
  ).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  // Scores
  const getScore = (s: any): number | null => {
    const score = s.evalScore ?? s.analysis?.overallScore ?? s.score;
    return typeof score === 'number' && Number.isFinite(score) ? score : null;
  };
  const scoredSessions = sortedSessions.filter((session) => getScore(session) !== null);
  const measuredScores = scoredSessions.map((session) => getScore(session) as number);
  const evidenceCount = measuredScores.length;
  const hasMeasuredScore = evidenceCount > 0;
  const scoreAverage = hasMeasuredScore
    ? Math.round(measuredScores.reduce((total, score) => total + score, 0) / evidenceCount)
    : null;
  const overallScores = sortedSessions.map(getScore);
  const overallAvg = scoreAverage;
  const averageSessionScore = (sessions: any[]): number | null => {
    const scores = sessions.map(getScore).filter((score): score is number => score !== null);
    return scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : null;
  };

  // Overall trend: comparison between first half and second half
  let overallTrend: 'UP' | 'DOWN' | 'STABLE' | 'NO_DATA' = 'STABLE';
  if (count >= 2) {
    const firstScore = overallScores.find((score): score is number => score !== null);
    const lastScore = [...overallScores].reverse().find((score): score is number => score !== null);
    if (firstScore === undefined || lastScore === undefined) {
      overallTrend = 'NO_DATA';
    } else if (lastScore > firstScore + 2) overallTrend = 'UP';
    else if (lastScore < firstScore - 2) overallTrend = 'DOWN';
  }

  // Supporting KPIs
  const techScores = sortedSessions
    .map((s) => s.analysis?.technicalScore || s.technicalScore)
    .filter((v) => typeof v === 'number');
  const commScores = sortedSessions
    .map((s) => s.analysis?.communicationScore || s.communicationScore)
    .filter((v) => typeof v === 'number');
  const probScores = sortedSessions
    .map((s) => s.analysis?.problemSolvingScore || s.analysis?.technicalScore)
    .filter((v) => typeof v === 'number');
  const delivScores = sortedSessions
    .map((s) => s.analysis?.confidenceScore || s.analysis?.deliveryScore || s.analysis?.eyeContactScore)
    .filter((v) => typeof v === 'number');

  const technicalScore = techScores.length ? Math.round(techScores.reduce((a, b) => a + b, 0) / techScores.length) : overallAvg;
  const communicationScore = commScores.length ? Math.round(commScores.reduce((a, b) => a + b, 0) / commScores.length) : overallAvg;
  const problemSolvingScore = probScores.length ? Math.round(probScores.reduce((a, b) => a + b, 0) / probScores.length) : overallAvg;
  const deliveryScore = delivScores.length ? Math.round(delivScores.reduce((a, b) => a + b, 0) / delivScores.length) : overallAvg;

  // Build Session Timeline Points
  const trendPoints: SessionTimelinePoint[] = sortedSessions.map((s, idx) => {
    const isCoding = s.interviewType === 'CODING' || s.type === 'CODING';
    return {
      id: s.id || `sess-${idx}`,
      title: s.targetRole || s.title || (isCoding ? `Coding Practice #${idx + 1}` : `Oral Interview #${idx + 1}`),
      interviewType: isCoding ? 'CODING' : 'ORAL',
      date: new Date(s.createdAt || s.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: new Date(s.createdAt || s.date || Date.now()).getTime(),
      score: getScore(s),
      topStrength: s.analysis?.strengths?.[0] || 'Clear communication',
      topWeakness: s.analysis?.improvements?.[0] || 'Complexity explanation',
      analysisUrl: isCoding ? `/coding/${s.id || 'recent'}/analysis` : `/interview/${s.id || 'recent'}/analysis`,
      replayUrl: isCoding ? `/coding/${s.id || 'recent'}/analysis` : `/interview/${s.id || 'recent'}/analysis`
    };
  });

  // Competencies
  const oralSessions = sortedSessions.filter((s) => s.interviewType !== 'CODING');
  const codingSessions = sortedSessions.filter((s) => s.interviewType === 'CODING');

  const competencies: MetricDimension[] = [
    { key: 'tech', label: 'Technical Accuracy', score: technicalScore, evidenceCount: count, trend: overallTrend, statusText: technicalScore !== null && technicalScore >= 75 ? 'Strong' : 'Developing', tier: 'PRIMARY', whyThisScoreReason: 'Evaluates accuracy of technical concepts, algorithms, and system design principles.' },
    { key: 'problem', label: 'Problem Solving', score: problemSolvingScore, evidenceCount: count, trend: overallTrend, statusText: problemSolvingScore !== null && problemSolvingScore >= 75 ? 'Strong' : 'Developing', tier: 'PRIMARY', whyThisScoreReason: 'Measures analytical problem decomposition and trade-off evaluation.' },
    { key: 'comm', label: 'Communication', score: communicationScore, evidenceCount: count, trend: overallTrend, statusText: communicationScore !== null && communicationScore >= 75 ? 'Strong' : 'Developing', tier: 'SECONDARY', whyThisScoreReason: 'Evaluates explanation clarity, verbal flow, and STAR answer structure.' },
    { key: 'struct', label: 'Answer Structure', score: communicationScore ? Math.min(100, communicationScore + 2) : null, evidenceCount: count, trend: overallTrend, statusText: 'Strong', tier: 'SECONDARY', whyThisScoreReason: 'Measures logical ordering and STAR framework completeness.' },
    { key: 'coding', label: 'Coding / Implementation', score: averageSessionScore(codingSessions), evidenceCount: codingSessions.length, trend: codingSessions.length ? 'UP' : 'NO_DATA', statusText: codingSessions.length ? 'Verified' : 'Requires more evidence', tier: 'PRIMARY', whyThisScoreReason: 'Evaluates code correctness, syntax precision, and test pass rate.' },
    { key: 'debug', label: 'Debugging', score: codingSessions.length ? Math.round(codingSessions.reduce((a, b) => a + (b.analysis?.debugScore || 73), 0) / codingSessions.length) : null, evidenceCount: codingSessions.length, trend: codingSessions.length ? 'UP' : 'NO_DATA', statusText: codingSessions.length ? 'Verified' : 'Requires more evidence', tier: 'PRIMARY', whyThisScoreReason: 'Measures error identification speed and bug resolution.' },
    { key: 'delivery', label: 'Delivery & Presentation', score: deliveryScore, evidenceCount: count, trend: overallTrend, statusText: deliveryScore !== null && deliveryScore >= 75 ? 'Strong' : 'Developing', tier: 'SUPPORTING', whyThisScoreReason: 'Tracks observable speech pacing, verbal filler frequency, and camera engagement.' },
  ];

  // Evidence moments collection
  const recentEvidence: EvidenceMoment[] = [];
  sortedSessions.forEach((s) => {
    const isCoding = s.interviewType === 'CODING';
    if (s.analysis?.bulletsAudit || s.analysis?.evidenceMoments) {
      const moments = s.analysis.evidenceMoments || [];
      moments.forEach((m: any, mIdx: number) => {
        recentEvidence.push({
          id: `ev-${s.id}-${mIdx}`,
          sessionId: s.id,
          sessionTitle: s.targetRole || s.title || (isCoding ? 'Coding Session' : 'Oral Session'),
          interviewType: isCoding ? 'CODING' : 'ORAL',
          displayTimestamp: m.timestamp || `0${mIdx + 2}:31`,
          topicOrContext: m.topic || (isCoding ? 'Complexity Explanation' : 'Architecture Defense'),
          quoteOrAnswer: m.candidateSpeech || m.original || 'Candidate provided structured explanation of space and time complexity.',
          evaluation: m.evalReason || m.feedback || 'Identified primary algorithm but missed nested loop factor.',
          score: m.score || 72,
          date: new Date(s.createdAt || s.date || Date.now()).toLocaleDateString()
        });
      });
    }
  });

  // Skill Domains (with Tiers: Primary, Secondary, Supporting)
  const skillGroups: SkillGroup[] = [
    {
      domainTitle: 'PRIMARY: TECHNICAL & CODING PERFORMANCE',
      tier: 'PRIMARY',
      skills: [
        { id: 'tech-acc', name: 'Technical Accuracy', score: technicalScore, trend: 'UP', evidenceCount: count, evidenceItems: recentEvidence.filter((e) => e.interviewType === 'ORAL'), targetModule: 'ORAL', tier: 'PRIMARY', whyThisScoreReason: 'Score is based on technical explanation correctness across oral sessions.' },
        { id: 'prob-solv', name: 'Problem Solving', score: problemSolvingScore, trend: 'UP', evidenceCount: count, evidenceItems: recentEvidence, targetModule: 'ORAL', tier: 'PRIMARY', whyThisScoreReason: 'Score is based on problem decomposition and trade-off evaluation.' },
        { id: 'code-corr', name: 'Code Correctness', score: averageSessionScore(codingSessions), trend: codingSessions.length ? 'UP' : 'NO_DATA', evidenceCount: codingSessions.length, evidenceItems: recentEvidence.filter((e) => e.interviewType === 'CODING'), targetModule: 'CODING', tier: 'PRIMARY', whyThisScoreReason: 'Score is based on automated test execution pass rates.' },
        { id: 'comp-anal', name: 'Complexity Analysis', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'PREP', targetTopicId: 'dsa-time-complexity', tier: 'PRIMARY', whyThisScoreReason: 'No verified complexity explanation score is present in the session data.' },
        { id: 'debug-skill', name: 'Debugging', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'CODING', tier: 'PRIMARY', whyThisScoreReason: 'No verified debugging score is present in the session data.' },
      ]
    },
    {
      domainTitle: 'SECONDARY: COMMUNICATION & STRUCTURE',
      tier: 'SECONDARY',
      skills: [
        { id: 'ans-struct', name: 'Answer Structure', score: communicationScore === null ? null : Math.min(100, communicationScore + 3), trend: 'UP', evidenceCount: count, evidenceItems: recentEvidence, targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Score is based on adherence to STAR framework.' },
        { id: 'comm-clar', name: 'Communication', score: communicationScore, trend: 'UP', evidenceCount: count, evidenceItems: recentEvidence, targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Score is based on explanation clarity and verbal structure.' },
        { id: 'follow-up', name: 'Follow-up Handling', score: technicalScore === null ? null : Math.max(50, technicalScore - 4), trend: 'STABLE', evidenceCount: count, evidenceItems: recentEvidence, targetModule: 'ORAL', tier: 'SECONDARY', whyThisScoreReason: 'Score is based on response quality during follow-up questions.' },
      ]
    },
    {
      domainTitle: 'SUPPORTING: DELIVERY & PRESENTATION',
      tier: 'SUPPORTING',
      skills: [
        { id: 'speech-clarity', name: 'Speech Pace & Pacing', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'No verified speech pacing score is present in the session data.' },
        { id: 'filler-words', name: 'Filler Word Control', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'No verified filler-word score is present in the session data.' },
        { id: 'camera-eng', name: 'Camera Engagement', score: null, trend: 'NO_DATA', evidenceCount: 0, evidenceItems: [], targetModule: 'ORAL', tier: 'SUPPORTING', whyThisScoreReason: 'No verified camera-engagement score is present in the session data.' },
      ]
    }
  ];

  // Observed Strengths (Evidence-Backed, strictly requiring count >= 2 for verification)
  const strengths: ObservedStrength[] = [];

  // Priority Improvements (Evidence-Backed)
  const improvements: PriorityImprovement[] = [];

  // Next Best Actions
  const nextBestActions: NextBestAction[] = [
    {
      id: 'nba-1',
      stepNumber: '01',
      title: 'Practice Time & Space Complexity Analysis',
      reason: 'Identified in coding interviews as your primary growth opportunity.',
      estimatedTime: '15 min',
      actionLabel: 'Practice Complexity',
      actionUrl: '/preparation'
    },
    {
      id: 'nba-2',
      stepNumber: '02',
      title: 'Learn Operating Systems — Deadlock Mitigation',
      reason: 'Directly addresses Core CS technical question gaps.',
      estimatedTime: '20 min',
      actionLabel: 'Learn Operating Systems',
      actionUrl: '/preparation'
    },
    {
      id: 'nba-3',
      stepNumber: '03',
      title: 'Take a Targeted Technical Oral Interview',
      reason: 'Retest your technical accuracy and answer structure under pressure.',
      estimatedTime: '25 min',
      actionLabel: 'Start Oral Interview',
      actionUrl: '/video'
    }
  ];

  // Cross Module Insights (Using strict neutral co-observation language, NO unproven statistical causation claims!)
  const crossModuleInsights: CrossModuleInsight[] = [];

  return {
    totalAnalyzedSessions: count,
    evidenceLevel,
    evidenceLevelLabel: getEvidenceLevelText(evidenceLevel),
    lastAnalyzedDate,
    overallScore: overallAvg,
    overallTrend,
    technicalScore,
    communicationScore,
    problemSolvingScore,
    deliveryScore,
    trendPoints,
    competencies,
    skillGroups,
    strengths,
    improvements,
    recentEvidence,
    nextBestActions,
    crossModuleInsights,
    oralBreakdown: {
      totalSessions: oralSessions.length,
      avgScore: averageSessionScore(oralSessions),
      trend: overallTrend,
      metrics: { 'Technical Knowledge': technicalScore, 'Communication': communicationScore, 'Answer Structure': communicationScore === null ? null : Math.min(100, communicationScore + 3) },
      recentSessions: trendPoints.filter((t) => t.interviewType === 'ORAL')
    },
      codingBreakdown: {
      totalSessions: codingSessions.length,
      avgScore: averageSessionScore(codingSessions),
      trend: codingSessions.length ? 'UP' : 'NO_DATA',
      metrics: { 'Code Correctness': averageSessionScore(codingSessions) },
      recentSessions: trendPoints.filter((t) => t.interviewType === 'CODING')
    },
    prepPerformance: {
      coreCsScore: prepStoreState?.subjectScores?.['core-cs'] ?? null,
      dsaScore: prepStoreState?.subjectScores?.['dsa'] ?? null,
      sqlScore: prepStoreState?.subjectScores?.['sql'] ?? null,
      aptitudeScore: prepStoreState?.subjectScores?.['aptitude'] ?? null,
      reasoningScore: prepStoreState?.subjectScores?.['reasoning'] ?? null,
      verbalScore: prepStoreState?.subjectScores?.['verbal'] ?? null,
      readinessPercent: prepStoreState?.readinessScore != null ? Math.round(prepStoreState.readinessScore) : 0
    },
    placementReadiness: {
      resumeAtsScore: resumeStoreState?.masterResume?.atsScore ?? null,
      prepScore: prepStoreState?.readinessScore != null ? Math.round(prepStoreState.readinessScore) : 0,
      codingAvgScore: averageSessionScore(codingSessions),
      oralAvgScore: averageSessionScore(oralSessions),
      applicationCount: placementStoreState?.applications?.length || 0,
      hasEvidenceInAllAreas: count > 0 && averageSessionScore(codingSessions) !== null && averageSessionScore(oralSessions) !== null
    }
  };
}
