import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import validator from 'validator';
import MenuItem from '../models/MenuItem.js';
import DeliveryArea from '../models/DeliveryArea.js';
import { broadcastNewOrder } from "../index.js";

// Get all orders (admin only)
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate({
      path: 'items.menuItem',
      select: 'name price',
      model: 'MenuItem',
    })
    .lean();
  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: 'No orders found' });
  }
  res.status(200).json(orders);
});

// Get single order by ID (admin only)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'items.menuItem',
      select: 'name price',
      model: 'MenuItem',
    })
    .lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(200).json(order);
});

// Create a new order (public)
export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    deliveryArea,
    deliveryFee,
    customerName,
    customerPhone,
    deliveryAddress,
    notes,
    subtotal,
  } = req.body;

  console.log("Creating order with data:", req.body);

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }
  if (
    !customerName ||
    !validator.isLength(customerName, { min: 1, max: 100 })
  ) {
    return res.status(400).json({ message: "Valid customer name is required" });
  }
  if (!customerPhone || !validator.isMobilePhone(customerPhone, "ar-DZ")) {
    return res.status(400).json({ message: "Valid phone number is required" });
  }
  if (
    !deliveryAddress ||
    !validator.isLength(deliveryAddress, { min: 1, max: 200 })
  ) {
    return res.status(400).json({ message: "Valid delivery address is required" });
  }
  if (!deliveryArea || deliveryFee === undefined) {
    return res.status(400).json({ message: "Delivery area and fee are required" });
  }

  const area = await DeliveryArea.findOne({ name: deliveryArea });
  if (!area) {
    console.error("Delivery area not found:", deliveryArea);
    return res.status(400).json({ message: "Invalid delivery area" });
  }
  const areaPrice = parseFloat(area.price.toFixed(2));
  const sentFee = parseFloat(deliveryFee.toFixed(2));
  if (areaPrice !== sentFee) {
    console.error("Fee mismatch:", { areaPrice, sentFee });
    return res.status(400).json({ message: "Delivery fee does not match area" });
  }

  const populatedItems = [];
  let calculatedSubtotal = 0;
  for (const itemData of items) {
    const menuItem = await MenuItem.findById(itemData.menuItem);
    if (!menuItem) {
      console.error("Invalid menu item ID:", itemData.menuItem);
      return res
        .status(400)
        .json({ message: `Invalid menu item: ${itemData.menuItem}` });
    }
    const itemPrice = Number(menuItem.price);
    if (isNaN(itemPrice) || itemPrice <= 0) {
      return res.status(400).json({ message: "Invalid menu item price" });
    }
    populatedItems.push({
      menuItem: menuItem._id,
      quantity: itemData.quantity,
    });
    calculatedSubtotal += itemPrice * itemData.quantity;
  }

  const finalSubtotal = subtotal ? Number(subtotal) : calculatedSubtotal;
  if (Math.abs(finalSubtotal - calculatedSubtotal) > 0.01) {
    console.warn("Subtotal mismatch, using calculated:", calculatedSubtotal);
  }

  const totalAmount = finalSubtotal + sentFee;

  const order = new Order({
    items: populatedItems,
    subtotal: finalSubtotal,
    deliveryFee: sentFee,
    totalAmount,
    deliveryArea,
    customerName,
    customerPhone,
    deliveryAddress,
    notes,
    paymentMethod: "cash_on_delivery",
  });

  await order.save();
  console.log("✅ Order created successfully:", order._id);

  const populatedOrder = await Order.findById(order._id).populate(
    "items.menuItem",
    "name price"
  );

  // 🔔 Notify admins in real time
  broadcastNewOrder(populatedOrder);

  res
    .status(201)
    .json({ message: "Order created successfully", order: populatedOrder });
});

// Update order status (admin only)
export const updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (!['pending', 'in_delivery', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  order.status = status;
  await order.save();

  const populatedOrder = await Order.findById(order._id).populate('items.menuItem', 'name price');
  res.status(200).json({ message: 'Order updated successfully', order: populatedOrder });
});