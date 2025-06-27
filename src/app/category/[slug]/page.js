"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductList from "@/components/productslist";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
  <div>
    <ProductList categories={slug} />
    </div>
  );
};

export default CategoryProducts;
