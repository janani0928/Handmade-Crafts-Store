// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const safeParse = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  items: safeParse("cartItems", []),
  totalAmount: safeParse("totalAmount", 0),
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
          selectedSize: item.selectedSize,
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
      state.totalAmount = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        item.quantity = quantity;
      }

      state.totalAmount = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
    },
  },
});

export const { addToCart, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
