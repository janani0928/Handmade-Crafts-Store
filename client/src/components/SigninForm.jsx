import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrMobile || !password) {
      setMessage("Please enter both Email/Mobile and Password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: emailOrMobile, password }, // ✅ Include password
        { headers: { "Content-Type": "application/json" } }
      );

      // Save token and user info
    localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // redirect
      window.location.reload(); // refresh UI
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
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
        {/* Left panel */}
        <div style={{
          flex: 1,
          backgroundColor: "#2874f0",
          color: "#fff",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, backgroundColor: "#fff", padding: "40px" }}>
          {message && <p style={{ color: "red" }}>{message}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter Email/Mobile number"
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
              placeholder="Enter Password"
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
              Login
            </button>
          </form>
          <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
            New to Craftsvilla? <span style={{ color: "#2874f0", cursor: "pointer" }}>Create an account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
