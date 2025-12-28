import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../utils/api";

const OrderNowPage = () => {
  const { state } = useLocation();
  const product = state?.product;
  const mainImage = state?.mainImage;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


  if (!product) {
    return <h2 style={{ textAlign: "center" }}>No product selected.</h2>;
  }

  const handleBuyNow = () => {
    navigate("/delivery-address", {
      state: {
        product,
        mainImage,
        quantity,
        totalPrice: product.price * quantity,
      },
    });
  };

  const handleAddToCart = () => {
    alert("Item added to cart!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageSection}>
        <img
          src={`http://localhost:5000uploads/${mainImage || product.image}`}
          alt={product.name}
          style={styles.mainImage}
        />
      </div>

      <div style={styles.detailsSection}>
        <h2 style={styles.title}>{product.name}</h2>
        <p style={styles.price}>₹{product.price}</p>
        <p style={styles.description}>{product.description}</p>

        <div style={styles.quantityBox}>
          <label style={styles.label}>Quantity:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={styles.select}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.addCartBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button style={styles.buyNowBtn} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNowPage;
