// backend/src/middleware/auth.js — FINAL VERSION
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_zawify_2025");
    
    // THIS IS THE FIX — PASS BOTH ID AND NAME
    req.user = { 
      id: decoded.id, 
      name: decoded.name || "Anonymous" 
    };
    
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;