import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"; 

// Create a Comment
export const commentCreate = async (req, res) => {
    const { postId, content, author, authorName  } = req.body;
    
    const userId = req.user.id; 

    try {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Create a new comment
        const newComment = new Comment({
            post: postId,
            author: userId,
            content,
            authorName
        });

        // Save the comment
        await newComment.save();

        res.status(201).json({ message: "Comment added successfully.", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add comment. Please try again later." });
    }
};

// Read Comments for a Post
export const commentRead = async (req, res) => {
    const { postId } = req.query;

    try {
        // Retrieve all comments for a specific post
        const comments = await Comment.find({ post: postId });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve comments. Please try again later." });
    }
};

// Delete a Comment
export const commentDelete = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming middleware attaches `req.user`
    const userRole = req.user.role; // Assuming middleware attaches user role to `req.user`

    try {
        // Find the comment
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Check if the user is the comment author or an admin
        if (comment.author.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this comment." });
        }

        // Delete the comment
        await comment.remove();

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete comment. Please try again later." });
    }
};
