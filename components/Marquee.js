'use client';

import React, { useEffect, useRef, memo } from 'react';

function Marquee({ items = [], reverse = false }) {
  const ref = useRef(null);
  const validItems = items.filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    let inView = true;

    const sync = () => {
      el.dataset.paused = !inView || document.hidden ? 'true' : 'false';
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.02 }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  if (!validItems.length) return null;

  const renderTrackItems = (keyPrefix) =>
    validItems.map((item, i) => (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        <span>{item}</span>
        <i>✦</i>
      </React.Fragment>
    ));

  return (
    <div ref={ref} className={`marq ${reverse ? 'rev' : ''}`.trim()} aria-hidden="true">
      <div className="track">
        {renderTrackItems('a')}
        {renderTrackItems('b')}
      </div>
    </div>
  );
}

export default memo(Marquee);
