import React from 'react';
import StartProjectView from '@/components/StartProjectView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Start a Project — Project Inquiry & Brief',
  description:
    'Start a design project with Mohamed Tarek — Graphic Designer & UI/UX Designer. Submit your project brief for Social Media Design, Branding, UI/UX Design, or Video & Motion.',
  openGraph: {
    title: 'Start a Project — Mohamed Tarek · Portfolio 2026',
    description:
      'Submit a project brief for Social Media Design, Branding, Website & App UI/UX Design, or Video & Motion.',
    type: 'website',
    images: [
      {
        url: '/projects/iphone-18-pro-max/01.jpg',
        width: 1092,
        height: 1440,
        alt: 'Start a Project — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a Project — Mohamed Tarek · Portfolio 2026',
    description:
      'Submit a project brief for Social Media Design, Branding, Website & App UI/UX Design, or Video & Motion.',
    images: ['/projects/iphone-18-pro-max/01.jpg']
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
