import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Calendar,
  AlertCircle,
  FlaskConical,
  Microscope,
  Dna,
  Layers,
  Sparkles,
  CheckCircle2,
  Building2,
  Award
} from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Clinical Team & Research | Dr. R. Suresh Dental Clinic & Implant Centre",
  description: "Meet our dental clinicians: Dr. R. Suresh (MDS, PhD, DSc) and Dr. Ashritha Suresh (BDS, IIT Madras Research Assistant), providing evidence-guided periodontics, implants, and restorative dentistry in R.A. Puram, Chennai.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  const { doctor, associateDoctor } = clinicConfig;

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
              Our Clinical Team
            </li>
          </ol>
        </nav>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>Clinical Leadership &amp; Scientific Research</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
            Meet Our Clinical Team
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Personalised, evidence-grounded dentistry requires both seasoned surgical expertise and active engagement with modern biomaterials science. At {clinicConfig.displayName}, our clinicians work collaboratively to provide meticulous, compassionate patient care.
          </p>
        </div>

        {/* ========================================================
            DOCTOR 1: DR. R. SURESH (LEAD PERIODONTIST & IMPLANTOLOGIST)
            ======================================================== */}
        <section id="lead-doctor" className="scroll-mt-24 mb-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Portrait Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-8 sm:p-10 flex flex-col justify-between text-white relative">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-300 border border-sky-800 mb-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span>Clinical Lead &bull; Founder</span>
                  </span>

                  <div className="relative mx-auto w-52 sm:w-60 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 mb-6">
                    <Image
                      src={doctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                      alt={doctor.photoPlaceholderAlt}
                      fill
                      sizes="(max-width: 1024px) 240px, 280px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Photo Verification Notice */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <p className="font-semibold text-slate-300">
                    Clinical Portrait Note
                  </p>
                  <p className="text-[11px] text-amber-400/90 mt-1 leading-snug">
                    Dignified clinical placeholder in use. High-resolution practice photograph can be synchronized with Google Maps clinic imagery upon final verification.
                  </p>
                </div>
              </div>

              {/* Profile Content Column */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Lead Consultant &bull; Periodontics &amp; Implantology
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
                      {doctor.fullName}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        <GraduationCap className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                        <span>{doctor.qualificationsDisplay}</span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        (Master of Dental Surgery, PhD, Doctor of Science)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    <p>
                      {doctor.shortBio}
                    </p>
                    <p>
                      Practicing in Raja Annamalaipuram, Chennai, Dr. R. Suresh emphasizes a conservative, patient-centred approach to dentistry—focusing on thorough clinical diagnosis, systematic periodontal health, and the biological preservation of natural teeth and supporting alveolar bone structures.
                    </p>
                  </div>

                  {/* Verification Notice on Registration */}
                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-semibold">Professional Record Verification:</span>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        Dental council registration records and academic credentials are being catalogued according to healthcare regulatory standards prior to full public verification.
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
                    <span>Request Consultation with Dr. R. Suresh</span>
                  </Link>

                  <Link
                    href="/services/periodontal-care"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
                  >
                    <span>Periodontal Therapy Overview</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            DOCTOR 2: DR. ASHRITHA SURESH (ASSOCIATE DENTAL SURGEON & RESEARCHER)
            ======================================================== */}
        <section id="associate-doctor" className="scroll-mt-24 mb-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Portrait & Research Badge Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-8 sm:p-10 flex flex-col justify-between text-white relative">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-800 mb-6">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
                    <span>Associate Surgeon &bull; IIT Madras Researcher</span>
                  </span>

                  <div className="relative mx-auto w-52 sm:w-60 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-teal-700/60 shadow-2xl bg-slate-950 mb-6">
                    <Image
                      src={associateDoctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                      alt={associateDoctor.photoPlaceholderAlt}
                      fill
                      sizes="(max-width: 1024px) 240px, 280px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Research Affiliation Card */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-teal-900/60 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 font-semibold">
                    <Building2 className="w-4 h-4 text-teal-400" aria-hidden="true" />
                    <span>Research Affiliation</span>
                  </div>
                  <p className="text-[12px] text-slate-300 font-medium leading-snug">
                    Indian Institute of Technology, Madras (IIT Madras)
                  </p>
                  <p className="text-[11px] text-teal-400/90 font-mono">
                    Research Assistant &bull; Sep 2024 – Present (2 yrs 2 mos)
                  </p>
                </div>
              </div>

              {/* Profile & Academic Details Column */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Associate Dental Surgeon &amp; Dental Materials Specialist
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
                      {associateDoctor.fullName}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        <Award className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                        <span>{associateDoctor.qualificationsDisplay}</span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        (Bachelor of Dental Surgery &bull; Grade: 3.83)
                      </span>
                    </div>
                  </div>

                  {/* Education Highlight Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Sri Ramachandra Institute Of Higher Education and Research
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          Bachelor of Dental Surgery (BDS), Dentistry &bull; Aug 2018 – Nov 2023
                        </p>
                        <span className="inline-block mt-1.5 text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-900/60 px-2.5 py-0.5 rounded-full">
                          Graduating Grade: 3.83 (Distinction)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    <p>
                      {associateDoctor.shortBio}
                    </p>
                    <p>
                      At our Chennai clinic, Dr. Ashritha Suresh delivers patient-focused general and restorative treatments, emphasizing tooth preservation, gentle handling, and proactive oral disease prevention. Her ongoing experimental research work at IIT Madras enriches our clinical practice with deep insight into cellular healing, tissue engineering, and modern polymer biomaterials.
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact#appointment-form"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow transition-all"
                  >
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>Request Consultation with Dr. Ashritha Suresh</span>
                  </Link>

                  <Link
                    href="/services/general-dentistry"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                  >
                    <span>General &amp; Restorative Care</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed IIT Madras Research Experience Showcase */}
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <Microscope className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                    Biomedical &amp; Cellular Engineering Research at IIT Madras
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Indian Institute of Technology, Madras &bull; Sep 2024 – Present (Research Assistant &bull; Internship)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Frontier Translational Science
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Investigating foundational cellular mechanisms, biomaterial fabrication, and microfluidic technologies to advance tissue regeneration and diagnostic platforms:
            </p>

            {/* Research competency cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-xs uppercase tracking-wide">
                  <Dna className="w-4 h-4" aria-hidden="true" />
                  <span>Cell Culture</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Fibroblast Culture &amp; Cryopreservation
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Conducting primary cell culture with fibroblast cells, including seeding, incubation, cryopreservation (freezing), reviving, and systematic subculturing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-xs uppercase tracking-wide">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span>Biomaterials</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Polymer Electrospinning
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Electrospinning nanoscale polymer materials to engineer biocompatible scaffolds for guided tissue and bone regeneration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-xs uppercase tracking-wide">
                  <FlaskConical className="w-4 h-4" aria-hidden="true" />
                  <span>Diagnostics</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Flow Cytometry &amp; RT-PCR
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Flow cytometry for cellular characterization and real-time RT-PCR experiments for high-precision gene expression analyses.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Microfluidics</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lithography &amp; Nanoparticles
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Lithography techniques for microfluidic chip channels, 3D-printed alveolar-sac chips, and optoporation with titanium nanoparticles.
                </p>
              </div>
            </div>

            {/* Translational medicine banner */}
            <div className="mt-6 p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                <span className="font-bold">Bridging Scientific Research &amp; Clinical Dental Practice:</span> Deep understanding of cell adhesion, polymer biocompatibility, and cellular-level healing empowers our team to choose the most biological, tooth-preserving restorative protocols for each patient.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            CLINICAL PHILOSOPHY & ETHICS
            ======================================================== */}
        <div className="mb-16">
          <SectionHeader
            badge="Clinical Approach"
            title="Core Principles Guiding Our Consultations"
            subtitle="How we structure our patient evaluations, treatment planning, and preventive care."
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
              Comprehensive Clinical Capabilities
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
              Every procedure is tailored according to rigorous clinical assessments, 3D diagnostics, and individual patient health factors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
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

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
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
            Consultations with our clinical team are scheduled by appointment to ensure dedicated, comprehensive clinical time for your evaluation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact#appointment-form"
              className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm px-6 py-3 rounded-xl shadow transition-all"
            >
              <Calendar className="w-4 h-4 text-sky-700" aria-hidden="true" />
              <span>Request an Appointment</span>
            </Link>
            <a
              href={`tel:${clinicConfig.contact.phoneNumber}`}
              className="inline-flex items-center gap-2 bg-sky-950/70 hover:bg-sky-950 text-white border border-sky-600/50 font-semibold text-sm px-6 py-3 rounded-xl transition-all"
            >
              <span>Call: {clinicConfig.contact.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
