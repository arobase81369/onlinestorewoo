"use client";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded p-4 bg-white">
              <Link href={`/product/${item.slug}`}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="object-cover mx-auto"
                />
                <h4 className="text-lg font-semibold mt-2">{item.name}</h4>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </Link>
              <button
                onClick={() => dispatch(removeFromWishlist({ id: item.id }))}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
