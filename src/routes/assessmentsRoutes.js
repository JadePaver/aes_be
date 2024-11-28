import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { create, uploadModule } from "../controllers/assessmentController.js";

const router = express.Router();

router.post("/create/:object_data", authenticateToken, create, uploadModule);

export default router;
