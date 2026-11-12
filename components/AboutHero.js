'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, ToolIconBadge, SocialLinksList } from './SharedUI';

export default function AboutHero() {
  const { site, tools, tx, t, editing, pickFile, updateSiteField, waLink } = usePortfolio();

  const photo = site.photo;
  const cv = site.cv;
  const featuredTools = tools.slice(0, 3);
  const talkUrl = waLink() || '/#contact';
  const isExternalTalk = /^https?:/.test(talkUrl);

  return (
    <section className="about-page-hero wrap" id="about-top">
      <div className="blob" aria-hidden="true" />
      <div className="blob b2" aria-hidden="true" />

      {/* Top Breadcrumb + Badge */}
      <div className="about-hero-topbar rv in">
        <nav className="folder-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="bc-link">
            {t('home')}
          </Link>
          <span className="bc-sep">/</span>
          <strong className="bc-current">{t('about')}</strong>
        </nav>

        <span className="about-page-kicker">
          <Sparkles size={14} aria-hidden="true" />
          <span>{t('aboutPageBadge')}</span>
        </span>
      </div>

      <div className="about-hero-grid">
        {/* Editorial Left Column: Identity, Title, Short Intro, CTAs */}
        <div className="about-hero-copy rv in">
          <div className="about-avail-pill">
            <i aria-hidden="true" />
            <EditableText path="site.avail" value={site.avail} tag="span" singleLine />
          </div>

          <p className="hello about-hello">{t('hello')}</p>

          <EditableText
            path="site.name"
            value={site.name}
            tag="h1"
            className="about-hero-name"
            singleLine
            animatedWords
          />

          <EditableText
            path="site.role"
            value={site.role}
            tag="p"
            className="about-hero-role"
            singleLine
          />

          <EditableText
            path="site.bio1"
            value={site.bio1}
            tag="p"
            className="about-hero-lead"
          />

          <div className="about-hero-actions">
            <Link href="/#work" className="btn primary">
              <span>{t('exploreMyWork')}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>

            <a
              href={talkUrl}
              target={isExternalTalk ? '_blank' : undefined}
              rel={isExternalTalk ? 'noopener noreferrer' : undefined}
              className="btn ghost"
            >
              <span>{t('contactMe')}</span>
            </a>

            {editing ? (
              cv ? (
                <>
                  <a
                    className="btn ghost"
                    href={typeof cv === 'string' ? cv : cv.data}
                    download={cv?.name || 'Mohamed-Tarek-CV.pdf'}
                  >
                    {t('downloadCv')}
                  </a>
                  <button
                    type="button"
                    className="pill"
                    title="Change"
                    onClick={() => pickFile({ type: 'cv' }, false, 'application/pdf')}
                  >
                    ⟳
                  </button>
                  <button
                    type="button"
                    className="pill"
                    title="Remove"
                    onClick={() =>
                      updateSiteField((s) => {
                        s.cv = null;
                        return s;
                      })
                    }
                  >
                    ×
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="pill"
                  onClick={() => pickFile({ type: 'cv' }, false, 'application/pdf')}
                >
                  {t('uploadCv')}
                </button>
              )
            ) : cv ? (
              <a
                className="btn ghost"
                href={typeof cv === 'string' ? cv : cv.data}
                download={cv?.name || 'Mohamed-Tarek-CV.pdf'}
              >
                {t('downloadCv')}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
            ) : null}
          </div>

          <div className="about-hero-socials">
            <SocialLinksList />
          </div>
        </div>

        {/* Editorial Right Column: Portrait Frame with Floating Accents */}
        <div className="about-hero-visual rv in" style={{ '--d': '.12s' }}>
          <div className="about-portrait-stage">
            <div
              className={`photo about-page-photo ${photo ? 'has' : ''}`}
              data-act="photo"
              onClick={() => {
                if (editing) pickFile({ type: 'photo' }, false, 'image/*');
              }}
            >
              {photo ? (
                photo.startsWith('/') ? (
                  <Image
                    src={photo}
                    alt={tx(site.name)}
                    width={900}
                    height={1200}
                    sizes="(max-width: 680px) 300px, 400px"
                    quality={90}
                    priority
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 20%'
                    }}
                  />
                ) : (
                  <img src={photo} alt={tx(site.name)} />
                )
              ) : (
                <span>{t('photo')}</span>
              )}
            </div>

            {/* Floating Editorial Location & Year Tag */}
            <div className="about-portrait-badge loc-badge">
              <MapPin size={15} aria-hidden="true" />
              <EditableText path="site.location" value={site.location} tag="span" singleLine />
              <span className="badge-dot" aria-hidden="true">
                ·
              </span>
              <strong>2026</strong>
            </div>

            {/* Floating Core Tools Cluster */}
            <div className="about-portrait-tools" aria-hidden="true">
              {featuredTools.map((tl, i) => (
                <ToolIconBadge key={tl.id} tool={tl} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
