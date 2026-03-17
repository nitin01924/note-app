import Note from "../models/Note.js";
import asyncHandler from "../middlewares/asyncHandler.js";

//CREATE-NOTE
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, pinned } = req.body;
  const note = await Note.create({
    title,
    content,
    pinned,
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    data: note,
  });
});

export const getNote = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    data: notes,
  });
});
