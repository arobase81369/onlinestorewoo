// store/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isLoginOpen: false,
  },
  reducers: {
    openLogin: (state) => {
      state.isLoginOpen = true;
    },
    closeLogin: (state) => {
      state.isLoginOpen = false;
    },
  },
});

export const { openLogin, closeLogin } = modalSlice.actions;
export default modalSlice.reducer;
