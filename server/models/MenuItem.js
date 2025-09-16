// models/MenuItem.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, 
  type: { type: String, required: true },
  kind: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);