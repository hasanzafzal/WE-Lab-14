const Order = require("../models/Order");
const Product = require("../models/Product");

// Place order
const placeOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Order must contain products" });
    }

    if (!shippingAddress) {
      return res
        .status(400)
        .json({ message: "Shipping address is required" });
    }

    let totalPrice = 0;
    const orderProducts = [];

    // Validate products and calculate total price
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      products: orderProducts,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
    });

    await order.save();

    // Reduce product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("products.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
