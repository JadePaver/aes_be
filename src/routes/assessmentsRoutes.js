import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  create,
  uploadModule,
  getAllAssigned,
  getByID,
  recordResult,
  startAssessment,
  findLastResult
} from "../controllers/assessmentController.js";

const router = express.Router();

router.post("/create/:object_data", authenticateToken, create, uploadModule);
router.post("/get_all_assigned/:subject_id", authenticateToken, getAllAssigned);
router.post("/get_by_id/:assessment_id", authenticateToken, getByID);
router.post("/record_result/:assessment_id", authenticateToken, recordResult);
router.post("/start/:assessment_id", authenticateToken, startAssessment);
router.post("/last_record/:assessment_id", authenticateToken, findLastResult);

export default router;
