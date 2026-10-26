import React from "react";
import Link from "next/link";
import { Home, Stethoscope } from "lucide-react";
import { clinicConfig } from "@/config/clinic";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 bg-slate-50/60 dark:bg-slate-950 min-h-[70vh] flex items-center transition-colors duration-200">
      <div className="clinic-container text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center font-bold text-2xl mx-auto shadow-xs">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          The requested page could not be located. It may have been moved or the address may have been entered incorrectly.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Stethoscope className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
            <span>Explore Services</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <p>{clinicConfig.clinicName}</p>
          <p>{clinicConfig.location.fullAddressDisplay}</p>
        </div>
      </div>
    </div>
  );
}
