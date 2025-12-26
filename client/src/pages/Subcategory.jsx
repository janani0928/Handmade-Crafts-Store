import React, { useState, useEffect } from "react";
import API from "../config/api";

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      const data = await res.json();
      setCategories(data);
      // Optionally, reset category selection
      if (data.length > 0) setCategoryName(data[0].name);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !subcategoryName) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/categories/add-subcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName, subcategoryName }),
      });

      if (!res.ok) throw new Error("Failed to add subcategory");

      const updatedCategories = await fetch(`${API}/api/categories`).then((res) => res.json());
      setCategories(updatedCategories);

      // Update subcategory list for selected category
      const selectedCategory = updatedCategories.find((cat) => cat.name === categoryName);
      setSubcategories(selectedCategory?.subcategories || []);

      alert("Subcategory added successfully!");
      setSubcategoryName("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while adding subcategory");
    } finally {
      setLoading(false);
    }
  };

  // Update subcategories list when category changes
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat.name === categoryName);
    setSubcategories(selectedCategory?.subcategories || []);
  }, [categoryName, categories]);

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add Subcategory</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>

        <input
          type="text"
          placeholder="New Subcategory"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Subcategory"}
        </button>
      </form>

      {subcategories.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Subcategories under "{categoryName}"</h3>
          <ul>
            {subcategories.map((sub, idx) => (
              <li key={idx}>{sub}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddSubcategory;
