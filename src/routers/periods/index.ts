import express from 'express';
import {
  savePeriod,
  getPeriodsForPersonSortedByTimeDesc
} from 'src/controllers/periods';

const router = express.Router();

router.post('', savePeriod);
router.get('/:personId', getPeriodsForPersonSortedByTimeDesc);

export default router;
