"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { addToCart, updateQuantity } from "@/store/cartSlice";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const getCartItem = (id) => cartItems.find((item) => item.id === id);
  const getCartQty = (id) => getCartItem(id)?.quantity || 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/products`);
        const data = await res.json();
        const productData = data.products.find((item) => item.slug === slug);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.variations?.length && Object.keys(selectedAttributes).length > 0) {
      const matched = product.variations.find((variation) => {
        return Object.entries(variation.attributes).every(
          ([key, value]) => selectedAttributes[key] === value
        );
      });
      setSelectedVariation(matched || null);
    }
  }, [selectedAttributes, product]);

  const formatVariations = () => {
    const attributesMap = {};
    product.variations.forEach((variant) => {
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

  const handleAddToCart = () => {
    const item = {
      id: selectedVariation?.id || product.id,
      name: product.name,
      price: parseFloat(selectedVariation?.price || product.sale_price || product.price),
      image: selectedVariation?.image || product.image,
      quantity: selectedQty,
    };
    dispatch(addToCart(item));
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty > 0) dispatch(updateQuantity({ id, quantity: newQty }));
  };

  if (loading || !product) return <div className="p-10 text-center">Loading...</div>;

  const attributes = product.variations.length > 0 ? formatVariations() : [];
  const variationId = selectedVariation?.id;
  const cartQty = getCartQty(variationId || product.id);
  const cartItem = getCartItem(variationId || product.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Image
          src={selectedVariation?.image || product.image}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div
            className="text-gray-700 mb-4 text-sm"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />

          <div className="text-xl font-semibold text-blue-600 mb-4">
            ₹{selectedVariation?.price || product.sale_price || product.price}
            {product.sale_price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.regular_price}
              </span>
            )}
          </div>

          {attributes.length > 0 && (
            <div className="mb-4 space-y-2">
              {attributes.map((attr) => (
                <div key={attr.name}>
                  <label className="block mb-1 capitalize font-medium">
                    {attr.name.replace("pa_", "")}
                  </label>
                  <select
                    value={selectedAttributes[attr.name] || ""}
                    onChange={(e) =>
                      setSelectedAttributes({ ...selectedAttributes, [attr.name]: e.target.value })
                    }
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="">Select {attr.name.replace("pa_", "")}</option>
                    {attr.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {cartQty > 0 ? (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleQtyChange(cartItem.id, cartQty - 1)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                −
              </button>
              <span>{cartQty}</span>
              <button
                onClick={() => handleQtyChange(cartItem.id, cartQty + 1)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border rounded"
                  min={1}
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                disabled={attributes.length > 0 && !selectedVariation}
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
