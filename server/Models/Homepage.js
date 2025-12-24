const mongoose = require('mongoose');

const craftSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // ✅ fixed typo here
  },
});

const Craft = mongoose.model('Craft', craftSchema);
module.exports = Craft;
