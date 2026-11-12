'use client';

import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, ToolIconBadge } from './SharedUI';

export default function Hero() {
  const { site, lang, tx, t, tools, waLink } = usePortfolio();
  const heroRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (reduce || !canHover) return;

    let pmx = 0;
    let pmy = 0;
    let pending = false;

    const applyHero = () => {
      pending = false;
      const hero = heroRef.current;
      if (!hero || window.scrollY >= window.innerHeight) return;
      hero.style.setProperty('--mx', ((pmx / window.innerWidth - 0.5) * 2).toFixed(3));
      hero.style.setProperty('--my', ((pmy / window.innerHeight - 0.5) * 2).toFixed(3));

      const charEls = charsRef.current.filter(Boolean);
      for (const c of charEls) {
        const r = c.getBoundingClientRect();
        const dx = pmx - (r.left + r.width / 2);
        const dy = pmy - (r.top + r.height / 2);
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
        c.style.setProperty('--sc', (1 + f * 0.2).toFixed(3));
        c.style.setProperty('--rt', `${(-Math.sign(dx) * f * 7).toFixed(2)}deg`);
      }
    };

    const onMove = (e) => {
      pmx = e.clientX;
      pmy = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyHero);
      }
    };

    const onLeave = () => {
      const charEls = charsRef.current.filter(Boolean);
      for (const c of charEls) {
        c.style.setProperty('--sc', 1);
        c.style.setProperty('--rt', '0deg');
      }
    };

    document.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [lang]);

  const title = t('heroTitle');
  const wtStr =
    (lang === 'en' ? (0.3 + ([...title].length - 1) * 0.3 + 0.7).toFixed(2) : '3.4') + 's';
  const talkUrl = waLink() || '#contact';
  const isExternalTalk = /^https?:/.test(talkUrl);
  const scrollText = t('scroll');

  const handleScrollToSection = (e, sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="blob" aria-hidden="true" />
      <div className="blob b2" aria-hidden="true" />

      <svg
        className="squig"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          pathLength="1"
          d="M60 560 C 190 330, 360 690, 470 430 S 700 90, 640 300 S 480 600, 760 520 S 1010 210, 1140 380"
        />
        <path
          pathLength="1"
          d="M900 120 C 1010 60, 1100 150, 1040 230 S 880 260, 930 170"
          style={{ animationDelay: '1.2s' }}
        />
        <path
          className="squig-pulse"
          pathLength="1"
          d="M60 560 C 190 330, 360 690, 470 430 S 700 90, 640 300 S 480 600, 760 520 S 1010 210, 1140 380"
        />
      </svg>

      {tools.map((tl, i) => (
        <ToolIconBadge key={tl.id} tool={tl} className={`hero-tool h${i + 1}`} index={i} />
      ))}

      <svg className="ring" viewBox="0 0 160 160" aria-hidden="true">
        <defs>
          <path id="rp" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
        </defs>
        <text>
          <textPath href="#rp" textLength="384" lengthAdjust="spacing">
            Graphic design ✦ UI/UX design ✦ Graphic design ✦ UI/UX design ✦{' '}
          </textPath>
        </text>
        <text className="ctr" x="80" y="91">
          ✦
        </text>
      </svg>

      <span className="spark s1" aria-hidden="true">
        ✦
      </span>
      <span className="spark s2" aria-hidden="true">
        ✦
      </span>

      <p className="hero-name">{tx(site.name)}</p>

      <div className="avail">
        <i aria-hidden="true" />
        <EditableText path="site.avail" value={site.avail} tag="span" singleLine />
      </div>

      <div className="hero-main" style={{ '--wt': wtStr }}>
        <h1 style={{ '--wt': wtStr }}>
          <span className="line">
            {lang === 'en' ? (
              [...title].map((c, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    charsRef.current[i] = el;
                  }}
                  className="ch"
                  data-c={c}
                  style={{ '--i': i }}
                >
                  {c}
                </span>
              ))
            ) : (
              <span
                ref={(el) => {
                  charsRef.current[0] = el;
                }}
                className="ch"
                data-c={title}
                style={{ '--i': 0 }}
              >
                {title}
              </span>
            )}
            <i className="pen" aria-hidden="true" />
          </span>
          <small className="hero-subline">
            <strong className="hero-author">{tx(site.name)}</strong>
            <span className="hero-sep" aria-hidden="true">
              ·
            </span>
            <span className="hero-role-tag">{t('heroSub')}</span>
            <span className="hero-year-pill">2026</span>
          </small>
        </h1>

        <div className="hero-cta">
          <a
            className="btn primary"
            href="#work"
            onClick={(e) => handleScrollToSection(e, 'work')}
          >
            {t('viewWork')}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
          <a
            className="btn ghost"
            href={talkUrl}
            target={isExternalTalk ? '_blank' : undefined}
            rel={isExternalTalk ? 'noopener noreferrer' : undefined}
            onClick={!isExternalTalk ? (e) => handleScrollToSection(e, 'contact') : undefined}
          >
            {t('letsTalk')}
          </a>
        </div>
      </div>

      <p className="hero-year">2026</p>

      <a
        className="scrollcue"
        href="#about"
        aria-label={scrollText}
        onClick={(e) => handleScrollToSection(e, 'about')}
      >
        <span className="mouse" aria-hidden="true">
          <i />
        </span>
        <span className="sctx">
          {lang === 'en' ? (
            [...scrollText].map((c, i) => (
              <em key={i} style={{ '--i': i }}>
                {c === ' ' ? '\u00A0' : c}
              </em>
            ))
          ) : (
            <em style={{ '--i': 0 }}>{scrollText}</em>
          )}
        </span>
      </a>
    </section>
  );
}
