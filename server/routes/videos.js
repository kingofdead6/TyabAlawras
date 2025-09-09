import express from 'express';
import { getVideos, uploadVideo, deleteVideo } from '../controllers/videos.js';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true);
    }
    const allowedTypes = ['video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 videos are allowed'), false);
    }
  },
});

const router = express.Router();

router.get('/', getVideos);
router.post('/', protect, admin, upload.array('videos', 5), uploadVideo);
router.delete('/:id', protect, admin, deleteVideo);

export default router;