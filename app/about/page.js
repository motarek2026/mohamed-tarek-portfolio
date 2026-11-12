import React from 'react';
import AboutHero from '@/components/AboutHero';
import AboutIntro from '@/components/AboutIntro';
import Skills from '@/components/Skills';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import AboutCTA from '@/components/AboutCTA';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    absolute: 'About Mohamed Tarek — Portfolio 2026'
  },
  description:
    'About Mohamed Tarek — Graphic Designer & UI/UX Designer based in Egypt. I design campaigns, visuals and websites that feel clear, confident and easy to use.',
  openGraph: {
    title: 'About Mohamed Tarek — Portfolio 2026',
    description:
      'Graphic Designer & UI/UX Designer specializing in social media campaigns, brand identity, and website UI/UX.',
    type: 'profile',
    images: [
      {
        url: '/images/profile-photo.jpg',
        width: 900,
        height: 1200,
        alt: 'Mohamed Tarek — Graphic Designer & UI/UX Designer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Mohamed Tarek — Portfolio 2026',
    description:
      'Graphic Designer & UI/UX Designer specializing in social media campaigns, brand identity, and website UI/UX.',
    images: ['/images/profile-photo.jpg']
  }
};

export default function AboutPage() {
  return (
    <main id="app" className="standalone-about-page">
      <AboutHero />
      <AboutIntro />
      <Skills />
      <ExperienceTimeline />
      <AboutCTA />
      <Footer />
    </main>
  );
}
