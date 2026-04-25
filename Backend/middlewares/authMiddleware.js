import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  max: 10, // max 10 requests from each IP in 15 min.
  message: {
    message: "Too many requests, please try again later",
  },
});
