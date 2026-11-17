'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AnimatedWords } from './SharedUI';
import { ARTICLES } from '@/data/articlesData';

export default function ArticlesPageView() {
  const { lang, tx, t } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isAr = lang === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCat =
        selectedCategory === 'all' || article.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleStr = (tx(article.title) || '').toLowerCase();
      const excerptStr = (tx(article.excerpt) || '').toLowerCase();
      const tagsStr = (article.tags || []).join(' ').toLowerCase();

      return titleStr.includes(q) || excerptStr.includes(q) || tagsStr.includes(q);
    });
  }, [selectedCategory, searchQuery, tx]);

  return (
    <div className="articles-page-wrapper">
      {/* Top Banner & Header */}
      <section className="articles-hero-banner">
        <div className="wrap">
          <div className="articles-hero-nav-back">
            <Link href="/" className="btn ghost btn-sm inline-flex-center">
              <BackIcon size={14} />
              <span>{isAr ? 'الرئيسية' : 'Back to Home'}</span>
            </Link>
          </div>

          <div className="articles-hero-text">
            <span className="eyebrow">
              <BookOpen size={14} className="eyebrow-icon" />
              {t('articlesPageBadge')}
            </span>
            <h1 className="title-xl">
              <AnimatedWords text={t('articlesPageTitle')} />
            </h1>
            <p className="lead articles-lead-max">{t('articlesPageLead')}</p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="articles-controls-bar">
            {/* Category Filter Pills */}
            <div className="art-filter-group" role="tablist" aria-label="Article categories">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                className={`art-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                {t('articlesFilterAll')}
                <span className="art-count-badge">{ARTICLES.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'graphic-design'}
                className={`art-pill-btn ${selectedCategory === 'graphic-design' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('graphic-design')}
              >
                {t('articlesFilterGraphic')}
                <span className="art-count-badge">
                  {ARTICLES.filter((a) => a.category === 'graphic-design').length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'ui-ux'}
                className={`art-pill-btn ${selectedCategory === 'ui-ux' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ui-ux')}
              >
                {t('articlesFilterUiUx')}
                <span className="art-count-badge">
                  {ARTICLES.filter((a) => a.category === 'ui-ux').length}
                </span>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="art-search-wrap">
              <Search size={16} className="art-search-icon" />
              <input
                type="text"
                placeholder={isAr ? 'ابحث في المقالات والوسوم...' : 'Search articles or topics...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="art-search-input"
                aria-label={isAr ? 'بحث في المقالات' : 'Search articles'}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="art-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Main Grid */}
      <section className="wrap articles-listing-section">
        {filteredArticles.length === 0 ? (
          <div className="articles-empty-state">
            <BookOpen size={48} className="empty-icon" />
            <h3>{isAr ? 'لم يتم العثور على مقالات مطابقة' : 'No articles found'}</h3>
            <p>
              {isAr
                ? 'جرّب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.'
                : 'Try refining your search keyword or clearing the active filter.'}
            </p>
            <button
              type="button"
              className="btn primary btn-sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="articles-catalog-grid">
            {filteredArticles.map((article) => {
              const categoryName = tx(article.categoryLabel);
              const title = tx(article.title);
              const subtitle = tx(article.subtitle);
              const excerpt = tx(article.excerpt);
              const readTime = tx(article.readTime);
              const isGraphic = article.category === 'graphic-design';

              return (
                <article key={article.slug} className="art-catalog-card">
                  <Link href={`/articles/${article.slug}`} className="art-catalog-card-inner">
                    <div className="art-catalog-thumb">
                      <Image
                        src={article.coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="art-catalog-img"
                      />
                      <div className="art-catalog-thumb-overlay" />
                      <span className={`art-cat-badge ${isGraphic ? 'cat-graphic' : 'cat-uiux'}`}>
                        {categoryName}
                      </span>
                    </div>

                    <div className="art-catalog-body">
                      <div className="art-meta-row">
                        <span className="art-meta-item">
                          <Clock size={12} />
                          {readTime}
                        </span>
                        <span className="art-meta-dot">•</span>
                        <span className="art-meta-item">
                          <Calendar size={12} />
                          {article.publishDate}
                        </span>
                      </div>

                      <h2 className="art-catalog-title">{title}</h2>
                      {subtitle && <p className="art-catalog-subtitle">{subtitle}</p>}
                      <p className="art-catalog-excerpt">{excerpt}</p>

                      <div className="art-catalog-tags">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="art-tag-chip">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="art-catalog-footer">
                        <span className="art-read-cta">
                          <span>{t('readArticleBtn')}</span>
                          <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
