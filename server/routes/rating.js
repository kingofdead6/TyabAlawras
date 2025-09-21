import express from 'express';
import { submitRating, getRatings, deleteRating } from '../controllers/rating.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitRating);
router.get('/', protect, admin, getRatings);
router.delete('/:id', protect, admin, deleteRating);

export default router;