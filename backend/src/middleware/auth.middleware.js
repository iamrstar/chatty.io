import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Or extract from Authorization header if needed
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const userData = await User.findById(decoded.userId).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "Unauthorized - user not found" });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.log("ERROR In protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
