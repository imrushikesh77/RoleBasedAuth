import { create } from 'zustand';
import type { Post, Comment } from '../types';
import { useAuthStore } from './authStore';

interface PostState {
  posts: Post[];
  addPost: (content: string, authorId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, authorId: string, authorName: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
  deleteComment: (commentId: string, postId: string) => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],

  // Fetch all posts
  fetchPosts: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/post/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();

      // Ensure each post has a valid `comments` array
      const postsWithComments = data.map((post: Post) => ({
        ...post,
        comments: post.comments || [],
      }));

      set({ posts: postsWithComments });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  },

  // Add a new post
  addPost: async (content, authorId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ content, authorId }),
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      await get().fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error adding post:', error);
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const post = get().posts.find((p) => p._id === postId);
    if (!post) return;

    const canDelete = user.role === 'admin' || user._id === post.authorId;
    if (!canDelete) {
      console.error('Unauthorized attempt to delete post');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/post/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      await get().fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  },

  // Add a comment to a post
  addComment: async (postId, content, authorId, authorName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ postId, content, authorId, authorName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment: Comment = await response.json();

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments ? [...post.comments, newComment] : [newComment],
              }
            : post
        ),
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },

  // Delete a comment from a post
  deleteComment: async (commentId, postId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const post = get().posts.find((p) => p._id === postId);
    if (!post) return;

    const comment = post.comments.find((c) => c._id === commentId);
    if (!comment) return;

    const canDelete = user.role === 'admin' || user._id === comment.authorId;
    if (!canDelete) {
      console.error('Unauthorized attempt to delete comment');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/comment/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c._id !== commentId),
              }
            : post
        ),
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  },
}));
