"use client";

import Image from "next/image";

export default function OffersTwoColums() {
  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="bg-gray-200 rounded-xl md:rounded-3xl overflow-hidden">
            <Image
              src="https://arobasedesigns.in/images/ecommerce/online-bg.svg" // Replace with your actual image path
              alt="Offer 1"
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Banner 2 */}
          <div className="bg-gray-200 rounded-3xl overflow-hidden hidden md:inline-block">
            <Image
              src="https://arobasedesigns.in/images/ecommerce/online-bg.svg" // Replace with your actual image path
              alt="Offer 2"
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
