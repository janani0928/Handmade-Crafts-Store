import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import API_BASE_URL from "../utils/api";
const Navbar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);

  
  // 🔐 Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 🔍 Live search for dropdown
useEffect(() => {
  const delay = setTimeout(() => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    axios
      .get(`${API_BASE_URL}/products/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => setSearchResults(res.data || []))
      .catch((err) => console.error("Search error:", err));
  }, 300);

  return () => clearTimeout(delay);
}, [searchText]);


  // 🟢 Handle search submit
  const handleSearchSubmit = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchText("");
    setSearchResults([]);
  };

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
            handmade <span className="marketplace">marketplace <i className="fas fa-star"></i></span>
          </span>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="search-box">
        <i
          className="fas fa-search"
          style={{ cursor: "pointer" }}
          onClick={handleSearchSubmit}
        ></i>

        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
        />

        {/* Dropdown results */}
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
        {!user ? (
          <div className="user-menu">
            <a href="#" className="user-link">
              <i className="far fa-user"></i> Account <i className="fas fa-chevron-down small"></i>
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
          <div className="user-menu">
            <a href="#" className="user-link">
              <i className="far fa-user"></i> {user.firstName} <i className="fas fa-chevron-down small"></i>
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
          {cart?.length > 0 && <span className="cart-count">{cart.length}</span>}
        </Link>

        <a href="#">
          <i className="fas fa-store"></i> Become a Seller
        </a>
      </div>
    </header>
  );
};

export default Navbar;
