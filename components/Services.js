'use client';

import React from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

/* Decorative hover micro-previews (pure CSS motion, no media claims) */
const SVC_FX = {
  social: (
    <>
      <i className="deck d1" />
      <i className="deck d2" />
      <i className="deck d3" />
    </>
  ),
  branding: (
    <svg viewBox="0 0 80 80">
      <path pathLength="1" d="M40 8 L70 25 V55 L40 72 L10 55 V25 Z" />
      <path pathLength="1" d="M40 24 L56 33 V49 L40 58 L24 49 V33 Z" />
      <circle cx="40" cy="41" r="4" />
    </svg>
  ),
  uiux: (
    <>
      <i className="wf w1">
        <b />
        <b />
        <b />
      </i>
      <i className="wf w2" />
    </>
  ),
  web: (
    <>
      <i className="wf w1">
        <b />
        <b />
        <b />
      </i>
      <i className="wf w2" />
    </>
  ),
  video: (
    <>
      <i className="reel">
        <b />
        <b />
        <b />
        <b />
        <b />
      </i>
      <i className="playhead" />
    </>
  )
};

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

export default function Services() {
  const { site, projects, tx, t, lang, editing, updateSiteField, waLink } = usePortfolio();
  const rawList = site.services || [];
  const list = editing ? rawList : rawList.filter((s) => s.enabled !== false);
  if (!list.length && !editing) return null;

  const talkUrl = waLink() || '#contact';
  const isExternalTalk = /^https?:/.test(talkUrl);

  const folderMap = {
    social: 'social-media-campaigns',
    branding: 'branding-identity',
    uiux: 'website-ui-ux',
    web: 'website-ui-ux'
  };

  return (
    <section className="services wrap" id="services">
      <h2 className="big rv">
        {editing ? t('servicesTitle') : <AnimatedWords text={t('servicesTitle')} />}
      </h2>
      <div className="svcgrid">
        {list.map((s, i) => {
          const tagsArr = String(tx(s.tags) || '')
            .split(/\s*[·|•,،]\s*/)
            .filter(Boolean);
          const mappedType = { social: 'social', branding: 'branding', uiux: 'uiux', web: 'uiux' }[s.icon];
          const count = mappedType ? projects.filter((p) => p.type === mappedType).length : 0;

          return (
            <article
              key={i}
              className="svc rv"
              style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
            >
              <span className="svc-ic">{SERVICE_ICONS[s.icon] || SERVICE_ICONS.star}</span>
              {!editing && SVC_FX[s.icon] && (
                <span className={`svc-fx fx-${s.icon}`} aria-hidden="true">
                  {SVC_FX[s.icon]}
                </span>
              )}
              {editing && (
                <select
                  aria-label="Icon"
                  value={s.icon || 'star'}
                  onChange={(e) =>
                    updateSiteField((st) => {
                      st.services[i].icon = e.target.value;
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

              {editing ? (
                <EditableText
                  path={`site.services.${i}.tags`}
                  value={s.tags}
                  tag="p"
                  className="svc-g"
                  singleLine
                />
              ) : (
                <div className="svc-g">
                  {tagsArr.map((tg, idx) => (
                    <span key={idx}>{tg}</span>
                  ))}
                </div>
              )}

              {!editing && count > 0 && folderMap[s.icon] && (
                <Link
                  className="svc-l"
                  href={`/projects/${folderMap[s.icon]}`}
                >
                  {t('svcWork').replace('{n}', count)}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}

              {!editing && s.icon === 'video' && (
                <Link className="svc-l" href="/creative-lab">
                  {t('creativeLabNav')}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}

              {editing && (
                <button
                  type="button"
                  className="x"
                  aria-label="Remove"
                  onClick={() =>
                    updateSiteField((st) => {
                      st.services.splice(i, 1);
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
      </div>

      <div className="svc-cta rv">
        <a
          className="btn primary"
          href={talkUrl}
          target={isExternalTalk ? '_blank' : undefined}
          rel={isExternalTalk ? 'noopener noreferrer' : undefined}
        >
          {t('startProject')}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <Link className="btn ghost" href="/services">
          {t('exploreFullServices')}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
