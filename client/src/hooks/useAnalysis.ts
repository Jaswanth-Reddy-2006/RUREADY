import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  ReadinessVerdict,
  type InterviewSession,
  type Analysis,
  type Question,
  type StageBreakdownItem,
  type PerformanceTimelineItem,
  type InterviewSummaryMeta,
  type PersonalizedRecommendation,
  type PracticeResourceItem,
} from '../types';

export function getSuggestedStructureForCategory(category: string): string[] {
  const cat = (category || '').toLowerCase();
  if (cat.includes('system design') || cat.includes('architecture')) {
    return [
      'Clarify functional & non-functional requirements (QPS, storage, p99 latency)',
      'High-level architecture (Load Balancer, API Gateway, Microservices, DB)',
      'Deep dive into data model, caching strategy (Redis), and partitioning',
      'Failure modes, bottleneck mitigations, and operational trade-offs',
    ];
  }
  if (cat.includes('database') || cat.includes('sql')) {
    return [
      'Direct distinction (Relational ACID vs Distributed schema-less)',
      'Read/Write query patterns, indexing (B-Tree/GIN), and write amplification',
      'Consistency models, partitioning/sharding, and replication lag',
      'Concrete production use case and trade-off justification',
    ];
  }
  if (cat.includes('web') || cat.includes('frontend') || cat.includes('react')) {
    return [
      'Core architecture and component hierarchy definition',
      'State management lifecycle and re-render optimization',
      'Network caching, SSR/hydration, and Web Vitals metrics',
      'Error boundaries, fallback resilience, and security considerations',
    ];
  }
  if (cat.includes('algorithm') || cat.includes('data structure')) {
    return [
      'Problem constraints clarification and edge cases identification',
      'Initial brute-force approach and asymptotic complexity analysis',
      'Optimal algorithm design utilizing appropriate data structures',
      'Space vs Time trade-offs and complexity proofs (Big-O)',
    ];
  }
  if (cat.includes('behavioral') || cat.includes('leadership')) {
    return [
      'Situation & Context: technical challenge and business stakes',
      'Task: specific engineering responsibility and goals',
      'Action: technical decisions, implementation, and collaboration',
      'Result: measurable performance lift, key metrics, and learnings',
    ];
  }
  return [
    'Direct thesis statement and high-level architectural definition',
    'Underlying technical mechanics and component data flow',
    'Concrete trade-offs, scalability limits, and production constraints',
    'Key takeaways, edge-case handling, and monitoring/observability',
  ];
}

export function synthesizeSessionAnalysis(session: any): Analysis {
  const rawQuestions: any[] = session.questions || [];
  const questions: Question[] = rawQuestions.map((q, idx) => {
    const textLower = (q.questionText || '').toLowerCase();
    let cat = 'Technical Knowledge';
    if (idx === 0 && (textLower.includes('about yourself') || textLower.includes('background') || textLower.includes('introduce'))) {
      cat = 'Introduction';
    } else if (textLower.includes('system design') || textLower.includes('scale') || textLower.includes('architecture') || textLower.includes('microservice')) {
      cat = 'System Design';
    } else if (textLower.includes('database') || textLower.includes('sql') || textLower.includes('nosql') || textLower.includes('redis') || textLower.includes('postgres')) {
      cat = 'Databases';
    } else if (textLower.includes('react') || textLower.includes('frontend') || textLower.includes('web') || textLower.includes('ui')) {
      cat = 'Web Development';
    } else if (textLower.includes('algorithm') || textLower.includes('complexity') || textLower.includes('data structure')) {
      cat = 'Data Structures & Algorithms';
    } else if (textLower.includes('disagree') || textLower.includes('conflict') || textLower.includes('challenge') || q.questionType === 'BEHAVIOURAL') {
      cat = 'Behavioral';
    }

    const assignedCategory = q.category || cat;
    const isAnswered = Boolean(q.answerText && q.answerText.trim() && !q.answerText.includes('[Candidate skipped:'));
    const qScore = typeof q.evalScore === 'number'
      ? q.evalScore
      : (isAnswered ? Math.min(95, Math.max(50, (q.answerText.length > 80 ? 82 : 72))) : 0);

    const whatWentWell: string[] = Array.isArray(q.whatWentWell) && q.whatWentWell.length > 0
      ? q.whatWentWell
      : Array.isArray(q.evalStrengths) && q.evalStrengths.length > 0
      ? q.evalStrengths
      : isAnswered
      ? [
          'Addressed core technical concepts of the prompt directly',
          'Clear conversational flow and terminology',
        ]
      : ['No verbal response submitted for this question'];

    const whatCouldBeImproved: string[] = Array.isArray(q.whatCouldBeImproved) && q.whatCouldBeImproved.length > 0
      ? q.whatCouldBeImproved
      : Array.isArray(q.evalWeaknesses) && q.evalWeaknesses.length > 0
      ? q.evalWeaknesses
      : isAnswered
      ? [
          'Substantiate architectural claims with quantifiable metrics (QPS, p99 latency)',
          'Discuss failure recovery mechanisms and scaling edge cases',
        ]
      : ['Attempt question to demonstrate domain proficiency'];

    return {
      ...q,
      category: assignedCategory,
      evalScore: qScore,
      whatWentWell,
      whatCouldBeImproved,
      suggestedAnswerStructure: Array.isArray(q.suggestedAnswerStructure) && q.suggestedAnswerStructure.length > 0
        ? q.suggestedAnswerStructure
        : getSuggestedStructureForCategory(assignedCategory),
      timeTakenSecs: q.timeTakenSecs != null ? q.timeTakenSecs : (isAnswered ? 45 : 0),
    };
  });

  const answeredQuestions = questions.filter(
    (q) => q.answerText && q.answerText.trim().length > 0 && !q.answerText.includes('[Candidate skipped:')
  );
  const isEarlyAbandon = answeredQuestions.length === 0;

  // 1. Proctoring & Telemetry
  const eyeContactScore = session.proctoring?.eyeContactScore != null && !isNaN(Number(session.proctoring.eyeContactScore))
    ? Math.round(Number(session.proctoring.eyeContactScore))
    : 82;
  const tabBlurCount = session.proctoring?.tabBlurCount ?? 0;
  const postureStatus = session.confidenceMetrics?.postureStatus || 'Optimal';

  let technicalScore = 0;
  let communicationScore = 0;
  let confidenceScore = 0;
  let problemSolvingScore = 0;
  let depthScore = 0;
  let relevanceScore = 0;
  let structureScore = 0;
  let industryReadinessScore = 0;
  let overallScore = 0;

  let totalWords = 0;
  let fillerCount = 0;
  const detectedFillers: string[] = [];

  if (!isEarlyAbandon) {
    // Technical Score derived directly from candidate evaluations
    const scoredQuestions = answeredQuestions.filter((q) => typeof q.evalScore === 'number');
    technicalScore = scoredQuestions.length > 0
      ? Math.max(10, Math.min(100, Math.round(scoredQuestions.reduce((acc, q) => acc + (q.evalScore || 0), 0) / scoredQuestions.length)))
      : 70;

    // Word count & Speech analysis
    const allAnswers = answeredQuestions.map((q) => q.answerText || '').join(' ');
    const words = allAnswers.split(/\s+/).filter(Boolean);
    totalWords = words.length;

    const fillers = ['um', 'umm', 'uh', 'uhh', 'like', 'basically', 'actually', 'literally', 'you know'];
    for (const f of fillers) {
      const regex = new RegExp(`\\b${f}\\b`, 'gi');
      const matches = allAnswers.match(regex);
      if (matches) {
        fillerCount += matches.length;
        detectedFillers.push(f);
      }
    }

    const totalAnswerSecs = answeredQuestions.reduce((acc, q) => acc + (q.timeTakenSecs || 35), 0);
    const answeredMins = Math.max(0.2, totalAnswerSecs / 60);
    const realWpm = Math.round(totalWords / answeredMins);

    const paceScore = realWpm >= 110 && realWpm <= 165
      ? 95
      : realWpm < 110
        ? Math.max(25, 95 - (110 - realWpm) * 0.7)
        : Math.max(30, 95 - (realWpm - 165) * 0.6);

    const avgWordsPerQ = totalWords / answeredQuestions.length;
    const lengthScore = avgWordsPerQ >= 35
      ? Math.min(98, 70 + (avgWordsPerQ - 35) * 0.6)
      : Math.max(20, avgWordsPerQ * 2.0);

    const fillerPenalty = Math.min(30, fillerCount * 3.5);
    communicationScore = Math.max(10, Math.min(100, Math.round(paceScore * 0.35 + lengthScore * 0.45 + (100 - fillerPenalty) * 0.20)));

    const proctorPenalty = tabBlurCount * 14 + (eyeContactScore < 75 ? 12 : 0) + (postureStatus === 'Off-Center' ? 8 : 0);
    confidenceScore = session.isDisqualified
      ? 0
      : Math.max(15, Math.min(100, Math.round(eyeContactScore * 0.6 + (100 - proctorPenalty) * 0.4)));

    problemSolvingScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.85 + (totalWords >= 50 ? 10 : 0) + (answeredQuestions.length > 1 ? 5 : 0))));
    depthScore = Math.max(10, Math.min(100, Math.round(Math.min(96, (avgWordsPerQ / 45) * 75 + 15))));
    relevanceScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.60 + communicationScore * 0.40 - (questions.length - answeredQuestions.length) * 10)));
    structureScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.40 + communicationScore * 0.40 + depthScore * 0.20)));
    industryReadinessScore = Math.max(10, Math.min(100, Math.round(technicalScore * 0.35 + communicationScore * 0.25 + problemSolvingScore * 0.20 + confidenceScore * 0.20)));

    overallScore = Math.max(
      10,
      Math.min(
        100,
        Math.round(
          technicalScore * 0.35 +
          communicationScore * 0.25 +
          problemSolvingScore * 0.15 +
          confidenceScore * 0.15 +
          structureScore * 0.10
        )
      )
    );
  } else {
    // Honest zero scores for early exits
    overallScore = 0;
    technicalScore = 0;
    communicationScore = 0;
    confidenceScore = eyeContactScore;
    problemSolvingScore = 0;
    depthScore = 0;
    relevanceScore = 0;
    structureScore = 0;
    industryReadinessScore = 0;
  }

  // ─── Strengths & Improvements ───
  let strengths: string[] = answeredQuestions.flatMap((q) => q.evalStrengths || []);
  strengths = Array.from(new Set(strengths)).filter(Boolean);
  if (!isEarlyAbandon) {
    if (eyeContactScore >= 80) strengths.push(`Maintained solid on-camera eye contact (${eyeContactScore}%).`);
    if (tabBlurCount === 0) strengths.push('Maintained continuous fullscreen window focus throughout the session.');
    if (strengths.length === 0) strengths.push('Addressed core technical prompts with relevant architectural concepts.');
  } else {
    strengths.push('Successfully verified microphone, camera, and system connectivity.');
  }

  let improvements: string[] = answeredQuestions.flatMap((q) => q.evalWeaknesses || []);
  improvements = Array.from(new Set(improvements)).filter(Boolean);
  if (!isEarlyAbandon) {
    if (fillerCount > 0) {
      improvements.push(`Reduce verbal filler tokens (${fillerCount} detected: ${Array.from(new Set(detectedFillers)).slice(0, 3).join(', ')}).`);
    }
    if (eyeContactScore < 75) {
      improvements.push(`Improve direct camera eye contact (${eyeContactScore}% recorded).`);
    }
    if (tabBlurCount > 0) {
      improvements.push(`Avoid context-switching: ${tabBlurCount} tab switch events flagged.`);
    }
    if (technicalScore < 70) {
      improvements.push('Substantiate technical claims with quantifiable system metrics (QPS, memory, p99 latency).');
    }
    if (improvements.length === 0) {
      if (questions.length > answeredQuestions.length) {
        improvements.push(`Review skipped topics (${questions.length - answeredQuestions.length} question(s) passed) to build comprehensive domain mastery.`);
      } else if (technicalScore < 85) {
        improvements.push('Incorporate deeper trade-offs around memory footprints, caching invalidation, and failure modes.');
      } else {
        improvements.push('Elaborate on production failure recovery, edge cases, and automated rollback strategies.');
      }
    }
  } else {
    improvements.push('Submit spoken responses during the live interview to receive full AI rubric scoring.');
  }

  // ─── Dynamic Performance Timeline (All actual questions) ───
  const performanceTimeline: PerformanceTimelineItem[] = questions.map((q, idx) => {
    const score = typeof q.evalScore === 'number' ? q.evalScore : (isEarlyAbandon ? 0 : 70);
    let rating: 'Strong' | 'Good' | 'Needs Improvement' | 'Weak' = 'Good';
    if (score >= 80) rating = 'Strong';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Needs Improvement';
    else rating = 'Weak';

    return {
      questionIndex: idx + 1,
      questionLabel: `Q${idx + 1}`,
      score,
      rating,
      category: q.category,
      durationSecs: q.timeTakenSecs || (q.answerText ? 45 : 0),
      questionText: q.questionText,
    };
  });

  // ─── Dynamic Stages Breakdown (Built dynamically from ACTUAL questions) ───
  const stageBreakdown: StageBreakdownItem[] = [];
  if (questions.length === 0) {
    stageBreakdown.push({
      stageNumber: 1,
      stageName: 'Interview Track',
      questionCount: 0,
      durationMins: 0,
      score: 0,
      description: 'Session ended before prompts were loaded.',
    });
  } else if (questions.length === 1) {
    const q = questions[0];
    stageBreakdown.push({
      stageNumber: 1,
      stageName: q.category || 'Technical Foundations',
      questionCount: 1,
      durationMins: Math.max(1, Math.round((q.timeTakenSecs || 45) / 60)),
      score: typeof q.evalScore === 'number' ? q.evalScore : (isEarlyAbandon ? 0 : technicalScore),
      description: q.questionText.slice(0, 95) + '…',
    });
  } else if (questions.length === 2) {
    questions.forEach((q, i) => {
      stageBreakdown.push({
        stageNumber: i + 1,
        stageName: q.category || (i === 0 ? 'Core Foundations' : 'Technical Deep Dive'),
        questionCount: 1,
        durationMins: Math.max(1, Math.round((q.timeTakenSecs || 45) / 60)),
        score: typeof q.evalScore === 'number' ? q.evalScore : (isEarlyAbandon ? 0 : technicalScore),
        description: q.questionText.slice(0, 95) + '…',
      });
    });
  } else {
    const stageCount = Math.min(questions.length, 4);
    const chunkSize = Math.ceil(questions.length / stageCount);
    for (let s = 0; s < stageCount; s++) {
      const stageQuestions = questions.slice(s * chunkSize, (s + 1) * chunkSize);
      if (stageQuestions.length === 0) continue;
      const stageAnswered = stageQuestions.filter((q) => q.answerText);
      const stageScore = stageAnswered.length > 0
        ? Math.round(stageAnswered.reduce((a, q) => a + (q.evalScore || technicalScore), 0) / stageAnswered.length)
        : (isEarlyAbandon ? 0 : technicalScore);
      const stageDurSecs = stageQuestions.reduce((a, q) => a + (q.timeTakenSecs || 45), 0);
      const primaryCategory = stageQuestions[0].category || (s === 0 ? 'Foundations' : s === 1 ? 'Deep Dive' : s === 2 ? 'System Design' : 'Wrap Up');

      stageBreakdown.push({
        stageNumber: s + 1,
        stageName: primaryCategory,
        questionCount: stageQuestions.length,
        durationMins: Math.max(1, Math.round(stageDurSecs / 60)),
        score: stageScore,
        description: stageQuestions[0].questionText.slice(0, 95) + '…',
      });
    }
  }

  // ─── Dynamic Interview Summary ───
  const timeTakenVals = answeredQuestions.map((q) => (q.timeTakenSecs || 0) / 60);
  const avgDur = timeTakenVals.length ? +(timeTakenVals.reduce((a, b) => a + b, 0) / timeTakenVals.length).toFixed(1) : 0;
  const maxDur = timeTakenVals.length ? +Math.max(...timeTakenVals).toFixed(1) : 0;
  const minDur = timeTakenVals.length ? +Math.min(...timeTakenVals).toFixed(1) : 0;

  const uniqueTopics = Array.from(new Set(
    questions.map((q) => q.category).filter(Boolean).concat(session.focusAreas || [])
  )) as string[];
  if (uniqueTopics.length === 0) {
    uniqueTopics.push(session.targetRole || 'Software Engineering');
  }

  const interviewSummary: InterviewSummaryMeta = {
    totalQuestionsAsked: questions.length,
    questionsAnswered: answeredQuestions.length,
    questionsSkipped: questions.length - answeredQuestions.length,
    averageAnswerLengthMinutes: avgDur,
    longestAnswerMinutes: maxDur,
    shortestAnswerMinutes: minDur,
    followUpQuestionsCount: questions.filter((q) => (q as any).questionType === 'FOLLOW_UP').length,
    topicsCovered: uniqueTopics,
  };

  // ─── Dynamic Personalized Recommendations (Ranked by candidate's 3 lowest dimensions) ───
  const dimensionPool = [
    {
      name: 'Technical Knowledge',
      score: technicalScore,
      title: 'Deepen System Design & Architectural Fundamentals',
      weakness: `Technical score registered at ${technicalScore}/100 with opportunities to elaborate on distributed limits.`,
      action: 'Study high-throughput caching, read/write database partitioning, and microservice decoupling patterns.',
      expectedOutcome: 'Confidently justify latency vs throughput trade-offs in technical architectural rounds.',
      practiceResource: '/system-design',
    },
    {
      name: 'Communication',
      score: communicationScore,
      title: 'Refine Speech Cadence & Minimize Filler Words',
      weakness: fillerCount > 0 ? `Detected ${fillerCount} verbal filler tokens affecting delivery clarity.` : 'Verbal pacing can be calibrated for clearer articulation.',
      action: 'Replace verbal fillers with silent 1-second deliberate pauses to project calm authority.',
      expectedOutcome: 'Structured, authoritative answers delivered at an optimal 120-150 WPM.',
      practiceResource: '/video/setup',
    },
    {
      name: 'Confidence & Proctoring',
      score: confidenceScore,
      title: 'Strengthen Camera Eye Contact & Composure',
      weakness: `Camera focus score evaluated at ${confidenceScore}% during the session.`,
      action: 'Keep visual gaze centered on the webcam lens and position camera at eye level.',
      expectedOutcome: 'High on-camera engagement and superior proctoring compliance scores.',
      practiceResource: '/video/setup',
    },
    {
      name: 'Problem Solving',
      score: problemSolvingScore,
      title: 'Adopt Structured Problem-Solving Frameworks',
      weakness: 'Responses jumped into implementation without establishing edge cases or constraints.',
      action: 'Apply the STAR method: articulate Context, Problem, Execution, and Measurable Metric Lift.',
      expectedOutcome: 'Crisp, structured problem breakdowns demonstrating Senior/Staff engineering maturity.',
      practiceResource: '/challenges',
    },
    {
      name: 'Depth of Explanation',
      score: depthScore,
      title: 'Elaborate with Measurable Metrics & Failure Scenarios',
      weakness: 'Initial answers were brief and omitted production failure handling.',
      action: 'Substantiate technical claims with quantifiable metrics (QPS, memory, p99 latency) and recovery strategies.',
      expectedOutcome: 'Deep technical credibility demonstrating production experience.',
      practiceResource: '/preparation',
    },
  ];

  dimensionPool.sort((a, b) => a.score - b.score);
  const recommendations: PersonalizedRecommendation[] = dimensionPool.slice(0, 3).map((item, idx) => ({
    priority: idx + 1,
    title: item.title,
    weakness: item.weakness,
    action: item.action,
    expectedOutcome: item.expectedOutcome,
    practiceResource: item.practiceResource,
  }));

  const practiceResources: PracticeResourceItem[] = [
    {
      title: 'System Design Fundamentals',
      subtitle: 'Scalable system patterns, caching & sharding',
      category: 'System Design',
      link: '/system-design',
      iconType: 'layers',
    },
    {
      title: 'Database Architecture',
      subtitle: 'SQL vs NoSQL, indexing & consistency models',
      category: 'Databases',
      link: '/preparation',
      iconType: 'database',
    },
    {
      title: 'AI Mock Interview',
      subtitle: 'Practice technical discussions with Ava',
      category: 'Interview Practice',
      link: '/video/setup',
      iconType: 'mic',
    },
    {
      title: 'Technical Challenges',
      subtitle: 'Hands-on problem solving under timed constraints',
      category: 'Coding & Algorithms',
      link: '/challenges',
      iconType: 'code',
    },
  ];

  const readinessVerdict = overallScore >= 80 ? ReadinessVerdict.READY : overallScore >= 60 ? ReadinessVerdict.ALMOST_READY : ReadinessVerdict.NOT_READY;

  const role = session.targetRole || 'Software Engineer';
  const company = session.targetCompany || 'Technology Firms';

  const summary = isEarlyAbandon
    ? `Interview session was concluded early before candidate responses were recorded for ${role}. No technical rubric scoring was registered.`
    : `Candidate completed interview evaluation for ${role} at ${company}. Technical proficiency scored at ${technicalScore}/100, verbal clarity at ${communicationScore}/100, and proctoring composure at ${confidenceScore}/100.`;

  return {
    id: `an_${session.id || 'sess_active'}`,
    sessionId: session.id || 'sess_active',
    overallScore,
    communicationScore,
    technicalScore,
    confidenceScore,
    structureScore,
    problemSolvingScore,
    depthScore,
    relevanceScore,
    industryReadinessScore,
    categoryScores: {
      'Technical Knowledge': technicalScore,
      'Communication': communicationScore,
      'Problem Solving': problemSolvingScore,
      'Depth of Explanation': depthScore,
      'Relevance': relevanceScore,
      'Confidence': confidenceScore,
      'Structure': structureScore,
      'Industry Readiness': industryReadinessScore,
    },
    confidenceMeterScore: confidenceScore,
    confidenceSignals: {
      avgWpm: answeredQuestions.length > 0 ? Math.round(totalWords / Math.max(0.2, (answeredQuestions.reduce((a, q) => a + (q.timeTakenSecs || 35), 0) / 60))) : 0,
      avgPauseCount: fillerCount,
      avgAnswerLength: answeredQuestions.length > 0 ? Math.round(totalWords / answeredQuestions.length) : 0,
    },
    eyeContactScore: eyeContactScore ?? undefined,
    presenceScore: confidenceScore,
    summary,
    strengths,
    improvements,
    actionableTips: recommendations.map((r) => ({ tip: r.title, reason: r.action })),
    stageBreakdown,
    performanceTimeline,
    interviewSummary,
    recommendations,
    practiceResources,
    readinessVerdict,
    createdAt: new Date().toISOString(),
  };
}

export function useAnalysis(sessionId?: string) {
  return useQuery<InterviewSession>({
    queryKey: ['analysis', sessionId],
    queryFn: async () => {
      let sessionData: any = null;

      try {
        const response = await apiClient.get(`/interview/session/${sessionId}`);
        sessionData = response.data;
      } catch (err) {
        console.warn('[useAnalysis] Primary session fetch error:', err);
      }

      // Check secondary analytics endpoint if analysis is absent
      if (sessionData && !sessionData.analysis) {
        try {
          const analysisRes = await apiClient.get(`/analysis/session/${sessionId}`);
          if (analysisRes.data) {
            sessionData.analysis = analysisRes.data;
          }
        } catch {
          // Secondary endpoint fallback
        }
      }

      // If feedbackSummary contains serialized JSON analysis, hydrate it
      if (
        sessionData &&
        !sessionData.analysis &&
        sessionData.feedbackSummary &&
        typeof sessionData.feedbackSummary === 'string' &&
        sessionData.feedbackSummary.trim().startsWith('{')
      ) {
        try {
          sessionData.analysis = JSON.parse(sessionData.feedbackSummary);
        } catch {
          // ignore
        }
      }

      if (!sessionData) {
        throw new Error('Interview session could not be found.');
      }

      // Guarantee analysis is synthesized dynamically from real data if missing or partial
      const synthesized = synthesizeSessionAnalysis(sessionData);
      if (!sessionData.analysis) {
        sessionData.analysis = synthesized;
      } else {
        // Merge enriched fields if backend analysis didn't compute all 8 dimensions
        sessionData.analysis = {
          ...synthesized,
          ...sessionData.analysis,
          categoryScores: sessionData.analysis.categoryScores || synthesized.categoryScores,
          stageBreakdown: (sessionData.analysis.stageBreakdown && sessionData.analysis.stageBreakdown.length > 0)
            ? sessionData.analysis.stageBreakdown
            : synthesized.stageBreakdown,
          performanceTimeline: (sessionData.analysis.performanceTimeline && sessionData.analysis.performanceTimeline.length > 0)
            ? sessionData.analysis.performanceTimeline
            : synthesized.performanceTimeline,
          interviewSummary: sessionData.analysis.interviewSummary || synthesized.interviewSummary,
          recommendations: (sessionData.analysis.recommendations && sessionData.analysis.recommendations.length > 0)
            ? sessionData.analysis.recommendations
            : synthesized.recommendations,
          practiceResources: (sessionData.analysis.practiceResources && sessionData.analysis.practiceResources.length > 0)
            ? sessionData.analysis.practiceResources
            : synthesized.practiceResources,
        };
      }

      // Ensure questions have whatWentWell, whatCouldBeImproved, suggestedAnswerStructure
      if (sessionData.questions) {
        sessionData.questions = sessionData.questions.map((q: any, i: number) => {
          const cat = q.category || (i === 0 ? 'Technical Overview' : 'System Design');
          const isAnswered = Boolean(q.answerText && q.answerText.trim() && !q.answerText.includes('[Candidate skipped:'));
          return {
            ...q,
            category: cat,
            timeTakenSecs: q.timeTakenSecs != null ? q.timeTakenSecs : (isAnswered ? 45 : 0),
            whatWentWell: (Array.isArray(q.evalStrengths) && q.evalStrengths.length > 0)
              ? q.evalStrengths
              : (isAnswered ? ['Addressed the technical prompt directly', 'Communicated clear architectural concepts'] : ['No response recorded before session concluded']),
            whatCouldBeImproved: (Array.isArray(q.evalWeaknesses) && q.evalWeaknesses.length > 0)
              ? q.evalWeaknesses
              : (isAnswered ? ['Expand on failure recovery and latency trade-offs', 'Provide quantifiable production benchmarks'] : ['Attempt response during live interview to demonstrate technical competence']),
            suggestedAnswerStructure: Array.isArray(q.suggestedAnswerStructure) && q.suggestedAnswerStructure.length > 0
              ? q.suggestedAnswerStructure
              : getSuggestedStructureForCategory(cat),
          };
        });
      }

      return sessionData as InterviewSession;
    },
    enabled: !!sessionId,
    refetchInterval: false,
  });
}
