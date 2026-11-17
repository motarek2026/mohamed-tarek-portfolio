'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Share2,
  Tag,
  User
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { ARTICLES } from '@/data/articlesData';

export default function ArticleReaderView({ article }) {
  const { lang, tx, t } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const isAr = lang === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  if (!article) return null;

  const title = tx(article.title);
  const subtitle = tx(article.subtitle);
  const categoryName = tx(article.categoryLabel);
  const readTime = tx(article.readTime);
  const rawContent = article.content?.[lang] || article.content?.ar || article.content?.en || '';
  const isGraphic = article.category === 'graphic-design';

  // Find related articles in same or different categories
  const relatedArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: subtitle,
          url
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore
    }
  };

  // Simple, clean markdown rendering for headings, lists, paragraphs, code spans, bold text
  const renderFormattedContent = (content) => {
    const lines = content.trim().split('\n');
    const elements = [];
    let listBuffer = [];

    const flushList = (keyPrefix) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`${keyPrefix}-list`} className="art-body-list">
            {listBuffer.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const formatInline = (text) => {
      // Simple inline token parsing for bold **text**, inline `code`, and *italics*
      const parts = [];
      const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        const m = match[0];
        if (m.startsWith('**') && m.endsWith('**')) {
          parts.push(<strong key={match.index}>{m.slice(2, -2)}</strong>);
        } else if (m.startsWith('`') && m.endsWith('`')) {
          parts.push(<code key={match.index} className="art-inline-code">{m.slice(1, -1)}</code>);
        } else if (m.startsWith('*') && m.endsWith('*')) {
          parts.push(<em key={match.index}>{m.slice(1, -1)}</em>);
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushList(`empty-${i}`);
        continue;
      }

      if (line === '---') {
        flushList(`hr-${i}`);
        elements.push(<hr key={`hr-${i}`} className="art-divider" />);
        continue;
      }

      if (line.startsWith('### ')) {
        flushList(`h3-${i}`);
        elements.push(
          <h3 key={`h3-${i}`} className="art-body-h3">
            {formatInline(line.slice(4))}
          </h3>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        flushList(`h2-${i}`);
        elements.push(
          <h2 key={`h2-${i}`} className="art-body-h2">
            {formatInline(line.slice(3))}
          </h2>
        );
        continue;
      }

      if (line.startsWith('- ')) {
        listBuffer.push(line.slice(2));
        continue;
      }

      flushList(`p-${i}`);
      elements.push(
        <p key={`p-${i}`} className="art-body-p">
          {formatInline(line)}
        </p>
      );
    }

    flushList('final');
    return elements;
  };

  return (
    <article className="article-reader-container">
      {/* Top Navigation Bar */}
      <div className="art-reader-nav-bar">
        <div className="wrap art-reader-nav-inner">
          <Link href="/articles" className="btn ghost btn-sm inline-flex-center">
            <BackIcon size={14} />
            <span>{t('backToArticles')}</span>
          </Link>

          <button
            type="button"
            className={`btn ghost btn-sm art-share-btn ${copied ? 'copied' : ''}`}
            onClick={handleShare}
            aria-label="Share article"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copied ? t('copiedLink') : t('shareArticle')}</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="wrap art-reader-header">
        <div className="art-reader-meta-top">
          <span className={`art-cat-badge ${isGraphic ? 'cat-graphic' : 'cat-uiux'}`}>
            {categoryName}
          </span>
          <span className="art-meta-item">
            <Clock size={13} />
            {readTime}
          </span>
          <span className="art-meta-dot">•</span>
          <span className="art-meta-item">
            <Calendar size={13} />
            {article.publishDate}
          </span>
        </div>

        <h1 className="art-reader-title">{title}</h1>
        {subtitle && <p className="art-reader-lead">{subtitle}</p>}

        {/* Author Byline */}
        <div className="art-author-card">
          <div className="art-author-avatar-wrap">
            <Image
              src="/images/profile-photo.jpg"
              alt="Mohamed Tarek"
              width={48}
              height={48}
              className="art-author-avatar"
            />
          </div>
          <div className="art-author-info">
            <span className="art-author-name">Mohamed Tarek · محمد طارق</span>
            <span className="art-author-title">
              {isAr
                ? 'Senior Graphic Designer & UI/UX Designer'
                : 'Senior Graphic Designer & UI/UX Designer'}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="wrap art-cover-section">
        <div className="art-cover-wrap">
          <Image
            src={article.coverImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="art-cover-image"
          />
        </div>
      </div>

      {/* Article Rich Body Content */}
      <main className="wrap art-prose-wrap">
        <div className="art-body-content">{renderFormattedContent(rawContent)}</div>

        {/* Article Tags */}
        <div className="art-footer-tags">
          <div className="art-tags-label">
            <Tag size={14} />
            <span>{isAr ? 'الوسوم والمواضيع:' : 'Topics & Tags:'}</span>
          </div>
          <div className="art-tags-list">
            {article.tags.map((tag) => (
              <span key={tag} className="art-tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="art-author-box">
          <div className="aab-avatar">
            <Image
              src="/images/profile-photo.jpg"
              alt="Mohamed Tarek"
              width={64}
              height={64}
              className="aab-img"
            />
          </div>
          <div className="aab-text">
            <h4 className="aab-name">Mohamed Tarek — محمد طارق</h4>
            <p className="aab-bio">
              {isAr
                ? 'مصمم جرافيك ومصمم واجهات وتجربة مستخدم (UI/UX) مقيم في مصر. متخصص في تصميم حملات السوشيال ميديا الإعلانية، بناء الهويات البصرية للعلامات التجارية، وتطوير واجهات وتجارب استخدام تفاعلية فائقة السلاسة.'
                : 'Senior Graphic Designer & UI/UX Designer based in Egypt. Specializing in high-converting social media advertising campaigns, commercial brand identities, and modern web & app design systems.'}
            </p>
            <div className="aab-actions">
              <Link href="/projects" className="btn ghost btn-sm">
                <span>{isAr ? 'تصفح الأعمال والمشاريع' : 'View Projects'}</span>
                <ArrowUpRight size={13} />
              </Link>
              <Link href="/start-project" className="btn primary btn-sm">
                <span>{isAr ? 'ابدأ مشروعاً جديداً' : 'Start a Project'}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      <section className="wrap art-related-section">
        <h3 className="art-related-title">{t('relatedArticlesTitle')}</h3>
        <div className="art-related-grid">
          {relatedArticles.map((rel) => {
            const relTitle = tx(rel.title);
            const relExcerpt = tx(rel.excerpt);
            const relCat = tx(rel.categoryLabel);
            const isRelGraphic = rel.category === 'graphic-design';

            return (
              <Link key={rel.slug} href={`/articles/${rel.slug}`} className="art-related-card">
                <div className="art-related-thumb">
                  <Image
                    src={rel.coverImage}
                    alt={relTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="art-related-img"
                  />
                  <span className={`art-cat-badge ${isRelGraphic ? 'cat-graphic' : 'cat-uiux'}`}>
                    {relCat}
                  </span>
                </div>
                <div className="art-related-body">
                  <h4 className="art-related-h4">{relTitle}</h4>
                  <p className="art-related-p">{relExcerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </article>
  );
}
