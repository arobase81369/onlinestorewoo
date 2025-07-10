"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import { StarIcon } from "lucide-react";

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
        console.log(productData);
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
      variationid: selectedVariation?.id,
      productid: product.id
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
    <div className="">
        <div className="grid md:grid-cols-5 gap-3 sticky top-20">
          <div className="col-span-1 hidden md:block"><Image
          src={selectedVariation?.image || product.image}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-contain rounded-lg"
        /></div>
          <div className="col-span-4"><Image
          src={selectedVariation?.image || product.image}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-contain rounded-lg"
        /></div>
        </div>
        </div>
        <div>

        <div className="flex justify-between">
                  <h4 className=" font-bold mb-1">{product.categories[0].name}</h4>
                  <div className="flex align-items-center gap-2"><StarIcon className="text-sm" width="15px" /> <span className="font-bold">4.5</span></div>
                </div>

          <h1 className="text-3xl font-medium mb-2">{product.name}</h1>
  

          <div className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            <span className="text-sm">₹</span>{selectedVariation?.price || product.sale_price || product.price}
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
                  <label className="block mb-1 capitalize font-semibold">
                    {attr.name.replace("pa_", "")}
                  </label>
                  <div className="mb-4">
  <label className="block mb-2 font-medium capitalize text-gray-700 hidden">
    {attr.name.replace("pa_", "")}
  </label>
  <div className="flex flex-wrap gap-2">
    {attr.options.map((opt) => {
      const isSelected = selectedAttributes[attr.name] === opt;
      return (
        <label
          key={opt}
          className={`cursor-pointer px-4 py-2 rounded border text-sm font-medium ${
            isSelected
              ? "bg-gray-900 text-white border-gray-600"
              : "bg-f2f2f2 text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="radio"
            name={attr.name}
            value={opt}
            checked={isSelected}
            onChange={(e) =>
              setSelectedAttributes({
                ...selectedAttributes,
                [attr.name]: e.target.value,
              })
            }
            className="hidden"
          />
          {opt}
        </label>
      );
    })}
  </div>
</div>

                </div>
              ))}
            </div>
          )}


          <div className="mt-3 font-semibold"><label>Quantity</label></div>

          {cartQty > 0 ? (
            <div className="flex items-center gap-3 mt-2">
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
            <div className="flex gap-6">
              <div className="mt-2">
                <div className="flex items-center overflow-hidden w-max">
  <button
    onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
    type="button"
  >
    −
  </button>
  <input
    type="number"
    value={selectedQty}
    onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
    className="w-16 text-center outline-none"
    min={1}
  />
  <button
    onClick={() => setSelectedQty((prev) => prev + 1)}
    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
    type="button"
  >
    +
  </button>
</div>

              </div>
              <button
                onClick={handleAddToCart}
                className="md:mt-4 bg-gray-900 hover:bg-gray-700 text-white px-6 py-2 rounded"
                disabled={attributes.length > 0 && !selectedVariation}
              >
                Add to Cart
              </button>
              </div>
            </>
          )}

<div className="mt-6">
<div className="mt-3 mb-2 font-semibold"><label>Product Description</label></div>
<div
            className="text-gray-700 mb-4 text-sm"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        </div>


        <div className="mt-6">
<div className="mt-3 mb-2 font-semibold"><label>Delivery Option</label></div>
<div className="mb-4 text-sm">
    <input type="number" className="bg-white py-3 px-6 border rounded-lg" placeholder="PINCODE"/>
<button className="bg-gray-600 text-white ml-2 py-3 px-6 border rounded-lg">Check</button>
        </div>
</div>

<div className="mt-6">
<div className="mt-3 mb-2 flex gap-6 font-semibold align-items-center">
    <label>Review & Rating</label>
    <div className="flex text-xl align-items-center gap-2"><span className="bg-gray-200 rounded-lg px-2 py-2 flex gap-2"><StarIcon className="" width="20px" /> <span className="font-bold">4.5</span> </span><span className="text-gray text-sm">1200 Rating & Reviews</span></div>
    </div>
<div className="mb-4 text-sm">
    <div>
    <div className="flex text-sm align-items-center gap-2"><span className="bg-gray-200 rounded-lg px-2 py-2 flex gap-2 align-items-center"><StarIcon className="" width="15px" /> <span className="font-bold">4.5</span> </span></div>
    <div className="mt-2">
        <p>I love the colour. Length is fine as I m tall. Only drawback is the cloth is synthetic and can not be worn in summer.</p>

        <div className="my-4"><span className="pr-10 font-semibold">NAMRATA SINGH</span> 2 months ago</div>
        </div>
    </div>
        </div>
</div>

</div>


         


      </div>
    </div>
  );
}
