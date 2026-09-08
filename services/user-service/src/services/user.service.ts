import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';

export const userService = {
  async getProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { resumes: true },
    });

    if (!profile) {
      return prisma.userProfile.create({
        data: {
          userId,
          name: 'User',
          email: `${userId}@user.local`,
        },
        include: { resumes: true },
      });
    }

    return profile;
  },

  async updateProfile(userId: string, data: any) {
    return prisma.userProfile.upsert({
      where: { userId },
      update: {
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        title: data.title,
        experienceYears: data.experienceYears,
        targetRoles: data.targetRoles,
      },
      create: {
        userId,
        name: data.name || 'User',
        email: `${userId}@user.local`,
        bio: data.bio,
        title: data.title,
      },
    });
  },

  async addResume(userId: string, file: any) {
    const profile = await this.getProfile(userId);
    return prisma.resume.create({
      data: {
        profileId: profile.id,
        fileName: file.originalname || 'resume.pdf',
        filePath: file.path || '/uploads/resume.pdf',
        skills: ['TypeScript', 'Node.js', 'React'],
      },
    });
  },
};
