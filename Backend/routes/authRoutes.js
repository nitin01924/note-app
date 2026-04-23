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
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;
