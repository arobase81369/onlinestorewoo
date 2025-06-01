// app/page.js
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';
import Products from '@/components/products';
import CartPage from '@/components/cartitems';

export default function HomePage() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <main>
      <div className='max-w-7xl mx-auto'>

        <div className='my-10'>
              {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        Demo Online Store Setup
      </h1>
      {/* Short Description */}
      <p className="text-center text-gray-600 mb-8">
        This is a demo to showcase how to build an online store using <span className='font-bold text-lg'>WordPress WooCommerce APIs</span>.
      </p>
        </div>
      <div className='my-10 md:my-20'>
        <div className='flex flex-wrap md:grid md:grid-cols-3 gap-4'>
          <div className="col-span-2 p-2 md:p-4 pt-0">
             <Products />
             </div>
             <div className="w-full md:col-span-1">
             <CartPage />
             </div>
             </div>
      </div>
      </div>
    </main>

   
  );
}
