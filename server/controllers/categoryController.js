const Category = require("../Models/category");

// ----------------------
// Get All Categories
// ----------------------
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Add Category
// ----------------------
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name, subcategories: [] });
    await category.save();

    res.json({ message: "Category added", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Add Subcategory
// ----------------------
exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryName } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // If exists?
    const exists = category.subcategories.some(
      (sub) => sub.name.toLowerCase() === subcategoryName.toLowerCase()
    );
    if (exists) return res.status(400).json({ message: "Subcategory already exists" });

    category.subcategories.push({ name: subcategoryName, children: [] });
    await category.save();

    res.json({ message: "Subcategory added", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Add Child Subcategory
// ----------------------
exports.addChildSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId, childName } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    subcategory.children.push({ name: childName });
    await category.save();

    res.json({ message: "Child subcategory added", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
