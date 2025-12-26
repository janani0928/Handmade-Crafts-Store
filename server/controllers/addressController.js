const Address = require("../Models/Address");

// Add Address
exports.addAddress = async (req, res) => {
  try {
    console.log("Saving address:", req.body);
    const address = await Address.create(req.body);
    res.json({ success: true, address });
  } catch (error) {
    console.log("Error saving:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address by ID
exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAddress)
      return res.status(404).json({ success: false, message: "Address not found" });

    res.json({ success: true, data: updatedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
