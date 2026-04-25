import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import * as crypto from "crypto";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/sendEmail.js";
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
    res.status(400);
    throw new Error("The data fields are empty");
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
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
    res.status(400);
    throw new Error("email and password are required");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found. Please register first.");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Please verify your email first");
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    res.status(401);
    throw new Error("Invalid email or password");
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
    res.status(400);
    throw new Error("Invalid or expired token");
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
    res.status(404);
    throw new Error("User not found");
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
    res.status(400);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // time = 10 minutes.

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendResetPasswordEmail(user.email, resetToken);

  res.json({ message: "Password reset email sent" });
});

//
// !!==================== Reset-Password ====================!!

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("invalid or expired token");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  user.password = password;
  user.markModified("password"); //  force update
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
  res.json({ message: "Password reset successful" });
});
