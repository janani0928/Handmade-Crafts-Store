const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },

    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    landmark: { type: String },
    alternatePhone: { type: String },

    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
