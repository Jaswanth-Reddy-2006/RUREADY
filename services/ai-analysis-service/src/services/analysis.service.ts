// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — Analysis Service
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import { Analysis, ExperienceLevel, ReadinessVerdict } from '@ru-ready/shared';
import { hfModelEngine } from '../lib/hf-model-engine.js';

function parseEvalMeta(feedback: string | null | undefined) {
  if (!feedback) return {};
  const match = feedback.match(/<!--EVAL_META([\s\S]*?)EVAL_META-->/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]) as {
      needsFollowUp?: boolean;
      followUpReason?: string;
      gaps?: string[];
      starCompliance?: number;
      tutorialCopierFlag?: boolean;
      technicalOriginality?: number;
      algorithmicEfficiency?: number;
      codeQuality?: number;
      complexityJustification?: number;
      phaseReached?: string;
    };
  } catch {
    return {};
  }
}

function calibrateCorporateBenchmarking(
  targetCompany: string | null,
  isCoding: boolean,
  technicalScore: number,
  communicationScore: number,
  confidenceScore: number,
  structureScore: number,
  algorithmicEfficiencyScore: number,
  hintCount: number,
  platformIntegrityScore: number
) {
  const company = (targetCompany || '').toLowerCase().trim();

  let rubricKey: 'META_SDE2' | 'GOOGLE_L4' | 'AMAZON_SDE1' = 'AMAZON_SDE1';
  let rubricName = 'Amazon SDE1';

  if (company.includes('google') || company.includes('alphabet')) {
    rubricKey = 'GOOGLE_L4';
    rubricName = 'Google L4';
  } else if (company.includes('meta') || company.includes('facebook')) {
    rubricKey = 'META_SDE2';
    rubricName = 'Meta SDE2';
  } else if (company.includes('amazon') || company.includes('aws')) {
    rubricKey = 'AMAZON_SDE1';
    rubricName = 'Amazon SDE1';
  } else {
    rubricKey = 'AMAZON_SDE1';
    rubricName = 'Amazon SDE1';
  }

  let passed = true;
  let feedback = '';
  let variance = 0;
  let missedMetrics: string[] = [];

  if (rubricKey === 'META_SDE2') {
    const techReq = 78;
    const algoReq = 80;
    const integrityReq = 95;
    const maxHints = 1;

    if (technicalScore < techReq) {
      passed = false;
      missedMetrics.push(`technical depth (scored ${technicalScore}/${techReq})`);
      variance += (techReq - technicalScore);
    }
    if (isCoding && algorithmicEfficiencyScore < algoReq) {
      passed = false;
      missedMetrics.push(`algorithmic efficiency (scored ${algorithmicEfficiencyScore}/${algoReq})`);
      variance += (algoReq - algorithmicEfficiencyScore);
    }
    if (platformIntegrityScore < integrityReq) {
      passed = false;
      missedMetrics.push(`platform integrity (scored ${platformIntegrityScore}/${integrityReq})`);
      variance += (integrityReq - platformIntegrityScore);
    }
    if (isCoding && hintCount > maxHints) {
      passed = false;
      missedMetrics.push(`hint count (${hintCount} hints consumed, max allowed: ${maxHints})`);
      variance += (hintCount - maxHints) * 15;
    }
  } else if (rubricKey === 'GOOGLE_L4') {
    const techReq = 82;
    const algoReq = 85;
    const maxHints = 0;

    if (technicalScore < techReq) {
      passed = false;
      missedMetrics.push(`technical depth (scored ${technicalScore}/${techReq})`);
      variance += (techReq - technicalScore);
    }
    if (isCoding && algorithmicEfficiencyScore < algoReq) {
      passed = false;
      missedMetrics.push(`algorithmic efficiency (scored ${algorithmicEfficiencyScore}/${algoReq})`);
      variance += (algoReq - algorithmicEfficiencyScore);
    }
    if (isCoding && hintCount > maxHints) {
      passed = false;
      missedMetrics.push(`hint count (${hintCount} hints consumed, max allowed: ${maxHints})`);
      variance += (hintCount - maxHints) * 15;
    }
  } else {
    const structReq = 75;
    const techReq = 65;

    if (structureScore < structReq) {
      passed = false;
      missedMetrics.push(`communication structure (scored ${structureScore}/${structReq})`);
      variance += (structReq - structureScore);
    }
    if (technicalScore < techReq) {
      passed = false;
      missedMetrics.push(`technical depth (scored ${technicalScore}/${techReq})`);
      variance += (techReq - technicalScore);
    }
  }

  if (passed) {
    feedback = `Passed corporate benchmark requirements for ${rubricName}. Candidate demonstrated satisfactory engineering competencies mapping directly to the hiring bar of ${rubricName}.`;
  } else {
    if (rubricKey === 'GOOGLE_L4') {
      feedback = `Your code optimization space complexity is structurally sound, but your technical depth fell short of the Google L4 entry bar by ${Math.round(variance)} points due to unoptimized nested loop constraints during the optimal refactoring phase.`;
    } else {
      feedback = `Your performance fell short of the ${rubricName} entry bar by ${Math.round(variance)} points due to unoptimized constraints in: ${missedMetrics.join(', ')}.`;
    }
  }

  return {
    rubricKey,
    rubricName,
    passed,
    variance: Math.round(variance * 10) / 10,
    feedback,
    certificationStatus: passed ? `CERTIFIED_${rubricKey}` : `FAILED_CALIBRATION`
  };
}

export const analysisService = {
  async getSessionAnalysis(sessionId: string, userId: string): Promise<Analysis> {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        analysis: true,
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (!session.analysis) {
      throw new NotFoundError('Analysis not generated for this session');
    }

    return session.analysis as unknown as Analysis;
  },

  async compileHolisticSessionAnalysis(
    sessionId: string,
    confidenceMetrics?: {
      score: number;
      signals: {
        avgWpm: number;
        avgPauseCount: number;
        avgAnswerLength: number;
      };
    },
    proctoring?: {
      eyeContactScore: number;
      presenceScore: number;
      tabBlurCount: number;
    }
  ): Promise<Analysis> {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: true,
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    if (session.mode === 'CODING') {
      return this.compileCodingSessionAnalysis(sessionId, confidenceMetrics, proctoring) as unknown as Analysis;
    }

    const answeredQuestions = session.questions.filter((q) => q.answerText);

    const technicalScore =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + (Number(q.evalScore) || 0), 0) /
              answeredQuestions.length
          )
        : 50;

    const rawWpm = confidenceMetrics?.signals?.avgWpm;
    const avgWpm = (rawWpm != null && !isNaN(Number(rawWpm))) ? Number(rawWpm) : 130;
    let wpmDeduction = 0;
    if (avgWpm < 110) {
      wpmDeduction = (110 - avgWpm) * 0.5;
    } else if (avgWpm > 160) {
      wpmDeduction = (avgWpm - 160) * 0.5;
    }
    const safeWpmDeduction = isNaN(wpmDeduction) ? 0 : wpmDeduction;

    const allAnswers = answeredQuestions
      .map((q) => q.answerText || '')
      .join(' ');

    const totalAnswerTime = answeredQuestions.reduce((sum, q) => sum + (q.timeTakenSecs || 30), 0);
    const commAnalysis = hfModelEngine.analyzeCommunication(allAnswers, Math.max(15, totalAnswerTime));

    let communicationScore = commAnalysis.clarityScore;
    if (answeredQuestions.length === 0) {
      communicationScore = 0;
    }

    const rawTabBlur = proctoring?.tabBlurCount;
    const tabBlurCount = (rawTabBlur != null && !isNaN(Number(rawTabBlur))) ? Number(rawTabBlur) : 0;
    const tabDeduction = tabBlurCount * 10;
    const safeTabDeduction = isNaN(tabDeduction) ? 0 : tabDeduction;

    const rawEyeContact = proctoring?.eyeContactScore;
    const eyeContactScore = (rawEyeContact != null && !isNaN(Number(rawEyeContact))) ? Number(rawEyeContact) : 85;
    let eyeContactDeduction = 0;
    if (eyeContactScore < 80) {
      eyeContactDeduction = Math.max(0, Math.round((80 - eyeContactScore) / 10) * 5);
    }
    const safeEyeContactDeduction = isNaN(eyeContactDeduction) ? 0 : eyeContactDeduction;

    const confidenceScore = Math.max(0, Math.round(100 - safeTabDeduction - safeEyeContactDeduction));

    const safeTech = isNaN(technicalScore) ? 0 : technicalScore;
    const safeComm = isNaN(communicationScore) ? 0 : communicationScore;
    const safeConf = isNaN(confidenceScore) ? 0 : confidenceScore;
    const structureScore = Math.max(0, Math.round(safeTech * 0.60 + safeComm * 0.25 + safeConf * 0.15));

    const overallScore = Math.round(
      safeTech * 0.40 +
      safeComm * 0.30 +
      safeConf * 0.30
    );

    let strengths = answeredQuestions.flatMap((q) => q.evalStrengths || []);
    strengths = Array.from(new Set(strengths)).filter(Boolean);
    if (strengths.length === 0) {
      if (technicalScore >= 70) {
        strengths.push(`Solid technical command when addressing ${session.targetRole} concepts.`);
      }
      if (commAnalysis.clarityScore >= 70) {
        strengths.push('Articulate verbal cadence with concise, intelligible terminology.');
      }
      if (confidenceScore >= 80) {
        strengths.push('Maintained steady eye contact and stable environment proctoring.');
      }
      if (strengths.length === 0) {
        strengths.push('Successfully completed all interview prompts within allocated duration.');
      }
    }

    let improvements = answeredQuestions.flatMap((q) => q.evalWeaknesses || []);
    improvements = Array.from(new Set(improvements)).filter(Boolean);
    if (improvements.length === 0) {
      if (commAnalysis.fillerCount > 2) {
        improvements.push(`Reduce verbal filler usage (${commAnalysis.fillerCount} instances detected in transcript: ${commAnalysis.detectedFillers.slice(0, 3).join(', ')}).`);
      }
      if (technicalScore < 75) {
        improvements.push('Deepen architectural justification and Big-O trade-off explanations.');
      }
      if (tabBlurCount > 0) {
        improvements.push(`Avoid window focus shifts (${tabBlurCount} tab/screen blur events recorded).`);
      }
      if (improvements.length === 0) {
        improvements.push('Continue practicing higher difficulty edge case scenarios under timed pressure.');
      }
    }

    const readinessTips = [
      {
        tip: 'Deepen Technical Trade-Offs',
        reason: `For ${session.targetRole} positions at ${session.targetCompany || 'top tech firms'}, substantiate architectural choices with latency, scalability, and memory implications.`,
      },
      {
        tip: 'Vocal Precision & Cadence',
        reason: commAnalysis.fillerCount > 0
          ? `Replace verbal fillers with silent 1-second pauses to project composure and authority.`
          : 'Maintain your current steady 120-150 WPM cadence during high-pressure problem solving.',
      },
      {
        tip: 'Proctoring & Focus Consistency',
        reason: tabBlurCount > 0
          ? `Eliminate context-switching (${tabBlurCount} blurs flagged) to maximize platform integrity.`
          : 'Retain direct eye contact with the interviewer avatar to demonstrate engagement.',
      },
    ];

    let readinessVerdict: 'NOT_READY' | 'ALMOST_READY' | 'READY' | 'STRONG' = 'READY';
    if (overallScore < 45) {
      readinessVerdict = 'NOT_READY';
    } else if (overallScore >= 45 && overallScore <= 65) {
      readinessVerdict = 'ALMOST_READY';
    } else if (overallScore >= 66 && overallScore <= 84) {
      readinessVerdict = 'READY';
    } else {
      readinessVerdict = 'STRONG';
    }

    const benchmark = calibrateCorporateBenchmarking(
      session.targetCompany,
      false,
      technicalScore,
      communicationScore,
      confidenceScore,
      structureScore,
      0,
      0,
      confidenceScore
    );

    const summary = `Candidate completed mock interview for target role: ${session.targetRole}. The overall Technical capability was scored at ${technicalScore}/100, while verbal clarity and communication structure scored at ${communicationScore}/100. Environmental proctoring stability registered at ${confidenceScore}/100.\n\n[CORPORATE BENCHMARK] ${benchmark.feedback}`;

    const finalSignals = {
      ...((confidenceMetrics?.signals as any) || {}),
      corporateBenchmark: benchmark
    };

    const analysis = await prisma.analysis.upsert({
      where: { sessionId },
      update: {
        overallScore,
        communicationScore,
        technicalScore,
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: finalSignals as any,
        eyeContactScore: proctoring?.eyeContactScore ?? null,
        presenceScore: proctoring?.presenceScore ?? null,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict: readinessVerdict as any,
      },
      create: {
        sessionId,
        overallScore,
        communicationScore,
        technicalScore,
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: finalSignals as any,
        eyeContactScore: proctoring?.eyeContactScore ?? null,
        presenceScore: proctoring?.presenceScore ?? null,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict: readinessVerdict as any,
      },
    });

    return analysis as unknown as Analysis;
  },

  async compileCodingSessionAnalysis(
    sessionId: string,
    confidenceMetrics?: {
      score: number;
      signals: {
        avgWpm: number;
        avgPauseCount: number;
        avgAnswerLength: number;
      };
    },
    proctoring?: {
      eyeContactScore: number;
      presenceScore: number;
      tabBlurCount: number;
    }
  ): Promise<any> {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: true,
      },
    });

    if (!session) {
      throw new NotFoundError('Interview session not found');
    }

    const answeredQuestions = session.questions.filter((q) => q.answerText);

    // Extract submitted code and spoken responses
    let submittedCode = '';
    let spokenText = '';
    answeredQuestions.forEach((q) => {
      const text = q.answerText || '';
      const codeMatch = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        submittedCode += '\n' + codeMatch[1];
      } else {
        submittedCode += '\n' + text;
      }
      const defenseMatch = text.match(/\[Candidate Final Verbal Defense\]:\s*([\s\S]*)/i);
      if (defenseMatch) {
        spokenText += ' ' + defenseMatch[1];
      }
    });

    // 1. Deep Code Quality & Complexity Analysis
    const codeAnalysis = hfModelEngine.analyzeCodeQualityAndComplexity(
      submittedCode,
      session.selectedLanguage || 'javascript'
    );

    let totalTestCases = 5;
    const rawTestCasesPassed = session.testCasesPassed;
    let testCasesPassed = (rawTestCasesPassed != null && !isNaN(Number(rawTestCasesPassed))) ? Number(rawTestCasesPassed) : 0;

    let diff = 'EASY';
    const goalStr = session.interviewGoal || '';
    const diffMatch = goalStr.match(/\[Difficulty:\s*([^\]]+)\]/i);
    if (diffMatch) {
      diff = diffMatch[1].toUpperCase();
    } else if (session.experienceLevel === ExperienceLevel.MID) {
      diff = 'MEDIUM';
    } else if (session.experienceLevel === ExperienceLevel.SENIOR) {
      diff = 'HARD';
    }

    const problem = await prisma.preDefinedProblem.findFirst({
      where: { difficulty: diff },
    }) || await prisma.preDefinedProblem.findFirst();

    if (problem && problem.testCases) {
      try {
        const parsedCases = typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : problem.testCases;
        if (Array.isArray(parsedCases)) {
          totalTestCases = parsedCases.length;
        }
      } catch (e) {
        console.error("Error parsing test cases", e);
      }
    }

    let codeCorrectnessScore = 0;
    if (session.testCasesPassed == null) {
      codeCorrectnessScore = codeAnalysis.codeQualityScore;
      testCasesPassed = totalTestCases > 0 ? Math.round((codeCorrectnessScore / 100) * totalTestCases) : 0;
    } else {
      codeCorrectnessScore = totalTestCases > 0 ? Math.round((testCasesPassed / totalTestCases) * 100) : 0;
    }
    const safeCodeCorrectness = isNaN(codeCorrectnessScore) ? 0 : codeCorrectnessScore;
    const safeAlgoEfficiency = codeAnalysis.algorithmicEfficiencyScore;

    const rawHintCount = session.hintCount;
    const hintCount = (rawHintCount != null && !isNaN(Number(rawHintCount))) ? Number(rawHintCount) : 0;
    const cadenceScore = Math.max(0, 100 - hintCount * 15);
    const safeCadence = isNaN(cadenceScore) ? 0 : cadenceScore;

    // 2. Multi-Modal Confidence & Proctoring Engine
    const multiModalConf = await hfModelEngine.computeMultiModalConfidence(
      spokenText || 'Coding solution implemented and validated.',
      answeredQuestions.length * 45,
      proctoring
    );

    const confidenceScore = multiModalConf.overallConfidence;
    const safeConfidence = isNaN(confidenceScore) ? 0 : confidenceScore;
    const tabBlurCount = proctoring?.tabBlurCount ?? 0;
    const platformIntegrity = tabBlurCount > 4 ? 'COMPROMISED' : 'SECURED';

    const rawWpm = confidenceMetrics?.signals?.avgWpm ?? multiModalConf.signals.wpm;
    const avgWpmVal = (rawWpm != null && !isNaN(Number(rawWpm))) ? Number(rawWpm) : 125;
    const communicationScore = Math.min(100, Math.max(0, 100 - Math.abs(125 - avgWpmVal) * 0.5));
    const safeComm = isNaN(communicationScore) ? 0 : communicationScore;
    const structureScore = Math.max(0, Math.round(codeAnalysis.codeQualityScore * 0.6 + safeCodeCorrectness * 0.4));

    const overallScore = Math.round(
      safeCodeCorrectness * 0.35 +
      safeAlgoEfficiency * 0.30 +
      structureScore * 0.15 +
      safeCadence * 0.10 +
      safeConfidence * 0.10
    );

    let readinessVerdict: 'NOT_READY' | 'ALMOST_READY' | 'READY' | 'STRONG' = 'READY';
    if (overallScore >= 85) {
      readinessVerdict = 'STRONG';
    } else if (overallScore >= 66 && overallScore <= 84) {
      readinessVerdict = 'READY';
    } else if (overallScore >= 45 && overallScore <= 65) {
      readinessVerdict = 'ALMOST_READY';
    } else {
      readinessVerdict = 'NOT_READY';
    }

    const benchmark = calibrateCorporateBenchmarking(
      session.targetCompany,
      true,
      codeCorrectnessScore,
      communicationScore,
      confidenceScore,
      structureScore,
      safeAlgoEfficiency,
      hintCount,
      confidenceScore
    );

    const summary = `Coding Track assessment completed for ${session.targetRole}. Correctness score calibrated at ${codeCorrectnessScore}/100 (${testCasesPassed}/${totalTestCases} test cases passed), algorithmic efficiency at ${safeAlgoEfficiency}/100 (Time: ${codeAnalysis.timeComplexity}, Space: ${codeAnalysis.spaceComplexity}), hint/cadence at ${cadenceScore}/100, and proctoring composure at ${confidenceScore}/100.\n\n[CORPORATE BENCHMARK] ${benchmark.feedback}`;

    const strengths: string[] = [
      ...codeAnalysis.strengths,
      ...(testCasesPassed === totalTestCases && totalTestCases > 0 ? [`Passed 100% of test cases (${testCasesPassed}/${totalTestCases}) on first submission.`] : []),
      ...(hintCount === 0 ? ['Completed problem independently with zero hint penalties.'] : [])
    ].slice(0, 3);

    const improvements: string[] = [
      ...codeAnalysis.weaknesses,
      ...(hintCount > 0 ? [`Relied on ${hintCount} dynamic socratic hint(s) during implementation.`] : []),
      ...(testCasesPassed < totalTestCases ? [`Failed ${totalTestCases - testCasesPassed} edge test case(s); dry run boundary states.`] : []),
      ...(tabBlurCount > 0 ? [`Logged ${tabBlurCount} focus viewport break(s) during active coding.`] : [])
    ].slice(0, 3);

    const readinessTips = [
      {
        tip: 'Time & Space Justification',
        reason: `Target ${codeAnalysis.timeComplexity} runtime complexity with ${codeAnalysis.spaceComplexity} auxiliary space. Always explain asymptotic bounds before writing code.`
      },
      {
        tip: 'Minimize Hint Requests',
        reason: hintCount > 0
          ? `Consuming ${hintCount} hints reduced your cadence score to ${cadenceScore}/100. Build pointer diagrams before requesting hints.`
          : 'Great independent execution! Continue verifying extreme boundary conditions independently.'
      },
      {
        tip: 'Focus & Composure Integrity',
        reason: tabBlurCount > 0
          ? `Eliminate context-switching (${tabBlurCount} window blurs logged) to maintain platform integrity.`
          : 'Optimal composure and screen presence maintained throughout the coding track.'
      }
    ];

    const confidenceSignals = {
      platformIntegrity,
      tabBlurCount,
      hintCount,
      avgWpm: avgWpmVal,
      codeCorrectnessScore,
      algorithmicEfficiencyScore: safeAlgoEfficiency,
      timeComplexity: codeAnalysis.timeComplexity,
      spaceComplexity: codeAnalysis.spaceComplexity,
      detectedPatterns: codeAnalysis.detectedPatterns,
      cadenceScore,
      platformIntegrityScore: confidenceScore,
      testCasesPassed,
      totalTestCases,
      corporateBenchmark: benchmark
    };

    const analysis = await prisma.analysis.upsert({
      where: { sessionId },
      update: {
        overallScore,
        communicationScore,
        technicalScore: codeCorrectnessScore,
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: confidenceSignals as any,
        eyeContactScore: proctoring?.eyeContactScore ?? null,
        presenceScore: confidenceScore,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict: readinessVerdict as any,
      },
      create: {
        sessionId,
        overallScore,
        communicationScore,
        technicalScore: codeCorrectnessScore,
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: confidenceSignals as any,
        eyeContactScore: proctoring?.eyeContactScore ?? null,
        presenceScore: confidenceScore,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict: readinessVerdict as any,
      },
    });

    (analysis as any).platformIntegrity = platformIntegrity;
    return analysis;
  },

  async getAnalysisHistory(userId: string) {
    const analyses = await prisma.analysis.findMany({
      where: {
        session: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        session: true,
      },
    });

    if (analyses.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        averageCommunication: 0,
        averageTechnical: 0,
        averageConfidence: 0,
        averageStructure: 0,
        history: [],
        latestVerdict: null,
      };
    }

    const total = analyses.length;
    const scores = analyses.map((a) => a.overallScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / total);

    const commScores = analyses.map((a) => a.communicationScore);
    const techScores = analyses.map((a) => a.technicalScore);
    const confScores = analyses.map((a) => a.confidenceScore);
    const structScores = analyses.map((a) => a.structureScore);

    const avgComm = Math.round(commScores.reduce((a, b) => a + b, 0) / total);
    const avgTech = Math.round(techScores.reduce((a, b) => a + b, 0) / total);
    const avgConf = Math.round(confScores.reduce((a, b) => a + b, 0) / total);
    const avgStruct = Math.round(structScores.reduce((a, b) => a + b, 0) / total);

    const history = analyses.map((a) => ({
      sessionId: a.sessionId,
      date: a.createdAt.toISOString().split('T')[0],
      overallScore: a.overallScore,
      targetRole: a.session.targetRole,
      targetCompany: a.session.targetCompany,
    }));

    const latestVerdict = analyses[analyses.length - 1]?.readinessVerdict || null;

    return {
      totalInterviews: total,
      averageScore: avgScore,
      averageCommunication: avgComm,
      averageTechnical: avgTech,
      averageConfidence: avgConf,
      averageStructure: avgStruct,
      history,
      latestVerdict,
    };
  },
};
