"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import auth from "../lib/firebaseAuth";
import styles from "./Header.module.css";
import WheelIcon from "../../../public/images/wheel.svg";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        {/* Логотип */}
        <WheelIcon className={styles.wheel} />
        <svg className={`${styles.titleSvg} titleSvg`}>
  <text
    x="50%"
    y="10%"
    textAnchor="middle"
    className="md:translate-y-0 translate-y-[20%]"
  >
    <tspan x="40%" dy="1.5em">TIRE</tspan>
    <tspan x="50%" dy="1em">SERVICE MTL</tspan>
  </text>
</svg>

        {/* Кнопка авторизації */}
        <div className={styles.authButton}>
          {!user ? (
            <button onClick={handleSignIn}>Войти</button>
          ) : (
            <div className={styles.userInfo}>
              <span>Здравствуйте, {user.displayName || "Пользователь"}</span>
              <button type="button" onClick={handleSignOut}>
                Выйти
              </button>
            </div>
          )}

          {/* Бургер-іконка для мобільного меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none ml-4"
            aria-label={isMenuOpen ? "Close menu" : "Toggle menu"}
          >
            {isMenuOpen ? (
              // Іконка хрестика
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Іконка бургер-меню
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Мобільне меню */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-full bg-gray-800">
          <div className="grid grid-cols-2 gap-4 p-4">
            <Link href="/user-cabinet" className="block text-center py-2 text-white">
              User Cabinet
            </Link>
            <Link href="/pricing" className="block text-center py-2 text-white">
              Pricing
            </Link>
            <Link href="/appointment" className="block text-center py-2 text-white">
              Schedule
            </Link>
            <Link href="/about" className="block text-center py-2 text-white">
              About Us
            </Link>
          </div>
        </div>
      )}

      {/* Підкреслення під заголовком */}
      <div className={styles.headerUnderline1} />
      <div className={styles.headerUnderline2} />
    </header>
  );
};

export default Header;

