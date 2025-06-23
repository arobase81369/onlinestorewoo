"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Image from "next/image";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [variationsMap, setVariationsMap] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const ck = "ck_b797eaadfd4500e195131813623fb56d9a8cd57b";
  const cs = "cs_64cae3b6d8ef3ff4524a5642d4996be7b7d13837";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(
        `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products?consumer_key=${ck}&consumer_secret=${cs}`
      );
      const data = await res.json();
      console.log(data);
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  const fetchVariations = async (productId) => {
    if (variationsMap[productId]) return; // already fetched

    const res = await fetch(
      `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/${productId}/variations?consumer_key=${ck}&consumer_secret=${cs}`
    );
    const data = await res.json();
    console.log(data);
    setVariationsMap((prev) => ({ ...prev, [productId]: data }));
  };

  const handleVariationChange = (productId, variationId) => {
    const variation = variationsMap[productId]?.find(
      (v) => v.id === parseInt(variationId)
    );
    setSelectedVariations((prev) => ({ ...prev, [productId]: variation }));
  };

  return (
    <div className="pt-0">
      {/* Search Bar */}
      <div className="mb-6 mx-auto hidden">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-lg shadow-sm bg-f2f2f2 px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const variations = variationsMap[product.id] || [];
              const selectedVariation = selectedVariations[product.id];

              return (
                <div
                  key={product.id}
                  className="rounded"
                  onMouseEnter={() =>
                    product.type === "variable" && fetchVariations(product.id)
                  }
                >
                  <Link href={`/product/${product.id}`}>
                    <div>
                      <Image
                        src={product.images[0]?.src}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full object-cover rounded-lg"
                      />
                      <h2 className="mt-2 text-lg font-semibold">
                        {product.name}
                      </h2>
                      <div className="text-gray-500"><span className="text-sm">₹</span> <span className="text-lg font-bold">{product.regular_price}</span></div>
                      <div className="hidden"
                        dangerouslySetInnerHTML={{ __html: product.price_html }}
                      />
                    </div>
                  </Link>

                  {product.type === "variable" && (
  <div className="mt-2">
    {/* Initialize variations if not already fetched */}
    {variations.length > 0 &&
      product.attributes.map((attribute) => (
        <div key={attribute.id} className="mb-2">
          <label className="block mb-1 font-medium">{attribute.name}</label>
          <select
            className="w-full p-2 rounded border"
            onChange={(e) => {
              const selected = e.target.value;
              const prevSelection = selectedVariations[product.id] || {};
              const newSelection = {
                ...prevSelection,
                [attribute.name.toLowerCase()]: selected,
              };
              setSelectedVariations((prev) => ({
                ...prev,
                [product.id]: newSelection,
              }));
            }}
          >
            <option value="">Select {attribute.name}</option>
            {attribute.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

    {/* Match dropdown selection to actual variation */}
    {(() => {
      const selection = selectedVariations[product.id];
      const matched = variations.find((v) =>
        v.attributes.every(
          (attr) =>
            selection?.[attr.name.toLowerCase()] === attr.option
        )
      );
      return (
        <button
          onClick={() => {
            if (matched && !isInCart(matched.id)) {
              dispatch(addToCart({ ...matched, quantity: 1 }));
            }
          }}
          disabled={!matched || isInCart(matched?.id)}
          className={`mt-2 px-4 py-2 rounded-full px-10 ${
            !matched || isInCart(matched?.id)
              ? "bg-gray-600 text-white cursor-not-allowed"
              : "bg-gray-900 text-white"
          }`}
        >
          {!matched
            ? "Select all options"
            : isInCart(matched.id)
            ? "Added"
            : "Add to Cart"}
        </button>
      );
    })()}
  </div>
)}


                  {/* Add to Cart button */}
                  <button
                    onClick={() => {
                      const itemToAdd =
                        product.type === "variable"
                          ? selectedVariation
                          : product;

                      if (
                        itemToAdd &&
                        !isInCart(itemToAdd.id)
                      ) {
                        dispatch(addToCart({ ...itemToAdd, quantity: 1 }));
                      }
                    }}
                    disabled={
                      product.type === "variable"
                        ? !selectedVariation || isInCart(selectedVariation.id)
                        : isInCart(product.id)
                    }
                    className={`mt-2 px-4 py-2 rounded-full px-10 ${
                      (product.type === "variable" &&
                        (!selectedVariation ||
                          isInCart(selectedVariation?.id))) ||
                      (product.type !== "variable" && isInCart(product.id))
                        ? "bg-gray-600 cursor-not-allowed text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {product.type === "variable"
                      ? isInCart(selectedVariation?.id)
                        ? "Added"
                        : "Add Variation to Cart"
                      : isInCart(product.id)
                      ? "Added"
                      : "Add to Cart"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
