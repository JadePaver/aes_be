import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";

import { viewResult } from "../controllers/assessmentResultsController.js";

const router = express.Router();

router.post("/view/:assessment_id", authenticateToken, viewResult);

export default router;
