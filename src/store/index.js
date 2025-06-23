// store/index.js
"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import counterReducer from "./counterSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import CheckoutReducer from "@/app/checkout/page";

const rootReducer = combineReducers({
  counter: counterReducer,
  cart: cartReducer,
  user: userReducer
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
