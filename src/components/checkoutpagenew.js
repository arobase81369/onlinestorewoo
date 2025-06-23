"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clearCart } from "../store/cartSlice";

export default function CheckoutPagenew() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user); // must include user.token
  console.log("user");
  console.log(user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name,
    email: user?.email,
    address: "12-11-1200",
  });

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createCustomOrder = async () => {
    const raw = JSON.stringify({
      user_id: user?.id || 0,
      products: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      billing: {
        first_name: form.name,
        last_name: "",
        email: form.email,
        phone: "1234567890",
        address_1: form.address,
        city: "City",
        state: "State",
        postcode: "000000",
        country: "IN",
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
      coupon: "",
      shipping_method: {
        method_id: "flat_rate",
        label: "Flat Rate",
        total: 10,
      },
    });

    const res = await fetch(
      "https://arobasedesigns.in/reactwpapi/wp-json/custom/v1/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: raw,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      alert("Please fill all fields");
      return;
    }

    try {
      const order = await createCustomOrder();
      console.log("order-data");
      console.log(order);
      dispatch(clearCart());
      router.push(`/success?link=${encodeURIComponent(order.order_id)}`);
   //   router.push(`/success?link=${encodeURIComponent(order?.order_url || "/")}`);

    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="p-4 bg-f2f2f2 max-w-3xl mx-auto">
      <div className="my-6">
        <Link href="/" className="bg-gray-700 text-white text-sm px-2 py-2 rounded mb-10">Back to List</Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
      <p className="text-sm mb-2">Logged in as: {user?.email}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={form.name}
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder={form.email}
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
        />
        <textarea
          name="address"
          placeholder={form.address}
          value={form.address}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
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
                  <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: item.price_html }} />
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
          className="mt-6 w-full bg-green-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
