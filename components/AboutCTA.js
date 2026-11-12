'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Folder } from 'lucide-react';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, NetworkSvg, SocialLinksList } from './SharedUI';

export default function AboutCTA() {
  const { site, categories, tx, t, editing, waLink } = usePortfolio();

  const socials = site.socials || [];
  const hasWa = socials.some((x) => x.id === 'whatsapp');
  const waHref = waLink();

  const phoneEntry = socials.find((x) => x.id === 'phone' && x.value?.trim());
  const phoneHref = phoneEntry ? socHref('phone', phoneEntry.value) : '';

  const emailEntry = socials.find((x) => x.id === 'email' && x.value?.trim());
  const emailHref = emailEntry ? socHref('email', emailEntry.value) : '';

  return (
    <section className="thanks about-cta-section" id="contact">
      <div className="blob" aria-hidden="true" />
      <div className="blob b2" aria-hidden="true" />

      <div className="inner rv">
        <span className="plabel">{t('contact')}</span>
        <h2 className="big">
          {editing ? t('lastNext') : <AnimatedWords text={t('lastNext')} />}
        </h2>

        <EditableText path="site.thanks" value={site.thanks} tag="p" />

        {/* Primary & Secondary Destinations */}
        <div className="contact-actions about-cta-buttons">
          <Link href="/#work" className="btn primary">
            <span>{t('exploreMyWork')}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>

          <Link href="/#brief" className="btn ghost contact-direct-btn">
            <span>{t('startProject')}</span>
          </Link>

          {hasWa && waHref && (
            <a
              className="wacta"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('waCta')}
            >
              <NetworkSvg id="whatsapp" />
              <span>{t('waCta')}</span>
            </a>
          )}

          {phoneHref && (
            <a className="btn ghost contact-direct-btn" href={phoneHref} aria-label={t('callMe')}>
              <NetworkSvg id="phone" />
              <span dir="ltr">{phoneEntry.value}</span>
            </a>
          )}

          {emailHref && (
            <a className="btn ghost contact-direct-btn" href={emailHref} aria-label="Email">
              <NetworkSvg id="email" />
              <span dir="ltr">{emailEntry.value}</span>
            </a>
          )}
        </div>

        {/* Direct Links to Project Folders */}
        <div className="about-cta-folders">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/projects/${cat.slug}`} className="fchip">
              <Folder size={14} style={{ marginInlineEnd: '6px', verticalAlign: '-2px' }} />
              {tx(cat.shortTitle || cat.title)}
            </Link>
          ))}
        </div>

        <p className="follow">{t('follow')}</p>
        <SocialLinksList skip={['whatsapp']} />
      </div>
    </section>
  );
}
