import React from 'react';
import StartProjectView from '@/components/StartProjectView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Start a Project — Project Inquiry & Brief',
  description:
    'Start a design project with Mohamed Tarek — Graphic Designer & UI/UX Designer. Submit your project brief for Social Media Design, Branding, UI/UX Design, or Video & Motion.',
  alternates: buildAlternates('/start-project'),
  openGraph: {
    title: 'Start a Project — Mohamed Tarek · Portfolio 2026',
    description:
      'Submit a project brief for Social Media Design, Branding, Website & App UI/UX Design, or Video & Motion.',
    url: '/start-project',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Start a Project — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a Project — Mohamed Tarek · Portfolio 2026',
    description:
      'Submit a project brief for Social Media Design, Branding, Website & App UI/UX Design, or Video & Motion.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function StartProjectPage() {
  return (
    <main id="app" className="standalone-about-page standalone-start-project-page">
      <StartProjectView />
      <Contact />
      <Footer />
    </main>
  );
}
