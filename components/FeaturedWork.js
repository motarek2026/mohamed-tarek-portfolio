'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { BLUR_DATA_URL } from '@/lib/imageHelpers';
import s from './ProjectsPageView.module.css';

const pad = (n) => String(n).padStart(2, '0');

function altOf(p) {
  const imgs = (p.images || []).filter((x) => x.type === 'img' && x.src);
  const cover = p.thumbnail || (imgs[0] && imgs[0].src);
  const alt = imgs.find((x) => x.src !== cover);
  return alt ? alt.src : '';
}

function coverOf(p) {
  if (p.thumbnail) return p.thumbnail;
  const img = (p.images || []).find((x) => x.type === 'img' && x.src);
  return img ? img.src : '';
}

// Homepage showcase: 3 featured projects + a link to the full /projects page.
export default function FeaturedWork() {
  const { projects, tx, t } = usePortfolio();

  const picks = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, 3);
  }, [projects]);

  if (!picks.length) return null;

  return (
    <section id="work" className={s.featured} aria-labelledby="fw-title">
      <div className={`wrap ${s.featHead}`}>
        <div>
          <h2 id="fw-title" className={s.featTitle}>
            {t('selected')} <sup>{pad(projects.length)}</sup>
          </h2>
          <p className={s.sub}>{t('featuredWorkSub')}</p>
        </div>
        <Link href="/projects" className={s.viewAll}>
          {t('viewAllProjects')}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <div className="wrap">
        <ul className={`${s.grid} ${s.grid3}`}>
          {picks.map((p, pos) => {
            const src = coverOf(p);
            const href = `/projects/${p.folderId}/${p.slug || p.id}`;
            return (
              <li key={p.id || pos} className={`${s.item} rv`}>
                <Link
                  href={href}
                  className={s.card}
                  style={{ '--c': p.color || '#7C3AED' }}
                  aria-label={`${t('openProject')}: ${tx(p.title)}`}
                >
                  <span className={s.media}>
                    {src ? (
                      <Image
                        src={src}
                        alt={tx(p.title)}
                        fill
                        sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 360px"
                        quality={76}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        className={s.img}
                      />
                    ) : null}
                    {altOf(p) ? (
                        <Image
                          src={altOf(p)}
                          alt=""
                          fill
                          sizes="(max-width:700px) 92vw, 360px"
                          quality={72}
                          loading="lazy"
                          className={s.alt}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className={s.shade} aria-hidden="true" />
                    <span className={s.num} aria-hidden="true">
                      {pad(pos + 1)}
                    </span>
                    {p.year ? <span className={s.year}>{p.year}</span> : null}
                    <span className={s.go} aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                  <span className={s.info}>
                    <span className={s.catRow}>
                      <span className={s.cat}>{tx(p.cat)}</span>
                      {(p.projectType === 'concept' || p.projectType === 'personal') && (
                        <span className={s.typeBadge}>
                          {p.projectType === 'personal'
                            ? t('projectTypePersonal')
                            : t('projectTypeConcept')}
                        </span>
                      )}
                    </span>
                    <h3 className={s.name}>{tx(p.title)}</h3>
                    <span className={s.goal}>{tx(p.goal)}</span>
                  </span>
                  <span className={s.bar} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={s.moreRow}>
          <Link href="/projects" className={`${s.viewAll} ${s.viewAllSolid}`}>
            {t('viewAllProjects')}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
