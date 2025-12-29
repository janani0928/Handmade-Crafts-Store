import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../utils/api"

const EMPTY_HIGHLIGHT = {
  heading: "",
  SubHeading: "",
  subItems: [{ label: "", value: "" }],
};

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [childName, setChildName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sizeType, setSizeType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    childSubcategory: "",
    brand: "",
    rating: "",
    deliveryCharge: "",
    discount: "",
    images: [],
    specifications: {},
    highlights: [{ ...EMPTY_HIGHLIGHT }],
    sizeType:[],
    sizeChart: [{ size: "", chest: "", waist: "", length: "" }],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CATEGORY MANAGEMENT ================= */
  const addCategory = async () => {
    if (!categoryName.trim()) return;
    await fetch(`${API_BASE_URL}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName.trim() }),
    });
    setCategoryName("");
    fetchCategories();
  };

  const addSubcategory = async () => {
    if (!selectedCategory || !subcategoryName.trim()) return;
    await fetch(`${API_BASE_URL}/subcategory/${selectedCategory}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: subcategoryName.trim() }),
    });
    setSubcategoryName("");
    fetchCategories();
  };

  const addChildSubcategory = async () => {
    if (!selectedCategory || !selectedSubcategory || !childName.trim()) return;
    await fetch(
      `${API_BASE_URL}/child-subcategory/${selectedCategory}/${selectedSubcategory}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: childName.trim() }),
      }
    );
    setChildName("");
    fetchCategories();
  };

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("spec_")) {
      const key = name.replace("spec_", "");
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [key]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizeChart];
    updated[index][field] = value;
    setFormData({ ...formData, sizeChart: updated });
  };

  const addSizeRow = () => {
    if (sizeType === "clothing") {
      setFormData({
        ...formData,
        sizeChart: [...formData.sizeChart, { size: "", chest: "", waist: "", length: "" }],
      });
    } else if (sizeType === "footwear") {
      setFormData({
        ...formData,
        sizeChart: [...formData.sizeChart, { size: "" }],
      });
    }
  };

  const removeSizeRow = (i) => {
    setFormData({
      ...formData,
      sizeChart: formData.sizeChart.filter((_, index) => index !== i),
    });
  };

  const addHeading = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { ...EMPTY_HIGHLIGHT }],
    });
  };

  const removeHeading = (index) => {
    const updated = formData.highlights.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      highlights: updated.length ? updated : [{ ...EMPTY_HIGHLIGHT }],
    });
  };

  const addSubItem = (hIndex) => {
    const updated = [...formData.highlights];
    updated[hIndex].subItems.push({ label: "", value: "" });
    setFormData({ ...formData, highlights: updated });
  };

  const removeSubItem = (hIndex, sIndex) => {
    const updated = [...formData.highlights];
    updated[hIndex].subItems.splice(sIndex, 1);
    setFormData({ ...formData, highlights: updated });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const body = new FormData();

    const productData = {
      ...formData,
      price: Number(formData.price || 0),
      rating: Number(formData.rating || 0),
      deliveryCharge: Number(formData.deliveryCharge || 0),
      discount: Number(formData.discount || 0),
        sizeType: sizeType, // make sure sizeType is synced

  sizeChart: sizeType === "free" ? [] : formData.sizeChart,

    };

    Object.keys(productData).forEach((key) => {
      if (["highlights", "specifications", "sizeChart"].includes(key)) {
        body.append(key, JSON.stringify(productData[key]));
      } else if (key === "images") {
        formData.images.forEach((file) => body.append("images", file));
      } else {
        body.append(key, productData[key]);
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const d = await res.json();
        toast.warning(d.error || "Product add failed");
        return;
      }

      toast.success("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        childSubcategory: "",
        brand: "",
        rating: "",
        deliveryCharge: "",
        discount: "",
        images: [],
        specifications: {},
        highlights: [{ ...EMPTY_HIGHLIGHT }],
        sizeType:[],
        sizeChart: [{ size: "", chest: "", waist: "", length: "" }],
      });
      setImagePreviews([]);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSizeType("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);
  const selectedSubcatObj = selectedCategoryObj?.subcategories?.find(
    (s) => s._id === selectedSubcategory
  );

  /* ================= INLINE STYLES ================= */
  const styles = {
    container: { maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" },
    section: { marginBottom: 40, padding: 20, border: "1px solid #ddd", borderRadius: 8 },
    heading: { textAlign: "center", marginBottom: 20, color: "#333" },
    input: { padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc", width: "100%" },
    select: { padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc", width: "100%" },
    button: {
      padding: "8px 16px",
      marginRight: 10,
      marginTop: 10,
      borderRadius: 4,
      cursor: "pointer",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
    },
    subButton: {
      padding: "4px 10px",
      marginLeft: 5,
      borderRadius: 4,
      cursor: "pointer",
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
    },
    highlightBox: { padding: 10, border: "1px solid #ccc", marginBottom: 10, borderRadius: 6, backgroundColor: "#f9f9f9" },
    sizeRow: { display: "flex", gap: 8, marginBottom: 6, alignItems: "center" },
    imagePreview: { width: 80, height: 80, objectFit: "cover", borderRadius: 4 },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      {/* CATEGORY MANAGEMENT */}
      <section style={styles.section}>
        <h3>Add Category</h3>
        <input style={styles.input} value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category Name" />
        <button style={styles.button} onClick={addCategory}>Add Category</button>

        <h3>Add Subcategory</h3>
        <select style={styles.select} value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(""); }}>
          <option value="">Select Category</option>
          {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
        </select>
        <input style={styles.input} value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} placeholder="Subcategory Name" />
        <button style={styles.button} onClick={addSubcategory}>Add Subcategory</button>

        <h3>Add Child Subcategory</h3>
        <select style={styles.select} value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          <option value="">Select Subcategory</option>
          {selectedCategoryObj?.subcategories?.map((sub) => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}
        </select>
        <input style={styles.input} value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Child Subcategory Name" />
        <button style={styles.button} onClick={addChildSubcategory}>Add Child</button>
      </section>

      {/* PRODUCT FORM */}
      <section style={styles.section}>
        <h2>Add Product</h2>
        <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input style={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
          <input style={styles.input} name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" />
          <input style={styles.input} name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" />
          <textarea style={styles.input} name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <input style={styles.input} name="deliveryCharge" type="number" value={formData.deliveryCharge} onChange={handleChange} placeholder="Delivery Charge" />
          <input style={styles.input} name="discount" type="number" value={formData.discount} onChange={handleChange} placeholder="Discount (%)" />

<select
  style={styles.select}
  value={selectedCategory}
  onChange={(e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubcategory("");

    setFormData(prev => ({
      ...prev,
      category: value,
      subcategory: "",
      childSubcategory: ""
    }));
  }}
  required
>
            <option value="">Select Category</option>
            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
          </select>
<select
  style={styles.select}
  value={selectedSubcategory}
  onChange={(e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);

    setFormData(prev => ({
      ...prev,
      subcategory: value,
      childSubcategory: ""
    }));
  }}
  required
>
            <option value="">Select Subcategory</option>
            {selectedCategoryObj?.subcategories?.map((sub) => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}
          </select>
          <select style={styles.select} name="childSubcategory" value={formData.childSubcategory} onChange={handleChange} required>
            <option value="">Select Child Subcategory</option>
            {selectedSubcatObj?.children?.map((ch) => (<option key={ch._id} value={ch._id}>{ch.name}</option>))}
          </select>

          {/* HIGHLIGHTS */}
          <h3>Product Highlights</h3>
          {formData.highlights.map((highlight, hIndex) => (
            <div key={hIndex} style={styles.highlightBox}>
              <input style={styles.input} placeholder="Heading" value={highlight.heading} onChange={(e) => {
                const updated = [...formData.highlights];
                updated[hIndex].heading = e.target.value;
                setFormData({ ...formData, highlights: updated });
              }} />
              <input style={styles.input} placeholder="SubHeading" value={highlight.SubHeading} onChange={(e) => {
                const updated = [...formData.highlights];
                updated[hIndex].SubHeading = e.target.value;
                setFormData({ ...formData, highlights: updated });
              }} />

              {highlight.subItems.map((sub, sIndex) => (
                <div key={sIndex} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <input style={{ flex: 1, padding: 6 }} placeholder="Label" value={sub.label} onChange={(e) => {
                    const updated = [...formData.highlights];
                    updated[hIndex].subItems[sIndex].label = e.target.value;
                    setFormData({ ...formData, highlights: updated });
                  }} />
                  <input style={{ flex: 1, padding: 6 }} placeholder="Value" value={sub.value} onChange={(e) => {
                    const updated = [...formData.highlights];
                    updated[hIndex].subItems[sIndex].value = e.target.value;
                    setFormData({ ...formData, highlights: updated });
                  }} />
                  <button type="button" style={styles.subButton} onClick={() => removeSubItem(hIndex, sIndex)}>X</button>
                </div>
              ))}
              <button type="button" style={styles.button} onClick={() => addSubItem(hIndex)}>+ Add Sub Item</button>
            </div>
          ))}
          <button type="button" style={styles.button} onClick={addHeading}>+ Add Heading</button>

          {/* SIZE TYPE */}
          <h3>Size Type</h3>
<select
  name="sizeType"
  value={sizeType}
  onChange={(e) => {
    const value = e.target.value;
    setSizeType(value);

    setFormData((prev) => ({
      ...prev,
            sizeType: value, // ✅ add this
      sizeChart:
        value === "free"
          ? []
          : value === "clothing"
          ? [{ size: "", chest: "", waist: "", length: "" }]
          : [{ size: "" }], // footwear
    }));
  }}
>
  <option value="free">Free Size</option>
  <option value="footwear">Footwear</option>
  <option value="clothing">Clothing</option>
</select>



{/* SIZE CHART */}
{sizeType === "clothing" || sizeType === "footwear" ? (
  <>
    <h3>Size Chart</h3>
    {formData.sizeChart.map((row, i) => (
      <div key={i} style={styles.sizeRow}>
        <input
          placeholder="Size (e.g., IND-6)"
          value={row.size}
          onChange={(e) => handleSizeChange(i, "size", e.target.value)}
        />
        {sizeType === "clothing" && (
          <>
            <input
              placeholder="Chest"
              value={row.chest}
              onChange={(e) => handleSizeChange(i, "chest", e.target.value)}
            />
            <input
              placeholder="Waist"
              value={row.waist}
              onChange={(e) => handleSizeChange(i, "waist", e.target.value)}
            />
            <input
              placeholder="Length"
              value={row.length}
              onChange={(e) => handleSizeChange(i, "length", e.target.value)}
            />
          </>
        )}
        <button type="button" style={styles.subButton} onClick={() => removeSizeRow(i)}>X</button>
      </div>
    ))}
    <button type="button" style={styles.button} onClick={addSizeRow}>+ Add Size</button>
  </>
) : (
  sizeType === "free" && <p><b>Size:</b> Free Size</p>
)}

          {/* IMAGE UPLOAD */}
          <input type="file" multiple onChange={handleFileChange} style={{ marginTop: 10 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {imagePreviews.map((src, index) => <img key={index} src={src} alt="" style={styles.imagePreview} />)}
          </div>

          <button type="submit" style={{ ...styles.button, marginTop: 20 }}>Add Product</button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;
