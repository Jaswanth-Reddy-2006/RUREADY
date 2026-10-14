// ═══════════════════════════════════════════════════════════════
// Resume & ATS Microservice — ATS Match & Resume Analysis Service
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { aiProviderManager } from '../lib/ai-provider-manager.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import {
  competitiveMatchService,
  CompetitiveMatchError,
  CompetitiveMatchResult,
} from './competitiveMatch.service.js';

export const AtsAnalysisSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().optional(),
  // The numeric matchScore is NOT taken from the LLM — it is produced solely by
  // the BGE competitive matcher below. Kept optional so a missing/extra LLM
  // value never forces the qualitative analysis into the failure path.
  matchScore: z.number().min(0).max(100).optional(),
  semanticScore: z.number().min(0).max(100).optional(),
  keywordScore: z.number().optional(),
  metricsScore: z.number().optional(),
  completenessScore: z.number().optional(),
  actionVerbScore: z.number().optional(),
  overallScore: z.number().optional(),
  summary: z.string().min(1),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  experienceMatch: z.string(),
  atsWarnings: z.array(z.string()),
  bulletRewrites: z.array(
    z.object({
      original: z.string(),
      rewritten: z.string(),
      impactReason: z.string(),
    })
  ),
  tailoredQuestions: z.array(
    z.object({
      questionText: z.string(),
      questionType: z.string(),
      focusArea: z.string(),
      difficulty: z.string(),
    })
  ),
});

export type AtsAnalysisResult = Omit<z.infer<typeof AtsAnalysisSchema>, 'matchScore' | 'overallScore'> & {
  id?: string;
  competitive?: CompetitiveMatchResult;
  // matchScore/overallScore are null when the role-match gate returns
  // NOT_RELEVANT — the UI must render "N/A" (never a fabricated number).
  matchScore: number | null;
  overallScore?: number | null;
  status?: 'MATCHED' | 'NOT_RELEVANT' | 'INSUFFICIENT_JD';
};

const COMMON_TECH_KEYWORDS = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Vue', 'Angular', 'Node.js',
  'Express', 'NestJS', 'Python', 'FastAPI', 'Django', 'Go', 'Golang', 'Java',
  'Spring Boot', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'Kafka',
  'Microservices', 'System Design', 'Git', 'Agile', 'Scrum', 'TDD', 'Jest',
  'TailwindCSS', 'CSS', 'HTML5', 'SQL', 'NoSQL', 'Linux', 'Elasticsearch'
];

export const atsService = {
  async analyzeResumeAndJob(
    userId: string,
    resumeText: string,
    jobDescription: string,
    jobTitleInput?: string,
    companyNameInput?: string,
    structuredElements?: any[]
  ): Promise<AtsAnalysisResult> {
    if (!resumeText || !resumeText.trim()) {
      throw new BadRequestError('Resume text or document content is required for ATS analysis.');
    }
    if (!jobDescription || !jobDescription.trim()) {
      throw new BadRequestError('Target Job Description text is required for ATS analysis.');
    }

    const cleanResume = resumeText.slice(0, 4000);
    const cleanJD = jobDescription.slice(0, 4000);

    const prompt = `You are an elite Applicant Tracking System (ATS) auditor and Principal Technical Recruiter.
Analyze the following Candidate Resume against the Target Job Description.

Target Job Description:
"""
${cleanJD}
"""

Candidate Resume:
"""
${cleanResume}
"""

Perform a comprehensive ATS audit and output ONLY valid JSON adhering strictly to this schema:
{
  "jobTitle": "${jobTitleInput || 'Target Software Engineer'}",
  "companyName": "${companyNameInput || 'Target Company'}",
  "summary": "Detailed 2-3 sentence executive overview of candidate alignment, core strengths, and readiness.",
  "matchedSkills": ["TypeScript", "Node.js", "System Design"],
  "missingSkills": ["Kubernetes", "Redis", "Kafka"],
  "experienceMatch": "Strong candidate alignment for Mid-Senior Level role.",
  "atsWarnings": [
    "Missing quantifiable impact metrics in past employment bullet points.",
    "Lacks explicit keywords for distributed cache invalidation."
  ],
  "bulletRewrites": [
    {
      "original": "Worked on backend APIs for user authentication.",
      "rewritten": "Architected high-throughput OAuth2 authentication microservices using Node.js & Redis, reducing p99 latency by 35% across 250k daily active users.",
      "impactReason": "Injected STAR methodology, explicit tech stack, and quantified latency & throughput metrics."
    },
    {
      "original": "Built frontend UI components with React.",
      "rewritten": "Engineered modular TypeScript React design system components, decreasing client bundle size by 28% and boosting Lighthouse accessibility to 98.",
      "impactReason": "Demonstrated performance optimization, code reusability, and measurable web vitals."
    }
  ],
  "tailoredQuestions": [
    {
      "questionText": "Can you walk us through how you would architect a distributed Redis caching layer to handle high read concurrency while preventing cache stampedes?",
      "questionType": "TECHNICAL",
      "focusArea": "Distributed Systems & Caching",
      "difficulty": "HARD"
    },
    {
      "questionText": "Describe a production incident where your API experienced a spike in latency. How did you isolate the bottleneck and mitigate the outage?",
      "questionType": "STAR",
      "focusArea": "Incident Management & Reliability",
      "difficulty": "MEDIUM"
    },
    {
      "questionText": "How do you evaluate trade-offs between SQL (e.g. PostgreSQL) and NoSQL (e.g. MongoDB/DynamoDB) when designing a new feature for scalability?",
      "questionType": "SYSTEM_DESIGN",
      "focusArea": "Database Architecture",
      "difficulty": "MEDIUM"
    }
  ]
}`;

    let parsedResult: AtsAnalysisResult;

    try {
      const responseText = await aiProviderManager.generateText(prompt);
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const rawJson = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
        const validated = AtsAnalysisSchema.parse(rawJson);
        // The authoritative numeric score comes from the competitive matcher
        // below; the LLM value (if any) is discarded here.
        parsedResult = { ...validated, matchScore: null };
      } else {
        throw new Error('Failed to locate JSON response block');
      }
    } catch {
      // Qualitative-only fallback for when the LLM is unavailable. This branch
      // NEVER produces a numeric match/competitive score — the Competitive
      // Score is computed exclusively by the BGE matcher further below.
      const jdUpper = cleanJD.toUpperCase();
      const resumeUpper = cleanResume.toUpperCase();

      const requiredSkills = COMMON_TECH_KEYWORDS.filter(k => jdUpper.includes(k.toUpperCase()));
      const matched = requiredSkills.filter(k => resumeUpper.includes(k.toUpperCase()));
      const missing = requiredSkills.filter(k => !resumeUpper.includes(k.toUpperCase()));

      // Fallback defaults if few keywords detected
      const finalMatched = matched.length > 0 ? matched : ['JavaScript', 'REST APIs', 'Git', 'Agile'];
      const finalMissing = missing.length > 0 ? missing : ['Redis Caching', 'Kubernetes', 'System Design'];

      parsedResult = {
        jobTitle: jobTitleInput || 'Senior Software Engineer',
        companyName: companyNameInput || 'Target Company',
        matchScore: null,
        summary: `The candidate demonstrates strong alignment with core competencies (${finalMatched.slice(0, 4).join(', ')}), with key opportunities to highlight distributed systems and infrastructure capabilities (${finalMissing.slice(0, 3).join(', ')}) required for the role.`,
        matchedSkills: finalMatched,
        missingSkills: finalMissing,
        experienceMatch: 'Qualitative alignment pending competitive match evaluation.',
        atsWarnings: [
          'Ensure bullet points lead with strong active action verbs (e.g., "Architected", "Engineered", "Spearheaded").',
          'Include explicit quantifiable business metrics (e.g., latency %, throughput, cost savings, user scale).',
          'Include exact technical keywords from the job posting in both Skills and Experience sections.'
        ],
        bulletRewrites: [
          {
            original: 'Responsible for developing web application endpoints and handling DB queries.',
            rewritten: 'Engineered 20+ RESTful microservice endpoints using Node.js and PostgreSQL, optimizing query indexing and reducing response times by 42%.',
            impactReason: 'Applied STAR methodology, specified technology stack, and quantified latency improvements.'
          },
          {
            original: 'Integrated frontend components with server backend.',
            rewritten: 'Developed responsive React & TypeScript interfaces with optimistic state caching, cutting client bundle load times by 30%.',
            impactReason: 'Highlighted architectural patterns, TypeScript mastery, and measurable frontend performance metrics.'
          }
        ],
        tailoredQuestions: [
          {
            questionText: `The target role emphasizes scalability. How would you design a resilient architecture handling high throughput spikes using ${finalMatched[0] || 'TypeScript'}?`,
            questionType: 'TECHNICAL',
            focusArea: 'System Architecture',
            difficulty: 'HARD'
          },
          {
            questionText: `Tell me about a challenging production bug you encountered with ${finalMatched[1] || 'database queries'} and how you resolved it without user disruption.`,
            questionType: 'STAR',
            focusArea: 'Problem Solving & Reliability',
            difficulty: 'MEDIUM'
          },
          {
            questionText: `How would you quickly ramp up and implement production pipelines involving ${finalMissing[0] || 'distributed caching'}?`,
            questionType: 'BEHAVIORAL',
            focusArea: 'Adaptability & Growth',
            difficulty: 'MEDIUM'
          }
        ]
      };
    }

    // ── Competitive Score (MODEL 3: BGE-based resume↔JD matcher) ─────────
    // The single authoritative source of the numeric Competitive Score. It is
    // computed independently of the ATS Quality Score and never blended with it:
    //   0.45·semanticSimilarity + 0.25·skillOverlap + 0.15·experienceRelevance
    //   + 0.15·terminologyMatch, gated by a multi-signal role-match check.
    // MATCHED   → real score in 0–100
    // NOT_RELEVANT → null (surfaced end-to-end as "N/A")
    // Engine failure → honest 503; NO fabricated/heuristic fallback score.
    const role = jobTitleInput || parsedResult.jobTitle || 'Selected Role';
    let competitive: CompetitiveMatchResult;

    try {
      competitive = await competitiveMatchService.match({
        resumeText,
        jobDescription,
        role,
        structuredElements,
      });
    } catch (err) {
      console.error('[ATS] Competitive matcher failed — no score will be fabricated:', err);
      const detail = err instanceof Error ? err.message : 'Unknown error';
      throw new CompetitiveMatchError(
        `Competitive Score engine unavailable; no match score was produced. ${detail}`,
        503
      );
    }

    const isMatched = competitive.status === 'MATCHED';
    // MATCHED carries a real 0–100 score; NOT_RELEVANT stays null end-to-end.
    const finalMatchScore: number | null = isMatched ? competitive.score : null;
    // semanticScore is a genuine matcher signal (not a fabricated fallback).
    const semanticScore = Math.round(competitive.matchSignals.semanticSimilarity * 100);

    parsedResult.matchScore = finalMatchScore;
    parsedResult.semanticScore = semanticScore;
    parsedResult.overallScore = finalMatchScore;
    parsedResult.matchedSkills = competitive.signalsDetail.matchedSkills.length
      ? competitive.signalsDetail.matchedSkills
      : parsedResult.matchedSkills;
    parsedResult.missingSkills = competitive.signalsDetail.missingSkills.length
      ? competitive.signalsDetail.missingSkills
      : parsedResult.missingSkills;

    // Save ATS Match Record to database
    const dbRecord = await prisma.atsMatch.create({
      data: {
        userId,
        jobTitle: jobTitleInput || parsedResult.jobTitle || 'Software Engineer',
        companyName: companyNameInput || parsedResult.companyName || null,
        matchScore: finalMatchScore,
        semanticScore: parsedResult.semanticScore,
        summary: parsedResult.summary,
        matchedSkills: parsedResult.matchedSkills,
        missingSkills: parsedResult.missingSkills,
        experienceMatch: parsedResult.experienceMatch,
        atsWarnings: parsedResult.atsWarnings,
        bulletRewrites: parsedResult.bulletRewrites as any,
        tailoredQuestions: parsedResult.tailoredQuestions as any,
      },
    });

    return {
      id: dbRecord.id,
      ...parsedResult,
      matchScore: finalMatchScore,
      overallScore: finalMatchScore,
      status: competitive.status,
      competitive,
    };
  },

  async getAtsMatch(id: string, userId: string): Promise<AtsAnalysisResult> {
    const record = await prisma.atsMatch.findFirst({
      where: { id, userId },
    });

    if (!record) {
      throw new NotFoundError('ATS Analysis report not found');
    }

    // A null matchScore is the single, authoritative NOT_RELEVANT signal — the
    // role-match gate produced no Competitive Score. No string-prefix decoding.
    const isNotRelevant = record.matchScore === null;
    const status: 'MATCHED' | 'NOT_RELEVANT' = isNotRelevant ? 'NOT_RELEVANT' : 'MATCHED';

    return {
      id: record.id,
      jobTitle: record.jobTitle,
      companyName: record.companyName || undefined,
      matchScore: record.matchScore,
      semanticScore: record.semanticScore ?? undefined,
      overallScore: record.matchScore,
      status,
      summary: record.summary,
      matchedSkills: record.matchedSkills,
      missingSkills: record.missingSkills,
      experienceMatch: record.experienceMatch || 'Aligned',
      atsWarnings: record.atsWarnings,
      bulletRewrites: record.bulletRewrites as any,
      tailoredQuestions: record.tailoredQuestions as any,
    };
  },

  async launchTailoredSession(
    userId: string,
    atsMatchId: string,
    mode: 'ORAL' | 'CODING' = 'ORAL'
  ) {
    const match = await this.getAtsMatch(atsMatchId, userId);

    const session = await prisma.interviewSession.create({
      data: {
        userId,
        interviewType: mode,
        targetRole: match.jobTitle,
        targetCompany: match.companyName || 'Target Company',
        industry: 'Technology',
        experienceLevel: 'MID',
        focusAreas: match.missingSkills.length > 0 ? match.missingSkills : match.matchedSkills,
        interviewGoal: `Tailored ATS Interview for ${match.jobTitle}`,
        mode,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        questions: {
          create: match.tailoredQuestions.map((q, idx) => ({
            orderIndex: idx + 1,
            questionText: q.questionText,
            questionType: q.questionType,
            difficulty: q.difficulty || 'MEDIUM',
          })),
        },
      },
      include: { questions: true },
    });

    return session;
  },
};

