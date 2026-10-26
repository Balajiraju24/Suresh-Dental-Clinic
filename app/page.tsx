import React from "react";
import { Hero } from "@/components/home/Hero";
import { IntroSection } from "@/components/home/IntroSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { DoctorPreview } from "@/components/home/DoctorPreview";
import { PatientInfoSection } from "@/components/home/PatientInfoSection";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <IntroSection />
      <FeaturedServices />
      <WhyChooseUs />
      <DoctorPreview />
      <PatientInfoSection />
      <FAQSection />
      <ContactCTA />
    </div>
  );
}
