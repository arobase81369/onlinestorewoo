"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin } from "@/store/userSlice";
import { closeLogin } from "@/store/modalSlice"; // if using redux for modal control

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [form, setForm] = useState({
    login: "", // email/username/phone
    password: "",
    email: "",
    phone: "",
    username: "",
    fullname: "",
  });
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = useSelector((state) => state.modal.isLoginOpen); // optional redux control
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusText("");
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        setStatusText("Logging in...");
        const res = await axios.post(
          "https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/login",
          {
            login: form.login,
            password: form.password,
          }
        );

        const { token, user_email, user_display_name } = res.data;

        dispatch(
          setUserLogin({
            token,
            email: user_email,
            name: user_display_name,
          })
        );

        setStatusText("Login successful!");
        setForm({});
        setTimeout(() => {
          setIsLoading(false);
          onClose(); // or dispatch(closeLogin());
        }, 1000);
      }

      if (mode === "register") {
        setStatusText("Registering...");
        await axios.post(
          "https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/register",
          {
            email: form.email,
            username: form.username,
            password: form.password,
            phone: form.phone,
            fullname: form.fullname,
          }
        );

        setStatusText("Registered successfully!");
        setForm({});
        setTimeout(() => {
          setIsLoading(false);
          setMode("login");
          onClose();
        }, 1200);
      }

      if (mode === "forgot") {
        setStatusText("Sending reset link...");
        await axios.post(
          "https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/forgot-password",
          {
            email: form.email,
          }
        );
        setStatusText("Reset link sent!");
        setForm({});
        setTimeout(() => {
          setIsLoading(false);
          setMode("login");
          onClose();
        }, 1200);
      }
    } catch (err) {
      setIsLoading(false);
      setStatusText("");
      setError(err?.response?.data?.message || "Something went wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative shadow-md">
        <button
          className="absolute right-4 top-3 text-xl text-gray-600"
          onClick={() => {
            setForm({});
            setMode("login");
            dispatch(closeLogin());
          }}
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Sign Up"
              : "Forgot Password"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "login" && (
            <>
              <input
                type="text"
                placeholder="Email / Username / Phone"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.login || ""}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </>
          )}

          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.fullname || ""}
                onChange={(e) =>
                  setForm({ ...form, fullname: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.username || ""}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.password || ""}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </>
          )}

          {mode === "forgot" && (
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-3 py-2 rounded text-sm"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          )}

          {statusText && <p className="text-sm text-blue-600">{statusText}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Processing...
              </>
            ) : mode === "login" ? (
              "Login"
            ) : mode === "register" ? (
              "Register"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Mode Links */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" && (
            <>
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-blue-600 underline"
                >
                  Sign Up
                </button>
              </p>
              <button
                onClick={() => setMode("forgot")}
                className="mt-2 text-gray-500 underline text-xs"
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remember your password?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
