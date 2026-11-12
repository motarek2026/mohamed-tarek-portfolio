import React from 'react';
import { getSiteData } from '@/lib/content';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates,
  buildPersonJsonLd
} from '@/lib/seo';
import HomePageView from '@/components/HomePageView';

export const metadata = {
  title: {
    absolute: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer'
  },
  description:
    'Portfolio 2026 of Mohamed Tarek — Graphic Designer & UI/UX Designer. Explore selected social media campaigns, brand identities, and bilingual website UI/UX.',
  alternates: buildAlternates('/'),
  openGraph: {
    title: 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer',
    description:
      'Explore selected social media campaigns, brand identities, and bilingual website UI/UX by Mohamed Tarek.',
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
      'Explore selected social media campaigns, brand identities, and bilingual website UI/UX by Mohamed Tarek.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default async function HomePage() {
  const siteData = await getSiteData();
  const personJsonLd = buildPersonJsonLd(siteData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomePageView />
    </>
  );
}
