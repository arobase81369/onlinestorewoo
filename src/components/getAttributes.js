"use client";

import { useEffect, useState } from "react";

const GetAttributes = ({productid, variantid}) => {
  const [attr, setAttr] = useState([]);
  const [loading, setLoading] = useState(true);

  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi//wp-json/wc/v3/products/${productid}/variations/${variantid}?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();
        setAttr(data.attributes);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p className="">Loading...</p>;
  }

  return (
    <div className="text-sm">
        <div><span className="fs-12">Attributes</span></div>
        <div className="flex gap-2">
        {attr.length > 0? (
            attr.map((item, index) => (
                <div key={index}><span className=""><span className="font-semibold">{item.name}:</span> {item.option}</span></div>
            )) ) : (<div></div>)
        }
</div>
        </div>

        );

    }

export default GetAttributes;
