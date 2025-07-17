"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "@/store/userSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, ShoppingCartIcon, X } from "lucide-react";
import SearchBar from "./SearchBar";
import HeaderMiniCart from "./headerminicart";
import LoginModal from "./LoginModal";
import { openLogin } from "@/store/modalSlice"; // ✅ import

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

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
        <Link href="/" className="flex gap-2 font-bold text-gray-800">
          <ShoppingCartIcon /> <span className="hidden md:block text-xl">Online Store</span> <span className="md:hidden">Store</span>
        </Link>

        {/* Search */}
        <div className="w-56">
          <SearchBar />
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center text-sm font-semibold gap-4">
          <Link href="/">Home</Link>
          <Link href="/product">Our Products</Link>
          <Link href="/brands">Our Brands</Link>
          <Link href="/offers">Offers</Link>
        </nav>

        {/* Right (desktop) */}
        <div className="hidden md:flex items-center gap-4">
        <Link href="/wishlist" className="relative">
  <Heart className="w-6 h-6" />
  {wishlistCount > 0 && (
    <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
      {wishlistCount}
    </span>
  )}
</Link>

          {user ? (
            <Link
              href="/myaccount"
              className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-800 hover:text-white"
            >
              Hi, {user.name}
            </Link>
          ) : (
            <button
              onClick={() => dispatch(openLogin())} // ✅ Redux
              className="bg-gray-300 px-6 py-2 rounded-full"
            >
              Login
            </button>
          )}


          <HeaderMiniCart />

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium py-3">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/product" onClick={() => setMenuOpen(false)}>Our Products</Link>
            <Link href="/brands" onClick={() => setMenuOpen(false)}>Our Brands</Link>
            <Link href="/offers" onClick={() => setMenuOpen(false)}>Offers</Link>
            <Link href="/support" onClick={() => setMenuOpen(false)}>Support</Link>
          </div>

          {user && (
            <button onClick={handleLogout} className="text-sm text-red-600">
              Logout
            </button>
          )}
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 w-full md:hidden">
        <div className="flex justify-between gap-4 shadow-lg bg-white py-4 px-5 w-full">
          {user ? (
            <Link href="/myaccount" onClick={() => setMenuOpen(false)}>
              Hi, {user.name}
            </Link>
          ) : (
            <button
              onClick={() => {
                dispatch(openLogin());
                setMenuOpen(false);
              }}
              className="w-full bg-gray-900 py-2 text-white rounded-full max-width-120px"
            >
              Login
            </button>
          )}
          <HeaderMiniCart />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal />
    </header>
  );
}
