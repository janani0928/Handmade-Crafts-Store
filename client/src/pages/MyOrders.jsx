import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../config/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchOrders();
  }, []);

  const steps = ["Placed", "Confirmed", "Shipped", "Delivered"];

  const getStepColor = (currentStatus, stepIndex) => {
    const currentIndex = steps.indexOf(currentStatus);
    return stepIndex <= currentIndex ? "#0a7cff" : "#eee";
  };



const cancelOrder = (orderId) => {
  toast.warn(
    ({ closeToast }) => (
      <div>
        <p style={{ fontWeight: "bold" }}>⚠️ Cancel this order?</p>
        <p style={{ fontSize: "14px", marginTop: "5px" }}>
          This action cannot be undone.
        </p>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => {
              confirmCancel(orderId);
              closeToast();
            }}
            style={{
              backgroundColor: "#e53935",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes, Cancel
          </button>

          <button
            onClick={closeToast}
            style={{
              backgroundColor: "#9e9e9e",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};


const confirmCancel = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API}/api/orders/cancel/${orderId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ success toast
    toast.success("Order cancelled successfully");

    // ✅ hide cancel button
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? { ...order, status: "Cancelled" }
          : order
      )
    );

  } catch (err) {
    toast.error(err.response?.data?.message || "Cancel failed");
  }
};





  if (loading) return <p style={styles.loading}>Loading orders...</p>;
  if (orders.length === 0) return <h3 style={styles.empty}>No orders found</h3>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>

      {orders.map((order) => {
        const deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 5);

        return (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <span><b>Order ID:</b> {order.orderId}</span>
              <span style={styles.status}>{order.status}</span>
            </div>


            {/* Dynamic Progress Bar */}
            <div style={styles.progressBar}>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.progressStep,
                    backgroundColor: getStepColor(order.status, idx),
                  }}
                />
              ))}
            </div>
            <div style={styles.progressLabels}>
              {steps.map((step, idx) => (
                <span key={idx}>{step}</span>
              ))}
            </div>

            {/* Order Items */}
            {order.items.map((item, idx) => {
              const price = Number(item.price || 0);
              const quantity = item.quantity || 1;

              const finalPrice = price; // no item-level discount in schema

              return (
                <div key={idx} style={styles.orderItem}>
                  <img
                    src={`${API}/uploads/${item.images?.[0]}`}
                    alt={item.name}
                    style={styles.image}
                  />
                  <div style={{ padding: 10, flex: 1 }}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemPrice}>
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </p>
                    <p style={styles.quantity}>Quantity: {quantity}</p>
                  </div>
                </div>
              );
            })}




            <div style={styles.orderFooter}>
              <div>
                <strong>Total: ₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                            <p><b>Payment:</b> {order.paymentStatus}</p>

                <p>Ordered On: <b>{new Date(order.createdAt).toLocaleDateString()}</b></p>
                <p>Expected Delivery: <b>{deliveryDate.toLocaleDateString()}</b></p>
              </div>

              {!["Shipped", "Delivered", "Cancelled"].includes(order.status) && (
                <button style={styles.cancelBtn} onClick={() => cancelOrder(order._id)}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};



export default MyOrders;



const styles = {
  container: {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color:"#00796b",
    fontWeight:600,
    fontSize:"42px"
  },

  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "40px",
  },

  empty: {
    textAlign: "center",
    marginTop: "40px",
    color: "#777",
  },

  orderCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
  },

  status: {
    color: "#ff4081",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  progressBar: {
    display: "flex",
    height: "6px",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "6px",
  },

  progressStep: {
    flex: 1,
    marginRight: 2,
    transition: "background-color 0.3s ease",
  },

  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#666",
    marginBottom: "12px",
  },

  /* ================= ITEM ================= */

  orderItem: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    marginBottom: "12px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },

  image: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #eee",
  },

  itemName: {
    margin: "0 0 6px 0",
    fontSize: "15px",
    fontWeight: "600",
  },

  itemPrice: {
    margin: "0 0 4px 0",
    color: "#212121",
    fontWeight: "bold",
    fontSize: "15px",
  },

  originalPrice: {
    fontSize: "13px",
    color: "#878787",
    marginLeft: "6px",
    textDecoration: "line-through",
  },

  discount: {
    fontSize: "13px",
    color: "#388e3c",
    marginLeft: "6px",
    fontWeight: "500",
  },

  delivery: {
    fontSize: "13px",
    color: "#388e3c",
    marginTop: "2px",
  },

  quantity: {
    fontSize: "13px",
    color: "#555",
    marginTop: "4px",
  },

  /* ================= FOOTER ================= */

  orderFooter: {
    borderTop: "1px solid #eee",
    paddingTop: "10px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  cancelBtn: {
    backgroundColor: "#ff4081",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    height: "fit-content",
  },
};