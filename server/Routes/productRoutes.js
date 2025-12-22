const express = require("express");
const upload = require("../middleware/upload");
const Product = require("../Models/Product");
const router = express.Router();

// ===============================
// ADD PRODUCT
// ===============================
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      childSubcategory,
      brand,
      rating,
      stock,
      deliveryCharge,
      discount,
      sizeType,
      
    } = req.body;

    // ✅ SAFE JSON PARSING
    let highlights = [];
    let specifications = {};
    let sizeChart = [];

    try {
      highlights = JSON.parse(req.body.highlights || "[]");
      specifications = JSON.parse(req.body.specifications || "{}");
      sizeChart = JSON.parse(req.body.sizeChart || "[]");
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
    }

    // ✅ STRICT SIZE TYPE NORMALIZATION
    const finalSizeType =
      sizeType?.toLowerCase() === "footwear"
        ? "footwear"
        : sizeType?.toLowerCase() === "clothing"
        ? "clothing"
        : "free";

    const product = new Product({
      name,
      description,
      price: Number(price) || 0,
      brand,
      rating: Number(rating) || 0,
      stock: Number(stock) || 0,

      category,
      subcategory,
      childSubcategory,

      deliveryCharge: Number(deliveryCharge) || 0,
      discount: Number(discount) || 0,

      // ✅ SIZE DATA (THIS FIXES YOUR ISSUE)
      sizeType: finalSizeType,
      sizeChart: Array.isArray(sizeChart) ? sizeChart : [],

      highlights,
      specifications,

      images: req.files ? req.files.map((f) => f.filename) : [],
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// FILTER PRODUCTS (KEEP ABOVE /:id)
// ===============================
router.get("/filter", async (req, res) => {
  try {
    const { categoryId, subcategoryId, childId } = req.query;

    const filter = {};
    if (categoryId) filter.category = categoryId;
    if (subcategoryId) filter.subcategory = subcategoryId;
    if (childId) filter.childSubcategory = childId;

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name");

    res.json(products);
  } catch (err) {
    console.error("FILTER ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// GET ONE PRODUCT
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { subcategory: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search error" });
  }
});

module.exports = router;
