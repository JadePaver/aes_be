import express from 'express';
import prisma from '../prismaClient.js';
import { getAllFilteredRoles, getAllRoles } from '../controllers/roleController.js';

const router = express.Router();

router.get('/filtered', getAllFilteredRoles);
router.get('/', getAllRoles);


export default router;
