export const SERVICES = [
  {
    title: 'Construction Jobs',
    desc: 'Full support for local job placement, documentation, and residency.',
    icon: '🏗️',
  },
  {
    title: 'Hospitality Positions',
    desc: 'Hotels, restaurants, resorts, and catering positions across Albania.',
    icon: '🍽️',
  },
  {
    title: 'IT & Tech Roles',
    desc: 'Attractive term contracts in technologies and IT tech work roles.',
    icon: '💻',
  },
  {
    title: 'Healthcare Careers',
    desc: 'Expert guidance for work permits and healthcare visa applications.',
    icon: '🏥',
  },
];

// Keep prices in sync with api/src/constants/pricing.js (inside: 50, outside: 200)
export const APPLICATION_TYPES = {
  inside: {
    label: 'Inside Albania',
    subtitle: 'Jobs & Residency',
    desc: 'Full support for local job placement, documentation, and residency.',
    price: '€50',
  },
  outside: {
    label: 'Outside Albania',
    subtitle: 'Work Visas & Permits',
    desc: 'Expert guidance for work permits and visa applications in the EU, USA, and beyond.',
    price: '€300 (approx 30,000 ALL)',
  },
};
