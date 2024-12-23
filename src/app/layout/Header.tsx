import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import WheelIcon from "../../../public/images/wheel.svg";

interface User {
  displayName: string | null;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Завантажити дані про користувача при завантаженні компонента
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch((err) => console.error("Помилка завантаження користувача:", err));
  }, []);

  // Обробка входу
  const handleSignIn = async () => {
    try {
      const res = await fetch("/api/auth/signin", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Помилка входу");
      }
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  // Обробка виходу
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (res.ok) {
        setUser(null);
      } else {
        console.error("Помилка виходу");
      }
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <WheelIcon className={styles.wheel} />
        <svg className={`${styles.titleSvg} titleSvg`}>
          <text x="50%" y="10%" textAnchor="middle">
            <tspan x="40%" dy="1.5em">TIRE</tspan>
            <tspan x="50%" dy="1em">SERVICE MTL</tspan>
          </text>
        </svg>

        <div className={styles.authButton}>
          {!user ? (
            <button onClick={handleSignIn}>Войти</button>
          ) : (
            <div className={styles.userInfo}>
              <span>Здравствуйте, {user.displayName || "Пользователь"}</span>
              <button onClick={handleSignOut}>Выйти</button>
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none ml-4"
            aria-label={isMenuOpen ? "Close menu" : "Toggle menu"}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-full bg-gray-800">
          <div className="grid grid-cols-2 gap-4 p-4">
            <Link href="/user-dashboard" className="block text-center py-2 text-white">
              User dashboard
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

      <div className={styles.headerUnderline1} />
      <div className={styles.headerUnderline2} />
    </header>
  );
};

export default Header;

