import Link from "next/link";

export default function SuccessPage() {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">🎉 Order Placed!</h1>
        <p>Thank you for your purchase. We’ll contact you shortly.</p>
        <Link href="/" className="inline-block mt-4 text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }
  