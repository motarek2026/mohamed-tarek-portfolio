'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AnimatedWords, ToolIconBadge } from './SharedUI';

export default function Skills() {
  const { site, tools, tx, t, editing } = usePortfolio();

  const skillItems = String(tx(site.skills) || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="toolkit wrap" id="tools">
      <div className="toolkit-head rv">
        <h2 className="big">
          {editing ? t('toolkit') : <AnimatedWords text={t('toolkit')} />}
        </h2>
        {skillItems.length > 0 && (
          <div className="toolkit-skills" aria-label={t('skills')}>
            {skillItems.map((skill, idx) => (
              <span key={idx} className="skill-pill">
                <i aria-hidden="true">✦</i>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="toolgrid">
        {tools.map((tl, i) => (
          <div
            key={tl.id}
            className="toolcard rv"
            data-tool={tl.id}
            style={{
              '--d': `${(i * 0.08).toFixed(2)}s`,
              '--tc': tl.tc
            }}
          >
            <span className="toolcard-glow" aria-hidden="true" />
            <ToolIconBadge tool={tl} index={i} className="tool-lg" />
            <span className="tn" translate="no">{tl.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
