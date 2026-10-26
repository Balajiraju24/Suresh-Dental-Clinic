import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Calendar, ShieldCheck, HeartPulse } from "lucide-react";
import { servicesData } from "@/config/services";
import { Accordion } from "@/components/shared/Accordion";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Periodontal Care & Gum Health | Dr. R. Suresh Dental Clinic Chennai",
  description: "Specialist periodontal examination, non-surgical scaling and root planing, gingival health, and alveolar bone preservation in Raja Annamalaipuram, Chennai.",
  alternates: {
    canonical: "/services/periodontal-care"
  }
};

export default function PeriodontalCarePage() {
  const service = servicesData.find((s) => s.slug === "periodontal-care")!;

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
            <li>
              <Link href="/services" className="hover:text-sky-700 dark:hover:text-sky-400 transition-colors">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-slate-900 dark:text-white" aria-current="page">
              Periodontal Care
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>Specialist Periodontology Focus</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                {service.name}
              </h1>

              <p className="text-lg sm:text-xl text-teal-800 dark:text-teal-300 font-medium">
                {service.subtitle}
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                {service.educationalSummary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact#appointment-form"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Request a Periodontal Assessment</span>
                </Link>
              </div>
            </div>

            {/* Scientific Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-900">
                <Image
                  src={service.image || "/images/periodontal-care.jpg"}
                  alt="Educational medical diagram comparing healthy gums and periodontal tissue against inflamed periodontitis with bone resorption"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                Educational clinical diagram: Healthy gingival tissue vs. Periodontal pocket depth and bone loss.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Suitability & Systemic Health Note */}
        <div className="mb-12 p-5 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900/60 text-sm text-teal-950 dark:text-teal-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-bold text-teal-900 dark:text-teal-300 text-sm">
              Clinical Assessment &amp; Systemic Health Connection:
            </h2>
            <p className="text-xs sm:text-sm text-teal-800 dark:text-teal-200/90 leading-relaxed">
              {service.patientSuitabilityNote}
            </p>
          </div>
        </div>

        {/* When a Consultation is Appropriate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>Warning Signs &amp; Consultation Triggers</span>
            </h2>
            <ul className="space-y-3">
              {service.clinicalIndications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>What Periodontal Therapy Involves</span>
            </h2>
            <ul className="space-y-3">
              {service.whatTreatmentInvolves.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* General Treatment Process Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 mb-16 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Clinical Phases
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-1">
              Phases of Periodontal Care &amp; Maintenance
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              How our practice systematically charts pocket depths, disrupts subgingival biofilms, and prevents disease recurrence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.procedureOverview.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center mb-3">
                    Phase {step.stepNumber}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home Care & Maintenance Guidance */}
        <div className="mb-16">
          <Card className="p-6 sm:p-10 bg-gradient-to-br from-teal-950 via-slate-900 to-sky-950 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Daily Plaque Control &amp; Preventive Maintenance
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
              Professional scaling removes mineralised calculus, but halting chronic periodontitis requires active daily plaque disruption at the gingival margin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.preparationAndAftercare.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-teal-800/60">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Patient Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-1">
              Periodontal Care FAQs
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              Evidence-based answers addressing gum inflammation, bleeding, and long-term tooth preservation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <Accordion
              items={service.faqs.map((f, i) => ({
                id: `periodontal-faq-${i}`,
                question: f.question,
                answer: f.answer
              }))}
              defaultOpenId="periodontal-faq-0"
            />
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mb-3">
            Concerned About Gum Bleeding or Tooth Mobility?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Early clinical assessment can prevent irreversible bone loss. Request an appointment for a periodontal evaluation with Dr. R. Suresh.
          </p>
          <Link
            href="/contact#appointment-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Request an Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
