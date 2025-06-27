// ✅ CartPage.jsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import { setPickupOption, setShippingAddress } from "@/store/checkoutSlice";
import { DeleteIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [pickup, setPickup] = useState(false);
  const [address, setAddress] = useState("");

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handlePickupChange = (e) => {
    const val = e.target.checked;
    setPickup(val);
    dispatch(setPickupOption(val));
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    dispatch(setShippingAddress(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left: Cart Items */}
      <div className="md:col-span-2 bg-white p-1 md:p-4 rounded">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => {
              const qty = item.quantity || 1;
              return (
                <li key={item.id} className="flex justify-between flex-wrap-mb text-left cart-product-listing align-items-center gap-4 bg-gray-100 p-2 rounded">
                  <div className="flex gap-6 cart-product-col-1">
                    <Image width={100} height={100} src={item.image || "/placeholder.png"} alt={item.name} className="w-16 h-16 object-cover" />
                    <div className="cart-item-content">
                      <h2 className="text-lg font-medium">{item.name}</h2>
                      <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: item.price_html }} />
                    </div>
                    </div>
                 <div className="align-items-center justify-between cart-product-col-1 flex gap-6">
                 <div className="md:hidden cart-item-button">
                  <button onClick={() => dispatch(removeFromCart({ id: item.id }))} className="text-red-500 hover:underline text-sm"><DeleteIcon /></button>
                  </div>
                    <div className="cart-item-quantity">
                    <div className="flex align-items-center gap-2 mt-1">
                        <button onClick={() => handleDecrease(item.id, qty)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                        <span>{qty}</span>
                        <button onClick={() => handleIncrease(item.id, qty)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                      </div>
                  </div>
                  <div className="cart-item-price">
                    <p className="font-semibold">₹{(item.price * qty).toFixed(2)}</p>
                    
                  </div>
                  <div className="hidden md:block cart-item-button">
                  <button onClick={() => dispatch(removeFromCart({ id: item.id }))} className="text-red-500 hover:underline text-sm"><DeleteIcon /></button>
                  </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Right: Cart Summary */}
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Cart Totals</h2>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={pickup} onChange={handlePickupChange} />
          Pickup from local store
        </label>

        {!pickup && (
          <textarea
            value={address}
            onChange={handleAddressChange}
            placeholder="Shipping Address"
            className="w-full mt-4 p-2 border rounded"
          />
        )}

        <div className="mt-4 flex justify-between"><span>Subtotal:</span><span> ₹{getTotal().toFixed(2)}</span></div>
        <div className=" flex justify-between"><span>Shipping:</span><span> {pickup ? "Free (Pickup)" : "₹50.00"}</span></div>
        <div className="font-semibold text-lg mt-2  flex justify-between"><span>
          Total:</span><span> ₹{(getTotal() + (pickup ? 0 : 50)).toFixed(2)}
        </span></div>

        <Link
          href="/checkout"
          className={`block text-center w-full mt-4 px-4 py-2 rounded ${
            !pickup && !address ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
