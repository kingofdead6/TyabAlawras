import express from 'express';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcements.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true); 
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG/PNG images are allowed'), false);
    }
  },
});

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', protect, admin, upload.single('image'), createAnnouncement);
router.put('/:id', protect, admin, upload.single('image'), updateAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;