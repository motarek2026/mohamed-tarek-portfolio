import React from 'react';
import PricingPageView from '@/components/PricingPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Pricing & Packages — Request a Quote',
  description:
    'Inquiry-based design packages and custom quotes by Mohamed Tarek: Social Media Pack, Brand Identity, UI/UX Design, and Video & Motion.',
  alternates: buildAlternates('/pricing'),
  openGraph: {
    title: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026',
    description:
      'Explore design packages and request a custom quote for Social Media Design, Brand Identity, UI/UX Design, or Video & Motion.',
    url: '/pricing',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026',
    description:
      'Explore design packages and request a custom quote for Social Media Design, Brand Identity, UI/UX Design, or Video & Motion.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function PricingPage() {
  return (
    <main id="app" className="standalone-about-page standalone-pricing-page">
      <PricingPageView />
      <Contact />
      <Footer />
    </main>
  );
}
