import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Trash2, User } from 'lucide-react';
import type { Post } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { usePostStore } from '../../store/postStore';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const user = useAuthStore((state) => state.user);
  const deletePost = usePostStore((state) => state.deletePost);

  const isAdmin = user?.role === 'admin';
  const isAuthor = user?._id === post.authorId;
  const canDelete = isAdmin || isAuthor;

  // Safely format `createdAt` and provide a fallback
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : 'Unknown time';

  const handleDelete = () => {
    if (!canDelete) return;

    const message = 'Are you sure you want to delete your post?';

    if (window.confirm(message)) {
      deletePost(post._id);
    }
  };

  // Fallback to "Unknown Author" if authorName is missing
  const authorName = post.authorName || 'Unknown Author';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <User size={24} className="text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{authorName}</h3>
            </div>
            <p className="text-gray-500 text-sm">{timeAgo}</p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isAdmin || isAuthor
                ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
            title={isAdmin ? 'Delete as admin' : 'Delete your post'}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      <div className="border-t pt-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <MessageSquare size={20} className="mr-2" />
          {post.comments?.length || 0} Comments
        </button>

        {showComments && (
          <div className="mt-4">
            <CommentList comments={post.comments} />
            <CommentForm postId={post._id} />
          </div>
        )}
      </div>
    </div>
  );
}
