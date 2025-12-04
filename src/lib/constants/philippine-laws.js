/**
 * Database of Philippine Laws
 * Organized by category for legal case analysis
 */

export const PHILIPPINE_LAWS = {
  // Civil Law
  civil: [
    {
      id: "civil-code-1134",
      title: "Prescription of Actions",
      citation: "Civil Code of the Philippines, Article 1134",
      description: "Actions upon a written contract must be brought within ten years from the time the right of action accrues.",
      category: ["Property", "Contracts"],
      keywords: ["prescription", "limitation", "contract", "written agreement"]
    },
    {
      id: "civil-code-1144",
      title: "Prescriptive Period for Obligations",
      citation: "Civil Code of the Philippines, Article 1144",
      description: "The following actions must be brought within ten years from the time the right of action accrues: (1) Upon a written contract; (2) Upon an obligation created by law; (3) Upon a judgment.",
      category: ["Contracts", "Obligations"],
      keywords: ["prescription", "ten years", "contract", "obligation"]
    },
    {
      id: "civil-code-1146",
      title: "Four-Year Prescription",
      citation: "Civil Code of the Philippines, Article 1146",
      description: "Actions upon an injury to the rights of the plaintiff must be brought within four years.",
      category: ["Damages", "Injury"],
      keywords: ["injury", "four years", "damages", "rights"]
    },
    {
      id: "civil-code-428",
      title: "Right of Ownership",
      citation: "Civil Code of the Philippines, Article 428",
      description: "The owner has the right to enjoy and dispose of a thing, without other limitations than those established by law.",
      category: ["Property"],
      keywords: ["ownership", "property rights", "dispose", "enjoy"]
    },
    {
      id: "civil-code-434",
      title: "Recovery of Real Property",
      citation: "Civil Code of the Philippines, Article 434",
      description: "In an action to recover, the property must be identified, and the plaintiff must rely on the strength of his title and not on the weakness of the defendant's claim.",
      category: ["Property"],
      keywords: ["recover", "real property", "title", "ownership"]
    },
    {
      id: "civil-code-476",
      title: "Quieting of Title",
      citation: "Civil Code of the Philippines, Article 476",
      description: "Whenever there is a cloud on title to real property or any interest therein, an action may be brought to remove such cloud or to quiet the title.",
      category: ["Property"],
      keywords: ["quiet title", "cloud on title", "real property"]
    },
    {
      id: "civil-code-1305",
      title: "Contract Definition",
      citation: "Civil Code of the Philippines, Article 1305",
      description: "A contract is a meeting of minds between two persons whereby one binds himself, with respect to the other, to give something or to render some service.",
      category: ["Contracts"],
      keywords: ["contract", "agreement", "meeting of minds", "obligation"]
    },
    {
      id: "civil-code-1306",
      title: "Freedom to Contract",
      citation: "Civil Code of the Philippines, Article 1306",
      description: "The contracting parties may establish such stipulations, clauses, terms and conditions as they may deem convenient, provided they are not contrary to law, morals, good customs, public order, or public policy.",
      category: ["Contracts"],
      keywords: ["freedom to contract", "stipulations", "terms", "conditions"]
    },
    {
      id: "civil-code-2176",
      title: "Quasi-Delict",
      citation: "Civil Code of the Philippines, Article 2176",
      description: "Whoever by act or omission causes damage to another, there being fault or negligence, is obliged to pay for the damage done.",
      category: ["Damages", "Torts"],
      keywords: ["quasi-delict", "negligence", "damages", "fault"]
    },
    {
      id: "civil-code-2199",
      title: "Actual Damages",
      citation: "Civil Code of the Philippines, Article 2199",
      description: "Except as provided by law or by stipulation, one is entitled to an adequate compensation only for such pecuniary loss suffered by him as he has duly proved.",
      category: ["Damages"],
      keywords: ["actual damages", "compensation", "pecuniary loss", "proof"]
    }
  ],

  // Family Law
  family: [
    {
      id: "family-code-1",
      title: "Marriage Requirements",
      citation: "Family Code of the Philippines, Article 1",
      description: "Marriage is a special contract of permanent union between a man and a woman entered into in accordance with law for the establishment of conjugal and family life.",
      category: ["Family Law", "Marriage"],
      keywords: ["marriage", "contract", "union", "family"]
    },
    {
      id: "family-code-36",
      title: "Psychological Incapacity",
      citation: "Family Code of the Philippines, Article 36",
      description: "A marriage contracted by any party who, at the time of the celebration, was psychologically incapacitated to comply with the essential marital obligations of marriage, shall likewise be void.",
      category: ["Family Law", "Annulment"],
      keywords: ["psychological incapacity", "void marriage", "annulment"]
    },
    {
      id: "family-code-45",
      title: "Voidable Marriage",
      citation: "Family Code of the Philippines, Article 45",
      description: "A marriage may be annulled for causes existing at the time of the marriage including lack of parental consent, insanity, fraud, force, impotence, or STD.",
      category: ["Family Law", "Annulment"],
      keywords: ["voidable", "annulment", "fraud", "force", "consent"]
    },
    {
      id: "family-code-63",
      title: "Legal Separation",
      citation: "Family Code of the Philippines, Article 55",
      description: "A petition for legal separation may be filed on grounds including repeated physical violence, drug addiction, lesbianism or homosexuality, bigamy, sexual infidelity, or attempt on life.",
      category: ["Family Law", "Separation"],
      keywords: ["legal separation", "violence", "infidelity", "grounds"]
    },
    {
      id: "family-code-176",
      title: "Illegitimate Children",
      citation: "Family Code of the Philippines, Article 176",
      description: "Illegitimate children shall use the surname and shall be under the parental authority of their mother, and shall be entitled to support.",
      category: ["Family Law", "Children"],
      keywords: ["illegitimate", "children", "surname", "support", "parental authority"]
    },
    {
      id: "family-code-194",
      title: "Support Definition",
      citation: "Family Code of the Philippines, Article 194",
      description: "Support comprises everything indispensable for sustenance, dwelling, clothing, medical attendance, education and transportation.",
      category: ["Family Law", "Support"],
      keywords: ["support", "sustenance", "education", "maintenance"]
    },
    {
      id: "family-code-209",
      title: "Child Custody",
      citation: "Family Code of the Philippines, Article 213",
      description: "In case of separation of the parents, parental authority shall be exercised by the parent designated by the Court. No child under seven years of age shall be separated from the mother unless the court finds compelling reasons.",
      category: ["Family Law", "Custody"],
      keywords: ["custody", "parental authority", "separation", "children"]
    },
    {
      id: "ra-9262",
      title: "Violence Against Women and Children",
      citation: "Republic Act No. 9262 (Anti-VAWC Act)",
      description: "Provides protection against violence committed by husbands, former husbands, partners, or anyone in a dating relationship against women and their children.",
      category: ["Family Law", "Criminal", "Protection"],
      keywords: ["VAWC", "domestic violence", "protection order", "abuse"]
    }
  ],

  // Labor Law
  labor: [
    {
      id: "labor-code-277",
      title: "Security of Tenure",
      citation: "Labor Code of the Philippines, Article 294 (formerly 279)",
      description: "In cases of regular employment, the employer shall not terminate the services of an employee except for a just cause or when authorized by law.",
      category: ["Labor"],
      keywords: ["security of tenure", "termination", "regular employment", "just cause"]
    },
    {
      id: "labor-code-297",
      title: "Just Causes for Termination",
      citation: "Labor Code of the Philippines, Article 297 (formerly 282)",
      description: "An employer may terminate an employment for just cause including serious misconduct, willful disobedience, gross negligence, fraud, or commission of a crime.",
      category: ["Labor", "Termination"],
      keywords: ["just cause", "misconduct", "termination", "dismissal"]
    },
    {
      id: "labor-code-298",
      title: "Authorized Causes for Termination",
      citation: "Labor Code of the Philippines, Article 298 (formerly 283)",
      description: "The employer may terminate employment due to installation of labor-saving devices, redundancy, retrenchment, or closure of business.",
      category: ["Labor", "Termination"],
      keywords: ["authorized cause", "redundancy", "retrenchment", "closure"]
    },
    {
      id: "labor-code-299",
      title: "Disease as Ground for Termination",
      citation: "Labor Code of the Philippines, Article 299 (formerly 284)",
      description: "An employer may terminate the services of an employee who has been found to be suffering from any disease and whose continued employment is prohibited by law or is prejudicial to his health.",
      category: ["Labor", "Termination"],
      keywords: ["disease", "health", "termination", "medical"]
    },
    {
      id: "labor-code-100",
      title: "Non-Diminution of Benefits",
      citation: "Labor Code of the Philippines, Article 100",
      description: "Nothing in this Book shall be construed to eliminate or in any way diminish supplements, or other employee benefits being enjoyed at the time of promulgation of this Code.",
      category: ["Labor", "Benefits"],
      keywords: ["benefits", "non-diminution", "supplements", "employee rights"]
    },
    {
      id: "labor-code-103",
      title: "Time of Payment of Wages",
      citation: "Labor Code of the Philippines, Article 103",
      description: "Wages shall be paid at least once every two weeks or twice a month at intervals not exceeding sixteen days.",
      category: ["Labor", "Wages"],
      keywords: ["wages", "payment", "salary", "interval"]
    },
    {
      id: "labor-code-87",
      title: "Overtime Work",
      citation: "Labor Code of the Philippines, Article 87",
      description: "Work may be performed beyond eight hours a day provided that the employee is paid for the overtime work an additional compensation equivalent to his regular wage plus at least twenty-five percent thereof.",
      category: ["Labor", "Wages"],
      keywords: ["overtime", "compensation", "eight hours", "additional pay"]
    },
    {
      id: "labor-code-93",
      title: "Holiday Pay",
      citation: "Labor Code of the Philippines, Article 94",
      description: "Every worker shall be paid his regular daily wage during regular holidays, except in retail and service establishments regularly employing less than ten workers.",
      category: ["Labor", "Wages"],
      keywords: ["holiday pay", "regular holiday", "wages"]
    },
    {
      id: "ra-11058",
      title: "Occupational Safety and Health Standards",
      citation: "Republic Act No. 11058",
      description: "Mandates employers to ensure safe working conditions and environments for all workers.",
      category: ["Labor", "Safety"],
      keywords: ["safety", "health", "workplace", "OSHA"]
    }
  ],

  // Criminal Law
  criminal: [
    {
      id: "rpc-248",
      title: "Murder",
      citation: "Revised Penal Code, Article 248",
      description: "Any person who kills another with treachery, evident premeditation, or other qualifying circumstances shall be guilty of murder.",
      category: ["Criminal"],
      keywords: ["murder", "killing", "treachery", "premeditation"]
    },
    {
      id: "rpc-249",
      title: "Homicide",
      citation: "Revised Penal Code, Article 249",
      description: "Any person who kills another without the qualifying circumstances of murder shall be guilty of homicide.",
      category: ["Criminal"],
      keywords: ["homicide", "killing", "death"]
    },
    {
      id: "rpc-263",
      title: "Serious Physical Injuries",
      citation: "Revised Penal Code, Article 263",
      description: "Any person who wounds, beats, or assaults another causing serious physical injuries shall be punished accordingly.",
      category: ["Criminal"],
      keywords: ["physical injuries", "assault", "wounds", "battery"]
    },
    {
      id: "rpc-266a",
      title: "Rape",
      citation: "Revised Penal Code, Article 266-A",
      description: "Rape is committed by a man who shall have carnal knowledge of a woman through force, threat, intimidation, or when the offended party is deprived of reason.",
      category: ["Criminal"],
      keywords: ["rape", "sexual assault", "force", "intimidation"]
    },
    {
      id: "rpc-293",
      title: "Robbery",
      citation: "Revised Penal Code, Article 293",
      description: "Any person who, with intent to gain, shall take any personal property belonging to another, by means of violence against or intimidation of any person, or using force upon anything, shall be guilty of robbery.",
      category: ["Criminal"],
      keywords: ["robbery", "theft", "violence", "intimidation"]
    },
    {
      id: "rpc-308",
      title: "Theft",
      citation: "Revised Penal Code, Article 308",
      description: "Theft is committed by any person who, with intent to gain but without violence against or intimidation of persons, shall take personal property of another without the latter's consent.",
      category: ["Criminal"],
      keywords: ["theft", "stealing", "property", "without consent"]
    },
    {
      id: "rpc-315",
      title: "Estafa (Swindling)",
      citation: "Revised Penal Code, Article 315",
      description: "Swindling (estafa) is committed by any person who defrauds another through abuse of confidence, deceit, or fraudulent means.",
      category: ["Criminal"],
      keywords: ["estafa", "swindling", "fraud", "deceit"]
    },
    {
      id: "rpc-353",
      title: "Libel",
      citation: "Revised Penal Code, Article 353",
      description: "A libel is a public and malicious imputation of a crime, vice, or defect tending to cause dishonor or discredit to a natural or juridical person.",
      category: ["Criminal"],
      keywords: ["libel", "defamation", "dishonor", "malicious"]
    },
    {
      id: "ra-10175",
      title: "Cybercrime Prevention Act",
      citation: "Republic Act No. 10175",
      description: "Defines and penalizes cyber offenses including illegal access, data interference, cyber libel, and other computer-related crimes.",
      category: ["Criminal", "Cyber"],
      keywords: ["cybercrime", "hacking", "cyber libel", "online crime"]
    },
    {
      id: "ra-9165",
      title: "Comprehensive Dangerous Drugs Act",
      citation: "Republic Act No. 9165",
      description: "Penalizes the importation, sale, possession, and use of dangerous drugs and provides for treatment and rehabilitation.",
      category: ["Criminal", "Drugs"],
      keywords: ["drugs", "illegal drugs", "possession", "trafficking"]
    }
  ],

  // Consumer Protection
  consumer: [
    {
      id: "ra-7394",
      title: "Consumer Act of the Philippines",
      citation: "Republic Act No. 7394",
      description: "Protects consumer interests, promotes general welfare, and establishes standards of conduct for business and industry.",
      category: ["Consumer"],
      keywords: ["consumer rights", "protection", "warranty", "refund"]
    },
    {
      id: "ra-7394-48",
      title: "Liability for Product Defects",
      citation: "Republic Act No. 7394, Article 48",
      description: "A manufacturer or seller is liable for damages caused by defects in their products.",
      category: ["Consumer", "Product Liability"],
      keywords: ["product defect", "liability", "damages", "warranty"]
    },
    {
      id: "ra-7394-68",
      title: "Deceptive Sales Acts",
      citation: "Republic Act No. 7394, Article 50",
      description: "Prohibits deceptive, unfair, and unconscionable sales acts or practices.",
      category: ["Consumer"],
      keywords: ["deceptive", "unfair", "sales", "consumer protection"]
    }
  ],

  // Data Privacy
  privacy: [
    {
      id: "ra-10173",
      title: "Data Privacy Act",
      citation: "Republic Act No. 10173",
      description: "Protects individual personal information in information and communications systems in the government and the private sector.",
      category: ["Privacy", "Data Protection"],
      keywords: ["data privacy", "personal information", "consent", "data breach"]
    },
    {
      id: "ra-10173-16",
      title: "Rights of Data Subject",
      citation: "Republic Act No. 10173, Section 16",
      description: "Data subjects have the right to be informed, access, object, erasure, rectification, and data portability.",
      category: ["Privacy"],
      keywords: ["data subject rights", "access", "erasure", "rectification"]
    }
  ],

  // Administrative and Regulatory
  administrative: [
    {
      id: "ra-6713",
      title: "Code of Conduct for Public Officials",
      citation: "Republic Act No. 6713",
      description: "Establishes standards of conduct and ethical standards for public officials and employees.",
      category: ["Administrative", "Government"],
      keywords: ["public official", "ethics", "conduct", "government"]
    },
    {
      id: "ra-3019",
      title: "Anti-Graft and Corrupt Practices Act",
      citation: "Republic Act No. 3019",
      description: "Defines corrupt practices of public officers and provides penalties therefor.",
      category: ["Administrative", "Criminal"],
      keywords: ["graft", "corruption", "public officer", "bribery"]
    },
    {
      id: "ra-9485",
      title: "Anti-Red Tape Act",
      citation: "Republic Act No. 9485 (as amended by RA 11032)",
      description: "Improves efficiency in the delivery of government service and provides a mechanism for addressing complaints.",
      category: ["Administrative"],
      keywords: ["red tape", "government service", "efficiency", "complaint"]
    }
  ],

  // Tenant and Housing
  housing: [
    {
      id: "ra-9653",
      title: "Rent Control Act",
      citation: "Republic Act No. 9653",
      description: "Regulates residential unit rental rates and protects tenants from arbitrary increases.",
      category: ["Housing", "Tenant Rights"],
      keywords: ["rent control", "tenant", "rental", "increase"]
    },
    {
      id: "bp-877",
      title: "Rental Law",
      citation: "Batas Pambansa Blg. 877",
      description: "Governs residential rental units and establishes rights and obligations of lessors and lessees.",
      category: ["Housing"],
      keywords: ["rental", "lease", "lessor", "lessee", "eviction"]
    }
  ],

  // Intellectual Property
  ip: [
    {
      id: "ra-8293",
      title: "Intellectual Property Code",
      citation: "Republic Act No. 8293",
      description: "Protects intellectual property rights including patents, trademarks, and copyrights.",
      category: ["Intellectual Property"],
      keywords: ["IP", "patent", "trademark", "copyright", "infringement"]
    }
  ]
};

/**
 * Get all laws as a flat array
 */
export function getAllLaws() {
  return Object.values(PHILIPPINE_LAWS).flat();
}

/**
 * Search laws by keyword
 */
export function searchLaws(keyword) {
  const allLaws = getAllLaws();
  const searchTerm = keyword.toLowerCase();
  
  return allLaws.filter(law => 
    law.title.toLowerCase().includes(searchTerm) ||
    law.description.toLowerCase().includes(searchTerm) ||
    law.keywords.some(k => k.toLowerCase().includes(searchTerm)) ||
    law.category.some(c => c.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get laws by category
 */
export function getLawsByCategory(category) {
  const allLaws = getAllLaws();
  return allLaws.filter(law => 
    law.category.some(c => c.toLowerCase() === category.toLowerCase())
  );
}

/**
 * Format laws for AI prompt context
 */
export function getLawsContextForPrompt() {
  const allLaws = getAllLaws();
  return allLaws.map(law => 
    `- ${law.title} (${law.citation}): ${law.description}`
  ).join('\n');
}

export default PHILIPPINE_LAWS;

