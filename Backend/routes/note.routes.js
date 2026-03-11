import express, { Router } from "express";
import { createNote } from "../controllers/note.controller";

const router = express.Router();

router.post("/", createNote);
