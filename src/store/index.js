// store/index.js
"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import counterReducer from "./counterSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import checkoutReducer from "./checkoutSlice";
import modalReducer from "./modalSlice";
import wishlistReducer from "./wishlistSlice";


const rootReducer = combineReducers({
  counter: counterReducer,
  cart: cartReducer,
  user: userReducer,
  checkout: checkoutReducer,
  modal: modalReducer,
  wishlist: wishlistReducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create and export store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export { store, persistor }; // ✅ named export
export default store;        // ✅ default export (for convenience)
