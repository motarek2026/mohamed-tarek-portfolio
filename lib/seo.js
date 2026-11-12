export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mohamed-tarek-portfolio-ten.vercel.app'
).replace(/\/+$/, '');

export const SITE_NAME = 'Mohamed Tarek — Portfolio 2026';
export const DEFAULT_OG_IMAGE = '/opengraph-image';

export const DEFAULT_OG_IMAGE_DESCRIPTOR = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: 'Mohamed Tarek — Graphic Designer & UI/UX Designer'
};

export function normalizePathname(pathname = '/') {
  if (!pathname || pathname === '/') return '/';
  return `/${String(pathname).replace(/^\/+|\/+$/g, '')}`;
}

export function withLangQuery(pathname = '/', lang = 'en') {
  const normalized = normalizePathname(pathname);
  return normalized === '/' ? `/?lang=${lang}` : `${normalized}?lang=${lang}`;
}

export function buildAlternates(pathname = '/') {
  const normalized = normalizePathname(pathname);
  return {
    canonical: normalized,
    languages: {
      en: withLangQuery(normalized, 'en'),
      ar: withLangQuery(normalized, 'ar'),
      'x-default': normalized
    }
  };
}

export function toAbsoluteUrl(pathOrUrl = '/') {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalized}`;
}

export function toRelativeOrExternalUrl(src) {
  if (!src || typeof src !== 'string' || src.startsWith('data:')) {
    return DEFAULT_OG_IMAGE;
  }
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith('/') ? src : `/${src}`;
}

export function cleanDecisionText(text) {
  if (!text) return '';
  const trimmed = String(text).trim();
  if (
    /^add your design decisions here/i.test(trimmed) ||
    /^أضف قرارات التصميم هنا/.test(trimmed)
  ) {
    return '';
  }
  return trimmed;
}

export function cleanProjectDescription(project, lang = 'en') {
  if (!project) {
    return 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.';
  }
  const summaryText = (project.summary?.[lang] || project.summary?.en || '').trim();
  const goalText = (project.goal?.[lang] || project.goal?.en || '').trim();
  const decisionText = cleanDecisionText(
    project.decision?.[lang] || project.decision?.en || ''
  );
  const combined = [summaryText, goalText, decisionText].filter(Boolean).join(' ').trim();
  if (combined) return combined;
  const title = project.title?.[lang] || project.title?.en || 'Project Case Study';
  const cat = project.cat?.[lang] || project.cat?.en || 'Design';
  return `${title} — ${cat} case study by Mohamed Tarek, Graphic Designer & UI/UX Designer.`;
}

export function buildPersonJsonLd(siteData) {
  const socials = Array.isArray(siteData?.socials)
    ? siteData.socials
        .map((s) => (typeof s?.value === 'string' ? s.value.trim() : ''))
        .filter((val) => /^https?:\/\//i.test(val))
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteData?.name?.en || 'Mohamed Tarek',
    alternateName: siteData?.name?.ar || 'محمد طارق',
    jobTitle: siteData?.role?.en || 'Graphic Designer & UI/UX Designer',
    description:
      siteData?.bio1?.en ||
      'Graphic Designer & UI/UX Designer specializing in social media campaigns, brand identity, and websites.',
    url: SITE_URL,
    image: toAbsoluteUrl(siteData?.photo || '/images/profile-photo.jpg'),
    sameAs: socials
  };
}

export function buildCreativeWorkJsonLd(project, category, pathname) {
  const title = project?.title?.en || 'Project Case Study';
  const description = cleanProjectDescription(project, 'en');
  const cover = toRelativeOrExternalUrl(project?.thumbnail);
  const categoryName = category?.title?.en || project?.cat?.en || 'Design';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url: toAbsoluteUrl(pathname),
    image: toAbsoluteUrl(cover),
    genre: categoryName,
    inLanguage: ['en', 'ar'],
    creator: {
      '@type': 'Person',
      name: 'Mohamed Tarek',
      jobTitle: 'Graphic Designer & UI/UX Designer',
      url: SITE_URL
    }
  };

  if (project?.year) {
    jsonLd.dateCreated = String(project.year);
  }

  return jsonLd;
}
