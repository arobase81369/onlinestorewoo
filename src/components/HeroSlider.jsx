"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowBigRightDash, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Shop Smart. Live Better.",
    description: "Discover top trends and unbeatable prices all in one place.",
    image: "https://arobasedesigns.in/images/ecommerce/slider-images2.svg",
    buttonText: "Explore Services",
    buttonLink: "/services",
  },
  {
    id: 2,
    title: "Fresh Finds Just In!",
    description: "Be the first to explore our latest collection of must-haves.",
    image: "https://arobasedesigns.in/images/ecommerce/slider-images.svg",
    buttonText: "Explore New Arrivals",
    buttonLink: "/contact",
  },
  {
    id: 3,
    title: "Up to 50% Off – Limited Time!",
    description: "Hurry! Exclusive discounts on clothing, footwear & accessories.",
    image: "https://arobasedesigns.in/images/ecommerce/slider-images.svg",
    buttonText: "Grab the Deal",
    buttonLink: "/marketing",
  },
  {
    id: 4,
    title: "Your Style, Your Way",
    description: "Shop curated collections: Men, Women, Kids & More.",
    image: "https://arobasedesigns.in/images/ecommerce/slider-images.svg",
    buttonText: "Browse Categories",
    buttonLink: "/marketing",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
    <div className="relative w-full h-[30vh] md:h-[60vh] overflow-hidden rounded-lg  bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
            
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            objectPosition="right"
            priority={true}
            className="hidden md:block"
          />

          {/* Overlay */}
          <div className="hidden absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 text-white flex flex-col justify-center items-start px-6 md:px-20  transition-all duration-700">
            <h4 className="">Up to <span className="text-2xl font-bold">50%</span> Off <span className="text-xl font-bold">Summer Styles</span></h4>
            <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4 animate-fade-in lh">
              {slide.title}
            </h2>
            <p className="text-md md:text-xl max-w-lg mb-3 md:mb-6 animate-fade-in delay-300">
              {slide.description}
            </p>
            <Link
              href={slide.buttonLink}
              className="bg-gray-900 text-white flex align-items-center gap-3 hover:bg-gray-700 transition px-3 py-2 md:px-6 md:py-3 rounded-full text-sm md:text"
            >
              {slide.buttonText} <ArrowRight width={15}/>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="hidden md:block">
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute top-1/2 left-4 transform -translate-y-1/2  text-3xl z-20"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2  text-3xl z-20"
      >
        ❯
      </button>
      </div>
    </div>
    </div>
  );
}
