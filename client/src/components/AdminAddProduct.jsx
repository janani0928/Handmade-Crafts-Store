import React, { useState, useEffect } from "react";

const AdminAddProduct = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    image: null,
  });

  // Load all categories
 useEffect(() => {
  fetch( `http://localhost:5000/api/categories`)
    .then((res) => res.json())
    .then((data) => setCategories(data));
}, []);

// 🔥 Refresh categories every time user opens dropdown
const refreshCategories = () => {
  fetch( `http://localhost:5000/api/categories`)
    .then((res) => res.json())
    .then((data) => setCategories(data));
};


  // Update subcategories
  useEffect(() => {
   const selectedCat = categories.find(
  (c) => c.name.toLowerCase() === formData.category.toLowerCase()
);

    setSubcategories(selectedCat ? selectedCat.subcategories : []);
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    for (const key in formData) body.append(key, formData[key]);

    const res = await fetch(`http://localhost:5000/api/products`, {
      method: "POST",
      body,
    });

    if (res.ok) {
      alert("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        subcategory: "",
        image: null,
      });
      onBack();
    } else {
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} type="number" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
          <option value="">Select Subcategory</option>
          {subcategories.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>

        <input type="file" onChange={handleFileChange} required />

        <button type="submit">Add Product</button>
      </form>

      <button onClick={onBack}>← Back</button>
    </div>
  );
};

export default AdminAddProduct;
