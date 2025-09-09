// models/MenuItem.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  type: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);