import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../config/api";

const OrderSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState(state?.items || []);
  const address = state?.selectedAddress;

  const platformFee = 7;

  // Calculate total amount after discount
  const calculateTotalAmount = () =>
    items.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const discount = Number(item.discount || 0);
      const discountedPrice = price - (price * discount) / 100;
      return sum + discountedPrice * (item.quantity || 1);
    }, 0);

  // Calculate delivery fee
  const calculateDeliveryFee = () =>
    items.reduce((sum, item) => sum + (Number(item.deliveryCharge) || 0) * (item.quantity || 1), 0);

  const totalAmount = calculateTotalAmount();
  const deliveryFee = calculateDeliveryFee();
  const totalPayable = totalAmount + platformFee + deliveryFee;

  // Calculate total original price and savings
  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const totalSavings = totalOriginalPrice - totalAmount;

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const handleRemove = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh", padding: "20px 0" }}>
     
     <style>{`
  /* ---------- MOBILE ---------- */
  @media (max-width: 768px) {

    .boxContainer {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .DELIVERYADDRESS{
      width: 100% !important;
      align-items: stretch !important; /* 🔥 not center */
    }
       .PRICEDETAILS {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 16px 0 !important;
      position: static !important;
      align-self: stretch !important;
    }
 
    
  }
`}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 20,
          maxWidth: 1200,
          gap: 20,
          margin: "20px auto",
        }}
        className="boxContainer"
        
      >
        {/* LEFT SIDE */}
        <div style={{ width: "65%" }} className="DELIVERYADDRESS">
          {/* DELIVERY ADDRESS */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              marginBottom: 20,
              background: "#fff",
            }}
          >
            <div
              style={{
                background: "#00796b",
                color: "#fff",
                padding: 12,
                fontWeight: 600,
              }}
            >
              2. DELIVERY ADDRESS
            </div>
            <div style={{ padding: 12, position: "relative" }}>
              <button
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  background: "transparent",
                  border: "none",
                  color: "#ff4081",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() =>
                  navigate("/delivery-address", { state: { items, selectedAddress: address } })
                }
              >
                CHANGE
              </button>
              <div>{address?.address}</div>
              <div>
                {address?.city}, {address?.state} - {address?.pincode}
              </div>
              <div>{address?.phone}</div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              marginBottom: 20,
              background: "#fff",
            }}
           className="productRow img"
          >
            <div
              style={{
                background: "#00796b",
                color: "#fff",
                padding: 12,
                fontWeight: 600,
              }}
              
            >
              3. ORDER SUMMARY
            </div>
            <div style={{ padding: 12 }} >
              {items.map((item, index) => {
                const discountedPrice =
                  Number(item.price) - (Number(item.price) * Number(item.discount || 0)) / 100;
                const deliveryText =
                  item.deliveryCharge > 0
                    ? `₹${formatPrice(item.deliveryCharge)} Delivery`
                    : "Free Delivery";

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: 15,
                      borderBottom: "1px solid #eee",
                      padding: "10px 0",
                    }}
                
                  >
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `${API}/uploads/${item.images[0]}`
                          : "/placeholder.png"
                      }
                      alt={item.name}
                       
                      style={{ width: 80, height: 80, objectFit: "contain" }}
                   onClick={() =>
                  navigate("/", { state: { items, selectedAddress: address } })
                }
                   />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div>
                        <span style={{ fontWeight: 600 }}>₹{formatPrice(discountedPrice)}</span>
                        {item.discount > 0 && (
                          <span style={{ fontSize: 13, color: "#878787", marginLeft: 8 }}>
                            <s>₹{formatPrice(item.price)}</s><span style={{color:"#ff4081"}}>({item.discount}% off)</span> 
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: "#388e3c" }}>{deliveryText}</div>
                      <div>Qty: {item.quantity}</div>
                      <div>Size: {item.selectedSize || "Free"}</div>
                      <button
                        style={{
                          marginTop: 5,
                          color: "#ff4081",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleRemove(index)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() =>
                  navigate("/payment", { state: { items, totalAmount: totalPayable, address } })
                }
                style={{
                  marginTop: 20,
                  width: "60%",
                  background: "#ff4080e1",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "100px",
                }}
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PRICE DETAILS */}
        <div style={{ width: "30%" }} className="PRICEDETAILS">
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 12,
              background: "#fff",
            }}
          >
            <h3 style={{ marginBottom: 10, color: "#00796b" }}>PRICE DETAILS</h3>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
            >
              <span>
                Price ({items.length} item{items.length > 1 ? "s" : ""})
              </span>
              <span>₹{formatPrice(totalAmount)}</span>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
            >
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${formatPrice(deliveryFee)}`}</span>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
            >
              <span>Platform Fee</span>
              <span>₹{formatPrice(platformFee)}</span>
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              <span>Total Payable</span>
              <span>₹{formatPrice(totalPayable)}</span>
            </div>
            {totalSavings > 0 && (
              <p style={{ color: "green", marginTop: 10 }}>
                You saved ₹{formatPrice(totalSavings)} on this order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
