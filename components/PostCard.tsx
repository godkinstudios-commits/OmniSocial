import React, { useState } from 'react';
import { Post } from '../types';
import { HeartIcon } from './Icons';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(p => p + 1);
      onLike(post.id);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={post.author.avatarUrl} 
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-100" 
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">{post.author.name}</h3>
          <p className="text-xs text-gray-500">{post.author.handle} • {formatTime(post.createdAt)}</p>
        </div>
      </div>

      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-3">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-blue-500 text-sm font-medium">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
          }`}
        >
          <HeartIcon className="w-5 h-5" filled={isLiked} />
          <span>{likeCount}</span>
        </button>
        
        {post.isAiEnhanced && (
            <span className="text-xs text-purple-400 bg-purple-50 px-2 py-1 rounded-md font-medium">
                ✨ AI Enhanced
            </span>
        )}
      </div>
    </div>
  );
};
