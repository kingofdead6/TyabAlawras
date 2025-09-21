import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Rating', ratingSchema);