// store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: typeof window !== "undefined" && localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const saveToLocalStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
      saveToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      saveToLocalStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
