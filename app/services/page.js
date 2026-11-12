import React from 'react';
import ServicesPageView from '@/components/ServicesPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Services — Social Media, Branding, UI/UX & Motion',
  description:
    'Design services by Mohamed Tarek: Social Media Design, Branding & Visual Identity, Website & Mobile App UI/UX Design, and Video & Motion.',
  alternates: buildAlternates('/services'),
  openGraph: {
    title: 'Services — Mohamed Tarek · Portfolio 2026',
    description:
      'Social Media Design, Branding, UI/UX Design, and Video & Motion services by Mohamed Tarek.',
    url: '/services',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Services — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — Mohamed Tarek · Portfolio 2026',
    description:
      'Social Media Design, Branding, UI/UX Design, and Video & Motion services by Mohamed Tarek.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function ServicesPage() {
  return (
    <main id="app" className="standalone-about-page standalone-services-page">
      <ServicesPageView />
      <Contact />
      <Footer />
    </main>
  );
}
