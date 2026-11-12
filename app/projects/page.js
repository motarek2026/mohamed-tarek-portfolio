import React from 'react';
import ProjectsPageView from '@/components/ProjectsPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Projects — Selected Design Work',
  description:
    'Selected work by Mohamed Tarek — social media campaigns, product advertising, brand identity and bilingual website UI/UX. Open any project for its full case study.',
  alternates: buildAlternates('/projects'),
  openGraph: {
    title: 'Projects — Mohamed Tarek · Portfolio 2026',
    description: 'Browse all projects and open each one as its own case study page.',
    url: '/projects',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Projects — Mohamed Tarek · Portfolio 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects — Mohamed Tarek · Portfolio 2026',
    description: 'Browse all projects and open each one as its own case study page.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function ProjectsPage() {
  return (
    <main id="app" className="standalone-folder-page">
      <ProjectsPageView />
      <Contact />
      <Footer />
    </main>
  );
}
