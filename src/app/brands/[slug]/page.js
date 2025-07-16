"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductList from "@/components/productslist";
import Breadcrumbs from "@/components/Breadcrumbs";

const BrandDetailpage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
  <div>
      <div className="max-w-7xl mx-auto px-3 pt-4">
            <Breadcrumbs />
            </div>
    <ProductList brandslug={slug} />
    </div>
  );
};

export default BrandDetailpage;
