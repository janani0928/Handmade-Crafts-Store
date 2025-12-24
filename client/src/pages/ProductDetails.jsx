import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../App.css";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  /* =======================
     FETCH ALL PRODUCTS
  ======================= */
  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error("Products API failed");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setAllProducts(data);
      })
      .catch(err => console.error(err));
  }, [API]);

  /* =======================
     FETCH SINGLE PRODUCT
  ======================= */
  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setMainImage(data.images?.[0] || data.image || "");
      })
      .catch(err => {
        console.error(err);
        toast.error("Product not found");
      });
  }, [id, API]);

  /* =======================
     RELATED PRODUCTS
  ======================= */
  useEffect(() => {
    if (product && allProducts.length) {
      setRelatedProducts(
        allProducts.filter(
          p => p._id !== product._id && p.category === product.category
        )
      );
    }
  }, [product, allProducts]);

  if (!product) {
    return <p style={styles.loading}>Loading product...</p>;
  }

  const price = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const discountAmount = Math.round((price * discount) / 100);
  const finalPrice = price - discountAmount;

  const sizeType = product?.sizeType?.toLowerCase() || "free";
  const sizeChart = Array.isArray(product.sizeChart) ? product.sizeChart : [];
  const requiresSize = sizeType === "clothing" || sizeType === "footwear";

  /* =======================
     ACTIONS
  ======================= */
  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      toast.warning("Please select a size");
      return;
    }
    dispatch(addToCart({ ...product, quantity: selectedQuantity, selectedSize }));
    toast.success("Added to cart");
    navigate("/cart");
  };

  const handleOrderNow = () => {
    if (requiresSize && !selectedSize) {
      toast.warning("Please select a size");
      return;
    }
    navigate("/delivery-address", {
      state: { items: [{ ...product, quantity: selectedQuantity, selectedSize }] },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        {/* LEFT */}
        <div style={styles.leftSide}>
          <div style={styles.thumbnails}>
            {(product.images?.length ? product.images : [product.image])
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={`${API}/uploads/${img}`}
                  alt=""
                  style={styles.thumbnail}
                  onClick={() => setMainImage(img)}
                />
              ))}
          </div>

          <div>
            <img
              src={`${API}/uploads/${mainImage}`}
              alt={product.name}
              style={{
                ...styles.mainImage,
                transform: `scale(${isZoomed ? 2 : 1})`,
                transformOrigin: `${x}% ${y}%`,
              }}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={e => {
                if (!isZoomed) return;
                const r = e.currentTarget.getBoundingClientRect();
                setX(((e.clientX - r.left) / r.width) * 100);
                setY(((e.clientY - r.top) / r.height) * 100);
              }}
            />

            <div style={styles.buttons}>
              <button onClick={handleAddToCart} style={styles.cartBtn}>
                Add to Cart
              </button>
              <button onClick={handleOrderNow} style={styles.buyBtn}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.rightSide}>
          <h1>{product.name}</h1>
          <h2>₹{finalPrice}</h2>
          {discount > 0 && <p>You save ₹{discountAmount}</p>}

          {requiresSize && (
            <div>
              <h3>Select Size</h3>
              {sizeChart.map((s, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.sizeBtn,
                    background: selectedSize === s.size ? "#2874f0" : "#eee",
                    color: selectedSize === s.size ? "#fff" : "#000",
                  }}
                  onClick={() => setSelectedSize(s.size)}
                >
                  {s.size}
                </button>
              ))}
            </div>
          )}

          <p>{product.description}</p>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div style={styles.related}>
        {(relatedProducts.length ? relatedProducts : allProducts)
          .filter(p => p._id !== product._id)
          .map(p => (
            <div key={p._id} style={styles.card} onClick={() => navigate(`/product/${p._id}`)}>
              <img src={`${API}/uploads/${p.images?.[0] || p.image}`} alt="" />
              <p>{p.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: 12 },
  main: { display: "flex", flexWrap: "wrap", gap: 30 },
  leftSide: { display: "flex", gap: 12 },
  thumbnails: { display: "flex", flexDirection: "column", gap: 8 },
  thumbnail: { width: 70, height: 70, cursor: "pointer", objectFit: "cover" },
  mainImage: { width: 350, height: 350, objectFit: "contain", cursor: "zoom-in" },
  buttons: { display: "flex", gap: 10, marginTop: 10 },
  cartBtn: { padding: 12, background: "#ff4081", color: "#fff", border: "none" },
  buyBtn: { padding: 12, background: "#00796b", color: "#fff", border: "none" },
  rightSide: { maxWidth: 450 },
  sizeBtn: { marginRight: 8, padding: "6px 12px", border: "none" },
  related: { marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12 },
  card: { border: "1px solid #ddd", padding: 8, cursor: "pointer" },
  loading: { padding: 20 },
};

export default ProductDetails;
