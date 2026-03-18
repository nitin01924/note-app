import express, { Router } from "express";
import {
  createNote,
  deleteNote,
  getNote,
} from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNote);
router.delete("/", protect, deleteNote);

export default router;
