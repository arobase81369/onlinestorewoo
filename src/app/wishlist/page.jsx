"use client";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4">
            <Breadcrumbs />
        </div>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="rounded bg-f2f2f2">
              <Link href={`/product/${item.slug}`}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full object-cover mx-auto"
                />
                <div className="px-3">
                <h4 className="text mb-1 font-semibold mt-2">{item.name}</h4>
                <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </Link>
              <div className="px-3 pb-2">
              <button
                onClick={() => dispatch(removeFromWishlist({ id: item.id }))}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
