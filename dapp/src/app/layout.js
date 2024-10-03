"use client";

import localFont from "next/font/local";
import { AuthProvider } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import "./globals.css";

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

// export const metadata = {
//   title: "BetCandidate",
//   description: "Apostas on-chain nas eleições americanas",
// };

export default function RootLayout({ children }) 
{
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== '/') {
      router.push('/');
    }
  }, [router]);
  
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <title>BetCandidate ;)</title>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <footer className="container mx-auto py-20 px-4 w-1/2">
            <div className="items-center text-center">
              <p className="text-sm">&copy; 2024 BetCandidate. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    </AuthProvider>
  );
}
