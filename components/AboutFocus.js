'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AnimatedWords } from './SharedUI';

const pad = (n) => String(n).padStart(2, '0');

// Data-driven: renders only from site.services (enabled) and site.process.
export default function AboutFocus() {
  const { site, tx, t, editing } = usePortfolio();

  const services = (site.services || []).filter((s) => s.enabled !== false);
  const steps = (site.process || []).filter((p) => tx(p.title));

  if (!services.length && !steps.length) return null;

  return (
    <section className="about-focus wrap" id="about-focus">
      {services.length > 0 && (
        <div className="af-block">
          <h2 className="big about-sec-title rv">
            {editing ? t('aboutWhatIDo') : <AnimatedWords text={t('aboutWhatIDo')} />}
          </h2>
          <ul className="af-services">
            {services.map((s, i) => (
              <li
                key={i}
                className="af-service rv"
                style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
              >
                <span className="af-service-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3>{tx(s.title)}</h3>
                <p>{tx(s.desc)}</p>
                {tx(s.tags) && <small>{tx(s.tags)}</small>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {steps.length > 0 && (
        <div className="af-block">
          <h2 className="big about-sec-title rv">
            {editing ? t('aboutHowIWork') : <AnimatedWords text={t('aboutHowIWork')} />}
          </h2>
          <ol className="af-steps">
            {steps.map((p, i) => (
              <li
                key={i}
                className="af-step rv"
                style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
              >
                <span className="af-step-dot" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div>
                  <h3>{tx(p.title)}</h3>
                  <p>{tx(p.desc)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
