const redisClient = require('../config/redis');
const Order = require('../models/Order');
const Product = require('../models/product');

// Initialize Flash Sale Stock in Redis
exports.initializeFlashSale = async (req, res) => {
  try {
    const { productId, totalStock } = req.body;
    
    await redisClient.set(`product:${productId}:stock`, totalStock);
    
    return res.status(200).json({
      success: true,
      message: `Flash sale initialized in Redis with ${totalStock} units.`
    });
  } catch (error) {
    console.error("INIT ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Handle Flash Sale Checkout (Compatible with standalone local MongoDB)
exports.purchaseFlashSaleItem = async (req, res) => {
  try {
    const customerId = req.body.customerId || "64a2b1f8e4b0c8a1b2c3d4e1";
    const productId = req.body.productId || "64a2b1f8e4b0c8a1b2c3d4e6";
    const vendorId = req.body.vendorId || "64a2b1f8e4b0c8a1b2c3d4e2";
    const quantity = req.body.quantity || 1;
    const price = req.body.price || 99.99;
    const idempotencyKey = req.body.idempotencyKey || Date.now().toString();

    // 1. Check Idempotency Key to prevent duplicate purchases
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      return res.status(400).json({ success: false, message: "Duplicate transaction (Idempotency check failed)" });
    }

    // 2. Atomic Decrement in Redis (Memory-level race condition defense)
    const stockKey = `product:${productId}:stock`;
    const remainingStock = await redisClient.decrBy(stockKey, quantity);

    if (remainingStock < 0) {
      await redisClient.incrBy(stockKey, quantity);
      return res.status(400).json({ success: false, message: "Out of stock! Flash sale sold out." });
    }

    // 3. Create Order in MongoDB
    const newOrder = new Order({
      customerId,
      productId,
      vendorId,
      quantity,
      totalAmount: price * quantity,
      status: 'SUCCESS',
      idempotencyKey
    });

    await newOrder.save();

    // 4. Update Product Stock in MongoDB
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } }
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
      remainingStock
    });

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};