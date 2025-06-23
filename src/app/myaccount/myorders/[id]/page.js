"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/orders/${id}?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, cs, ck]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading Order...</p>
      </div>
    );
  }

  if (!order || order?.code === "woocommerce_rest_shop_order_invalid_id") {
    return <p className="text-center text-red-600 py-10">Order not found.</p>;
  }

  const getStatusStep = (status) => {
    const steps = ["pending", "processing", "on-hold", "completed"];
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order #{order.number}</h1>
        <div className="space-x-2">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Print / PDF
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className={`h-2.5 rounded-full bg-green-500 transition-all duration-300`}
          style={{ width: `${(getStatusStep(order.status) + 1) * 25}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Status: <span className="capitalize">{order.status}</span> | Date: {new Date(order.date_created).toLocaleString()}
      </p>

      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">Billing Info</h2>
            <p>{order.billing.first_name} {order.billing.last_name}</p>
            <p>{order.billing.address_1}</p>
            <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
            <p>{order.billing.country}</p>
            <p>Email: {order.billing.email}</p>
            <p>Phone: {order.billing.phone}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Shipping Info</h2>
            <p>{order.shipping.first_name} {order.shipping.last_name}</p>
            <p>{order.shipping.address_1}</p>
            <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
            <p>{order.shipping.country}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Ordered Items</h2>
        <div className="space-y-4">
          {order.line_items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-4">
                {item.image?.src && (
                  <Image
                    src={item.image.src}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₹{item.total}</p>
            </div>
          ))}
        </div>

        {order.shipping_lines.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
            {order.shipping_lines.map((line) => (
              <p key={line.id} className="text-gray-700">
                {line.method_title} — ₹{line.total}
              </p>
            ))}
          </div>
        )}

        {order.coupon_lines.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Coupons Applied</h3>
            {order.coupon_lines.map((coupon) => (
              <p key={coupon.id} className="text-green-700">
                {coupon.code.toUpperCase()} — -₹{coupon.discount}
              </p>
            ))}
          </div>
        )}

        <div className="mt-8 text-right">
          <p className="text-gray-800">Shipping: ₹{order.shipping_total}</p>
          <p className="text-gray-800">
            Discount: -₹{order.discount_total || "0"}
          </p>
          <p className="text-lg font-bold mt-2">Grand Total: ₹{order.total}</p>
        </div>
      </div>
    </div>
  );
}
