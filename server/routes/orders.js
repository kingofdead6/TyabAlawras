import express from 'express';
import { getOrders, createOrder, updateOrder, getOrderById } from '../controllers/orders.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getOrders);
router.get('/:id', protect, admin, getOrderById); 
router.post('/', createOrder);
router.put('/:id', protect, admin, updateOrder);

export default router;