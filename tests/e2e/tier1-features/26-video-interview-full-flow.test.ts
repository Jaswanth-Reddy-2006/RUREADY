import { describe, it, expect, beforeEach } from 'vitest';
import { oralService, generateContextualFollowUp, getDomainQuestionForStage } from '../../../services/oral-interview-service/src/services/oral.service';
import { mapVisemeIdToOculus, OculusViseme } from '../../../client/src/components/interview/visemeMapper';
import { cleanMarkdown } from '../../../client/src/lib/speech';

describe('Feature 26: Complete Video Interview End-to-End Flow & Database Persistence', { timeout: 20000 }, () => {
  const testUserId = `test_cand_${Date.now()}`;
  let sessionId: string;
  let initialQuestionId: string;
  let followUpQuestionId: string;

  it('Step 1: Creates video interview session in database with full schema attributes', async () => {
    const session = await oralService.createSession(testUserId, {
      interviewType: 'TECHNICAL',
      targetRole: 'Full Stack Engineer',
      targetCompany: 'Google',
      industry: 'Technology',
      experienceLevel: 'MID',
      focusAreas: ['React', 'Node.js', 'System Architecture', 'PostgreSQL'],
      interviewGoal: 'Senior Engineering Calibration',
      durationMins: 20,
    });

    expect(session).toBeDefined();
    expect(session.id).toBeDefined();
    sessionId = session.id;

    expect(session.userId).toBe(testUserId);
    expect(session.targetRole).toBe('Full Stack Engineer');
    expect(session.targetCompany).toBe('Google');
    expect(session.status).toBe('SETUP');
    expect(session.durationMins).toBe(20);
  });

  it('Step 2: Starts session, delivers opening question from server, and records chat history', async () => {
    const result = await oralService.startSession(sessionId, testUserId);

    expect(result).toBeDefined();
    expect(result.session).toBeDefined();
    expect(result.session.status).toBe('IN_PROGRESS');
    expect(result.currentQuestion).toBeDefined();

    const q = result.currentQuestion;
    expect(q.id).toBeDefined();
    initialQuestionId = q.id;

    expect(q.sessionId).toBe(sessionId);
    expect(q.orderIndex).toBe(1);
    expect(q.questionType).toBe('TECHNICAL');
    expect(q.questionText).toContain('Google');

    // Verify session retrieval includes opening question and chat history
    const retrieved = await oralService.getSession(sessionId, testUserId);
    expect(retrieved.status).toBe('IN_PROGRESS');
    expect(retrieved.questions.length).toBeGreaterThanOrEqual(1);
    expect(retrieved.chatHistory.length).toBeGreaterThanOrEqual(1);
    expect(retrieved.chatHistory[0].role).toBe('ai');
  });

  it('Step 3: Submits candidate answer, triggers smart evaluation, and generates dynamic follow-up question stored in DB', async () => {
    const candidateAnswer = "In our recent web platform at scale, we architected the frontend with React and Zustand for predictable state distribution, while our backend runs on Node.js microservices with PostgreSQL. To optimize throughput, we integrated Redis as an in-memory caching layer with cache-aside pattern.";

    const result = await oralService.submitAnswer(
      sessionId,
      testUserId,
      initialQuestionId,
      candidateAnswer,
      45,
      false
    );

    expect(result).toBeDefined();
    expect(result.answerText).toBe(candidateAnswer);
    expect(result.evalScore).toBeGreaterThanOrEqual(70);
    expect(result.evalFeedback).toBeDefined();

    // The answer mentioned Redis caching & React, so Ava must ask an intelligent follow-up
    expect(result.isFollowUp).toBe(true);
    expect(result.nextQuestion).toBeDefined();
    expect(result.nextQuestion.questionType).toBe('FOLLOW_UP');
    expect(result.nextQuestion.orderIndex).toBe(2);
    expect(result.spokenResponse).toBeDefined();

    followUpQuestionId = result.nextQuestion.id;

    // Verify DB persistence of both candidate response and follow-up question
    const updatedSession = await oralService.getSession(sessionId, testUserId);
    expect(updatedSession.questions.length).toBe(2);
    expect(updatedSession.questions[0].answerText).toBe(candidateAnswer);
    expect(updatedSession.questions[1].id).toBe(followUpQuestionId);
    expect(updatedSession.questions[1].questionType).toBe('FOLLOW_UP');

    // Chat history should now have candidate response + Ava follow-up
    const userMsg = updatedSession.chatHistory.find((c: any) => c.role === 'user');
    expect(userMsg).toBeDefined();
    expect(userMsg.content).toBe(candidateAnswer);
  });

  it('Step 4: Candidate answers follow-up, and server advances to next domain stage question (Database & Scalability)', async () => {
    const followUpAnswer = "For cache invalidation with Redis, we use TTL expirations combined with event-driven pub/sub invalidation on database write mutations to prevent stale reads. To prevent cache stampede under traffic spikes, we implemented distributed mutex locking so only a single request warms the cache.";

    const result = await oralService.submitAnswer(
      sessionId,
      testUserId,
      followUpQuestionId,
      followUpAnswer,
      40,
      false
    );

    expect(result).toBeDefined();
    expect(result.isFollowUp).toBe(false); // Follow-up was answered, so now advances to next core stage
    expect(result.nextQuestion).toBeDefined();
    expect(result.nextQuestion.orderIndex).toBe(3);
    expect(result.spokenResponse).toContain("next core topic");

    // Verify questions in session
    const updatedSession = await oralService.getSession(sessionId, testUserId);
    expect(updatedSession.questions.length).toBe(3);
    expect(updatedSession.questions[1].answerText).toBe(followUpAnswer);
  });

  it('Step 5: Candidate skips question with empathetic bridge and advances cleanly', async () => {
    const sessionNow = await oralService.getSession(sessionId, testUserId);
    const activeQ = sessionNow.questions[2];

    const result = await oralService.submitAnswer(
      sessionId,
      testUserId,
      activeQ.id,
      "I am not familiar with this specific concurrency pattern, can we please skip to the next topic?",
      10,
      true
    );

    expect(result).toBeDefined();
    expect(result.evaluation.isSkip).toBe(true);
    expect(result.isFollowUp).toBe(false);
    expect(result.spokenResponse).toContain("completely fine");
    expect(result.nextQuestion).toBeDefined();

    const updatedSession = await oralService.getSession(sessionId, testUserId);
    expect(updatedSession.questions.length).toBe(4);
    expect(updatedSession.questions[2].answerText).toContain('[Candidate skipped');
  });

  it('Step 6: Completes interview and verifies 8-dimensional performance report and schema persistence', async () => {
    const completed = await oralService.completeSession(sessionId, testUserId, {
      proctoring: {
        tabBlurCount: 0,
        eyeContactScore: 92,
      },
      confidenceMetrics: {
        score: 88,
        videoConfidence: 86,
        postureStatus: 'Optimal',
        composureLevel: 'Poised',
      },
    });

    expect(completed.status).toBe('COMPLETED');
    expect(completed.completedAt).toBeDefined();
    expect(completed.overallScore).toBeGreaterThanOrEqual(60);

    const analysis = completed.analysis;
    expect(analysis).toBeDefined();
    expect(analysis.overallScore).toBeDefined();
    expect(analysis.technicalScore).toBeDefined();
    expect(analysis.communicationScore).toBeDefined();
    expect(analysis.confidenceScore).toBeDefined();
    expect(analysis.structureScore).toBeDefined();
    expect(analysis.problemSolvingScore).toBeDefined();
    expect(analysis.depthScore).toBeDefined();
    expect(analysis.relevanceScore).toBeDefined();
    expect(analysis.industryReadinessScore).toBeDefined();

    expect(analysis.strengths.length).toBeGreaterThan(0);
    expect(analysis.improvements.length).toBeGreaterThan(0);
    expect(analysis.readinessVerdict).toMatch(/READY|ALMOST_READY|NOT_READY/);

    // Verify session in DB has COMPLETED status
    const finalSession = await oralService.getSession(sessionId, testUserId);
    expect(finalSession.status).toBe('COMPLETED');
    expect(finalSession.questions.length).toBeGreaterThanOrEqual(4);
  });

  it('Step 7: Validates contextual follow-up generator logic for varied engineering answers', () => {
    const fupFrontend = generateContextualFollowUp('Frontend Lead', 'Meta', 'React overview', 'We used React and Redux with virtual dom optimization.');
    expect(fupFrontend.followUpText).toContain('state updates');
    expect(fupFrontend.spokenBridge).toContain('frontend architecture');

    const fupDatabase = generateContextualFollowUp('Backend Dev', 'Amazon', 'Storage overview', 'We designed our PostgreSQL schema with foreign keys and custom SQL indexes.');
    expect(fupDatabase.followUpText).toContain('indexing strategies');
    expect(fupDatabase.spokenBridge).toContain('database');

    const fupMicroservices = generateContextualFollowUp('Fullstack', undefined, 'API overview', 'Our microservices publish events over Kafka to asynchronous queue consumers.');
    expect(fupMicroservices.followUpText).toContain('idempotency');
    expect(fupMicroservices.spokenBridge).toContain('resilience');
  });

  it('Step 8: Validates avatar viseme mapping & clean markdown speech synthesis', () => {
    // Viseme mappings for Ready Player Me / Oculus 3D Rigs
    expect(mapVisemeIdToOculus('viseme_aa')).toBe<OculusViseme>('viseme_aa');
    expect(mapVisemeIdToOculus('viseme_O')).toBe<OculusViseme>('viseme_O');
    expect(mapVisemeIdToOculus('viseme_E')).toBe<OculusViseme>('viseme_E');
    expect(mapVisemeIdToOculus('viseme_sil')).toBe<OculusViseme>('viseme_sil');

    // Clean speech markdown normalization
    const cleanSpeech = cleanMarkdown("## Technical Question\nCan you explain **RESTful APIs** with `PostgreSQL` and *CI/CD*?");
    expect(cleanSpeech).not.toContain('##');
    expect(cleanSpeech).not.toContain('**');
    expect(cleanSpeech).not.toContain('`');
    expect(cleanSpeech).toContain('Postgres');
    expect(cleanSpeech).toContain('C I C D');
  });
});
