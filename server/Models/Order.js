const mongoose = require("mongoose");

const orderSchemar = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        images: { type: [String], default: [] },
      },
    ],

    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },

    paymentMethod: { type: String, enum: ["UPI", "CARD", "COD"], default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },

    status: { type: String, default: "Placed" },
  },
  { timestamps: true }
);

// ✅ Make sure the model name is "Payment" with capital P
module.exports = mongoose.model("order", orderSchemar);
