'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function IntroOverlay() {
  const { site, lang, tx, introDone, setIntroDone } = usePortfolio();
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem('mt_intro_seen', '1');
    } catch {}
    setExiting((prev) => {
      if (prev) return prev;
      document.body.classList.remove('introing');
      document.body.classList.add('go');
      setTimeout(() => {
        document.body.classList.add('settled');
      }, 1200);
      setTimeout(() => {
        document.body.classList.add('written');
      }, 1800);
      setTimeout(() => {
        setRemoved(true);
        setIntroDone(true);
      }, 500);
      return true;
    });
  }, [setIntroDone]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem('mt_intro_seen'));
    } catch {}

    if (reduce || introDone || seen) {
      setRemoved(true);
      setIntroDone(true);
      document.body.classList.add('go', 'settled', 'written');
      document.body.classList.remove('introing');
      return;
    }

    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', onKey);
    const timer = setTimeout(finishIntro, 650);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, [finishIntro, introDone, setIntroDone]);

  if (removed) return null;

  const nameStr = tx(site.name);

  return (
    <div
      id="intro"
      className={exiting ? 'out' : ''}
      style={{ pointerEvents: exiting ? 'none' : 'auto' }}
      aria-hidden="true"
      onClick={finishIntro}
    >
      <div className="ib" />
      {site.logo && (
        <img
          className={`in-logo ${site.logoInv ? 'inv' : ''}`}
          src={site.logo}
          alt=""
        />
      )}
      <div className="in-name">
        {lang === 'en' ? (
          [...nameStr].map((c, i) => (
            <span key={i} style={{ '--i': i }}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))
        ) : (
          <span style={{ '--i': 0 }}>{nameStr}</span>
        )}
      </div>
      <div className="in-sub">Portfolio 2026</div>
    </div>
  );
}
