import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePostStore } from '../../store/postStore';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const user = useAuthStore((state) => state.user);
  const addPost = usePostStore((state) => state.addPost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    addPost(content, user.id);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={20} />
          Post
        </button>
      </div>
    </form>
  );
}