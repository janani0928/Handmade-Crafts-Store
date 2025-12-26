import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../config/api";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products when query changes
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API}/api/products/search?q=${encodeURIComponent(
            query
          )}`
        );
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to avoid too many requests
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {loading && <p>Loading...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((product) => (
          <li
            key={product._id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{product.name}</strong> - ₹{product.price}
            <br />
            <small>{product.brand}</small>
          </li>
        ))}
      </ul>

      {!loading && query.length >= 2 && results.length === 0 && (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductSearch;
