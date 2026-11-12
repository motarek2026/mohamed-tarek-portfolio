'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Globe2, Languages, Sparkles, UserCheck, PhoneCall } from 'lucide-react';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, SocialLinksList } from './SharedUI';

export default function AboutIntro() {
  const { site, projects, tools, tx, t, editing } = usePortfolio();
  const statsRef = useRef(null);
  const [statProgress, setStatProgress] = useState(1);
  const [statsObserved, setStatsObserved] = useState(false);

  const getStatVal = (kind) => {
    switch (kind) {
      case 'projects':
        return projects.length;
      case 'social':
        return projects.filter((p) => p.type === 'social').length;
      case 'uiux':
        return projects.filter((p) => p.type === 'uiux').length;
      case 'tools':
        return tools.length;
      case 'clients':
        return (site.clients || []).length;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !statsRef.current || statsObserved) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || editing || !('IntersectionObserver' in window)) {
      setStatProgress(1);
      return;
    }

    let rafId = 0;
    const sio = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        sio.disconnect();
        setStatsObserved(true);
        const t0 = performance.now();
        const D = 1300;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / D);
          const ease = 1 - Math.pow(1 - p, 3);
          setStatProgress(ease);
          if (p < 1) {
            rafId = requestAnimationFrame(tick);
          }
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    sio.observe(statsRef.current);
    return () => {
      sio.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [editing, statsObserved]);

  const phoneEntry = (site.socials || []).find((s) => s.id === 'phone' && s.value?.trim());
  const phoneHref = phoneEntry ? socHref('phone', phoneEntry.value) : '';

  // Strip template hint "(add your years and clients)" in view mode while keeping full value in Edit Mode
  const rawExp = String(tx(site.experience) || '');
  const cleanExpLines = rawExp
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^\(.*\)$/.test(l));

  return (
    <section className="about-intro-section wrap" id="personal-intro">
      {/* Personal Narrative Block */}
      <div className="about-story-card rv">
        <div className="about-story-header">
          <span className="plabel">{t('aboutMe')}</span>
          <h2 className="big about-sec-title">
            {editing ? t('personalIntroTitle') : <AnimatedWords text={t('personalIntroTitle')} />}
          </h2>
        </div>

        <div className="about-story-body">
          <EditableText
            path="site.bio1"
            value={site.bio1}
            tag="p"
            className="about-story-lead"
          />
          <EditableText
            path="site.bio2"
            value={site.bio2}
            tag="p"
            className="about-story-text"
          />
        </div>
      </div>

      {/* Personal Details & Quick Facts Cards */}
      <div className="about-quick-facts-wrap">
        <h3 className="about-sub-heading rv">{t('quickFactsTitle')}</h3>

        <div className="about-facts-grid">
          <article className="fact about-fact-card rv">
            <div className="af-icon" aria-hidden="true">
              <Sparkles size={20} />
            </div>
            <h4>{t('roleLabel')}</h4>
            <EditableText path="site.role" value={site.role} tag="p" singleLine />
          </article>

          <article className="fact about-fact-card rv" style={{ '--d': '.06s' }}>
            <div className="af-icon" aria-hidden="true">
              <Briefcase size={20} />
            </div>
            <h4>{t('experience')}</h4>
            {editing ? (
              <EditableText path="site.experience" value={site.experience} tag="p" />
            ) : (
              <p>{cleanExpLines.join(' · ')}</p>
            )}
          </article>

          <article className="fact about-fact-card rv" style={{ '--d': '.12s' }}>
            <div className="af-icon" aria-hidden="true">
              <Globe2 size={20} />
            </div>
            <h4>{t('locationLabel')}</h4>
            <p>
              <EditableText path="site.location" value={site.location} tag="span" singleLine />
              <small className="af-sub">{site.tz || 'Africa/Cairo'}</small>
            </p>
          </article>

          <article className="fact about-fact-card rv" style={{ '--d': '.18s' }}>
            <div className="af-icon" aria-hidden="true">
              <Languages size={20} />
            </div>
            <h4>{t('languagesLabel')}</h4>
            <p>{t('languagesValue')}</p>
          </article>

          <article className="fact about-fact-card rv" style={{ '--d': '.24s' }}>
            <div className="af-icon" aria-hidden="true">
              <UserCheck size={20} />
            </div>
            <h4>{t('availabilityLabel')}</h4>
            <EditableText path="site.avail" value={site.avail} tag="p" singleLine />
          </article>

          <article className="fact about-fact-card rv" style={{ '--d': '.3s' }}>
            <div className="af-icon" aria-hidden="true">
              <PhoneCall size={20} />
            </div>
            <h4>{t('contacts')}</h4>
            {phoneHref && (
              <a href={phoneHref} className="af-phone-link" dir="ltr">
                {phoneEntry.value}
              </a>
            )}
            <SocialLinksList />
          </article>
        </div>
      </div>

      {/* Factual Portfolio Statistics Band */}
      {(site.stats || []).length > 0 && (
        <div className="stats about-page-stats" ref={statsRef}>
          {(site.stats || []).map((st, i) => {
            const val = getStatVal(st.kind);
            if (st.kind === 'clients' && !val) return null;
            const displayedVal = Math.max(0, Math.round(val * statProgress));
            return (
              <div
                key={`${st.kind}-${i}`}
                className="stat rv"
                style={{ '--d': `${(i * 0.08).toFixed(2)}s` }}
              >
                <b className="sn" data-v={val}>
                  {displayedVal}
                </b>
                <EditableText
                  path={`site.stats.${i}.label`}
                  value={st.label}
                  tag="span"
                  className="sl"
                  singleLine
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
