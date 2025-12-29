const API_BASE_URL =
  import.meta.env.PROD
    ? "https://handmade-crafts-store-1.onrender.com/api"
    : "http://localhost:5000/api";

export default API_BASE_URL;
