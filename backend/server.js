import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import dbConnect from "./config/dbConnect.js";

const PORT = process.env.PORT || 5000;

dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});