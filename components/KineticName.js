'use client';

import React, { useEffect, useRef, useMemo, memo } from 'react';

/**
 * KineticName
 * - Desktop (fine pointer): per-character proximity reaction in English (lift, scale, fuchsia sheen),
 *   and per-word proximity reaction in Arabic so cursive Arabic letter shaping never breaks.
 * - Uses compositor-only properties (transform + opacity) with cached bounding rects (no per-frame reflow/getBoundingClientRect).
 * - Touch / coarse pointer: calm automatic wave animation that pauses when off-screen or tab is hidden.
 * - Includes the slow-moving outlined service ribbon behind the name using existing site.services titles.
 */
function KineticName({
  text = '',
  prefix = '',
  lang = 'en',
  services = [],
  as: Tag = 'h1',
  showRibbon = true,
  className = ''
}) {
  const wrapRef = useRef(null);
  const nameRef = useRef(null);
  const unitRefs = useRef([]);
  const isAr = lang === 'ar';

  const words = useMemo(() => {
    const clean = String(text || '').trim();
    if (!clean) return [];
    return clean.split(/\s+/);
  }, [text]);

  // Repeat existing services for a seamless 2-half marquee track without inventing any new text
  const ribbonItems = useMemo(() => {
    const valid = (services || []).filter(Boolean);
    if (valid.length === 0) return [];
    return [...valid, ...valid, ...valid];
  }, [services]);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const nameEl = nameRef.current;
    if (!wrapEl || !nameEl || typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let inView = true;
    let tabHidden = document.hidden;
    let rafId = 0;
    let pointerActive = false;
    let targetX = 0;
    let targetY = 0;
    let centers = [];
    let rectsDirty = true;

    const syncPlayState = () => {
      const paused = !inView || tabHidden || reduceMotion;
      wrapEl.dataset.paused = paused ? 'true' : 'false';
    };

    const measureCenters = () => {
      rectsDirty = false;
      const units = unitRefs.current.filter(Boolean);
      centers = units.map((el, i) => {
        const rect = el.getBoundingClientRect();
        const prev = centers[i];
        return {
          el,
          cx: rect.left + rect.width * 0.5,
          cy: rect.top + rect.height * 0.5,
          cur: prev ? prev.cur : 0,
          lastV: prev ? prev.lastV : -1
        };
      });
    };

    const renderFrame = () => {
      rafId = 0;
      if (!inView || tabHidden || reduceMotion) {
        wrapEl.dataset.active = 'false';
        return;
      }

      if (rectsDirty || !centers.length) {
        measureCenters();
      }

      const radius = isAr ? 210 : 165;
      let stillMoving = false;

      for (let i = 0; i < centers.length; i += 1) {
        const item = centers[i];
        let goal = 0;
        if (pointerActive) {
          const dx = targetX - item.cx;
          const dy = (targetY - item.cy) * 1.25;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const t = 1 - dist / radius;
            goal = 0.5 * (1 - Math.cos(Math.PI * t));
          }
        }

        item.cur += (goal - item.cur) * 0.22;
        if (Math.abs(goal - item.cur) > 0.004 || pointerActive) {
          stillMoving = true;
        } else if (goal === 0) {
          item.cur = 0;
        }

        const v = item.cur;
        if (Math.abs(v - item.lastV) > 0.002) {
          item.lastV = v;
          if (v === 0) {
            item.el.style.removeProperty('--kn-y');
            item.el.style.removeProperty('--kn-s');
            item.el.style.removeProperty('--kn-g');
          } else {
            item.el.style.setProperty('--kn-y', `${(-13 * v).toFixed(2)}px`);
            item.el.style.setProperty('--kn-s', (1 + 0.135 * v).toFixed(3));
            item.el.style.setProperty('--kn-g', v.toFixed(3));
          }
        }
      }

      if (stillMoving) {
        wrapEl.dataset.active = 'true';
        rafId = requestAnimationFrame(renderFrame);
      } else {
        wrapEl.dataset.active = 'false';
      }
    };

    const scheduleFrame = () => {
      if (!rafId && inView && !tabHidden && !reduceMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const onPointerEnter = () => {
      if (!canHover || reduceMotion) return;
      rectsDirty = true;
      pointerActive = true;
      scheduleFrame();
    };

    const onPointerMove = (e) => {
      if (!canHover || reduceMotion) return;
      pointerActive = true;
      targetX = e.clientX;
      targetY = e.clientY;
      scheduleFrame();
    };

    const onPointerLeave = () => {
      pointerActive = false;
      scheduleFrame();
    };

    const onVisibilityChange = () => {
      tabHidden = document.hidden;
      syncPlayState();
      if (tabHidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        wrapEl.dataset.active = 'false';
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
        });
        syncPlayState();
        if (!inView && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
          wrapEl.dataset.active = 'false';
        }
      },
      { threshold: 0.05 }
    );

    io.observe(wrapEl);
    syncPlayState();

    const markRectsDirty = () => {
      rectsDirty = true;
    };

    if (canHover && !reduceMotion) {
      wrapEl.addEventListener('pointerenter', onPointerEnter, { passive: true });
      wrapEl.addEventListener('pointermove', onPointerMove, { passive: true });
      wrapEl.addEventListener('pointerleave', onPointerLeave, { passive: true });
      window.addEventListener('resize', markRectsDirty, { passive: true });
      window.addEventListener('scroll', markRectsDirty, { passive: true });
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      wrapEl.removeEventListener('pointerenter', onPointerEnter);
      wrapEl.removeEventListener('pointermove', onPointerMove);
      wrapEl.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', markRectsDirty);
      window.removeEventListener('scroll', markRectsDirty);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [text, isAr]);

  let unitCursor = 0;
  unitRefs.current = [];

  return (
    <div className={`hx-kinetic-stage ${className}`.trim()} ref={wrapRef} data-paused="false" data-active="false">
      {/* Slow-moving Outlined Services Ribbon behind the Hero Name */}
      {showRibbon && ribbonItems.length > 0 && (
        <div className="hx-outline-ribbon" aria-hidden="true">
          <div className="hx-outline-track">
            {[0, 1].map((half) => (
              <div className="hx-outline-half" key={half}>
                {ribbonItems.map((srv, idx) => (
                  <span className="hx-outline-item" key={`${half}-${idx}`}>
                    <b>{srv}</b>
                    <i className="hx-outline-sep">✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <Tag className="hx-title">
        {prefix && (
          <>
            <span className="hx-title-pre">{prefix}</span>{' '}
          </>
        )}
        <span
          className={`hx-title-name kn-root ${isAr ? 'kn-ar' : 'kn-en'}`}
          ref={nameRef}
          translate="no"
          aria-label={text}
        >
          {isAr
            ? /* Arabic: Word-level interactive units so Arabic cursive letters never disconnect */
              words.map((word, wIdx) => {
                const idx = unitCursor++;
                return (
                  <React.Fragment key={wIdx}>
                    <span
                      ref={(el) => {
                        unitRefs.current[idx] = el;
                      }}
                      className="kn-unit kn-word"
                      style={{ '--u-idx': idx }}
                      data-text={word}
                      aria-hidden="true"
                    >
                      {word}
                    </span>
                    {wIdx < words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })
            : /* English: Character-level interactive units grouped inside word wrappers */
              words.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span className="kn-word-group" aria-hidden="true">
                    {Array.from(word).map((ch, cIdx) => {
                      const idx = unitCursor++;
                      return (
                        <span
                          key={cIdx}
                          ref={(el) => {
                            unitRefs.current[idx] = el;
                          }}
                          className="kn-unit kn-char"
                          style={{ '--u-idx': idx }}
                          data-text={ch}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                  {wIdx < words.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
        </span>
      </Tag>
    </div>
  );
}

export default memo(KineticName);
