'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, ToolIconBadge, SocialLinksList } from './SharedUI';

export default function About() {
  const { site, projects, tools, tx, t, editing, pickFile, updateSiteField } = usePortfolio();
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

    setStatProgress(0);
    let rafId = 0;
    let startTs = 0;
    let pausedElapsed = 0;
    const D = 1500;

    const tick = (now) => {
      if (document.hidden) {
        rafId = 0;
        return;
      }
      if (!startTs) startTs = now - pausedElapsed;
      const elapsed = now - startTs;
      pausedElapsed = elapsed;
      const p = Math.min(1, elapsed / D);
      const ease = 1 - Math.pow(1 - p, 3);
      setStatProgress(ease);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onVis = () => {
      if (!document.hidden && statsObserved && pausedElapsed < D && !rafId) {
        startTs = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    const sio = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        sio.disconnect();
        setStatsObserved(true);
        startTs = 0;
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    sio.observe(statsRef.current);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      sio.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(rafId);
    };
  }, [editing, statsObserved]);

  const photo = site.photo;
  const cv = site.cv;
  const clientsList = site.clients || [];
  const skillTags = String(tx(site.skills) || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <section className="about about-preview wrap" id="about">
        <div className="about-grid">
          <div className="about-l rv">
            <h2 className="big">{editing ? t('aboutMe') : <AnimatedWords text={t('aboutMe')} />}</h2>
            <div
              className={`photo ${photo ? 'has' : ''}`}
              data-act="photo"
              onClick={() => {
                if (editing) pickFile({ type: 'photo' }, false, 'image/*');
              }}
            >
              {photo ? (
                photo.startsWith('/') ? (
                  <Image
                    src={photo}
                    alt={tx(site.name)}
                    width={900}
                    height={1200}
                    sizes="(max-width: 680px) 300px, 340px"
                    quality={90}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 20%'
                    }}
                  />
                ) : (
                  <img
                    src={photo}
                    alt={tx(site.name)}
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                  />
                )
              ) : (
                <span>{t('photo')}</span>
              )}
            </div>
          </div>

          <div className="about-r rv" style={{ '--d': '.15s' }}>
            <p className="hello">{t('hello')}</p>
            <EditableText path="site.name" value={site.name} tag="h3" className="who" singleLine />
            <EditableText path="site.role" value={site.role} tag="p" className="role" singleLine />
            <EditableText path="site.bio1" value={site.bio1} tag="p" className="txt" />

            {/* Concise Key Information Highlights */}
            <div className="about-preview-highlights">
              <span className="aph-chip">
                <MapPin size={14} aria-hidden="true" />
                <EditableText path="site.location" value={site.location} tag="span" singleLine />
              </span>
              <span className="aph-chip">
                <i className="aph-dot" aria-hidden="true" />
                <EditableText path="site.avail" value={site.avail} tag="span" singleLine />
              </span>
              {skillTags.slice(0, 3).map((sk, idx) => (
                <span key={idx} className="aph-chip">
                  ✦ {sk}
                </span>
              ))}
            </div>

            <div className="about-preview-tools">
              <div className="mini">
                {tools.map((tl, i) => (
                  <span key={tl.id} translate="no">
                    <ToolIconBadge tool={tl} index={i} />
                    {tl.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary CTA to /about + CV controls */}
            <div className="cvrow about-preview-actions">
              <Link href="/about" className="btn primary about-full-btn">
                <span>{t('viewFullAbout')}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>

              {editing ? (
                cv ? (
                  <>
                    <a
                      className="btn ghost"
                      href={typeof cv === 'string' ? cv : cv.data}
                      download={cv?.name || 'Mohamed-Tarek-CV.pdf'}
                    >
                      {t('downloadCv')}
                    </a>
                    <button
                      type="button"
                      className="pill"
                      aria-label="Change CV"
                      title="Change"
                      onClick={() => pickFile({ type: 'cv' }, false, 'application/pdf')}
                    >
                      ⟳
                    </button>
                    <button
                      type="button"
                      className="pill"
                      aria-label="Remove CV"
                      title="Remove"
                      onClick={() =>
                        updateSiteField((s) => {
                          s.cv = null;
                          return s;
                        })
                      }
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="pill"
                    onClick={() => pickFile({ type: 'cv' }, false, 'application/pdf')}
                  >
                    {t('uploadCv')}
                  </button>
                )
              ) : (
                <a
                  className="btn ghost cv-download-btn"
                  href={(typeof cv === 'string' ? cv : cv?.data) || '/cv.pdf'}
                  download={cv?.name || 'Mohamed-Tarek-CV.pdf'}
                >
                  <span>{t('downloadCv')}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </a>
              )}
            </div>

            <div className="about-preview-socials">
              <SocialLinksList />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements / Stats Band */}
      {(site.stats || []).length > 0 && (
        <section className="stats wrap" ref={statsRef} aria-label={t('experience')}>
          {(site.stats || []).map((st, i) => {
            const val = getStatVal(st.kind);
            if (st.kind === 'clients' && !val && !editing) return null;
            const displayedVal = Math.max(0, Math.round(val * statProgress));
            const formattedVal = String(displayedVal).padStart(2, '0');
            return (
              <div
                key={`${st.kind}-${i}`}
                className="stat rv"
                style={{
                  '--d': `${(i * 0.1).toFixed(2)}s`,
                  '--stat-p': statProgress.toFixed(3)
                }}
              >
                <span className="stat-ord" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <b className="sn" data-v={val} aria-label={String(val)}>
                  {formattedVal}
                </b>
                <EditableText
                  path={`site.stats.${i}.label`}
                  value={st.label}
                  tag="span"
                  className="sl"
                  singleLine
                />
                <span className="stat-bar" aria-hidden="true">
                  <i />
                </span>
              </div>
            );
          })}
        </section>
      )}

      {/* Clients Strip */}
      {(clientsList.length > 0 || editing) && (
        <section className="clients wrap" id="clients">
          <p className="cl-title rv">{t('clientsTitle')}</p>
          <div className="cl-row">
            {clientsList.map((c, i) => (
              <figure
                key={i}
                className="cl-item rv"
                style={{ '--d': `${(i * 0.06).toFixed(2)}s` }}
              >
                <img
                  src={c.logo}
                  alt={tx(c.name)}
                  width={120}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
                {editing && (
                  <>
                    <EditableText
                      path={`site.clients.${i}.name`}
                      value={c.name}
                      tag="figcaption"
                      className="cl-n"
                      singleLine
                    />
                    <button
                      type="button"
                      className="x"
                      aria-label="Remove"
                      onClick={() =>
                        updateSiteField((s) => {
                          s.clients.splice(i, 1);
                          return s;
                        })
                      }
                    >
                      &times;
                    </button>
                  </>
                )}
              </figure>
            ))}
            {editing && (
              <button
                type="button"
                className="cl-add"
                onClick={() => pickFile({ type: 'client' }, true, 'image/*')}
              >
                {t('addLogos')}
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
