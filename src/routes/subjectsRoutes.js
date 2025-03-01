import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authRoles } from "../middlewares/authRoles.js";
import {
  getAllAssignedSubjectsByUserID,
  getAllSubjects,
  createSubject,
  enrollClassroom,
  getMembers,
  removeMember,
  enrollUser,
  getAssigned,
  subjectDetails,
  updateSubject,
  enrollToSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", authenticateToken, authRoles([1, 3, 5]), getAllSubjects);
router.post("/get_by_userID", authenticateToken, authRoles([1, 3, 5]), getAllAssignedSubjectsByUserID);
router.post("/create", authenticateToken, authRoles([1, 3, 5]), createSubject);
router.put("/update/:id/name", authenticateToken,authRoles([1, 3, 5]), updateSubject); //ngaa may "name" it could be /update_name/:params
router.post("/enroll_classroom/:subject_id", authenticateToken, authRoles([1, 3, 5]), enrollClassroom);
router.post("/get_members/:subject_id", authenticateToken, getMembers);
router.post("/remove_member/:user_id", authenticateToken, authRoles([1, 3, 5]), removeMember);
router.post("/enroll_user/:user_code", authenticateToken, authRoles([1, 3, 5]),enrollUser);
router.post("/join", authenticateToken, enrollToSubject);
router.post("/get_assigned", authenticateToken, getAssigned);
router.post("/details/:subject_id", authenticateToken, subjectDetails);

export default router;
