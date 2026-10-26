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

export interface DoctorProfile {
  id: string;
  fullName: string;
  salutation: string;
  formalTitle: string;
  role: string;
  verifiedQualifications: string[];
  qualificationsDisplay: string;
  primarySpecialty: string;
  secondarySpecialty: string;
  medicalRegistrationNumber: string | null;
  stateDentalCouncil: string | null;
  education?: {
    degree: string;
    institution: string;
    duration: string;
    honors?: string;
  }[];
  researchExperience?: {
    role: string;
    institution: string;
    duration: string;
    highlights: string[];
  }[];
  shortBio: string;
  detailedPhilosophy: string[];
  academicBackgroundNote?: string;
  profilePhotoUrl: string | null;
  photoPlaceholderAlt: string;
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
    streetAddress: string | null;
    fullAddressDisplay: string;
    googleMapsDirectionsUrl: string | null;
    landmarksNearby: string[];
  };

  // Contact Information
  contact: {
    phoneNumber: string | null;
    displayPhone: string;
    isPhoneVerified: boolean;
    
    whatsappNumber: string | null;
    displayWhatsapp: string | null;
    isWhatsappVerified: boolean;
    
    emailAddress: string | null;
    displayEmail: string;
    isEmailVerified: boolean;

    appointmentBookingUrl: string | null;
    preferredContactMethod: "phone" | "whatsapp" | "form" | "in_person";
    googleScriptEndpoint: string | null;
    adminNotificationEmail: string;
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

  // Lead Doctor Profile (Dr. R. Suresh)
  doctor: DoctorProfile;

  // Associate Doctor Profile (Dr. Ashritha Suresh)
  associateDoctor: DoctorProfile;

  // Full Clinical Team
  team: DoctorProfile[];

  // Social & Web Links
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
}

export const leadDoctor: DoctorProfile = {
  id: "dr-r-suresh",
  fullName: "Dr. R. Suresh",
  salutation: "Dr.",
  formalTitle: "Dr. R. Suresh, MDS, PhD, DSc",
  role: "Lead Periodontist & Implantologist",
  verifiedQualifications: ["MDS", "PhD", "DSc"],
  qualificationsDisplay: "MDS, PhD, DSc",
  primarySpecialty: "Periodontics & Implantology",
  secondarySpecialty: "Comprehensive Oral Rehabilitation & Preventive Dentistry",
  medicalRegistrationNumber: null,
  stateDentalCouncil: "Tamil Nadu Dental Council (Registration pending verification)",
  
  shortBio: "Dr. R. Suresh brings an exceptional academic and clinical pedigree holding MDS, PhD, and DSc degrees, focusing on surgical precision, evidence-based periodontal therapy, and advanced implant dentistry in Raja Annamalaipuram, Chennai.",
  detailedPhilosophy: [
    "Patient-first clinical approach emphasising clear diagnosis and gentle comfort at every stage.",
    "Conservative treatment philosophy: preserving natural dentition and alveolar structures wherever possible.",
    "Evidence-guided implantology adhering to established international surgical and restorative protocols.",
    "Transparent dialogue regarding treatment options, clinical risks, and preventive maintenance."
  ],
  academicBackgroundNote: "Detailed biographical history, specialized fellowships, and clinical milestones will be published upon verified clinic approval.",
  
  profilePhotoUrl: null, // Gracefully renders dignified placeholder avatar
  photoPlaceholderAlt: "Dr. R. Suresh clinical portrait frame (Official portrait to be updated upon clinic verification)"
};

export const associateDoctor: DoctorProfile = {
  id: "dr-ashritha-suresh",
  fullName: "Dr. Ashritha Suresh",
  salutation: "Dr.",
  formalTitle: "Dr. Ashritha Suresh, BDS",
  role: "Associate Dental Surgeon & Biomaterials Researcher",
  verifiedQualifications: ["BDS"],
  qualificationsDisplay: "BDS",
  primarySpecialty: "General & Restorative Dentistry",
  secondarySpecialty: "Dental Biomaterials & Cellular Tissue Engineering",
  medicalRegistrationNumber: null,
  stateDentalCouncil: "Tamil Nadu Dental Council (Registration in progress)",
  
  education: [
    {
      degree: "Bachelor of Dental Surgery (BDS), Dentistry",
      institution: "Sri Ramachandra Institute Of Higher Education and Research",
      duration: "Aug 2018 – Nov 2023",
      honors: "Grade: 3.83"
    }
  ],
  researchExperience: [
    {
      role: "Research Assistant · Internship",
      institution: "Indian Institute of Technology, Madras (IIT Madras)",
      duration: "Sep 2024 – Present",
      highlights: [
        "Cell Culture Techniques: Conducting cell culture with fibroblast cells, including seeding, incubation, cryopreservation, and subculturing.",
        "Electrospinning of polymer biomaterials for regenerative tissue scaffolds.",
        "Flow cytometry for cellular analysis and characterization.",
        "Lithography techniques for creating microfluidic chip channels for diagnostic cellular analyses.",
        "Observed 3D-printed lung alveolar-sac fabrication for organ-on-a-chip microfluidic platforms.",
        "Observed optoporation for enzyme delivery into stem cells using titanium nanoparticles and fluorescence microscopy verification.",
        "Observed RT-PCR experiments for precise gene expression analysis."
      ]
    }
  ],
  
  shortBio: "Dr. Ashritha Suresh is a dedicated dental graduate from Sri Ramachandra Institute of Higher Education and Research (BDS, Grade: 3.83). Concurrently engaged in frontier biomedical research at IIT Madras in cell culture, electrospinning polymer biomaterials, and microfluidics, she bridges advanced materials science with gentle, evidence-informed clinical dentistry.",
  detailedPhilosophy: [
    "Integrating contemporary biomaterials research and minimally invasive techniques into everyday clinical dental practice.",
    "Patient-centric preventive care prioritizing gentle treatments and natural tooth structure preservation.",
    "Committed to clear patient communication, oral hygiene education, and compassionate, meticulous care."
  ],
  
  profilePhotoUrl: null,
  photoPlaceholderAlt: "Dr. Ashritha Suresh BDS clinical portrait frame"
};

export const clinicConfig: ClinicConfig = {
  clinicName: "Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre",
  displayName: "Dr. Suresh Dental Clinic & Implant Centre",
  legalEntityName: null,
  tagline: "Expert Dental Care. A Healthier, More Confident Smile.",
  description: "Personalised dental care, periodontal treatments, and advanced implant dentistry provided in a welcoming, patient-centred clinical environment in Raja Annamalaipuram, Chennai.",

  verification: {
    isPreviewMode: true,
    clinicNameVerified: true,
    locationVerified: true,
    contactNumbersVerified: true,
    doctorBioVerified: false,
    registrationVerified: false,
    checklist: [
      {
        id: "clinic-name",
        field: "Official Clinic Name",
        status: "verified",
        notes: "Confirmed: 'Dr. R. Suresh MDS, PhD, DSc Dental Clinic and Implant Centre'."
      },
      {
        id: "exact-address",
        field: "Clinic Street Address & Pincode",
        status: "verified",
        notes: "Verified via Google listing: Venkatraman St, Sector 1, Raja Annamalaipuram, Chennai, Tamil Nadu 600028, India."
      },
      {
        id: "contact-phone",
        field: "Primary Telephone / Mobile",
        status: "verified",
        notes: "Confirmed clinic telephone line: +91 75987 65787."
      },
      {
        id: "whatsapp-enquiry",
        field: "WhatsApp Consultation Line",
        status: "verified",
        notes: "Not required for now (per clinic preference)."
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
        status: "pending_clinic_review",
        notes: "Can be uploaded directly from Google Maps clinic photos. Dignified clinical placeholder avatar in use."
      },
      {
        id: "consultation-hours",
        field: "Clinic Operating Timings",
        status: "verified",
        notes: "Verified via Google Business Profile: Mon – Sat (Morning: 10:00 AM – 12:00 PM | Evening: 4:30 PM – 8:30 PM), Sunday: Closed."
      }
    ]
  },

  location: {
    locality: "Raja Annamalaipuram (R.A. Puram)",
    suburb: "Sector 1, R.A. Puram",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600028",
    streetAddress: "Venkatraman St, Sector 1",
    fullAddressDisplay: "Venkatraman St, Sector 1, Raja Annamalaipuram, Chennai, Tamil Nadu 600028, India",
    googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Dr.+R.+Suresh+Dental+Clinic+Venkatraman+St+Sector+1+Raja+Annamalaipuram+Chennai+600028",
    landmarksNearby: ["Venkatraman Street", "Sector 1 R.A. Puram", "Near R.A. Puram Main Road"]
  },

  contact: {
    phoneNumber: "+91 75987 65787",
    displayPhone: "+91 75987 65787",
    isPhoneVerified: true,

    whatsappNumber: null,
    displayWhatsapp: null,
    isWhatsappVerified: false,

    emailAddress: null,
    displayEmail: "enquiries@sureshdental.clinic (pending confirmation)",
    isEmailVerified: false,

    appointmentBookingUrl: null,
    preferredContactMethod: "phone",
    googleScriptEndpoint:
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbx5s7_gSL4hOn-vGAISKTY5yjCWmKn3K-4T5Qte3PGrQFEuh59BzHt4iUrrxlvmHXw/exec",
    adminNotificationEmail: "balajiraju24@gmail.com"
  },

  hours: {
    regularSchedule: [
      {
        days: "Monday – Saturday",
        morningSlot: "10:00 AM – 12:00 PM",
        eveningSlot: "04:30 PM – 08:30 PM",
        fullDayDisplay: "Mon – Sat: 10:00 AM – 12:00 PM | 4:30 PM – 8:30 PM",
        isVerified: true
      },
      {
        days: "Sunday",
        morningSlot: null,
        eveningSlot: null,
        fullDayDisplay: "Sunday: Closed",
        isVerified: true
      }
    ],
    emergencyNote: "For urgent dental concerns, please contact the clinic in advance to ensure specialist availability.",
    consultationNotice: "Consultation hours sourced from verified Google Business profile. Prior appointment scheduling is recommended before visiting."
  },

  // Lead Doctor Profile (Dr. R. Suresh)
  doctor: leadDoctor,

  // Associate Doctor Profile (Dr. Ashritha Suresh)
  associateDoctor: associateDoctor,

  // Full Clinical Team
  team: [leadDoctor, associateDoctor],

  // Social & Web Links
  social: {
    facebook: null,
    instagram: null,
    linkedin: null,
    youtube: null
  }
};
