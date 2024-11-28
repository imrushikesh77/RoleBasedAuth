import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const dbConnect = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("Error connecting to MongoDB", error.message);
    });
}

export default dbConnect;