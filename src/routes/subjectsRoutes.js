import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAllSubjects,
  createSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", authenticateToken, getAllSubjects);
router.post("/create", authenticateToken, createSubject);

export default router;
