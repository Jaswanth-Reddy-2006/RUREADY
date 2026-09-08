import apiClient from './client';
import { UserProfile, Resume } from '@ru-ready/shared';

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/user/profile');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>('/user/profile', data);
    return response.data;
  },

  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiClient.post<Resume>('/user/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
