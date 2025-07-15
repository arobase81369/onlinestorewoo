"use client";

import { useEffect, useState } from "react";

const GetAttributes = ({ productid, variantid }) => {
  const [attr, setAttr] = useState([]);
  const [loading, setLoading] = useState(true);

  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    if (!productid || !variantid) return;

    const fetchAttributes = async () => {
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/${productid}/variations/${variantid}?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();

        if (Array.isArray(data.attributes)) {
          setAttr(data.attributes);
        } else {
          setAttr([]);
        }
      } catch (error) {
        console.error("Failed to fetch variation attributes:", error);
        setAttr([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [productid, variantid, ck, cs]);

  if (loading) return <p className="text-sm text-gray-500">Loading attributes...</p>;

  if (attr.length === 0) return null;

  return (
    <div className="text-sm mt-2">
      <div className="mb-1 font-semibold text-gray-600 hidden">Attributes:</div>
      <div className="flex flex-wrap gap-4">
        {attr.map((item, index) => (
          <div key={index} className="text-gray-700">
            <span className="font-medium">{item.name}:</span>{" "}
            <span>{item.option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAttributes;
