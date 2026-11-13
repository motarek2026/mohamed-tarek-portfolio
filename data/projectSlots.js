/**
 * Empty project slots (drafts).
 *
 * Each slot is HIDDEN everywhere (cards, counts, filters, sitemap, routes) while `draft: true`.
 * To publish a slot:
 *   1. Fill in title / goal / role / tools / thumbnail / images (replace every "TODO").
 *   2. Delete the `draft: true` line (or set it to false).
 *
 * Target totals:  Social Media = 10 · Website UI/UX = 6 · Branding = 4
 * (3 social + 2 UI/UX projects already exist in data/projects.js, so slots below fill the rest.)
 */

const COLORS = ['#7C3AED', '#0359D7', '#C026D3', '#4F46E5', '#9333EA', '#2563EB'];

const FOLDERS = {
  social: {
    folderId: 'social-media-campaigns',
    type: 'social',
    cat: { en: 'Social Media Campaign', ar: 'حملة سوشيال ميديا' },
    prefix: 'social',
    label: { en: 'Social Media', ar: 'سوشيال ميديا' }
  },
  uiux: {
    folderId: 'website-ui-ux',
    type: 'uiux',
    cat: { en: 'Website UI/UX', ar: 'تصميم واجهات UI/UX' },
    prefix: 'uiux',
    label: { en: 'UI/UX', ar: 'UI/UX' }
  },
  branding: {
    folderId: 'branding-identity',
    type: 'branding',
    cat: { en: 'Branding & Visual Identity', ar: 'الهوية البصرية والبراندينج' },
    prefix: 'branding',
    label: { en: 'Branding', ar: 'هوية بصرية' }
  }
};

function makeSlot(kind, number, startIndex) {
  const f = FOLDERS[kind];
  const n = String(number).padStart(2, '0');
  const id = `${f.prefix}-slot-${n}`;
  return {
    id,
    slug: id,
    draft: true, // <- remove this line (or set false) to publish the project
    folderId: f.folderId,
    type: f.type,
    projectType: 'concept', // "client" | "concept" | "personal"
    sub: '',
    color: COLORS[(startIndex + number) % COLORS.length],
    year: '2026',
    featured: false,
    role: { en: 'TODO: your role', ar: 'TODO: دورك في المشروع' },
    tools: [],
    title: {
      en: `TODO: ${f.label.en} project ${n}`,
      ar: `TODO: مشروع ${f.label.ar} ${n}`
    },
    cat: f.cat,
    goal: { en: 'TODO: write the project overview', ar: 'TODO: اكتب نبذة عن المشروع' },
    overview: { en: 'TODO: write the project overview', ar: 'TODO: اكتب نبذة عن المشروع' },
    challenge: { en: 'TODO: write the challenge', ar: 'TODO: اكتب التحدي لهذا المشروع' },
    approach: { en: 'TODO: write the approach', ar: 'TODO: اكتب أسلوب العمل' },
    results: null,
    cols: 3,
    ratio: '3/4',
    align: 'start',
    meta: [],
    thumbnail: '', // e.g. '/projects/<slug>/01.jpg'
    images: [] // [{ type:'img', src, width, height, cs:1, ratio:'inherit', fit:'cover', caption:{en,ar}, alt:{en,ar} }]
  };
}

// 4 social projects exist (iPhone, Twist, Saudi National Day, Starville) -> 6 more slots (05..10) to reach 10
const socialSlots = Array.from({ length: 6 }, (_, i) => makeSlot('social', i + 5, 0));
// 2 UI/UX projects exist -> 4 more slots (03..06)
const uiuxSlots = Array.from({ length: 4 }, (_, i) => makeSlot('uiux', i + 3, 2));
// 0 branding projects exist -> 4 slots (01..04)
const brandingSlots = Array.from({ length: 4 }, (_, i) => makeSlot('branding', i + 1, 4));

export const PROJECT_SLOTS = [...socialSlots, ...uiuxSlots, ...brandingSlots];
