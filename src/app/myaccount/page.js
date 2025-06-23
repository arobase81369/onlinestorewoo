"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreUser, userLogout } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyAccount() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(userLogout());
    router.push("/");
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <Link href="/">Back to list</Link>
      <h2 className="text-xl font-bold mb-4">Welcome, {user.name} - {user.id}</h2>
      <p>Email: {user.email}</p>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
       <div className="block my-4"> <Link href="/myaccount/myorders">My Orders</Link></div>
      </div>
    </div>
  );
}
