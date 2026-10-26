import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { Card } from "@/components/shared/Card";

export function DoctorPreview() {
  const { doctor } = clinicConfig;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-950 dark:to-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="clinic-container">
        <div className="max-w-5xl mx-auto">
          <Card padding="none" className="overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Doctor Visual / Placeholder Column */}
              <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex flex-col justify-between text-white relative">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-800/60 mb-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span>Clinical Leadership</span>
                  </div>

                  {/* Dignified Clinical Portrait / Fallback Frame */}
                  <div className="relative mx-auto w-48 sm:w-56 aspect-[5/6] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 mb-6">
                    <Image
                      src={doctor.profilePhotoUrl || "/images/doctor-placeholder.svg"}
                      alt={doctor.photoPlaceholderAlt}
                      fill
                      sizes="(max-width: 768px) 220px, 250px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Verification Notice on Photo Card */}
                <div className="bg-slate-950/70 backdrop-blur-xs p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <p className="font-medium text-slate-300">
                    Official Clinic Portrait
                  </p>
                  <p className="text-[10px] text-amber-400/90 mt-0.5">
                    Pending clinic verification before public launch
                  </p>
                </div>
              </div>

              {/* Doctor Details Column */}
              <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-slate-900">
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Doctor Profile Preview
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
                      {doctor.fullName}
                    </h3>
                    <p className="text-sm font-semibold text-sky-700 dark:text-sky-400 mt-1 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                      <span>{doctor.qualificationsDisplay}</span>
                    </p>
                  </div>

                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                    <p>
                      {doctor.shortBio}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      * Verified qualification abbreviations: Master of Dental Surgery (MDS),
                      Doctor of Philosophy (PhD), Doctor of Science (DSc).
                    </p>
                  </div>

                  {/* Practice Focus Points */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Clinical Focus:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                        <span>Periodontics &amp; Gum Therapy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                        <span>Implantology &amp; Bone Health</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                        <span>Preventive Oral Medicine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" aria-hidden="true" />
                        <span>Long-Term Tooth Preservation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors group"
                  >
                    <span>View Detailed Professional Background</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>

                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    Registration details pending confirmation
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
