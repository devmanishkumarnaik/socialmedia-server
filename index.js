import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
// import path from 'path';
// import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"
import { posts, users } from "./data/index.js"
import User from "./models/User.js";
import Post from "./models/Post.js";

// configurations
dotenv.config();
const app = express();
// app.use(express.json());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// routes
app.use("/test", (req, res) => {
    res.send("working!")
})
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/post", postRoutes)

// mongoose setup
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
        // User.insertMany(users)
        // Post.insertMany(posts)
    })
    .catch((error) => console.log("mongodb did not connect", error.message));
