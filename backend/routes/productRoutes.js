const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyJWT, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (admin only)
router.post("/", verifyJWT, adminMiddleware, createProduct);
router.put("/:id", verifyJWT, adminMiddleware, updateProduct);
router.delete("/:id", verifyJWT, adminMiddleware, deleteProduct);

module.exports = router;
