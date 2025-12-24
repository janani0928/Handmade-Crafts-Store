require('dotenv').config();
const express = require('express');
const cors = require('cors');
const RunServer= require("./Database/Connection");
const ProductRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/CategoryRoutes');
const path = require("path");
const addressRoutes = require("./Routes/AddressRoutes");
const OrdersRoutes = require("./Routes/OrdersRoutes");
const AuthRoutes = require("./Routes/AuthRoutes");
const userRoutes = require("./Routes/UserRoutes");

// const upload = require("./middleware/upload");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", ProductRoutes);
app.use("/api", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", OrdersRoutes);
app.use('/api/auth', AuthRoutes);
// Mount homepage routes at /api

app.use("/api/users", userRoutes);


RunServer();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
