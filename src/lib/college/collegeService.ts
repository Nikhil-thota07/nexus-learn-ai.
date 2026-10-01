/**
 * Nexus Learn AI - College Resolution & Domain Normalization Service
 * Handles dynamic college names, institutional domains (.ac.in, .edu, .edu.in, .ac.uk),
 * verification states, and curriculum isolation without hardcoding or throwing errors.
 */

export interface CollegeEntity {
  collegeId: string;
  collegeName: string;
  normalizedName: string;
  domain?: string;
  normalizedDomain?: string;
  officialWebsite?: string;
  universityId?: string;
  universityName?: string;
  regulationId?: string;
  verificationStatus: 'VERIFIED' | 'USER_PROVIDED' | 'PDF_VERIFIED' | 'UNVERIFIED';
  source: 'DIRECTORY' | 'OFFICIAL_REGISTRY' | 'USER_INPUT' | 'PDF_EXTRACTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeResolutionResult {
  success: boolean;
  status: 'VERIFIED' | 'UNVERIFIED' | 'USER_PROVIDED';
  college: CollegeEntity;
  message: string;
}

/**
 * Normalizes any URL or institutional domain input into a clean canonical hostname.
 * Examples:
 *   HTTPS://WWW.ExampleCollege.ac.in/ -> examplecollege.ac.in
 *   www.ExampleCollege.edu            -> examplecollege.edu
 *   http://nrcm.ac.in/admissions/    -> nrcm.ac.in
 */
export function normalizeCollegeDomain(input: string): string {
  if (!input) return '';
  let clean = input.trim().toLowerCase();

  // Remove protocol
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');

  // Remove path, query string, and hash
  clean = clean.split('/')[0].split('?')[0].split('#')[0];

  // Remove trailing dots or colons/ports
  clean = clean.replace(/:\d+$/, '').replace(/^\.+|\.+$/g, '');

  return clean;
}

/**
 * Detects whether an input string looks like an institutional domain or a college name.
 */
export function isDomainInput(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('www.')) {
    return true;
  }
  const domainPattern = /^[a-zA-Z0-9.-]+\.(?:ac\.in|edu\.in|edu|ac\.uk|org\.in|org|in|ernet\.in)$/i;
  return domainPattern.test(trimmed);
}

/**
 * Pre-verified directory of known Indian and International institutions
 */
const VERIFIED_COLLEGES_DIRECTORY: CollegeEntity[] = [
  {
    collegeId: 'nrcm-hyderabad',
    collegeName: 'Narsimha Reddy Engineering College',
    normalizedName: 'narsimha reddy engineering college',
    domain: 'nrcm.ac.in',
    normalizedDomain: 'nrcm.ac.in',
    officialWebsite: 'https://nrcm.ac.in',
    universityId: 'JNTUH',
    universityName: 'Jawaharlal Nehru Technological University Hyderabad',
    regulationId: 'R25',
    verificationStatus: 'VERIFIED',
    source: 'OFFICIAL_REGISTRY',
  },
  {
    collegeId: 'cbit-hyderabad',
    collegeName: 'Chaitanya Bharathi Institute of Technology',
    normalizedName: 'chaitanya bharathi institute of technology',
    domain: 'cbit.ac.in',
    normalizedDomain: 'cbit.ac.in',
    officialWebsite: 'https://www.cbit.ac.in',
    universityId: 'Osmania University',
    universityName: 'Osmania University',
    regulationId: 'R22',
    verificationStatus: 'VERIFIED',
    source: 'OFFICIAL_REGISTRY',
  },
  {
    collegeId: 'vnr-vjiet',
    collegeName: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    normalizedName: 'vnr vignana jyothi institute of engineering and technology',
    domain: 'vnrvjiet.ac.in',
    normalizedDomain: 'vnrvjiet.ac.in',
    officialWebsite: 'https://www.vnrvjiet.ac.in',
    universityId: 'JNTUH',
    universityName: 'JNTUH (Autonomous)',
    regulationId: 'R22',
    verificationStatus: 'VERIFIED',
    source: 'OFFICIAL_REGISTRY',
  },
  {
    collegeId: 'nit-warangal',
    collegeName: 'National Institute of Technology Warangal',
    normalizedName: 'national institute of technology warangal',
    domain: 'nitw.ac.in',
    normalizedDomain: 'nitw.ac.in',
    officialWebsite: 'https://www.nitw.ac.in',
    universityId: 'NIT',
    universityName: 'National Institute of Technology',
    regulationId: 'R21',
    verificationStatus: 'VERIFIED',
    source: 'OFFICIAL_REGISTRY',
  },
  {
    collegeId: 'iit-hyderabad',
    collegeName: 'Indian Institute of Technology Hyderabad',
    normalizedName: 'indian institute of technology hyderabad',
    domain: 'iith.ac.in',
    normalizedDomain: 'iith.ac.in',
    officialWebsite: 'https://www.iith.ac.in',
    universityId: 'IIT',
    universityName: 'Indian Institute of Technology',
    regulationId: 'R24',
    verificationStatus: 'VERIFIED',
    source: 'OFFICIAL_REGISTRY',
  },
];

/**
 * Resolves a college dynamically without throwing exceptions or hardcoding universities.
 */
export function resolveCollege(input: string): CollegeResolutionResult {
  if (!input || !input.trim()) {
    return {
      success: false,
      status: 'UNVERIFIED',
      college: {
        collegeId: 'unspecified',
        collegeName: 'Unspecified College',
        normalizedName: 'unspecified college',
        verificationStatus: 'UNVERIFIED',
        source: 'USER_INPUT',
      },
      message: 'Please provide a college name or website domain.',
    };
  }

  const raw = input.trim();
  const isDomain = isDomainInput(raw);
  const normalizedDomain = isDomain ? normalizeCollegeDomain(raw) : '';
  const normalizedName = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Search verified directory by domain or name
  let match: CollegeEntity | undefined;
  if (normalizedDomain) {
    match = VERIFIED_COLLEGES_DIRECTORY.find(
      (c) => c.normalizedDomain === normalizedDomain || (c.domain && c.domain.includes(normalizedDomain))
    );
  }

  if (!match) {
    match = VERIFIED_COLLEGES_DIRECTORY.find(
      (c) =>
        c.normalizedName === normalizedName ||
        normalizedName.includes(c.normalizedName) ||
        c.normalizedName.includes(normalizedName)
    );
  }

  if (match) {
    return {
      success: true,
      status: 'VERIFIED',
      college: match,
      message: `Verified official institution: ${match.collegeName}`,
    };
  }

  // 2. Unknown or Custom College — Never crash, never assume JNTUH
  const safeId = (normalizedDomain || normalizedName).replace(/[^a-z0-9]/g, '-').slice(0, 40) || 'custom-college';
  const displayName = isDomain
    ? normalizedDomain
    : raw
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

  return {
    success: true,
    status: 'UNVERIFIED',
    college: {
      collegeId: `custom-${safeId}`,
      collegeName: displayName,
      normalizedName,
      domain: normalizedDomain || undefined,
      normalizedDomain: normalizedDomain || undefined,
      officialWebsite: isDomain ? `https://${normalizedDomain}` : undefined,
      universityId: 'Not verified',
      universityName: 'Not verified',
      verificationStatus: 'UNVERIFIED',
      source: 'USER_INPUT',
    },
    message: 'College not automatically verified. You can continue by providing your university or uploading your syllabus PDF.',
  };
}
