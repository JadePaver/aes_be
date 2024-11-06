import express from 'express';
import prisma from '../prismaClient.js';
import { getAllFilteredRoles } from '../controllers/roleController.js';

const router = express.Router();

router.get('/filtered', getAllFilteredRoles);


export default router;
