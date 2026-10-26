"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";
import { clinicConfig } from "@/config/clinic";

export function VerificationBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !clinicConfig.verification.isPreviewMode) {
    return null;
  }

  const checklist = clinicConfig.verification.checklist;
  const verifiedCount = checklist.filter((i) => i.status === "verified").length;
  const pendingCount = checklist.length - verifiedCount;

  return (
    <aside aria-label="Development and clinic verification status banner" className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 text-xs sm:text-sm transition-colors duration-200">
      <div className="clinic-container py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            <span className="font-semibold text-amber-900 dark:text-amber-300">
              Clinic Preview Version
            </span>
            <span className="text-amber-800 dark:text-amber-200/90 hidden sm:inline">
              — Initial clinic details for Raja Annamalaipuram, Chennai. Official verification in progress.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 font-medium text-amber-900 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1.5 py-0.5"
            >
              <span>{pendingCount} items pending confirmation</span>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 font-medium px-2 py-0.5 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              aria-label="Dismiss preview notice banner"
            >
              Dismiss
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 dark:border-amber-900/60 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pb-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 dark:bg-slate-900/90 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/50 flex items-start gap-2 shadow-xs"
              >
                {item.status === "verified" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    {item.field}
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        item.status === "verified"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {item.status === "verified" ? "Verified" : "Verification Required"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    {item.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
