import Video from '../models/Video.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Get all videos
export const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({}).lean();
  res.status(200).json(videos);
});

// Upload multiple videos
export const uploadVideo = asyncHandler(async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'At least one video is required' });
  }
  if (files.length > 5) {
    return res.status(400).json({ message: 'Cannot upload more than 5 videos at once' });
  }

  const uploadedVideos = [];
  try {
    for (const file of files) {
      const videoUrl = await uploadToCloudinary(file, 'video');
      const video = new Video({ video: videoUrl });
      await video.save();
      uploadedVideos.push(video);
    }
    res.status(201).json({ message: 'Videos uploaded successfully', videos: uploadedVideos });
  } catch (error) {
    console.error('Upload videos error:', error);
    res.status(500).json({ message: 'Failed to upload videos to Cloudinary' });
  }
});

// Delete a video
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  if (video.video) {
    const publicId = video.video.split('/').pop().split('.')[0];
    await deleteFromCloudinary(`Tyabelawras-website/${publicId}`, 'video').catch((err) => {
      console.error('Cloudinary deletion error:', err);
    });
  }

  await Video.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'Video deleted successfully' });
});