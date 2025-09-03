import express from 'express';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from '../controllers/gallery.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

router.get('/', getGalleryImages);
router.post('/', protect, admin, upload.array('images', 10), uploadGalleryImage);
router.delete('/:id', protect, admin, deleteGalleryImage);

export default router;