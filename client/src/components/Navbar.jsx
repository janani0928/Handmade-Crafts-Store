import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [user, setUser] = useState(null);

  // 🔐 Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔍 Search
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/search?q=${searchText}`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearchResults();
  }, [searchText]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="Craftsy-header">
      {/* Logo */}
      <div className="logo">
        <div className="Name">
          <h1>🌿Craftsvilla</h1>
          <span className="handmade">
            handmade{" "}
            <span className="marketplace">
              marketplace <i className="fas fa-star"></i>
            </span>
          </span>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((item) => (
              <div
                key={item._id}
                className="search-item"
                onClick={() => {
                  navigate(`/product/${item._id}`);
                  setSearchText("");
                  setSearchResults([]);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Menu */}
      <div className="right-menu">
        {/* 👤 ACCOUNT */}
        {!user ? (
          // ❌ Not logged in
          <div className="user-menu">
            <a href="#" className="user-link">
              <i className="far fa-user"></i> Account{" "}
              <i className="fas fa-chevron-down small"></i>
            </a>
            <ul className="dropdown">
              <li>
                <Link to="/login">Sign In</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </ul>
          </div>
        ) : (
          // ✅ Logged in
          <div className="user-menu">
            <a href="#" className="user-link">
              <i className="far fa-user"></i> {user?.firstName}{" "}
              <i className="fas fa-chevron-down small"></i>
            </a>
            <ul className="dropdown">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/my-orders">My Orders</Link>
              </li>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </li>
            </ul>
          </div>
        )}

        {/* 🛒 Cart */}
        <Link to="/cart" className="cart-link">
          <i className="fas fa-shopping-cart"></i> Cart
          {cart?.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </Link>

        <a href="#">
          <i className="fas fa-store"></i> Become a Seller
        </a>
      </div>
    </header>
  );
};

export default Navbar;
