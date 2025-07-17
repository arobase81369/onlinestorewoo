"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartOff, StarIcon, XCircleIcon } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const isWishlisted = (id) => wishlistItems.some((item) => item.id === id);
  const getCartQty = (id) => cartItems.find((item) => item.id === id)?.quantity || 0;

  useEffect(() => {
    const fetchData = async () => {
      const ck = process.env.NEXT_PUBLIC_WC_KEY;
      const cs = process.env.NEXT_PUBLIC_WC_SECRET;
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/products"),
        fetch(`https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/products/categories?consumer_key=${ck}&consumer_secret=${cs}`),
        fetch(`https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/brands`)
      ]);
      const productData = await prodRes.json();
      const categoryData = await catRes.json();
      const brandData = await brandRes.json();
      setProducts(productData.products || []);
      setCategories(categoryData);
      setBrands(brandData.brands);
    };

    fetchData();
  }, []);

  const handleCheckbox = (slug, selectedList, setSelectedList) => {
    if (selectedList.includes(slug)) {
      setSelectedList(selectedList.filter((item) => item !== slug));
    } else {
      setSelectedList([...selectedList, slug]);
    }
  };

  const filtered = products
    .filter(
      (p) =>
        (selectedCategories.length === 0 ||
          p.categories?.some((c) => selectedCategories.includes(c.slug))) &&
        (selectedBrands.length === 0 || p.brands?.some((b) => selectedBrands.includes(b.slug))) &&
        parseFloat(p.price) >= priceRange[0] &&
        parseFloat(p.price) <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortOrder === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
      if (sortOrder === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
      return 0;
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

  const handleQtyChange = (id, qty) => {
    if (qty > 0) dispatch(updateQuantity({ id, quantity: qty }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 max-w-7xl mx-auto px-4 gap-6 py-6">
      {/* Sidebar Filters */}
      <div className="md:col-span-1 sidebar-toggle-menu space-y-4 p-3 md:py-0 fixed md:relative bg-white left-0 right-2 z-20">
        <div>
          <div className="flex justify-between">
          <h3 className="font-bold mb-2">Categories</h3>
          <XCircleIcon />
          </div>
         
          {categories.map((cat) => (
            <label key={cat.id} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => handleCheckbox(cat.slug, selectedCategories, setSelectedCategories)}
              />
              {cat.name}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">Brands</h3>
          {brands.map((brand) => (
            <label key={brand.id} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => handleCheckbox(brand.slug, selectedBrands, setSelectedBrands)}
              />
              {brand.name}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">Price Range</h3>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
          <div className="text-sm">Up to ₹{priceRange[1]}</div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Sort</h3>
          <select
            className="w-full border px-2 py-1 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="md:col-span-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{selectedCategories[0] || "All Products"}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.slice(0, visibleCount).map((product) => {
            const inWishlist = isWishlisted(product.id);
            const quantity = getCartQty(product.id);
            const isSimple = product.variations.length === 0;

            return (
              <div key={product.id} className="relative rounded bg-f2f2f2 p-2">
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

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <div className="text-gray-600 text-xs">
                    {product.categories?.[0]?.name || ""}
                  </div>
                  <div className="text-base font-bold">
                    ₹{product.sale_price || product.price}
                    {product.sale_price && (
                      <span className="ml-2 text-sm line-through text-gray-400">
                        ₹{product.regular_price}
                      </span>
                    )}
                  </div>

                  {isSimple ? (
                    quantity > 0 ? (
                      <div className="flex items-center mt-2 gap-2">
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
                        className="mt-2 w-full py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-2 block w-full py-2 bg-blue-600 text-white text-center rounded text-sm hover:bg-blue-700"
                    >
                      View Product
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < filtered.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
