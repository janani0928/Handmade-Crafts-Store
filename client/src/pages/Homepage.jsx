import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";


const Homepage = () => {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const navigate = useNavigate();

  // Fetch all products

  /* ===================== FETCH PRODUCTS ===================== */
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        setAllProducts(products);
        setFilteredProducts(products);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setAllProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  /* ===================== FETCH CATEGORIES ===================== */
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Categories API error");
        return res.json();
      })
      .then((data) => {
        const safeData = Array.isArray(data)
          ? data.map((cat) => ({
              ...cat,
              subcategories: Array.isArray(cat.subcategories)
                ? cat.subcategories.map((sub) => ({
                    ...sub,
                    children: Array.isArray(sub.children)
                      ? sub.children
                      : [],
                  }))
                : [],
            }))
          : [];

        setCategories(safeData);
      })
      .catch((err) => {
        console.error("Category load error:", err);
        setCategories([]);
      });
  }, []);

  // Handle category click
const handleCategoryClick = (cat) => {
  // Navigate to Category page with categoryId and label
  navigate(`/categoryicons?categoryLabel=${encodeURIComponent(cat.label)}&categoryId=${cat._id}`)
};




  return (
    <div className="homepage">
      {/* NAVBAR WITH CATEGORY MENU */}
      <div className="navbar-category-menu">
        <div className="category-menu-wrapper">
          {categories.map((cat) => (
            <div className="category-item" key={cat._id}>
              <span className="category-title">{cat.name}</span>
              {cat.subcategories.length > 0 && (
                <div className="mega-menu">
                  {cat.subcategories.map((sub) => (
                    <div className="mega-column" key={sub._id}>
                      <h4>{sub.name}</h4>
                      {sub.children.map((child) => (
                        <p
                          key={child._id}
                          onClick={() =>
                            navigate(
                              `/products/${cat._id}/${sub._id}/${child._id}`
                            )
                          }
                        >
                          {child.name}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Beautifully Crafted</h1>
          <h2>Made with Love ❤️</h2>
          <p>
            Up to <b>40% OFF</b> on handmade collections
          </p>
          <button onClick={() => navigate("/collection")}>Shop Now</button>
        </div>
        <div className="hero-image">
          <img
            src="/home decor.png"
            alt="Handmade crafts"
          />
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="info-strip">
        <span>🚚 Fast Delivery</span>
        <span>💰 Cash on Delivery</span>
        <span>🔁 7 Days Easy Return</span>
      </div>

      {/* CATEGORY ICON SECTION */}

<section className="category-icons">
  {[
    { img: "/toys.png", label: "Toys" },
    { img: "/Womenwear.png", label: "Women Clothing" },
    { img: "/Menswear.png", label: "Menswear" },
    { img: "/footwear.jpeg", label: "Footwear" },
    { img: "/home decor.png", label: "Home Decor" },
    { img: "/Beauty.jpeg", label: "Beauty" },
    { img: "/Accessories.png", label: "Accessories" },
    { img: "https://i.imgur.com/9oM0LqR.png", label: "Grocery" },
  ].map((cat) => (
    <div
      key={cat.label}
      className="category-card"
      style={{ cursor: "pointer" }}
      onClick={() =>
        navigate(
          `/categoryicons?categoryLabel=${encodeURIComponent(cat.label)}`
        )
      }
    >
      <img src={cat.img || "/placeholder.png"} alt={cat.label} />
      <p>{cat.label}</p>
    </div>
  ))}
</section>




      <hr />
      <br />

      {/* PRODUCTS SECTION */}
      <div
        className="products-section"
        style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
      >
        {filteredProducts.map((p) => {
          const deliveryChargeText =
            p.deliveryCharge && p.deliveryCharge > 0
              ? `₹${p.deliveryCharge} delivery`
              : "Free Delivery";

          return (
            <div
              key={p._id}
              className="product-card"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {p.discount > 0 && (
                <span className="discount-badge">{p.discount}% off</span>
              )}
              <img
                src={`http://localhost:5000/uploads/${
                  p.images?.[0] || p.image
                }`}
                alt={p.name}
                className="product-image"
                style={{
                  width: "100%",
                  maxWidth: 400,
                  objectFit: "contain",
                }}
              />
              <div className="product-info">
                <h4 className="product-title">{p.name}</h4>
                <div className="price-row">
                  {p.originalPrice && (
                    <span className="old-price">₹{p.originalPrice}</span>
                  )}
                  <span className="new-price">₹{p.price}</span>
                  {p.discount > 0 && (
                    <span style={{ color: "#ff4081", fontSize: "13px" }}>
                      {p.discount}% off
                    </span>
                  )}
                </div>
                <p className="delivery-text">{deliveryChargeText}</p>
                <div className="rating-row">
                  <span className="rating-badge">{p.rating || " "} ★</span>
                  <span className="review-text">
                    {p.reviewsCount || 0} Reviews
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <br />
      {/* PROMO ROW */}
      <section className="promo-row">
        <div>
          <i className="fas fa-shipping-fast"></i>
          <h4>Fast Delivery</h4>
          <p>We ship all over the world with DHL.</p>
        </div>
        <div>
          <i className="fas fa-lock"></i>
          <h4>Secure Checkout</h4>
          <p>Pay with PayPal even without an account.</p>
        </div>
        <div>
          <i className="fas fa-undo"></i>
          <h4>Free Returns</h4>
          <p>7-day return policy offered.</p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
