import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            role: decoded.role,
            id: decoded.id,
        };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token." });
    }
}

export default auth;