import Rating from '../models/Rating.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import validator from 'validator';

// Submit a rating
export const submitRating = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  // Validate inputs
  if (!name || !rating || !comment) {
    return res.status(400).json({ message: 'Name, rating, and comment are required' });
  }
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters' });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }
  if (!validator.isLength(comment, { min: 1, max: 1000 })) {
    return res.status(400).json({ message: 'Comment must be between 1 and 1000 characters' });
  }

  const newRating = await Rating.create({ name, rating, comment });
  res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
});

// Get all ratings (admin only)
export const getRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({}).lean();
  res.status(200).json(ratings);
});

// Delete a rating (admin only)
export const deleteRating = asyncHandler(async (req, res) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return res.status(404).json({ message: 'Rating not found' });
  }

  await Rating.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Rating deleted successfully' });
});