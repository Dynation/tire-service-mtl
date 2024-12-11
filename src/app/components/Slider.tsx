"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/autoplay";

interface SliderProps {
  slides: { src: string; alt: string; title: string; description: string }[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh]">
      {/* Текст поверх Swiper */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.h1
            key={`title-${currentSlide}`}
            className="text-4xl md:text-5xl text-white z-20 text-center bg-black/50 px-4 py-2 rounded mb-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {slides[currentSlide].title}
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
            {slides[currentSlide].description}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 6000 }}
        speed={1500}
        loop
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image src={slide.src} alt={slide.alt} fill style={{ objectFit: "cover" }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
