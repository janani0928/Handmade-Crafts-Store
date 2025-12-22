import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null); // For filtering "other products"

  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const safeData = data.map((cat) => ({
          ...cat,
          subcategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
              ...sub,
              children: Array.isArray(sub.children) ? sub.children : [],
            }))
            : [],
        }));
        setCategories(safeData);
      })
      .catch(console.error);
  }, []);

  // Clear products if no category selected
  useEffect(() => {
    if (!selectedCategory?.childId) {
      setCurrentProduct(null);
    }
  }, [selectedCategory]);

  const handleSubscribe = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
    }
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
          <button onClick={() => navigate("/collection")}>
            Shop Now
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
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
          { img: "https://i.imgur.com/8Km9tLL.png", label: "Ethnic Wear" },
          { img: "https://i.imgur.com/JqEuJ6t.png", label: "Western Dresses" },
          { img: "https://i.imgur.com/0y8Ftya.png", label: "Menswear" },
          { img: "https://i.imgur.com/NnQwQyY.png", label: "Footwear" },
          { img: "https://i.imgur.com/3O1Q5eB.png", label: "Home Decor" },
          { img: "https://i.imgur.com/mnX9qdp.png", label: "Beauty" },
          { img: "https://i.imgur.com/3wP5M7H.png", label: "Accessories" },
          { img: "https://i.imgur.com/9oM0LqR.png", label: "Grocery" },
        ].map((cat, idx) => (
          <div className="category-card" key={idx}>
            <img src={cat.img} alt={cat.label} />
            <p>{cat.label}</p>
          </div>
        ))}
      </section>
      <hr />

      {/* ALL PRODUCTS SECTION */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {allProducts
            .filter((p) => p._id !== currentProduct?._id) // optional chaining to avoid null errors
            .map((p) => (
              <div
                key={p._id}
                className="product-card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {/* Discount Badge */}
                {p.discount && (
                  <span className="discount-badge">{p.discount}% off</span>
                )}

                <img
                  src={`http://localhost:5000/uploads/${p.images?.[0] || p.image}`}
                  alt={p.name}
                  className="product-image"
                />

                <div className="product-info">
                  <h4 className="product-title">{p.name}</h4>

                  <div className="price-row">
                    {p.originalPrice && (
                      <span className="old-price">₹{p.originalPrice}</span>
                    )}
                    <span className="new-price">₹{p.price}</span>
                    {p.discount && (
                      <span className="discount-text">{p.discount}% off</span>
                    )}
                  </div>

                  <p className="delivery-text">Free Delivery</p>

                  <div className="rating-row">
                    <span className="rating-badge">
                      {p.rating || 5} ★
                    </span>
                    <span className="review-text">
                      {p.reviewsCount || 0} Reviews
                    </span>
                  </div>
                </div>
              </div>

            ))}
        </div>
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
