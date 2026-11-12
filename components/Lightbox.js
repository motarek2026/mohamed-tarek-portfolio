'use client';

import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Lightbox() {
  const { lightbox, closeLightbox, stepLightbox, selectLightboxIndex, lang, tx, t } = usePortfolio();
  const swipeStartX = useRef(null);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!lightbox.isOpen) return;
    prevFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus to close button when lightbox opens
    const focusTimer = setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
    }, 10);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepLightbox(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === 'function') {
        prevFocusRef.current.focus();
      }
    };
  }, [lightbox.isOpen, closeLightbox, stepLightbox]);

  // Preload adjacent images
  useEffect(() => {
    if (!lightbox.isOpen || lightbox.items.length < 2) return;
    const n = lightbox.items.length;
    [1, -1].forEach((offset) => {
      const nb = lightbox.items[(lightbox.imageIndex + offset + n) % n];
      if (nb && nb.src) {
        const pre = new window.Image();
        pre.src = nb.src;
      }
    });
  }, [lightbox.isOpen, lightbox.imageIndex, lightbox.items]);

  if (!lightbox.isOpen) return null;

  const isVideo = !!lightbox.videoSrc;
  const items = lightbox.items || [];
  const currentItem = items[lightbox.imageIndex];
  const multi = items.length > 1;

  const handleSwipeStart = (clientX) => {
    swipeStartX.current = clientX;
  };

  const handleSwipeEnd = (clientX) => {
    if (swipeStartX.current === null) return;
    const dx = clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(dx) > 45) {
      stepLightbox(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      id="lb"
      ref={dialogRef}
      tabIndex={-1}
      className={`on ${!isVideo ? 'viewer' : ''}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={lightbox.title ? `${lightbox.title} — ${t('view')}` : t('view')}
      onClick={(e) => {
        if (e.target.closest('video, .vb, .vimg, .vcap, .vthumbs')) return;
        closeLightbox();
      }}
      onPointerDown={(e) => {
        if (!isVideo && e.target.closest('.vimg')) {
          handleSwipeStart(e.clientX);
        }
      }}
      onPointerUp={(e) => {
        handleSwipeEnd(e.clientX);
      }}
      onTouchStart={(e) => {
        if (!isVideo && e.touches && e.touches[0]) {
          handleSwipeStart(e.touches[0].clientX);
        }
      }}
      onTouchEnd={(e) => {
        if (!isVideo && e.changedTouches && e.changedTouches[0]) {
          handleSwipeEnd(e.changedTouches[0].clientX);
        }
      }}
    >
      <div className="lbc">
        {isVideo ? (
          <div className="vwrap">
            <video src={lightbox.videoSrc} controls autoPlay playsInline />
            <button
              ref={closeBtnRef}
              type="button"
              className="vb vx"
              aria-label={t('vclose')}
              title={t('vclose')}
              onClick={closeLightbox}
            >
              &times;
            </button>
          </div>
        ) : currentItem ? (
          <div className="vwrap">
            <img
              key={`${lightbox.imageIndex}-${currentItem.src}`}
              className={`vimg ${lightbox.direction || ''}`.trim()}
              src={currentItem.src}
              alt={tx(currentItem.alt) || lightbox.title || ''}
              width={1200}
              height={900}
              decoding="async"
            />

            {multi && (
              <>
                <button
                  type="button"
                  className="vb vl"
                  aria-label={lang === 'ar' ? t('vnext') : t('vprev')}
                  title={lang === 'ar' ? t('vnext') : t('vprev')}
                  onClick={() => stepLightbox(-1)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="vb vr"
                  aria-label={lang === 'ar' ? t('vprev') : t('vnext')}
                  title={lang === 'ar' ? t('vprev') : t('vnext')}
                  onClick={() => stepLightbox(1)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              className="vb vx"
              aria-label={t('vclose')}
              title={t('vclose')}
              onClick={closeLightbox}
            >
              &times;
            </button>

            <div className="vcap" aria-live="polite">
              <b>{lightbox.title}</b>
              <span className="vcnt">
                {pad(lightbox.imageIndex + 1)} / {pad(items.length)}
              </span>
            </div>

            {multi && (
              <div className="vthumbs" role="tablist" aria-label={lightbox.title}>
                {items.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-label={`${t('view')} ${idx + 1}`}
                    aria-selected={idx === lightbox.imageIndex}
                    className={`vthumb ${idx === lightbox.imageIndex ? 'on' : ''}`}
                    onClick={() => selectLightboxIndex(idx)}
                  >
                    <img
                      src={item.src}
                      alt=""
                      width={80}
                      height={60}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
