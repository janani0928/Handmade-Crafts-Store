const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://handmade-crafts-store-1.onrender.com";

export const API_ENDPOINTS = {
  products: `${BASE_URL}/api/products`,
  categories: `${BASE_URL}/api/categories`,
};

export default BASE_URL;
