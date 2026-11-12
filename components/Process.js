'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

const STEP_ICONS = [
  <svg key="0" viewBox="0 0 24 24" aria-hidden="true">
    <path pathLength="1" d="M4 5h16v11H9l-5 4z" />
    <path pathLength="1" d="M8 9h8M8 12.5h5" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" aria-hidden="true">
    <path pathLength="1" d="M9 18h6M10 21h4" />
    <path pathLength="1" d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" aria-hidden="true">
    <path pathLength="1" d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" />
    <path pathLength="1" d="M14.5 6.5l3 3" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" aria-hidden="true">
    <path pathLength="1" d="M3 8l9-5 9 5v8l-9 5-9-5z" />
    <path pathLength="1" d="M3 8l9 5 9-5M12 13v8" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" aria-hidden="true">
    <path pathLength="1" d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z" />
  </svg>
];

const WHEEL_MS = 4600;

export default function Process() {
  const { site, tx, t, lang, editing, updateSiteField } = usePortfolio();
  const list = site.process || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelRef = useRef(null);
  const wrapRef = useRef(null);
  const segsRef = useRef([]);
  const progressRef = useRef(0);
  const holdRef = useRef(false);
  const visRef = useRef(false);
  const activeIdxRef = useRef(0);

  activeIdxRef.current = activeIndex;
  const n = Math.max(1, list.length);

  useEffect(() => {
    if (typeof window === 'undefined' || !wheelRef.current || !wrapRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || editing) {
      wheelRef.current.style.setProperty('--wp', '1');
      wheelRef.current.style.setProperty('--wo', '1');
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();

    const paint = () => {
      if (!wheelRef.current) return;
      const o = (activeIdxRef.current + progressRef.current) / n;
      wheelRef.current.style.setProperty('--wp', o.toFixed(4));
      wheelRef.current.style.setProperty('--wo', o > 0.975 ? ((1 - o) / 0.025).toFixed(3) : '1');
      segsRef.current.forEach((seg, i) => {
        if (seg) {
          seg.style.setProperty('--f', Math.max(0, Math.min(1, o * n - i)).toFixed(3));
        }
      });
    };

    const tick = (now) => {
      if (!visRef.current || document.hidden) {
        rafId = 0;
        return;
      }
      const dt = Math.min(64, now - lastTime);
      lastTime = now;
      if (!holdRef.current) {
        progressRef.current += dt / WHEEL_MS;
        if (progressRef.current >= 1) {
          progressRef.current = 0;
          const next = (activeIdxRef.current + 1) % n;
          activeIdxRef.current = next;
          setActiveIndex(next);
        }
      }
      paint();
      rafId = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!rafId && visRef.current && !document.hidden) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visRef.current = entries[0]?.isIntersecting || false;
        kick();
      },
      { threshold: 0.25 }
    );
    io.observe(wrapRef.current);

    const onVisibility = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    paint();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafId);
    };
  }, [editing, n]);

  if (!list.length && !editing) return null;

  const handleStepClick = (idx) => {
    progressRef.current = 0;
    activeIdxRef.current = idx;
    setActiveIndex(idx);
  };

  return (
    <section className="process wrap" id="process">
      <h2 className="big rv">
        {editing ? t('processTitle') : <AnimatedWords text={t('processTitle')} />}
      </h2>

      <div
        className="wheelwrap rv"
        ref={wrapRef}
        onPointerEnter={() => {
          holdRef.current = true;
        }}
        onPointerLeave={() => {
          holdRef.current = false;
        }}
        onFocus={() => {
          holdRef.current = true;
        }}
        onBlur={() => {
          holdRef.current = false;
        }}
      >
        <div className="wheel" ref={wheelRef} style={{ '--n': n }}>
          <svg className="wring" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0359D7" />
                <stop offset=".55" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#E879F9" />
              </linearGradient>
            </defs>
            <circle className="wtrack" cx="50" cy="50" r="40" />
            <circle className="warc" cx="50" cy="50" r="40" pathLength="100" />
          </svg>
          <div className="wcomet" aria-hidden="true">
            <i />
          </div>
          <div className="whub" aria-hidden="true">
            <i className="hub-ring" />
            <b className="hub-n pop" key={activeIndex}>
              {String(activeIndex + 1).padStart(2, '0')}
            </b>
            <small>{t('step')}</small>
          </div>

          {list.map((s, i) => {
            const ang = ((-90 + (i * 360) / n) * Math.PI) / 180;
            const x = 50 + 40 * Math.cos(ang);
            const y = 50 + 40 * Math.sin(ang);
            return (
              <button
                key={i}
                type="button"
                className={`wn ${i === activeIndex ? 'on' : ''}`}
                style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` }}
                aria-label={tx(s.title)}
                onClick={() => handleStepClick(i)}
              >
                <span className="nn">{String(i + 1).padStart(2, '0')}</span>
                {STEP_ICONS[i % STEP_ICONS.length]}
              </button>
            );
          })}
        </div>

        <div className="pdetails">
          <div className="pstep-tabs" role="tablist" aria-label={t('processTitle')}>
            {list.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`pstep-pill ${i === activeIndex ? 'on' : ''}`}
                onClick={() => handleStepClick(i)}
              >
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{tx(s.title)}</span>
              </button>
            ))}
          </div>
          {list.map((s, i) => (
            <div key={i} className={`pd ${i === activeIndex ? 'on' : ''}`}>
              <span className="pd-k">
                {t('step')} {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <EditableText
                path={`site.process.${i}.title`}
                value={s.title}
                tag="h3"
                className="pd-t"
                singleLine
              />
              <EditableText
                path={`site.process.${i}.desc`}
                value={s.desc}
                tag="p"
                className="pd-d"
              />
              {editing && (
                <button
                  type="button"
                  className="x"
                  aria-label="Remove"
                  onClick={() =>
                    updateSiteField((st) => {
                      st.process.splice(i, 1);
                      return st;
                    })
                  }
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <div className="wseg" aria-hidden="true">
            {list.map((_, i) => (
              <i
                key={i}
                ref={(el) => {
                  segsRef.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <div className="addrow">
          <button
            type="button"
            className="addbtn"
            onClick={() =>
              updateSiteField((st) => {
                st.process.push({
                  title: { en: 'Step', ar: 'خطوة' },
                  desc: { en: 'Describe this step.', ar: 'اكتب وصف الخطوة.' }
                });
                return st;
              })
            }
          >
            {t('addStep')}
          </button>
        </div>
      )}
    </section>
  );
}
