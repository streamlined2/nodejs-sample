import express from 'express';
import ping from 'src/controllers/ping';
import groups from './groups';
import students from './students';
import periods from './periods';

const router = express.Router();

router.get('/ping', ping);

router.use('/groups', groups);
router.use('/students', students);
router.use('/periods', periods);

export default router;
