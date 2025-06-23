"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";

export default function MyOrderscomp() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
console.log("user");
console.log(user);
  useEffect(() => {

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
     //   const res = await fetch(`/api/orders?customerId=${user.id}`);
        const data = await response.data;
        console.log(data);
        const filterdata = data.filter((item) => item.customer_id == user.id);
        setOrders(filterdata);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading ? (
        <p>Loading new orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded bg-white">
              <p className="font-semibold">Order #{order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total: {order.total} {order.currency}</p>
              <p>Date: {new Date(order.date_created).toLocaleDateString()}</p>
              <Link href={`/myaccount/myorders/${order.id}`}>View Orders</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
