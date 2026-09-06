// ═══════════════════════════════════════════════════════════════
// R U Ready? — Analysis Service
// Compiles historical dashboards, aggregated stats, and reports
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import { Analysis, ExperienceLevel, ReadinessVerdict } from '@ru-ready/shared';

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
  /**
   * Get full analysis for a session.
   */
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

  /**
   * Main synthesis pipeline: fetches session context, proctoring metrics,
   * compiles the multi-modal weighted scoring matrix, and saves to database.
   */
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

    // 1. Technical Score (driven purely by AI evaluations, 40% weight)
    const technicalScore =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + (Number(q.evalScore) || 0), 0) /
              answeredQuestions.length
          )
        : 50; // textbook baseline fallback

    // 2. Communication Score (erratic speech pace & filler words deduction, 30% weight)
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
      .join(' ')
      .toLowerCase();

    let fillerCount = 0;
    const fillerWords = ['like', 'umm', 'um', 'uhh', 'uh', 'err', 'basically', 'actually'];
    fillerWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = allAnswers.match(regex);
      if (matches) fillerCount += matches.length;
    });
    const fillerDeduction = Math.min(30, (isNaN(fillerCount) ? 0 : fillerCount) * 2);
    const safeFillerDeduction = isNaN(fillerDeduction) ? 0 : fillerDeduction;

    let rawCommScore = 100 - safeWpmDeduction - safeFillerDeduction;

    // Check if starCompliance is available from dynamic AI evaluation
    let totalStarCompliance = 0;
    let countStarCompliance = 0;
    answeredQuestions.forEach((q) => {
      const meta = parseEvalMeta(q.evalFeedback);
      if (meta.starCompliance != null) {
        const complianceVal = Number(meta.starCompliance);
        totalStarCompliance += isNaN(complianceVal) ? 0 : complianceVal;
        countStarCompliance++;
      }
    });

    let communicationScore = Math.max(0, Math.round(rawCommScore));
    if (countStarCompliance > 0) {
      const avgStarCompliance = totalStarCompliance / countStarCompliance;
      const safeAvgStarCompliance = isNaN(avgStarCompliance) ? 0 : avgStarCompliance;
      communicationScore = Math.max(0, Math.round(rawCommScore * 0.8 + safeAvgStarCompliance * 0.2));
    }

    // 3. Confidence & Presence Score (100 baseline minus tab blurs and eye-contact drops, 30% weight)
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

    // 4. Structure Score (STAR framework mapping)
    const safeTech = isNaN(technicalScore) ? 0 : technicalScore;
    const safeComm = isNaN(communicationScore) ? 0 : communicationScore;
    const safeConf = isNaN(confidenceScore) ? 0 : confidenceScore;
    const structureScore = Math.max(0, Math.round(safeTech * 0.60 + safeComm * 0.25 + safeConf * 0.15));

    // 5. Holistic Aggregated Score (Weighted average: 40% Tech + 30% Comm + 30% Conf)
    const overallScore = Math.round(
      safeTech * 0.40 +
      safeComm * 0.30 +
      safeConf * 0.30
    );

    // 6. Construct Actionable Report Insights (Strengths & Improvements)
    let strengths = answeredQuestions.flatMap((q) => q.evalStrengths || []);
    let improvements = answeredQuestions.flatMap((q) => q.evalWeaknesses || []);

    strengths = Array.from(new Set(strengths)).filter(Boolean).slice(0, 3);
    while (strengths.length < 3) {
      const defaults = [
        'Demonstrated a robust understanding of production-grade architectural trade-offs.',
        'Clearly explained microservices transaction paths and runtime event boundaries.',
        'Highly articulate and structured response progression matching standard industry frameworks.',
      ];
      strengths.push(defaults[strengths.length]);
    }

    improvements = Array.from(new Set(improvements)).filter(Boolean).slice(0, 3);
    while (improvements.length < 3) {
      const defaults = [
        'Struggled to defend database choices under high concurrent write loads.',
        'Flipped focus context or exhibited lookups that flag potential out-of-bounds assistance.',
        'Pacing fell slightly erratic or exhibited minor pauses during architectural justification.',
      ];
      improvements.push(defaults[improvements.length]);
    }

    // 7. Compile exactly 3 readiness tips based on lowest scoring dimension
    const scoresMap = { technicalScore, communicationScore, confidenceScore };
    const minDim = Object.keys(scoresMap).reduce((a, b) => (scoresMap[a as keyof typeof scoresMap] < scoresMap[b as keyof typeof scoresMap] ? a : b));

    let readinessTips = [
      {
        tip: 'Enforce Systematic Justifications',
        reason: 'Always defend technology decisions using concrete trade-offs (e.g. read latency vs. write consistency) rather than passive generalizations.',
      },
      {
        tip: 'Maintain High Screen & Focus Presence',
        reason: 'Deductions are heavily weighted on focus blurs. Retain locked viewport limits to guarantee high security verification scores.',
      },
      {
        tip: 'Calibrate Speech Delivery Bounds',
        reason: 'Consistent, deliberate pace (110-160 WPM) improves listener engagement and semantic comprehension during system design rounds.',
      },
    ];

    if (minDim === 'technicalScore') {
      readinessTips = [
        {
          tip: 'Deepen Architectural Rationale',
          reason: 'Focus on explaining the "why" behind your technology and database selections, specifying precise read/write bounds.',
        },
        {
          tip: 'Identify Edge Cases Proactively',
          reason: 'Discuss potential race conditions, concurrency bottlenecks, or system failures before the interrogator probes for them.',
        },
        {
          tip: 'Structure System Layouts Methodically',
          reason: 'Always trace a system request runtime path from browser edges down to deep persistent database transaction boundaries.',
        }
      ];
    } else if (minDim === 'communicationScore') {
      readinessTips = [
        {
          tip: 'Quantify Engineering Outcomes',
          reason: 'End behavioral answers using the STAR framework, specifically including quantifiable metrics (latency decrease, revenue metrics).',
        },
        {
          tip: 'Calibrate Conversational Pace',
          reason: 'Maintain a deliberate, measured speech cadence between 110-160 WPM to minimize accidental pauses and filler sounds.',
        },
        {
          tip: 'Eliminate Sentence Fillers',
          reason: 'Leverage short, active pauses instead of using verbal filler words like "like", "basically", or "actually" during transitions.',
        }
      ];
    } else if (minDim === 'confidenceScore') {
      readinessTips = [
        {
          tip: 'Secure Focused Workspace Limits',
          reason: 'Deductions are heavily penalized on window blurs. Maintain focused viewport focus during explanation rounds.',
        },
        {
          tip: 'Stabilize Camera Gaze Calibration',
          reason: 'Position your camera at eye level and maintain direct screen eye-contact to guarantee optimal proctoring presence metrics.',
        },
        {
          tip: 'Maintain Balanced Lighting Bounds',
          reason: 'Ensure standard ambient background lighting so the presence proctor can verify structural facial metrics without drops.',
        }
      ];
    }

    // 8. Output Terminal State Enum
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
        readinessVerdict,
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
        readinessVerdict,
      },
    });

    return analysis as unknown as Analysis;
  },

  /**
   * Compiles secure scoring analysis specifically tailored for coding track parameters.
   */
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

    // AI evaluation score average fallback
    const baseTechnical = answeredQuestions.length > 0
      ? Math.round(answeredQuestions.reduce((sum, q) => sum + (Number(q.evalScore) || 0), 0) / answeredQuestions.length)
      : 80;

    // 1. Code Correctness Score (40% Weight)
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
        console.error("Error parsing test cases for count", e);
      }
    }

    let codeCorrectnessScore = 0;
    if (session.testCasesPassed == null) {
      codeCorrectnessScore = isNaN(baseTechnical) ? 80 : baseTechnical; // fallback to AI evaluation average
      testCasesPassed = totalTestCases > 0 ? Math.round((codeCorrectnessScore / 100) * totalTestCases) : 0;
    } else {
      codeCorrectnessScore = totalTestCases > 0 ? Math.round((testCasesPassed / totalTestCases) * 100) : 0;
    }
    const safeCodeCorrectness = isNaN(codeCorrectnessScore) ? 0 : codeCorrectnessScore;

    // 2. Algorithmic Efficiency Score (30% Weight)
    let totalAlgoEff = 0;
    let countAlgoEff = 0;
    answeredQuestions.forEach((q) => {
      const meta = parseEvalMeta(q.evalFeedback);
      if (meta.algorithmicEfficiency != null) {
        const effVal = Number(meta.algorithmicEfficiency);
        totalAlgoEff += isNaN(effVal) ? 0 : effVal;
        countAlgoEff++;
      }
    });

    let algorithmicEfficiencyScore = 50;
    if (countAlgoEff > 0) {
      const avgAlgo = totalAlgoEff / countAlgoEff;
      algorithmicEfficiencyScore = isNaN(avgAlgo) ? 50 : Math.round(avgAlgo);
    } else {
      // Fallback heuristic:
      if (baseTechnical >= 80) algorithmicEfficiencyScore = 90;
      else if (baseTechnical >= 60) algorithmicEfficiencyScore = 70;
      else if (baseTechnical >= 40) algorithmicEfficiencyScore = 50;
      else algorithmicEfficiencyScore = 30;
    }
    const safeAlgoEfficiency = isNaN(algorithmicEfficiencyScore) ? 0 : algorithmicEfficiencyScore;

    // 3. Technical Cadence & Hint Penalty Score (15% Weight)
    const rawHintCount = session.hintCount;
    const hintCount = (rawHintCount != null && !isNaN(Number(rawHintCount))) ? Number(rawHintCount) : 0;
    const cadenceScore = Math.max(0, 100 - hintCount * 15);
    const safeCadence = isNaN(cadenceScore) ? 0 : cadenceScore;

    // 4. Platform Integrity Score (15% Weight)
    const rawEyeContact = proctoring?.eyeContactScore;
    const eyeContactScore = (rawEyeContact != null && !isNaN(Number(rawEyeContact))) ? Number(rawEyeContact) : 80;
    const rawTabBlur = proctoring?.tabBlurCount;
    const tabBlurCount = (rawTabBlur != null && !isNaN(Number(rawTabBlur))) ? Number(rawTabBlur) : 0;

    const tabDeduction = tabBlurCount * 10;
    let eyeContactDeduction = 0;
    if (eyeContactScore < 80) {
      eyeContactDeduction = Math.max(0, Math.round((80 - eyeContactScore) / 10) * 5);
    }
    const safeTabDeduction = isNaN(tabDeduction) ? 0 : tabDeduction;
    const safeEyeContactDeduction = isNaN(eyeContactDeduction) ? 0 : eyeContactDeduction;

    const platformIntegrityScore = Math.max(0, 100 - safeTabDeduction - safeEyeContactDeduction);
    const confidenceScore = platformIntegrityScore;
    const safeConfidence = isNaN(confidenceScore) ? 0 : confidenceScore;

    const platformIntegrity = tabBlurCount > 4 ? 'COMPROMISED' : 'SECURED';

    // 5. Structure Score
    const rawWpm = confidenceMetrics?.signals?.avgWpm;
    const avgWpmVal = (rawWpm != null && !isNaN(Number(rawWpm))) ? Number(rawWpm) : 125;
    const communicationScore = Math.min(100, Math.max(0, 100 - Math.abs(125 - avgWpmVal) * 0.5));
    const safeComm = isNaN(communicationScore) ? 0 : communicationScore;
    const structureScore = Math.max(0, Math.round(safeCodeCorrectness * 0.7 + safeComm * 0.3));

    // 6. Overall Weighted Score: 40% Code Correctness + 30% Algo Efficiency + 15% Cadence + 15% Integrity
    const overallScore = Math.round(
      safeCodeCorrectness * 0.40 +
      safeAlgoEfficiency * 0.30 +
      safeCadence * 0.15 +
      safeConfidence * 0.15
    );

    // 7. Verdict rankings:
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
      algorithmicEfficiencyScore,
      hintCount,
      platformIntegrityScore
    );

    const summary = `Coding Track assessment completed for ${session.targetRole}. Correctness score calibrated at ${codeCorrectnessScore}/100, algorithmic efficiency at ${algorithmicEfficiencyScore}/100, hint/cadence at ${cadenceScore}/100, and proctoring integrity at ${platformIntegrityScore}/100. Platform Integrity status: ${platformIntegrity}.\n\n[CORPORATE BENCHMARK] ${benchmark.feedback}`;

    // Strict 3 pros / 3 cons
    const strengths = [
      'Successfully Refactored algorithm to correct Big-O bounds.',
      'Demonstrated robust memory optimizations under large loops.',
      'Calibrated boundary checks correctly to prevent out of bounds exceptions.'
    ];

    const improvements = [
      hintCount > 0 ? `Relied on ${hintCount} dynamic socratic hints inside the room.` : 'Could further speed up conceptual runtime explanations.',
      tabBlurCount > 0 ? `Logged ${tabBlurCount} focus viewport breaks during active coding.` : 'Check for large integer overflow bounds inside inputs.',
      'Further practice with dynamic pointer manipulation strategies.'
    ];

    const readinessTips = [
      {
        tip: 'Minimize Hint Requests',
        reason: 'Each dynamic hint deducts exactly 15 points. Build pointer index layouts prior to requesting room hints.'
      },
      {
        tip: 'Secure Full Screen Focus',
        reason: 'More than 4 tab window blurs flags status as COMPROMISED. Keep browser view focused during interrogations.'
      },
      {
        tip: 'Optimize Code Quality Layout',
        reason: 'Enforce proper helper abstraction and naming schemas in standard workspace code blocks.'
      }
    ];

    const confidenceSignals = {
      platformIntegrity,
      tabBlurCount,
      hintCount,
      avgWpm: confidenceMetrics?.signals?.avgWpm ?? 125,
      codeCorrectnessScore,
      algorithmicEfficiencyScore,
      cadenceScore,
      platformIntegrityScore,
      testCasesPassed,
      totalTestCases,
      corporateBenchmark: benchmark
    };

    const analysis = await prisma.analysis.upsert({
      where: { sessionId },
      update: {
        overallScore,
        communicationScore,
        technicalScore: codeCorrectnessScore, // code correctness as technicalScore
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: confidenceSignals as any,
        eyeContactScore,
        presenceScore: platformIntegrityScore,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict,
      },
      create: {
        sessionId,
        overallScore,
        communicationScore,
        technicalScore: codeCorrectnessScore, // code correctness as technicalScore
        confidenceScore,
        structureScore,
        confidenceMeterScore: confidenceMetrics?.score ?? null,
        confidenceSignals: confidenceSignals as any,
        eyeContactScore,
        presenceScore: platformIntegrityScore,
        summary,
        strengths,
        improvements,
        actionableTips: readinessTips as any,
        readinessVerdict,
      },
    });

    // Attach virtual fields
    (analysis as any).platformIntegrity = platformIntegrity;

    return analysis;
  },

  /**
   * Get history metrics for dashboard.
   */
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
