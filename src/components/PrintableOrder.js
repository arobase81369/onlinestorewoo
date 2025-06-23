// components/PrintableOrder.js
import React from "react";

const PrintableOrder = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Date:</strong> {order.date_created}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h3 className="mt-4 font-semibold">Products:</h3>
      <ul>
        {order.line_items?.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} – ₹{item.total}
          </li>
        ))}
      </ul>

      <h4 className="mt-4 font-semibold">Billing</h4>
      <p>{order.billing?.first_name} {order.billing?.last_name}</p>
      <p>{order.billing?.address_1}</p>
      <p>{order.billing?.city}, {order.billing?.postcode}</p>

      <h4 className="mt-4 font-semibold">Shipping</h4>
      <p>{order.shipping?.first_name} {order.shipping?.last_name}</p>
      <p>{order.shipping?.address_1}</p>
      <p>{order.shipping?.city}, {order.shipping?.postcode}</p>
    </div>
  );
});

export default PrintableOrder;
