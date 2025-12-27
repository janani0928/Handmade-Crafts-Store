import React, { useState } from "react";
import API_BASE_URL from "../utils/api";
const AddCategory = () => {
  const [name, setName] = useState("");
  const [subcategories, setSubcategories] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    const data = {
      name,
      subcategories: subcategories
        ? subcategories.split(",").map((s) => s.trim())
        : [],
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add category");

      alert("Category added successfully!");
      setName("");
      setSubcategories("");
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Subcategories (comma separated)"
          value={subcategories}
          onChange={(e) => setSubcategories(e.target.value)}
        />

        <button type="submit">Add Category</button>
      </form>

      <button onClick={handleRefresh} style={{ marginTop: "10px" }}>
        Refresh
      </button>
    </div>
  );
};

export default AddCategory;
