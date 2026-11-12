'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AnimatedWords } from './SharedUI';
import BriefForm from './BriefForm';
import Faq from './Faq';

export default function StartProjectView() {
  const { site, lang, tx, t } = usePortfolio();
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="start-project-container" id="start-project-top">
      {/* 1. Start a Project Hero */}
      <section className="sp-hero start-project-hero">
        <div className="blob cl-hero-blob" aria-hidden="true" />
        <div className="wrap">
          <div className="about-hero-topbar">
            <Link href="/" className="folder-back-btn">
              <BackIcon size={18} />
              <span>{t('backToPortfolio')}</span>
            </Link>

            <span className="about-page-kicker">
              <Sparkles size={15} />
              <span>{t('startProjectBadge')}</span>
            </span>
          </div>

          <div className="sp-hero-main">
            <div>
              <span className="plabel">{tx(site.avail)}</span>
              <h1 className="cl-hero-title" style={{ marginTop: '8px' }}>
                <AnimatedWords text={t('startProjectPageTitle')} />
              </h1>
              <p className="cl-hero-lead">{t('startProjectPageLead')}</p>

              <div className="cl-hero-actions">
                <Link href="/services" className="btn ghost">
                  <span>{t('servicesNav')}</span>
                  <ArrowUpRight size={17} />
                </Link>
                <Link href="/pricing" className="btn ghost">
                  <span>{t('pricingNav')}</span>
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Validated Project Inquiry Form */}
      <BriefForm isStandalonePage={true} />

      {/* 3. Pre-Project FAQ */}
      <Faq />
    </div>
  );
}
