// src/app/components/Header.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import auth from "../lib/firebaseAuth";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

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
        <svg
          className={styles.wheel}
          viewBox="-51.2 -51.2 614.40 614.40"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          {/* ... содержимое SVG ... */}
        </svg>
        <svg className={styles.titleSvg}>
          <text x="50%" y="30%" textAnchor="middle">
            <tspan x="50%" dy="0.1em">TIRE</tspan>
            <tspan x="50%" dy="1em">SERVICE</tspan>
            <tspan x="50%" dy="1em">MTL</tspan>
          </text>
        </svg>
      </div>

      <div className={styles.headerUnderline} />

      {/* Кнопка авторизации/выхода */}
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
      </div>
    </header>
  );
};

export default Header;
