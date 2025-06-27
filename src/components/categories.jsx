"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/categories?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading categories...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 hidden">Product Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories
          .filter((cat) => cat.count > 0)
          .map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block bg-white p-4 shadow hover:shadow-md rounded text-center"
            >
              {category.image?.src && (
                <Image
                  src={category.image.src}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="mx-auto object-contain h-40 w-auto"
                />
              )}
              <h2 className="mt-2 font-semibold">{category.name}</h2>
              <p className="text-sm text-gray-600">{category.count} Products</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
