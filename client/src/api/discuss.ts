import apiClient from './client';

export interface DiscussionPost {
  id: string;
  userId: string;
  authorName: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  upvotedUserIds?: string[];
  aiReply?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getDiscussionPosts = async (category?: string, search?: string): Promise<DiscussionPost[]> => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);

  const response = await apiClient.get<DiscussionPost[]>(`/discuss?${params.toString()}`);
  return response.data;
};

export const createDiscussionPost = async (data: {
  category: string;
  title: string;
  content: string;
  tags?: string[];
  askAiModerator?: boolean;
}): Promise<DiscussionPost> => {
  const response = await apiClient.post<DiscussionPost>('/discuss', data);
  return response.data;
};

export const upvoteDiscussionPost = async (id: string): Promise<DiscussionPost> => {
  const response = await apiClient.post<DiscussionPost>(`/discuss/${id}/upvote`);
  return response.data;
};
