const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { verifyJWT, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Protected routes (user authenticated)
router.post("/", verifyJWT, placeOrder);
router.get("/my-orders", verifyJWT, getMyOrders);

// Admin only routes
router.get("/", verifyJWT, adminMiddleware, getAllOrders);
router.put("/:id/status", verifyJWT, adminMiddleware, updateOrderStatus);

module.exports = router;
