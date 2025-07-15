"use client";

import Image from "next/image";
import { useRef } from "react";

const brands = [
  {
    name: "Levis",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
  {
    name: "Pepe Jeans",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
  {
    name: "Levis 2",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
  {
    name: "Levis 3",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
  {
    name: "Levis 4",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
  {
    name: "Levis 5",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/image099.png",
  },
];

export default function BrandSlider() {
  const sliderRef = useRef();

  const scroll = (dir) => {
    const scrollAmount = 200;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 md:py-10">
      <h2 className="text-lg md:text-2xl font-bold mb-6">Our Brands</h2>

      <div className="relative">
        {/* Scroll Left */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          &#8592;
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-15 h-15 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={100}
                height={100}
                className="object-contain h-16"
              />
            </div>
          ))}
        </div>

        {/* Scroll Right */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
