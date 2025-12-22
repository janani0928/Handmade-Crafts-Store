import React, { useEffect, useState } from "react";

const Sidebar = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isMobile = windowWidth <= 768;

  const styles = {
    sidebar: {
      width: isMobile ? "80%" : "260px",
      padding: isMobile ? "10px" : "20px",
      background: "#fff",
      height: "100vh",
      overflowY: "auto",
      position: isMobile ? "fixed" : "sticky",
      top: 0,
      left: mobileOpen || !isMobile ? 0 : "-100%",
      zIndex: 1000,
      transition: "left 0.3s ease",
      borderRight: isMobile ? "none" : "1px solid #e0e0e0",
      boxShadow: isMobile
        ? "0 0 10px rgba(0,0,0,0.2)"
        : "2px 0 8px rgba(0,0,0,0.05)",
      fontFamily: "Arial, sans-serif",
    },
    overlay: {
      display: mobileOpen ? "block" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 999,
    },
    toggleBtn: {
      display: isMobile ? "block" : "none",
      position: "absolute",
      zIndex: 1100,
      padding: "8px 12px",
      background: "#d63384",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#d63384",
      textAlign: "center",
      letterSpacing: "0.5px",
    },
    item: {
      padding: "12px 14px",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      fontWeight: 600,
      color: "#212529",
      marginBottom: "6px",
    },
    itemHover: {
      backgroundColor: "#ffe3ec",
      color: "#d63384",
      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    },
    sublist: { paddingLeft: "18px", listStyle: "none", marginTop: "5px" },
    subitem: {
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      color: "#495057",
      fontWeight: 500,
      marginBottom: "4px",
    },
    childlist: { paddingLeft: "22px", listStyle: "none", marginTop: "3px" },
    childitem: {
      padding: "6px 10px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "all 0.2s ease",
      color: "#6c757d",
      fontSize: "14px",
      marginBottom: "2px",
    },
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button style={styles.toggleBtn} onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? "" : "Categories"}
      </button>

      {/* Overlay */}
      {isMobile && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Categories</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {categories.map((cat) => (
            <li key={cat._id}>
              {/* Category */}
              <div
                style={{
                  ...styles.item,
                  ...(hoverIndex === cat._id ? styles.itemHover : {}),
                }}
                onMouseEnter={() => setHoverIndex(cat._id)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() =>
                  setExpandedCategory(expandedCategory === cat._id ? null : cat._id)
                }
              >
                {cat.name}
              </div>

              {/* Subcategories */}
              {expandedCategory === cat._id &&
                cat.subcategories.map((sub) => (
                  <ul style={styles.sublist} key={sub._id}>
                    <li
                      style={styles.subitem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSubcategory(
                          expandedSubcategory === sub._id ? null : sub._id
                        );
                        onCategorySelect({
                          category: { _id: cat._id, name: cat.name },
                          subcategory: { _id: sub._id, name: sub.name },
                          categoryId: "",
                          subcategoryId: "",
                          childId: "",
                          child: null,
                        });
                      }}
                    >
                      {sub.name}
                    </li>

                    {/* Child Categories */}
                    {expandedSubcategory === sub._id &&
                      sub.children.map((child) => (
                        <ul style={styles.childlist} key={child._id}>
                          <li
                            style={styles.childitem}
                            onClick={(e) => {
                              e.stopPropagation();
                              onCategorySelect({
                                category: { _id: cat._id, name: cat.name },
                                subcategory: { _id: sub._id, name: sub.name },
                                child: { _id: child._id, name: child.name },
                                categoryId: cat._id,
                                subcategoryId: sub._id,
                                childId: child._id,
                              });
                              if (isMobile) setMobileOpen(false);
                            }}
                          >
                            {child.name}
                          </li>
                        </ul>
                      ))}
                  </ul>
                ))}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
