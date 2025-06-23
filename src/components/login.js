"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin, userLogout } from "@/store/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchCustomerIdByEmail } from "@/store/userSlice";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  console.log(user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/token", {
        username,
        password,
      });

      const { token, user_email, user_display_name } = res.data;

      dispatch(setUserLogin({ token, email: user_email, name: user_display_name }));
      dispatch(fetchCustomerIdByEmail(user_email));

    //  router.push("/my-account");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };


  if(user !== null && user !== undefined) {
    return ( 
    <div className="text-center my-9">
        <h2 className="mb-2">Hi {user.name} ({user.id}), Welcome to Online Store</h2>
        <button  onClick={() => dispatch(userLogout())} className="px-10 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Logout</button>
        <div className="block"><Link href="/myaccount">My Account</Link></div>
    </div> );
  }


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Login to Your Account</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <button onClick={() => dispatch(userLogout())}>Log Out</button>
    </div>
  );
}
