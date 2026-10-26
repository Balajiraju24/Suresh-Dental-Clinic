import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Activity, Stethoscope, AlertCircle } from "lucide-react";
import { ToothIcon } from "@/components/shared/Icons";
import { servicesData } from "@/config/services";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export function FeaturedServices() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Tooth":
        return <ToothIcon className="w-5 h-5 text-sky-700 dark:text-sky-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />;
      case "Stethoscope":
        return <Stethoscope className="w-5 h-5 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />;
      case "Activity":
        return <Activity className="w-5 h-5 text-rose-700 dark:text-rose-400" aria-hidden="true" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-sky-700 dark:text-sky-400" aria-hidden="true" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-950/80 border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="clinic-container">
        <SectionHeader
          badge="Clinical Focus Areas"
          title="Personalised Services for Complete Oral Health"
          subtitle="Explore educational overviews of proposed treatments, highlighting periodontal care, bone preservation, and restorative implant dentistry."
        />

        {/* Provisional Note for Patients and Clinic Review */}
        <div className="mb-8 p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 max-w-3xl mx-auto">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <span className="font-semibold">Clinical Note:</span> Services listed below represent provisional practice categories subject to clinic confirmation. Dedicated clinical guides are available for core areas including Dental Implants and Periodontal Care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((service) => {
            return (
              <Card
                key={service.id}
                padding="none"
                className="flex flex-col h-full overflow-hidden group"
              >
                {/* Optional Card Image if available */}
                {service.image ? (
                  <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      className="object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-xs border border-slate-200/80 dark:border-slate-700">
                        {service.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getIcon(service.iconName)}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {service.category}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {service.hasDedicatedPage ? (
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
                      >
                        <span>Detailed Guide</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    ) : (
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    )}

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        service.status === "confirmed_focus"
                          ? "bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {service.status === "confirmed_focus"
                        ? "Specialist Focus"
                        : "Provisional"}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Link to Full Services */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 font-semibold text-sm sm:text-base transition-colors"
          >
            <span>View All Proposed Clinical Services &amp; Diagnostic Details</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
