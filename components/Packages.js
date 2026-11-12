'use client';

import React from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

export default function Packages() {
  const { site, tx, t, lang, editing, updateSiteField, setSelectedPkgIndex } = usePortfolio();
  const list = site.packages || [];
  if (!list.length && !editing) return null;

  const handleChoosePackage = (idx) => {
    setSelectedPkgIndex(idx);
    const briefEl = document.getElementById('brief');
    if (briefEl) {
      briefEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const ta = document.querySelector('.bform textarea');
        if (ta) ta.focus({ preventScroll: true });
      }, 650);
    }
  };

  return (
    <section className="packages wrap" id="packages">
      <h2 className="big rv">
        {editing ? t('pkgTitle') : <AnimatedWords text={t('pkgTitle')} />}
      </h2>
      <div className="pkgrid">
        {list.map((pk, i) => {
          const hot = !!tx(pk.badge);
          const featuresList = String(tx(pk.features) || '')
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean);

          return (
            <article
              key={i}
              className={`pk rv ${hot ? 'hot' : ''}`.trim()}
              style={{ '--d': `${(i * 0.1).toFixed(2)}s` }}
            >
              {(hot || editing) && (
                <span className="pk-b">
                  <EditableText
                    path={`site.packages.${i}.badge`}
                    value={pk.badge}
                    tag="span"
                    singleLine
                  />
                </span>
              )}

              <EditableText
                path={`site.packages.${i}.name`}
                value={pk.name}
                tag="h3"
                className="pk-t"
                singleLine
              />
              <EditableText
                path={`site.packages.${i}.desc`}
                value={pk.desc}
                tag="p"
                className="pk-d"
              />

              <div className="pk-p">
                <EditableText
                  path={`site.packages.${i}.price`}
                  value={pk.price}
                  tag="b"
                  singleLine
                />
              </div>

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

              <button
                type="button"
                className={`btn ${hot ? 'primary' : 'ghost'}`}
                onClick={() => handleChoosePackage(i)}
              >
                {t('choosePkg')}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>

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

      <div className="svc-cta rv">
        <Link className="btn ghost" href="/pricing">
          {t('viewFullPricing')}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
