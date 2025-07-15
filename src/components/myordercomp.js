"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";

export default function MyOrderscomp() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const ck = process.env.NEXT_PUBLIC_WC_KEY;
        const cs = process.env.NEXT_PUBLIC_WC_SECRET;

        const response = await axios.get(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/orders`,
          {
            auth: {
              username: ck,
              password: cs,
            },
          }
        );

        const allOrders = response.data;
        const customerOrders = allOrders.filter(
          (order) => order.customer_id == user.id
        );

        setOrders(customerOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">🧾 My Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-4 rounded bg-f2f2f2"
            >
              <div className="flex justify-between items-center">
                <div>
                <div className="font-semibold text-gray-800">
                  Order #{order.id}
                </div>
                <div className="text-sm text-gray-600">
                Total:{" "}
                <span className="font-semibold">
                  {order.currency} {parseFloat(order.total).toFixed(2)}
                </span>
              </div>
                </div>
                
                <div>
                <span className="text-sm text-gray-500">
                  {new Date(order.date_created).toLocaleDateString()}
                </span>
                <p className="text-sm text-gray-600">
                Status:{" "}
                <span className="capitalize font-medium">{order.status}</span>
              </p>
                </div>

                <div>
                <Link
                href={`/myaccount/myorders/${order.id}`}
                className="bg-gray-600 hover:bg-gray-900 text-white py-2 px-3 rounded-full text-sm mt-2 inline-block"
              >
                View Details
              </Link>
                </div>
                
              </div>

           


            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
