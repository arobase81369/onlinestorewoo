"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import { setPickupOption, setShippingAddress } from "@/store/checkoutSlice";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import GetAttributes from "./getAttributes";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const checkout = useSelector((state) => state.checkout);
  const dispatch = useDispatch();
  console.log("cart items");
  console.log(cartItems);

  const [pickup, setPickup] = useState(checkout?.pickupOption || false);
  const [address, setAddress] = useState(checkout?.shippingAddress || "");

  useEffect(() => {
    dispatch(setPickupOption(pickup));
    if (!pickup) {
      dispatch(setShippingAddress(address));
    }
  }, [pickup, address]);

  const handleQtyChange = (id, qty) => {
    if (qty > 0) dispatch(updateQuantity({ id, quantity: qty }));
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 grid md:grid-cols-3 gap-6">
      {/* 🛒 Cart Items */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="\ flex align-items-center justify-items-center gap-4 p-4 bg-f2f2f2 rounded"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover cart-product-image"
                />
                <div className="cart-product-content">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {(item.productid && item.variationid)? (<><GetAttributes productid={item.productid} variantid={item.variationid} /></>) : (<></>)}
                  

                  {/* 🧩 Show variations if present */}
                  {item.attributes && (
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <div key={key}>
                          <span className="capitalize">{key.replace("pa_", "")}</span>: {val}
                        </div>
                      ))}
                    </div>
                  )}

                

            
                </div>
 
 <div className="cart-product-qty flex justify-center">
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  </div>

                <div className="cart-product-price">
                  <p className="text-right font-semibold text-lg text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                    onClick={() => dispatch(removeFromCart({ id: item.id }))}
                    className="flex justify-center cart-product-remove text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📦 Summary */}
      <div className="bg-f2f2f2 p-6 rounded">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        <label className="flex items-center mb-3 gap-2 text-sm">
          <input
            type="checkbox"
            checked={pickup}
            onChange={(e) => setPickup(e.target.checked)}
          />
          Pickup from local store
        </label>

        {!pickup && (
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Enter shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{pickup ? "Free" : "₹50"}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>
              ₹{(getTotal() + (pickup ? 0 : 50)).toFixed(2)}
            </span>
          </div>
        </div>

        <Link
          href="/checkout"
          className={`block text-center mt-5 py-2 rounded font-medium ${
            pickup || address
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
