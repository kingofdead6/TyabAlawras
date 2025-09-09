import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  deliveryArea: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  notes: { type: String },
  paymentMethod: { type: String, default: 'cash_on_delivery' },
  status: {
    type: String,
    enum: ['pending', 'in_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

// No pre-save hook anymore - calculations done in controller

export default mongoose.model('Order', orderSchema);