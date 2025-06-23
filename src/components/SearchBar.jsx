"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products?search=${searchTerm}&consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  const highlightMatch = (name) => {
    const parts = name.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-4" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-4 py-2 rounded shadow text-black pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="absolute top-full mt-1 left-0 w-full bg-white shadow rounded p-2 text-sm text-gray-500">
          Loading...
        </div>
      ) : suggestions.length > 0 ? (
        <div className="absolute top-full mt-1 left-0 w-full bg-white shadow-lg rounded max-h-80 overflow-y-auto z-50">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center gap-4 p-2 hover:bg-gray-100 border-b"
              onClick={() => clearSearch()}
            >
              <Image
                src={product.images?.[0]?.src || "/placeholder.png"}
                alt={product.name}
                width={40}
                height={40}
                className="rounded object-cover"
              />
              <div>
                <p className="text-sm font-medium">
                  {highlightMatch(product.name)}
                </p>
                <div
                  className="text-xs text-gray-500"
                  dangerouslySetInnerHTML={{ __html: product.price_html }}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : searchTerm && !loading ? (
        <div className="absolute top-full mt-1 left-0 w-full bg-white shadow rounded p-2 text-sm text-gray-500">
          No products found.
        </div>
      ) : null}
    </div>
  );
}
