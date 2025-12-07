import React, { useEffect, useState } from 'react';
import { CreatePost } from './components/CreatePost';
import { PostCard } from './components/PostCard';
import { InstallPrompt } from './components/InstallPrompt';
import { AuthScreen } from './components/AuthScreen';
import { getPosts, savePost, getCurrentUser, likePost, logoutUser } from './services/storageService';
import { Post, CreatePostPayload, User } from './types';
import { PlusIcon, LogOutIcon } from './components/Icons';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMobileCreate, setShowMobileCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);

    if (user) {
      loadFeed();
    }
  }, []);

  const loadFeed = () => {
    const loadedPosts = getPosts();
    // Sort posts by date (newest first)
    setPosts(loadedPosts.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    loadFeed();
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleCreatePost = async (payload: CreatePostPayload) => {
    if (!currentUser) return;

    let imageUrl;
    if (payload.imageFile) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(payload.imageFile!);
      });
    }

    const newPost: Post = {
      id: Date.now().toString(),
      content: payload.content,
      imageUrl,
      createdAt: Date.now(),
      likes: 0,
      author: currentUser,
      isAiEnhanced: false
    };

    const updatedPosts = savePost(newPost);
    setPosts(updatedPosts.sort((a, b) => b.createdAt - a.createdAt));
    setShowMobileCreate(false);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = (id: string) => {
    likePost(id);
    // Refresh posts to ensure sync, though optimistic update in card handles UI
    // In a real app we'd just update local state without full reload
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth Screen
  if (!currentUser) {
    return <AuthScreen onSuccess={handleLoginSuccess} />;
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 flex items-center justify-center shadow-sm">
        <div className="w-full max-w-2xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer">
              O
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">OmniPost</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 mr-2">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUser.name}</span>
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                  <img src={currentUser.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                </div>
             </div>
             <button 
               onClick={handleLogout}
               className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
               title="Sign Out"
             >
               <LogOutIcon className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="pt-20 px-4 w-full max-w-2xl mx-auto">
        
        {/* Desktop Create Post */}
        <div className="hidden md:block">
           <CreatePost onSubmit={handleCreatePost} />
        </div>

        {/* Mobile Create Post Modal */}
        {showMobileCreate && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-50/95 backdrop-blur-sm p-4 pt-20 animate-in fade-in slide-in-from-bottom-10">
            <button 
              onClick={() => setShowMobileCreate(false)}
              className="absolute top-4 right-4 text-gray-500 p-2 font-medium"
            >
              Cancel
            </button>
            <CreatePost onSubmit={handleCreatePost} />
          </div>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white p-6 rounded-2xl shadow-sm inline-block mb-4">
                 <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">No posts yet</h3>
              <p className="text-gray-500">Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))
          )}
          
          {posts.length > 0 && (
            <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
              You're all caught up! 🎉
            </div>
          )}
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setShowMobileCreate(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-40"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <InstallPrompt />
    </div>
  );
}

export default App;
