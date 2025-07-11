"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/userSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, PowerOff } from "lucide-react";
import SearchBar from "./SearchBar";
import HeaderMiniCart from "./headerminicart";
import LoginModal from "./LoginModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(userLogout());
    router.push("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Online Store
        </Link>

        <div className="w-64">
            <SearchBar />
          </div>

        {/* Hamburger icon */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 font-medium">
          <Link href="/">Home</Link>
          <Link href="/product">Our Products</Link>
          <Link href="/brands">Our Brands</Link>
          <Link href="/offers">Offers</Link>
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4">
         

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/myaccount"
                className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-800 hover:text-white"
              >
                Hi, {user.name}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-gray-300 px-6 py-2 rounded-full"
            >
              Login
            </button>
          )}

          {/* Mini Cart */}
          <HeaderMiniCart />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/product" onClick={() => setMenuOpen(false)}>Our Products</Link>
            <Link href="/brands" onClick={() => setMenuOpen(false)}>Our Brands</Link>
            <Link href="/offers" onClick={() => setMenuOpen(false)}>Offers</Link>
            <Link href="/support" onClick={() => setMenuOpen(false)}>Support</Link>
          </div>
          <button
                  onClick={handleLogout}
                  className="text-sm text-red-600"
                >
                  Logout
                </button>
        </div>
      )}

<div className="fixed bottom-0 w-full md:hidden ">
        <div className="flex justify-between gap-4 align-items-center bg-white py-4 px-5 w-full">

          
          {/* Login or Logout */}
          <div className="mt-4">
            {user ? (
              <div className="flex justify-between items-center">
                <Link href="/myaccount" onClick={() => setMenuOpen(false)}>
                  Hi, {user.name}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-300 py-2 rounded"
              >
                Login
              </button>
            )}
          </div>

          {/* Cart */}
          <div className="mt-4">
            <HeaderMiniCart />
          </div>
          </div>
          </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
