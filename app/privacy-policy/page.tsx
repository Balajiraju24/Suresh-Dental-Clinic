import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Draft Privacy Policy & Medical Disclaimer | Dr. R. Suresh Dental Clinic",
  description: "Draft healthcare privacy policy and general medical information disclaimer for Dr. R. Suresh Dental Clinic and Implant Centre in Raja Annamalaipuram, Chennai.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy &amp; Clinical Disclaimer
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 mb-3">
              <Shield className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>Healthcare Governance</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Privacy Policy &amp; Medical Disclaimer (Draft)
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Last updated: October 2026 &bull; Initial Clinical Draft for Preview Review
            </p>
          </div>

          {/* Legal Compliance Notice */}
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <span className="font-semibold">Review Notice:</span> This privacy policy is a development draft prepared for clinic consultation. It does not claim full legal compliance under applicable Indian healthcare data protection acts (such as the Digital Personal Data Protection Act) until formally audited by legal counsel.
            </p>
          </div>

          <Card className="p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                1. General Medical Information Disclaimer
              </h2>
              <p>
                All informational materials, service descriptions, diagrams, and educational articles provided on this website are published solely for general health education and patient awareness.
              </p>
              <p>
                No content on this website constitutes a personalised clinical diagnosis, treatment prescription, or clinical endorsement of universal treatment suitability. You should never delay seeking professional medical or dental evaluation due to content viewed on this website.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                2. Collection of Patient Contact Details
              </h2>
              <p>
                In the current website prototype, the appointment enquiry form operates as a frontend demonstration and does not transmit confidential medical records to an external server or store health data in local web storage.
              </p>
              <p>
                Upon public production deployment with an active submission gateway, the clinic collects only the necessary contact information (name, telephone/mobile number, email, and preferred consultation timing) strictly for the purpose of communicating appointment logistics.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                3. Confidentiality of Health Information
              </h2>
              <p>
                {clinicConfig.clinicName} observes standard medical confidentiality. Detailed medical histories, radiographic records (OPG / CBCT), and dental treatment records are acquired strictly within the physical clinical operatory during in-person consultations and are maintained confidentially in accordance with Dental Council of India (DCI) professional conduct regulations.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                4. Third-Party Tracking &amp; Analytics
              </h2>
              <p>
                This static website does not embed commercial tracking pixels, behavioural retargeting scripts, or third-party advertising cookies. Only essential hosting and functional assets required to deliver the static pages securely are utilised.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                5. Contact for Privacy Inquiries
              </h2>
              <p>
                For questions regarding this draft policy or the handling of patient communication data, inquiries may be addressed to:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <p className="font-semibold">{clinicConfig.clinicName}</p>
                <p>{clinicConfig.location.fullAddressDisplay}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Status: Pre-launch Verification Review</p>
              </div>
            </section>
          </Card>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
