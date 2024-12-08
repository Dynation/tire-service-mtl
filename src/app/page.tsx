"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    <div className="min-h-screen flex flex-col relative">
      {/* Burger Menu */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="font-bold">TireServiceMTL</div>
        <div className="space-x-4">
          <Link href="/user-cabinet">User Cabinet</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/appointment">Schedule</Link>
          <Link href="/about">About Us</Link>
        </div>
      </nav>

      {/* Form for Vehicle and Tire Details */}
      <section className="instructionsSection bg-gray-100 p-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Provide Your Details</h2>
        {user ? (
          <form className="mt-6 bg-white shadow-md rounded p-6">
            <div className="mb-4">
              <label htmlFor="licensePlate" className="block text-lg font-bold mb-2">
                Your Vehicle License Plate
              </label>
              <input
                id="licensePlate"
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
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
          </form>
        ) : (
          <p className="text-sm text-gray-800 mt-2">Please log in to provide your details.</p>
        )}
      </section>

     {/* Текст поверх Swiper */}
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
  <AnimatePresence mode="popLayout">
    <motion.h1
      key={`title-${currentSlide}`}
      className="text-5xl text-white z-20 text-center bg-black/50 px-4 py-2 rounded mb-4"
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
      className="text-lg text-white z-20 text-center bg-black/50 px-4 py-2 rounded max-w-2xl"
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
        className="w-full h-[85vh]"
        
      >
        <SwiperSlide>
          <div className="relative w-full h-[50dvh]">
            <Image src="/images/hero3.jpg" alt="Forests" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-[50dvh]">
            <Image src="/images/hero2.jpg" alt="Beaches" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-[50dvh]">
            <Image src="/images/hero.jpg" alt="Mountains" fill style={{ objectFit: "cover" }} />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomePage;

