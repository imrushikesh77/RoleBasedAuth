import Post from "../models/post.model.js"; // Replace with the actual path to your Post model
import User from "../models/user.model.js";
// Create a Post
export const postCreate = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Assuming you use middleware to attach user data to the request
    try {
        const authorName = await User.findById(userId).select("username");
        // Create a new post
        const newPost = new Post({
            content,
            author: userId,
            authorName: authorName.username
        });

        // Save the post to the database
        await newPost.save();

        res.status(201).json({ message: "Post created successfully.", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post. Please try again later." });
    }
};

// Get All Posts
export const postRead = async (req, res) => {
    try {
        // Retrieve all posts, populating the author's details if needed
        const posts = await Post.find() 
        
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve posts. Please try again later." });
    }
};

// Delete a Post
export const postDelete = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming middleware for user authentication and role check

    try {
        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Check if the user is an admin or the author of the post
        if (post.author.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this post." });
        }

        // Use findByIdAndDelete for deletion
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post. Please try again later." });
    }
};
