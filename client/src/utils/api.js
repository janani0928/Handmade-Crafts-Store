const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://handmade-crafts-store-1.onrender.com";

export default API_BASE_URL;
