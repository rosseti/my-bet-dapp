"use client";

import localFont from "next/font/local";
import { AppProvider } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function RootLayout({ children })
{
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== '/') {
      router.push('/');
    }
  }, [router]);

  return (
    <AppProvider>
      <html lang="en">
        <head>
          <title>BetCandidate ;)</title>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <Header />
            {children}

            <Footer />

        </body>
      </html>
    </AppProvider>
  );
}
