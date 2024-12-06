'use client';

import React, { useEffect, useState } from 'react';
import styles from './PriceList.module.css';

type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
  vehicleType: string | null;
};

export default function PriceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Розцінки на шиномонтаж</h1>
      <div className={styles.cardContainer}>
        {services.map((service) => (
          <div key={service.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{service.name}</h3>
            <p className={styles.cardDescription}>{service.description}</p>
            <p className={styles.cardPrice}>Ціна: ${service.price}</p>
            {service.vehicleType && (
              <p className={styles.cardVehicleType}>
                Тип авто: {service.vehicleType}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

