const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", productController.getProducts);
router.get("/:id", authenticateToken, productController.getProduct);
router.post("/", authenticateToken, productController.createProduct);
router.put("/:id", authenticateToken, productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);

module.exports = router;
