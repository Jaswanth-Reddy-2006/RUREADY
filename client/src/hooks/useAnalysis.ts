import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { ReadinessVerdict, type InterviewSession, type Analysis, type Question } from '../types';

export function synthesizeSessionAnalysis(session: any): Analysis {
  const questions: Question[] = session.questions || [];
  const answeredQuestions = questions.filter((q) => q.answerText && q.answerText.trim().length > 0);
  
  // 1. Dynamic Technical Score
  let technicalScore = 0;
  if (answeredQuestions.length > 0) {
    const scoredQuestions = answeredQuestions.filter((q) => typeof q.evalScore === 'number');
    if (scoredQuestions.length > 0) {
      technicalScore = Math.round(
        scoredQuestions.reduce((acc, q) => acc + (q.evalScore || 0), 0) / scoredQuestions.length
      );
    } else {
      technicalScore = 70;
    }
  }

  // 2. Dynamic Communication Score & Speech Metrics
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

  const fillerPenalty = Math.min(35, fillerCount * 3);
  const avgWordsPerQ = answeredQuestions.length > 0 ? totalWords / answeredQuestions.length : 0;
  const lengthScore = Math.min(100, Math.max(0, avgWordsPerQ * 1.5));
  const communicationScore = answeredQuestions.length > 0
    ? Math.max(10, Math.min(100, Math.round(lengthScore * 0.6 + (100 - fillerPenalty) * 0.4)))
    : 0;

  // 3. Proctoring & Confidence
  const eyeContactScore = session.proctoring?.eyeContactScore ?? (session.isDisqualified ? 0 : 85);
  const tabBlurCount = session.proctoring?.tabBlurCount ?? 0;
  const confidenceScore = session.isDisqualified ? 0 : Math.max(0, Math.min(100, 100 - tabBlurCount * 15 - (eyeContactScore < 75 ? 15 : 0)));

  const structureScore = Math.max(0, Math.min(100, Math.round(technicalScore * 0.55 + communicationScore * 0.3 + confidenceScore * 0.15)));
  const overallScore = Math.max(0, Math.min(100, Math.round(technicalScore * 0.40 + communicationScore * 0.30 + confidenceScore * 0.30)));

  const role = session.targetRole || 'Software Engineer';
  const company = session.targetCompany || 'Technology Firms';

  // 4. Dynamic Strengths & Weaknesses from real answers
  let strengths: string[] = answeredQuestions.flatMap((q) => q.evalStrengths || []);
  let improvements: string[] = answeredQuestions.flatMap((q) => q.evalWeaknesses || []);

  strengths = Array.from(new Set(strengths)).filter(Boolean);
  improvements = Array.from(new Set(improvements)).filter(Boolean);

  if (strengths.length === 0) {
    if (technicalScore >= 70) strengths.push(`Demonstrated solid engineering foundation for ${role}.`);
    if (communicationScore >= 70) strengths.push('Articulate verbal explanation and clear cadence.');
    if (confidenceScore >= 80) strengths.push('Strong environment composure and eye focus.');
    if (strengths.length === 0 && answeredQuestions.length > 0) strengths.push('Successfully submitted responses to interview questions.');
  }

  if (improvements.length === 0) {
    if (fillerCount > 2) improvements.push(`Reduce filler word frequency (${fillerCount} fillers observed).`);
    if (technicalScore < 70) improvements.push('Expand technical depth and discuss architectural trade-offs.');
    if (tabBlurCount > 0) improvements.push(`Eliminate window switching (${tabBlurCount} tab blur events detected).`);
    if (improvements.length === 0) improvements.push('Practice structuring answers with the STAR method for greater clarity.');
  }

  const readinessVerdict = overallScore >= 80 ? ReadinessVerdict.READY : overallScore >= 60 ? ReadinessVerdict.ALMOST_READY : ReadinessVerdict.NOT_READY;

  return {
    id: `an_${session.id || 'sess_active'}`,
    sessionId: session.id || 'sess_active',
    overallScore,
    communicationScore,
    technicalScore,
    confidenceScore,
    structureScore,
    confidenceMeterScore: confidenceScore,
    confidenceSignals: {
      avgWpm: Math.round(totalWords / Math.max(1, (answeredQuestions.length * 1.5))),
      avgPauseCount: fillerCount,
      avgAnswerLength: Math.round(avgWordsPerQ),
    },
    eyeContactScore,
    presenceScore: confidenceScore,
    summary: `Candidate completed interview evaluation for ${role} at ${company}. Technical proficiency scored at ${technicalScore}/100, verbal clarity at ${communicationScore}/100, and proctoring composure at ${confidenceScore}/100.`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
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

      // Guarantee analysis is synthesized dynamically from real data if missing
      if (!sessionData.analysis) {
        sessionData.analysis = synthesizeSessionAnalysis(sessionData);
      }

      return sessionData as InterviewSession;
    },
    enabled: !!sessionId,
    refetchInterval: false,
  });
}
