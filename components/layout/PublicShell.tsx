"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { VerificationBanner } from "./VerificationBanner";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaffRoute = pathname?.startsWith("/staff");

  if (isStaffRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Accessible Skip Link for Screen Readers & Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-800 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Development & Verification Status Banner */}
      <VerificationBanner />

      {/* Global Responsive Header */}
      <Header />

      {/* Main Page Content Landmark */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

