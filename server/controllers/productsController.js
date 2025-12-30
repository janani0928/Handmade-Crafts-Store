const Product = require("../Models/product");
const escapeRegex = require("../Utils/escapeRegex");

// ===============================
// ADD PRODUCT
// ===============================
exports.addProduct = async (req, res) => {
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
};

// ===============================
// GET ALL PRODUCTS
// ===============================
 exports.getProducts = async (req, res) => {
  console.log("GET /api/products called"); // Debug
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("childSubcategory", "name");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Products API error" });
  }
};


// ===============================
// FILTER PRODUCTS
// ===============================
exports.filterProducts = async (req, res) => {
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
};

// ===============================
// SEARCH PRODUCTS
// ===============================
exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json([]);

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
      .populate("childSubcategory", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET RELATED PRODUCTS
// ===============================
exports.getRelatedProducts = async (req, res) => {
  try {
    const categories = (req.query.categories || "").split(",").filter(Boolean);
    const excludeIds = (req.query.exclude || "").split(",").filter(Boolean);

    if (categories.length === 0) return res.json([]);

    const related = await Product.find({
      category: { $in: categories },
      _id: { $nin: excludeIds },
    }).limit(20);

    res.json(related);
  } catch (err) {
    console.error("Related products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET SINGLE PRODUCT BY ID
// ===============================
exports.getProductById = async (req, res) => {
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
};
