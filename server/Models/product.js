const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    childSubcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    brand: String,
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

    // ✅ SIZE SUPPORT
    sizeType: {
      type: String,
      enum: ["footwear", "clothing", "free"],
      default: "free",
    },

    sizeChart: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
