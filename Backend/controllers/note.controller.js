import Note from "../models/Notes";
import asyncHandler from "../middlewares/asyncHandlers";

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
    success:true,
    data: note,
  });
});
