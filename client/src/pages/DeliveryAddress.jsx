import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../config/api";

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = location.state?.items || [];

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const totalSavings = totalOriginalPrice - totalAmount;
  const platformFee = 7;
  const deliveryFee = items.reduce(
    (sum, item) => sum + (Number(item.deliveryCharge) || 0) * (item.quantity || 1),
    0
  );
  const totalPayable = totalAmount + platformFee + deliveryFee;

  const [addressList, setAddressList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/address/list`)
      .then((res) => setAddressList(res.data.addresses))
      .catch((err) => console.log(err));
  }, []);

  const visibleAddresses = showAll ? addressList : addressList.slice(0, 2);

  const goNext = () => {
    if (selected === null) return alert("Select an address!");
    navigate("/order-summary", {
      state: {
        items,
        totalAmount: totalPayable,
        selectedAddress: addressList[selected],
      },
    });
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 });


  return (
    <div style={styles.checkoutPage}>
      
<style>{`
  /* ---------- MOBILE ---------- */
  @media (max-width: 768px) {

    .checkoutContainer {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .addressSection {
      width: 100% !important;
    }

    /* ✅ PRICE DETAILS FIX */
    .priceSection {
      width: 100% !important;
      max-width: 100% !important;
      position: static !important;
      margin: 0 !important;
      align-self: stretch !important;
    }

    .priceItem,
    .priceTotal {
      display: flex !important;
      justify-content: space-between !important;
      width: 100% !important;
      font-size: 14px;
    }

    .priceTotal {
      font-size: 16px;
      margin-top: 10px;
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
  }
`}</style>

      <div style={styles.checkoutContainer} className="checkoutContainer">
        {/* LEFT – Address Section */}
        <div style={styles.addressSection} className="addressSection">
          <div style={styles.sectionHeader}>2 Delivery Address</div>

          {visibleAddresses.map((a, index) => {
            const isSelected = selected === index;
            return (
              <div
                key={index}
                style={styles.addressCard(isSelected)}
                onClick={() => setSelected(index)}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => setSelected(index)}
                />
                <div style={styles.addressInfo}>
                  <div style={styles.addressHeader}>
                    <span>{a.name}</span>
                    {a.type && <span style={styles.type}>{a.type}</span>}
                    <span>{a.phone}</span>
                  </div>
                  <div style={styles.addressText}>
                    {a.address}, {a.city}, {a.state} – <strong>{a.pincode}</strong>
                  </div>
                  {isSelected && (
                    <button style={styles.deliverBtn} onClick={goNext}>
                      DELIVER HERE
                    </button>
                  )}
                </div>
              {isSelected && (
  <span
    onClick={() => 
      navigate("/add-address", { state: { address: addressList[selected], isEdit: true } })
    }
    style={{
      color: "#ff4081",
      cursor: "pointer",
      alignSelf: "flex-start",
      marginLeft: "8px",
      fontWeight: 600,
      fontFamily: "Arial, sans-serif",
    }}
  >
    EDIT
  </span>
)}

              </div>
            );
          })}

          {!showAll && addressList.length > 2 && (
            <div style={styles.viewAll} onClick={() => setShowAll(true)}>
              ▼ View all {addressList.length} addresses
            </div>
          )}

          <div
            style={styles.addNewAddress}
            onClick={() => navigate("/add-address")}
          >
            <span style={styles.plus}>+</span>
            <span style={styles.addNewText}>Add a new address</span>
          </div>
        </div>

        {/* RIGHT – Price Section */}
        <div style={styles.priceSection} className="priceSection">
          <h3 style={{marginBottom:"20px", color:"#00796b", fontWeight:700}}> PRICE DETAILS</h3>
          <div style={styles.priceItem}>
            <span>Price</span>
            <span>₹{formatPrice(totalAmount)}</span>
          </div>
          <div style={styles.priceItem}>
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "Free" : `₹${formatPrice(deliveryFee)}`}</span>
          </div>
          <div style={styles.priceItem}>
            <span>Platform Fee</span>
            <span>₹{formatPrice(platformFee)}</span>
          </div>
          <hr />
          <div style={styles.priceTotal}>
            <span>Total Payable</span>
            <span>₹{formatPrice(totalPayable)}</span>
          </div>
          {totalSavings > 0 && (
            <p style={styles.savings}>
              You saved <span style={{color:"#ff4081"}}>₹{formatPrice(totalSavings) }</span>  on this order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
 // ==== CSS as JS Object ====
  const styles = {
    checkoutPage: {
      background: "#f1f3f6",
      minHeight: "100vh",
      padding: "30px 0",
      fontFamily: "Arial, sans-serif",
    },
    checkoutContainer: {
      width: "90%",
      maxWidth: "1200px",
      margin: "auto",
      display: "flex",
      gap: "20px",
    },
    addressSection: {
      width: "65%",
    },
    sectionHeader: {
      background: "#00796b",
      color: "#fff",
      padding: "14px 20px",
      fontSize: "18px",
      fontWeight: 600,
      borderRadius: "4px 4px 0 0",
    },
    addressCard: (isSelected) => ({
      display: "flex",
      gap: "12px",
      padding: "20px",
      border: isSelected ? "2px solid #00796b" : "1px solid #ddd",
      borderTop: "none",
      borderRadius: "0 0 4px 4px",
      background: isSelected ? "#e0f2f1" : "#fff",
      cursor: "pointer",
      alignItems: "flex-start",
      transition: "0.2s",
    }),
    addressInfo: {
      flex: 1,
    },
    addressHeader: {
      display: "flex",
      gap: "10px",
      fontWeight: 600,
      flexWrap: "wrap",
    },
    type: {
      background: "#eee",
      padding: "2px 6px",
      fontSize: "11px",
      borderRadius: "2px",
    },
    addressText: {
      marginTop: "6px",
      fontSize: "14px",
      color: "#333",
    },
    deliverBtn: {
      marginTop: "12px",
      background: "#ff4080fb",
      color: "#fff",
      border: "none",
      padding: "10px 24px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "2px",
    },
    viewAll: {
      padding: "16px 20px",
      color: "#00796b",
      fontWeight: 600,
      cursor: "pointer",
      background: "#fff",
      border: "1px solid #ddd",
      borderTop: "none",
      borderRadius: "0 0 4px 4px",
    },
    addNewAddress: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      borderTop: "1px solid #e0e0e0",
      background: "#fff",
      cursor: "pointer",
      marginTop: "12px",
      borderRadius: "4px",
    },
    plus: {
      fontSize: "22px",
      color: "#00796b",
      fontWeight: 700,
      lineHeight: 1,
    },
    addNewText: {
      color: "#00796b",
      fontSize: "15px",
      fontWeight: 600,
    },
    priceSection: {
      width: "30%",
      background: "#fff",
      padding: "20px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      position: "sticky",
      top: "20px",
      height: "fit-content",
    },
    priceItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    priceTotal: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: 700,
      fontSize: "16px",
      
    },
    savings: {
      marginTop: "12px",
      color: "green",
      fontWeight: 600,
    },
  };