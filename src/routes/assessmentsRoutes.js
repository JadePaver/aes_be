import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  create,
  uploadModule,
  getAllAssigned,
  getByIDWithTimer,
  recordResult,
  startAssessment,
  findLastResult,
  userResults,
  test
} from "../controllers/assessmentController.js";

const router = express.Router();

router.post("/create/:object_data", authenticateToken, create, uploadModule);
router.post("/get_all_assigned/:subject_id", authenticateToken, getAllAssigned);
router.post("/get_by_id/:assessment_id", authenticateToken, getByIDWithTimer);
router.post("/record_result/:assessment_id", authenticateToken, recordResult);
router.post("/start/:assessment_id", authenticateToken, startAssessment);
router.post("/last_record/:assessment_id", authenticateToken, findLastResult);
router.post("/user_results/:subject_id", authenticateToken, userResults);
router.post("/test", authenticateToken, test);

export default router;
