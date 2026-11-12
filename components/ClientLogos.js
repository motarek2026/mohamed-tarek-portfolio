'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function ClientLogos() {
  const { site, tx, t } = usePortfolio();
  const list = Array.isArray(site.clients)
    ? site.clients.filter((c) => c && (c.logo || tx(c.name)))
    : [];

  if (!list.length) return null;

  return (
    <section className="wrap" aria-label={t('clientsStripLabel')}>
      <div className="clients-strip rv">
        <span className="clients-strip-label">{t('clientsStripLabel')}</span>
        <ul className="clients-strip-list">
          {list.map((c, idx) => {
            const label = tx(c.name) || '';
            const content = c.logo ? (
              <img
                src={c.logo}
                alt={label}
                className="clients-strip-img"
                width={120}
                height={32}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="clients-strip-name">{label}</span>
            );

            return (
              <li key={idx} className="clients-strip-item">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={label || undefined}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
