require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const RunServer = require("./Database/Connection");

const productRoutes = require("./Routes/productRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const addressRoutes = require("./Routes/addressRoutes");
const ordersRoutes = require("./Routes/ordersRoutes");
const authRoutes = require("./Routes/RuthRoutes");
const userRoutes = require("./Routes/userRoutes");
const collectionRoutes = require("./Routes/collectionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://handmade-crafts-store-1.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// static images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collection", collectionRoutes);

RunServer();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
