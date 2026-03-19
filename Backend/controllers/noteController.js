import Note from "../models/Note.js";
import asyncHandler from "../middlewares/asyncHandler.js";

//
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

//
// GET NOTE
export const getNote = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    data: notes,
  });
});

//
// DELETE NOTE
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

//
//UPDATE NOTE
export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  // ERROR HANDLING FOR (!NOTE)
  if (!note) {
    return res.status(404).json({
      message: "Note not found!",
    });
  }

  // CHECK AUTHORIZATION
  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized to update this note",
    });
  }

  // UPDATING CONTENT
  const { title, content } = req.body || {}; // adding logic to prevent errors
  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  await note.save(); // saving the note

  res.status(200).json({
    message: "Note updated successfully",
  });
});
