export const SIGNAL_CATEGORIES = [
  { id: "identity", label: "Identity and documents" },
  { id: "location", label: "Location, device, and access path" },
  { id: "payment", label: "Payment and payroll" },
  { id: "interview", label: "Interview and account behavior" },
  { id: "access", label: "Post-hire security behavior" },
  { id: "vendor", label: "Vendor and staffing controls" },
];

export const SIGNALS = [
  {
    id: "identityMismatch",
    category: "identity",
    weight: 20,
    label: "Name, address, education, work history, photo, phone, or email do not match across records.",
    evidence: "Preserve copies of the conflicting records and verify directly with the issuer.",
    actions: ["verifyDocuments", "pauseAccess"],
  },
  {
    id: "stolenIdentityConfirmed",
    category: "identity",
    weight: 35,
    critical: true,
    label: "Background check, victim contact, or official notice suggests stolen or borrowed identity.",
    evidence: "Do not publish the identity. Preserve evidence and contact law enforcement.",
    actions: ["lawEnforcement", "pauseAccess", "forensicPreserve"],
  },
  {
    id: "refusesLiveVerification",
    category: "identity",
    weight: 18,
    label: "Candidate refuses live video, in-person, fingerprinting, or equivalent identity verification.",
    evidence: "Record the requested verification method and the refusal or delay reason.",
    actions: ["verifyDocuments", "structuredInterview"],
  },
  {
    id: "duplicateApplicantArtifacts",
    category: "identity",
    weight: 18,
    label: "Different applicants reuse the same resume text, phone number, email, profile photo, portfolio, or payout details.",
    evidence: "Keep the duplicate artifacts and application timestamps.",
    actions: ["crossCheckApplicants", "verifyDocuments"],
  },
  {
    id: "alternateShippingAddress",
    category: "location",
    weight: 24,
    label: "Candidate asks for company equipment to ship somewhere other than the address on verified identity records.",
    evidence: "Save the shipping request, claimed reason, and address documents.",
    actions: ["shipOnlyVerified", "pauseAccess"],
  },
  {
    id: "cannotReceiveAtVerifiedAddress",
    category: "location",
    weight: 20,
    label: "Candidate cannot receive equipment or mail at the address shown on identity documentation.",
    evidence: "Document the verified address and any requested exception.",
    actions: ["shipOnlyVerified", "verifyDocuments"],
  },
  {
    id: "remoteDesktopOrKvm",
    category: "location",
    weight: 28,
    label: "Company device shows unauthorized remote desktop, KVM, proxy, VPN, VPS, or remote-control tooling.",
    evidence: "Capture endpoint telemetry, installed software list, and network indicators.",
    actions: ["forensicPreserve", "pauseAccess", "lawEnforcement"],
  },
  {
    id: "multiCountryLogins",
    category: "location",
    weight: 20,
    label: "One account logs in from multiple countries or implausible locations within a short period.",
    evidence: "Preserve authentication logs, IP metadata, session IDs, and device fingerprints.",
    actions: ["forensicPreserve", "pauseAccess"],
  },
  {
    id: "locationStoryWeak",
    category: "location",
    weight: 10,
    label: "Candidate cannot answer basic, non-sensitive questions about claimed current location or local work setup.",
    evidence: "Record the structured questions asked and the answers given.",
    actions: ["structuredInterview"],
  },
  {
    id: "cryptoPaymentRequest",
    category: "payment",
    weight: 8,
    label: "Candidate or vendor requests crypto payment outside approved payroll/KYC rails, before identity verification, or to a wallet inconsistent with verified identity.",
    evidence: "Do not treat normal USDC or crypto payroll as suspicious by itself. Preserve wallet ownership, KYC exceptions, payout changes, and identity mismatches.",
    actions: ["payrollReview", "sanctionsReview"],
  },
  {
    id: "thirdPartyPayment",
    category: "payment",
    weight: 18,
    label: "Payment account belongs to a third party, changes frequently, or overlaps with another applicant.",
    evidence: "Preserve bank/payment account metadata and account-change history.",
    actions: ["payrollReview", "crossCheckApplicants"],
  },
  {
    id: "prcLinkedPayment",
    category: "payment",
    weight: 12,
    label: "Payment routing or profile data creates unresolved sanctions or cross-border compliance concerns.",
    evidence: "Document why the route is inconsistent with the worker's verified identity and contract.",
    actions: ["payrollReview", "sanctionsReview"],
  },
  {
    id: "faceSwapOrProxyInterview",
    category: "interview",
    weight: 22,
    label: "Interview shows signs of face-swapping, AI video, hidden assistance, or a different person after onboarding.",
    evidence: "Keep approved interview artifacts under company policy and compare future meetings.",
    actions: ["structuredInterview", "verifyDocuments"],
  },
  {
    id: "livenessChallengeFailed",
    category: "interview",
    weight: 16,
    label: "Candidate cannot complete a neutral live liveness challenge, such as reading a random phrase and explaining a work sample on camera.",
    evidence: "Record the neutral challenge text, time, verification method, and observed failure without testing political beliefs.",
    actions: ["structuredInterview", "verifyDocuments"],
  },
  {
    id: "offPlatformPressure",
    category: "interview",
    weight: 8,
    label: "Candidate pushes hiring, communication, code review, or payment onto separate unapproved platforms.",
    evidence: "Save messages showing the requested channel change.",
    actions: ["structuredInterview"],
  },
  {
    id: "thinPortfolio",
    category: "interview",
    weight: 8,
    label: "Portfolio or company website is unusually thin, recently created, template-like, or inconsistent with claims.",
    evidence: "Archive public pages and compare them with resume and profile claims.",
    actions: ["verifyDocuments"],
  },
  {
    id: "repoExfiltration",
    category: "access",
    weight: 35,
    critical: true,
    label: "Worker copied repositories, secrets, wallet material, source code, or internal data to personal accounts.",
    evidence: "Preserve repository audit logs, cloud logs, and endpoint events.",
    actions: ["incidentResponse", "forensicPreserve", "lawEnforcement"],
  },
  {
    id: "credentialHarvesting",
    category: "access",
    weight: 32,
    critical: true,
    label: "Evidence suggests credential, session-cookie, MFA, wallet-key, or signing-key collection.",
    evidence: "Preserve security logs and rotate exposed credentials immediately.",
    actions: ["incidentResponse", "rotateSecrets", "lawEnforcement"],
  },
  {
    id: "extortionThreat",
    category: "access",
    weight: 45,
    critical: true,
    label: "Worker or related account threatens to leak data, code, customer records, or wallet information.",
    evidence: "Do not engage alone. Preserve the message and contact counsel and law enforcement.",
    actions: ["incidentResponse", "lawEnforcement", "forensicPreserve"],
  },
  {
    id: "vendorNoVetting",
    category: "vendor",
    weight: 15,
    label: "Staffing or outsourcing vendor cannot prove identity, location, sanctions, and subcontractor checks.",
    evidence: "Request the vendor control packet and note missing items.",
    actions: ["vendorAudit", "sanctionsReview"],
  },
  {
    id: "subcontractorSubstitution",
    category: "vendor",
    weight: 20,
    label: "The person doing the work appears different from the person vetted by the vendor or employer.",
    evidence: "Compare meeting artifacts, code authorship, account ownership, and access logs.",
    actions: ["vendorAudit", "pauseAccess", "verifyDocuments"],
  },
];

const ACTION_LIBRARY = {
  pauseAccess: "Pause onboarding or privileged access until identity, device path, and payment facts are reconciled.",
  verifyDocuments: "Verify identity, employment, and education directly with issuing institutions using independently sourced contacts.",
  structuredInterview: "Run a structured live interview with camera on, unobscured background, and consistent identity checks.",
  crossCheckApplicants: "Search HR systems for reused resumes, contacts, profile photos, payout accounts, and portfolio domains.",
  shipOnlyVerified: "Ship equipment only to the verified identity address and do not grant system access before checks finish.",
  payrollReview: "Escalate payment anomalies to payroll, finance, legal, and sanctions compliance.",
  sanctionsReview: "Screen against sanctions obligations and consult qualified counsel before payment or continued engagement.",
  forensicPreserve: "Preserve endpoint, network, SaaS, source-control, and authentication logs before changing the environment.",
  incidentResponse: "Activate incident response, rotate exposed credentials, and review repository, cloud, wallet, and signing access.",
  rotateSecrets: "Rotate credentials, wallet keys, deployment tokens, SSH keys, API keys, and session tokens that may be exposed.",
  lawEnforcement: "Report suspected DPRK IT worker activity to IC3, the local FBI field office, or the appropriate national authority.",
  vendorAudit: "Require the vendor to prove identity verification, location validation, subcontractor controls, and sanctions screening.",
};

const LEVELS = {
  low: {
    label: "Low observed risk",
    floor: 0,
    summary: "No strong DPRK IT worker pattern is present from the selected indicators.",
  },
  elevated: {
    label: "Elevated risk",
    floor: 25,
    summary: "Several inconsistencies require verification before trust or access increases.",
  },
  high: {
    label: "High risk",
    floor: 50,
    summary: "The pattern is consistent with known remote IT worker fraud indicators and needs escalation.",
  },
  critical: {
    label: "Critical incident risk",
    floor: 75,
    summary: "Selected indicators suggest possible active compromise, theft, or extortion.",
  },
};

export function assessCandidate(input = {}) {
  const selectedIds = normalizeSelectedIds(input);
  const signalById = new Map(SIGNALS.map((signal) => [signal.id, signal]));
  const selectedSignals = selectedIds
    .map((id) => signalById.get(id))
    .filter(Boolean);

  const rawScore = selectedSignals.reduce((total, signal) => total + signal.weight, 0);
  const score = Math.min(100, rawScore);
  const critical = selectedSignals.some((signal) => signal.critical);
  const level = critical ? "critical" : score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "elevated" : "low";
  const selectedCategories = new Set(selectedSignals.map((signal) => signal.category));

  return {
    score,
    level,
    label: LEVELS[level].label,
    summary: LEVELS[level].summary,
    selectedSignals: selectedSignals.map(({ id, category, weight, label, evidence }) => ({
      id,
      category,
      weight,
      label,
      evidence,
    })),
    categories: SIGNAL_CATEGORIES.filter((category) => selectedCategories.has(category.id)),
    actions: buildActions(level, selectedSignals),
    evidenceGaps: buildEvidenceGaps(selectedSignals),
  };
}

function normalizeSelectedIds(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.filter((value) => typeof value === "string"))];
  }

  if (Array.isArray(input.selectedSignals)) {
    return [...new Set(input.selectedSignals.filter((value) => typeof value === "string"))];
  }

  if (input.answers && typeof input.answers === "object") {
    return Object.entries(input.answers)
      .filter(([, selected]) => selected === true)
      .map(([id]) => id);
  }

  return [];
}

function buildActions(level, selectedSignals) {
  const actionIds = new Set();

  if (level === "low") {
    actionIds.add("verifyDocuments");
    actionIds.add("shipOnlyVerified");
  }

  if (level === "elevated") {
    actionIds.add("verifyDocuments");
    actionIds.add("structuredInterview");
    actionIds.add("shipOnlyVerified");
  }

  if (level === "high" || level === "critical") {
    actionIds.add("pauseAccess");
    actionIds.add("sanctionsReview");
    actionIds.add("forensicPreserve");
  }

  for (const signal of selectedSignals) {
    for (const action of signal.actions) {
      actionIds.add(action);
    }
  }

  return [...actionIds].map((id) => ({
    id,
    label: ACTION_LIBRARY[id],
  }));
}

function buildEvidenceGaps(selectedSignals) {
  if (selectedSignals.length === 0) {
    return [
      "Identity verification record",
      "Direct education and prior-employment confirmation",
      "Equipment shipping address matched to verified identity",
      "Payment account matched to verified worker",
    ];
  }

  return selectedSignals.map((signal) => signal.evidence);
}
