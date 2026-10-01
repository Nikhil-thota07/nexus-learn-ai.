export interface Branch {
  id: string;
  name: string;
  shortName: string;
  category: 'Computing' | 'Electronics' | 'Electrical' | 'Mechanical' | 'Civil' | 'Chemical' | 'Other';
  aliases: string[];
  active: boolean;
}

export const BRANCH_CATALOG: Branch[] = [
  // --- COMPUTER / COMPUTING ---
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    shortName: 'CSE',
    category: 'Computing',
    aliases: ['cse', 'computer science', 'computer science & engineering', 'cs'],
    active: true,
  },
  {
    id: 'cse-aiml',
    name: 'CSE - Artificial Intelligence and Machine Learning',
    shortName: 'CSE (AI&ML)',
    category: 'Computing',
    aliases: ['cse-aiml', 'aiml', 'cse aiml', 'ai & ml', 'ai and ml', 'cse-ai-ml'],
    active: true,
  },
  {
    id: 'cse-ai',
    name: 'CSE - Artificial Intelligence',
    shortName: 'CSE (AI)',
    category: 'Computing',
    aliases: ['cse-ai', 'ai', 'cse ai'],
    active: true,
  },
  {
    id: 'cse-ds',
    name: 'CSE - Data Science',
    shortName: 'CSE (DS)',
    category: 'Computing',
    aliases: ['cse-ds', 'data science', 'cse data science', 'ds'],
    active: true,
  },
  {
    id: 'cse-cyber',
    name: 'CSE - Cyber Security',
    shortName: 'CSE (Cyber)',
    category: 'Computing',
    aliases: ['cse-cyber', 'cyber security', 'cse cyber security', 'cybersecurity'],
    active: true,
  },
  {
    id: 'cse-iot',
    name: 'CSE - Internet of Things',
    shortName: 'CSE (IoT)',
    category: 'Computing',
    aliases: ['cse-iot', 'iot', 'internet of things'],
    active: true,
  },
  {
    id: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    category: 'Computing',
    aliases: ['it', 'information technology'],
    active: true,
  },
  {
    id: 'aids',
    name: 'Artificial Intelligence and Data Science',
    shortName: 'AI & DS',
    category: 'Computing',
    aliases: ['aids', 'ai and data science', 'ai & ds'],
    active: true,
  },
  {
    id: 'ce-comp',
    name: 'Computer Engineering',
    shortName: 'CE',
    category: 'Computing',
    aliases: ['computer engineering', 'ce'],
    active: true,
  },

  // --- ELECTRONICS ---
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    shortName: 'ECE',
    category: 'Electronics',
    aliases: ['ece', 'electronics & communication engineering', 'electronics and communication'],
    active: true,
  },
  {
    id: 'eie',
    name: 'Electronics and Instrumentation Engineering',
    shortName: 'EIE',
    category: 'Electronics',
    aliases: ['eie', 'electronics & instrumentation', 'instrumentation'],
    active: true,
  },
  {
    id: 'ecm',
    name: 'Electronics and Computer Engineering',
    shortName: 'ECM',
    category: 'Electronics',
    aliases: ['ecm', 'electronics & computer engineering'],
    active: true,
  },
  {
    id: 'vlsi',
    name: 'VLSI Design / VLSI Engineering',
    shortName: 'VLSI',
    category: 'Electronics',
    aliases: ['vlsi', 'vlsi design', 'vlsi engineering'],
    active: true,
  },

  // --- ELECTRICAL ---
  {
    id: 'eee',
    name: 'Electrical and Electronics Engineering',
    shortName: 'EEE',
    category: 'Electrical',
    aliases: ['eee', 'electrical & electronics engineering', 'electrical and electronics'],
    active: true,
  },
  {
    id: 'ee',
    name: 'Electrical Engineering',
    shortName: 'EE',
    category: 'Electrical',
    aliases: ['ee', 'electrical engineering'],
    active: true,
  },

  // --- MECHANICAL ---
  {
    id: 'me',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    category: 'Mechanical',
    aliases: ['me', 'mech', 'mechanical'],
    active: true,
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics Engineering',
    shortName: 'Mechatronics',
    category: 'Mechanical',
    aliases: ['mechatronics', 'mechatronics engineering'],
    active: true,
  },
  {
    id: 'automobile',
    name: 'Automobile Engineering',
    shortName: 'Automobile',
    category: 'Mechanical',
    aliases: ['automobile', 'automobile engineering', 'auto'],
    active: true,
  },
  {
    id: 'robotics',
    name: 'Robotics and Automation',
    shortName: 'Robotics',
    category: 'Mechanical',
    aliases: ['robotics', 'robotics & automation', 'automation'],
    active: true,
  },

  // --- CIVIL ---
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'Civil',
    category: 'Civil',
    aliases: ['civil', 'civil engineering', 'ce-civil'],
    active: true,
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering',
    shortName: 'Environmental',
    category: 'Civil',
    aliases: ['environmental', 'environmental engineering'],
    active: true,
  },

  // --- CHEMICAL / PROCESS ---
  {
    id: 'chemical',
    name: 'Chemical Engineering',
    shortName: 'Chemical',
    category: 'Chemical',
    aliases: ['chemical', 'chemical engineering', 'chem'],
    active: true,
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    shortName: 'Biotech',
    category: 'Chemical',
    aliases: ['biotech', 'biotechnology', 'bt'],
    active: true,
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering',
    shortName: 'Biomedical',
    category: 'Chemical',
    aliases: ['biomedical', 'biomedical engineering', 'bme'],
    active: true,
  },

  // --- OTHER ---
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    shortName: 'Aerospace',
    category: 'Other',
    aliases: ['aerospace', 'aerospace engineering', 'aero', 'aeronautical'],
    active: true,
  },
  {
    id: 'mining',
    name: 'Mining Engineering',
    shortName: 'Mining',
    category: 'Other',
    aliases: ['mining', 'mining engineering'],
    active: true,
  },
  {
    id: 'metallurgy',
    name: 'Metallurgical Engineering',
    shortName: 'Metallurgy',
    category: 'Other',
    aliases: ['metallurgy', 'metallurgical engineering', 'materials'],
    active: true,
  },
  {
    id: 'food-tech',
    name: 'Food Technology',
    shortName: 'Food Tech',
    category: 'Other',
    aliases: ['food tech', 'food technology'],
    active: true,
  },
  {
    id: 'agri',
    name: 'Agricultural Engineering',
    shortName: 'Agriculture',
    category: 'Other',
    aliases: ['agriculture', 'agricultural engineering', 'agri'],
    active: true,
  },
  {
    id: 'textile',
    name: 'Textile Engineering',
    shortName: 'Textile',
    category: 'Other',
    aliases: ['textile', 'textile engineering'],
    active: true,
  },
  {
    id: 'petroleum',
    name: 'Petroleum Engineering',
    shortName: 'Petroleum',
    category: 'Other',
    aliases: ['petroleum', 'petroleum engineering'],
    active: true,
  },
  {
    id: 'other',
    name: 'Other / Not Listed',
    shortName: 'Other',
    category: 'Other',
    aliases: ['other', 'custom'],
    active: true,
  },
];

export function findBranch(identifier?: string | null): Branch | null {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  // Exact ID match
  const byId = BRANCH_CATALOG.find((b) => b.id.toLowerCase() === clean);
  if (byId) return byId;

  // Exact short name match
  const byShort = BRANCH_CATALOG.find((b) => b.shortName.toLowerCase() === clean);
  if (byShort) return byShort;

  // Exact name match
  const byName = BRANCH_CATALOG.find((b) => b.name.toLowerCase() === clean);
  if (byName) return byName;

  // Alias match
  const byAlias = BRANCH_CATALOG.find((b) => b.aliases.some((a) => a.toLowerCase() === clean));
  if (byAlias) return byAlias;

  // Partial match
  const byPartial = BRANCH_CATALOG.find(
    (b) => b.name.toLowerCase().includes(clean) || clean.includes(b.name.toLowerCase())
  );
  if (byPartial) return byPartial;

  return null;
}
