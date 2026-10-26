/**
 * Navigation items for Dr. R. Suresh Dental Clinic & Implant Centre
 */

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  isExternal?: boolean;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/"
  },
  {
    title: "About",
    href: "/about",
    description: "Learn about Dr. R. Suresh and our patient-centred care philosophy."
  },
  {
    title: "Services",
    href: "/services",
    description: "Explore our clinical focus in implantology and periodontal health."
  },
  {
    title: "Patient Information",
    href: "/patient-information",
    description: "Guidance on preparing for your consultation and common questions."
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Locate our clinic in R.A. Puram, Chennai, and send an enquiry."
  }
];

export const footerServiceLinks: NavItem[] = [
  {
    title: "Dental Implants",
    href: "/services/dental-implants"
  },
  {
    title: "Periodontal Care & Gum Health",
    href: "/services/periodontal-care"
  },
  {
    title: "General Dental Consultations",
    href: "/services#general-consultations"
  },
  {
    title: "Root Canal Treatment",
    href: "/services#root-canal-treatment"
  },
  {
    title: "Laser Dentistry",
    href: "/services#laser-dentistry"
  }
];

export const footerPatientLinks: NavItem[] = [
  {
    title: "Preparing for Your First Visit",
    href: "/patient-information#first-visit"
  },
  {
    title: "Understanding Dental Implants",
    href: "/services/dental-implants#overview"
  },
  {
    title: "Signs of Periodontal Disease",
    href: "/services/periodontal-care#indications"
  },
  {
    title: "Patient Consultation FAQs",
    href: "/patient-information#faqs"
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy"
  }
];
