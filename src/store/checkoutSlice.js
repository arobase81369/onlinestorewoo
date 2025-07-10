// store/checkoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickupOption: false,
  shippingAddress: {},
  shippingAmount: 0,
  taxAmount: 0,
  coupon: {
    code: "",
    discount: 0,
    feedback: "",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPickupOption: (state, action) => {
      state.pickupOption = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setShippingAmount: (state, action) => {
      state.shippingAmount = action.payload;
    },
    setTaxAmount: (state, action) => {
      state.taxAmount = action.payload;
    },
    applyCouponSuccess: (state, action) => {
      console.log(action.payload);
      state.coupon = {
        code: action.payload.code,
        discount: action.payload.discount,
        feedback: `Coupon "${action.payload.code}" applied!`,
      };
    },
    applyCouponFail: (state, action) => {
      state.coupon = {
        code: "",
        discount: 0,
        feedback: action.payload || "Invalid or expired coupon",
      };
    },
  },
});

export const {
  setPickupOption,
  setShippingAddress,
  setTaxAmount,
  setShippingAmount,
  applyCouponSuccess,
  applyCouponFail,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
