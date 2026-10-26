/**
 * Clinical Services Configuration for Dr. R. Suresh Dental Clinic & Implant Centre
 * 
 * Medical Content Note:
 * All descriptions are educational, evidence-based, and cautious.
 * They distinguish general medical knowledge from individual diagnostic advice.
 * Services marked as "provisional" require clinic confirmation before public launch.
 */

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "Implantology" | "Periodontics" | "General Dentistry" | "Endodontics" | "Advanced Dental Tech";
  shortDescription: string;
  educationalSummary: string;
  status: "confirmed_focus" | "provisional_proposed";
  hasDedicatedPage: boolean;
  href: string;
  iconName: "Tooth" | "ShieldCheck" | "Stethoscope" | "Sparkles" | "Activity" | "Smile";
  image?: string;
  clinicalIndications: string[];
  whatTreatmentInvolves: string[];
  procedureOverview: ProcedureStep[];
  patientSuitabilityNote: string;
  faqs: ServiceFAQ[];
  preparationAndAftercare: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "dental-implants",
    slug: "dental-implants",
    name: "Dental Implants",
    subtitle: "Permanent, bio-compatible tooth replacement for single or multiple missing teeth",
    category: "Implantology",
    shortDescription: "Precision titanium or zirconia fixtures placed in the alveolar bone to support individual crowns, bridges, or full-arch restorations.",
    educationalSummary: "Dental implants are titanium posts surgically placed into the jawbone beneath your gums. Once in place, they allow your dentist to mount replacement teeth onto them through a biological process called osseointegration.",
    status: "confirmed_focus",
    hasDedicatedPage: true,
    href: "/services/dental-implants",
    iconName: "Tooth",
    image: "/images/dental-implants.jpg",
    clinicalIndications: [
      "Loss of one or more teeth due to trauma, decay, or periodontal conditions",
      "Desire to restore masticatory function without grinding down adjacent healthy teeth (as required for conventional bridges)",
      "Loose or uncomfortable partial or complete dentures requiring stable anchoring",
      "Sufficient quality and volume of alveolar bone, or suitability for bone grafting procedures",
      "Good general systemic health and controlled oral hygiene"
    ],
    whatTreatmentInvolves: [
      "Comprehensive clinical assessment including digital panoramic radiography or CBCT 3D bone imaging",
      "Pre-surgical evaluation of bite alignment, bone density, and gingival biotype",
      "Precision placement of the sterile medical-grade implant post into the jawbone under local anaesthesia",
      "A biological healing period (typically 8 to 16 weeks) to facilitate direct osseointegration",
      "Placement of a custom abutment and fitting of an aesthetically matched ceramic or zirconia crown",
      "Structured maintenance and periodontal monitoring schedule to ensure long-term peri-implant stability"
    ],
    procedureOverview: [
      {
        stepNumber: 1,
        title: "Initial Consultation & Diagnostic Imaging",
        description: "Your dentist conducts a thorough clinical examination, reviewing your medical history and acquiring high-resolution 3D radiographic scans to assess bone width, height, and proximity to anatomical landmarks."
      },
      {
        stepNumber: 2,
        title: "Treatment Planning & Site Preparation",
        description: "A tailored restorative plan is devised. If bone resorption has occurred, preliminary treatments such as sinus elevation or ridge preservation bone grafts may be discussed."
      },
      {
        stepNumber: 3,
        title: "Surgical Placement of the Implant",
        description: "The dental implant fixture is gently seated into the prepared alveolar bone site under profound local anaesthesia in a sterile clinical environment."
      },
      {
        stepNumber: 4,
        title: "Healing & Osseointegration",
        description: "During the subsequent healing interval, bone cells proliferate directly along the micro-textured titanium surface, creating a permanent, rigid biological bond."
      },
      {
        stepNumber: 5,
        title: "Abutment & Custom Crown Delivery",
        description: "Once osseointegration is clinically and radiographically verified, an abutment is connected and a custom-shaded crown is delivered to restore natural aesthetics and chewing function."
      }
    ],
    patientSuitabilityNote: "Dental implant therapy requires individual clinical evaluation. Suitability depends on alveolar bone volume, periodontal health, systemic medical conditions (e.g. uncontrolled diabetes, bisphosphonate medication), and tobacco habits. Implants cannot be guaranteed, and rigorous oral hygiene is essential to prevent peri-implantitis.",
    faqs: [
      {
        question: "What is the biological difference between a dental implant and a bridge?",
        answer: "A conventional bridge replaces a missing tooth by anchoring onto the two adjacent natural teeth, requiring them to be shaped and crowned. In contrast, a dental implant stands independently as an artificial tooth root anchored directly in the jawbone, preserving adjacent enamel and stimulating the underlying bone."
      },
      {
        question: "Is the implant placement procedure painful?",
        answer: "Implant placement is routinely performed under local anaesthesia, ensuring the surgical area is completely numb. Most patients experience mild post-operative discomfort, comparable to a routine tooth extraction, which is typically managed with standard mild analgesics."
      },
      {
        question: "How long do dental implants typically last?",
        answer: "With rigorous oral hygiene, regular professional dental examinations, and daily flossing, dental implants have very high longevity rates. However, like natural teeth, implants are susceptible to gum infection (peri-implant mucositis and peri-implantitis) if plaque accumulates."
      },
      {
        question: "What if I do not have enough jawbone for an implant?",
        answer: "When teeth have been missing for an extended period, the alveolar bone naturally resorbs. In such circumstances, preparatory bone augmentation or sinus floor lifting procedures can often restore sufficient bone volume before or during implant placement."
      }
    ],
    preparationAndAftercare: [
      "Avoid smoking or tobacco use before and after surgery, as nicotine impairs microvascular healing and bone integration.",
      "Adhere strictly to prescribed antimicrobial mouth rinses and prescribed oral medication.",
      "Consume soft, nutrient-rich foods at room temperature for the first few days following placement.",
      "Maintain meticulous plaque control around natural teeth while avoiding direct vigorous brushing on the surgical site during early healing."
    ]
  },
  {
    id: "periodontal-care",
    slug: "periodontal-care",
    name: "Periodontal Care & Gum Health",
    subtitle: "Specialised diagnosis, prevention, and treatment of gingival diseases and periodontal structures",
    category: "Periodontics",
    shortDescription: "Comprehensive periodontal evaluation, ultrasonic scaling, root planing, and corrective periodontal therapies to preserve natural teeth.",
    educationalSummary: "Periodontics focuses on the prevention, diagnosis, and clinical treatment of diseases affecting the supporting tissues of the teeth, including the gingiva (gums), periodontal ligament, cementum, and alveolar bone.",
    status: "confirmed_focus",
    hasDedicatedPage: true,
    href: "/services/periodontal-care",
    iconName: "ShieldCheck",
    image: "/images/periodontal-care.jpg",
    clinicalIndications: [
      "Bleeding gums during toothbrushing or flossing (early sign of gingivitis)",
      "Persistent bad breath (halitosis) or an unpleasant taste in the mouth",
      "Red, swollen, or tender gingival tissues",
      "Receding gums that make teeth appear longer or cause thermal sensitivity",
      "Formation of deep periodontal pockets between teeth and gums",
      "Loose teeth, shifting tooth positions, or changes in how teeth fit together when biting"
    ],
    whatTreatmentInvolves: [
      "Periodontal probing to measure sulcus pocket depths and detect bleeding on probing (BOP)",
      "Diagnostic radiographic analysis of crestal alveolar bone levels",
      "Subgingival ultrasonic debridement to disrupt bacterial biofilm and calculus (tartar)",
      "Root surface debridement (scaling and root planing) to smooth root surfaces and facilitate gingival reattachment",
      "Personalised home oral hygiene instruction tailored to individual interdental spaces",
      "Evaluation of periodontal maintenance intervals (typically every 3 to 6 months depending on disease severity)"
    ],
    procedureOverview: [
      {
        stepNumber: 1,
        title: "Comprehensive Periodontal Examination",
        description: "A periodontal probe measures the depth of the space between each tooth and the surrounding gum tissue across 6 sites per tooth. Depths greater than 3mm may indicate loss of attachment."
      },
      {
        stepNumber: 2,
        title: "Plaque & Calculus Assessment",
        description: "Hardened mineral deposits (calculus) harbor pathogenic bacterial colonies. The extent of supragingival and subgingival deposits is mapped."
      },
      {
        stepNumber: 3,
        title: "Non-Surgical Debridement (Scaling & Root Planing)",
        description: "Specialised ultrasonic scalers and micro-curettes gently remove subgingival biofilm and mineralised tartar, creating a clean environment for periodontal tissue recovery."
      },
      {
        stepNumber: 4,
        title: "Re-evaluation & Pocket Measurement",
        description: "After 4 to 6 weeks of tissue healing, pocket depths are remeasured to verify reduction in inflammation and pocket closure."
      },
      {
        stepNumber: 5,
        title: "Supportive Periodontal Maintenance",
        description: "Periodontitis is a chronic condition that requires consistent periodic maintenance visits to prevent recurrence of pathogenic bacterial repopulation."
      }
    ],
    patientSuitabilityNote: "Periodontal therapy is appropriate for anyone showing signs of gingival inflammation, bleeding, or bone loss. Because systemic conditions like diabetes mellitus and cardiovascular disease share reciprocal inflammatory links with periodontitis, medical history coordination is a vital component of clinical care.",
    faqs: [
      {
        question: "What is the difference between gingivitis and periodontitis?",
        answer: "Gingivitis is an early, reversible inflammation of the gums caused by plaque accumulation, without permanent damage to the supporting bone. If left untreated, gingivitis can progress into periodontitis, where bacterial toxins and host immune response destroy alveolar bone and connective fibers, which cannot self-regenerate without intervention."
      },
      {
        question: "Can periodontitis be cured completely?",
        answer: "Periodontitis is a manageable chronic disease. While lost alveolar bone generally does not regenerate spontaneously, active disease can be halted and stabilised through professional periodontal debridement and strict daily plaque control."
      },
      {
        question: "Why do my gums bleed even when I brush gently?",
        answer: "Healthy gums do not bleed. Bleeding upon brushing or flossing is a primary clinical indicator of active inflammation caused by bacterial plaque along the gingival margin. It signals that professional evaluation and thorough cleaning are advisable."
      },
      {
        question: "Is periodontal scaling painful?",
        answer: "Modern periodontal cleaning utilises gentle ultrasonic instruments. For deep subgingival cleaning or sensitive roots, topical or local anaesthetics are applied to ensure complete patient comfort throughout the procedure."
      }
    ],
    preparationAndAftercare: [
      "Use an ultra-soft or soft bristled toothbrush with gentle circular or modified Bass brushing technique twice daily.",
      "Incorporate interdental brushes or dental floss daily to disrupt plaque in the spaces standard toothbrushes cannot reach.",
      "Expect mild transient temperature sensitivity for a few days after thorough subgingival scaling, which usually subsides.",
      "Attend recommended periodontal maintenance recall visits faithfully to safeguard against progressive bone loss."
    ]
  },
  {
    id: "general-consultations",
    slug: "general-consultations",
    name: "General Dental Consultations & Oral Diagnostics",
    subtitle: "Comprehensive clinical examinations, preventive assessments, and individualised care plans",
    category: "General Dentistry",
    shortDescription: "Full-mouth oral health evaluations, screening for caries and soft tissue anomalies, and clear discussions of treatment pathways.",
    educationalSummary: "A routine clinical consultation forms the cornerstone of preventive dental health, identifying early signs of demineralisation, bite irregularities, and mucosal conditions before they require extensive intervention.",
    status: "provisional_proposed",
    hasDedicatedPage: false,
    href: "/services#general-consultations",
    iconName: "Stethoscope",
    clinicalIndications: [
      "Routine 6-monthly oral health reviews",
      "Tooth sensitivity to hot, cold, or sweet substances",
      "Jaw clicking, discomfort, or muscle fatigue during chewing",
      "Pre-treatment evaluations before elective dental procedures"
    ],
    whatTreatmentInvolves: [
      "Visual and tactile examination of teeth and existing restorations",
      "Soft tissue and oral mucosal screening",
      "Low-dose digital intraoral radiographs where clinically indicated",
      "Transparent review of clinical findings and preventive advice"
    ],
    procedureOverview: [
      {
        stepNumber: 1,
        title: "Medical History & Patient Discussion",
        description: "Review of systemic health, current medications, dietary habits, and any specific dental concerns or symptoms."
      },
      {
        stepNumber: 2,
        title: "Clinical Oral Examination",
        description: "Systematic assessment of each tooth, periodontal margins, occlusion, and oral soft tissues."
      },
      {
        stepNumber: 3,
        title: "Treatment Discussion",
        description: "Clear, non-pressured explanation of any observed findings, preventive strategies, and recommended next steps."
      }
    ],
    patientSuitabilityNote: "Suitable for all patients from routine checkups to individuals seeking an independent second clinical opinion.",
    faqs: [
      {
        question: "How often should I have a dental consultation?",
        answer: "For most healthy individuals, an annual or six-monthly review is standard. Patients with active periodontal conditions or high caries risk benefit from more frequent three-to-four-monthly intervals."
      }
    ],
    preparationAndAftercare: [
      "Bring a list of current systemic medications or medical conditions to share with the dentist.",
      "Note down any specific symptoms, sensitivity triggers, or past dental experiences."
    ]
  },
  {
    id: "root-canal-treatment",
    slug: "root-canal-treatment",
    name: "Root Canal Treatment (Endodontics)",
    subtitle: "Therapeutic preservation of deeply infected or inflamed dental pulp tissue",
    category: "Endodontics",
    shortDescription: "Gentle removal of infected pulp tissue, thorough canal disinfection, and sterile hermetic sealing to preserve natural tooth structure.",
    educationalSummary: "When tooth decay or traumatic injury reaches the internal dental pulp, root canal treatment removes bacteria and infected tissue, eliminating pain and preventing the need for tooth extraction.",
    status: "provisional_proposed",
    hasDedicatedPage: false,
    href: "/services#root-canal-treatment",
    iconName: "Activity",
    clinicalIndications: [
      "Severe, lingering pain upon exposure to hot or cold temperatures",
      "Spontaneous, throbbing dental pain especially when lying down",
      "Pain when chewing or applying biting pressure",
      "Swelling or tenderness in the adjacent gum tissue",
      "Deep dental caries extending into the pulp chamber"
    ],
    whatTreatmentInvolves: [
      "Local anaesthetic to ensure complete numbness of the tooth and surrounding area",
      "Rubber dam isolation to maintain an aseptic, dry working field",
      "Careful bio-mechanical cleaning and shaping of the root canals using nickel-titanium instruments",
      "Antibacterial irrigation and sterile obturation (filling) of the root canal space",
      "Subsequent coronal restoration (typically a crown) to protect brittle treated tooth structure"
    ],
    procedureOverview: [
      {
        stepNumber: 1,
        title: "Diagnostic Imaging & Anaesthesia",
        description: "Radiographic verification of root anatomy and administration of local anaesthesia for a comfortable procedure."
      },
      {
        stepNumber: 2,
        title: "Canal Debridement & Disinfection",
        description: "Removal of inflamed pulp tissue and thorough chemical irrigation to eradicate intraradicular microorganisms."
      },
      {
        stepNumber: 3,
        title: "Hermetic Sealing & Restoration",
        description: "Filling the cleaned canals with biocompatible gutta-percha and sealing the access cavity."
      }
    ],
    patientSuitabilityNote: "Preserving natural teeth through endodontic therapy is generally preferable to extraction whenever root anatomy and periodontal bone support allow predictable restoration.",
    faqs: [
      {
        question: "Is root canal treatment painful?",
        answer: "Modern endodontic procedures are performed under effective local anaesthesia and aim to relieve the pain caused by pulpitis, rather than causing it. Most patients report feeling no pain during treatment."
      }
    ],
    preparationAndAftercare: [
      "Avoid biting directly on the treated tooth until the definitive permanent crown has been placed.",
      "Mild tenderness for 24-48 hours is normal and generally responds well to standard mild analgesics."
    ]
  },
  {
    id: "laser-dentistry",
    slug: "laser-dentistry",
    name: "Laser Dentistry & Soft Tissue Care",
    subtitle: "Minimally invasive clinical laser applications for periodontal decontamination and soft tissue contouring",
    category: "Advanced Dental Tech",
    shortDescription: "Targeted laser energy applied for bacterial pocket reduction, frenectomy, and gentle gingival contouring with reduced healing times.",
    educationalSummary: "Dental lasers deliver light energy in specific wavelengths to target pathogenic bacteria and precision-treat soft oral tissues with minimal bleeding, swelling, or post-operative discomfort.",
    status: "provisional_proposed",
    hasDedicatedPage: false,
    href: "/services#laser-dentistry",
    iconName: "Sparkles",
    clinicalIndications: [
      "Adjunctive pocket decontamination in refractory periodontal disease",
      "Frenectomy for speech or orthodontic considerations",
      "Crown lengthening or aesthetic gingival re-contouring",
      "Management of aphthous ulcers and cold sores"
    ],
    whatTreatmentInvolves: [
      "Application of calibrated dental laser energy to targeted gingival sites",
      "Immediate microbial reduction in subgingival pockets without mechanical trauma",
      "Coagulation of micro-vessels, providing enhanced haemostasis and visibility"
    ],
    procedureOverview: [
      {
        stepNumber: 1,
        title: "Laser Evaluation",
        description: "Determining whether laser therapy is indicated as an adjunct to standard mechanical debridement."
      },
      {
        stepNumber: 2,
        title: "Laser Decontamination",
        description: "Careful sweeping of the fiber optic tip through the gingival sulcus to photo-thermally target bacteria."
      }
    ],
    patientSuitabilityNote: "Laser procedures are adjuncts to sound biological dental principles and are evaluated case-by-case based on clinical indications.",
    faqs: [
      {
        question: "Does laser treatment replace conventional scaling?",
        answer: "Lasers do not remove mineralised calculus (tartar); they are used as powerful adjuncts to eradicate subgingival bacteria and bio-stimulate inflamed tissue after calculus has been mechanically scaled."
      }
    ],
    preparationAndAftercare: [
      "Follow gentle salt water warm rinses if advised by your clinician.",
      "Avoid abrasive toothpastes on newly treated soft tissue for 48 hours."
    ]
  }
];
