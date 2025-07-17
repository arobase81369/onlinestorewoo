"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Star } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/wishlistSlice";
import Link from "next/link";

const categories = ["Kids", "Men", "Women"];

export default function NewArrivalsSlider() {
  const [selectedCategory, setSelectedCategory] = useState("Men");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const sliderRef = useRef();

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/products"
        );
        const data = await res.json();
        const allProducts = data.products || [];

        const filtered = allProducts.filter((product) =>
          product.tags?.some(
            (cat) =>
              cat.slug?.toLowerCase() === selectedCategory.toLowerCase()
          )
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      dispatch(removeFromWishlist({ id: product.id }));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
        })
      );
    }
  };

  const scrollSlider = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-3 md:py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold">New Arrivals</h2>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 border rounded-full text-sm ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "border-gray-300 text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Left Button */}
        <button
          onClick={() => scrollSlider("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden md:block"
        >
          &#8592;
        </button>

        {/* Product Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-60 rounded"></div>
            ))}
          </div>
          ) : products.length === 0 ? (
            <p className="p-4">No products found.</p>
          ) : (
            products.map((product) => (
                <div key={product.id}>
                     <Link href={`/product/${product.slug}`}>
              <div className="w-40 md:min-w-[250px] md:max-w-[250px] flex-shrink-0 bg-f2f2f2 relative rounded-lg"
              >
                {product.sale_price && (
                  <span className="absolute top-2 left-2 bg-red-100 text-red-500 text-xs font-semibold px-2 py-1 rounded">
                    10% Off
                  </span>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-40 object-cover mb-2"
                />
                <div className="px-3 py-2">
                    <div className="flex justify-between">
                        <div>
                        <div className="fs-12 text-gray-400 font-semibold mb-1">
                  {product.categories?.[0]?.name || "Brand"}
                </div>
                        </div>
                        <div
                  className="cursor-pointer" >
                    <div className="flex items-center text-xs gap-1 text-gray-700">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    4.5
                  </div>
                 
                </div>
                    </div>
                    <div className="text-sm text-gray-900 line-clamp-2">
                  {product.name}
                </div>
               
                <div className="flex justify-between items-center mt-2">
                  
                  <div className="text-sm font-bold">
                    ₹{product.sale_price || product.price}
                  </div>
                  <div  onClick={() => toggleWishlist(product)}>
                  <Heart
                    className={`w-5 h-5 transition ${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  </div>
                </div>
               
                </div>
              </div>
              </Link>
              </div>
            ))
          )}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scrollSlider("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden md:block"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
