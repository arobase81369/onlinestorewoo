"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createWooOrder = async () => {
    const auth = {
      username: process.env.NEXT_PUBLIC_WC_KEY,
      password: process.env.NEXT_PUBLIC_WC_SECRET,
    };

    const lineItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      billing: {
        first_name: form.name,
        last_name: "",
        address_1: form.address,
        city: "City",
        state: "State",
        postcode: "000000",
        country: "IN",
        email: form.email,
        phone: "0000000000",
      },
      shipping: {
        first_name: form.name,
        last_name: "",
        address_1: form.address,
        city: "City",
        state: "State",
        postcode: "000000",
        country: "IN",
      },
      line_items: lineItems,
    };

    const res = await axios.post(
      "https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/orders",
      orderData,
      { auth }
    );
    const orderlink = `https://arobasedesigns.in/reactwpapi/checkout/order-received/${res.data.number}/?key=${res.data.order_key}`;
    console.log(orderlink);
    return orderlink;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      alert("Please fill all fields");
      return;
    }

    try {
   //   await createWooOrder();
      const orderLink = await createWooOrder();
      router.push(`/success?link=${encodeURIComponent(orderLink)}`);
        dispatch(clearCart());
        
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="p-4 bg-f2f2f2 max-w-3xl mx-auto">
        <div className="my-6">
            <Link href="/" className="bg-gray-700 text-white text-sm px-2 py-2 rounded mb-10">Back to List</Link>
        </div>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-200 py-4 px-4 text-lg px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-200 py-4 px-4 text-lg px-3 py-2 rounded"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full bg-gray-200 py-4 px-4 text-lg px-3 py-2 rounded"
        />

        <h3 className="text-lg font-semibold mt-6">Order Summary</h3>
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="bg-white flex items-center justify-between p-2 rounded"
            >
              <div className="flex items-center gap-4">
                <Image width={100} height={100}
                  src={item.images[0]?.src}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h2 className="text-md font-medium">{item.name}</h2>
                  <p
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: item.price_html }}
                  />
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-right text-sm">
                ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <p className="font-semibold text-right mt-4">
          Total: ₹{getTotal().toFixed(2)}
        </p>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 hover:bg-gray-700 pointer text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
