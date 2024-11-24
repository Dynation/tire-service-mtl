// src/app/page.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      {/* Параллакс-секция */}
      <section className={styles.parallaxSection}>
        <Image
          src="/images/hero.jpg"
          alt="Hero Image"
          layout="fill"
          className={styles.parallaxImage}
          priority
        />
        <div className={styles.parallaxContent}>
          <h2>Добро пожаловать в D - TIRE SERVICE</h2>
          <p>Профессиональный сервис для вашего автомобиля</p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Services Section with Links to Appointments */}
        <section className={styles.servicesSection}>
          <div className={styles.serviceItem}>
            <Link href="/pricing">
              <h3>Просмотреть расценки</h3>
            </Link>
          </div>
          <div className={styles.serviceItem}>
            <Link href="/appointment-tire">
              <h3>Записаться на шиномонтаж</h3>
            </Link>
          </div>
          <div className={styles.serviceItem}>
            <Link href="/appointment-wash">
              <h3>Записаться на мойку</h3>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
