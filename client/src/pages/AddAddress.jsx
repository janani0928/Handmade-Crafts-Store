import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../config/api";

const AddAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we are in edit mode
  const editData = location.state?.address || null;
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: editData?.name || "",
    phone: editData?.phone || "",
    pincode: editData?.pincode || "",
    locality: editData?.locality || "",
    address: editData?.address || "",
    city: editData?.city || "",
    state: editData?.state || "",
    landmark: editData?.landmark || "",
    altPhone: editData?.altPhone || "",
    type: editData?.type || "Home",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    try {
      let res;
      if (isEdit) {
        // Update existing address
        res = await axios.put(
          `${API}/api/address/update/${editData._id}`,
          form
        );
      } else {
        // Add new address
        res = await axios.post(`${API}/api/address/add`, form);
      }

      if (res.data.success) {
        alert(isEdit ? "Address updated!" : "Address saved!");
        navigate(-1); // go back to DeliveryAddress page
      }
    } catch (err) {
      alert("Error saving address");
      console.log(err);
    }
  };

  return (
    
    <div style={{ background: "#a2abba1a", minHeight: "100vh", padding: "20px" }}>
      <style>{`
  /* ---------- MOBILE ---------- */
  @media (max-width: 768px) {

    .adress {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }
.AddressType{
  display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
}
   
  }
`}</style>

    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
      background: "#fff",
        padding: "25px",
        borderRadius: 8,
        border: "1px solid #e0e0e0",
      }}
      className="adress"
    >
      <h2 style={{ marginBottom: 20, textAlign:"center",color:"#00796b" }}>{isEdit ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}</h2>

      {/* Name + Phone */}
      <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="phone"
          placeholder="10-digit mobile number"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Pincode + Locality */}
      <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="locality"
          placeholder="Locality"
          value={form.locality}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Address Textarea */}
      <textarea
        name="address"
        placeholder="Address (Area and Street)"
        value={form.address}
        onChange={handleChange}
        style={{ ...inputStyle, height: 60, width: "100%", resize: "none", marginBottom: 15 }}
      />

      {/* City + State */}
      <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
        <input
          name="city"
          placeholder="City/District/Town"
          value={form.city}
          onChange={handleChange}
          style={inputStyle}
        />
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          style={{ ...inputStyle, height: 40 }}
        >
          <option value="">-- Select State --</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Kerala">Kerala</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>
      </div>

      {/* Landmark + Alternate Phone */}
      <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
        <input
          name="landmark"
          placeholder="Landmark (Optional)"
          value={form.landmark}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="altPhone"
          placeholder="Alternate Phone (Optional)"
          value={form.altPhone}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* Address Type */}
      <div style={{ marginBottom: 20 }} className="AddressType">
        <p style={{ marginBottom: 5 }}>Address Type</p>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            name="type"
            value="Home"
            checked={form.type === "Home"}
            onChange={handleChange}
          />{" "}
          Home (All day delivery)
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="Work"
            checked={form.type === "Work"}
            onChange={handleChange}
          />{" "}
          Work (10 AM – 5 PM delivery)
        </label>
      </div>

      {/* Save & Cancel Buttons */}
      <div style={{ display: "flex", gap: 20 }}>
        <button
          onClick={saveAddress}
          style={{
            background: "#00796b",
            color: "#fff",
            padding: "12px 30px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isEdit ? "UPDATE AND DELIVER HERE" : "SAVE AND DELIVER HERE"}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#ff4081",
            cursor: "pointer",
            fontWeight: "750",
            fontSize: 15,
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  background: "#fafafaa3",
};


export default AddAddress;
