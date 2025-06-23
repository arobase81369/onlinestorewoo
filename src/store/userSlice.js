// userSlice.js
/*
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Thunk to fetch WooCommerce customer ID by email
export const fetchCustomerIdByEmail = createAsyncThunk(
  "user/fetchCustomerIdByEmail",
  async (email) => {
    const ck = process.env.NEXT_PUBLIC_WC_KEY;
    const cs = process.env.NEXT_PUBLIC_WC_SECRET;

    const response = await axios.get(
      `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/customers`,
      {
        auth: {
          username: ck,
          password: cs,
        },
      }
    );

    const matched = response.data.find((customer) => customer.email === email);
    return matched?.id || null;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUserLogin: (state, action) => {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    userLogout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    restoreUser: (state) => {
      if (typeof window !== "undefined") {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const saveduserid = localStorage.getItem("userid");
           console.log("saveduers");
          
           savedUser.id = saveduserid;
           console.log(savedUser);
        if (savedUser) {
          state.user = savedUser;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerIdByEmail.fulfilled, (state, action) => {
      if (state.user) {
        state.user.id = action.payload;
        localStorage.setItem("userid", action.payload);
      }
    });
  },
});

// ✅ Export everything you need
export const { setUserLogin, userLogout, restoreUser } = userSlice.actions;
export default userSlice.reducer;

*/

// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    userLogout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    restoreUser: (state) => {
      if (typeof window !== "undefined") {
        const saved = JSON.parse(localStorage.getItem("user"));
        const saveduserid = localStorage.getItem("userid");
        saved.id = saveduserid;
        if (saved) {
          state.user = saved;
        }
      }
    },
  },
});

export const { setUserLogin, userLogout, restoreUser } = userSlice.actions;
export default userSlice.reducer;

