import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAllActive,
  createClassroom,
  removeClassroom
} from "../controllers/classroomController.js";

const router = express.Router();

router.post("/", authenticateToken, getAllActive);
router.post("/create", authenticateToken, createClassroom);
router.post("/remove/:class_id", authenticateToken, removeClassroom);

export default router;
