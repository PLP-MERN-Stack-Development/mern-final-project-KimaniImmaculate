// backend/config/db.js
import mongoose from "mongoose";

// Get the URI from the environment variables
const db = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, // While deprecated, leaving for compatibility
      useUnifiedTopology: true, // While deprecated, leaving for compatibility
    });
    console.log("MongoDB Atlas Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
