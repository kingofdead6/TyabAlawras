// New Backend Controllers: controllers/deliveryAreas.js
import DeliveryArea from '../models/DeliveryArea.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import validator from 'validator';

// Get all delivery areas (public for checkout)
export const getDeliveryAreas = asyncHandler(async (req, res) => {
  const areas = await DeliveryArea.find({});
  res.status(200).json(areas);
});

// Create delivery area (admin)
export const createDeliveryArea = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name || !validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Valid name required' });
  }
  if (!price || isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'Valid positive price required' });
  }
  const area = new DeliveryArea({ name, price: Number(price) });
  await area.save();
  res.status(201).json(area);
});

// Update delivery area (admin)
export const updateDeliveryArea = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) return res.status(404).json({ message: 'Area not found' });
  if (name) area.name = name;
  if (price) area.price = Number(price);
  await area.save();
  res.status(200).json(area);
});

// Delete delivery area (admin)
export const deleteDeliveryArea = asyncHandler(async (req, res) => {
  const area = await DeliveryArea.findById(req.params.id);
  if (!area) return res.status(404).json({ message: 'Area not found' });
  await DeliveryArea.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Deleted' });
});