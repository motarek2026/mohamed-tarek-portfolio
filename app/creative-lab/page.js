import React from 'react';
import CreativeLabView from '@/components/CreativeLabView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Creative Lab — Video & Motion',
  description:
    'Short edits and motion for reels, ads and product launches by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
  alternates: buildAlternates('/creative-lab'),
  openGraph: {
    title: 'Creative Lab — Mohamed Tarek · Portfolio 2026',
    description:
      'Short edits and motion for reels, ads and product launches by Mohamed Tarek.',
    url: '/creative-lab',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Creative Lab — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Lab — Mohamed Tarek · Portfolio 2026',
    description:
      'Short edits and motion for reels, ads and product launches by Mohamed Tarek.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function CreativeLabPage() {
  return (
    <main id="app" className="standalone-about-page standalone-creative-lab-page">
      <CreativeLabView />
      <Contact />
      <Footer />
    </main>
  );
}
