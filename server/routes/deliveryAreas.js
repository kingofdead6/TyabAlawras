// New Routes: routes/deliveryAreas.js
import express from 'express';
import { getDeliveryAreas, createDeliveryArea, updateDeliveryArea, deleteDeliveryArea } from '../controllers/deliveryAreas.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDeliveryAreas); // Public
router.post('/', protect, admin, createDeliveryArea);
router.put('/:id', protect, admin, updateDeliveryArea);
router.delete('/:id', protect, admin, deleteDeliveryArea);

export default router;