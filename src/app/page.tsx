"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import './globals.css';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Parallax Section - Forests */}
      <section className="parallaxSection mb-10 relative">
        <div className="relative w-full h-[85vh]">
          {/* Изображение */}
          <Image
            src="/images/hero3.jpg"
            alt="Forests"
            fill
            style={{ objectFit: 'cover' }}
            className="parallaxImage"
          />
          {/* Контейнер с анимированным текстом */}
          <div className="parallax-inner absolute inset-0 flex items-center justify-center flex-col bg-black/50 p-4">
            {/* Анимация для H1 - движение по оси Y и прозрачность */}
            <motion.h1
              className="text-5xl text-white mb-4 z-20"
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              What an amazing and fast service by TireServiceMTL!
            </motion.h1>
            {/* Анимация для параграфа - движение по оси X и прозрачность */}
            <motion.p
              className="mt-4 text-lg max-w-3xl mx-auto text-white z-10"
              initial={{ x: '-30%', opacity: 0 }}
              whileInView={{ x: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            >
              TireServiceMTL offers rapid and efficient services to ensure your vehicle is ready in no time. Customer satisfaction is our top priority, every single time.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Parallax Section - Beaches */}
      <section className="parallaxSection mb-10 relative">
        <div className="relative w-full h-[85vh]">
          <Image
            src="/images/hero2.jpg"
            alt="Beaches"
            fill
            style={{ objectFit: 'cover' }}
            className="parallaxImage"
          />
          {/* Контейнер с анимированным текстом */}
          <div className="parallax-inner absolute inset-0 flex items-center justify-center flex-col bg-black/50 p-4">
            {/* Анимация для H1 - движение по оси Y и прозрачность */}
            <motion.h1
              className="text-5xl text-white mb-4 z-20"
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              Incredible tire mounting and balancing service!
            </motion.h1>
            {/* Анимация для параграфа - движение по оси X и прозрачность */}
            <motion.p
              className="mt-4 text-lg max-w-3xl mx-auto text-white z-10"
              initial={{ x: '-30%', opacity: 0 }}
              whileInView={{ x: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            >
              Our tire mounting and balancing service is second to none. Get your tires mounted and balanced with precision and care for a smooth, safe ride.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Parallax Section - Mountains */}
      <section className="parallaxSection mb-10 relative">
        <div className="relative w-full h-[85vh]">
          <Image
            src="/images/hero.jpg"
            alt="Mountains"
            fill
            style={{ objectFit: 'cover' }}
            className="parallaxImage"
          />
          {/* Контейнер с анимированным текстом */}
          <div className="parallax-inner absolute inset-0 flex items-center justify-center flex-col bg-black/50 p-4">
            {/* Анимация для H1 - движение по оси Y и прозрачность */}
            <motion.h1
              className="text-5xl text-white mb-4 z-20"
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              High-quality mobile tire service for clients, just as good as the shop!
            </motion.h1>
            {/* Анимация для параграфа - движение по оси X и прозрачность */}
            <motion.p
              className="mt-4 text-lg max-w-3xl mx-auto text-white z-10"
              initial={{ x: '-30%', opacity: 0 }}
              whileInView={{ x: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            >
              We bring our tire services right to your doorstep, offering the same great quality as our shop. Convenience and quality in one package.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mainContent">
        {/* Services Section with Links to Appointments */}
        <section className="servicesSection">
          <div className="serviceItem">
            <Link href="/pricing">
              <div>
                <h3>View Pricing</h3>
              </div>
            </Link>
          </div>
          <div className="serviceItem">
            <Link href="/appointment">
              <div>
                <h3>Schedule Tire Mounting</h3>
              </div>
            </Link>
          </div>
          <div className="serviceItem">
            <Link href="/appointment-wash">
              <div>
                <h3>Schedule a Car Wash</h3>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
