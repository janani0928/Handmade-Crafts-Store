const express = require("express");
const Address = require("../Models/Address");

const router = express.Router();

// Add Address
router.post("/add", async (req, res) => {
  try {
    console.log("Saving address:", req.body);

    const address = await Address.create(req.body);

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    console.log("Error saving:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Address List
router.get("/list", async (req, res) => {
  try {
    const addresses = await Address.find();

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
