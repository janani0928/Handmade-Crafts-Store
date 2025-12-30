// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const productController = require("../controllers/productsController");

router.post("/", upload.array("images", 10), productController.addProduct);
router.get("/filter", productController.filterProducts);
router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/related", productController.getRelatedProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
