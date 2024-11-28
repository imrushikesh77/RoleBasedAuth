# Social App (VRV Security Backend Developer Intern Assignment)

## Project Overview

This project is a social application built to demonstrate authentication, authorization, and role-based access control (RBAC) using Node.js, Express, and MongoDB. Users can post text, comment on posts, and manage their content. The app differentiates between regular users and admins, where admins can manage all posts, while regular users can only manage their own posts.

## Key Features

- **User Authentication**: 
  - Users can `sign up, sign in, and sign out` using `JWT`-based authentication.
  - Passwords are hashed using `bcrypt` for secure storage.
  
- **Post Management**:
  - Users can `create, read, update`, and `delete` their own posts.
  - Admins have full control and can manage all posts.
  
- **Comment Management**:
  - Users can `comment` on posts.
  - Admins can delete any `comment`.
  
- **Role-based Access Control (RBAC)**:
  - Admins have extra privileges such as the ability to delete posts and comments from other users.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing
- **Date Handling**: `date-fns` for formatting time intervals
- **Frontend**: ReactJS (for handling the UI)

## Project Structure

### Backend (API)

- **`server.js`**: Entry point for the application. Configures middleware, routes, and database connection.
- **`models/`**:
  - `user.model.js`: Schema for user data, including authentication details and roles.
  - `post.model.js`: Schema for post data, including text content and author information.
  - `comment.model.js`: Schema for comment data, with references to posts and authors.
- **`controllers/`**:
  - `auth.controller.js`: Handles user authentication (signup, signin, signout).
  - `post.controller.js`: Handles creating, deleting, and managing posts.
  - `comment.controller.js`: Handles creating and deleting comments.
- **`middleware/`**:
  - `authMiddleware.js`: Middleware for authenticating users and checking JWT tokens.
- **`routes/`**:
  - `auth.route.js`: Routes for authentication-related endpoints.
  - `post.route.js`: Routes for post-related endpoints.
  - `comment.route.js`: Routes for comment-related endpoints.

### Frontend

- **`src/components/post/CommentList.tsx`**: Displays a list of comments for a post.
- **`src/components/post/PostCard.tsx`**: Displays a single post and allows users to delete their own posts (if they are the author or an admin).
- **`src/pages/Feed.tsx`**: Displays the feed of posts for the user.
- **`src/components/post/CommentForm.tsx`**: Form for adding a comment to a post.
  
## Setup and Installation

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/imrushikesh77/RoleBasedAuth.git
   cd https://github.com/imrushikesh77/RoleBasedAuth.git

## Install dependencies:

```bash
npm install
```
- Create a .env file for environment variables (e.g., database URL, JWT secret):

```makefile
MONGO_URI=<your-mongo-db-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

Run the server:

```bash
npm run dev
```
The backend API will be available at http://localhost:5000.

Frontend Setup
Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install 
```

Start the frontend:

```bash
npm start
```
The React app will be running at http://localhost:5173.

# API Endpoints
## Authentication

- POST /api/auth/signup: Sign up a new user.
- POST /api/auth/signin: Sign in an existing user.
- POST /api/auth/signout: Sign out the current user.
## Post Management
- POST /api/posts: Create a new post.
- GET /api/posts: Get a list of all posts.
- GET /api/posts/:id: Get a specific post by ID.
- DELETE /api/posts/:id: Delete a post (only by the author or admin).
## Comment Management
- POST /api/comments: Add a comment to a post.
- DELETE /api/comments/:id: Delete a comment (only by the author or admin).
## Example Requests
1. Creating a Post
```bash
POST /api/posts
{
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```
2. Adding a Comment
```bash
POST /api/comments
{
  "postId": "674875de4ccbabc27b2a1b07",
  "content": "Great post!"
}
```
3. Deleting a Post (if you're the author or an admin)
```bash
DELETE /api/posts/674875de4ccbabc27b2a1b07
```
4. Deleting a Comment (if you're the author or an admin)
```bash
DELETE /api/comments/674879f9df161c120470d3ad
```
## Troubleshooting
- If you encounter issues connecting to the database, make sure your MongoDB URI is correct in the .env file.
- If you face CORS errors, ensure that CORS middleware is correctly configured in the backend.