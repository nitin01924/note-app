import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import * as crypto from "crypto";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/sendEmail.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { verifyGoogleIdToken } from "../services/googleAuthService.js";

const authResponse = (user) => ({
  name: user.name,
  id: user._id,
  email: user.email,
  avatar: user.avatar,
  token: generateToken(user._id),
});

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
    success: true,
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
    success: true,
    message: "User has been logged-in",
    data: {
      ...authResponse(user),
    },
  });
});

//
// !!==================== Google-Login ====================!!

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    throw new Error("Google credential is required");
  }

  let googleProfile;
  try {
    googleProfile = await verifyGoogleIdToken(credential);
  } catch (error) {
    res.status(401);
    throw new Error(
      error.message === "Google OAuth is not configured"
        ? error.message
        : "Invalid or expired Google credential",
    );
  }

  const { googleId, email, name, avatar } = googleProfile;
  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await User.create({
      name,
      email,
      avatar,
      provider: "google",
      googleId,
      // Google has already verified ownership of this email address.
      isVerified: true,
    });
  } else {
    // Link a verified Google identity to an existing account without deleting
    // its password; email/password login therefore continues to work.
    if (user.googleId && user.googleId !== googleId) {
      res.status(409);
      throw new Error("This email is linked to another Google account");
    }

    user.googleId = googleId;
    user.avatar = avatar || user.avatar;
    user.isVerified = true;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "User has been logged-in with Google",
    data: authResponse(user),
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

  res.json({ success: true, message: "Email verified successfully" });
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

  res.json({ success: true, message: "Verification email resent" });
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

  res.json({ success: true, message: "Password reset email sent" });
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
  res.json({ success: true, message: "Password reset successful" });
});
