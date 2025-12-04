/**
 * Lawyer Database
 * Sample lawyers data for the Philippine Legal Assistance App
 */

export const LAWYERS = [
  {
    id: "lawyer-001",
    name: "Atty. Maria Santos-Cruz",
    specialization: "Family Law",
    practiceAreas: ["Family Law", "Child Custody", "Annulment", "Legal Separation", "VAWC Cases"],
    location: "Makati City",
    officeAddress: "Unit 1205, Makati Corporate Center, Ayala Avenue, Makati City",
    contact: "+63 917 123 4567",
    email: "maria.santos@lawfirm.ph",
    startingPrice: "₱3,000",
    consultationFee: "₱2,500 - ₱5,000",
    rating: 4.8,
    experience: "15 years",
    bio: "Atty. Maria Santos-Cruz is a seasoned family law practitioner with over 15 years of experience handling annulment cases, child custody disputes, and domestic violence cases. She is known for her compassionate approach and dedication to protecting the rights of women and children.",
    education: [
      "Juris Doctor, University of the Philippines College of Law",
      "Bachelor of Arts in Political Science, Ateneo de Manila University"
    ],
    barMembership: "IBP Makati Chapter, Roll No. 45678",
    languages: ["English", "Filipino", "Cebuano"],
    availability: "Mon-Fri, 9AM-6PM",
    casesHandled: 350,
    successRate: "92%",
    latitude: 14.5547,
    longitude: 121.0244
  },
  {
    id: "lawyer-002",
    name: "Atty. Jose Reyes Jr.",
    specialization: "Criminal Law",
    practiceAreas: ["Criminal Law", "Drug Cases", "Theft", "Homicide", "Cybercrime"],
    location: "Quezon City",
    officeAddress: "Room 301, QC Legal Center, EDSA corner Timog Ave., Quezon City",
    contact: "+63 918 234 5678",
    email: "jose.reyes@criminaldefense.ph",
    startingPrice: "₱5,000",
    consultationFee: "₱3,000 - ₱8,000",
    rating: 4.9,
    experience: "20 years",
    bio: "Atty. Jose Reyes Jr. is a highly respected criminal defense lawyer with two decades of courtroom experience. He has successfully defended clients in high-profile criminal cases and is known for his meticulous preparation and persuasive advocacy.",
    education: [
      "Juris Doctor, San Beda College of Law",
      "Bachelor of Laws, University of Santo Tomas"
    ],
    barMembership: "IBP Quezon City Chapter, Roll No. 34567",
    languages: ["English", "Filipino"],
    availability: "Mon-Sat, 8AM-7PM",
    casesHandled: 500,
    successRate: "88%",
    latitude: 14.6282,
    longitude: 121.0347
  },
  {
    id: "lawyer-003",
    name: "Atty. Ana Gabriela Mendoza",
    specialization: "Labor Law",
    practiceAreas: ["Labor Law", "Illegal Dismissal", "Employee Benefits", "NLRC Cases", "Labor Disputes"],
    location: "Pasig City",
    officeAddress: "18F Ortigas Tower, Ortigas Center, Pasig City",
    contact: "+63 919 345 6789",
    email: "ana.mendoza@laborlaw.ph",
    startingPrice: "₱2,500",
    consultationFee: "₱2,000 - ₱4,000",
    rating: 4.7,
    experience: "12 years",
    bio: "Atty. Ana Gabriela Mendoza specializes in labor and employment law, representing both employees and employers. She has extensive experience in handling illegal dismissal cases, labor disputes, and NLRC proceedings.",
    education: [
      "Juris Doctor, Ateneo Law School",
      "Bachelor of Science in Management, Ateneo de Manila University"
    ],
    barMembership: "IBP Pasig-Taguig-San Juan Chapter, Roll No. 56789",
    languages: ["English", "Filipino", "Ilocano"],
    availability: "Mon-Fri, 9AM-5PM",
    casesHandled: 280,
    successRate: "90%",
    latitude: 14.5876,
    longitude: 121.0615
  },
  {
    id: "lawyer-004",
    name: "Atty. Ricardo Tan",
    specialization: "Property Law",
    practiceAreas: ["Property Law", "Real Estate", "Land Disputes", "Title Issues", "Ejectment"],
    location: "Manila",
    officeAddress: "Suite 502, Pacific Star Building, Makati Avenue corner Sen. Gil Puyat Ave., Manila",
    contact: "+63 920 456 7890",
    email: "ricardo.tan@propertylaw.ph",
    startingPrice: "₱4,000",
    consultationFee: "₱3,500 - ₱7,000",
    rating: 4.6,
    experience: "18 years",
    bio: "Atty. Ricardo Tan is an expert in property and real estate law with 18 years of experience. He handles complex land disputes, title issues, and ejectment cases, providing comprehensive legal solutions for property-related matters.",
    education: [
      "Juris Doctor, University of the Philippines College of Law",
      "Bachelor of Science in Civil Engineering, Mapua Institute of Technology"
    ],
    barMembership: "IBP Manila Chapter, Roll No. 23456",
    languages: ["English", "Filipino", "Hokkien"],
    availability: "Mon-Fri, 8AM-6PM",
    casesHandled: 420,
    successRate: "85%",
    latitude: 14.5995,
    longitude: 120.9842
  },
  {
    id: "lawyer-005",
    name: "Atty. Carmen Villanueva",
    specialization: "Civil Law",
    practiceAreas: ["Civil Law", "Contracts", "Damages", "Collections", "Obligations"],
    location: "Taguig City",
    officeAddress: "Unit 2301, One Global Place, 5th Ave. corner 25th St., BGC, Taguig City",
    contact: "+63 921 567 8901",
    email: "carmen.villanueva@civillaw.ph",
    startingPrice: "₱3,500",
    consultationFee: "₱3,000 - ₱6,000",
    rating: 4.8,
    experience: "14 years",
    bio: "Atty. Carmen Villanueva is a civil litigation expert with a strong track record in contract disputes, damage claims, and collection cases. She is known for her analytical approach and effective negotiation skills.",
    education: [
      "Juris Doctor, Ateneo Law School",
      "Bachelor of Arts in Economics, University of the Philippines"
    ],
    barMembership: "IBP Pasig-Taguig-San Juan Chapter, Roll No. 67890",
    languages: ["English", "Filipino"],
    availability: "Mon-Fri, 9AM-6PM",
    casesHandled: 310,
    successRate: "87%",
    latitude: 14.5514,
    longitude: 121.0503
  },
  {
    id: "lawyer-006",
    name: "Atty. Paolo Santiago",
    specialization: "Corporate Law",
    practiceAreas: ["Corporate Law", "Business Registration", "Mergers & Acquisitions", "Securities", "Contracts"],
    location: "Makati City",
    officeAddress: "34F GT Tower International, Ayala Avenue corner H.V. Dela Costa St., Makati City",
    contact: "+63 922 678 9012",
    email: "paolo.santiago@corporatelaw.ph",
    startingPrice: "₱8,000",
    consultationFee: "₱5,000 - ₱15,000",
    rating: 4.9,
    experience: "16 years",
    bio: "Atty. Paolo Santiago is a corporate law specialist advising multinational companies and local businesses on corporate governance, mergers and acquisitions, and regulatory compliance.",
    education: [
      "Master of Laws (LL.M.), Harvard Law School",
      "Juris Doctor, University of the Philippines College of Law",
      "Bachelor of Science in Business Administration, De La Salle University"
    ],
    barMembership: "IBP Makati Chapter, Roll No. 78901",
    languages: ["English", "Filipino", "Mandarin"],
    availability: "Mon-Fri, 8AM-5PM",
    casesHandled: 180,
    successRate: "95%",
    latitude: 14.5580,
    longitude: 121.0195
  },
  {
    id: "lawyer-007",
    name: "Atty. Michelle Dela Cruz",
    specialization: "Immigration Law",
    practiceAreas: ["Immigration Law", "Visa Applications", "Deportation Defense", "Work Permits", "Citizenship"],
    location: "Parañaque City",
    officeAddress: "Ground Floor, Aseana Business Park, Bradco Avenue, Parañaque City",
    contact: "+63 923 789 0123",
    email: "michelle.delacruz@immigration.ph",
    startingPrice: "₱5,000",
    consultationFee: "₱4,000 - ₱10,000",
    rating: 4.7,
    experience: "10 years",
    bio: "Atty. Michelle Dela Cruz specializes in Philippine immigration law, assisting foreigners with visa applications, work permits, and residency matters. She also handles deportation defense cases.",
    education: [
      "Juris Doctor, Far Eastern University Institute of Law",
      "Bachelor of Arts in International Studies, Miriam College"
    ],
    barMembership: "IBP Parañaque Chapter, Roll No. 89012",
    languages: ["English", "Filipino", "Korean", "Japanese"],
    availability: "Mon-Sat, 9AM-6PM",
    casesHandled: 200,
    successRate: "93%",
    latitude: 14.4793,
    longitude: 121.0198
  },
  {
    id: "lawyer-008",
    name: "Atty. Fernando Garcia",
    specialization: "Tax Law",
    practiceAreas: ["Tax Law", "BIR Cases", "Tax Planning", "Tax Litigation", "Estate Tax"],
    location: "San Juan City",
    officeAddress: "2F Promenade Building, N. Domingo St., San Juan City",
    contact: "+63 924 890 1234",
    email: "fernando.garcia@taxlaw.ph",
    startingPrice: "₱6,000",
    consultationFee: "₱5,000 - ₱12,000",
    rating: 4.8,
    experience: "22 years",
    bio: "Atty. Fernando Garcia is a veteran tax lawyer with over two decades of experience in tax litigation, tax planning, and BIR disputes. He has successfully represented clients in complex tax cases before the Court of Tax Appeals.",
    education: [
      "Master of Laws in Taxation, New York University",
      "Juris Doctor, San Beda College of Law",
      "Bachelor of Science in Accountancy, University of the East"
    ],
    barMembership: "IBP San Juan Chapter, Roll No. 12345",
    languages: ["English", "Filipino"],
    availability: "Mon-Fri, 8AM-5PM",
    casesHandled: 380,
    successRate: "89%",
    latitude: 14.6017,
    longitude: 121.0354
  },
  {
    id: "lawyer-009",
    name: "Atty. Liza Fernandez",
    specialization: "Environmental Law",
    practiceAreas: ["Environmental Law", "Mining Law", "Pollution Cases", "DENR Matters", "Land Use"],
    location: "Quezon City",
    officeAddress: "Unit 505, NCC Building, EDSA corner Examiner St., Quezon City",
    contact: "+63 925 901 2345",
    email: "liza.fernandez@envirolaw.ph",
    startingPrice: "₱4,500",
    consultationFee: "₱4,000 - ₱8,000",
    rating: 4.6,
    experience: "11 years",
    bio: "Atty. Liza Fernandez is an environmental law advocate who handles cases involving pollution, mining, and natural resource management. She works with communities and organizations to protect environmental rights.",
    education: [
      "Master of Laws in Environmental Law, University of California Berkeley",
      "Juris Doctor, University of the Philippines College of Law",
      "Bachelor of Science in Environmental Science, UP Los Baños"
    ],
    barMembership: "IBP Quezon City Chapter, Roll No. 90123",
    languages: ["English", "Filipino", "Spanish"],
    availability: "Mon-Fri, 9AM-5PM",
    casesHandled: 150,
    successRate: "86%",
    latitude: 14.6350,
    longitude: 121.0420
  },
  {
    id: "lawyer-010",
    name: "Atty. Roberto Aquino",
    specialization: "Intellectual Property",
    practiceAreas: ["Intellectual Property", "Trademarks", "Patents", "Copyright", "Trade Secrets"],
    location: "Mandaluyong City",
    officeAddress: "15F The Podium, ADB Avenue, Ortigas Center, Mandaluyong City",
    contact: "+63 926 012 3456",
    email: "roberto.aquino@iplaw.ph",
    startingPrice: "₱7,000",
    consultationFee: "₱5,000 - ₱15,000",
    rating: 4.9,
    experience: "19 years",
    bio: "Atty. Roberto Aquino is a leading intellectual property lawyer handling trademark registrations, patent applications, and IP litigation. He has represented major corporations and independent creators in protecting their intellectual property rights.",
    education: [
      "Master of Laws in Intellectual Property, George Washington University",
      "Juris Doctor, Ateneo Law School",
      "Bachelor of Science in Electronics Engineering, Mapua Institute of Technology"
    ],
    barMembership: "IBP Mandaluyong Chapter, Roll No. 01234",
    languages: ["English", "Filipino"],
    availability: "Mon-Fri, 9AM-6PM",
    casesHandled: 250,
    successRate: "91%",
    latitude: 14.5794,
    longitude: 121.0560
  }
];

/**
 * Get lawyers by specialization
 */
export function getLawyersBySpecialization(specialization) {
  const searchTerm = specialization.toLowerCase();
  return LAWYERS.filter(lawyer => 
    lawyer.specialization.toLowerCase().includes(searchTerm) ||
    lawyer.practiceAreas.some(area => area.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get lawyers by case type (maps case types to relevant specializations)
 */
export function getLawyersByCaseType(caseType) {
  const caseTypeMap = {
    "Property": ["Property Law", "Real Estate", "Civil Law"],
    "Criminal": ["Criminal Law", "Criminal Defense"],
    "Labor": ["Labor Law", "Employment Law"],
    "Family Law": ["Family Law", "Annulment", "Child Custody"],
    "Civil": ["Civil Law", "Contracts", "Damages"],
    "Consumer": ["Civil Law", "Consumer Protection"],
    "Corporate": ["Corporate Law", "Business Law"],
    "Tax": ["Tax Law", "BIR Cases"],
    "Immigration": ["Immigration Law"],
    "Environmental": ["Environmental Law"],
    "Intellectual Property": ["Intellectual Property", "IP Law"],
    "Cyber": ["Cybercrime", "Criminal Law"],
    "Administrative": ["Administrative Law", "Government"]
  };
  
  const relevantSpecializations = caseTypeMap[caseType] || [caseType];
  
  return LAWYERS.filter(lawyer => 
    relevantSpecializations.some(spec => 
      lawyer.specialization.toLowerCase().includes(spec.toLowerCase()) ||
      lawyer.practiceAreas.some(area => area.toLowerCase().includes(spec.toLowerCase()))
    )
  );
}

/**
 * Get lawyers by location
 */
export function getLawyersByLocation(location) {
  const searchTerm = location.toLowerCase();
  return LAWYERS.filter(lawyer => 
    lawyer.location.toLowerCase().includes(searchTerm) ||
    lawyer.officeAddress.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get all lawyers with coordinates for map display
 */
export function getLawyersWithCoordinates() {
  return LAWYERS.filter(lawyer => lawyer.latitude && lawyer.longitude);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get lawyers sorted by distance from a location
 */
export function getLawyersByDistance(userLat, userLon, lawyers = LAWYERS) {
  return lawyers
    .filter(lawyer => lawyer.latitude && lawyer.longitude)
    .map(lawyer => ({
      ...lawyer,
      distance: calculateDistance(userLat, userLon, lawyer.latitude, lawyer.longitude).toFixed(1) + " km"
    }))
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
}

export default LAWYERS;

