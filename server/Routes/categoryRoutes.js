const express = require("express");
const router = express.Router();
const Category = require("../Models/Category"); // Mongoose model

// GET all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST category
router.post("/category", async (req, res) => {
  try {
    const { name } = req.body;
    const cat = new Category({ name, subcategories: [] });
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST subcategory
router.post("/subcategory/:catId", async (req, res) => {
  try {
    const { name } = req.body;
    const cat = await Category.findById(req.params.catId);
    cat.subcategories.push({ name, children: [] });
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST child subcategory
router.post("/child-subcategory/:catId/:subId", async (req, res) => {
  try {
    const { name } = req.body;
    const cat = await Category.findById(req.params.catId);
    const sub = cat.subcategories.id(req.params.subId);
    sub.children.push({ name });
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
