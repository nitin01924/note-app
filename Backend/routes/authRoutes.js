import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/verify-email", verifyEmail);

export default router;
