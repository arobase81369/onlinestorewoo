// File: /app/api/orders/route.js (App Router in Next.js)

import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get(3);

  if (!customerId) {
    return new Response(JSON.stringify({ error: "Customer ID is required" }), {
      status: 400,
    });
  }

  try {
    const ck = process.env.NEXT_PUBLIC_WC_KEY;
    const cs = process.env.NEXT_PUBLIC_WC_SECRET;

    const response = await axios.get(
      `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/orders?customerid=3`,
      {
        auth: {
          username: ck,
          password: cs,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    console.error("Order fetch failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch orders" }),
      { status: 500 }
    );
  }
}
