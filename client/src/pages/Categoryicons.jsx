import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/api";


const Categoryicons = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const categoryLabel = new URLSearchParams(location.search).get("categoryLabel");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const IMAGE_BASE_URL = API_BASE_URL.replace("/api", "");

  useEffect(() => {
    if (!categoryLabel) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        if (!res.data) throw new Error("No data");

        // Filter products by category or subcategory
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
      <h2 style={{ color: "#198754", fontWeight: 800, marginBottom: 25 }}>
        {categoryLabel} Products:
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found in {categoryLabel}</p>
      ) : (
        <div
          className="products-section"
          style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
        >
          {products.map((p) => {
            const deliveryChargeText =
              p.deliveryCharge && p.deliveryCharge > 0
                ? `₹${p.deliveryCharge} delivery`
                : "Free Delivery";

            return (
              <div
                key={p._id}
                className="product-card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {p.discount > 0 && (
                  <span className="discount-badge">{p.discount}% off</span>
                )}

                <img
                  src={`${IMAGE_BASE_URL}/uploads/${p.images?.[0] || p.image}`}
                  alt={p.name}
                  className="product-image"
                  style={{ width: "100%", maxWidth: 400, objectFit: "contain" }}
                />

                <div className="product-info">
                  <h4 className="product-title">{p.name}</h4>

                  <div className="price-row">
                    {p.originalPrice && (
                      <span className="old-price">₹{p.originalPrice}</span>
                    )}
                    <span className="new-price">₹{p.price}</span>
                    {p.discount > 0 && (
                      <span style={{ color: "#ff4081", fontSize: "13px" }}>
                        {p.discount}% off
                      </span>
                    )}
                  </div>

                  <p className="delivery-text">{deliveryChargeText}</p>

                  <div className="rating-row">
                    <span className="rating-badge">{p.rating || " "} ★</span>
                    <span className="review-text">{p.reviewsCount || 0} Reviews</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categoryicons;
