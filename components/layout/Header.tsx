"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, MapPin, Phone, Shield } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { mainNavItems } from "@/config/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 hidden md:block border-b border-slate-800">
        <div className="clinic-container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
              <span>{clinicConfig.location.fullAddressDisplay}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>Dr. R. Suresh, MDS, PhD, DSc</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Mon – Sat: 9:30 AM – 8:30 PM (Prior Appointment)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md ${
          isScrolled
            ? "shadow-sm border-b border-slate-200/80 py-3"
            : "border-b border-slate-100 py-4 sm:py-5"
        }`}
      >
        <div className="clinic-container flex items-center justify-between gap-4">
          {/* Clinic Wordmark Logo */}
          <Link
            href="/"
            className="flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md"
            aria-label={`${clinicConfig.displayName} - Return to Homepage`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                S
              </span>
              <div>
                <span className="font-bold text-slate-950 text-base sm:text-lg tracking-tight group-hover:text-sky-700 transition-colors block leading-tight">
                  Dr. R. Suresh
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 tracking-wide block uppercase">
                  Dental Clinic &amp; Implant Centre
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-sky-700 bg-sky-50 font-semibold"
                      : "text-slate-700 hover:text-sky-700 hover:bg-slate-50"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact#appointment-form"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Request Appointment</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 shadow-xl p-5 transition-all max-h-[85vh] overflow-y-auto"
          >
            <nav className="flex flex-col gap-1 pb-4">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-800 font-semibold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <p className="text-xs font-semibold text-slate-800">
                  Clinic Location
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {clinicConfig.location.fullAddressDisplay}
                </p>
                <p className="text-[11px] text-amber-700 mt-1 font-medium">
                  Verification in progress before public launch
                </p>
              </div>

              <Link
                href="/contact#appointment-form"
                className="w-full text-center py-3 px-4 rounded-xl font-semibold text-sm text-white bg-sky-700 hover:bg-sky-800 shadow"
              >
                Request an Appointment
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
