import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Stethoscope, Activity, Sparkles, Calendar } from "lucide-react";
import { ToothIcon } from "@/components/shared/Icons";
import { servicesData } from "@/config/services";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Clinical Dental Services | Dr. R. Suresh Dental Clinic Chennai",
  description: "Explore our clinical dental services in Raja Annamalaipuram, Chennai, featuring specialist focus in dental implants, periodontal care, and comprehensive oral examinations.",
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesPage() {
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
    <div className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      <div className="clinic-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-slate-900 dark:text-white" aria-current="page">
              Services
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <SectionHeader
          badge="Dental &amp; Implant Services"
          title="Clinical Services &amp; Treatment Pathways"
          subtitle="Educational overviews of diagnostic evaluations, restorative implantology, and periodontal disease management."
        />

        {/* Cautious Medical Disclaimer Notice */}
        <div className="mb-12 max-w-3xl mx-auto p-4 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-300">
              General Educational Medical Information:
            </p>
            <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed text-xs">
              The treatment descriptions provided on this page are educational summaries.
              Individual dental conditions vary significantly. No treatment is universally appropriate
              for every patient, and clinical feasibility is determined solely following a personal
              clinical and radiographic examination by a licensed dental practitioner.
            </p>
          </div>
        </div>

        {/* Specialist Detailed Services Section */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              Primary Specialist Focus Areas
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              In-depth clinical guides covering indications, procedures, suitability, and aftercare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesData
              .filter((s) => s.hasDedicatedPage)
              .map((service) => (
                <Card
                  key={service.id}
                  padding="none"
                  className="flex flex-col overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {service.image && (
                    <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 550px"
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-950 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      <div className="pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                          Key Clinical Considerations:
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                          {service.clinicalIndications.slice(0, 3).map((ind, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
                      >
                        <span>Open Complete Clinical Guide</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>

                      <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/70 px-2.5 py-1 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                        Detailed Guide
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Proposed / General Dental Services */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              General &amp; Supportive Dental Procedures
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Provisional service categories available for patient consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesData
              .filter((s) => !s.hasDedicatedPage)
              .map((service) => (
                <Card
                  key={service.id}
                  id={service.slug}
                  className="flex flex-col justify-between h-full bg-white dark:bg-slate-900"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getIcon(service.iconName)}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <div className="pt-2">
                      <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                        Typical Indications:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {service.clinicalIndications.slice(0, 2).map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500">Provisional Category</span>
                    <Link
                      href="/contact#appointment-form"
                      className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-semibold"
                    >
                      Enquire &rarr;
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Consultation Callout */}
        <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Not Certain Which Clinical Consultation You Need?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
            A routine clinical oral examination with Dr. R. Suresh allows us to review your symptoms, inspect periodontal structures, and propose conservative options tailored to you.
          </p>
          <Link
            href="/contact#appointment-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
          >
            <Calendar className="w-4 h-4 text-slate-950" aria-hidden="true" />
            <span>Request an Oral Examination</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
