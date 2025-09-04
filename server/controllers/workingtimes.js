import asyncHandler from 'express-async-handler';
import WorkingTimes from '../models/WorkingTimes.js';

// Get all Working times
export const getWorkingTimes = asyncHandler(async (req, res) => {
  const times = await WorkingTimes.find().sort({ _id: 1 });
  res.json(times);
});

// Create or update Working times for a specific day (admin or superadmin)
export const setWorkingTime = asyncHandler(async (req, res) => {
  const { day, open, close, isClosed } = req.body;

  if (!day || !['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].includes(day)) {
    res.status(400);
    throw new Error('يوم غير صالح');
  }

  if (!isClosed && (!open || !close)) {
    res.status(400);
    throw new Error('يجب تحديد أوقات الفتح والإغلاق للأيام المفتوحة');
  }

  const existingTime = await WorkingTimes.findOne({ day });

  if (existingTime) {
    // Update existing record
    const updatedTime = await WorkingTimes.findOneAndUpdate(
      { day },
      { open: isClosed ? null : open, close: isClosed ? null : close, isClosed },
      { new: true, runValidators: true }
    );
    res.json({ message: 'تم تحديث أوقات اليوم بنجاح', time: updatedTime });
  } else {
    // Create new record
    const newTime = await WorkingTimes.create({
      day,
      open: isClosed ? null : open,
      close: isClosed ? null : close,
      isClosed,
    });
    res.status(201).json({ message: 'تم إنشاء أوقات اليوم بنجاح', time: newTime });
  }
});

