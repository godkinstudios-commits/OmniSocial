import React, { useState, useRef } from 'react';
import { CreatePostPayload } from '../types';
import { enhancePostText, generateHashtags } from '../services/geminiService';
import { ImageIcon, SendIcon, SparklesIcon } from './Icons';

interface CreatePostProps {
  onSubmit: (payload: CreatePostPayload) => Promise<void>;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = async () => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePostText(content);
      const tags = await generateHashtags(content);
      setContent(enhanced + (tags.length > 0 ? '\n\n' + tags.join(' ') : ''));
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    
    await onSubmit({ content, imageFile });
    setContent('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-24 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 resize-none text-gray-700 placeholder-gray-400"
        />
        
        {imageFile && (
          <div className="relative mt-2 rounded-xl overflow-hidden h-32 w-32 group">
            <img 
              src={URL.createObjectURL(imageFile)} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Add Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing || !content.trim()}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isEnhancing || !content.trim()
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <SparklesIcon className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
              {isEnhancing ? 'Magic...' : 'AI Polish'}
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !imageFile)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200"
          >
            <span>Post</span>
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
