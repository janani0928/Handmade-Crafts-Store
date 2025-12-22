import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../App.css"
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.images?.[0] || data.image || "");
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) {
    return <p style={styles.loading}>Loading product...</p>;
  }

  const price = Number(product.price || 0);
  const discount = Number(product.discount ?? 0);
  const discountAmount = Math.round((price * discount) / 100);
  const finalPrice = price - discountAmount;
  const sizeType = product?.sizeType?.trim().toLowerCase() || "free";
  const sizeChart = Array.isArray(product?.sizeChart) ? product.sizeChart : [];
  const requiresSize = product.sizeType === "clothing" || product.sizeType === "footwear";

  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      toast.warning("⚠️ Please select a size before adding to cart");
      return;
    }
    dispatch(addToCart({ ...product, quantity: selectedQuantity, selectedSize }));
    toast.success("✅ Added to cart successfully!");
    navigate("/cart");
  };

  const handleOrderNow = () => {
    if (requiresSize && !selectedSize) {
      toast.warning("⚠️ Please select a size before ordering");
      return;
    }
    const items = [{ ...product, quantity: selectedQuantity, selectedSize }];
    navigate("/delivery-address", { state: { items } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.main} className="pd-main">
        {/* Left side */}
        <div style={styles.leftSide} className="pd-left">
          <div style={styles.thumbnails} className="pd-thumbnails">
            {(product.images?.length ? product.images : [product.image]).filter(Boolean).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000/uploads/${img}`}
                alt=""
                onClick={() => setMainImage(img)}
                style={{
                  ...styles.thumbnail,
                  border: img === mainImage ? "2px solid #2874f0" : "1px solid #ccc"
                }}
              />
            ))}
          </div>
          <div style={styles.mainImageWrapper}>
            <img
              src={`http://localhost:5000/uploads/${mainImage}`}
              alt={product.name}
              style={styles.mainImage }
                        className="pd-main-image"

            />
            <div style={styles.quantityWrapper}>
              <label>Quantity: </label>
              <select
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                style={styles.select}
              >
                {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div style={styles.buttonsWrapper} className="pd-mobile-actions">
              <button onClick={handleAddToCart} style={styles.addToCartBtn}className="pd-cart-btn">🛒 Add to Cart</button>
              <button onClick={handleOrderNow} style={styles.buyNowBtn}  className="pd-buy-btn">⚡ Buy Now</button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={styles.rightSide} className="pd-right">
          {/* Product Info */}
          <div style={styles.infoBox}>
            <h1>{product.name}</h1>
            <h2 style={styles.price}>₹{finalPrice} <span style={styles.originalPrice}>{price}</span></h2>
            {discount > 0 && <p style={styles.discount}>You save ₹{discountAmount} ({discount}% OFF)</p>}
            <p>⭐ {product.rating || 0} • {product.reviews || 0} Reviews</p>
          </div>

          {/* Description */}
          <div style={styles.descriptionBox}>
            <h3>Description</h3>
            <p>{product.description || "No description available."}</p>
          </div>

          {/* Size Selection */}
          <div style={styles.sizeBox}>
            <h3>Size</h3>
            {(sizeType === "footwear" || sizeType === "clothing") && sizeChart.length > 0 && (
              <div style={styles.sizeButtons}>
                {sizeChart.map((row, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(row.size)}
                    style={{
                      ...styles.sizeBtn,
                      background: selectedSize === row.size ? (sizeType === "footwear" ? "#ff5722" : "#2874f0") : "#eee",
                      color: selectedSize === row.size ? "#fff" : "#333"
                    }}
                  >
                    {row.size}
                  </button>
                ))}
              </div>
            )}
            {sizeType === "free" && <p>✔ Free Size</p>}
          </div>

          {/* Product Highlights */}
          <div style={styles.highlightsBox}>
            <h3>Product Highlights</h3>
            {product.highlights.map((h, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                {h.heading && <h4 style={styles.highlightHeading}>{h.heading}</h4>}
                {h.SubHeading && <p style={styles.highlightSub}>{h.SubHeading}</p>}
                {Array.isArray(h.subItems) && h.subItems.length > 0 && (
                  <div>
                    {h.subItems.map((item, idx) => (
                      <div key={idx} style={styles.subItem}>
                        <div style={styles.subItemLabel}>{item.label}</div>
                        <div style={styles.subItemValue}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ratings & Reviews */}
          <div style={styles.ratingsBox}>
            <h3>Product Ratings & Reviews</h3>
            <div style={styles.ratingSummary}>
              <span style={styles.ratingNumber}>{product.rating || 0}</span>
              <span style={styles.ratingText}>Ratings • {product.reviews || 0} Reviews</span>
            </div>
            <div style={styles.ratingBreakdown}>
              {product.ratingBreakdown && Object.keys(product.ratingBreakdown).length > 0
                ? Object.entries(product.ratingBreakdown).map(([key, value]) => (
                  <div key={key} style={styles.ratingRow}>
                    <span>{key}</span>
                    <span>{value}</span>
                  </div>
                ))
                : <p>No detailed rating data available.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* All Products */}
        {/* All Products */}
 <div style={styles.allProductsWrapper}>
  {allProducts
    .filter(p => p._id !== product._id)
    .map(p => (
      <div
        key={p._id}
        style={styles.productCard}
        className="product-card"
        onClick={() => navigate(`/product/${p._id}`)}
      >
        <img
          src={`http://localhost:5000/uploads/${p.images?.[0] || p.image}`}
          alt={p.name}
          style={styles.productCardImage}
        />

        <div className="product-info">
          <h4 className="product-title">{p.name}</h4>

          <div className="price-row">
            {p.originalPrice && (
              <span className="old-price">₹{p.originalPrice}</span>
            )}
            <span className="new-price">₹{p.price}</span>
            {p.discount && (
              <span className="discount-text">{p.discount}% off</span>
            )}
          </div>

          <p className="delivery-text">Free Delivery</p>

          <div className="rating-row">
            <span className="rating-badge">{p.rating || 5} ★</span>
            <span className="review-text">
              {p.reviewsCount || 0} Reviews
            </span>
          </div>
        </div>
      </div>
    ))}

      </div>
    </div>
  );
};

// CSS-in-JS styles
  const styles = {
  container: {
    padding: 10,
    fontFamily: "Arial",
  },
  main: {
    display: "flex",
    gap: 40,
    flexWrap: "wrap",
        padding: "20px 12px",

  },
  leftSide: {
    display: "flex",
    gap: 15,
    flexWrap: "wrap",
  },
  thumbnails: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    objectFit: "cover",
    cursor: "pointer",
    borderRadius: 6,
  },
  mainImageWrapper: {
    flex: 1,
  },
  mainImage: {
    width: 400,
    height: 400,
    objectFit: "cover",
    borderRadius: 8,
  },
  quantityWrapper: {
    marginTop: 10,
  },
  select: {
    padding: 6,
    marginLeft: 5,
  },
  buttonsWrapper: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  addToCartBtn: {
    padding: 12,
    width: 200,
    background: "#ff4080fb",
    fontWeight: 700,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 4,
  },
  buyNowBtn: {
    padding: 12,
    width: 200,
    background: "#00796bd7",
    fontWeight: 700,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 4,
  },
  rightSide: {
    flex: 1,
    minWidth: 300,
  },
  infoBox: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  price: { color: "#ff4080fb", margin: "5px 0" },
  originalPrice: { marginLeft: 10, fontSize: 16, color: "#999", textDecoration: "line-through" },
  discount: { color: "green", fontWeight: 600, margin: "5px 0" },
  descriptionBox: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginTop: 20,
  },
  sizeBox: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginTop: 20,
  },
  sizeButtons: { display: "flex", gap: 10, flexWrap: "wrap" },
  sizeBtn: { padding: "6px 12px", border: "none", borderRadius: 4, cursor: "pointer" },
  highlightsBox: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 15,
    background: "#fff",
    marginTop: 20,
  },
  highlightHeading: { margin: "5px 0", fontSize: 15, fontWeight: 600, color: "#444" },
  highlightSub: { margin: "0 0 10px 0", fontSize: 14, color: "#555", lineHeight: 1.4 },
  subItem: { display: "flex", padding: "4px 0" },
  subItemLabel: { width: "40%", fontWeight: 500, fontSize: "15px", color: "#333" },
  subItemValue: { width: "60%", color: "#555" },
  ratingsBox: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginTop: 20,
  },
  ratingSummary: { display: "flex", alignItems: "center", gap: 10, marginTop: 10 },
  ratingNumber: { fontSize: 32, fontWeight: "bold" },
  ratingText: { color: "#555" },
  ratingBreakdown: { marginTop: 15 },
  ratingRow: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  allProductsWrapper: {
  marginTop: 40,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12,
  marginRight:62,
     
},

productCard: {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: 8,
  cursor: "pointer",
      

},

  productCardImage: { width: "100%", height: 150, objectFit: "cover", borderRadius: 6 },
  productCardPrice: { color: "#ff4080fb", fontWeight: 600 },
  loading: { padding: 20, fontSize: 18, color: "#555" },
};

// Media queries for responsiveness



export default ProductDetails;
