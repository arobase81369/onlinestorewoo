// components/LoginModal.jsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin, userLogout } from "@/store/userSlice";
import axios from "axios";
import { fetchCustomerIdByEmail } from "@/lib/wooHelpers";

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/token",
        { username, password }
      );

      const { token, user_email, user_display_name } = res.data;
      const customerId = await fetchCustomerIdByEmail(user_email);

      dispatch(
        setUserLogin({
          token,
          email: user_email,
          name: user_display_name,
          id: customerId,
        })
      );

      onClose(); // close modal after login
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {user ? (
          <div className="text-center">
            <p>Welcome, {user.name}</p>
            <button
              onClick={() => dispatch(userLogout())}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border px-3 py-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
