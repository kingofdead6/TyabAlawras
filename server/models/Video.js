import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  video: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);