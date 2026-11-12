'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PointerFX
 * - Provides 60fps rAF-throttled 3D perspective tilt (--rx, --ry), cursor-following spotlight
 *   (--spot-x, --spot-y, --spot-o), and inner artwork depth parallax (--par-x, --par-y) for .folder-card
 *   with cached bounding rects (zero per-frame getBoundingClientRect layout thrashing).
 * - Coordinates View Transitions API completion on Next.js App Router pathname changes.
 * - Drives scroll-triggered clip-path mask reveals (.clip-in) for artwork slots on project pages.
 */
export default function PointerFX() {
  const pathname = usePathname();

  // Resolve pending View Transition promise when Next.js route commits
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.__mtResolveVT === 'function') {
      const resolve = window.__mtResolveVT;
      window.__mtResolveVT = null;
      requestAnimationFrame(() => {
        resolve();
      });
    }
    const root = document.documentElement;
    if (root.classList.contains('vt-fade-fallback')) {
      const timer = setTimeout(() => {
        root.classList.remove('vt-fade-fallback');
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // 3D Tilt, Cursor Spotlight & Depth Parallax on Project Cards (cached rect, single rAF)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reduceQuery.matches || !hoverQuery.matches) return;

    let activeCard = null;
    let cachedRect = null;
    let rectDirty = true;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const resetCard = (card) => {
      if (!card) return;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--par-x', '0px');
      card.style.setProperty('--par-y', '0px');
      card.style.setProperty('--spot-o', '0');
      card.removeAttribute('data-tilting');
    };

    const updateCardFrame = () => {
      rafId = 0;
      if (!activeCard || document.hidden || reduceQuery.matches) return;

      if (rectDirty || !cachedRect) {
        cachedRect = activeCard.getBoundingClientRect();
        rectDirty = false;
      }
      if (!cachedRect || cachedRect.width <= 0 || cachedRect.height <= 0) return;

      const px = Math.max(0, Math.min(1, (lastX - cachedRect.left) / cachedRect.width));
      const py = Math.max(0, Math.min(1, (lastY - cachedRect.top) / cachedRect.height));

      const rx = ((0.5 - py) * 8.5).toFixed(2);
      const ry = ((px - 0.5) * 9.5).toFixed(2);
      const parX = ((px - 0.5) * 18).toFixed(2);
      const parY = ((py - 0.5) * 14).toFixed(2);

      activeCard.style.setProperty('--spot-x', `${(px * 100).toFixed(1)}%`);
      activeCard.style.setProperty('--spot-y', `${(py * 100).toFixed(1)}%`);
      activeCard.style.setProperty('--spot-o', '1');
      activeCard.style.setProperty('--rx', `${rx}deg`);
      activeCard.style.setProperty('--ry', `${ry}deg`);
      activeCard.style.setProperty('--par-x', `${parX}px`);
      activeCard.style.setProperty('--par-y', `${parY}px`);
      activeCard.setAttribute('data-tilting', 'true');
    };

    const onPointerMove = (e) => {
      if (document.hidden || reduceQuery.matches) return;
      const card = e.target && e.target.closest ? e.target.closest('.folder-card') : null;

      if (card !== activeCard) {
        if (activeCard) resetCard(activeCard);
        activeCard = card;
        rectDirty = true;
      }

      if (!activeCard) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateCardFrame);
      }
    };

    const onPointerOver = (e) => {
      if (!activeCard) return;
      const card = e.target && e.target.closest ? e.target.closest('.folder-card') : null;
      if (card !== activeCard) {
        resetCard(activeCard);
        activeCard = card;
        rectDirty = true;
      }
    };

    const markRectDirty = () => {
      rectDirty = true;
    };

    const onBlurOrHide = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (activeCard) {
        resetCard(activeCard);
        activeCard = null;
        cachedRect = null;
      }
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('scroll', markRectDirty, { passive: true });
    window.addEventListener('resize', markRectDirty, { passive: true });
    window.addEventListener('blur', onBlurOrHide, { passive: true });
    document.addEventListener('visibilitychange', onBlurOrHide);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (activeCard) resetCard(activeCard);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('scroll', markRectDirty);
      window.removeEventListener('resize', markRectDirty);
      window.removeEventListener('blur', onBlurOrHide);
      document.removeEventListener('visibilitychange', onBlurOrHide);
    };
  }, []);

  // Scroll-triggered Clip-Path Mask Reveal on Project / Case Study pages + Hero visibility pause
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      root.classList.remove('clip-ready');
      return;
    }

    root.classList.add('clip-ready');

    const selector =
      '.cs-hero-stage, .case-study-view .slot:not(.empty):not(.txt), .folder-view-container .slot:not(.empty):not(.txt)';
    let parallaxSlots = [];

    const clipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('clip-in');
            clipObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    const bindTargets = () => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el, idx) => {
        if (!el.classList.contains('clip-target')) {
          el.classList.add('clip-target');
          el.style.setProperty('--clip-delay', `${((idx % 3) * 0.07).toFixed(2)}s`);
        }
        if (!el.classList.contains('clip-in')) {
          clipObserver.observe(el);
        }
      });
      parallaxSlots = Array.from(
        document.querySelectorAll(
          '.case-study-view .slot:not(.empty):not(.txt) .ti, .folder-view-container .slot:not(.empty):not(.txt) .ti'
        )
      );
    };

    bindTargets();
    const timer = setTimeout(bindTargets, 120);

    let moRaf = 0;
    const mo = new MutationObserver(() => {
      if (!moRaf) {
        moRaf = requestAnimationFrame(() => {
          moRaf = 0;
          bindTargets();
        });
      }
    });

    const folderMain = document.getElementById('folder-main') || document.getElementById('work') || document.body;
    mo.observe(folderMain, { childList: true, subtree: true });

    // Pause continuous hero animations (.hx) when off-screen or tab is hidden
    const heroEl = document.querySelector('.hx');
    let heroObserver = null;
    if (heroEl) {
      heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            heroEl.dataset.offscreen = entry.isIntersecting ? 'false' : 'true';
          });
        },
        { threshold: 0.02 }
      );
      heroObserver.observe(heroEl);
    }

    // Subtle vertical scroll parallax (--img-py) on project gallery artwork images
    let scrollRaf = 0;
    const updateParallax = () => {
      scrollRaf = 0;
      if (document.hidden || reduceMotion || parallaxSlots.length === 0) return;
      const vh = window.innerHeight || 800;
      for (let i = 0; i < parallaxSlots.length; i += 1) {
        const ti = parallaxSlots[i];
        const r = ti.getBoundingClientRect();
        if (r.bottom < -60 || r.top > vh + 60) continue;
        const centerOffset = (r.top + r.height * 0.5 - vh * 0.5) / (vh * 0.6);
        const clamped = Math.max(-1, Math.min(1, centerOffset));
        const py = (clamped * -10).toFixed(2);
        ti.style.setProperty('--img-py', `${py}px`);
      }
    };

    const onScrollParallax = () => {
      if (!scrollRaf && !document.hidden && !reduceMotion && parallaxSlots.length > 0) {
        scrollRaf = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', onScrollParallax, { passive: true });
    updateParallax();

    const onVis = () => {
      root.dataset.tabHidden = document.hidden ? 'true' : 'false';
      if (document.hidden && scrollRaf) {
        cancelAnimationFrame(scrollRaf);
        scrollRaf = 0;
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearTimeout(timer);
      if (moRaf) cancelAnimationFrame(moRaf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScrollParallax);
      clipObserver.disconnect();
      mo.disconnect();
      if (heroObserver) heroObserver.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [pathname]);

  return null;
}
