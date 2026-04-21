import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import * as crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "The data fields are empty",
    });
  }
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    verificationToken: token,
  });

  await sendVerificationEmail(user.email, token);

  res.status(201).json({
    message: "Check your email to verify account",
  });
});
//
//
//
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required.",
    });
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found. Please register first.",
    });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      message: "Please verify your email first",
    });
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.status(201).json({
    name: user.name,
    id: user._id,
    email: user.email,
    token: generateToken(user._id),
  });
});

// ABOUT USER
export const getMe = (req, res) => {
  res.json({
    user: req.user,
  });
};

//
// !!==================== Verify_email================!!

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  if (user.isVerified) {
    return res.json({ message: "Email already verified" });
  }

  user.isVerified = true;
  user.verificationToken = null;

  await user.save();

  res.json({ message: "Email verified successfully" });
});
