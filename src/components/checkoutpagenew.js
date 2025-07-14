"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clearCart } from "../store/cartSlice";

export default function CheckoutPagenew() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const checkout = useSelector((state) => state.checkout);
  const dispatch = useDispatch();
  const router = useRouter();


  console.log(checkout);
  const { shippingAddress: shipping, coupon, taxAmount, pickupOption } = checkout;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
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

  const createCustomOrder = async () => {
    const taxRate = parseFloat(taxAmount || 0);

    const lineItems = cartItems.map((item) => {
      const subtotal = item.price * item.quantity;
      const itemTax = (subtotal * taxRate) / 100;
      return {
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: subtotal.toFixed(2),
        total_tax: itemTax.toFixed(2),
        taxes: [
          {
            id: 1, // Change if different tax ID
            total: itemTax.toFixed(2),
          },
        ],
      };
    });

    const totalTax = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.total_tax),
      0
    );

    const raw = JSON.stringify({
      user_id: user?.id || 0,
      coupon: coupon?.code || "",
      products: lineItems,
      billing: {
        first_name: shipping?.fullName || form.name,
        last_name: "",
        email: shipping?.email || form.email,
        phone: shipping?.phone || "1234567890",
        address_1: shipping?.address || form.address,
        city: shipping?.city || "City",
        state: shipping?.state || "TS",
        postcode: shipping?.pincode || "500001",
        country: shipping?.country || "IN",
      },
      shipping: pickupOption
        ? {}
        : {
            first_name: shipping?.fullName || form.name,
            last_name: "",
            address_1: shipping?.address || form.address,
            city: shipping?.city || "City",
            state: shipping?.state || "TS",
            postcode: shipping?.pincode || "500001",
            country: shipping?.country || "IN",
          },
      tax_lines: [
        {
          rate_code: "GST IN 18%",
          rate_id: 1,
          label: "GST",
          compound: false,
          tax_total: totalTax.toFixed(2),
          shipping_tax_total: "0",
        },
      ],
      shipping_method: {
        method_id: "flat_rate",
        label: pickupOption ? "Pickup" : "Flat Rate",
        total: pickupOption ? 0 : 50,
      },
    });


/*
    const newrequest = {
      'user_id': "9",
      'coupon': "",
      products: [{
        product_id: "82",
        quantity:2,
        price: "",
        total: "",
        total_tax: ""
      }],
      billing: {
        first_name: "first name",
        last_name: "",
        email: "",
        phone: "1234567890",
        address_1: "",
        city: "City",
        state: "TS",
        postcode: "500001",
        country: "IN",
      },
      shipping: {
            first_name: "fullName",
            last_name: "",
            address_1: "address",
            city: "City",
            state: "TS",
            postcode: "500001",
            country: "IN",
          },
      tax_lines: [
        {
          rate_code: "GST IN 18%",
          rate_id: 1,
          label: "GST",
          compound: "",
          tax_total: 0,
          shipping_tax_total: "0",
        },
      ],
      shipping_method: {
        method_id: "flat_rate",
        label: "Flat Rate",
        total: pickupOption ? 0 : 50,
      },
    }

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
*/

    const res = await fetch(
      "https://arobasedesigns.in/reactwpapi/wp-json/jwt-auth/v1/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: raw,
      }
    );

    console.log("create order response");
    console.log(raw);

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
/*
    if (!form.name || !form.email || (!form.address && !shipping?.address)) {
      alert("Please fill all fields");
      return;
    }
      */

    try {
      const order = await createCustomOrder();
      dispatch(clearCart());
      router.push(`/success?link=${encodeURIComponent(order.order_id)}`);
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="py-9 px-4 bg-f2f2f2 max-w-3xl mx-auto my-4">

      <div className="flex justify-between">
      <h1 className="text-xl font-bold mb-4">Checkout Payment</h1>
      <div className="">
        <Link href="/cart" className="bg-gray-700 text-white text-sm px-2 py-2 rounded mb-10">
          Back to cart
        </Link>
      </div>
      </div>
   

      
    
      <p className="text-sm mb-2 hidden">Logged in as: {user?.email}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
        />
        <textarea
          name="address"
          placeholder="Billing/Shipping Address"
          value={form.address}
          onChange={handleChange}
          className="w-full bg-gray-200 px-4 py-2 rounded"
        />
</div>
        <h3 className="text font-semibold mt-4 mb-2">Order Summary</h3>
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="bg-white flex items-center justify-between p-2 rounded"
            >
              <div className="flex items-center gap-4">
                <Image src={item.image} width={60} height={60} alt={item.name} className="rounded" />
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

        {/* Price Breakdown */}
        <h3 className="text text-left mb-2 font-semibold mt-4">Cart Totals</h3>
<div className="px-6 py-4 bg-white rounded">
<div className="space-y-1 text-right text-sm">
  <div className="flex justify-between border-b border-gray-300 py-2">
    <span>Subtotal:</span>
    <span>₹{getTotal().toFixed(2)}</span>
  </div>
  {checkout?.coupon?.discount > 0 && (
    <div className="flex justify-between text-green-600 font-medium border-b border-gray-300 py-2">
      <span>Coupon ({checkout?.coupon?.code})</span>
      <span>- ₹{checkout?.coupon?.discount.toFixed(2)}</span>
    </div>
  )}

  {!checkout.pickupOption && (
    <div className="flex justify-between border-b border-gray-300 py-2">
      <span>Shipping</span>
      <span>₹{checkout?.shippingAmount?.toFixed(2) || 50}</span>
    </div>
  )}

  {checkout?.taxAmount > 0 && (
    <div className="flex justify-between border-b border-gray-300 py-2">
      <span>Tax</span>
      <span>₹{checkout?.taxAmount.toFixed(2)}</span>
    </div>
  )}

  <div className="flex justify-between font-bold text-base py-4">
    <span>Grand Total</span>
    <span>
      ₹
      {(
        getTotal() -
        (checkout?.coupon?.discount || 0) +
        (checkout?.pickupOption ? 0 : checkout?.shippingAmount || 50) +
        (checkout?.taxAmount || 0)
      ).toFixed(2)}
    </span>
  </div>
</div>

        <button
          type="submit"
          className="mt-6 w-full bg-gray-900 hover:bg-gray-700 text-white text-lg px-4 py-2 rounded"
        >
          Place Order
        </button>
        </div>
      </form>
    </div>
  );
}
