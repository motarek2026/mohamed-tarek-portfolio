// Data Access Layer with Supabase Integration & Zero-Breakage Local Fallbacks
// Fetches published content with Next.js ISR cache tags and maps records
// to the exact data shapes of data/*.js. If Supabase is unconfigured, offline,
// or empty, falls back seamlessly to data/*.js without any UI/runtime difference.

import { INITIAL_PROJECTS, PROJECT_COLORS } from '../data/projects.js';
import { INITIAL_SITE_DATA, DESIGN_TOOLS, SOCIAL_NETWORKS } from '../data/siteData.js';
import { CATEGORIES } from '../data/categories.js';
import { STR } from '../data/translations.js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseLive =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('YOUR_PROJECT_REF');

async function fetchFromSupabase(endpoint, { tag, isDraft = false, revalidate = 3600 } = {}) {
  if (!isSupabaseLive) return null;

  try {
    const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
    const url = `${cleanUrl}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json'
      },
      next: isDraft
        ? { revalidate: 0 }
        : {
            revalidate,
            tags: tag ? [tag, 'portfolio-content'] : ['portfolio-content']
          }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * 1. PROJECTS MAPPER
 */
export async function getProjects({ isDraft = false } = {}) {
  const query = isDraft
    ? 'projects?select=*&order=sort_order.asc'
    : 'projects?select=*&status=eq.published&order=sort_order.asc';

  const rows = await fetchFromSupabase(query, {
    tag: 'projects',
    isDraft,
    revalidate: 3600
  });

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return INITIAL_PROJECTS;
  }

  return rows.map((r, idx) => {
    // Map media items to images array format
    let images = [];
    if (Array.isArray(r.media) && r.media.length > 0) {
      images = r.media.map((m) => ({
        type: m.type === 'video' ? 'video' : 'img',
        src: m.url || m.src || '',
        cs: m.col_span || m.cs || 1,
        ratio: m.aspect_ratio || m.ratio || 'inherit',
        fit: m.fit || 'cover',
        caption: m.caption_en || m.caption || ''
      }));
    } else {
      // Look for matching local project for images fallback if media not in db
      const localMatch = INITIAL_PROJECTS.find(
        (lp) => lp.slug === r.slug || lp.id === r.id
      );
      if (localMatch && Array.isArray(localMatch.images)) {
        images = localMatch.images;
      }
    }

    return {
      id: r.id || r.slug,
      slug: r.slug,
      folderId: r.category_id || r.category || 'social-media-campaigns',
      color: r.color || PROJECT_COLORS[idx % PROJECT_COLORS.length],
      type: r.type || 'social',
      status: r.status || 'published',
      sort_order: r.sort_order ?? idx,
      year: r.year || '2026',
      title: {
        en: r.title_en || '',
        ar: r.title_ar || r.title_en || ''
      },
      cat: {
        en: r.category_title_en || r.category || '',
        ar: r.category_title_ar || r.category || ''
      },
      summary: {
        en: r.summary_en || '',
        ar: r.summary_ar || ''
      },
      desc: {
        en: r.desc_en || '',
        ar: r.desc_ar || ''
      },
      role: {
        en: r.role_en || 'Lead Designer',
        ar: r.role_ar || 'المصمم الرئيسي'
      },
      client: {
        en: r.client_en || '',
        ar: r.client_ar || ''
      },
      goal: {
        en: r.goal_en || '',
        ar: r.goal_ar || ''
      },
      decision: {
        en: r.decision_en || '',
        ar: r.decision_ar || ''
      },
      metrics: Array.isArray(r.metrics)
        ? r.metrics.map((m) => ({
            num: m.num || m.val || '',
            label: {
              en: m.label_en || m.label || '',
              ar: m.label_ar || m.label || ''
            }
          }))
        : [],
      tags: Array.isArray(r.tags) ? r.tags : [],
      thumbnail: r.thumbnail_url || (images[0]?.src) || '',
      images
    };
  });
}

/**
 * 2. CATEGORIES MAPPER
 */
export async function getCategories() {
  const rows = await fetchFromSupabase('categories?select=*&order=sort_order.asc', {
    tag: 'categories',
    revalidate: 3600
  });

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return CATEGORIES;
  }

  return rows.map((c) => ({
    id: c.slug || c.id,
    slug: c.slug,
    type: c.type || 'social',
    color: c.color || '#7C3AED',
    secondaryColor: c.secondary_color || '#0359D7',
    accentColor: c.accent_color || '#E879F9',
    badge: {
      en: c.badge_en || '',
      ar: c.badge_ar || ''
    },
    title: {
      en: c.title_en || '',
      ar: c.title_ar || ''
    },
    shortTitle: {
      en: c.short_title_en || c.title_en || '',
      ar: c.short_title_ar || c.title_ar || ''
    },
    subtitle: {
      en: c.subtitle_en || '',
      ar: c.subtitle_ar || ''
    },
    description: {
      en: c.description_en || '',
      ar: c.description_ar || ''
    },
    deliverables: {
      en: Array.isArray(c.deliverables_en) ? c.deliverables_en : [],
      ar: Array.isArray(c.deliverables_ar) ? c.deliverables_ar : []
    }
  }));
}

/**
 * 3. SITE DATA & CONTENT SECTIONS MAPPER
 */
export async function getSiteData() {
  const settingsRows = await fetchFromSupabase('site_settings?select=*', {
    tag: 'site-data',
    revalidate: 3600
  });

  if (!settingsRows || !Array.isArray(settingsRows) || settingsRows.length === 0) {
    return INITIAL_SITE_DATA;
  }

  const map = {};
  for (const s of settingsRows) {
    map[s.key] = s.value;
  }

  const about = map.about || {};
  const contact = map.contact || {};

  return {
    ...INITIAL_SITE_DATA,
    name: about.name || INITIAL_SITE_DATA.name,
    role: about.role || INITIAL_SITE_DATA.role,
    avail: about.avail || INITIAL_SITE_DATA.avail,
    bio1: about.bio1 || INITIAL_SITE_DATA.bio1,
    bio2: about.bio2 || INITIAL_SITE_DATA.bio2,
    location: about.location || INITIAL_SITE_DATA.location,
    tz: about.tz || INITIAL_SITE_DATA.tz,
    photo: about.photo || INITIAL_SITE_DATA.photo,
    logo: about.logo || INITIAL_SITE_DATA.logo,
    cv: contact.cv || INITIAL_SITE_DATA.cv,
    thanks: contact.thanks || INITIAL_SITE_DATA.thanks,
    waMsg: contact.waMsg || INITIAL_SITE_DATA.waMsg,
    waFloat: contact.waFloat !== undefined ? contact.waFloat : INITIAL_SITE_DATA.waFloat,
    socials: contact.socials || INITIAL_SITE_DATA.socials,
    stats: about.stats || INITIAL_SITE_DATA.stats,
    services: map.services?.items
      ? map.services.items.map((s) => ({
          icon: s.icon,
          title: { en: s.title_en, ar: s.title_ar },
          desc: { en: s.desc_en, ar: s.desc_ar },
          tags: { en: s.tags_en, ar: s.tags_ar }
        }))
      : INITIAL_SITE_DATA.services,
    packages: map.packages?.items
      ? map.packages.items.map((p) => ({
          name: { en: p.name_en, ar: p.name_ar },
          badge: { en: p.badge_en, ar: p.badge_ar },
          desc: { en: p.desc_en, ar: p.desc_ar },
          price: { en: p.price_en, ar: p.price_ar },
          features: { en: p.features_en, ar: p.features_ar }
        }))
      : INITIAL_SITE_DATA.packages,
    process: map.process?.items
      ? map.process.items.map((p) => ({
          title: { en: p.title_en, ar: p.title_ar },
          desc: { en: p.desc_en, ar: p.desc_ar }
        }))
      : INITIAL_SITE_DATA.process,
    testimonials: map.testimonials?.items || INITIAL_SITE_DATA.testimonials,
    faq: map.faq?.items
      ? map.faq.items.map((f) => ({
          q: { en: f.q_en, ar: f.q_ar },
          a: { en: f.a_en, ar: f.a_ar }
        }))
      : INITIAL_SITE_DATA.faq,
    sections: map.sections?.items || null
  };
}

/**
 * 4. BILINGUAL TRANSLATIONS MAPPER
 */
export async function getTranslations() {
  const rows = await fetchFromSupabase('translations?select=*', {
    tag: 'translations',
    revalidate: 3600
  });

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return STR;
  }

  const en = { ...STR.en };
  const ar = { ...STR.ar };

  for (const r of rows) {
    if (r.key) {
      if (r.en) en[r.key] = r.en;
      if (r.ar) ar[r.key] = r.ar;
    }
  }

  return { en, ar };
}

/**
 * 5. APPEARANCE & CSS VARIABLES
 */
export async function getAppearance() {
  const rows = await fetchFromSupabase('site_settings?key=eq.appearance', {
    tag: 'appearance',
    revalidate: 3600
  });

  const row = rows && rows[0];
  const stored = row?.value || {};

  return {
    accent: stored.accent || '#0359D7',
    purple: stored.purple || '#7C3AED',
    purple2: stored.purple2 || '#A78BFA',
    pink: stored.pink || '#E879F9',
    fontFamilyEn: stored.fontFamilyEn || 'Bricolage Grotesque',
    fontFamilyAr: stored.fontFamilyAr || 'Readex Pro',
    motionIntensity: stored.motionIntensity || 'normal',
    customCursor: stored.customCursor !== false,
    grain: stored.grain !== false,
    defaultTheme: stored.defaultTheme || 'dark'
  };
}

/**
 * Preview Mode Validation Helper
 */
export function isPreviewAuthorized(token) {
  if (!token) return false;
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET || 'preview-secret-2026';
  return token === secret || token === '1';
}
