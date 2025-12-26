import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "./MainContent";        // ✅ import
import ProductDetails from "./ProductDetails";
import "./Homepage.css";


const ProductPage = () => {
  const { categoryId, subcategoryId, childId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct]=useState(null);
  const selectedCategory = { categoryId, subcategoryId, childId };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?category=${categoryId}&subcategory=${subcategoryId}&child=${childId}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, subcategoryId, childId]);

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="product-page">
    
      <div style={{ flex: 1, padding: "20px" }}>
        <MainContent
          selectedCategory={selectedCategory}
          onProductSelect={setSelectedProduct} // receives full product
        />

        {selectedProduct && (
          <div style={{ marginTop: 20 }}>
            <ProductDetails productId={selectedProduct._id} />
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ marginTop: 10 }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
