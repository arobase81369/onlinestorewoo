"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import { setPickupOption, setShippingAddress, applyCouponSuccess, applyCouponFail, setTaxAmount, setShippingAmount } from "@/store/checkoutSlice";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PenBoxIcon, Trash2 } from "lucide-react";
import GetAttributes from "./getAttributes";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const checkout = useSelector((state) => state.checkout);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState((checkout.coupon.code)? checkout.coupon.code : "");
  const [couponFeedback, setCouponFeedback] = useState("");
  const [discountData, setDiscountData] = useState({ amount:(checkout.coupon.discount)? checkout.coupon.discount : 0});
  const [shippingCost, setShippingCost] = useState(0);
  const [taxAmounts, setTaxAmounts] = useState(0);
  const [pickup, setPickup] = useState(checkout?.pickupOption || false);
  const [editcontact, setEditcontact] = useState(false);
  const [editshipping, setEditshipping] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "500061",
    country: "IN",
  });

  // On initial load, populate shipping if it exists
  useEffect(() => {
    const address = checkout?.shippingAddress;
    if (address && Object.keys(address).length > 0) {
      const isSame = JSON.stringify(address) === JSON.stringify(shipping);
      if (!isSame) setShipping(address);
    }
  }, []);

  // Keep Redux store updated
  useEffect(() => {
    dispatch(setPickupOption(pickup));
    if (!pickup) {
      dispatch(setShippingAddress(shipping));
    }
  }, [pickup, shipping]);

  const isShippingValid = () =>
    pickup ||
    (shipping.state &&
      shipping.pincode &&
      shipping.country);

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCoupon = async () => {
    try {
      const ck = process.env.NEXT_PUBLIC_WC_KEY;
      const cs = process.env.NEXT_PUBLIC_WC_SECRET;

      const res = await fetch(
        `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/coupons?code=${couponCode}&consumer_key=${ck}&consumer_secret=${cs}`
      );
      const [coupon] = await res.json();

      if (coupon && coupon.amount) {
        const subtotal = getSubtotal();
        let discount = 0;

        if (coupon.discount_type === "fixed_cart") {
          discount = parseFloat(coupon.amount);
        } else if (coupon.discount_type === "percent") {
          discount = (subtotal * parseFloat(coupon.amount)) / 100;
        }

        setDiscountData({ amount: discount });
        setCouponFeedback(`Coupon "${coupon.code}" applied!`);
        dispatch(applyCouponSuccess({code:coupon.code, discount:parseFloat(discount) }))


      } else {
        setCouponFeedback("Invalid or expired coupon");
        setDiscountData({ amount: 0 });
        dispatch(applyCouponFail());
      }
    } catch (err) {
      console.error("Coupon Error:", err);
      setCouponFeedback("Failed to apply coupon");
    }

    console.log(checkout);
  };

  // Fetch shipping + tax on change
  useEffect(() => {
    const calculateCharges = async () => {
      console.log("testing");
      const subtotal = getSubtotal();
      if (pickup || !isShippingValid()) {
        setShippingCost(0);
        setTaxAmounts(0);
        dispatch(setShippingAmount(0));
        return;
      }
      console.log("shipping rates");
      const payload = {
        products: cartItems.map((item) => ({
          id: item.productid || item.id,
          quantity: item.quantity,
        })),
        country: shipping.country,
        state: shipping.state,
        postcode: shipping.pincode,
      };

      

      try {
       
        // Shipping API
        const shipRes = await fetch(
          "https://arobasedesigns.in/reactwpapi/wp-json/custom-shipping/v1/rates",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const shipData = await shipRes.json();
        
        setShippingCost(Math.ceil(shipData?.rates?.[0]?.cost || 50));
        dispatch(setShippingAmount(Math.ceil(shipData?.rates?.[0]?.cost || 50)));
      } catch (err) {
        console.error("Shipping Error", err);
        setShippingCost(50);
        dispatch(setShippingAmount(50));
      }

      try {
        // Tax API with CK & CS
        const ck = process.env.NEXT_PUBLIC_WC_KEY;
        const cs = process.env.NEXT_PUBLIC_WC_SECRET;
        const taxRes = await fetch(
          `https://arobasedesigns.in/reactwpapi/wp-json/wc/v3/taxes?consumer_key=${ck}&consumer_secret=${cs}`
        );
        const taxes = await taxRes.json();

        const match = taxes.find(t => {
          if (t.country !== shipping.country) return false;
          if (!t.state || t.state === "") return true;
          return t.state === shipping.state;
        });
      
        const rate = (match ? parseFloat(match.rate) : 0);
        console.log("rate");
        console.log(rate);

      //  const rate = parseFloat(taxes?.[0]?.rate || 0);
        const tax = ((subtotal - discountData.amount) * rate) / 100;
        setTaxAmounts(Math.round(tax));
        dispatch(setTaxAmount(Math.round(tax)));
      } catch (err) {
        console.error("Tax Error", err);
        setTaxAmounts(0);
      }
    };
 
    calculateCharges();
    if(cartItems.length == 0) {
      dispatch(setTaxAmount(0));
      dispatch(applyCouponFail());
    }
  }, [shipping, pickup, cartItems, discountData.amount]);

  const getTotal = () =>
    getSubtotal() - discountData.amount + (pickup ? 0 : shippingCost) + taxAmounts;

  const handleQtyChange = (id, qty) => {
    if (qty > 0) dispatch(updateQuantity({ id, quantity: qty }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 grid md:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="\ flex align-items-center justify-items-center gap-4 p-4 bg-f2f2f2 rounded"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover cart-product-image"
                />
                <div className="cart-product-content">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {(item.productid && item.variationid) ? (<><GetAttributes productid={item.productid} variantid={item.variationid} /></>) : (<></>)}


                  {/* 🧩 Show variations if present */}
                  {item.attributes && (
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <div key={key}>
                          <span className="capitalize">{key.replace("pa_", "")}</span>: {val}
                        </div>
                      ))}
                    </div>
                  )}




                </div>

                <div className="flex align-items-center justify-between flex-1 flex-wrap gap-4">

                <div className=" flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="">
                  <p className="text-right font-semibold text-lg text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart({ id: item.id }))}
                  className="flex justify-center text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      {/* Summary */}
      {cartItems.length !== 0 ? (
      <div className="bg-gray-50 p-2 md:p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        {/* Coupon Field */}
        <div className="mb-4">
          <span>Code: {checkout.coupon.discount}</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon"
              className="flex-1 border px-3 py-2 rounded text-sm"
            />
            <button
              onClick={applyCoupon}
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Apply
            </button>
          </div>
          {couponFeedback && (
            <p
              className={`text-sm mt-1 ${
                discountData.amount > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {couponFeedback}
            </p>
          )}
        </div>

        {/* Shipping Form */}
        <label className="flex items-center mb-3 gap-2 text-sm">
          <input
            type="checkbox"
            checked={pickup}
            onChange={(e) => setPickup(e.target.checked)}
          />
          Pickup from local store
        </label>

        {!pickup && (
          <div className="space-y-3 py-1 px-2 rounded-lg bg-white shadow text-sm">
            <h4 className="font-bold mb-1">Contact Address</h4>
            {(shipping.fullName !== "" || shipping.email !== "" || shipping.phone !== "") ?
              (
            <div className="flex justify-between">
              <div>
            <span className="block w-full hidden">{shipping.fullName}</span>
              <span className="block w-full">{shipping.email}</span>
              <span className="block w-full">{shipping.phone}</span>
              <span>{editcontact}</span>
              </div>
              <div onClick={() => setEditcontact((!editcontact))}><PenBoxIcon width={20} className=""/></div>
              </div>
              ) : (<div><button onClick={() => setEditcontact((!editcontact))} className="border rounded p-2">Add Contact Details</button></div>)}
            <div className={`contact-edit-section ${editcontact? "block" : "hidden"}`}>
            {[
              { name: "fullName", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                placeholder={field.label}
                className="w-full p-2 border rounded my-1"
                value={shipping[field.name]}
                onChange={(e) =>
                  setShipping({ ...shipping, [field.name]: e.target.value })
                }
              />
            ))}
            </div>
          </div>
        )}

{!pickup && (
          <div className="space-y-3 py-1 px-2 rounded-lg bg-white shadow mt-4 text-sm">
             <h4 className="font-bold mb-1">Shipping Address</h4>
            <div className="">
              {(shipping.address !== "" || shipping.city !== "" || shipping.state !== "" || shipping.pincode !== "") ?
              (
                <div className="flex justify-between">
              <div>
                <span className="block w-full hidden">{shipping.address} - {shipping.city}</span>
                <span className="block w-full">{shipping.state} - {shipping.pincode}</span>
                <span>{editcontact}</span>
              </div>
              <div onClick={() => setEditshipping((!editshipping))}><PenBoxIcon width={20} className="" /></div>
              </div>
            ) : (<div><button onClick={() => setEditshipping((!editshipping))} className="border rounded p-2">Add Shipping</button></div>)}

            </div>
             <div className={`shipping-edit-section ${editshipping? "block" : "hidden"}`}>
            {[
              { name: "address", label: "Street Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pincode", label: "Pincode" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                placeholder={field.label}
                className="w-full p-2 border rounded mb-1"
                value={shipping[field.name]}
                onChange={(e) =>
                  setShipping({ ...shipping, [field.name]: e.target.value })
                }
              />
            ))}
            <select
              className="w-full p-2 border rounded"
              value={shipping.country}
              onChange={(e) =>
                setShipping({ ...shipping, country: e.target.value })
              }
            >
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
            </select>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{getSubtotal().toFixed(2)}</span>
          </div>
          {discountData.amount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Coupon Discount</span>
              <span>- ₹{discountData.amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{pickup ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax {checkout.taxAmount}</span>
            <span>₹{taxAmounts.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className={`block text-center mt-5 py-2 rounded font-medium mobile-checkout-button mb-12 ${
            isShippingValid()
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout
        </Link>
      </div>

        ) : (<></>)}

    </div>
  );
}
