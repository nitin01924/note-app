import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email.toLowerCase();

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "The data fields are empty",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});
