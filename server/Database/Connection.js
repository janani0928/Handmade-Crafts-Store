const mongoose = require("mongoose");

function RunServer() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

module.exports = RunServer; // ✅ export the function, NOT the call
