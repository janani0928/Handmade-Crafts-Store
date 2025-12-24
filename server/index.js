require('dotenv').config();
const express = require('express');
const cors = require('cors');
const RunServer= require("./Database/Connection");
const productRoutes = require('./routes/poroductRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require("path");
const addressRoutes = require("./routes/addressRoutes");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", ordersRoutes);
app.use('/api/auth', authRoutes);
// Mount homepage routes at /api

app.use("/api/users", userRoutes);


RunServer();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
