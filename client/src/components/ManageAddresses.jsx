import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Flipkart.css";

const ManageAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/addresses/my-addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="fk-content">
      <h2 className="fk-title">Manage Addresses</h2>

      <div className="fk-add-box">+ ADD A NEW ADDRESS</div>

      {/* ✅ SHOW SAVED DATA */}
      {addresses.length === 0 ? (
        <p>No saved addresses</p>
      ) : (
        addresses.map((addr) => (
          <div className="fk-address-card" key={addr._id}>
            <div className={`fk-tag ${addr.type === "WORK" ? "work" : ""}`}>
              {addr.type}
            </div>

            <div className="fk-address-header">
              <span className="name">{addr.name}</span>
              <span className="phone">{addr.phone}</span>
              <span className="menu">⋮</span>
            </div>

            <p className="fk-address-text">
              {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageAddresses;
