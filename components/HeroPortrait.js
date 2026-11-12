'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { EditableText, NetworkSvg, ToolIconBadge } from './SharedUI';
import KineticName from './KineticName';

const HERO_PHOTO = '/images/hero-photo.jpg';

export default function HeroPortrait() {
  const { site, lang, tx, t, tools, projects, waLink } = usePortfolio();
  const isAr = lang === 'ar';

  const socials = (site.socials || []).filter(
    (s) => s.value && s.value.trim() && ['instagram', 'behance', 'facebook', 'tiktok', 'linkedin'].includes(s.id)
  );
  const tags = (site.services || []).map((s) => tx(s.title)).filter(Boolean);
  const talkUrl = waLink() || '#contact';
  const isExternalTalk = /^https?:/.test(talkUrl);

  const goTo = (e, id) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hx" id="top" data-offscreen="false">
      <div className="hx-glow" aria-hidden="true">
        <span className="hx-orb hx-orb-violet" />
        <span className="hx-orb hx-orb-fuchsia" />
        <span className="hx-orb hx-orb-blue" />
      </div>
      <div className="hx-grid-bg" aria-hidden="true" />

      <div className="hx-wrap wrap">
        {/* Top: badge + kinetic headline + background outline ribbon */}
        <div className="hx-head">
          <span className="hx-badge hx-stagger" style={{ '--hx-i': 0 }}>
            <i aria-hidden="true" />
            <EditableText path="site.avail" value={site.avail} tag="span" singleLine />
          </span>

          <div className="hx-title-shell hx-stagger" style={{ '--hx-i': 1 }}>
            <KineticName
              text={tx(site.name)}
              lang={lang}
              services={tags}
            />
          </div>

          <p className="hx-role hx-stagger" style={{ '--hx-i': 2 }}>
            {(() => {
              const pos = String(tx(site.positioning) || '').trim();
              return pos && !/^TODO:/i.test(pos) ? pos : tx(site.role);
            })()}
          </p>
        </div>

        {/* Stage: left info · portrait · right info */}
        <div className="hx-stage">
          <aside className="hx-side hx-left hx-stagger" style={{ '--hx-i': 4 }}>
            {socials.length > 0 && (
              <div className="hx-block">
                <span className="hx-label">{isAr ? 'تابعني على' : 'Follow me on'}</span>
                <div className="hx-socials">
                  {socials.map((s) => {
                    const labelMap = {
                      instagram: 'Instagram',
                      behance: 'Behance',
                      facebook: 'Facebook',
                      tiktok: 'TikTok',
                      linkedin: 'LinkedIn'
                    };
                    return (
                      <a
                        key={s.id}
                        className="hx-soc"
                        href={socHref(s.id, s.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={labelMap[s.id] || s.id}
                      >
                        <NetworkSvg id={s.id} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="hx-block hx-stats">
              <div>
                <b>{String(projects.length).padStart(2, '0')}</b>
                <span>{isAr ? 'مشروع' : 'Projects'}</span>
              </div>
              <div>
                <b>{String(tools.length).padStart(2, '0')}</b>
                <span>{isAr ? 'أداة تصميم' : 'Design tools'}</span>
              </div>
            </div>
          </aside>

          <div className="hx-portrait-col hx-stagger" style={{ '--hx-i': 3 }}>
            <div className="hx-portrait">
              <div className="hx-ring" aria-hidden="true" />
              <div className="hx-arch">
                <Image
                  src={HERO_PHOTO}
                  alt={tx(site.name)}
                  width={576}
                  height={1024}
                  sizes="(max-width: 768px) 72vw, 380px"
                  quality={78}
                  priority
                />
              </div>
              {tools.slice(0, 4).map((tl, i) => (
                <ToolIconBadge key={tl.id} tool={tl} className={`hx-tool hx-t${i + 1}`} index={i} />
              ))}
              <Link href="/start-project" className="hx-seal" aria-label={isAr ? 'اشتغل معايا' : 'Hire me'}>
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <defs>
                    <path id="hxseal" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                  </defs>
                  <text>
                    <textPath href="#hxseal" textLength="270" lengthAdjust="spacing">
                      {isAr ? 'اشتغل معايا ✦ اشتغل معايا ✦ ' : 'Hire me ✦ Hire me ✦ Hire me ✦ '}
                    </textPath>
                  </text>
                </svg>
                <span className="hx-seal-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="hx-cta hx-stagger" style={{ '--hx-i': 5 }}>
              <a className="hx-btn hx-btn-primary" href="#work" onClick={(e) => goTo(e, 'work')}>
                {t('viewWork')}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a
                className="hx-btn hx-btn-ghost"
                href={talkUrl}
                target={isExternalTalk ? '_blank' : undefined}
                rel={isExternalTalk ? 'noopener noreferrer' : undefined}
                onClick={!isExternalTalk ? (e) => goTo(e, 'contact') : undefined}
              >
                {t('letsTalk')}
              </a>
            </div>
          </div>

          <aside className="hx-side hx-right hx-stagger" style={{ '--hx-i': 4 }}>
            <div className="hx-block hx-quote">
              <span className="hx-quote-mark" aria-hidden="true">
                “
              </span>
              <EditableText path="site.bio1" value={site.bio1} tag="p" />
            </div>
            {tags.length > 0 && (
              <div className="hx-block hx-tags" aria-label={isAr ? 'الخدمات' : 'Services'}>
                {tags.map((tag, i) => (
                  <span key={tag} className={`hx-tag ${i % 2 === 0 ? 'dark' : 'accent'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
