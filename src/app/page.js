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
import BrandSlider from '@/components/BrandSlider';
import BestsellingSlider from '@/components/bestSelling';

export default function HomePage() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <main>
      <div className='mb-4 px-2 md:px-0'>
      <HeroSlider />
      <CategoriesPage />
      <OffersTwoColums />
      <NewArrivals />
      <BrandSlider />
      <BestsellingSlider />
      </div>
    </main>

   
  );
}
