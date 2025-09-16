import MenuItem from '../models/MenuItem.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import validator from 'validator';



// Get all menu items
export const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({}).lean();
  res.status(200).json(menuItems);
});

// Create a new menu item
export const createMenuItem = asyncHandler(async (req, res) => {
  
  const { name, price, type, kind } = req.body;
  const image = req.file;

  // Validate inputs
  if (!name || !price || !type) {
    return res.status(400).json({ message: 'Name, price, and type are required' });
  }
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters' });
  }
  if (!validator.isFloat(String(price), { min: 0 })) {
    return res.status(400).json({ message: 'Price must be a valid number greater than or equal to 0' });
  }
  if (!validator.isLength(type, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'Type must be between 1 and 50 characters' });
  }
  if (!validator.isLength(kind, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'Kind must be between 1 and 50 characters' });
  }


  let imageUrl = null;
  if (image) {
    try {
      imageUrl = await uploadToCloudinary(image);
    } catch (error) {
      return res.status(400).json({ message: 'Failed to upload image to Cloudinary' });
    }
  }

  const menuItem = new MenuItem({
    name,
    price: Number(price),
    type,
    kind,
    image: imageUrl,
  });
  await menuItem.save();

  res.status(201).json({ message: 'Menu item created successfully', menuItem });
});

// Update a menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
  
  const { name, price, type , kind } = req.body;
  const image = req.file;
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({ message: 'Menu item not found' });
  }

  // Validate inputs
  if (name && !validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters' });
  }
  if (price && !validator.isFloat(String(price), { min: 0 })) {
    return res.status(400).json({ message: 'Price must be a valid number greater than or equal to 0' });
  }
  if (type && !validator.isLength(type, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'Type must be between 1 and 50 characters' });
  }
  if (kind && !validator.isLength(kind, { min: 1, max: 50 })) {
    return res.status(400).json({ message: 'Kind must be between 1 and 50 characters' });
  }

  if (image) {
    try {
      // Delete old image from Cloudinary if it exists
      if (menuItem.image) {
        const publicId = menuItem.image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`Tyabelawras-website/${publicId}`).catch((err) => {
          console.error('Cloudinary deletion error:', err);
        });
      }
      // Upload new image
      menuItem.image = await uploadToCloudinary(image);
    } catch (error) {
      return res.status(400).json({ message: 'Failed to upload image to Cloudinary' });
    }
  }

  menuItem.name = name || menuItem.name;
  menuItem.price = price ? Number(price) : menuItem.price;
  menuItem.type = type || menuItem.type;
  menuItem.kind = kind || menuItem.kind;
  await menuItem.save();

  res.status(200).json({ message: 'Menu item updated successfully', menuItem });
});

// Delete a menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
  
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({ message: 'Menu item not found' });
  }

  // Delete image from Cloudinary if it exists
  if (menuItem.image) {
    const publicId = menuItem.image.split('/').pop().split('.')[0];
    await deleteFromCloudinary(`Tyabelawras-website/${publicId}`).catch((err) => {
      console.error('Cloudinary deletion error:', err);
    });
  }

  await MenuItem.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'Menu item deleted successfully' });
});