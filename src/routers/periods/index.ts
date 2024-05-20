import express from 'express';
import {
  savePeriod,
} from 'src/controllers/periods';

const router = express.Router();

router.post('', savePeriod);

export default router;
