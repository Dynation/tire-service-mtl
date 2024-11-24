// src/app/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Ссылки на Terms & Conditions и соцсети */}
        <div className={styles.footerLinks}>
          <Link href="/terms-and-conditions">
            <span className={styles.link}>Terms & Conditions</span>
          </Link>
          <a
            href="https://www.facebook.com/yourfacebookpage"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Facebook
          </a>
          <a
            href="https://maps.google.com/?q=Your+Business+Location"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Google Maps
          </a>
        </div>

        {/* Авторские права */}
        <p className={styles.copyText}>
          © {new Date().getFullYear()} D - Tire Service. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
