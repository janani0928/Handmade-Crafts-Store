import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ================= HELPERS ================= */
const isValidUPI = (upi) =>
  /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi);

const isValidCardNumber = (num) => {
  let sum = 0,
    dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
};

const getCardType = (num) => {
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "MasterCard";
  if (/^(60|65|81|82)/.test(num)) return "RuPay";
  if (/^3[47]/.test(num)) return "American Express";
  return "";
};

const formatCardNumber = (num) =>
  num.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const CARD_LOGOS = {
  Visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  MasterCard:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  RuPay: "https://upload.wikimedia.org/wikipedia/commons/e/e1/RuPay_Logo.svg",
  "American Express":
    "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
};

/* ================= COMPONENT ================= */
const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const items = state?.items || [];
  const address = state?.address;
  const token = localStorage.getItem("token");

  const platformFee = 7;
  const [method, setMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardError, setCardError] = useState("");
  const [cardType, setCardType] = useState("");
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!token) {
    navigate("/login");
    return null;
  }
  if (!items.length || !address)
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>Invalid session</h2>
    );

  /* ================= PRICE CALCULATIONS ================= */
  const itemsTotal = items.reduce(
    (s, i) => s + ((i.price - (i.price * (i.discount || 0)) / 100) * i.quantity),
    0
  );
  const deliveryFee = items.reduce(
    (s, i) => s + ((i.deliveryCharge || 0) * i.quantity),
    0
  );
  const totalPayable = itemsTotal + deliveryFee + platformFee;
  const totalSavings = items.reduce(
    (s, i) => s + ((i.price * (i.discount || 0)) / 100) * i.quantity,
    0
  );
  const formatPrice = (n) =>
    Number(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  /* ================= SUBMIT PAYMENT ================= */
  const submitPayment = async () => {
    setLoading(true);
    const paymentStatus = method === "COD" ? "Pending" : "Paid";
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          address,
          totalAmount: totalPayable,
          paymentMethod: method,
          paymentStatus,
        }),
      });
      const data = await res.json();
      if (res.ok) navigate("/order-success", { state: data });
      else alert(data.message || "Failed");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BUTTON STYLE ================= */
  const buttonStyle = (disabled = false) => ({
    marginTop: 12,
    width: "100%",
    padding: 14,
    background: "#ff4081",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontWeight: 600,
    fontSize: 16,
  });

  /* ================= UI ================= */
  const isMobile = windowWidth <= 768;

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh", padding: 20 }}>
      <div
        style={{
          maxWidth: 1100,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          fontFamily: "Arial, sans-serif",
          margin: "50px auto",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT SIDE - PAYMENT FORM */}
        <div
          style={{
            flex: isMobile ? "1 1 100%" : "0 0 65%",
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{ textAlign: "center", color: "#00796b", marginBottom: 20 }}
          >
            Complete Payment
          </h2>

          {/* UPI */}
          <div
            onClick={() => setMethod("UPI")}
            style={{
              padding: 16,
              marginBottom: 8,
              borderRadius: 8,
              background: method === "UPI" ? "#e0f2f1" : "#fff",
              cursor: "pointer",
              border: method === "UPI" ? "1px solid #00796b" : "1px solid #ddd",
            }}
          >
            <strong>UPI</strong>
            {method === "UPI" && (
              <div style={{ fontSize: 12, color: "#00796b" }}>
                Pay using any UPI app
              </div>
            )}
          </div>
          {method === "UPI" && (
            <>
              <input
                placeholder="example@bank"
                value={upiId}
                onChange={(e) => {
                  const v = e.target.value;
                  setUpiId(v);
                  if (!v) setUpiError("UPI required");
                  else if (!isValidUPI(v)) setUpiError("Invalid UPI");
                  else setUpiError("");
                }}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginBottom: 8,
                }}
              />
              {upiError && <p style={{ color: "red", margin: 4 }}>{upiError}</p>}
              <button
                onClick={submitPayment}
                style={buttonStyle(!upiId || upiError)}
                disabled={!upiId || upiError}
              >
                Pay ₹{formatPrice(totalPayable)}
              </button>
            </>
          )}

          {/* CARD */}
          <div
            onClick={() => setMethod("CARD")}
            style={{
              padding: 16,
              marginTop: 16,
              borderRadius: 8,
              background: method === "CARD" ? "#e0f2f1" : "#fff",
              cursor: "pointer",
              border: method === "CARD" ? "1px solid #00796b" : "1px solid #ddd",
            }}
          >
            <strong>Credit / Debit Card</strong>
          </div>
          {method === "CARD" && (
            <>
              <div style={{ position: "relative", marginTop: 8 }}>
                <input
                  placeholder="Card Number"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(raw);
                    setCardType(getCardType(raw));
                    if (raw.length < 12) setCardError("Invalid card");
                    else if (!isValidCardNumber(raw)) setCardError("Invalid card");
                    else setCardError("");
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 60px 14px 12px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
                {cardType && CARD_LOGOS[cardType] && (
                  <img
                    src={CARD_LOGOS[cardType]}
                    alt={cardType}
                    style={{ position: "absolute", right: 10, top: 10, height: 28 }}
                  />
                )}
              </div>
              {cardError && <p style={{ color: "red", margin: 4 }}>{cardError}</p>}
              <button
                onClick={submitPayment}
                style={buttonStyle(!cardNumber || cardError)}
                disabled={!cardNumber || cardError}
              >
                Pay ₹{formatPrice(totalPayable)}
              </button>
            </>
          )}

          {/* COD */}
          <div
            onClick={() => setMethod("COD")}
            style={{
              padding: 16,
              marginTop: 16,
              borderRadius: 8,
              background: method === "COD" ? "#e0f2f1" : "#fff",
              cursor: "pointer",
              border: method === "COD" ? "1px solid #00796b" : "1px solid #ddd",
            }}
          >
            <strong>Cash on Delivery</strong>
          </div>
          {method === "COD" && (
            <button onClick={submitPayment} style={buttonStyle(false)}>
              Confirm Order ₹{formatPrice(totalPayable)}
            </button>
          )}
          {loading && <p style={{ marginTop: 8 }}>Processing...</p>}
        </div>

        {/* RIGHT SIDE - PRICE DETAILS */}
        <div
          style={{
            flex: isMobile ? "1 1 100%" : "0 0 30%",
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "auto" : 20,
            marginBottom: isMobile ? 20 : 0,
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: 10, color: "#00796b" }}>PRICE DETAILS</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>
                Price ({items.length} item{items.length > 1 ? "s" : ""})
              </span>
              <span>₹{formatPrice(itemsTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${formatPrice(deliveryFee)}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Platform Fee</span>
              <span>₹{formatPrice(platformFee)}</span>
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontWeight: "bold" }}>
              <span>Total Payable</span>
              <span>₹{formatPrice(totalPayable)}</span>
            </div>
            {totalSavings > 0 && (
              <p style={{ color: "green", marginTop: 8 }}>
                You saved <span style={{ color: "#ff4081" }}>₹{formatPrice(totalSavings)}</span> on this order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
