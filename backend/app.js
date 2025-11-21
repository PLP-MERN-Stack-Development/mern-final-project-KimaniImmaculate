import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://zawify.vercel.app/", 
  credentials: true, // if you are sending cookies
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/ai", aiRoutes);

// Error handler
app.use(errorHandler);

export default app;
