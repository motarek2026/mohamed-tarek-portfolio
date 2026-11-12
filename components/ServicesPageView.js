'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FolderOpen,
  Layers,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { PROJECT_COLORS } from '@/data/projects';
import { EditableText, AnimatedWords, NetworkSvg } from './SharedUI';
import Process from './Process';
import BriefForm from './BriefForm';

const SERVICE_ICONS = {
  social: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <path d="M17.25 13.5v7.5M13.5 17.25H21" />
    </svg>
  ),
  branding: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </svg>
  ),
  uiux: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 9v11" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z" />
    </svg>
  )
};

export default function ServicesPageView() {
  const {
    site,
    projects,
    categories,
    lang,
    tx,
    t,
    editing,
    updateSiteField,
    waBase,
    waLink,
    setPreselectedService
  } = usePortfolio();

  const services = site.services || [];
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  const baseWa = waBase();
  const whoName = tx(site.name).split(' ')[0];

  const getServiceWhatsAppHref = (svcTitle) => {
    if (!baseWa) return waLink();
    const msg =
      lang === 'ar'
        ? `أهلاً ${whoName}، شفت صفحة الخدمات وعايز أتكلم معاك بخصوص خدمة "${svcTitle}".`
        : `Hello ${whoName}, I visited your Services page and I'd like to discuss "${svcTitle}".`;
    return `${baseWa}?text=${encodeURIComponent(msg)}`;
  };

  const handleScrollToBrief = (svcTitle) => {
    setPreselectedService(svcTitle);
    const briefEl = document.getElementById('brief');
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const ta = document.querySelector('.bform textarea');
        if (ta) ta.focus({ preventScroll: true });
      }, 600);
    }
  };

  const getServiceMetadata = (svc, idx) => {
    const iconKey = svc.icon || 'star';
    const accentColor = PROJECT_COLORS[idx % PROJECT_COLORS.length];

    if (iconKey === 'social') {
      const cat = categories.find((c) => c.id === 'social-media-campaigns');
      const relProjects = projects.filter((p) => p.type === 'social');
      const extraDeliv = (cat?.deliverables?.[lang] || cat?.deliverables?.en || []);
      return {
        color: '#7C3AED',
        folderHref: '/projects/social-media-campaigns',
        folderLabel: tx(cat?.title) || t('openFolder'),
        relatedProjects: relProjects,
        extraDeliverables: extraDeliv
      };
    }

    if (iconKey === 'branding') {
      const cat = categories.find((c) => c.id === 'branding-identity');
      const relProjects = projects.filter((p) => p.type === 'branding');
      const extraDeliv = (cat?.deliverables?.[lang] || cat?.deliverables?.en || []);
      return {
        color: '#4F46E5',
        folderHref: '/projects/branding-identity',
        folderLabel: tx(cat?.title) || t('openFolder'),
        relatedProjects: relProjects,
        extraDeliverables: extraDeliv
      };
    }

    if (iconKey === 'uiux' || iconKey === 'web') {
      const cat = categories.find((c) => c.id === 'website-ui-ux');
      const relProjects = projects.filter((p) => p.type === 'uiux');
      const extraDeliv = (cat?.deliverables?.[lang] || cat?.deliverables?.en || []);
      return {
        color: '#C026D3',
        folderHref: '/projects/website-ui-ux',
        folderLabel: tx(cat?.title) || t('openFolder'),
        relatedProjects: relProjects,
        extraDeliverables: extraDeliv
      };
    }

    if (iconKey === 'video') {
      return {
        color: '#0359D7',
        folderHref: '/creative-lab',
        folderLabel: t('creativeLabNav'),
        relatedProjects: [],
        extraDeliverables: []
      };
    }

    return {
      color: accentColor,
      folderHref: '/#work',
      folderLabel: t('exploreMyWork'),
      relatedProjects: [],
      extraDeliverables: []
    };
  };

  return (
    <div className="services-page-container" id="services-top">
      {/* 1. Services Hero */}
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
              <span>{t('servicesPageBadge')}</span>
            </span>
          </div>

          <div className="sp-hero-main">
            <div>
              <span className="plabel">{tx(site.role)}</span>
              <h1 className="cl-hero-title" style={{ marginTop: '8px' }}>
                <AnimatedWords text={t('servicesTitle')} />
              </h1>
              <p className="cl-hero-lead">{t('servicesPageLead')}</p>

              <div className="cl-hero-actions">
                <a
                  href={waLink() || '#brief'}
                  target={waLink() ? '_blank' : undefined}
                  rel={waLink() ? 'noopener noreferrer' : undefined}
                  className="btn primary"
                >
                  <NetworkSvg id="whatsapp" />
                  <span>{t('startProject')}</span>
                </a>

                <Link href="/pricing" className="btn ghost">
                  <span>{t('viewPricingBtn')}</span>
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Service Showcases (Distinct Visual Hierarchy) */}
      <section className="wrap sp-chapters-section" aria-label={t('services')}>
        <div className="sp-chapters-list">
          {services.map((svc, idx) => {
            const svcTitle = tx(svc.title);
            const rawTags = String(tx(svc.tags) || '')
              .split(/\s*[·|•,،]\s*/)
              .filter(Boolean);
            const meta = getServiceMetadata(svc, idx);
            const combinedDeliverables = Array.from(
              new Set([...rawTags, ...(meta.extraDeliverables || [])])
            );
            const svcWaHref = getServiceWhatsAppHref(svcTitle);

            return (
              <article
                key={idx}
                className="sp-chapter-card"
                style={{ '--fc': meta.color }}
              >
                {/* Left Column: Service Overview, Deliverables & CTAs */}
                <div className="sp-chapter-left">
                  <div className="sp-chapter-kicker">
                    <span className="sp-chapter-num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="svc-ic sp-svc-ic">
                      {SERVICE_ICONS[svc.icon] || SERVICE_ICONS.star}
                    </span>
                    {editing && (
                      <select
                        aria-label="Icon"
                        value={svc.icon || 'star'}
                        onChange={(e) =>
                          updateSiteField((st) => {
                            st.services[idx].icon = e.target.value;
                            return st;
                          })
                        }
                      >
                        {Object.keys(SERVICE_ICONS).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <EditableText
                    path={`site.services.${idx}.title`}
                    value={svc.title}
                    tag="h2"
                    className="sp-chapter-title"
                    singleLine
                  />

                  <EditableText
                    path={`site.services.${idx}.desc`}
                    value={svc.desc}
                    tag="p"
                    className="sp-chapter-desc"
                  />

                  {/* Deliverables */}
                  <div className="sp-deliverables-block">
                    <span className="sp-block-label">{t('deliverablesLabel')}</span>
                    {editing ? (
                      <EditableText
                        path={`site.services.${idx}.tags`}
                        value={svc.tags}
                        tag="p"
                        className="svc-g"
                        singleLine
                      />
                    ) : (
                      <ul className="sp-deliv-list">
                        {combinedDeliverables.map((item, dIdx) => (
                          <li key={dIdx}>
                            <CheckCircle2 size={15} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Service Inquiry & Destination CTAs */}
                  <div className="sp-chapter-actions">
                    {svcWaHref && (
                      <a
                        href={svcWaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn primary"
                      >
                        <NetworkSvg id="whatsapp" />
                        <span>{t('requestThisService')}</span>
                      </a>
                    )}

                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => handleScrollToBrief(svcTitle)}
                    >
                      <span>{t('requestViaBrief')}</span>
                    </button>

                    {meta.folderHref && (
                      <Link href={meta.folderHref} className="pill folder-page-btn">
                        <FolderOpen size={14} />
                        <span>{meta.folderLabel}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>

                  {editing && (
                    <button
                      type="button"
                      className="pill"
                      style={{ marginTop: '12px' }}
                      onClick={() =>
                        updateSiteField((st) => {
                          st.services.splice(idx, 1);
                          return st;
                        })
                      }
                    >
                      {t('del')}
                    </button>
                  )}
                </div>

                {/* Right Column: Relevant Verified Portfolio Projects / Destinations */}
                <div className="sp-chapter-right">
                  <span className="sp-block-label">{t('relevantProjectsLabel')}</span>

                  {meta.relatedProjects.length > 0 ? (
                    <div className="sp-examples-grid">
                      {meta.relatedProjects.map((proj) => {
                        const caseHref = `/projects/${proj.folderId}/${proj.slug || proj.id}`;
                        const validCount = (proj.images || []).filter(
                          (x) => x.type === 'img' && x.src
                        ).length;
                        return (
                          <Link
                            key={proj.id}
                            href={caseHref}
                            className="sp-example-card"
                          >
                            {proj.thumbnail ? (
                              <div className="sp-example-thumb">
                                <Image
                                  src={proj.thumbnail}
                                  alt={tx(proj.title)}
                                  fill
                                  sizes="(max-width: 768px) 80vw, 260px"
                                  quality={85}
                                />
                              </div>
                            ) : (
                              <div className="sp-example-wire">
                                <Layers size={18} />
                                <span>{tx(proj.cat)}</span>
                              </div>
                            )}
                            <div className="sp-example-info">
                              <div className="sp-example-head">
                                <strong>{tx(proj.title)}</strong>
                                <ArrowUpRight size={15} />
                              </div>
                              <p>{tx(proj.goal)}</p>
                              {validCount > 0 && (
                                <span className="sp-example-count">
                                  {t('artworksCount').replace('{n}', validCount)}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <Link href={meta.folderHref} className="sp-destination-card">
                      <div className="sp-dest-top">
                        <span className="sp-dest-badge">
                          <FolderOpen size={15} />
                          <span>{meta.folderLabel}</span>
                        </span>
                        <span className="folder-route-link">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <h3>{svcTitle}</h3>
                      <p>{tx(svc.desc)}</p>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {editing && (
          <div className="addrow" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="addbtn"
              onClick={() =>
                updateSiteField((st) => {
                  st.services.push({
                    icon: 'star',
                    title: { en: 'New service', ar: 'خدمة جديدة' },
                    desc: { en: 'Describe what you offer.', ar: 'اكتب وصف الخدمة.' },
                    tags: { en: 'Tag · Tag', ar: 'وسم · وسم' }
                  });
                  return st;
                })
              }
            >
              {t('addService')}
            </button>
          </div>
        )}
      </section>

      {/* 3. How I Work (Process) */}
      <Process />

      {/* 4. Interactive Brief Form */}
      <BriefForm />
    </div>
  );
}
