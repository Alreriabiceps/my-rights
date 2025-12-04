/**
 * Type Definitions (JSDoc)
 * Type structures for the legal assistance application
 */

/**
 * @typedef {Object} CaseSeverity
 * @property {"low" | "medium" | "high"} rating - Severity rating
 * @property {number} complexity - Complexity scale 1-10
 * @property {string} financialImpact - Description of financial impact
 * @property {string} timeSensitivity - Description of time sensitivity
 */

/**
 * @typedef {Object} StatuteOfLimitations
 * @property {boolean} applicable - Whether statute of limitations applies
 * @property {string | null} deadline - Deadline date string
 * @property {number | null} daysRemaining - Days remaining before deadline
 * @property {string | null} warning - Warning message if deadline is near
 */

/**
 * @typedef {Object} TimelineMilestone
 * @property {string} title - Milestone title
 * @property {string} description - Milestone description
 * @property {string} duration - Expected duration
 */

/**
 * @typedef {Object} CaseTimeline
 * @property {string} issueDuration - How long the issue has been ongoing
 * @property {StatuteOfLimitations} statuteOfLimitations - Statute of limitations info
 * @property {string} estimatedResolution - Estimated time to resolution
 * @property {TimelineMilestone[]} milestones - Key milestones in the case
 */

/**
 * @typedef {Object} RelevantLaw
 * @property {string} title - Law title
 * @property {string} law - Law citation
 * @property {string} description - Law description
 * @property {"high" | "medium" | "low"} relevance - Relevance to the case
 */

/**
 * @typedef {Object} Lawyer
 * @property {string} id - Unique identifier
 * @property {string} name - Lawyer's full name
 * @property {string} specialization - Primary specialization
 * @property {string[]} practiceAreas - All practice areas
 * @property {string} location - City/area location
 * @property {string} officeAddress - Full office address
 * @property {string} contact - Contact number
 * @property {string} [email] - Email address
 * @property {string} startingPrice - Starting consultation price
 * @property {string} [consultationFee] - Consultation fee range
 * @property {number} [rating] - Rating out of 5
 * @property {string} [experience] - Years of experience
 * @property {string} [bio] - Biography
 * @property {string[]} [education] - Educational background
 * @property {string} [barMembership] - Bar membership info
 * @property {string[]} [languages] - Languages spoken
 * @property {string} [availability] - Availability schedule
 * @property {number} [casesHandled] - Number of cases handled
 * @property {string} [successRate] - Success rate percentage
 * @property {number} [latitude] - Latitude coordinate
 * @property {number} [longitude] - Longitude coordinate
 * @property {string} [distance] - Distance from user
 */

/**
 * @typedef {Object} EstimatedCosts
 * @property {string} consultationFee - Consultation fee range
 * @property {string} filingFees - Court/agency filing fees
 * @property {string} totalEstimated - Total estimated cost
 * @property {string} [paymentPlan] - Available payment plans
 * @property {string} [additionalCosts] - Additional potential costs
 * @property {string} [costBreakdown] - Detailed cost breakdown
 */

/**
 * @typedef {Object} NextStep
 * @property {string} action - Action to take
 * @property {"high" | "medium" | "low"} priority - Priority level
 * @property {string | null} [deadline] - Deadline if applicable
 */

/**
 * @typedef {Object} GovernmentAgency
 * @property {string} name - Agency name
 * @property {string} purpose - Purpose/relevance to case
 * @property {string} contact - Contact information
 * @property {string} [website] - Agency website
 */

/**
 * @typedef {Object} EvidenceItem
 * @property {string} item - Evidence item name
 * @property {string} description - Description of the evidence
 * @property {"critical" | "important" | "helpful"} importance - Importance level
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {string[]} inactionRisks - Risks of not taking action
 * @property {string[]} actionBenefits - Benefits of taking action
 * @property {"low" | "medium" | "high"} urgencyLevel - Urgency level
 */

/**
 * @typedef {Object} CaseAnalysis
 * @property {string} caseType - Type of case
 * @property {CaseSeverity} severity - Severity assessment
 * @property {CaseTimeline} timeline - Timeline information
 * @property {RelevantLaw[]} relevantLaws - Relevant laws
 * @property {string[]} rights - User's rights
 * @property {Lawyer[]} lawyers - Recommended lawyers
 * @property {string[]} essentialDocuments - Required documents
 * @property {NextStep[]} nextSteps - Recommended next steps
 * @property {EstimatedCosts} [estimatedCosts] - Cost estimates
 * @property {RiskAssessment} [riskAssessment] - Risk assessment
 * @property {GovernmentAgency[]} [governmentAgencies] - Relevant agencies
 * @property {EvidenceItem[]} [evidenceGuide] - Evidence collection guide
 */

export default {};

