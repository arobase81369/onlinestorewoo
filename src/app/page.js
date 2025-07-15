// app/page.js
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';
import Products from '@/components/products';
import LoginForm from '@/components/login';
import HeroSlider from '@/components/HeroSlider';
import CategoriesPage from '@/components/categories';
import ProductList from '@/components/productslist';
import OffersTwoColums from '@/components/offers-two-col';
import NewArrivals from '@/components/NewArrivals';

export default function HomePage() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <main>
      <HeroSlider />
      <CategoriesPage />
      <OffersTwoColums />
      <NewArrivals />
      <div className='max-w-7xl mx-auto hidden'>
      <h1 className="text-xl font-bold mb-2 px-2">Our New Arrivals</h1>
           <div className='p-2'></div>
      </div>
    </main>

   
  );
}
