import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Categoryicons = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const categoryLabel = new URLSearchParams(location.search).get("categoryLabel");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryLabel) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        // Filter products by category name or subcategory name
        const filtered = res.data.filter((p) => {
          const catName = p.category?.name || p.category || "";
          const subCatName = p.subcategory || p.type || "";

          return (
            catName.toLowerCase().includes(categoryLabel.toLowerCase()) ||
            subCatName.toLowerCase().includes(categoryLabel.toLowerCase())
          );
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryLabel]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{categoryLabel} Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found in {categoryLabel}</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{ border: "1px solid #ccc", padding: 10, width: 200, cursor: "pointer" }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={`http://localhost:5000/uploads/${product.images?.[0] || product.image}`}
                alt={product.name}
                style={{ width: "100%", objectFit: "contain", height: 180 }}
              />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categoryicons;
