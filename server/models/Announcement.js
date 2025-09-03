// models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);