"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

import auth from "./lib/firebaseAuth";
import "./globals.css";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTireType, setSelectedTireType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const tireData = [
    { name: "Шини R14-R15", description: "Шиномонтаж для легкових автомобілів з радіусом R14-R15.", price: 70 },
    { name: "Шини R16", description: "Шиномонтаж для автомобілів з радіусом R16.", price: 90 },
    { name: "Шини R17+", description: "Шини преміум-класу або для позашляховиків.", price: 100 },
  ];

  const slideContents = [
    {
      title: "What an amazing and fast service by TireServiceMTL!",
      description: "TireServiceMTL offers rapid and efficient services to ensure your vehicle is ready in no time.",
    },
    {
      title: "Incredible tire mounting and balancing service!",
      description: "Our tire mounting and balancing service is second to none. Get your tires mounted with precision.",
    },
    {
      title: "High-quality mobile tire service for clients!",
      description: "We bring our tire services right to your doorstep with shop-level quality and convenience.",
    },
  ];

  return (
    <div className=" grid grid-rows-[auto_1fr] ">
      {/* Form for Vehicle and Tire Details */}
      <section className="instructionsSection bg-gray-100 p-10 text-center">
  <h2 className="text-3xl font-bold mb-6">Provide Your Details</h2>
  {user ? (
    <form className="mt-4 bg-[#222] text-white rounded-lg p-6 shadow-lg transition-transform duration-200 ease">
      <div className="mb-4">
        <label htmlFor="licensePlate" className="block text-lg font-bold mb-2">
          Your Vehicle License Plate
        </label>
        <input
          id="licensePlate"
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          className="w-full border border-gray-500 p-2 rounded bg-[#333] text-white placeholder-gray-400"
          placeholder="Enter license plate"
          required
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Select Wheel Size</h3>
        <ul className="space-y-2">
          {tireData.map((tire) => (
            <li key={tire.name}>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="tireSize"
                  value={tire.name}
                  checked={selectedTireType === tire.name}
                  onChange={() => setSelectedTireType(tire.name)}
                  required
                />
                <span>{tire.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="px-6 py-3 bg-green-500 text-white rounded flex-grow hover:bg-green-600 transition-transform transform hover:scale-105"
          onClick={() => {
            setLicensePlate("");
            setSelectedTireType("");
          }}
          disabled={!licensePlate || !selectedTireType}
        >
          Save & Add Another
        </button>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded flex-grow hover:bg-blue-600 transition-transform transform hover:scale-105"
          disabled={!licensePlate || !selectedTireType}
        >
          Save & Go to Schedule Tire Mounting
        </button>
      </div>
    </form>
  ) : (
    <p
  className="w-full mt-4 bg-[#333] text-white rounded-lg p-4 shadow-md cursor-pointer hover:bg-[#444] transition-colors"
>
  Please log in to provide your details.
</p>


  )}
</section>

{/* Текст поверх Swiper */}
<div className="absolute  inset-0 z-10 flex flex-col  md:translate-y-[30%] translate-y-[40%] items-center justify-center pointer-events-none">
  <AnimatePresence mode="popLayout">
    <motion.h1
      key={`title-${currentSlide}`}
      className="text-4xl md:text-5xl text-white z-20 text-center bg-black/10 px-4 py-2 rounded mb-4 "
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {slideContents[currentSlide].title}
    </motion.h1>
  </AnimatePresence>

  <AnimatePresence mode="popLayout">
    <motion.p
      key={`desc-${currentSlide}`}
      className="text-lg text-white z-20 text-center bg-black/10 px-4 py-2 rounded max-w-2xl "
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
    >
      {slideContents[currentSlide].description}
    </motion.p>
  </AnimatePresence>
</div>
      {/* Swiper Slider Section */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 6000 }}
        speed={1500}
        loop
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="w-full h-[60vh] md:h-[70vh] lg:h-[75vh]"
        
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image src="/images/hero3.jpg" alt="Forests" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image src="/images/hero2.jpg" alt="Beaches" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <Image src="/images/hero.jpg" alt="Mountains" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomePage;

