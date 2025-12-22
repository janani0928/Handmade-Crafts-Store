// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const savedTotal = JSON.parse(localStorage.getItem("totalAmount")) || 0;

const initialState = {
  items: savedItems,
  totalAmount: savedTotal,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
 addToCart: (state, action) => {
  const item = action.payload;
  const existing = state.items.find((i) => i._id === item._id);

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    state.items.push({
      _id: item._id,
      name: item.name,
      price: item.price,
      images: Array.isArray(item.images) ? item.images : [item.images],
      discount: item.discount || 0,
      deliveryCharge: item.deliveryCharge || 0,
      quantity: item.quantity || 1,
      selectedSize: item.selectedSize, // ✅ ensure this exists

    });
  }

  state.totalAmount = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  localStorage.setItem("cartItems", JSON.stringify(state.items));
  localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
},


    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

updateQuantity: (state, action) => {
  const { id, quantity } = action.payload;
  const item = state.items.find((i) => i._id === id);
  if (item) {
    item.quantity = quantity;
  }
  state.totalAmount = state.items.reduce((sum, i) => sum.price * i.quantity, 0);
},


    // Optional: clear cart completely
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
    },
  },
});

export const { addToCart, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
