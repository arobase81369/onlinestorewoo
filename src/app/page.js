// app/page.js
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';
import Products from '@/components/products';
import CartPage from '@/components/cartitems';
import LoginForm from '@/components/login';

export default function HomePage() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <main>
      <div className='max-w-7xl mx-auto'>
      <div className='my-10 md:my-20'>
        <div className='gap-4'>
          <div className="p-2 md:p-4 pt-0">
             <Products />
             </div>
             </div>
      </div>
      </div>
    </main>

   
  );
}
