import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAllActive,
  createClassroom,
  removeClassroom,
  updateClassroom,
  getClassMembers,
  removeMember,
  addMember,
  transferStudents
} from "../controllers/classroomController.js";

const router = express.Router();

router.post("/", authenticateToken, getAllActive);
router.post("/create", authenticateToken, createClassroom);
router.post("/remove/:class_id", authenticateToken, removeClassroom);
router.post("/update/:class_id", authenticateToken, updateClassroom);
router.post("/get_members/:class_id", authenticateToken, getClassMembers);
router.post("/remove_member/:user_id", authenticateToken, removeMember);
router.post("/add_member/:user_code", authenticateToken, addMember);
router.post("/transfer_students/:class_id", authenticateToken, transferStudents);

export default router;
