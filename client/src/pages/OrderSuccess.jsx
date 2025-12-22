import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 12,
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          maxWidth: 450,
        }}
      >
        <div
          style={{
            fontSize: 60,
            color: "#4CAF50",
            marginBottom: 20,
          }}
        >
          ✔
        </div>

        <h2 style={{ marginBottom: 10 }}>Order Placed Successfully!</h2>

        <p style={{ marginBottom: 20, color: "#555" }}>
          Thank you for shopping with us 🎉
        </p>

        {orderId && (
          <p style={{ marginBottom: 25 }}>
            <strong>Order ID:</strong> {orderId}
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#ff4081",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
            marginBottom: 10,
          }}
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/my-orders")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#f1f3f6",
            color: "#00796b",
            border: "1px solid #00796b",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
