import express from 'express';
import { subscribeNewsletter, getSubscribers, deleteSubscriber, sendNewsletter } from '../controllers/newsletter.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', subscribeNewsletter);
router.get('/', protect, admin, getSubscribers);
router.delete('/:id', protect, admin, deleteSubscriber);
router.post('/send', protect, admin, sendNewsletter);

export default router;