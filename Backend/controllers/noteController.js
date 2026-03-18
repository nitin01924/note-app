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

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized to delete this note",
    });
  }

  await note.deleteOne();

  res.status(200).json({
    message: "Note deleted successfully",
  });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found!",
    });
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized to update this note",
    });
  }

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  await note.save();

  res.status(200).json({
    message: "Note updated successfully",
  });
});
