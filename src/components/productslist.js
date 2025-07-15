"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartOff, StarIcon } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = (id) => wishlistItems.some((item) => item.id === id);
  const getCartQty = (id) => cartItems.find((item) => item.id === id)?.quantity || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch("https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/products"),
          fetch("https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/categories?consumer_key=" + process.env.NEXT_PUBLIC_WC_KEY + "&consumer_secret=" + process.env.NEXT_PUBLIC_WC_SECRET),
        ]);

        const productsData = await productRes.json();
        const categoriesData = await categoryRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((item) => item.categories?.some((cat) => cat.slug === selectedCategory))
    : products;

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: 1,
      })
    );
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty > 0) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shop Products</h1>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded border text-sm ${
            !selectedCategory ? "bg-gray-900 text-white" : "bg-white border-gray-300"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded border text-sm ${
              selectedCategory === cat.slug ? "bg-gray-900 text-white" : "bg-white border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-60 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inWishlist = isWishlisted(product.id);
            const quantity = getCartQty(product.id);
            const isSimple = product.variations.length === 0;

            return (
              <div key={product.id} className="relative border p-3 rounded bg-white shadow hover:shadow-lg">
                <button
                  onClick={() =>
                    inWishlist
                      ? dispatch(removeFromWishlist({ id: product.id }))
                      : dispatch(addToWishlist(product))
                  }
                  className="absolute top-2 right-2 z-10"
                >
                  {inWishlist ? (
                    <HeartOff className="text-red-500" size={18} />
                  ) : (
                    <Heart className="text-gray-400" size={18} />
                  )}
                </button>

                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded"
                  />
                </Link>

                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 truncate">{product.name}</h4>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{product.categories?.[0]?.name}</span>
                    <span className="flex items-center gap-1">
                      <StarIcon size={14} /> 4.5
                    </span>
                  </div>

                  <div className="text-lg font-bold mt-2">
                    ₹{product.sale_price || product.price}
                    {product.sale_price && (
                      <span className="ml-2 text-sm line-through text-gray-400">
                        ₹{product.regular_price}
                      </span>
                    )}
                  </div>

                  {/* Cart Actions */}
                  {isSimple ? (
                    quantity > 0 ? (
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => handleQtyChange(product.id, quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => handleQtyChange(product.id, quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="block mt-3 w-full bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-700"
                      >
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <Link
                      href={`/product/${product.slug}`}
                      className="block mt-3 w-full bg-blue-600 text-white py-2 rounded text-sm text-center hover:bg-blue-700"
                    >
                      View Product
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
