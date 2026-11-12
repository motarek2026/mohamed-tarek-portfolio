'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
  Layers,
  MessageSquare,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, NetworkSvg } from './SharedUI';
import Faq from './Faq';
import BriefForm from './BriefForm';

export default function PricingPageView() {
  const {
    site,
    lang,
    tx,
    t,
    editing,
    updateSiteField,
    waBase,
    waLink,
    setSelectedPkgIndex,
    setPreselectedService
  } = usePortfolio();

  const packages = site.packages || [];
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  const baseWa = waBase();
  const whoName = tx(site.name).split(' ')[0];

  const getPackageWhatsAppHref = (pkgName) => {
    if (!baseWa) return waLink();
    const msg =
      lang === 'ar'
        ? `أهلاً ${whoName}، شفت صفحة الباقات وعايز أطلب عرض سعر لـ "${pkgName}".`
        : `Hello ${whoName}, I visited your Pricing page and I'd like to request a quote for "${pkgName}".`;
    return `${baseWa}?text=${encodeURIComponent(msg)}`;
  };

  const handleSelectPackageQuote = (idx) => {
    setSelectedPkgIndex(idx);
    const briefEl = document.getElementById('brief');
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const ta = document.querySelector('.bform textarea');
        if (ta) ta.focus({ preventScroll: true });
      }, 600);
    }
  };

  const handleSelectCustomServiceQuote = (svcName) => {
    setSelectedPkgIndex(-1);
    if (svcName) setPreselectedService(svcName);
    const briefEl = document.getElementById('brief');
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const ta = document.querySelector('.bform textarea');
        if (ta) ta.focus({ preventScroll: true });
      }, 600);
    }
  };

  // Build scope comparison rows from verified packages + Video & Motion service
  const videoService = (site.services || []).find((s) => s.icon === 'video');
  const scopeRows = [
    ...packages.map((pk, idx) => {
      const nameStr = tx(pk.name);
      const isBrand = /brand|هوية/i.test(nameStr);
      const isUiux = /ui\/?ux|واجهات|موقع/i.test(nameStr);
      const feats = String(tx(pk.features) || '')
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean);
      return {
        id: `pkg-${idx}`,
        pkgIndex: idx,
        title: nameStr,
        deliverables: feats.join(' · '),
        formats: isUiux
          ? t('formatsUiux')
          : isBrand
          ? t('formatsBrand')
          : t('formatsSocial'),
        revisions: t('revisionsNote'),
        pricing: tx(pk.price)
      };
    }),
    ...(videoService
      ? [
          {
            id: 'svc-video',
            pkgIndex: null,
            serviceName: tx(videoService.title),
            title: tx(videoService.title),
            deliverables: `${tx(videoService.desc)} (${tx(videoService.tags)})`,
            formats: t('formatsVideo'),
            revisions: t('revisionsNote'),
            pricing: lang === 'ar' ? 'حسب المشروع' : 'Custom quote'
          }
        ]
      : [])
  ];

  return (
    <div className="pricing-page-container" id="pricing-top">
      {/* 1. Pricing Page Hero */}
      <section className="sp-hero">
        <div className="blob cl-hero-blob" aria-hidden="true" />
        <div className="wrap">
          <div className="about-hero-topbar">
            <Link href="/" className="folder-back-btn">
              <BackIcon size={18} />
              <span>{t('backToPortfolio')}</span>
            </Link>

            <span className="about-page-kicker">
              <Sparkles size={15} />
              <span>{t('pricingPageBadge')}</span>
            </span>
          </div>

          <div className="sp-hero-main">
            <div>
              <span className="plabel">{tx(site.avail)}</span>
              <h1 className="cl-hero-title" style={{ marginTop: '8px' }}>
                <AnimatedWords text={t('pricingPageTitle')} />
              </h1>
              <p className="cl-hero-lead">{t('pricingPageLead')}</p>

              <div className="cl-hero-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => handleSelectCustomServiceQuote('')}
                >
                  <MessageSquare size={17} />
                  <span>{t('requestQuoteBtn')}</span>
                </button>

                <Link href="/services" className="btn ghost">
                  <span>{t('servicesNav')}</span>
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editable, Data-Driven Pricing Packages Grid */}
      <section className="wrap pp-packages-section" aria-label={t('pkgTitle')}>
        <div className="pkgrid pp-pkgrid">
          {packages.map((pk, i) => {
            const hasBadge = !!tx(pk.badge);
            const pkgName = tx(pk.name);
            const featuresList = String(tx(pk.features) || '')
              .split('\n')
              .map((x) => x.trim())
              .filter(Boolean);
            const pkgWaHref = getPackageWhatsAppHref(pkgName);

            const startingRaw = String(tx(pk.startingPrice) || '').trim();
            const hasStarting = Boolean(startingRaw && !/^TODO:/i.test(startingRaw));
            const displayPrice = hasStarting
              ? lang === 'ar'
                ? `تبدأ من ${startingRaw}`
                : `Starting from ${startingRaw}`
              : tx(pk.price) || (lang === 'ar' ? 'حسب المشروع' : 'Custom quote');

            const deliveryRaw = String(tx(pk.deliveryTime) || '').trim();
            const deliveryText = deliveryRaw && !/^TODO:/i.test(deliveryRaw) ? deliveryRaw : '';
            const revisionsRaw = String(tx(pk.revisions) || '').trim();
            const revisionsText = revisionsRaw && !/^TODO:/i.test(revisionsRaw) ? revisionsRaw : '';

            return (
              <article
                key={i}
                className={`pk pp-card ${hasBadge ? 'hot' : ''}`.trim()}
              >
                {(hasBadge || editing) && (
                  <span className="pk-b">
                    <EditableText
                      path={`site.packages.${i}.badge`}
                      value={pk.badge}
                      tag="span"
                      singleLine
                    />
                  </span>
                )}

                <div className="pp-card-top">
                  <span className="pp-pkg-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <EditableText
                    path={`site.packages.${i}.name`}
                    value={pk.name}
                    tag="h2"
                    className="pk-t"
                    singleLine
                  />
                </div>

                <EditableText
                  path={`site.packages.${i}.desc`}
                  value={pk.desc}
                  tag="p"
                  className="pk-d"
                />

                <div className="pk-p pp-quote-box">
                  <span className="pp-quote-kicker">{t('colPricingModel')}</span>
                  {editing ? (
                    <EditableText
                      path={`site.packages.${i}.price`}
                      value={pk.price}
                      tag="b"
                      singleLine
                    />
                  ) : (
                    <b>{displayPrice}</b>
                  )}
                </div>

                {(deliveryText || revisionsText) && (
                  <div className="pk-meta">
                    {deliveryText && (
                      <span>
                        <small>{t('deliveryTimeLabel')}:</small> {deliveryText}
                      </span>
                    )}
                    {revisionsText && (
                      <span>
                        <small>{t('revisionsLabel')}:</small> {revisionsText}
                      </span>
                    )}
                  </div>
                )}

                <div className="pp-features-wrap">
                  <span className="sp-block-label">{t('colIncludedScope')}</span>
                  {editing ? (
                    <EditableText
                      path={`site.packages.${i}.features`}
                      value={pk.features}
                      tag="p"
                      className="pk-f"
                    />
                  ) : (
                    <ul className="pk-f">
                      {featuresList.map((feat, idx) => (
                        <li key={idx}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dual Inquiry CTAs: Brief Form + Direct WhatsApp */}
                <div className="pp-card-actions">
                  <button
                    type="button"
                    className={`btn ${hasBadge ? 'primary' : 'ghost'} pp-quote-btn`}
                    onClick={() => handleSelectPackageQuote(i)}
                  >
                    <span>{t('requestQuoteBtn')}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>

                  {pkgWaHref && (
                    <a
                      href={pkgWaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pp-wa-link"
                    >
                      <NetworkSvg id="whatsapp" />
                      <span>{t('askOnWhatsApp')}</span>
                    </a>
                  )}
                </div>

                {editing && (
                  <button
                    type="button"
                    className="x"
                    aria-label="Remove"
                    onClick={() =>
                      updateSiteField((st) => {
                        st.packages.splice(i, 1);
                        return st;
                      })
                    }
                  >
                    &times;
                  </button>
                )}
              </article>
            );
          })}

          {editing && (
            <div className="addrow">
              <button
                type="button"
                className="addbtn"
                onClick={() =>
                  updateSiteField((st) => {
                    st.packages.push({
                      name: { en: 'New package', ar: 'باقة جديدة' },
                      badge: { en: '', ar: '' },
                      desc: { en: 'Describe this package.', ar: 'اكتب وصف الباقة.' },
                      price: { en: 'Custom quote', ar: 'حسب المشروع' },
                      features: {
                        en: 'Feature one\nFeature two\nFeature three',
                        ar: 'ميزة أولى\nميزة تانية\nميزة تالتة'
                      }
                    });
                    return st;
                  })
                }
              >
                {t('addPkg')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Mobile-Readable Service Scope & Deliverables Comparison */}
      <section className="wrap pp-comparison-section" aria-label={t('scopeOverviewTitle')}>
        <div className="cs-section-head">
          <div>
            <h2 className="cs-sec-title">
              <Layers size={20} aria-hidden="true" />
              <span>{t('scopeOverviewTitle')}</span>
            </h2>
            <p className="cl-sec-sub">{t('scopeOverviewSub')}</p>
          </div>
        </div>

        <div className="pp-scope-grid">
          {scopeRows.map((row) => (
            <div key={row.id} className="pp-scope-row">
              <div className="pp-scope-col title-col">
                <strong>{row.title}</strong>
                <span className="pp-scope-price-pill">{row.pricing}</span>
              </div>

              <div className="pp-scope-col">
                <span className="pp-col-kicker">
                  <CheckCircle2 size={13} />
                  {t('colIncludedScope')}
                </span>
                <p>{row.deliverables}</p>
              </div>

              <div className="pp-scope-col">
                <span className="pp-col-kicker">
                  <FileCheck2 size={13} />
                  {t('colFileFormats')}
                </span>
                <p>{row.formats}</p>
              </div>

              <div className="pp-scope-col">
                <span className="pp-col-kicker">
                  <RefreshCw size={13} />
                  {t('colRevisions')}
                </span>
                <p>{row.revisions}</p>
              </div>

              <div className="pp-scope-col action-col">
                <button
                  type="button"
                  className="pill folder-page-btn"
                  onClick={() =>
                    row.pkgIndex !== null
                      ? handleSelectPackageQuote(row.pkgIndex)
                      : handleSelectCustomServiceQuote(row.serviceName)
                  }
                >
                  <span>{t('requestQuoteBtn')}</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Custom Scope Banner */}
      <section className="wrap cs-project-cta-wrap">
        <div className="cs-project-cta-card">
          <div className="cs-cta-copy">
            <span className="plabel">{t('pricingPageBadge')}</span>
            <h2 className="cs-cta-title">{t('customScopeCtaTitle')}</h2>
            <p className="cs-cta-desc">{t('customScopeCtaDesc')}</p>
          </div>

          <div className="cs-cta-actions">
            {waLink() && (
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="wacta"
              >
                <NetworkSvg id="whatsapp" />
                <span>{t('askOnWhatsApp')}</span>
              </a>
            )}
            <button
              type="button"
              className="btn ghost"
              onClick={() => handleSelectCustomServiceQuote('')}
            >
              <span>{t('requestViaBrief')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <Faq />

      {/* 6. Interactive Project Brief Form */}
      <BriefForm />
    </div>
  );
}
