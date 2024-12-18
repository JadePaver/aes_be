import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  getAllSubjects,
  createSubject,
  enrollClassroom,
  getMembers,
  removeMember,
  enrollUser,
  getAssigned,
  subjectDetails,
  updateSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", authenticateToken, getAllSubjects);
router.post("/create", authenticateToken, createSubject);
router.put("/update/:id/name", authenticateToken, updateSubject); //ngaa may "name" it could be /update_name/:params
router.post(
  "/enroll_classroom/:subject_id",
  authenticateToken,
  enrollClassroom
);
router.post("/get_members/:subject_id", authenticateToken, getMembers);
router.post("/remove_member/:user_id", authenticateToken, removeMember);
router.post("/enroll_user/:user_code", authenticateToken, enrollUser);
router.post("/get_assigned/:user_id", authenticateToken, getAssigned);
router.post("/details/:subject_id", authenticateToken, subjectDetails);
router.post("/edit", authenticateToken);

export default router;
