import React from 'react';
import PricingPageView from '@/components/PricingPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pricing & Packages — Request a Quote',
  description:
    'Inquiry-based design packages and custom quotes by Mohamed Tarek: Social Media Pack, Brand Identity, UI/UX Design, and Video & Motion.',
  openGraph: {
    title: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026',
    description:
      'Explore design packages and request a custom quote for Social Media Design, Brand Identity, UI/UX Design, or Video & Motion.',
    type: 'website',
    images: [
      {
        url: '/projects/iphone-18-pro-max/01.jpg',
        width: 1092,
        height: 1440,
        alt: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Packages — Mohamed Tarek · Portfolio 2026',
    description:
      'Explore design packages and request a custom quote for Social Media Design, Brand Identity, UI/UX Design, or Video & Motion.',
    images: ['/projects/iphone-18-pro-max/01.jpg']
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
