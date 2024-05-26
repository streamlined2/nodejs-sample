import express from 'express';
import periods from './periods';

const router = express.Router();

router.use('/api/period', periods);

export default router;
