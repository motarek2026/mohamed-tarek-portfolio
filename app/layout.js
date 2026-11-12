import React from 'react';
import dynamic from 'next/dynamic';
import './globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';
import {
  getAppearance,
  getSiteData,
  getProjects,
  getCategories,
  getTranslations
} from '@/lib/content';
import Analytics from '@/components/Analytics';
import AmbientEffects from '@/components/AmbientEffects';
import Header from '@/components/Header';
import FloatingControls from '@/components/FloatingControls';
import SmoothScroll from '@/components/SmoothScroll';
import MotionEnhancer from '@/components/MotionEnhancer';
import PointerFX from '@/components/PointerFX';

const Lightbox = dynamic(() => import('@/components/Lightbox'), { ssr: false });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    template: '%s | Mohamed Tarek — Portfolio 2026'
  },
  description:
    'Portfolio 2026 of Mohamed Tarek — Graphic Designer & UI/UX Designer. I design social media campaigns, brand identities, visuals, and bilingual Arabic/English websites that feel clear, confident, and easy to use.',
  keywords: [
    'Mohamed Tarek',
    'محمد طارق',
    'Graphic Designer',
    'UI/UX Designer',
    'Portfolio 2026',
    'Social Media Design',
    'Campaign Design',
    'Brand Identity',
    'Website UI/UX',
    'Figma Designer',
    'Egypt Graphic Designer'
  ],
  authors: [{ name: 'Mohamed Tarek' }],
  creator: 'Mohamed Tarek',
  openGraph: {
    title: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    description:
      'I design campaigns, visuals and websites that feel clear, confident and easy to use.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: 'Mohamed Tarek — Portfolio 2026',
    images: [
      {
        url: '/projects/iphone-18-pro-max/01.jpg',
        width: 1092,
        height: 1440,
        alt: 'Mohamed Tarek — Portfolio 2026 Selected Work'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    description:
      'I design campaigns, visuals and websites that feel clear, confident and easy to use.',
    images: ['/projects/iphone-18-pro-max/01.jpg']
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
    var savedLang = localStorage.getItem('mt_lang');
    var lang = (savedLang === 'ar' || savedLang === 'en')
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

  const cssVars = {
    '--accent': appearance.accent || '#0359D7',
    '--pu': appearance.purple || '#7C3AED',
    '--pu2': appearance.purple2 || '#A78BFA',
    '--pk': appearance.pink || '#E879F9',
    '--f-en': `'${appearance.fontFamilyEn || 'Bricolage Grotesque'}', 'Readex Pro', system-ui, sans-serif`,
    '--f-ar': `'${appearance.fontFamilyAr || 'Readex Pro'}', 'Bricolage Grotesque', system-ui, sans-serif`
  };

  return (
    <html
      lang="en"
      dir="ltr"
      data-theme={appearance.defaultTheme || 'dark'}
      data-motion={appearance.motionIntensity || 'normal'}
      data-custom-cursor={appearance.customCursor === false ? 'false' : 'true'}
      data-grain={appearance.grain === false ? 'false' : 'true'}
      style={cssVars}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_LANG_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Readex+Pro:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="go settled written" suppressHydrationWarning>
        <PortfolioProvider
          initialSite={siteData}
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
