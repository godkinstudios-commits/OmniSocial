import { Post, User } from '../types';

const POSTS_KEY = 'omnipost_posts';
const USERS_KEY = 'omnipost_users';
const SESSION_KEY = 'omnipost_session';

// --- Posts Logic ---

export const getPosts = (): Post[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePost = (post: Post): Post[] => {
  const posts = getPosts();
  const newPosts = [post, ...posts];
  localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
  return newPosts;
};

export const likePost = (postId: string): Post[] => {
  const posts = getPosts();
  const updated = posts.map(p => 
    p.id === postId ? { ...p, likes: p.likes + 1 } : p
  );
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  return updated;
};

// --- Auth Logic ---

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const registerUser = (data: Omit<User, 'id' | 'avatarUrl' | 'joinedAt'>): User => {
  const users = getUsers();
  
  if (users.find(u => u.email === data.email)) {
    throw new Error('Email already exists');
  }

  if (users.find(u => u.handle === data.handle)) {
    throw new Error('Handle already exists');
  }

  const newUser: User = {
    ...data,
    id: `user_${Date.now()}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.handle}`, // Auto-generate avatar
    joinedAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};
