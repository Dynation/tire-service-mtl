"use client";
import React, { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
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
  
  //const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // useEffect для отслеживания размера окна и изменения атрибутов SVG
  useEffect(() => {
    const handleResize = () => {
      const svgText = document.querySelector('.titleSvg text');
      if (svgText) {
        const tspans = svgText.querySelectorAll('tspan');
        if (window.innerWidth < 600) {
          // Для малых экранов (мобильных)
          tspans[0].setAttribute('x', '40%');
          tspans[0].setAttribute('dy', '1.5em');
          tspans[1].setAttribute('x', '50%');
          tspans[1].setAttribute('dy', '1em');
        } else {
          // Для больших экранов
          tspans[0].setAttribute('x', '50%');
          tspans[0].setAttribute('dy', '0.8em');
          tspans[1].setAttribute('x', '50%');
          tspans[1].setAttribute('dy', '1em');
        }
      }
    };

    // Добавляем обработчик события при изменении размера окна
    window.addEventListener('resize', handleResize);
    // Вызовем обработчик сразу, чтобы адаптировать атрибуты при первой загрузке
    handleResize();

    // Убираем обработчик при размонтировании компонента
    return () => window.removeEventListener('resize', handleResize);
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
        <div>
          <WheelIcon className={styles.wheel} />
        </div>
        <svg className={`${styles.titleSvg} titleSvg`}>
          <text x="50%" y="30%" textAnchor="middle">
            <tspan x="40%" dy="1.5em">TIRE</tspan>
            <tspan x="50%" dy="1em">SERVICE MTL</tspan>
          </text>
        </svg>
      </div>
      <div className={styles.headerUnderline1} />
      <div className={styles.headerUnderline2} />

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
