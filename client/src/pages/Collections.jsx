// Collection.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ProductDetails from "../pages/ProductDetails";

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onCategorySelect={setSelectedCategory} />

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

export default Collection;
