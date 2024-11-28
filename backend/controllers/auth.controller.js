import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Replace with the actual path to your User model

// User Registration
export const userRegister = async (req, res) => {
    const { username, email, password } = req.body;
    
    if(!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign(
            { id: newUser._id, role: "User", username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({ message: "User registered successfully.", token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};

// User Login
export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        // Verify the password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role, username: existingUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ token, message: "Login successful.",
            user: { id: existingUser._id, username: existingUser.username, email: existingUser.email, role: existingUser.role }
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};
