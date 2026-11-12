'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Search, X } from 'lucide-react';
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

function countImages(p) {
  return (p.images || []).filter((x) => x.type === 'img' && x.src).length;
}

export default function ProjectsPageView() {
  const { projects, categories, tx, t, lang } = usePortfolio();
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');

  const catList = useMemo(
    () =>
      (categories || [])
        .map((c) => ({ ...c, count: projects.filter((p) => p.folderId === c.id).length }))
        .filter((c) => c.count > 0),
    [categories, projects]
  );

  const totalArtworks = useMemo(
    () => projects.reduce((sum, p) => sum + countImages(p), 0),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => {
        if (cat !== 'all' && p.folderId !== cat) return false;
        if (!q) return true;
        const hay = [p.title?.en, p.title?.ar, p.cat?.en, p.cat?.ar, p.goal?.en, p.goal?.ar]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
  }, [projects, cat, query]);

  return (
    <section className={s.page} id="folder-main" aria-labelledby="pp-title">
      <div className={`wrap ${s.hero}`}>
        <span className={s.glow} aria-hidden="true" />
        <span className={s.ghost} aria-hidden="true">
          {pad(projects.length)}
        </span>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">{t('home')}</Link>
          <span aria-hidden="true">/</span>
          <strong aria-current="page">{t('projectsNav')}</strong>
        </nav>
        <h1 id="pp-title" className={s.title}>
          {t('projectsPageTitle')}
        </h1>
        <p className={s.sub}>{t('projectsPageSub')}</p>

        <dl className={s.stats}>
          <div>
            <dt>{t('projectsNav')}</dt>
            <dd>{pad(projects.length)}</dd>
          </div>
          <div>
            <dt>{t('projectsPageArtworks')}</dt>
            <dd>{pad(totalArtworks)}</dd>
          </div>
          <div>
            <dt>{t('projectsPageDisciplines')}</dt>
            <dd>{pad(catList.length)}</dd>
          </div>
        </dl>
      </div>

      <div className={`wrap ${s.controls}`}>
        <div className={s.chips} role="group" aria-label={t('projectsPageFilter')}>
          <button
            type="button"
            className={`${s.chip} ${cat === 'all' ? s.on : ''}`}
            aria-pressed={cat === 'all'}
            onClick={() => setCat('all')}
          >
            {t('all')} <sup>{projects.length}</sup>
          </button>
          {catList.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${s.chip} ${cat === c.id ? s.on : ''}`}
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
              style={{ '--c': c.color }}
            >
              {tx(c.shortTitle || c.title)} <sup>{c.count}</sup>
            </button>
          ))}
        </div>

        <label className={s.search}>
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('projectsPageSearch')}
            aria-label={t('projectsPageSearch')}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label={t('projectsPageClear')}>
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      <div className={`wrap ${s.gridWrap}`}>
        {filtered.length === 0 ? (
          <p className={s.empty}>{t('filterEmpty')}</p>
        ) : (
          <ul className={s.grid}>
            {filtered.map(({ p, i }, pos) => {
              const src = coverOf(p);
              const count = countImages(p);
              const href = `/projects/${p.folderId}/${p.slug || p.id}`;
              const big = pos === 0 && filtered.length > 2 && cat === 'all' && !query;
              return (
                <li key={p.id || i} className={`${s.item} ${big ? s.big : ''} rv`}>
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
                          sizes={big ? '(max-width:900px) 92vw, 760px' : '(max-width:700px) 92vw, (max-width:1100px) 46vw, 380px'}
                          quality={76}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          className={s.img}
                        />
                      ) : (
                        <span className={s.ph} aria-hidden="true">
                          {pad(pos + 1)}
                        </span>
                      )}
                      {altOf(p) ? (
                        <Image
                          src={altOf(p)}
                          alt=""
                          fill
                          sizes="(max-width:700px) 92vw, 380px"
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
                      <h2 className={s.name}>{tx(p.title)}</h2>
                      <span className={s.goal}>{tx(p.goal)}</span>
                      {count > 0 && (
                        <span className={s.meta}>{t('artworksCount').replace('{n}', count)}</span>
                      )}
                    </span>
                    <span className={s.bar} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
