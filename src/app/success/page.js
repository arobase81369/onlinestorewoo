'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderLink = searchParams.get('link'); // Get 'link' parameter

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 text-green-600">🎉 Order Placed Successfully!</h1>
      <p className="mb-6 text-gray-700">
        Thank you for your purchase. You can view your order details by clicking below.
      </p>

      {orderLink ? (
        <Link
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          View Order
        </Link>
      ) : (
        <p className="text-red-500">No order link found.</p>
      )}
      <div><Link href="/" className='bg-gray-700 text-sm px-4 py-2 inline-block my-4 text-white'>Back to List</Link></div>
    </div>
  );
}
