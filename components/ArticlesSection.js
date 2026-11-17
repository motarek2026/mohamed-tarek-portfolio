'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock, Tag } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AnimatedWords } from './SharedUI';
import { ARTICLES } from '@/data/articlesData';

export default function ArticlesSection() {
  const { lang, tx, t } = usePortfolio();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Take the first 3-4 featured/top articles for the home page showcase
  const previewArticles = ARTICLES.slice(0, 4);

  return (
    <section id="articles" className="wrap articles-home-section" aria-label={t('homeArticlesTitle')}>
      {/* Section Header */}
      <div className="section-head">
        <div>
          <span className="eyebrow">
            <BookOpen size={13} className="eyebrow-icon" />
            {t('homeArticlesBadge')}
          </span>
          <h2 className="title-lg">
            <AnimatedWords text={t('homeArticlesTitle')} />
          </h2>
          <p className="lead">{t('homeArticlesSub')}</p>
        </div>
        <div className="sh-actions">
          <Link href="/articles" className="btn ghost view-all-art-btn">
            <span>{t('viewAllArticles')}</span>
            <ArrowIcon size={15} />
          </Link>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="articles-preview-grid">
        {previewArticles.map((article, idx) => {
          const categoryName = tx(article.categoryLabel);
          const title = tx(article.title);
          const excerpt = tx(article.excerpt);
          const readTime = tx(article.readTime);
          const isGraphic = article.category === 'graphic-design';

          return (
            <article
              key={article.slug}
              className={`article-card ${idx === 0 ? 'article-card-featured' : ''}`}
            >
              <Link href={`/articles/${article.slug}`} className="art-card-inner">
                {/* Visual Thumbnail */}
                <div className="art-thumb-wrap">
                  <Image
                    src={article.coverImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="art-thumb-img"
                  />
                  <div className="art-thumb-overlay" />
                  <span className={`art-cat-badge ${isGraphic ? 'cat-graphic' : 'cat-uiux'}`}>
                    {categoryName}
                  </span>
                </div>

                {/* Content Area */}
                <div className="art-card-content">
                  <div className="art-meta-row">
                    <span className="art-meta-item">
                      <Clock size={12} />
                      {readTime}
                    </span>
                    <span className="art-meta-dot">•</span>
                    <span className="art-meta-item">
                      <Tag size={12} />
                      {article.tags[0]}
                    </span>
                  </div>

                  <h3 className="art-card-title">{title}</h3>
                  <p className="art-card-excerpt">{excerpt}</p>

                  <div className="art-card-footer">
                    <span className="art-read-link">
                      <span>{t('readArticleBtn')}</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
