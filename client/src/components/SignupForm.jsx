import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";
const Register = () => {
  const [name, setName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
  firstName: name,
  email: emailOrMobile,
  password,
});


      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f1f3f6",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        display: "flex",
        width: "700px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
        {/* Left Panel */}
        <div style={{
          flex: 1,
          backgroundColor: "#2874f0",
          color: "#fff",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your mobile number to get started</p>
          <img
            src="/path-to-your-image.png" // optional branding image
            alt="signup"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          />
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, backgroundColor: "#fff", padding: "40px" }}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />

            <input
              type="text"
              placeholder="Email or Mobile number"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#fb641b",
                color: "#fff",
                padding: "12px",
                fontSize: "16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              CONTINUE
            </button>
          </form>

          <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
            Existing User? <span style={{ color: "#2874f0", cursor: "pointer" }} onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
