import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBasketIcon } from "lucide-react";
import { PowerOff } from "lucide-react";

export default function HeaderMiniCart() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative group">
      <Link href="/cart" className="flex gap-2 align-items-center bg-gray-300 px-6 py-2 rounded-full hover:bg-gray-700 hover:text-white">
        <ShoppingBasketIcon /> <span className="text">({totalQty})</span>
      </Link>
      <div className="absolute hidden group-hover:block bg-white shadow rounded p-4 z-50 w-64 right-0">
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-600">No items in cart</p>
        ) : (
          cartItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-2 py-1">
              <Image  src={item.image} alt={item.name} className="w-10 h-10 object-cover" width={100} height={100} ></Image>
              <div className="text-sm">{item.name}</div>
            </div>
          ))
        )}
        <Link href="/cart" className="text-blue-600 text-sm block mt-2 text-right">
          View Cart →
        </Link>
      </div>
    </div>
  );
}
