import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
      const sex = await prisma.sex_tbl.findMany();

      res.json(sex);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

export default router;