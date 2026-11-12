import React from 'react';
import ServicesPageView from '@/components/ServicesPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Services — Social Media, Branding, UI/UX & Motion',
  description:
    'Design services by Mohamed Tarek: Social Media Design, Branding & Visual Identity, Website & Mobile App UI/UX Design, and Video & Motion.',
  openGraph: {
    title: 'Services — Mohamed Tarek · Portfolio 2026',
    description:
      'Social Media Design, Branding, UI/UX Design, and Video & Motion services by Mohamed Tarek.',
    type: 'website',
    images: [
      {
        url: '/projects/iphone-18-pro-max/01.jpg',
        width: 1092,
        height: 1440,
        alt: 'Services — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — Mohamed Tarek · Portfolio 2026',
    description:
      'Social Media Design, Branding, UI/UX Design, and Video & Motion services by Mohamed Tarek.',
    images: ['/projects/iphone-18-pro-max/01.jpg']
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
