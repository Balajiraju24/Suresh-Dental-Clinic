import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Accordion, AccordionItem } from "@/components/shared/Accordion";

export function FAQSection() {
  const faqItems: AccordionItem[] = [
    {
      id: "faq-first-appointment",
      question: "What should I expect during my first dental appointment?",
      answer: "Your initial appointment centres on a thorough clinical assessment. This typically includes reviewing your medical and dental history, examining teeth, gums, and oral soft tissues, and discussing any specific symptoms or goals. If necessary, low-dose digital radiographs may be recommended to check underlying bone and interdental spaces. Treatment options and preventive strategies are then explained without pressure."
    },
    {
      id: "faq-dental-implants",
      question: "What are dental implants and who is a candidate?",
      answer: "A dental implant is a biocompatible titanium fixture surgically positioned in the alveolar bone to replace a missing tooth root. Suitability depends on several clinical factors, including the volume and density of jawbone, periodontal health, and general systemic wellness. A comprehensive clinical and radiographic assessment is necessary to determine whether implants or preliminary bone preservation procedures are suitable for your situation."
    },
    {
      id: "faq-gum-problems",
      question: "When should I consult a dentist about gum problems?",
      answer: "You should seek a clinical evaluation if you notice bleeding when brushing or flossing, persistent bad breath, tender or swollen gums, gum recession that exposes tooth roots, or loose teeth. Healthy gums do not bleed upon routine cleaning. Early intervention can prevent mild gingivitis from progressing into irreversible periodontitis."
    },
    {
      id: "faq-request-appointment",
      question: "How can I request an appointment at the clinic?",
      answer: "You can submit an appointment enquiry through our online contact form, indicating your preferred consultation day and time. Prior appointments are preferentially scheduled to ensure dedicated, unhurried time for your examination. When our telephone service is active, direct phone bookings will also be available."
    },
    {
      id: "faq-what-to-bring",
      question: "What information should I bring to my consultation?",
      answer: "Please bring a list of any current prescription or over-the-counter medications, notes on relevant medical conditions (such as diabetes, cardiovascular conditions, or osteoporosis medications), and details of prior dental treatments or recent dental radiographs if you have copies."
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="clinic-container">
        <SectionHeader
          badge="Frequently Asked Questions"
          title="Common Questions About Dental Consultations"
          subtitle="Carefully formulated answers to help you understand appointments, periodontal care, and restorative options."
        />

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <Accordion items={faqItems} defaultOpenId="faq-first-appointment" />

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <p>
              Have a question that is not addressed here?
            </p>
            <Link
              href="/contact#appointment-form"
              className="inline-flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
            >
              <span>Submit a General Enquiry</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
