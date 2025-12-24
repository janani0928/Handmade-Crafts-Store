import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const SavedAddress = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const items = state?.items || [];
  const currentAddress = state?.selectedAddress || null;

  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/address/list`)
      .then((res) => setAddressList(res.data.addresses))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>Select Saved Address</h2>

      {addressList.length === 0 && <p>No saved addresses found.</p>}

      {addressList.map((addr, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            borderRadius: 6,
            marginBottom: 15
          }}
        >
          <p><b>{addr.address}</b></p>
          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
          <p>Phone: {addr.phone}</p>

          <button
            style={{
              marginTop: 10,
              background: "#2874f0",
              color: "white",
              padding: "8px 14px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
            onClick={() =>
              navigate("/order-summary", {
                state: {
                  items,
                  selectedAddress: addr
                }
              })
            }
          >
            Deliver Here
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedAddress;
