"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";

export default function ProductList({ categories}) {
  const [products, setProducts] = useState([]);
  const [paramcat, setParamcat] = useState(categories);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/products");
        const data = await res.json();
        let allProducts = data.products || [];
  
        if (paramcat !== undefined) {
          const filtered = allProducts.filter((item) =>
            item.categories?.some((cat) => cat.slug?.toLowerCase() === paramcat.toLowerCase())
          );
          setProducts(filtered);
        } else {
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [paramcat]);
  
  

  const handleAddToCart = (product) => {
    const item = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
    };
    dispatch(addToCart(item));
  };

  const handleQtyChange = (productId, newQty) => {
    if (newQty > 0) {
      dispatch(updateQuantity({ id: productId, quantity: newQty }));
    }
  };

  const formatVariations = (variations) => {
    const attributesMap = {};
    variations.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([attr, value]) => {
        if (!attributesMap[attr]) attributesMap[attr] = new Set();
        attributesMap[attr].add(value);
      });
    });
    return Object.entries(attributesMap).map(([key, values]) => ({
      name: key,
      options: Array.from(values),
    }));
  };

  const getCartQty = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item?.quantity || 0;
  };

  if (loading) return <div className="text-center py-12">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shop All Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => {
          const isSimple = product.variations.length === 0;
          const attributes = !isSimple ? formatVariations(product.variations) : [];
          const qty = getCartQty(product.id);

          return (
            <div key={product.id} className="bg-white overflow-hidden transition">
              <Link href={`/product/${product.slug}`}>
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-20 left-0"><span className="bg-light-danger text-danger font-bold px-4 py-2">10% Off</span></div>
                </div>
                
              </Link>
              

              <div className="py-4 px-2">
                <div className="flex justify-between">
                  <h4 className="text-sm font-semibold mb-1">{product.categories[0].name}</h4>
                  <div className="flex text-sm align-items-center gap-2"><StarIcon className="text-sm" width="15px" /> <span className="font-bold">4.5</span></div>
                </div>
                
                <h3 className="text-gray-600 mb-2">{product.name}</h3>
                <div
                  className="text-sm text-gray-600 mb-2 hidden"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />

                <div className="text-base font-bold text-gray-900">
                  {product.sale_price ? (
                    <>
                      ₹{product.sale_price}{" "}
                      <span className="line-through text-gray-400 font-medium text-sm">₹{product.regular_price}</span>
                    </>
                  ) : (
                    <>₹{product.price}</>
                  )}
                </div>

                {/* Show attributes if product has variations */}
                {attributes.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700 hidden">
                    {attributes.map((attr) => (
                      <div key={attr.name}>
                        <span className="font-medium capitalize">{attr.name.replace("pa_", "")}:</span>{" "}
                        {attr.options.map((opt, i) => (
                          <span key={i} className="inline-block px-1">{opt}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                {isSimple ? (
                  qty > 0 ? (
                    <div className="flex items-center mt-4">
                      <button
                        onClick={() => handleQtyChange(product.id, qty - 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-400"
                      >
                        −
                      </button>
                      <span className="px-3">{qty}</span>
                      <button
                        onClick={() => handleQtyChange(product.id, qty + 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-6 mt-4 bg-gray-900 hover:bg-gray-700 text-white py-2 rounded"
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <Link
                    href={`/product/${product.slug}`}
                    className="block mt-4 text-center bg-gray-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    View Product
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
