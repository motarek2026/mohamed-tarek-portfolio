import React from 'react';
import ArticlesPageView from '@/components/ArticlesPageView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export const metadata = {
  title: 'Articles & Design Insights — Mohamed Tarek',
  description:
    'In-depth articles and methodologies on Graphic Design, Social Media Advertising, Visual Hierarchy, and UI/UX Design Systems by Mohamed Tarek.',
  alternates: buildAlternates('/articles'),
  openGraph: {
    title: 'Articles on Graphic Design & UI/UX — Mohamed Tarek',
    description:
      'In-depth essays on visual hierarchy, commercial color psychology, Arabic typography, and scalable UI design systems.',
    url: '/articles',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    siteName: SITE_NAME,
    images: [
      {
        ...DEFAULT_OG_IMAGE_DESCRIPTOR,
        alt: 'Articles on Graphic Design & UI/UX — Mohamed Tarek'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles on Graphic Design & UI/UX — Mohamed Tarek',
    description:
      'In-depth essays on visual hierarchy, commercial color psychology, Arabic typography, and scalable UI design systems.',
    images: [DEFAULT_OG_IMAGE]
  }
};

export default function ArticlesPage() {
  return (
    <main id="app" className="standalone-articles-page">
      <ArticlesPageView />
      <Contact />
      <Footer />
    </main>
  );
}
