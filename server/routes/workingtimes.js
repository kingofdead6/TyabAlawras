import express from 'express';
import { getWorkingTimes, setWorkingTime } from '../controllers/workingtimes.js';

const router = express.Router();

router.get('/', getWorkingTimes);
router.post('/' , setWorkingTime);

export default router;