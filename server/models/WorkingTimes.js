import mongoose from 'mongoose';

const workingTimesSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
    enum: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  },
  open: {
    type: String,
    default: null,
  },
  close: {
    type: String,
    default: null,
  },
  isClosed: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('workingTimes', workingTimesSchema);