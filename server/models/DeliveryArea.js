// New Backend Model: models/DeliveryArea.js
import mongoose from 'mongoose';

const deliveryAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model('DeliveryArea', deliveryAreaSchema);