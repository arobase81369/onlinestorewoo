"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/userSlice";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";
import HeaderMiniCart from "./headerminicart";
import { PowerOff } from "lucide-react";

export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(userLogout());
    router.push("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Online Store
        </Link>
        {/** Navigation Bar */}

        <div className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/product">Our Products</Link>
          <Link href="/offers">Offers</Link>
          <Link href="/support">Support</Link>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-1/2 hidden">
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="hidden md:block">
        <div className="flex items-center gap-4">
          <div className="space-x-4">
        {user ? (
            <div>
          <Link href="/myaccount" className="hover:underline">
            Hi, {user.name}
          </Link>
          <button onClick={() => dispatch(userLogout())} className="mx-2"><PowerOff className="text-sm" /></button>
        </div>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
                 {/* Cart */}
             <HeaderMiniCart />

        </div>
        </div>
      </div>
    </header>
  );
}
