import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, AlertCircle, ArrowRight, Calendar, ShieldCheck, HelpCircle } from "lucide-react";
import { servicesData } from "@/config/services";
import { clinicConfig } from "@/config/clinic";
import { Accordion } from "@/components/shared/Accordion";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Dental Implants | Dr. R. Suresh Dental Clinic & Implant Centre Chennai",
  description: "Comprehensive educational guide on dental implants, titanium osseointegration, bone suitability, and restorative protocols at Dr. Suresh Dental Clinic in R.A. Puram, Chennai.",
  alternates: {
    canonical: "/services/dental-implants"
  }
};

export default function DentalImplantsPage() {
  const service = servicesData.find((s) => s.slug === "dental-implants")!;

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-slate-50/50">
      <div className="clinic-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-sky-700 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/services" className="hover:text-sky-700 transition-colors">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-slate-900" aria-current="page">
              Dental Implants
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                <span>Specialist Restorative Implantology</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {service.name}
              </h1>

              <p className="text-lg sm:text-xl text-sky-800 font-medium">
                {service.subtitle}
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {service.educationalSummary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact#appointment-form"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Request an Implant Evaluation</span>
                </Link>
              </div>
            </div>

            {/* Scientific Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
                <Image
                  src={service.image || "/images/dental-implants.jpg"}
                  alt="Educational 3D medical diagram of a dental implant showing titanium fixture, abutment, ceramic crown, and osseointegration into alveolar bone"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Cross-sectional anatomical illustration: Titanium implant fixture integrated into alveolar bone.
              </p>
            </div>
          </div>
        </div>

        {/* Essential Clinical Suitability Alert */}
        <div className="mb-12 p-5 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-bold text-amber-900 text-sm">
              Clinical Suitability &amp; Candidacy Notice:
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {service.patientSuitabilityNote}
            </p>
          </div>
        </div>

        {/* When a Consultation is Appropriate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>When an Implant Consultation is Appropriate</span>
            </h2>
            <ul className="space-y-3">
              {service.clinicalIndications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>What the Treatment Involves</span>
            </h2>
            <ul className="space-y-3">
              {service.whatTreatmentInvolves.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* General Treatment Process Overview */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Step-by-Step Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight mt-1">
              The Dental Implant Protocol
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              A general sequence of clinical milestones from initial diagnostic scans through biological osseointegration and definitive crown placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.procedureOverview.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center mb-3">
                    Step {step.stepNumber}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation & Aftercare Information */}
        <div className="mb-16">
          <Card className="p-6 sm:p-10 bg-gradient-to-br from-slate-900 to-sky-950 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Patient Preparation &amp; Maintenance Guidelines
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
              Implant longevity relies heavily on meticulous postoperative care and ongoing periodontal hygiene to prevent inflammatory complications such as peri-implantitis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.preparationAndAftercare.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
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
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight mt-1">
              Dental Implants FAQs
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Carefully formulated educational answers based on contemporary clinical dental research.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <Accordion
              items={service.faqs.map((f, i) => ({
                id: `implant-faq-${i}`,
                question: f.question,
                answer: f.answer
              }))}
              defaultOpenId="implant-faq-0"
            />
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-3">
            Schedule an Implant Consultation with Dr. R. Suresh
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Consultations in R.A. Puram, Chennai, include evaluation of bone density, bite mechanics, and tailored restorative options.
          </p>
          <Link
            href="/contact#appointment-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-all"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Request an Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
