import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";

const MainContent = ({ selectedCategory, onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCategory || !selectedCategory.childId) {
      setProducts([]);
      setError("");
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.append("categoryId", selectedCategory.categoryId);
        params.append("subcategoryId", selectedCategory.subcategoryId);
        params.append("childId", selectedCategory.childId);

        const res = await fetch(
          `${API_BASE_URL}/products/filter?${params.toString()}`
        );

        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const formatPrice = (price) => `₹${price.toFixed(0)}`;

  return (
    <div style={{ padding: "20px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: "600",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          color: "#212529",
          alignItems: "center",
        }}
      >
        {selectedCategory && (
  <>
    <span style={{ color: "#6c757d", fontWeight: "50" }}>
      {selectedCategory.category?.name}
    </span>
    {selectedCategory.subcategory?.name && (
      <>
        <span style={{ color: "#6c757d" }}>→ </span>
        <span style={{ color: "#6c757d", fontWeight: "200" }}>
          {selectedCategory.subcategory.name}
        </span>
      </>
    )}
    {selectedCategory.child?.name && (
      <>
        <span style={{ color: "#6c757d" }}>→</span>
        <span style={{ color: "#6c757d", fontWeight: "200" }}>
          {selectedCategory.child.name}
        </span>
      </>
    )}
  </>
)}
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && products.length === 0 && selectedCategory?.childId && (
        <p>No products found.</p>
      )}

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((product) => {
          const discountedPrice = product.discount
            ? product.price - (product.price * product.discount) / 100
            : product.price;

          // Define delivery charge text
          const deliveryChargeText =
            product.deliveryCharge && product.deliveryCharge > 0
              ? `₹${product.deliveryCharge} delivery`
              : "Free Delivery";

          return (
            <div
              key={product._id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onClick={() => {
                if (onProductSelect) onProductSelect(product);
                navigate(`/product/${product._id}`);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              }}
            >
              {/* Product Image with +X More overlay */}
              <div style={{ position: "relative" }}>
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `http://localhost:5000/uploads/${product.images[0]}`
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
                />
                {product.images && product.images.length > 1 && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "12px",
                    }}
                  >
                    +{product.images.length - 1} More
                  </span>
                )}
                {product.discount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "#198754",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "12px",
                    }}
                  >
                    {product.discount}% off
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: "10px" }}>
                <h4
                  style={{
                    fontSize: "14px",
                    margin: "0 0 6px 0",
                    color: "#212529",
                    height: "36px",
                    overflow: "hidden",
                    
                  }}
                >
                  {product.name}
                </h4>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  {product.discount > 0 && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#6c757d",
                        fontSize: "13px",
                      }}
                    >
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <span
                    style={{
                      color: "#198754",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {formatPrice(discountedPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span style={{ color: "#198754", fontSize: "13px" }}>
                      {" "}
                      {product.discount}% off
                    </span>
                  )}
                </div>

                {/* Delivery Charge */}
                <div
                  style={{ fontSize: "12px", color: "#6c757d", marginBottom: 4 }}
                >
                  {deliveryChargeText}
                </div>

                {/* Ratings */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px" }}
                >
                  <span
                    style={{
                      background: "#198754",
                      color: "#fff",
                      padding: "2px 4px",
                      borderRadius: 4,
                    }}
                  >
                    {product.rating || " "} ★
                  </span>
                  <span style={{ color: "#6c757d" }}>
                    {product.reviews || " 0"} Reviews
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainContent;
