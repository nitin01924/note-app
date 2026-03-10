import mongoose from "mongoose";

const noteschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "default",
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteschema);

export default Note;
