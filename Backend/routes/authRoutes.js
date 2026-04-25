import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getMe);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/forgot-password", authLimiter, forgotPassword);

export default router;
