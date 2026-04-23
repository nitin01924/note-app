import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import * as crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";

//
// !!==================== Register-User ====================!!

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

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
// !!==================== Login-User ====================!!

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

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

//
// !!==================== Resend-Verification ================!!

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.json({ message: "Email already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.verificationToken = token;
  await user.save();

  await sendVerificationEmail(user.email, token);

  res.json({ message: "Verification email resent" });
});

//
// !!==================== Forgot-Password ====================!!

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // time = 10 minutes.

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendVerificationEmail(user.email, resetToken);

  res.json({ message: "Password reset email sent" });
});

//
// !!==================== Reset-Password ====================!!

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "invalid or expired token",
    });
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
  res.json({ message: "Password reset successful" });
});
