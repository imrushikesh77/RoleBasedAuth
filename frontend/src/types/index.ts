export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Post {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  postId: string;
  createdAt: string;
}