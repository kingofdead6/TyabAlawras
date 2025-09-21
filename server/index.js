import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import announcementRoutes from './routes/announcements.js';
import galleryRoutes from './routes/gallery.js';
import menuRoutes from './routes/menu.js';
import contactRoutes from './routes/contact.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/error.js';
import newsletterRoutes from './routes/newsletters.js';
import workingTimesRoutes from './routes/workingtimes.js';
import orderRoutes from './routes/orders.js';
import deliveryAreasRoutes from './routes/deliveryAreas.js';
import videoRoutes from './routes/videos.js';
import rateRoutes from './routes/rating.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/working-times', workingTimesRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery-areas', deliveryAreasRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/rating', rateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));