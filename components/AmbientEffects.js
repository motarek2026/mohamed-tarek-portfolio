'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePortfolio } from '@/context/PortfolioContext';

const SPARK_ITEMS = [
  { left: '8%', size: '14px', color: 'var(--pu)', dx: '-5vw', dur: '38s', del: '-8s' },
  { left: '19%', size: '18px', color: 'var(--pk)', dx: '4vw', dur: '44s', del: '-22s' },
  { left: '31%', size: '12px', color: 'var(--accent)', dx: '-3vw', dur: '50s', del: '-14s' },
  { left: '44%', size: '20px', color: 'var(--pu)', dx: '6vw', dur: '36s', del: '-30s' },
  { left: '57%', size: '15px', color: 'var(--pk)', dx: '-4vw', dur: '48s', del: '-5s' },
  { left: '68%', size: '11px', color: 'var(--accent)', dx: '3vw', dur: '42s', del: '-19s' },
  { left: '79%', size: '22px', color: 'var(--pu)', dx: '-6vw', dur: '54s', del: '-27s' },
  { left: '88%', size: '14px', color: 'var(--pk)', dx: '5vw', dur: '40s', del: '-11s' },
  { left: '94%', size: '16px', color: 'var(--accent)', dx: '-2vw', dur: '46s', del: '-35s' }
];

export default function AmbientEffects() {
  const { editing, t, projects, lang, introDone } = usePortfolio();
  const pathname = usePathname();
  const progRef = useRef(null);
  const glowRef = useRef(null);
  const curRef = useRef(null);
  const dotRef = useRef(null);

  // Ensure body.go is always active on standalone routes so floating controls & glow never stay hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (pathname !== '/' || introDone || editing) {
      document.body.classList.remove('introing');
      document.body.classList.add('go', 'settled', 'written');
    }
  }, [pathname, introDone, editing]);

  // Persistent IntersectionObserver for .rv, .rv0, .rvx elements across route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io = null;

    if (!reduce && !editing && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
      );
    }

    const observeAll = () => {
      const els = document.querySelectorAll('.rv:not(.in), .rv0:not(.in), .rvx:not(.in)');
      if (!els.length) return;
      if (!io) {
        els.forEach((e) => e.classList.add('in'));
        return;
      }
      els.forEach((e) => io.observe(e));
    };

    observeAll();
    const rafId = requestAnimationFrame(observeAll);
    let moTimer = null;
    const mo = new MutationObserver(() => {
      if (!moTimer) {
        moTimer = setTimeout(() => {
          moTimer = null;
          observeAll();
        }, 120);
      }
    });
    const mainTarget = document.getElementById('app') || document.getElementById('folder-main') || document.body;
    mo.observe(mainTarget, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (moTimer) clearTimeout(moTimer);
      if (io) io.disconnect();
      mo.disconnect();
    };
  }, [editing, projects, lang, pathname]);

  // Scroll progress bar & header scroll elevation state (cached scrollHeight, zero layout thrash on scroll)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ticking = false;
    let maxScroll = 1;
    let lastScrolledState = null;

    const measureMaxScroll = () => {
      const root = document.documentElement;
      maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    };

    const updateScroll = () => {
      ticking = false;
      const y = window.scrollY;
      if (progRef.current) {
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
        progRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      const isScrolled = y > 20;
      if (isScrolled !== lastScrolledState) {
        lastScrolledState = isScrolled;
        const hdr = document.getElementById('header');
        if (hdr) hdr.classList.toggle('scrolled', isScrolled);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const onResize = () => {
      measureMaxScroll();
      onScroll();
    };

    measureMaxScroll();
    const initTimer = setTimeout(measureMaxScroll, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    updateScroll();

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  // Mouse glow & custom cursor (fine pointer only, rAF sleeps when mouse is idle, transform-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !finePointer) return;

    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let gtx = gx;
    let gty = gy;
    let cux = -200;
    let cuy = -200;
    let ctx = -200;
    let cty = -200;
    let lastTarget = null;
    let targetDirty = false;
    let rafId = 0;

    const tick = () => {
      rafId = 0;
      if (document.hidden) return;

      const curEl = curRef.current;
      const dotEl = dotRef.current;

      if (targetDirty && curEl && dotEl) {
        targetDirty = false;
        curEl.classList.add('on');
        dotEl.classList.add('on');
        dotEl.style.transform = `translate3d(${ctx}px,${cty}px,0)`;

        const tg = lastTarget;
        if (tg && tg.closest) {
          const labelled = !editing && tg.closest('[data-cursor]');
          const isView =
            !editing &&
            tg.closest('.slot:not(.empty):not(.txt):not(.emb), .folder-card, .cs-hero-stage, .sp-example-card, .wrow');
          const isLink = tg.closest(
            'a,button,select,.pill,.btn,.soc,.fchip,.bchip,.mode-tab,.layout-btn,.cl-ctrl-btn,[data-act]'
          );
          let label = '';
          if (labelled) label = labelled.dataset.cursor;
          else if (isView) {
            label = tg.closest('.folder-card, .wrow')
              ? document.documentElement.lang === 'ar'
                ? 'افتح المشروع'
                : 'View Case'
              : t('view');
          }
          const cls = label ? 'on view' : isLink ? 'on link' : 'on';
          if (curEl.className !== cls || curEl.dataset.l !== label) {
            curEl.className = cls;
            curEl.dataset.l = label;
          }
        }
      }

      const gdx = gtx - gx;
      const gdy = gty - gy;
      const cdx = ctx - cux;
      const cdy = cty - cuy;

      let keepRunning = false;

      if (Math.abs(gdx) > 0.25 || Math.abs(gdy) > 0.25) {
        gx += gdx * 0.09;
        gy += gdy * 0.09;
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${gx.toFixed(1)}px,${gy.toFixed(1)}px,0)`;
        }
        keepRunning = true;
      }

      if (Math.abs(cdx) > 0.2 || Math.abs(cdy) > 0.2) {
        cux += cdx * 0.22;
        cuy += cdy * 0.22;
        if (curEl) {
          curEl.style.transform = `translate3d(${cux.toFixed(1)}px,${cuy.toFixed(1)}px,0)`;
        }
        keepRunning = true;
      }

      if (keepRunning) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e) => {
      if (document.hidden) return;
      gtx = e.clientX;
      gty = e.clientY;
      ctx = e.clientX;
      cty = e.clientY;
      lastTarget = e.target;
      targetDirty = true;
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMouseLeave = () => {
      if (curRef.current) curRef.current.classList.remove('on');
      if (dotRef.current) dotRef.current.classList.remove('on');
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [editing, t]);

  return (
    <>
      <div id="amb" aria-hidden="true">
        <i className="o1" />
        <i className="o2" />
        <i className="o3" />
        <i className="o4" />
        <i className="o5" />
        <div className="sparks">
          {SPARK_ITEMS.map((sp, i) => (
            <span
              key={i}
              className="sp"
              style={{
                left: sp.left,
                fontSize: sp.size,
                color: sp.color,
                '--dx': sp.dx,
                '--dur': sp.dur,
                '--del': sp.del
              }}
            >
              ✦
            </span>
          ))}
        </div>
      </div>
      <div id="glow" ref={glowRef} aria-hidden="true" />
      <div id="prog" ref={progRef} aria-hidden="true" />
      <div id="cur" ref={curRef} aria-hidden="true" />
      <div id="curdot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
