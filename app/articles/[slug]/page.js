import React from 'react';
import { notFound } from 'next/navigation';
import ArticleReaderView from '@/components/ArticleReaderView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ARTICLES, getArticleBySlug } from '@/data/articlesData';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_DESCRIPTOR,
  buildAlternates
} from '@/lib/seo';

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const title = `${article.title.en} — Mohamed Tarek`;
  const description = article.excerpt.en;
  const canonicalPath = `/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: buildAlternates(canonicalPath),
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: 'article',
      locale: 'en_US',
      alternateLocale: ['ar_EG'],
      siteName: SITE_NAME,
      publishedTime: article.publishDate,
      authors: ['Mohamed Tarek'],
      images: [
        {
          ...DEFAULT_OG_IMAGE_DESCRIPTOR,
          url: article.coverImage || DEFAULT_OG_IMAGE,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.coverImage || DEFAULT_OG_IMAGE]
    }
  };
}

export default function SingleArticlePage({ params }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main id="app" className="standalone-single-article-page">
      <ArticleReaderView article={article} />
      <Contact />
      <Footer />
    </main>
  );
}
