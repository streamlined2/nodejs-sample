import express from 'express';
import {
  savePeriod,
  getPeriodsForPersonSortedByTimeDesc,
  getCountsForPersonIds
} from 'src/controllers/periods';

const router = express.Router();

router.post('', savePeriod);
router.get('/:personId', getPeriodsForPersonSortedByTimeDesc);
router.post('/_counts', getCountsForPersonIds)

export default router;
