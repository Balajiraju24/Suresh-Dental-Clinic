/**
 * Central Clinic Configuration for Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre
 * 
 * NOTE: This website is developed as a complimentary project for a friend's dental practice.
 * All clinical, contact, and biographical data here are subject to official verification
 * before public production launch.
 */

export interface VerificationChecklistItem {
  id: string;
  field: string;
  status: "verified" | "pending_clinic_review" | "placeholder_used";
  notes: string;
}

export interface ClinicConfig {
  clinicName: string;
  displayName: string;
  legalEntityName: string | null;
  tagline: string;
  description: string;
  
  // Verification flags
  verification: {
    isPreviewMode: boolean;
    clinicNameVerified: boolean;
    locationVerified: boolean;
    contactNumbersVerified: boolean;
    doctorBioVerified: boolean;
    registrationVerified: boolean;
    checklist: VerificationChecklistItem[];
  };

  // Location & Address Details
  location: {
    locality: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    postalCode: string | null;
    streetAddress: string | null; // e.g. Door No., Street Name (to be verified)
    fullAddressDisplay: string;
    googleMapsDirectionsUrl: string | null;
    landmarksNearby: string[];
  };

  // Contact Information
  contact: {
    phoneNumber: string | null; // Actual working phone to be provided by clinic
    displayPhone: string;
    isPhoneVerified: boolean;
    
    whatsappNumber: string | null; // E.164 format without spaces, e.g. "+91..."
    displayWhatsapp: string;
    isWhatsappVerified: boolean;
    
    emailAddress: string | null;
    displayEmail: string;
    isEmailVerified: boolean;

    appointmentBookingUrl: string | null;
    preferredContactMethod: "phone" | "whatsapp" | "form" | "in_person";
  };

  // Operating Hours
  hours: {
    regularSchedule: {
      days: string;
      morningSlot: string | null;
      eveningSlot: string | null;
      fullDayDisplay: string;
      isVerified: boolean;
    }[];
    emergencyNote: string;
    consultationNotice: string;
  };

  // Doctor Profile (Dr. R. Suresh)
  doctor: {
    fullName: string;
    salutation: string;
    formalTitle: string;
    verifiedQualifications: string[]; // MDS, PhD, DSc
    qualificationsDisplay: string;
    primarySpecialty: string;
    secondarySpecialty: string;
    medicalRegistrationNumber: string | null; // To be confirmed by clinic
    stateDentalCouncil: string | null; // e.g. Tamil Nadu Dental Council
    
    // Bio & Practice Philosophy
    shortBio: string;
    detailedPhilosophy: string[];
    academicBackgroundNote: string;
    
    // Media & Visuals
    profilePhotoUrl: string | null; // null triggers high-fidelity fallback placeholder
    photoPlaceholderAlt: string;
  };

  // Social & Web Links
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
}

export const clinicConfig: ClinicConfig = {
  clinicName: "Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre",
  displayName: "Dr. Suresh Dental Clinic & Implant Centre",
  legalEntityName: null,
  tagline: "Expert Dental Care. A Healthier, More Confident Smile.",
  description: "Personalised dental care, periodontal treatments, and advanced implant dentistry provided in a welcoming, patient-centred clinical environment in Raja Annamalaipuram, Chennai.",

  verification: {
    isPreviewMode: true,
    clinicNameVerified: false,
    locationVerified: false,
    contactNumbersVerified: false,
    doctorBioVerified: false,
    registrationVerified: false,
    checklist: [
      {
        id: "clinic-name",
        field: "Official Clinic Name",
        status: "pending_clinic_review",
        notes: "Currently using initial specification: 'Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre'."
      },
      {
        id: "exact-address",
        field: "Clinic Street Address & Pincode",
        status: "placeholder_used",
        notes: "Initial area noted as Raja Annamalaipuram (R.A. Puram), Chennai. Exact door number, street, and postal code required."
      },
      {
        id: "contact-phone",
        field: "Primary Telephone / Mobile",
        status: "placeholder_used",
        notes: "No working phone number provided. Interactive calling disabled until clinic provides official contact line."
      },
      {
        id: "whatsapp-enquiry",
        field: "WhatsApp Consultation Line",
        status: "placeholder_used",
        notes: "WhatsApp direct chat link pending clinic mobile confirmation."
      },
      {
        id: "doctor-registration",
        field: "Dental Council Registration",
        status: "pending_clinic_review",
        notes: "State Dental Council (TNDC) registration number to be confirmed for clinical transparency."
      },
      {
        id: "doctor-portrait",
        field: "Official Doctor Portrait Photograph",
        status: "placeholder_used",
        notes: "Dignified clinical placeholder avatar in use; to be replaced with high-resolution clinic headshot upon receipt."
      },
      {
        id: "consultation-hours",
        field: "Clinic Operating Timings",
        status: "pending_clinic_review",
        notes: "Provisional hours: Mon – Sun (Morning: 10:00 AM – 1:00 PM | Evening: 4:00 PM – 8:00 PM). Pending confirmation by the clinic."
      }
    ]
  },

  location: {
    locality: "Raja Annamalaipuram (R.A. Puram)",
    suburb: "R.A. Puram",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: null, // Pending verification (e.g. 600028)
    streetAddress: null, // Pending verification
    fullAddressDisplay: "Raja Annamalaipuram (R.A. Puram), Chennai, Tamil Nadu, India",
    googleMapsDirectionsUrl: null, // Will be set to official Google Maps pin once clinic confirms address
    landmarksNearby: ["Near R.A. Puram Main Road", "South Chennai"]
  },

  contact: {
    phoneNumber: null, // Explicit null to avoid fake numbers
    displayPhone: "Contact details pending clinic confirmation",
    isPhoneVerified: false,

    whatsappNumber: null, // Explicit null
    displayWhatsapp: "WhatsApp line pending verification",
    isWhatsappVerified: false,

    emailAddress: null,
    displayEmail: "enquiries@sureshdental.clinic (pending confirmation)",
    isEmailVerified: false,

    appointmentBookingUrl: null,
    preferredContactMethod: "form"
  },

  hours: {
    regularSchedule: [
      {
        days: "Monday – Sunday",
        morningSlot: "10:00 AM – 01:00 PM",
        eveningSlot: "04:00 PM – 08:00 PM",
        fullDayDisplay: "Mon – Sun: 10:00 AM – 1:00 PM | 4:00 PM – 8:00 PM",
        isVerified: false
      }
    ],
    emergencyNote: "For urgent dental concerns, please contact the clinic in advance to ensure specialist availability.",
    consultationNotice: "These are provisional consultation hours and are pending confirmation by the clinic. Please contact the clinic to confirm availability before visiting."
  },

  doctor: {
    fullName: "Dr. R. Suresh",
    salutation: "Dr.",
    formalTitle: "Dr. R. Suresh, MDS, PhD, DSc",
    verifiedQualifications: ["MDS", "PhD", "DSc"],
    qualificationsDisplay: "MDS, PhD, DSc",
    primarySpecialty: "Periodontics & Implantology",
    secondarySpecialty: "Oral Health & Comprehensive Preventive Dentistry",
    medicalRegistrationNumber: null,
    stateDentalCouncil: "Tamil Nadu Dental Council (Registration pending verification)",
    
    shortBio: "Dr. R. Suresh brings a distinguished academic foundation holding MDS, PhD, and DSc degrees, focusing on clinical precision, evidence-based periodontal therapy, and implant dentistry.",
    detailedPhilosophy: [
      "Patient-first clinical approach emphasising clear diagnosis and patient comfort at every stage.",
      "Conservative treatment philosophy: preserving natural dentition and alveolar structures wherever possible.",
      "Evidence-guided implantology adhering to established international surgical and restorative protocols.",
      "Transparent dialogue regarding treatment options, clinical risks, and preventive maintenance."
    ],
    academicBackgroundNote: "Detailed biographical history, specialized fellowships, and clinical milestones will be published upon verified clinic approval.",
    
    profilePhotoUrl: null, // Uses /images/doctor-placeholder.svg gracefully
    photoPlaceholderAlt: "Dr. R. Suresh clinical portrait frame (Official portrait to be updated upon clinic verification)"
  },

  social: {
    facebook: null,
    instagram: null,
    linkedin: null,
    youtube: null
  }
};
