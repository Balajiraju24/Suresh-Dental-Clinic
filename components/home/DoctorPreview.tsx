import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, CheckCircle2, FlaskConical, Award } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { Card } from "@/components/shared/Card";

export function DoctorPreview() {
  const { doctor, associateDoctor } = clinicConfig;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-950 dark:to-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="clinic-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-3">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>Clinical Team &amp; Research</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Experienced Clinical Leadership &amp; Modern Research
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Our practice unites doctoral-level expertise in periodontics and implantology with active institutional research in biomaterials and tissue engineering.
          </p>
        </div>

        {/* 2-Column Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Card 1: Lead Doctor - Dr. R. Suresh */}
          <Card padding="none" className="overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              {/* Doctor Visual Header Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 sm:p-8 text-white relative">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/90 text-sky-300 border border-sky-700/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span>Clinical Leadership</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Periodontics &amp; Implants
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Portrait */}
                  <div className="relative w-36 sm:w-40 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 flex-shrink-0">
                    <Image
                      src={doctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                      alt={doctor.photoPlaceholderAlt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Degrees */}
                  <div className="text-center sm:text-left space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {doctor.fullName}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                      <span>{doctor.qualificationsDisplay}</span>
                    </p>
                    <p className="text-xs text-slate-300 font-medium block">
                      {doctor.role}
                    </p>
                    <p className="text-[11px] text-amber-300/80 italic">
                      * Master of Dental Surgery (MDS), PhD, Doctor of Science (DSc)
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-5 bg-white dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {doctor.shortBio}
                </p>

                {/* Focus points */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Clinical Focus &amp; Expertise:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Advanced Periodontal Therapy &amp; Subgingival Debridement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Evidence-Guided Dental Implantology &amp; Bone Restoration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Conservative Dentition Retention &amp; Preventative Care</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 pt-0 bg-white dark:bg-slate-900">
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href="/about#lead-doctor"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors group"
                >
                  <span>View Clinical Leadership Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <span className="text-[11px] text-slate-400">R.A. Puram, Chennai</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Associate Doctor - Dr. Ashritha Suresh */}
          <Card padding="none" className="overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              {/* Doctor Visual Header Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 text-white relative">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/90 text-teal-300 border border-teal-700/80">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
                    <span>Associate Surgeon &amp; Researcher</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    IIT Madras Research Fellow
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Portrait */}
                  <div className="relative w-36 sm:w-40 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 flex-shrink-0">
                    <Image
                      src={associateDoctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                      alt={associateDoctor.photoPlaceholderAlt}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Degrees */}
                  <div className="text-center sm:text-left space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {associateDoctor.fullName}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      <Award className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
                      <span>{associateDoctor.qualificationsDisplay} (Sri Ramachandra)</span>
                    </p>
                    <p className="text-xs text-slate-300 font-medium block">
                      {associateDoctor.role}
                    </p>
                    <p className="text-[11px] text-teal-200/80">
                      Grade: 3.83 (Distinction) &bull; Research Asst. at IIT Madras
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-5 bg-white dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {associateDoctor.shortBio}
                </p>

                {/* Focus points */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Clinical &amp; Research Focus:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>General &amp; Restorative Dentistry and Preventive Diagnostics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Cell Culture &amp; Polymer Biomaterial Scaffolds (IIT Madras)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                      <span>Microfluidics &amp; Cellular Regenerative Applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 pt-0 bg-white dark:bg-slate-900">
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href="/about#associate-doctor"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors group"
                >
                  <span>View Research &amp; Clinical Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <span className="text-[11px] text-slate-400">IIT Madras &bull; R.A. Puram</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
