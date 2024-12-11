"use client";
import React, { useState } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import ThreeSimpleSteps from "../app/components/ThreeSimpleSteps";
import "swiper/css";
import "swiper/css/autoplay";


import "./globals.css";

const HomePage: React.FC = () => {

  const [currentSlide, setCurrentSlide] = useState(0);



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
    

{/* Текст поверх Swiper */}
<div className="absolute  inset-0 z-10 flex flex-col  md:translate-y-[30%] translate-y-[10%] items-center justify-center pointer-events-none">
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
 
      <ThreeSimpleSteps />
    
    </div>
  );
};

export default HomePage;

