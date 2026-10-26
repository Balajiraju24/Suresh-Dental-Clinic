"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ShieldCheck, HeartPulse, Award, MapPin } from "lucide-react";
import { clinicConfig } from "@/config/clinic";

export function Hero() {
  return (
    <section className="relative overflow-hidden isolate bg-gradient-to-b from-sky-50/60 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 py-12 sm:py-16 lg:py-24 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {/* Background Decorative Gradient Orbs (using GPU-safe radial gradients to avoid WebKit blur clipping bugs) */}
      <div
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(204,251,241,0.5)_0%,rgba(204,251,241,0)_70%)] dark:bg-[radial-gradient(circle,rgba(19,78,74,0.3)_0%,rgba(19,78,74,0)_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 -z-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.6)_0%,rgba(224,242,254,0)_70%)] dark:bg-[radial-gradient(circle,rgba(12,74,110,0.3)_0%,rgba(12,74,110,0)_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="clinic-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Hero Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Clinical Credential & Locality Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100/90 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                <span>Dr. R. Suresh, MDS, PhD, DSc</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <span>R.A. Puram, Chennai</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              Expert Dental Care.{" "}
              <span className="bg-gradient-to-r from-sky-700 via-teal-700 to-cyan-800 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                A Healthier, More Confident Smile.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              Explore personalised dental care, periodontal treatment and implant
              dentistry in a welcoming clinical environment.
            </p>

            {/* Clinical Highlight Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2">
              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Patient Comfort</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Gentle, calm care</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Evidence-Based</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">MDS, PhD, DSc oversight</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Clear Guidance</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Transparent dialogue</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/contact#appointment-form"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span>Request an Appointment</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              </Link>
            </div>

            {/* Development Draft Copy Notice */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              * Draft clinical copy prepared for clinic review. Verified operating parameters subject to clinic sign-off.
            </p>
          </motion.div>

          {/* Hero Right Column: Clinical Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-sky-500/20 via-teal-500/20 to-sky-300/20 rounded-3xl pointer-events-none -z-10" />

              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/clinic-hero.jpg"
                  alt="Modern, clean dental operatory with comfortable teal patient chair and digital diagnostics at Dr. Suresh Dental Clinic"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                  className="object-cover object-center"
                />
                
                {/* Subtle gradient vignette at bottom for caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex items-center justify-between">
                  <span className="font-medium drop-shadow-sm">
                    Tranquil Clinical Environment
                  </span>
                  <span className="text-[11px] text-slate-300 bg-slate-950/75 px-2 py-0.5 rounded">
                    R.A. Puram, Chennai
                  </span>
                </div>
              </div>

              {/* Floating Verified Focus Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 dark:bg-slate-900/95 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-[240px] sm:max-w-[270px]">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    MDS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      Specialist Clinical Care
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Periodontal health, alveolar bone maintenance, and dental implants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
