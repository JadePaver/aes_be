import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authRoles } from "../middlewares/authRoles.js";
import {
  getAllActive,
  getByUserId,
  createClassroom,
  removeClassroom,
  updateClassroom,
  getClassMembers,
  removeMember,
  addMember,
  transferStudents,
  assignUser,
} from "../controllers/classroomController.js";

const router = express.Router();

router.post("/", authenticateToken, authRoles([1, 3, 5]), getAllActive);
router.post("/get_by_userID", authenticateToken, authRoles([1, 3, 5]), getByUserId);
router.post("/create", authenticateToken, authRoles([1, 3, 5]), createClassroom);
router.post("/remove/:class_id", authenticateToken, authRoles([1, 3, 5]), removeClassroom);
router.post("/update/:class_id", authenticateToken, authRoles([1, 3, 5]), updateClassroom);
router.post("/get_members/:class_id", authenticateToken, getClassMembers);
router.post("/remove_member/:user_id", authenticateToken, authRoles([1, 3, 5]), removeMember);
router.post("/add_member/:user_code", authenticateToken, authRoles([1, 3, 5]), addMember);
router.post("/transfer_students/:class_id", authenticateToken, authRoles([1, 3, 5]), transferStudents);
router.post("/assign_user/:class_id", authenticateToken, authRoles([1, 3, 5]), assignUser);

export default router;
