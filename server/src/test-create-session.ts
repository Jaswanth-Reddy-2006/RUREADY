import { prisma } from './lib/prisma.js';
import { InterviewType, ExperienceLevel, SessionStatus } from '@ru-ready/shared';

async function main() {
  try {
    console.log('Testing Prisma Interview Session Creation...');
    const userId = 'cmpeeaska0000v8qs52ti4xld';
    
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        interviewType: InterviewType.PRACTICE,
        targetRole: 'Frontend Engineer',
        targetCompany: 'General Practice',
        industry: 'Technology',
        experienceLevel: ExperienceLevel.MID,
        focusAreas: ['General Interview Practice'],
        interviewGoal: '[Timer: 20][Difficulty: MEDIUM][Skills: ][Tools: ][Subjects: ]',
        durationMins: 20,
        resumeId: null,
        status: SessionStatus.SETUP,
      },
      include: {
        resume: true,
      },
    });
    console.log('Successfully created session:', session);
  } catch (error) {
    console.error('Error creating interview session:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
