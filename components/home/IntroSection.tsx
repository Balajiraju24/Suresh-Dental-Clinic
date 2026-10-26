import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Shield, Heart } from "lucide-react";
import { clinicConfig } from "@/config/clinic";

export function IntroSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="clinic-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual column: Consultation setting */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3] bg-slate-100">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Consultation desk with digital diagnostic display in a calm, modern dental practice"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-medium bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  Consultation &amp; Diagnostic Room
                </span>
              </div>
            </div>
          </div>

          {/* Copy column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
              <span>Patient-Centred Dental Practice</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
              A Thoughtful Approach to Dental Health &amp; Long-Term Tooth Preservation
            </h2>

            <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                Dental care is most effective when built on mutual trust, careful listening,
                and thorough clinical evaluation. At {clinicConfig.displayName}, every consultation
                begins with understanding your specific oral health concerns, past experiences,
                and personal treatment objectives.
              </p>
              <p>
                Under the clinical direction of {clinicConfig.doctor.formalTitle}, our focus is
                rooted in evidence-based practice: addressing root causes such as periodontal
                inflammation and bone health before considering restorative interventions or
                dental implant placement.
              </p>
            </div>

            {/* Core Values checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-slate-700 font-medium">
                  Detailed clinical explanations before any treatment
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-slate-700 font-medium">
                  Priority given to natural tooth preservation
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-slate-700 font-medium">
                  Calm, unhurried consultation environment
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-slate-700 font-medium">
                  Strict hygiene and infection control standards
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 font-semibold text-base group"
              >
                <span>Read More About Our Clinical Philosophy</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
