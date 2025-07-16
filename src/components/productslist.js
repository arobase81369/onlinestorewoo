"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartOff, StarIcon } from "lucide-react";

export default function ProductsPage({ categorieslug = "", brandslug = "" }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorieslug);
  const [selectedBrand, setSelectedBrand] = useState(brandslug);
  const [priceRange, setPriceRange] = useState([0, 10000]);
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
          fetch(
            `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/categories?consumer_key=${process.env.NEXT_PUBLIC_WC_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_SECRET}`
          ),
        ]);

        const productsData = await productRes.json();
        const categoriesData = await categoryRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData || []);

        // Extract unique brands from products
        const allBrands = productsData.products
          .flatMap((p) => p.brands || [])
          .filter((brand, index, self) => self.findIndex((b) => b.slug === brand.slug) === index);
        setBrands(allBrands);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchCategory = !selectedCategory || item.categories?.some((cat) => cat.slug === selectedCategory);
    const matchBrand = !selectedBrand || item.brands?.some((brand) => brand.slug === selectedBrand);
    const matchPrice = parseFloat(item.price) >= priceRange[0] && parseFloat(item.price) <= priceRange[1];
    return matchCategory && matchBrand && matchPrice;
  });

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
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Sidebar Filters */}
      <aside className="md:col-span-1 space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-semibold mb-2">Categories</h4>
          <button
            onClick={() => setSelectedCategory("")}
            className={`block w-full text-left py-1 px-2 rounded ${
              !selectedCategory ? "bg-gray-200 font-medium" : ""
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block w-full text-left py-1 px-2 rounded ${
                selectedCategory === cat.slug ? "bg-gray-200 font-medium" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Brand Filter */}
        <div>
          <h4 className="font-semibold mb-2">Brands</h4>
          <button
            onClick={() => setSelectedBrand("")}
            className={`block w-full text-left py-1 px-2 rounded ${
              !selectedBrand ? "bg-gray-200 font-medium" : ""
            }`}
          >
            All Brands
          </button>
          {brands.map((brand, i) => (
            <button
              key={i}
              onClick={() => setSelectedBrand(brand.slug)}
              className={`block w-full text-left py-1 px-2 rounded ${
                selectedBrand === brand.slug ? "bg-gray-200 font-medium" : ""
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="flex gap-2 items-center text-sm">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-1/2 border px-2 py-1 rounded"
              min={0}
            />
            <span>to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-1/2 border px-2 py-1 rounded"
              min={priceRange[0]}
            />
          </div>
        </div>
      </aside>

      {/* Product List */}
      <main className="md:col-span-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-60 rounded" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = isWishlisted(product.id);
              const quantity = getCartQty(product.id);
              const isSimple = product.variations.length === 0;

              return (
                <div key={product.id} className="relative rounded bg-gray-100 p-2 group">
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
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </Link>

                  <div className="mt-3 px-1 pb-3">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </h4>
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
        ) : (
          <p className="text-gray-500">No products found for selected filters.</p>
        )}
      </main>
    </div>
  );
}
