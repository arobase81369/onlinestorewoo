// lib/wooHelpers.js
import axios from "axios";

export async function fetchCustomerIdByEmail(email) {
  const ck = process.env.NEXT_PUBLIC_WC_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_SECRET;

  const res = await axios.get(
    `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/customers`,
    {
      auth: {
        username: ck,
        password: cs,
      },
    }
  );

  const match = res.data.find((customer) => customer.email === email);
  localStorage.setItem("userid", match?.id);
  return match?.id || null;
}
