import React from 'react';
import AboutHero from '@/components/AboutHero';
import AboutIntro from '@/components/AboutIntro';
import AboutFocus from '@/components/AboutFocus';
import Skills from '@/components/Skills';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import AboutCTA from '@/components/AboutCTA';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: {
    absolute: 'About Mohamed Tarek — Portfolio 2026'
  },
  description:
    'About Mohamed Tarek — Graphic Designer & UI/UX Designer based in Egypt. I design campaigns, visuals and websites that feel clear, confident and easy to use.',
  alternates: buildAlternates('/about'),
  openGraph: {
    title: 'About Mohamed Tarek — Portfolio 2026',
    description:
      'Graphic Designer & UI/UX Designer specializing in social media campaigns, brand identity, and website UI/UX.',
    url: '/about',
    type: 'profile',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'About Mohamed Tarek — Graphic Designer & UI/UX Designer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Mohamed Tarek — Portfolio 2026',
    description:
      'Graphic Designer & UI/UX Designer specializing in social media campaigns, brand identity, and website UI/UX.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function AboutPage() {
  return (
    <main id="app" className="standalone-about-page">
      <AboutHero />
      <AboutIntro />
      <AboutFocus />
      <Skills />
      <ExperienceTimeline />
      <AboutCTA />
      <Footer />
    </main>
  );
}
