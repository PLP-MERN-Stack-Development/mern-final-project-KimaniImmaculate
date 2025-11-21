// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_zawify_2025");
    req.user = { id: decoded.id }; // This is what your route expects
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;