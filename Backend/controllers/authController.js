import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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

  const user = await User.create({ name, email: normalizedEmail, password });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

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
    return res.status(401).json({
      message: "user does not exist, register it",
    });
  }

  res.status(201).json({
    name: user.name,
    id: user._id,
    email: user.email,
    token: generateToken(user._id),
  });
});
