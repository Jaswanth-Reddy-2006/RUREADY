// ═══════════════════════════════════════════════════════════════
// R U Ready? — Database Seed Script
// Populates the database with beautiful, realistic mock data
// ═══════════════════════════════════════════════════════════════

import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import {
  InterviewType,
  ExperienceLevel,
  SessionStatus,
  QuestionType,
  Difficulty,
  ReadinessVerdict,
} from '@ru-ready/shared';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing database
  console.log('🧹 Cleaning existing data...');
  await prisma.analysis.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.interviewSession.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create standard test user
  console.log('👤 Creating test user...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@ruready.com',
      name: 'Alex Johnson',
      passwordHash,
    },
  });
  console.log(`✅ Created user: ${testUser.email} (password: password123)`);

  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ruready.ai',
      name: 'RU Ready Administrator',
      passwordHash: adminPasswordHash,
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email} (password: Admin@12345)`);

  // 3. Create a mock resume
  console.log('📄 Creating mock resume...');
  const mockResume = await prisma.resume.create({
    data: {
      userId: testUser.id,
      fileName: 'alex_johnson_resume.pdf',
      filePath: 'uploads/resumes/alex_johnson_resume.pdf',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'REST APIs'],
      experience: {
        roles: [
          {
            title: 'Frontend Engineer',
            company: 'DesignFlow Inc.',
            years: 2,
            description: 'Built beautiful responsive React applications and led state migration to Zustand.',
          },
        ],
      },
      parsedText: 'Alex Johnson - Full Stack Engineer. Specializes in React, Node.js, and TypeScript. 2+ years of experience building responsive dashboards and user-centric interfaces.',
    },
  });
  console.log(`✅ Created resume: ${mockResume.fileName}`);

  // 4. Create completed interview session
  console.log('🎤 Creating completed interview session...');
  const completedSession = await prisma.interviewSession.create({
    data: {
      userId: testUser.id,
      resumeId: mockResume.id,
      interviewType: InterviewType.JOB,
      targetRole: 'Full Stack Engineer',
      targetCompany: 'Stripe',
      industry: 'Tech',
      experienceLevel: ExperienceLevel.MID,
      focusAreas: ['DSA', 'Communication', 'System Design'],
      interviewGoal: 'Ace Stripe technical screen and behavioral review',
      durationMins: 30,
      status: SessionStatus.ANALYSED,
      startedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      completedAt: new Date(Date.now() - 3600000),  // 1 hour ago
      createdAt: new Date(Date.now() - 3600000 * 3),
    },
  });

  // 5. Add interview questions and answers
  console.log('❓ Seeding interview questions and answers...');
  await prisma.question.createMany({
    data: [
      {
        sessionId: completedSession.id,
        orderIndex: 0,
        questionText: 'Can you describe your experience with React state management and why you chose Zustand over Redux?',
        questionType: QuestionType.TECHNICAL,
        difficulty: Difficulty.MEDIUM,
        answerText: 'In my last role, we migrated from Redux to Zustand because Redux required too much boilerplate code. Zustand has a much simpler API, integrates seamlessly with React Hooks, and has a smaller bundle size. It allowed us to structure state in micro-stores, making development faster and significantly reducing re-renders on highly interactive dashboards.',
        answeredAt: new Date(),
        timeTakenSecs: 45,
        evalScore: 92,
        evalFeedback: 'Exceptional explanation that clearly demonstrates professional engineering reasoning. Excellent comparison of API complexity, bundle size, and performance impacts.',
        evalStrengths: ['API simplicity insight', 'Performance details', 'No boilerplate arguments'],
        evalWeaknesses: [],
        betterAnswer: 'To make it even stronger, mention that Zustand uses simple closures instead of Context providers, which helps bypass React render cycles completely for subscription-based updates.',
      },
      {
        sessionId: completedSession.id,
        orderIndex: 1,
        questionText: 'How do you ensure high performance and responsiveness in web applications?',
        questionType: QuestionType.TECHNICAL,
        difficulty: Difficulty.MEDIUM,
        answerText: 'I focus on reducing initial bundle sizes by using dynamic imports and code splitting. I also use optimized responsive image formats like WebP, implement standard caching policies, and make sure that visual elements do not cause layout shifts. For slow database queries, we implemented index optimization in PostgreSQL.',
        answeredAt: new Date(),
        timeTakenSecs: 60,
        evalScore: 85,
        evalFeedback: 'Solid coverage of both frontend optimization (code-splitting, WebP) and backend (SQL indexing). Excellent breadth.',
        evalStrengths: ['Frontend-backend full-stack view', 'Code splitting references', 'Layout shift awareness'],
        evalWeaknesses: ['Lacked mention of virtualized lists for heavy dashboard rendering'],
        betterAnswer: 'Include reference to virtualization (e.g. react-window) for handling large lists, and CDNs for assets.',
      },
      {
        sessionId: completedSession.id,
        orderIndex: 2,
        questionText: 'Tell me about a time you faced a difficult conflict with a team member. How did you resolve it?',
        questionType: QuestionType.BEHAVIOURAL,
        difficulty: Difficulty.MEDIUM,
        answerText: 'During a release cycle, a senior designer and I had a disagreement about implementing custom animations that were slowing down load times. I scheduled a call to listen to their design intent, and we collaborated on using lighter CSS transitions instead of heavy Javascript libraries. This preserved the premium aesthetic while maintaining fast load times, and we delivered the project on time.',
        answeredAt: new Date(),
        timeTakenSecs: 75,
        evalScore: 88,
        evalFeedback: 'Great use of the STAR method. Addressed conflict directly and professionally, emphasizing collaboration and compromise over being "correct."',
        evalStrengths: ['Active listening emphasis', 'STAR structure', 'Action-oriented resolution'],
        evalWeaknesses: [],
        betterAnswer: 'Quantify the outcome slightly if possible (e.g., "This kept the page load under 1.5 seconds").',
      },
    ],
  });

  // 6. Create Analysis
  console.log('📊 Seeding detailed AI analysis...');
  await prisma.analysis.create({
    data: {
      sessionId: completedSession.id,
      overallScore: 88,
      communicationScore: 90,
      technicalScore: 88,
      confidenceScore: 85,
      structureScore: 89,
      summary: 'Alex presented an exceptionally strong performance, especially regarding full-stack engineering logic and collaborative communication. They structured their answers beautifully and demonstrated deep practical knowledge of React state management, performance optimization, and teamwork conflict resolution.',
      strengths: [
        'Clear, structured answers using the STAR method for behavioral questions',
        'Strong technical foundations in React, state management, and modern Web APIs',
        'Empathetic and collaborative style in resolving conflicts',
      ],
      improvements: [
        'Could include more concrete metric-based outcomes when describing engineering achievements',
        'Make sure to mention virtualization techniques for extremely large lists in high-performance contexts',
      ],
      actionableTips: [
        {
          tip: 'Integrate metrics to quantify outcomes',
          reason: 'Adding hard metrics (e.g. "reduced bundle size by 40%") turns a good technical response into an undeniable business outcome.',
          resource: 'STAR Framework Metric Strategy Guides',
        },
        {
          tip: 'Study virtualization patterns',
          reason: 'Stripe frequently asks about performance constraints at scale; virtualized list architectures demonstrate deep performance expertise.',
          resource: 'React Virtualization and Windowing Best Practices',
        },
      ] as any,
      readinessVerdict: ReadinessVerdict.READY,
    },
  });

  // 7. Create an active session in SETUP state
  console.log('🎤 Seeding setup session...');
  await prisma.interviewSession.create({
    data: {
      userId: testUser.id,
      interviewType: InterviewType.INTERNSHIP,
      targetRole: 'Junior Frontend Developer',
      targetCompany: 'Netflix',
      industry: 'Tech',
      experienceLevel: ExperienceLevel.FRESHER,
      focusAreas: ['DSA', 'Communication'],
      interviewGoal: 'Practice basics and build initial confidence',
      durationMins: 15,
      status: SessionStatus.SETUP,
    },
  });

  // 8. Seed predefined coding problems
  console.log('💻 Seeding predefined coding problems...');
  await prisma.preDefinedProblem.deleteMany({});
  await prisma.preDefinedProblem.createMany({
    data: [
      {
        title: 'Palindrome Detector',
        difficulty: 'EASY',
        pattern: 'Two Pointers',
        description: 'Write a function solve(str) that returns true if str is a palindrome (ignoring casing and non-alphanumeric characters), and false otherwise.',
        starterCode: {
          javascript: `// Write your JavaScript solution here\nfunction solve(str) {\n  // progressive explanation first, brute force next\n  return null;\n}`,
        },
        testCases: [
          { input: 'racecar', expected: true },
          { input: 'A man, a plan, a canal: Panama', expected: true },
          { input: 'hello', expected: false },
          { input: 'race a car', expected: false },
          { input: '', expected: true },
        ],
        optimalSolution: `function solve(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
        optimalTime: 'O(N)',
        optimalSpace: 'O(1)',
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'MEDIUM',
        pattern: 'Sliding Window',
        description: 'Write a function solve(s) that returns the length of the longest substring without repeating characters.',
        starterCode: {
          javascript: `// Write your JavaScript solution here\nfunction solve(s) {\n  // progressive explanation first, brute force next\n  return null;\n}`,
        },
        testCases: [
          { input: 'abcabcbb', expected: 3 },
          { input: 'bbbbb', expected: 1 },
          { input: 'pwwkew', expected: 3 },
          { input: '', expected: 0 },
        ],
        optimalSolution: `function solve(s) {\n  let maxLength = 0;\n  let start = 0;\n  const seen = new Map();\n  for (let end = 0; end < s.length; end++) {\n    if (seen.has(s[end])) {\n      start = Math.max(start, seen.get(s[end]) + 1);\n    }\n    seen.set(s[end], end);\n    maxLength = Math.max(maxLength, end - start + 1);\n  }\n  return maxLength;\n}`,
        optimalTime: 'O(N)',
        optimalSpace: 'O(N)',
      },
      {
        title: 'Two Sum',
        difficulty: 'EASY',
        pattern: 'Arrays & Hashing',
        description: 'Write a function solve(nums, target) that returns an array of indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice. The return order should be [index1, index2].',
        starterCode: {
          javascript: `// Write your JavaScript solution here\nfunction solve(nums, target) {\n  // progressive explanation first, brute force next\n  return null;\n}`,
        },
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] },
        ],
        optimalSolution: `function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        optimalTime: 'O(N)',
        optimalSpace: 'O(N)',
      }
    ]
  });
  console.log('✅ Created predefined coding problems');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
