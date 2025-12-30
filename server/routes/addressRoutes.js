const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress
} = require("../controllers/addressController");

// Routes
router.post("/add", addAddress);
router.get("/list", getAddresses);
router.put("/update/:id", updateAddress);

module.exports = router;
