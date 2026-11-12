import React from 'react';
import CreativeLabView from '@/components/CreativeLabView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Creative Lab — Video & Motion',
  description:
    'Short edits and motion for reels, ads and product launches by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
  openGraph: {
    title: 'Creative Lab — Mohamed Tarek · Portfolio 2026',
    description:
      'Short edits and motion for reels, ads and product launches by Mohamed Tarek.',
    type: 'website',
    images: [
      {
        url: '/projects/iphone-18-pro-max/01.jpg',
        width: 1092,
        height: 1440,
        alt: 'Creative Lab — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Lab — Mohamed Tarek · Portfolio 2026',
    description:
      'Short edits and motion for reels, ads and product launches by Mohamed Tarek.',
    images: ['/projects/iphone-18-pro-max/01.jpg']
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
