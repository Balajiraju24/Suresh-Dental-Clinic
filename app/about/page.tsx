import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap, ShieldCheck, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "About Dr. R. Suresh | MDS, PhD, DSc Dental Clinic Chennai",
  description: "Learn about Dr. R. Suresh MDS, PhD, DSc, leading our dental and implant practice in Raja Annamalaipuram, Chennai, with an evidence-guided, patient-centred approach.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  const { doctor } = clinicConfig;

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
              About the Doctor
            </li>
          </ol>
        </nav>

        {/* Doctor Hero Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Portrait Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-8 sm:p-10 flex flex-col justify-between text-white relative">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-300 border border-sky-800 mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                  <span>Clinical Lead</span>
                </span>

                <div className="relative mx-auto w-52 sm:w-64 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 mb-6">
                  <Image
                    src={doctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                    alt={doctor.photoPlaceholderAlt}
                    fill
                    sizes="(max-width: 1024px) 260px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Photo Verification Notice */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">
                  Profile Asset Note
                </p>
                <p className="text-[11px] text-amber-400/90 mt-1 leading-snug">
                  Neutral clinical placeholder in use during development. High-resolution clinic photograph will replace this asset upon formal verification.
                </p>
              </div>
            </div>

            {/* Profile Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Consultant Periodontist &amp; Implantologist
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
                    {doctor.fullName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      <GraduationCap className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                      <span>{doctor.qualificationsDisplay}</span>
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      (MDS, PhD, DSc)
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  <p>
                    {doctor.shortBio}
                  </p>
                  <p>
                    Practicing in Raja Annamalaipuram, Chennai, Dr. R. Suresh emphasizes a conservative,
                    patient-centred approach to dentistry—focusing on thorough clinical diagnosis,
                    systematic periodontal health, and the long-term biological preservation of natural
                    teeth and supporting structures.
                  </p>
                </div>

                {/* Verification Notice on Registration */}
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold">Professional Verification in Progress:</span>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                      Doctor registration details with the State Dental Council (TNDC) and institutional records are held in configuration and will be verified prior to public launch in adherence with ethical healthcare guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact#appointment-form"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow transition-all"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Request a Consultation</span>
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
                >
                  <span>Explore Clinical Services</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Approach & Practice Philosophy */}
        <div className="mb-16">
          <SectionHeader
            badge="Clinical Approach"
            title="Core Principles of Our Dental Practice"
            subtitle="How we structure our patient consultations, treatment planning, and preventive care."
            alignment="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {doctor.detailedPhilosophy.map((item, index) => (
              <Card key={index} className="flex items-start gap-4 p-6 sm:p-8">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                    {index === 0 && "Patient-First Communication"}
                    {index === 1 && "Conservative Tooth Preservation"}
                    {index === 2 && "Evidence-Guided Implant Protocols"}
                    {index === 3 && "Long-Term Preventive Dialogue"}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Focus Areas Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 mb-16 shadow-sm">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
              Areas of Clinical Focus
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
              Treatments are tailored according to rigorous clinical assessments and individual patient health considerations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  Periodontal Care &amp; Gum Health
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Non-surgical ultrasonic debridement, subgingival root surface management, and supportive periodontal therapy to halt bone loss.
                </p>
                <Link
                  href="/services/periodontal-care"
                  className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Read Periodontal Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  Dental Implants &amp; Restorative Care
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Biocompatible titanium implants placed following comprehensive 3D radiographic assessment of bone volume and density.
                </p>
                <Link
                  href="/services/dental-implants"
                  className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Read Implants Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Call to Action */}
        <div className="text-center bg-gradient-to-r from-sky-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Schedule an Individual Consultation in R.A. Puram
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Consultations with Dr. R. Suresh are scheduled by appointment to ensure dedicated, comprehensive clinical time for your evaluation.
          </p>
          <Link
            href="/contact#appointment-form"
            className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm px-6 py-3 rounded-xl shadow transition-all"
          >
            <Calendar className="w-4 h-4 text-sky-700" aria-hidden="true" />
            <span>Request an Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
