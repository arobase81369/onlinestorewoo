// store/checkoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickup: false,
  shippingAddress: "",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPickupOption: (state, action) => {
      state.pickup = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
  },
});

export const { setPickupOption, setShippingAddress } = checkoutSlice.actions;
export default checkoutSlice.reducer;
