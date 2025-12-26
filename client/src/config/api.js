// src/config/api.js

// Choose API URL based on environment
const API = import.meta.env.MODE === "production"
  ? "https://handmade-crafts-store-1.onrender.com"
  : "http://localhost:5000";

export default API;
