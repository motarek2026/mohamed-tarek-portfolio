'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, FolderKanban, Layers } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { getActiveCategories } from '@/lib/categoryHelpers';
import { EditableText, AnimatedWords } from './SharedUI';

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
  )
};

export default function ExperienceTimeline() {
  const { site, projects, categories, lang, tx, t, editing } = usePortfolio();

  const rawServicesList = site.services || [];
  const servicesList = editing
    ? rawServicesList
    : rawServicesList.filter((s) => s.enabled !== false);
  const activeCategories = getActiveCategories(categories, projects);
  const processSteps = site.process || [];

  const folderMap = {
    social: 'social-media-campaigns',
    branding: 'branding-identity',
    uiux: 'website-ui-ux'
  };

  return (
    <>
      {/* 1. AREAS OF EXPERTISE (from site.services) */}
      {servicesList.length > 0 && (
        <section className="about-skills-section wrap" id="about-expertise">
          <div className="toolkit-head rv">
            <div>
              <span className="plabel">{t('services')}</span>
              <h2 className="big about-sec-title">
                {editing ? t('skillsExpertiseTitle') : <AnimatedWords text={t('skillsExpertiseTitle')} />}
              </h2>
            </div>
          </div>

          <div className="svcgrid about-expertise-grid">
            {servicesList.map((s, i) => {
              const tagsArr = String(tx(s.tags) || '')
                .split(/\s*[·|•,،]\s*/)
                .filter(Boolean);
              const mappedType = { social: 'social', branding: 'branding', uiux: 'uiux' }[s.icon];
              const count = mappedType ? projects.filter((p) => p.type === mappedType).length : 0;

              return (
                <article
                  key={i}
                  className="svc rv"
                  style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
                >
                  <span className="svc-ic">{SERVICE_ICONS[s.icon] || SERVICE_ICONS.social}</span>
                  <EditableText
                    path={`site.services.${i}.title`}
                    value={s.title}
                    tag="h3"
                    className="svc-t"
                    singleLine
                  />
                  <EditableText
                    path={`site.services.${i}.desc`}
                    value={s.desc}
                    tag="p"
                    className="svc-d"
                  />

                  <div className="svc-g">
                    {tagsArr.map((tg, idx) => (
                      <span key={idx}>{tg}</span>
                    ))}
                  </div>

                  {folderMap[s.icon] && (
                    <Link className="svc-l" href={`/projects/${folderMap[s.icon]}`}>
                      <span>
                        {count > 0 ? t('svcWork').replace('{n}', count) : t('openFolder')}
                      </span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. CREATIVE PHILOSOPHY, WORKING APPROACH & FOCUS AREAS */}
      <section className="about-timeline-section wrap" id="about-journey">
        <div className="toolkit-head rv">
          <div>
            <span className="plabel">{t('processTitle')}</span>
            <h2 className="big about-sec-title">
              {editing
                ? t('designApproachTitle')
                : <AnimatedWords text={t('designApproachTitle')} />}
            </h2>
          </div>
        </div>

        {/* 4-Step Editorial Working Approach (from site.process) */}
        {processSteps.length > 0 && (
          <div className="about-timeline-grid">
            {processSteps.map((step, i) => (
              <article
                key={i}
                className="about-timeline-step rv"
                style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
              >
                <div className="tl-step-top">
                  <span className="tl-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tl-step-line" aria-hidden="true" />
                </div>
                <EditableText
                  path={`site.process.${i}.title`}
                  value={step.title}
                  tag="h3"
                  className="tl-step-title"
                  singleLine
                />
                <EditableText
                  path={`site.process.${i}.desc`}
                  value={step.desc}
                  tag="p"
                  className="tl-step-desc"
                />
              </article>
            ))}
          </div>
        )}

        {/* Active 2026 Portfolio Focus Areas connected to real folders */}
        <div className="about-focus-wrap">
          <h3 className="about-sub-heading rv">
            <FolderKanban size={20} aria-hidden="true" />
            <span>{t('focusAreasTitle')}</span>
          </h3>

          <div className="about-focus-grid">
            {activeCategories.map((cat, idx) => {
              const catProjects = projects.filter((p) => p.folderId === cat.id);
              const delivs =
                (cat.deliverables && (cat.deliverables[lang] || cat.deliverables.en)) || [];
              return (
                <Link
                  key={cat.id}
                  href={`/projects/${cat.slug}`}
                  className="about-focus-card rv"
                  style={{
                    '--fc': cat.color || '#7C3AED',
                    '--d': `${(idx * 0.08).toFixed(2)}s`
                  }}
                >
                  <div className="afc-top">
                    <span className="afc-badge">
                      <Layers size={14} aria-hidden="true" />
                      {tx(cat.badge)}
                    </span>
                    <span className="afc-count">
                      {catProjects.length === 1
                        ? t('projectSingle')
                        : t('projectsCount').replace('{n}', catProjects.length)}
                    </span>
                  </div>

                  <div className="afc-title-row">
                    <h4>{tx(cat.title)}</h4>
                    <span className="folder-route-link" aria-hidden="true">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <p className="afc-desc">{tx(cat.subtitle)}</p>

                  {delivs.length > 0 && (
                    <div className="folder-tags">
                      {delivs.slice(0, 3).map((d, k) => (
                        <span key={k} className="folder-tag-chip">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
