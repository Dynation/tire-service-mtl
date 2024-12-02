// src/app/layout.tsx
"use client";
import React from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "../app/context/AuthContext"; // Импортируем AuthProvider

// Подключение локальных шрифтов
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider> {/* Оборачиваем контекстом авторизации */}
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
