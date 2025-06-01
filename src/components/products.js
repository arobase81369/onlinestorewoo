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
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const ck = "ck_b797eaadfd4500e195131813623fb56d9a8cd57b";
    const cs = "cs_64cae3b6d8ef3ff4524a5642d4996be7b7d13837";
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(
        `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products?consumer_key=${ck}&consumer_secret=${cs}`
      );
      const data = await res.json();
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

  return (
    <div className="p-4 pt-0">
      {/* Search Bar */}
      <div className="mb-6 mx-auto">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-f2f2f2 p-4 hover:shadow rounded">
                <Link href={`/product/${product.id}`}>
                  <div>
                    <Image src={product.images[0]?.src}
                      alt={product.name} width={300} height={300}
                      className="w-full h-48 object-cover"
                    />
                    <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.price_html }} />
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (!isInCart(product.id)) {
                      dispatch(addToCart({ ...product, quantity: 1 }));
                    }
                  }}
                  disabled={isInCart(product.id)}
                  className={`mt-2 px-4 py-2 rounded w-full ${
                    isInCart(product.id)
                      ? "bg-gray-600 cursor-not-allowed text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {isInCart(product.id) ? "Added" : "Add to Cart"}
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
