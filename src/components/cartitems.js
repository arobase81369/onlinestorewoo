"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

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

  return (
    <div className="bg-gray-200 rounded py-6 px-4" id="cartsection">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>


      <div className="md:hidden fixed w-full py-4 px-6  text-lg text-center bg-gray-700 text-white bottom-0">
      {cartItems.length !== 0 ? (
        <Link href="#cartsection"> <span className="font-bold">{cartItems.length}</span> Cart Items </Link>
      ) : ( <span>No Items in a cart</span>) }
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => {
              const qty = item.quantity || 1;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-f2f2f2 p-2 rounded"
                >
                  <div className="flex items-center gap-4">
                    <Image width={100} height={100}
                      src={item.images?.[0]?.src || "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                    <h2 className="text-lg">{item.name}</h2>
                      <div className="">
                      
                      <p dangerouslySetInnerHTML={{ __html: item.price_html }} />
                     
                      </div>
                      
                    </div>
                  </div>
                  <div>
                  <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleDecrease(item.id, qty)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() => handleIncrease(item.id, qty)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                  <button
                    onClick={() => dispatch(removeFromCart({ id: item.id }))}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold">
              Total: ₹{getTotal().toFixed(2)}
            </h3>
            <Link
              href="/checkout"
              className="inline-block mt-2 bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
