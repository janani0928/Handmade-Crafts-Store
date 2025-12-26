import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateQuantity, removeItem } from "../redux/cartSlice";
import "../pages/Homepage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items || []);

  const platformFee = 7;

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = items.reduce(
    (sum, item) =>
      sum + (Number(item.deliveryCharge) || 0) * (item.quantity || 1),
    0
  );

  const totalPayable = totalAmount + platformFee + deliveryFee;

  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const totalSavings = totalOriginalPrice - totalAmount;

  const formatPrice = (price) => Number(price).toLocaleString("en-IN");

  return (
    <div style={styles.page}>
      {/* Responsive Styles */}
 <style>{`
  @media (max-width: 769px) {

    .mainContainer {
      display: flex !important;
      flex-direction: column !important;
      text-align: center !important;
      align-items: stretch !important; /* 🔥 important */
    }

    .leftCard,
    .placeOrderWrap {
      width: 100% !important;
      align-items: stretch !important; /* 🔥 not center */
    }

    /* ✅ PRICE CARD (single source of truth) */
    .priceCard {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 16px 0 !important;
      position: static !important;
      align-self: stretch !important;
    }

    .productRow {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
    }

    .productRow img {
      width: 100% !important;
      max-width: 150px !important;
      margin-bottom: 10px;
    }

    .actionsRow {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }
  }
    @media (max-width: 769px) {
  .priceCard {
    width: 100% !important;
    max-width: 100% !important;
    position: static !important;
    align-self: stretch !important;
    margin: 16px 0 !important;
  }
}

`}</style>

      <div className="mainContainer" style={styles.main}>
        {/* LEFT CARD */}
        <div style={styles.leftCard}>
          <h2 style={styles.title}>
            Handmade Crafts Store ({items.length})
          </h2>

          {items.length === 0 ? (
            <p style={{ padding: 16 }}>Your cart is empty</p>
          ) : (
            items.map((item) => {
              const discountedPrice = item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price;

              const deliveryText =
                item.deliveryCharge > 0
                  ? `₹${item.deliveryCharge} Delivery`
                  : "Free Delivery";

              return (
                <div key={item._id} style={styles.productRow} className="productRow">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? `http://localhost:5000/uploads/${item.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    style={{ width: "100px" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />

                  <div style={styles.productDetails}>
                    <div style={styles.productName}>{item.name}</div>

                    <div style={styles.price}>
                      ₹{discountedPrice.toLocaleString("en-IN")}
                      {item.discount > 0 && (
                        <span
                          style={{
                            fontSize: 13,
                            color: "#878787",
                            marginLeft: 8,
                          }}
                        >
                          <s>₹{item.price}</s> ({item.discount}% off)
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 13, color: "#388e3c" }}>
                      {deliveryText}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Size: {item.size || item.selectedSize || "Free"}
                    </div>

                    <div style={styles.actionsRow} className="actionsRow">
                      <div style={styles.qtyBox}>
                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item._id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            )
                          }
                        >
                          −
                        </button>

                        <span style={{ padding: "0 12px" }}>{item.quantity}</span>

                        <button
                          style={styles.qtyBtn}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item._id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <span
                        style={styles.link}
                        onClick={() => dispatch(removeItem(item._id))}
                      >
                        REMOVE
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* PLACE ORDER */}
          <div style={styles.placeOrderWrap}>
            <button
              style={styles.placeOrder}className="placeOrderWrap"
              onClick={() =>
                navigate("/delivery-address", {
                  state: { items, totalAmount },
                })
              }
            >
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* RIGHT PRICE DETAILS */}
        <div style={styles.priceCard} className="priceCard">
          <h3 style={{ marginBottom: "10px", color: "#00796b" }}>PRICE DETAILS</h3>

          <div style={styles.priceRow}>
            <span>Price ({items.length} items)</span>
            <span>₹{formatPrice(totalAmount)}</span>
          </div>

          <div style={styles.priceRow}>
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
          </div>

          <div style={styles.priceRow}>
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <hr />

          <div style={styles.totalRow}>
            <span>Total Payable</span>
            <span>₹{formatPrice(totalPayable)}</span>
          </div>

          {totalSavings > 0 && (
            <p style={styles.savings}>
              You saved ₹{formatPrice(totalSavings)} on this order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

const styles = {
  page: {
    background: "#f1f3f6",
    minHeight: "100vh",
    padding: "24px 16px",
    fontFamily: "Inter, Arial, sans-serif",
  },

  main: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    marginTop: "50px",

    
  },

  leftCard: {
    flex: 2,
    background: "#fff",
    borderRadius: 6,
    border: "1px solid #e0e0e0",
    overflow: "hidden",
  },

  title: {
    padding: "16px",
    fontSize: 18,
    fontWeight: 600,
    borderBottom: "1px solid #e0e0e0",
    color: "#198754",
  },

  productRow: {
    display: "flex",
    padding: 16,
    borderBottom: "1px solid #f0f0f0",
    gap: 16,
  },

  productImg: {
    width: 90,
    height: 110,
    objectFit: "contain",
    border: "1px solid #eee",
    borderRadius: 4,
    background: "#fafafa",
  },

  productDetails: {
    flex: 1,
    
    
  },

  productName: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 6,
    color: "#212121",
  },

  price: {
    fontSize: 18,
    fontWeight: 700,
    color: "#212121",
    marginBottom: 10,
  },

  actionsRow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    marginTop: 6,
  },

  qtyBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #c2c2c2",
    borderRadius: 4,
    overflow: "hidden",
  },

  qtyBtn: {
    padding: "6px 12px",
    border: "none",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },

  link: {
    fontSize: 13,
    fontWeight: 600,
    color: "#ff4081",
    cursor: "pointer",
  },

  placeOrderWrap: {
    padding: 16,
    display: "flex",
    justifyContent: "flex-end",
    background: "#fff",
    borderTop: "1px solid #e0e0e0",
    position: "sticky",
    bottom: 0,
  },

  placeOrder: {
    background: "#ff4080f9",
    color: "#fff",
    border: "none",
    padding: "14px 48px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 4,
    cursor: "pointer",
  },

  priceCard: {
    width: "30%",
    background: "#fff",
    borderRadius: 6,
    border: "1px solid #e0e0e0",
    padding: 16,
    position: "sticky",
    top: 90,
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 14,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 700,
    fontSize: 16,
    marginTop: 12,
  },

  savings: {
    color: "#388e3c",
    marginTop: 10,
    fontWeight: 500,
    fontSize: 14,
  },
};
