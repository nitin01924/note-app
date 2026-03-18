import express, { Router } from "express";
import {
  createNote,
  deleteNote,
  getNote,
  updateNote,
} from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNote);
router.delete("/:id", protect, deleteNote);
router.put("/:id", protect, updateNote);

export default router;
