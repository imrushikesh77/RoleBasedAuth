import { useEffect } from 'react';
import { usePostStore } from '../store/postStore';
import { Header } from '../components/layout/Header';
import { CreatePostForm } from '../components/post/CreatePostForm';
import { PostCard } from '../components/post/PostCard';

export function Feed() {
  const posts = usePostStore((state) => state.posts);
  
  const fetchPosts = usePostStore((state) => state.fetchPosts);

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <CreatePostForm />
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-500 text-center">No posts available. Start by creating a new post!</p>
          )}
        </div>
      </div>
    </div>
  );
}
