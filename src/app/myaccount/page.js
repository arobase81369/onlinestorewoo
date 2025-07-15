"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreUser, userLogout } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyOrderscomp from "@/components/myordercomp";

export default function MyAccount() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(userLogout());
    router.push("/");
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 underline text-sm"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 bg-f2f2f2 rounded-lg shadow p-4 h-fit">
          <h2 className="text-lg font-bold mb-4">My Account</h2>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeTab === "overview" ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                Profile Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeTab === "orders" ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                My Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("address")}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeTab === "address" ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                Address Book
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 px-3 py-2 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-2 md:p-6">
          {activeTab === "overview" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Welcome, {user.name}</h3>
              <p className="mb-2">📧 Email: {user.email}</p>
              <p className="mb-2">🆔 Customer ID: {user.id}</p>
              <p className="text-gray-600 mt-4">
                Use the menu on the left to manage your orders, address and account settings.
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
             <MyOrderscomp />
              {/* Replace with <MyOrders /> if you have one */}
            </div>
          )}

          {activeTab === "address" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">📍 Address Book</h3>
              <p className="text-gray-500">Address management component goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
