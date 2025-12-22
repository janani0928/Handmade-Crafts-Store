const mongoose = require("mongoose");

const ChildSubSchema = new mongoose.Schema({
  name: String,
});

const SubcategorySchema = new mongoose.Schema({
  name: String,
  children: [ChildSubSchema]
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [SubcategorySchema],
});

module.exports = mongoose.model("Category", CategorySchema);
