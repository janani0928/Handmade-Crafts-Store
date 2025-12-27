import React from "react";
import API_BASE_URL from "../utils/api";

const CategoryGrid = ({ items, onSelect }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      padding: "20px"
    }}>
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => onSelect(item)}
          style={{
            textAlign: "center",
            cursor: "pointer"
          }}
        >
          <img
            src={`${API_BASE_URL}${item.image}`}
            alt={item.name}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain"
            }}
          />
          <p style={{ marginTop: "10px", fontWeight: "500" }}>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
