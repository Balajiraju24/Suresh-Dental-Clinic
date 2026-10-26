import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardCheck, FileText, Clock, ArrowRight, ShieldCheck, Calendar } from "lucide-react";
import { clinicConfig } from "@/config/clinic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Accordion, AccordionItem } from "@/components/shared/Accordion";
import { Card } from "@/components/shared/Card";

export const metadata: Metadata = {
  title: "Patient Information & First Visit Guide | Dr. R. Suresh Dental Clinic Chennai",
  description: "Prepare for your dental consultation with Dr. R. Suresh in Raja Annamalaipuram, Chennai. What to bring, what to expect, and evidence-based patient guidance.",
  alternates: {
    canonical: "/patient-information"
  }
};

export default function PatientInformationPage() {
  const patientFaqs: AccordionItem[] = [
    {
      id: "pi-faq-1",
      question: "How long does a first dental consultation usually take?",
      answer: "A comprehensive initial appointment typically lasts between 30 and 45 minutes. This allows sufficient unhurried time to review your systemic health, conduct a thorough clinical inspection of your teeth and periodontal tissues, take digital radiographs if indicated, and discuss findings together."
    },
    {
      id: "pi-faq-2",
      question: "What should I do if I feel nervous or anxious about dental examinations?",
      answer: "Dental anxiety is very common. Please let our team know when scheduling your visit or when you arrive. Our clinicians maintain a calm, gentle clinical pace, explain each step before it happens, and you are always in complete control—you can pause the examination at any time simply by raising your hand."
    },
    {
      id: "pi-faq-3",
      question: "Do I need to stop taking my regular systemic medications before visiting?",
      answer: "In general, you should continue taking your prescribed systemic medications as directed by your physician (including blood pressure, thyroid, or diabetes medicines) unless specifically instructed otherwise by your doctor. Always bring an up-to-date list of all current medications, especially blood thinners or bone density therapies."
    },
    {
      id: "pi-faq-4",
      question: "Will treatment begin on the day of my first consultation?",
      answer: "Except for urgent pain relief or emergency stabilisation, the first visit is dedicated to diagnosis, recording clinical baselines, and transparently discussing treatment plans. Definitive procedures (such as periodontal scaling, root canal therapy, or surgical implant placement) are scheduled following careful clinical planning."
    },
    {
      id: "pi-faq-5",
      question: "How are consultation fees and treatment estimates handled?",
      answer: "Treatment options, alternative clinical pathways, and associated costs are discussed openly prior to commencing any elective or restorative procedures. We believe in complete transparency so you can make informed decisions about your oral care."
    }
  ];

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
              Patient Information
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <SectionHeader
          badge="Patient Care Resources"
          title="Patient Information &amp; Consultation Guidance"
          subtitle="Everything you need to know before visiting our clinic in Raja Annamalaipuram, Chennai."
        />

        {/* Disclaimer / Tone Note */}
        <div className="mb-12 max-w-3xl mx-auto p-4 bg-sky-50/80 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-900/60 text-xs sm:text-sm text-sky-950 dark:text-sky-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-700 dark:text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            This guide is intended to provide calm, transparent, and evidence-based information for patients visiting {clinicConfig.displayName}. It is educational and does not replace personalised clinical diagnostic advice.
          </p>
        </div>

        {/* Preparing for Your First Consultation */}
        <div id="first-visit" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 mb-16 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Checklist &amp; Preparation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-1">
              Preparing for Your First Consultation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
              Having the relevant information prepared helps us provide the most comprehensive evaluation of your oral health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-50/60 dark:bg-slate-800/80 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  1. Medical History Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bring a list of any known systemic health conditions (such as diabetes, hypertension, heart conditions, or osteoporosis) and any known drug allergies.
                </p>
              </div>
            </Card>

            <Card className="bg-slate-50/60 dark:bg-slate-800/80 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  2. Current Medications
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Note down all prescription medications, blood thinners, immunosuppressants, or dietary supplements you regularly take, including dosage.
                </p>
              </div>
            </Card>

            <Card className="bg-slate-50/60 dark:bg-slate-800/80 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  3. Previous Dental Records
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  If you have recent panoramic radiographs (OPGs), CBCT scans, or notes from previous dental providers, bring digital or printed copies.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* What to Expect During the Appointment */}
        <div className="mb-16">
          <SectionHeader
            badge="Consultation Walkthrough"
            title="What to Expect During Your Clinical Visit"
            subtitle="A structured, unhurried appointment sequence designed around patient comfort and diagnostic clarity."
            alignment="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-sky-700 dark:text-sky-400 block mb-2">01</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Listening &amp; Discussion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We review your primary reason for visiting, any pain, aesthetic goals, or past dental concerns.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-teal-700 dark:text-teal-400 block mb-2">02</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Comprehensive Examination
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Careful inspection of tooth surfaces, periodontal tissue attachment, bite alignment, and oral mucosa.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 block mb-2">03</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Diagnostic Imaging
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If clinically indicated, low-dose digital radiographs provide visibility into interproximal areas and bone height.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block mb-2">04</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Personalised Care Plan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A clear explanation of clinical findings, preventive recommendations, and treatment options with no obligation.
              </p>
            </div>
          </div>
        </div>

        {/* Treatment Information Quick Links */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Treatment Guides
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              Explore In-Depth Clinical Guides
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Read comprehensive educational resources authored to explain clinical indications and biological mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Dental Implants &amp; Restorations
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Learn about titanium fixtures, bone integration, single and multi-tooth restorations, and peri-implant hygiene.
                </p>
              </div>
              <Link
                href="/services/dental-implants"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300"
              >
                <span>Read Dental Implants Guide</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Periodontal Care &amp; Gum Health
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Understand the progression from gingivitis to periodontitis, warning signs, scaling and root planing, and bone stability.
                </p>
              </div>
              <Link
                href="/services/periodontal-care"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300"
              >
                <span>Read Periodontal Care Guide</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Patient Consultation FAQs */}
        <div id="faqs" className="mb-16">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Guidance &amp; Clarification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-1">
              Patient Consultation FAQs
            </h2>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <Accordion items={patientFaqs} defaultOpenId="pi-faq-1" />
          </div>
        </div>

        {/* Consultation Call to Action */}
        <div className="text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mb-3">
            Ready to Schedule Your Dental Visit?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Contact {clinicConfig.displayName} in Raja Annamalaipuram, Chennai, to request a convenient consultation appointment.
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
