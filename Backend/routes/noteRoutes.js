import express, { Router } from "express";
import { createNote, getNote } from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNote);

export default router;
