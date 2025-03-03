"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import auth from "../lib/firebaseAuth";
import styles from "./Header.module.css";
import { useMediaQuery } from "react-responsive";
import { Home, Calendar, Car, User as UserIcon } from "lucide-react";
import Image from "next/image";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleSignInGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <>
      {!isMobile && (
        <header className={styles.header}>
          <div className={styles.wrapper}>
            {/* 🔥 Лого */}
            <div className={styles.logoContainer}>
              <Image src="/images/wheel.svg" alt="Tire Logo" width={60} height={60} className={styles.logo} />
              <span className={styles.brand}>TIRE SERVICE MTL</span>
            </div>

            {/* 🔗 Навігація */}
            <nav className={styles.navLinks}>
              <Link href="/user-dashboard">Dashboard</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/appointment">Schedule</Link>
              <Link href="/about">About Us</Link>
            </nav>

            {/* 🔐 Авторизація */}
            <div className={styles.authButton}>
              {!user ? (
                <>
                  <button onClick={handleSignInGoogle} className="mr-2">Увійти через Google</button>
                </>
              ) : (
                <div className={styles.userInfo}>
                  <span>Привіт, {user.displayName || "Користувач"}</span>
                  <button type="button" onClick={handleSignOut}>
                    Вийти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 🏠 Мобільна навігація */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-2 shadow-xl">
          <Link href="/user-dashboard" className="flex flex-col items-center">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/appointment" className="flex flex-col items-center">
            <Calendar size={24} />
            <span className="text-xs">Schedule</span>
          </Link>
          <Link href="/garage" className="flex flex-col items-center">
            <Car size={24} />
            <span className="text-xs">Garage</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center">
            <UserIcon size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Header;

