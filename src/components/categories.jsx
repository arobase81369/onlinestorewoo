"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);

  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/categories?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();
        setCategories(data.filter((cat) => cat.count > 0));
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
    <div className="overflow-x-auto whitespace-nowrap pt-4 px-2 md:px-4 py-2 md:py-4">
      <div className="md:flex hidden gap-2 md:gap-4">
        {categories.map((cat) => (
          <Link
            href={`/category/${cat.slug}`}
            key={cat.id}
            className="flex-shrink-0 w-20 flex-1 bg-gray-100 rounded md:rounded-lg p-2 md:p-3 text-center shadow hover:shadow-md transition"
          >
            {cat.image?.src ? (
              <Image
                src={cat.image.src}
                alt={cat.name}
                width={80}
                height={80}
                className="mx-auto mb-2 object-contain h-15"
              />
            ) : (
              <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <p className="text-sm fs-mb-10px font-medium">{cat.name}</p>
          </Link>
        ))}
      </div>

      <div className="md:hidden flex gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            href={`/category/${cat.slug}`}
            key={cat.id}
            className="flex-shrink-0 w-18 bg-gray-100 rounded md:rounded-lg p-2 md:p-3 text-center shadow hover:shadow-md transition"
          >
            {cat.image?.src ? (
              <Image
                src={cat.image.src}
                alt={cat.name}
                width={80}
                height={80}
                className="mx-auto mb-2 object-contain h-15"
              />
            ) : (
              <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <p className="text-sm fs-mb-10px font-medium">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CategorySlider;
