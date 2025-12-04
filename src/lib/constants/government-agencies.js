/**
 * Philippine Government Agencies Directory
 * For legal assistance and case-related inquiries
 */

export const GOVERNMENT_AGENCIES = {
  // Justice and Legal
  legal: [
    {
      id: "doj",
      name: "Department of Justice (DOJ)",
      description: "The principal law agency of the government which serves as the government's prosecution arm.",
      purpose: "Criminal complaints, case monitoring, prosecution matters",
      address: "Padre Faura St., Ermita, Manila",
      contact: "(02) 8523-8481 to 89",
      email: "info@doj.gov.ph",
      website: "https://www.doj.gov.ph",
      category: ["Criminal", "Justice"]
    },
    {
      id: "pao",
      name: "Public Attorney's Office (PAO)",
      description: "Provides free legal assistance to indigent persons in criminal, civil, labor, administrative, and other quasi-judicial cases.",
      purpose: "Free legal representation for qualified individuals",
      address: "DOJ Building, Padre Faura St., Ermita, Manila",
      contact: "(02) 8929-9436",
      email: "pao_executive@pao.gov.ph",
      website: "https://www.pao.gov.ph",
      hotline: "8929-9436",
      category: ["Legal Aid", "Free Legal Services"]
    },
    {
      id: "ibp",
      name: "Integrated Bar of the Philippines (IBP)",
      description: "The national organization of lawyers providing legal aid programs.",
      purpose: "Legal aid services, lawyer complaints and referrals",
      address: "15 Julia Vargas Ave., Ortigas Center, Pasig City",
      contact: "(02) 8631-3018",
      email: "ibp.national@gmail.com",
      website: "https://www.ibp.ph",
      category: ["Legal Aid", "Lawyer Referral"]
    },
    {
      id: "nlrc",
      name: "National Labor Relations Commission (NLRC)",
      description: "Quasi-judicial body handling labor disputes and illegal dismissal cases.",
      purpose: "Labor disputes, illegal dismissal complaints, employee grievances",
      address: "PPSTA Building, Banawe St., Quezon City",
      contact: "(02) 8921-6102",
      email: "nlrcpublicinfo@nlrc.dole.gov.ph",
      website: "https://www.nlrc.dole.gov.ph",
      category: ["Labor", "Employment"]
    }
  ],

  // Labor and Employment
  labor: [
    {
      id: "dole",
      name: "Department of Labor and Employment (DOLE)",
      description: "Promotes gainful employment opportunities and develops human resources.",
      purpose: "Labor standards violations, employment concerns, worker assistance",
      address: "DOLE Building, Muralla cor. General Luna St., Intramuros, Manila",
      contact: "(02) 8527-3000",
      email: "osec@dole.gov.ph",
      website: "https://www.dole.gov.ph",
      hotline: "1349",
      category: ["Labor", "Employment"]
    },
    {
      id: "sss",
      name: "Social Security System (SSS)",
      description: "Provides social security protection to workers in the private sector.",
      purpose: "SSS contributions, benefits claims, retirement, disability, death claims",
      address: "SSS Building, East Avenue, Quezon City",
      contact: "(02) 8920-6401",
      email: "member_relations@sss.gov.ph",
      website: "https://www.sss.gov.ph",
      hotline: "1455",
      category: ["Labor", "Benefits", "Social Security"]
    },
    {
      id: "poea",
      name: "Philippine Overseas Labor Office (POLO)",
      description: "Handles deployment and protection of overseas Filipino workers.",
      purpose: "OFW complaints, recruitment agency issues, overseas employment",
      address: "POEA Building, EDSA cor. Ortigas Ave., Mandaluyong City",
      contact: "(02) 8722-1144",
      email: "info@poea.gov.ph",
      website: "https://www.poea.gov.ph",
      category: ["Labor", "OFW"]
    }
  ],

  // Women, Children, and Family
  family: [
    {
      id: "dswd",
      name: "Department of Social Welfare and Development (DSWD)",
      description: "Leads in the formulation and implementation of policies for social protection.",
      purpose: "Child protection, family welfare, social assistance programs",
      address: "DSWD Central Office, Batasan Complex, Quezon City",
      contact: "(02) 8931-8101 to 07",
      email: "inquiry@dswd.gov.ph",
      website: "https://www.dswd.gov.ph",
      hotline: "8888",
      category: ["Family", "Children", "Social Welfare"]
    },
    {
      id: "pcw",
      name: "Philippine Commission on Women (PCW)",
      description: "Primary policy-making and coordinating body on gender equality and women empowerment.",
      purpose: "Women's rights, gender discrimination cases",
      address: "1145 J.P. Laurel St., San Miguel, Manila",
      contact: "(02) 8735-1654",
      email: "oed@pcw.gov.ph",
      website: "https://www.pcw.gov.ph",
      category: ["Women", "Gender Rights"]
    },
    {
      id: "cwd",
      name: "Council for the Welfare of Children (CWC)",
      description: "Coordinates and monitors the formulation of policies for children.",
      purpose: "Child rights, child abuse cases, child protection",
      address: "DSWD Compound, Batasan Complex, Quezon City",
      contact: "(02) 8931-8556",
      email: "cwc@cwc.gov.ph",
      website: "https://www.cwc.gov.ph",
      category: ["Children", "Child Protection"]
    },
    {
      id: "vawc-desk",
      name: "VAWC Desk (Police Stations)",
      description: "Specialized desk in police stations handling violence against women and children cases.",
      purpose: "Filing VAWC complaints, protection orders, domestic violence cases",
      address: "Available at all PNP stations nationwide",
      contact: "911 or local police station",
      website: "https://www.pnp.gov.ph",
      hotline: "911",
      category: ["Women", "Children", "VAWC", "Criminal"]
    }
  ],

  // Consumer and Trade
  consumer: [
    {
      id: "dti",
      name: "Department of Trade and Industry (DTI)",
      description: "Prime mover of Philippine industrial development and trade.",
      purpose: "Consumer complaints, product quality issues, business disputes",
      address: "361 Sen. Gil J. Puyat Ave., Makati City",
      contact: "(02) 8751-0384",
      email: "ask@dti.gov.ph",
      website: "https://www.dti.gov.ph",
      hotline: "1-DTI (1-384)",
      category: ["Consumer", "Trade", "Business"]
    },
    {
      id: "ncc",
      name: "National Consumer Commission",
      description: "Adjudicates consumer complaints and disputes.",
      purpose: "Consumer disputes, unfair trade practices, product complaints",
      address: "DTI Building, Sen. Gil J. Puyat Ave., Makati City",
      contact: "(02) 8751-3330",
      email: "consumer@dti.gov.ph",
      website: "https://www.dti.gov.ph",
      category: ["Consumer"]
    }
  ],

  // Property and Land
  property: [
    {
      id: "lra",
      name: "Land Registration Authority (LRA)",
      description: "Issues decrees of registration and certificates of title.",
      purpose: "Land title verification, property registration, title issues",
      address: "LRA Building, East Ave., Quezon City",
      contact: "(02) 8920-4596",
      email: "lra.publicinfo@lra.gov.ph",
      website: "https://www.lra.gov.ph",
      category: ["Property", "Land Registration"]
    },
    {
      id: "denr",
      name: "Department of Environment and Natural Resources (DENR)",
      description: "Primary government agency responsible for conservation and management of environment and natural resources.",
      purpose: "Land classification, environmental permits, ancestral domain",
      address: "DENR Building, Visayas Ave., Quezon City",
      contact: "(02) 8929-6626 to 29",
      email: "web.undersecretary@denr.gov.ph",
      website: "https://www.denr.gov.ph",
      category: ["Property", "Environment"]
    },
    {
      id: "hlurb",
      name: "Department of Human Settlements and Urban Development (DHSUD)",
      description: "Formerly HLURB, handles housing and land use regulations.",
      purpose: "Housing complaints, subdivision issues, real estate concerns",
      address: "Kalayaan Ave., Diliman, Quezon City",
      contact: "(02) 8424-4080",
      email: "osec@dhsud.gov.ph",
      website: "https://www.dhsud.gov.ph",
      category: ["Property", "Housing"]
    }
  ],

  // Law Enforcement
  enforcement: [
    {
      id: "pnp",
      name: "Philippine National Police (PNP)",
      description: "Primary law enforcement agency of the country.",
      purpose: "Filing criminal complaints, police reports, emergency response",
      address: "Camp Crame, Quezon City",
      contact: "(02) 8723-0401",
      email: "pnp_pao@pnp.gov.ph",
      website: "https://www.pnp.gov.ph",
      hotline: "911 or 117",
      category: ["Criminal", "Law Enforcement"]
    },
    {
      id: "nbi",
      name: "National Bureau of Investigation (NBI)",
      description: "Primary investigative arm of the government.",
      purpose: "Criminal investigations, NBI clearance, cybercrime reports",
      address: "NBI Building, Taft Ave., Ermita, Manila",
      contact: "(02) 8523-8231 to 38",
      email: "director@nbi.gov.ph",
      website: "https://www.nbi.gov.ph",
      hotline: "8523-8231",
      category: ["Criminal", "Investigation"]
    },
    {
      id: "barangay",
      name: "Barangay Justice System (Katarungang Pambarangay)",
      description: "Barangay-level dispute resolution system.",
      purpose: "Minor disputes, neighborhood conflicts, mediation (required before court filing)",
      address: "Local Barangay Hall",
      contact: "Contact your local Barangay",
      category: ["Civil", "Criminal", "Mediation"]
    }
  ],

  // Human Rights
  rights: [
    {
      id: "chr",
      name: "Commission on Human Rights (CHR)",
      description: "Independent constitutional office investigating human rights violations.",
      purpose: "Human rights violations, abuse of authority, civil liberties",
      address: "SAAC Building, UP Complex, Diliman, Quezon City",
      contact: "(02) 8294-8704",
      email: "info@chr.gov.ph",
      website: "https://www.chr.gov.ph",
      hotline: "8294-8704",
      category: ["Human Rights"]
    },
    {
      id: "ombudsman",
      name: "Office of the Ombudsman",
      description: "Investigates and prosecutes erring government officials.",
      purpose: "Government corruption, abuse of power, malfeasance",
      address: "Ombudsman Building, Agham Road, North Triangle, Quezon City",
      contact: "(02) 8479-7300",
      email: "contact@ombudsman.gov.ph",
      website: "https://www.ombudsman.gov.ph",
      hotline: "8888",
      category: ["Government", "Anti-Corruption"]
    }
  ],

  // Data Privacy
  privacy: [
    {
      id: "npc",
      name: "National Privacy Commission (NPC)",
      description: "Administers and implements the Data Privacy Act.",
      purpose: "Data privacy complaints, data breach reports, privacy rights",
      address: "3F Core G, GSIS Headquarters, Financial Center, Pasay City",
      contact: "(02) 8234-2228",
      email: "info@privacy.gov.ph",
      website: "https://www.privacy.gov.ph",
      category: ["Privacy", "Data Protection"]
    }
  ]
};

/**
 * Get all agencies as a flat array
 */
export function getAllAgencies() {
  return Object.values(GOVERNMENT_AGENCIES).flat();
}

/**
 * Get agencies by category
 */
export function getAgenciesByCategory(category) {
  const allAgencies = getAllAgencies();
  const searchTerm = category.toLowerCase();
  
  return allAgencies.filter(agency =>
    agency.category.some(cat => cat.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get agencies relevant to a case type
 */
export function getAgenciesByCaseType(caseType) {
  const caseTypeMap = {
    "Property": ["Property", "Land Registration", "Housing"],
    "Criminal": ["Criminal", "Law Enforcement", "Justice"],
    "Labor": ["Labor", "Employment", "Social Security"],
    "Family Law": ["Family", "Children", "Women", "VAWC"],
    "Civil": ["Civil", "Legal Aid", "Mediation"],
    "Consumer": ["Consumer", "Trade"],
    "Administrative": ["Government", "Anti-Corruption"],
    "Privacy": ["Privacy", "Data Protection"],
    "Human Rights": ["Human Rights"]
  };
  
  const relevantCategories = caseTypeMap[caseType] || [caseType];
  const allAgencies = getAllAgencies();
  
  return allAgencies.filter(agency =>
    relevantCategories.some(cat =>
      agency.category.some(agencyCat => 
        agencyCat.toLowerCase().includes(cat.toLowerCase())
      )
    )
  );
}

/**
 * Search agencies by keyword
 */
export function searchAgencies(keyword) {
  const allAgencies = getAllAgencies();
  const searchTerm = keyword.toLowerCase();
  
  return allAgencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm) ||
    agency.description.toLowerCase().includes(searchTerm) ||
    agency.purpose.toLowerCase().includes(searchTerm) ||
    agency.category.some(cat => cat.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get agencies with hotlines
 */
export function getAgenciesWithHotlines() {
  const allAgencies = getAllAgencies();
  return allAgencies.filter(agency => agency.hotline);
}

/**
 * Format agencies for display
 */
export function formatAgencyForDisplay(agency) {
  return {
    name: agency.name,
    purpose: agency.purpose,
    contact: agency.hotline || agency.contact,
    website: agency.website
  };
}

export default GOVERNMENT_AGENCIES;

