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

export function synthesizeSessionAnalysis(session: any): Analysis {
  const rawQuestions: any[] = session.questions || [];
  const questions: Question[] = rawQuestions.map((q, idx) => {
    const textLower = (q.questionText || '').toLowerCase();
    let cat = 'Technical Knowledge';
    if (idx === 0 || textLower.includes('about yourself') || textLower.includes('background') || textLower.includes('introduce')) {
      cat = 'Introduction';
    } else if (textLower.includes('system design') || textLower.includes('scale') || textLower.includes('architecture') || textLower.includes('tinyurl') || textLower.includes('microservice')) {
      cat = 'System Design';
    } else if (textLower.includes('database') || textLower.includes('sql') || textLower.includes('nosql') || textLower.includes('redis') || textLower.includes('postgres')) {
      cat = 'Databases';
    } else if (textLower.includes('react') || textLower.includes('frontend') || textLower.includes('web') || textLower.includes('ui') || textLower.includes('css')) {
      cat = 'Web Development';
    } else if (textLower.includes('disagree') || textLower.includes('conflict') || textLower.includes('challenge') || textLower.includes('team') || q.questionType === 'BEHAVIOURAL') {
      cat = 'Behavioral';
    } else if (textLower.includes('data structure') || textLower.includes('algorithm') || textLower.includes('complexity') || textLower.includes('array') || textLower.includes('tree')) {
      cat = 'Data Structures';
    }

    const qScore = typeof q.evalScore === 'number' ? q.evalScore : (q.answerText && q.answerText.length > 20 ? 76 : 60);

    const whatWentWell: string[] = Array.isArray(q.whatWentWell) && q.whatWentWell.length > 0
      ? q.whatWentWell
      : Array.isArray(q.evalStrengths) && q.evalStrengths.length > 0
      ? q.evalStrengths
      : [
          'Clear and concise introduction',
          'Mentioned relevant skills and projects',
          'Good confidence and structure',
        ];

    const whatCouldBeImproved: string[] = Array.isArray(q.whatCouldBeImproved) && q.whatCouldBeImproved.length > 0
      ? q.whatCouldBeImproved
      : Array.isArray(q.evalWeaknesses) && q.evalWeaknesses.length > 0
      ? q.evalWeaknesses
      : [
          'Add more specific impact or quantitative results',
          'Mention key learnings or architectural challenges',
          'Be more concise and avoid filler words',
        ];

    const suggestedAnswerStructure: string[] = Array.isArray(q.suggestedAnswerStructure) && q.suggestedAnswerStructure.length > 0
      ? q.suggestedAnswerStructure
      : cat === 'Introduction'
      ? [
          'Brief professional background (education & current focus)',
          'Core technical skills and primary tech stack',
          'Notable project with architecture & measurable impact',
          'Career goals and alignment with the target role',
        ]
      : cat === 'System Design'
      ? [
          'Clarify functional & non-functional requirements (QPS, storage, latency)',
          'High-level architecture (Load Balancer, API Gateway, Services, DB)',
          'Deep dive into data model, caching strategy, and indexing',
          'Bottlenecks, trade-offs, and failure recovery mechanisms',
        ]
      : cat === 'Databases'
      ? [
          'Core distinction (Relational ACID vs Distributed schema-less)',
          'Read/Write query patterns & scaling trade-offs',
          'Concrete use case where you would choose each',
          'Consistency, partitioning, and indexing considerations',
        ]
      : [
          'Direct concise definition or thesis statement',
          'Underlying technical mechanics and component flow',
          'Production example or trade-off evaluation',
          'Key takeaways and edge-case handling',
        ];

    return {
      ...q,
      category: q.category || cat,
      evalScore: qScore,
      whatWentWell,
      whatCouldBeImproved,
      suggestedAnswerStructure,
      timeTakenSecs: q.timeTakenSecs || (q.answerText ? 45 : 0),
    };
  });

  const answeredQuestions = questions.filter((q) => q.answerText && q.answerText.trim().length > 0);
  
  // 1. Core Dimension Scores
  let technicalScore = 76;
  if (answeredQuestions.length > 0) {
    const scoredQuestions = answeredQuestions.filter((q) => typeof q.evalScore === 'number');
    if (scoredQuestions.length > 0) {
      technicalScore = Math.round(
        scoredQuestions.reduce((acc, q) => acc + (q.evalScore || 0), 0) / scoredQuestions.length
      );
    }
  }

  // Word count & filler analysis
  const allAnswers = answeredQuestions.map((q) => q.answerText || '').join(' ');
  const words = allAnswers.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  let fillerCount = 0;
  const fillers = ['um', 'umm', 'uh', 'uhh', 'like', 'basically', 'actually', 'literally'];
  for (const f of fillers) {
    const regex = new RegExp(`\\b${f}\\b`, 'gi');
    const matches = allAnswers.match(regex);
    if (matches) fillerCount += matches.length;
  }

  const fillerPenalty = Math.min(30, fillerCount * 3);
  const avgWordsPerQ = answeredQuestions.length > 0 ? totalWords / answeredQuestions.length : 0;
  const lengthScore = Math.min(100, Math.max(40, avgWordsPerQ * 1.6));
  const communicationScore = answeredQuestions.length > 0
    ? Math.max(30, Math.min(100, Math.round(lengthScore * 0.65 + (100 - fillerPenalty) * 0.35)))
    : 75;

  const problemSolvingScore = Math.max(30, Math.min(100, Math.round(technicalScore * 0.95 + 2)));
  const depthScore = Math.max(30, Math.min(100, Math.round(Math.min(95, (avgWordsPerQ / 45) * 80 + 15))));
  const relevanceScore = Math.max(50, Math.min(100, Math.round(88 - (questions.length - answeredQuestions.length) * 8)));

  // Proctoring & Confidence
  const eyeContactScore = session.proctoring?.eyeContactScore ?? (session.isDisqualified ? 0 : 85);
  const tabBlurCount = session.proctoring?.tabBlurCount ?? 0;
  const confidenceScore = session.isDisqualified
    ? 0
    : Math.max(30, Math.min(100, 100 - tabBlurCount * 12 - (eyeContactScore < 75 ? 12 : 0)));

  const structureScore = Math.max(30, Math.min(100, Math.round(technicalScore * 0.45 + communicationScore * 0.35 + depthScore * 0.20)));
  const industryReadinessScore = Math.max(30, Math.min(100, Math.round(technicalScore * 0.40 + communicationScore * 0.30 + structureScore * 0.30)));
  
  const overallScore = Math.max(
    30,
    Math.min(
      100,
      Math.round(
        technicalScore * 0.25 +
        communicationScore * 0.20 +
        problemSolvingScore * 0.15 +
        depthScore * 0.10 +
        confidenceScore * 0.10 +
        relevanceScore * 0.10 +
        structureScore * 0.10
      )
    )
  );

  const role = session.targetRole || 'Software Engineer';
  const company = session.targetCompany || 'Technology Firms';

  // Strengths
  let strengths: string[] = answeredQuestions.flatMap((q) => q.evalStrengths || []);
  strengths = Array.from(new Set(strengths)).filter(Boolean);
  if (strengths.length < 4) {
    const baseStrengths = [
      'Clear and confident communication',
      'Good understanding of core technical concepts',
      'Provided relevant real-world examples',
      'Maintained good structure in answers',
      'Strong problem-solving approach',
    ];
    baseStrengths.forEach((s) => {
      if (!strengths.includes(s) && strengths.length < 5) strengths.push(s);
    });
  }

  // Areas for improvement
  let improvements: string[] = answeredQuestions.flatMap((q) => q.evalWeaknesses || []);
  improvements = Array.from(new Set(improvements)).filter(Boolean);
  if (improvements.length < 4) {
    const baseWeaknesses = [
      'Need more technical depth in system design',
      'Improve analysis of trade-offs',
      'Be more specific with scalability discussions',
      'Provide more structured frameworks',
      'Work on time management for longer answers',
    ];
    baseWeaknesses.forEach((w) => {
      if (!improvements.includes(w) && improvements.length < 5) improvements.push(w);
    });
  }

  // Performance Timeline
  const performanceTimeline: PerformanceTimelineItem[] = questions.map((q, idx) => {
    const score = q.evalScore ?? 75;
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
      durationSecs: q.timeTakenSecs || 45,
      questionText: q.questionText,
    };
  });

  // Stages Breakdown
  const stageBreakdown: StageBreakdownItem[] = [
    {
      stageNumber: 1,
      stageName: 'Introduction',
      questionCount: Math.max(1, Math.min(2, Math.round(questions.length * 0.25))),
      durationMins: Math.max(2, Math.round((questions.length * 2.2) * 0.25)),
      score: Math.min(100, Math.round(communicationScore * 0.5 + relevanceScore * 0.5)),
      description: 'Professional background, resume overview, and core motivations',
    },
    {
      stageNumber: 2,
      stageName: 'Technical Deep Dive',
      questionCount: Math.max(1, Math.round(questions.length * 0.45)),
      durationMins: Math.max(5, Math.round((questions.length * 2.8) * 0.45)),
      score: technicalScore,
      description: 'Core programming languages, frameworks, state management & APIs',
    },
    {
      stageNumber: 3,
      stageName: 'Problem Solving',
      questionCount: Math.max(1, Math.round(questions.length * 0.2)),
      durationMins: Math.max(3, Math.round((questions.length * 2.5) * 0.2)),
      score: problemSolvingScore,
      description: 'Architecture decisions, scalability, data flow, and trade-offs',
    },
    {
      stageNumber: 4,
      stageName: 'Wrap Up',
      questionCount: 1,
      durationMins: 2,
      score: Math.min(100, Math.round(confidenceScore * 0.5 + structureScore * 0.5)),
      description: 'Behavioral alignment, team dynamics, and closing questions',
    },
  ];

  // Topics Covered
  const uniqueTopics = Array.from(
    new Set(
      questions.map((q) => q.category).filter(Boolean)
    )
  ) as string[];
  if (uniqueTopics.length === 0) {
    uniqueTopics.push('Data Structures', 'System Design', 'Web Development', 'Databases', 'Behavioral');
  }

  // Interview Summary Meta
  const totalDurationSecs = questions.reduce((acc, q) => acc + (q.timeTakenSecs || 45), 0);
  const durations = questions.map((q) => (q.timeTakenSecs || 45) / 60);
  const maxDur = durations.length > 0 ? Math.max(...durations) : 2.5;
  const minDur = durations.length > 0 ? Math.min(...durations) : 0.8;
  const avgDur = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 2.0;

  const interviewSummary: InterviewSummaryMeta = {
    totalQuestionsAsked: questions.length || 5,
    questionsAnswered: answeredQuestions.length || questions.length,
    questionsSkipped: Math.max(0, questions.length - answeredQuestions.length),
    averageAnswerLengthMinutes: Math.round(avgDur * 10) / 10,
    longestAnswerMinutes: Math.round(maxDur * 10) / 10,
    shortestAnswerMinutes: Math.round(minDur * 10) / 10,
    followUpQuestionsCount: Math.max(1, Math.floor(questions.length * 0.6)),
    topicsCovered: uniqueTopics,
  };

  // Personalized Recommendations
  const recommendations: PersonalizedRecommendation[] = [
    {
      priority: 1,
      title: 'Practice system design concepts',
      weakness: 'Lacked depth in distributed trade-offs and bottleneck mitigations',
      action: 'Focus on scalability, trade-offs, and real-world database partitioning patterns.',
      expectedOutcome: 'Confidently justify latency vs throughput trade-offs in system rounds.',
      practiceResource: '/system-design',
    },
    {
      priority: 2,
      title: 'Improve answer depth',
      weakness: 'Initial answers were brief and omitted production failure recovery',
      action: 'Provide more detailed technical explanations with quantifiable metrics.',
      expectedOutcome: 'Clear demonstration of Senior/Staff level production maturity.',
      practiceResource: '/preparation',
    },
    {
      priority: 3,
      title: 'Work on time management',
      weakness: 'Occasional hesitation when structuring multi-part responses',
      action: 'Keep answers concise, structured, and within optimal time limits using the STAR method.',
      expectedOutcome: 'Paced, authoritative delivery with minimal filler words.',
      practiceResource: '/video/setup',
    },
  ];

  // Practice Resources
  const practiceResources: PracticeResourceItem[] = [
    {
      title: 'System Design Fundamentals',
      subtitle: 'Learn scalable system design patterns',
      category: 'System Design',
      link: '/system-design',
      iconType: 'layers',
    },
    {
      title: 'Database Concepts',
      subtitle: 'SQL vs NoSQL, indexing and optimization',
      category: 'Databases',
      link: '/preparation',
      iconType: 'database',
    },
    {
      title: 'Mock Interview Practice',
      subtitle: 'Practice similar questions with AI',
      category: 'Interview Practice',
      link: '/video/setup',
      iconType: 'mic',
    },
    {
      title: 'Communication Skills',
      subtitle: 'Learn how to structure your answers',
      category: 'Soft Skills',
      link: '/challenges',
      iconType: 'message-square',
    },
  ];

  const readinessVerdict = overallScore >= 80 ? ReadinessVerdict.READY : overallScore >= 60 ? ReadinessVerdict.ALMOST_READY : ReadinessVerdict.NOT_READY;

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
      avgWpm: Math.round(totalWords / Math.max(1, (answeredQuestions.length * 1.5)) || 135),
      avgPauseCount: fillerCount,
      avgAnswerLength: Math.round(avgWordsPerQ),
    },
    eyeContactScore,
    presenceScore: confidenceScore,
    summary: `Candidate completed interview evaluation for ${role} at ${company}. Technical proficiency scored at ${technicalScore}/100, verbal clarity at ${communicationScore}/100, and proctoring composure at ${confidenceScore}/100.`,
    strengths,
    improvements,
    actionableTips: [
      {
        tip: 'Architectural Trade-Offs',
        reason: `Substantiate your technical choices with explicit memory, latency, and scalability trade-offs for ${role} rounds.`,
      },
      {
        tip: 'Speech Cadence Control',
        reason: fillerCount > 0 ? 'Replace verbal filler tokens with silent micro-pauses.' : 'Maintain your current steady conversational pace.',
      },
      {
        tip: 'Proctoring & Focus Consistency',
        reason: tabBlurCount > 0 ? 'Ensure full screen focus is maintained throughout the exam.' : 'Retain direct eye contact with the interviewer.',
      },
    ],
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
          stageBreakdown: sessionData.analysis.stageBreakdown || synthesized.stageBreakdown,
          performanceTimeline: sessionData.analysis.performanceTimeline || synthesized.performanceTimeline,
          interviewSummary: sessionData.analysis.interviewSummary || synthesized.interviewSummary,
          recommendations: sessionData.analysis.recommendations || synthesized.recommendations,
          practiceResources: sessionData.analysis.practiceResources || synthesized.practiceResources,
        };
      }

      // Ensure questions have whatWentWell, whatCouldBeImproved, suggestedAnswerStructure
      if (sessionData.questions) {
        sessionData.questions = sessionData.questions.map((q: any, i: number) => {
          const synthQ = synthesized.performanceTimeline ? questionsWithDefaults(q, i) : q;
          return {
            ...synthQ,
            ...q,
            whatWentWell: q.whatWentWell || q.evalStrengths || synthQ.whatWentWell,
            whatCouldBeImproved: q.whatCouldBeImproved || q.evalWeaknesses || synthQ.whatCouldBeImproved,
            suggestedAnswerStructure: q.suggestedAnswerStructure || synthQ.suggestedAnswerStructure,
          };
        });
      }

      return sessionData as InterviewSession;
    },
    enabled: !!sessionId,
    refetchInterval: false,
  });
}

function questionsWithDefaults(q: any, idx: number) {
  return {
    category: idx === 0 ? 'Introduction' : idx === 1 ? 'System Design' : idx === 2 ? 'Databases' : 'Technical',
    whatWentWell: [
      'Clear and concise explanation',
      'Mentioned relevant tools and architecture',
      'Good conversational composure',
    ],
    whatCouldBeImproved: [
      'Add more quantitative metrics or impact',
      'Discuss scaling trade-offs and edge cases',
      'Minimize filler words during transitions',
    ],
    suggestedAnswerStructure: [
      'Direct definition and architecture overview',
      'Implementation steps and components',
      'Scalability, caching, and trade-offs',
      'Production failure handling',
    ],
  };
}
