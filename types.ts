export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  likes: number;
  author: User;
  tags?: string[];
  isAiEnhanced?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  handle: string;
  email: string;
  password?: string; // In a real app, never store plain text passwords client-side
  bio?: string;
  joinedAt: number;
}

export interface CreatePostPayload {
  content: string;
  imageFile?: File | null;
}
