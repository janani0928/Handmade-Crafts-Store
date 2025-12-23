import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Success from "./components/Success.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AdminAddProduct from "./components/AdminAddProduct.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Cart from "./components/CartPage.jsx";
import Homepage from "./pages/Homepage.jsx";
import Collection from "./pages/Collections.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import MainContent from "./pages/MainContent.jsx"; 
import DeliveryAddress from "./pages/DeliveryAddress.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderSummary from "./pages/OrderSummary";
import AddAddress from "./pages/AddAddress.jsx";
import SavedAddress from "./pages/SavedAddress.jsx";
import ProductPage from "./pages/ProductPage.jsx"; 
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders.jsx";
import Login from "./components/SigninForm.jsx";
import Register from "./components/SignupForm.jsx";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ProductSearch from "./components/ProductSearch.jsx";
import Categoryicons from "./pages/Categoryicons.jsx";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch products
  const loadProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <CartProvider>
      <div>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />


        <Routes>
          {/* 🛍️ USER SIDE */}
          <Route path="/" element={<Homepage />} />
          <Route
            path="/products/:categoryId/:subcategoryId/:childId"
            element={<ProductPage />}
          />
          <Route path="/collection" element={<Collection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/search" element={<ProductSearch />} />
          <Route path="/categoryicons" element={<Categoryicons />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={!!localStorage.getItem("token")}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <MainContent
                products={products}
                selectedCategory={selectedCategory}
              />
            }
          />
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={setIsAdmin} />}
          />

          <Route
            path="/admin/dashboard"
            element={
              isAdmin ? (
                <AdminDashboard onProductAdded={loadProducts} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route
            path="/admin/addProduct"
            element={
              isAdmin ? <AdminAddProduct /> : <Navigate to="/admin/login" replace />
            }
          />

          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/delivery-address" element={<DeliveryAddress />} /> 
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/saved-address" element={<SavedAddress />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-orders" element={<MyOrders />} />


          {/* Optional fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;
