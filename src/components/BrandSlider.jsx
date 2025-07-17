"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const brands = 
[
    {
    "id": 43,
    "name": "adidas",
    "slug": "adidas",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-adidas.png",
    },
    {
    "id": 39,
    "name": "arrow",
    "slug": "arrow",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-nike.png",
    },
    {
    "id": 44,
    "name": "lee",
    "slug": "lee",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-lee.png",
    },
    {
    "id": 34,
    "name": "Levis",
    "slug": "levis",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-levis.png",
    },
    {
    "id": 38,
    "name": "pepe jeans",
    "slug": "pepe-jeans",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-pepe-jeans.png",
    },
    {
    "id": 41,
    "name": "peterland",
    "slug": "peterland",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-peterengland.png",
    },
    {
    "id": 42,
    "name": "prada",
    "slug": "prada",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon.png",
    },
    {
    "id": 42,
    "name": "nike",
    "slug": "nike",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-nike.png",
    },
    {
    "id": 42,
    "name": "puma",
    "slug": "puma",
    image: "https://arobasedesigns.in/reactwpapi/wp-content/uploads/2025/07/brand-icon-puma.png",
    }
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
    <div className="max-w-7xl mx-auto py-3 md:py-4W">
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
              className="flex-shrink-0 w-15 h-15 md:w-30 md:h-30 rounded-xl bg-gray-100 flex items-center justify-center"
            >
                <Link href={`/brands/${brand.slug}`}>
              <Image
                src={brand.image}
                alt={brand.name}
                width={100}
                height={100}
                className="object-contain h-16"
              />
              </Link>
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
