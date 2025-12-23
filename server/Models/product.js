const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    brand: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    childSubcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    images: [String],
    highlights: [
      {
        heading: String,
        SubHeading: String,
        subItems: [{ label: String, value: String }],
      },
    ],
    specifications: {
      model: String,
      color: String,
      warranty: String,
      weight: String,
    },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    sizeType: { type: String, enum: ["footwear", "clothing", "free"], default: "free" },
    sizeChart: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

// ✅ Add text index for search
productSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
