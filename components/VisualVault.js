'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/context/PortfolioContext';

/**
 * Visual Vault — a draggable, inertial strip of real artwork pulled from
 * the existing project data (no placeholder or stock imagery).
 * Includes single-pointer Prev/Next buttons and keyboard ArrowLeft/ArrowRight
 * navigation to satisfy WCAG 2.2 AA dragging-alternative requirements.
 */
export default function VisualVault() {
  const { projects, tx, lang, editing } = usePortfolio();
  const trackRef = useRef(null);

  const items = useMemo(() => {
    const out = [];
    projects.forEach((p) => {
      (p.images || [])
        .filter((im) => im.type === 'img' && im.src)
        .slice(0, 4)
        .forEach((im, k) => {
          out.push({
            key: `${p.id}-${k}`,
            src: im.src,
            alt: tx(im.alt) || tx(p.title),
            title: tx(p.title),
            cat: tx(p.cat),
            href: `/projects/${p.folderId}/${p.slug || p.id}`
          });
        });
    });
    return out.slice(0, 18);
  }, [projects, tx]);

  const isAr = lang === 'ar';

  const scrollByStep = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(280, Math.round(el.clientWidth * 0.65));
    const delta = (isAr ? -dir : dir) * step;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByStep(isAr ? -1 : 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByStep(isAr ? 1 : -1);
    }
  };

  // Pointer drag + inertia (horizontal scroll container)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let down = false;
    let moved = 0;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let raf = 0;

    const glide = () => {
      if (Math.abs(vel) < 0.15) return;
      el.scrollLeft -= vel;
      vel *= 0.94;
      raf = requestAnimationFrame(glide);
    };

    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return; // touch uses native momentum scroll
      down = true;
      moved = 0;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      lastT = performance.now();
      vel = 0;
      cancelAnimationFrame(raf);
      el.classList.add('dragging');
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vel = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove('dragging');
      if (!reduce) raf = requestAnimationFrame(glide);
    };
    // Prevent accidental navigation after a drag (>6px drag threshold)
    const onClick = (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, [items.length]);

  if (editing || items.length < 3) return null;

  return (
    <section className="vault" id="vault" aria-labelledby="vault-title">
      <div className="wrap vault-head">
        <div>
          <h2 id="vault-title" className="big rv">
            {isAr ? 'الأرشيف البصري' : 'Visual Vault'}
          </h2>
          <p className="vault-sub rv">
            {isAr
              ? 'لقطات مختارة من مشاريع الهوية البصرية، السوشيال ميديا، وتصميم الواجهات.'
              : 'Selected raw frames across brand identity, social campaigns, and product UI.'}
          </p>
        </div>
        <div className="vault-controls rv">
          <p className="vault-hint" aria-hidden="true">
            <span className="vault-hint-ic">⟷</span>
            {isAr ? 'اسحب للاستكشاف' : 'Drag to explore'}
          </p>
          <div className="vault-nav-group" role="group" aria-label={isAr ? 'التنقل في المعرض' : 'Gallery navigation'}>
            <button
              type="button"
              className="vault-nav-btn"
              onClick={() => scrollByStep(-1)}
              aria-label={isAr ? 'السابق' : 'Previous frames'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="vault-nav-btn"
              onClick={() => scrollByStep(1)}
              aria-label={isAr ? 'التالي' : 'Next frames'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="vault-track"
        ref={trackRef}
        data-cursor={isAr ? 'اسحب' : 'Drag'}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={isAr ? 'معرض قابل للسحب' : 'Draggable gallery'}
      >
        {items.map((it, i) => (
          <Link
            key={it.key}
            href={it.href}
            className={`vault-item v${i % 3}`}
            draggable={false}
          >
            <span className="vault-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt={it.alt}
                width={640}
                height={800}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </span>
            <span className="vault-cap">
              <b>{it.title}</b>
              <small>{it.cat}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
