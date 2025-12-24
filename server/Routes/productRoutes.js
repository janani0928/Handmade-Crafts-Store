const express = require("express");
const upload = require("../middleware/upload");
const Product = require("../Models/Product");
const router = express.Router();
const escapeRegex = require("../Utils/escapeRegex"); // ✅ only this line

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

// Get all products
// backend/routes/products.js
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) {
      filter.category = req.query.categoryId; // match category _id
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// GET ONE PRODUCT
// ===============================
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    console.log("Search query:", q);

    // Ignore empty or too short queries
    if (!q || q.length < 2) return res.json([]);

    // Safe regex
    const regex = new RegExp(escapeRegex(q), "i");

    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { brand: { $regex: regex } },
      ],
    })
      .limit(50)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name")
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Search error full:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// 🔍 SEARCH PRODUCTS
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    console.log("Search query:", q);

    if (!q || q.length < 2) return res.json([]); // ignore empty or too short queries

    const regex = new RegExp(escapeRegex(q), "i");

    const products = await Product.find({
      $or: [
        { name: { $exists: true, $regex: regex } },
        { description: { $exists: true, $regex: regex } },
        { brand: { $exists: true, $regex: regex } },
      ],
    })
      .limit(50)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name")
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Search error full:", err);
    res.status(500).json({ message: "Server error" });
  }
});







// routes/productRoutes.js
router.get("/related", async (req, res) => {
  try {
    const categories = (req.query.categories || "").split(",").filter(Boolean);
    const excludeIds = (req.query.exclude || "").split(",").filter(Boolean);

    if (categories.length === 0) return res.json([]);

    const related = await Product.find({
      category: { $in: categories },
      _id: { $nin: excludeIds },
    }).limit(20); // limit for performance

    res.json(related);
  } catch (err) {
    console.error("Related products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
