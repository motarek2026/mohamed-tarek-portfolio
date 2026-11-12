'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const MAGNETIC =
  '.btn, .pill.solid, .cv-hdr-btn, .soc, .totop, .wacta, .mode-tab, .vault-nav-btn, .skill-pill, .aph-chip, .about-preview-tools .mini > span, .toolcard, .pstep-pill, .footer-top-btn';
const SPOTLIGHT = '.svc, .toolcard, .fact, .pk, .tm, .stat, .fq, .pdetails';

/**
 * Progressive-enhancement motion layer (desktop pointer devices only):
 *  - magnetic buttons & tool/skill pills (clamped to ±14px using the `translate` property, rAF-batched with cached rects)
 *  - cursor-following spotlight borders & surface glow (`--spot-x`, `--spot-y`) on cards
 *  - 3D tilt + glossy sheen on the profile photo card
 *  - marquee speed reacts to scroll velocity (Lenis) and sleeps at 0 CPU when not scrolling
 * Everything is skipped for reduced-motion and touch devices.
 */
export default function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce) return;

    const cleanups = [];
    const clamp = (val, lim) => Math.max(-lim, Math.min(lim, val));

    if (fine) {
      let magnet = null;
      let magnetRect = null;
      let tilt = null;
      let tiltRect = null;
      let spotCard = null;
      let spotRect = null;
      let moveRaf = 0;
      let lastEvent = null;

      const reset = (el) => {
        if (!el) return;
        el.style.transition = 'translate .5s cubic-bezier(.34,1.56,.64,1)';
        el.style.translate = '0 0';
        const innerTool = el.querySelector && el.querySelector('.tool');
        if (innerTool) {
          innerTool.style.transition = 'translate .5s cubic-bezier(.34,1.56,.64,1)';
          innerTool.style.translate = '0 0';
        }
      };
      const resetTilt = (el) => {
        if (!el) return;
        el.style.transition = 'transform .6s cubic-bezier(.22,.8,.2,1)';
        el.style.transform = '';
      };

      const processPointerFrame = () => {
        moveRaf = 0;
        if (!lastEvent || document.hidden) return;
        const e = lastEvent;
        const target = e.target instanceof Element ? e.target : null;
        if (!target) return;

        // Cursor-following spotlight border on interactive cards
        const sp = target.closest(SPOTLIGHT);
        if (sp !== spotCard) {
          spotCard = sp;
          spotRect = sp ? sp.getBoundingClientRect() : null;
        }
        if (spotCard && spotRect) {
          const sx = `${(e.clientX - spotRect.left).toFixed(1)}px`;
          const sy = `${(e.clientY - spotRect.top).toFixed(1)}px`;
          spotCard.style.setProperty('--spot-x', sx);
          spotCard.style.setProperty('--spot-y', sy);
          if (spotCard.classList.contains('svc')) {
            spotCard.style.setProperty('--sx', sx);
            spotCard.style.setProperty('--sy', sy);
          }
        }

        const m = target.closest(MAGNETIC);
        if (magnet !== m) {
          if (magnet) reset(magnet);
          magnet = m;
          magnetRect = m ? m.getBoundingClientRect() : null;
        }
        if (magnet && magnetRect) {
          const isToolCard = magnet.matches('.toolcard');
          const isPill = magnet.matches('.skill-pill, .aph-chip, .about-preview-tools .mini > span, .pstep-pill');
          const pull = isToolCard ? 0.24 : isPill ? 0.18 : 0.22;
          const limX = isToolCard ? 13 : isPill ? 8 : 14;
          const limY = isToolCard ? 11 : isPill ? 7 : 12;
          const dx = clamp((e.clientX - (magnetRect.left + magnetRect.width / 2)) * pull, limX);
          const dy = clamp((e.clientY - (magnetRect.top + magnetRect.height / 2)) * (pull + 0.04), limY);
          magnet.style.transition = 'translate .12s linear';
          magnet.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
          if (isToolCard) {
            const innerTool = magnet.querySelector('.tool');
            if (innerTool) {
              innerTool.style.transition = 'translate .12s linear';
              innerTool.style.translate = `${(dx * 0.65).toFixed(1)}px ${(dy * 0.65).toFixed(1)}px`;
            }
          }
        }

        const p = target.closest('.photo.has');
        if (tilt !== p) {
          if (tilt) resetTilt(tilt);
          tilt = p;
          tiltRect = p ? p.getBoundingClientRect() : null;
        }
        if (tilt && tiltRect && tiltRect.width > 0 && tiltRect.height > 0) {
          const px = (e.clientX - tiltRect.left) / tiltRect.width;
          const py = (e.clientY - tiltRect.top) / tiltRect.height;
          tilt.style.transition = 'transform .12s linear';
          tilt.style.transform = `perspective(900px) rotateY(${((px - 0.5) * 14).toFixed(2)}deg) rotateX(${((0.5 - py) * 14).toFixed(2)}deg) scale(1.02)`;
          tilt.style.setProperty('--sheen-x', `${(px * 100).toFixed(1)}%`);
          tilt.style.setProperty('--sheen-y', `${(py * 100).toFixed(1)}%`);
        }
      };

      const onMove = (e) => {
        lastEvent = e;
        if (!moveRaf) {
          moveRaf = requestAnimationFrame(processPointerFrame);
        }
      };

      const invalidateRects = () => {
        spotRect = spotCard ? spotCard.getBoundingClientRect() : null;
        magnetRect = magnet ? magnet.getBoundingClientRect() : null;
        tiltRect = tilt ? tilt.getBoundingClientRect() : null;
      };

      const onLeaveDoc = () => {
        if (moveRaf) {
          cancelAnimationFrame(moveRaf);
          moveRaf = 0;
        }
        reset(magnet);
        resetTilt(tilt);
        magnet = null;
        magnetRect = null;
        tilt = null;
        tiltRect = null;
        spotCard = null;
        spotRect = null;
      };

      document.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeaveDoc, { passive: true });
      window.addEventListener('scroll', invalidateRects, { passive: true });
      window.addEventListener('resize', invalidateRects, { passive: true });
      cleanups.push(() => {
        if (moveRaf) cancelAnimationFrame(moveRaf);
        document.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('mouseleave', onLeaveDoc);
        window.removeEventListener('scroll', invalidateRects);
        window.removeEventListener('resize', invalidateRects);
      });
    }

    // Marquee speed follows scroll velocity and automatically sleeps when velocity decays to 1x
    // Targets marquee tracks directly instead of calling document.getAnimations() on the entire DOM
    let raf = 0;
    let rate = 1;
    let cachedMarqAnims = null;
    let cacheTimer = 0;

    const getMarqAnims = () => {
      if (cachedMarqAnims) return cachedMarqAnims;
      const tracks = document.querySelectorAll('.marq .track');
      const anims = [];
      tracks.forEach((tr) => {
        if (typeof tr.getAnimations === 'function') {
          tr.getAnimations().forEach((a) => anims.push(a));
        }
      });
      cachedMarqAnims = anims;
      return anims;
    };

    const tick = () => {
      raf = 0;
      if (document.hidden) return;
      const lenis = window.__lenis;
      const v = lenis ? Math.abs(lenis.velocity || 0) : 0;
      const target = 1 + Math.min(v * 0.35, 5);
      rate += (target - rate) * 0.12;

      const anims = getMarqAnims();
      if (Math.abs(rate - 1) > 0.015 || target > 1.01) {
        anims.forEach((a) => {
          a.playbackRate = rate;
        });
        raf = requestAnimationFrame(tick);
      } else if (rate !== 1) {
        rate = 1;
        anims.forEach((a) => {
          a.playbackRate = 1;
        });
        cachedMarqAnims = null; // refresh cache when returning to idle
      }
    };

    const wakeMarqueeVelocity = () => {
      if (!raf && !document.hidden) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onVisibility = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    window.addEventListener('scroll', wakeMarqueeVelocity, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    cleanups.push(() => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', wakeMarqueeVelocity);
      document.removeEventListener('visibilitychange', onVisibility);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
