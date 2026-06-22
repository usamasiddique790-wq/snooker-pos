const express = require("express");
const verifyToken = require("../middleware/auth.middleware");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToSession,
  getSessionProducts,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/products", verifyToken, getProducts);
router.post("/products", verifyToken, createProduct);
router.put("/products/:id", verifyToken, updateProduct);
router.delete("/products/:id", verifyToken, deleteProduct);

router.post("/sessions/:session_id/products", verifyToken, addProductToSession);
router.get("/sessions/:session_id/products", verifyToken, getSessionProducts);

module.exports = router;
