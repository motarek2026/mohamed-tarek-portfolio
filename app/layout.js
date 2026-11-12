import React from 'react';
import dynamic from 'next/dynamic';
import { Bricolage_Grotesque, Readex_Pro } from 'next/font/google';
import './globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';
import {
  getAppearance,
  getSiteData,
  getProjects,
  getCategories,
  getTranslations
} from '@/lib/content';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';
import Analytics from '@/components/Analytics';
import AmbientEffects from '@/components/AmbientEffects';
import Header from '@/components/Header';
import FloatingControls from '@/components/FloatingControls';
import SmoothScroll from '@/components/SmoothScroll';
import MotionEnhancer from '@/components/MotionEnhancer';
import PointerFX from '@/components/PointerFX';

const Lightbox = dynamic(() => import('@/components/Lightbox'), { ssr: false });

const bricolageFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-en'
});

const readexFont = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ar'
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    template: '%s | Mohamed Tarek — Portfolio 2026'
  },
  description:
    'Portfolio 2026 of Mohamed Tarek — Graphic Designer & UI/UX Designer. I design social media campaigns, brand identities, visuals, and bilingual Arabic/English websites that feel clear, confident, and easy to use.',
  authors: [{ name: 'Mohamed Tarek', url: SITE_URL }],
  creator: 'Mohamed Tarek',
  alternates: buildAlternates('/'),
  openGraph: {
    title: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    description:
      'I design campaigns, visuals and websites that feel clear, confident and easy to use.',
    url: '/',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE_DESCRIPTOR]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    description:
      'I design campaigns, visuals and websites that feel clear, confident and easy to use.',
    images: [DEFAULT_OG_IMAGE]
  },
  icons: {
    icon: '/images/logo.png'
  }
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0812' }
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const THEME_LANG_INIT_SCRIPT = `
(function() {
  try {
    var root = document.documentElement;
    var savedTheme = localStorage.getItem('mt_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      root.dataset.theme = savedTheme;
    }
    root.style.colorScheme = root.dataset.theme;
    var urlLang = new URLSearchParams(window.location.search || '').get('lang');
    var savedLang = localStorage.getItem('mt_lang');
    var lang = (urlLang === 'ar' || urlLang === 'en')
      ? urlLang
      : (savedLang === 'ar' || savedLang === 'en')
        ? savedLang
        : (/^ar/i.test(navigator.language || '') ? 'ar' : 'en');
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar' && window.location && window.location.pathname === '/') {
      document.title = 'محمد طارق — بورتفوليو 2026 | مصمم جرافيك و UI/UX';
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', 'بورتفوليو 2026 لمحمد طارق — مصمم جرافيك و UI/UX. أصمّم حملات سوشيال ميديا، هويات بصرية، ومواقع عربية وإنجليزية تبدو واضحة وواثقة وسهلة الاستخدام.');
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }) {
  const [appearance, siteData, projects, categories, translations] = await Promise.all([
    getAppearance(),
    getSiteData(),
    getProjects(),
    getCategories(),
    getTranslations()
  ]);

  const contactEmail = (
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    ''
  ).trim();

  const resolvedSiteData = contactEmail
    ? {
        ...siteData,
        socials: (siteData.socials || []).some((s) => s.id === 'email')
          ? (siteData.socials || []).map((s) =>
              s.id === 'email' && !String(s.value || '').trim()
                ? { ...s, value: contactEmail }
                : s
            )
          : [...(siteData.socials || []), { id: 'email', value: contactEmail }]
      }
    : siteData;

  const cssVars = {
    '--accent': appearance.accent || '#0359D7',
    '--pu': appearance.purple || '#7C3AED',
    '--pu2': appearance.purple2 || '#A78BFA',
    '--pk': appearance.pink || '#E879F9',
    '--f-en': `var(--font-en), var(--font-ar), system-ui, sans-serif`,
    '--f-ar': `var(--font-ar), var(--font-en), system-ui, sans-serif`
  };

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${bricolageFont.variable} ${readexFont.variable}`}
      data-theme={appearance.defaultTheme || 'dark'}
      data-motion={appearance.motionIntensity || 'normal'}
      data-custom-cursor={appearance.customCursor === false ? 'false' : 'true'}
      data-grain={appearance.grain === false ? 'false' : 'true'}
      style={cssVars}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_LANG_INIT_SCRIPT }} />
      </head>
      <body className="go settled written" suppressHydrationWarning>
        <PortfolioProvider
          initialSite={resolvedSiteData}
          initialProjects={projects}
          initialAppearance={appearance}
          initialCategories={categories}
          initialTranslations={translations}
        >
          <Analytics />
          <SmoothScroll />
          <MotionEnhancer />
          <PointerFX />
          <AmbientEffects />
          <Header />
          {children}
          <Lightbox />
          <FloatingControls />
        </PortfolioProvider>
      </body>
    </html>
  );
}
