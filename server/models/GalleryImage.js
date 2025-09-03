// models/GalleryImage.js
import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.model('GalleryImage', galleryImageSchema);