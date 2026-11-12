'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef('');

  useEffect(() => {
    // 1. Check Do Not Track & Admin Exclusion
    if (typeof window === 'undefined') return;
    if (navigator.doNotTrack === '1') return;

    const notrackQuery = searchParams?.get('notrack');
    if (notrackQuery === '1') {
      try {
        localStorage.setItem('mt_notrack', '1');
      } catch {}
      return;
    }

    try {
      if (localStorage.getItem('mt_notrack') === '1') return;
      if (localStorage.getItem('dash_admin') === '1') return;
    } catch {}

    const dashboardUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';
    const trackEndpoint = `${dashboardUrl.replace(/\/$/, '')}/api/track`;

    const getDevice = () => {
      const w = window.innerWidth;
      return w < 680 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
    };

    const sendEvent = (type, details = {}) => {
      const run = () => {
        try {
          const payload = JSON.stringify({
            type,
            path: pathname || window.location.pathname,
            lang: document.documentElement.lang || 'en',
            device: getDevice(),
            referrer_host: document.referrer
              ? new URL(document.referrer).host
              : null,
            ...details
          });

          if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(trackEndpoint, blob);
          } else {
            fetch(trackEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: payload,
              keepalive: true
            }).catch(() => {});
          }
        } catch {}
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 1500 });
      } else {
        setTimeout(run, 150);
      }
    };

    // 2. Track Pageview on pathname transition
    const fullPath = pathname || '/';
    if (lastPathRef.current !== fullPath) {
      lastPathRef.current = fullPath;
      sendEvent('pageview');
    }

    // 3. Track Conversions (WhatsApp, CV download, project views)
    const handleGlobalClicks = (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const aria = target.getAttribute('aria-label') || '';

      // WhatsApp conversion
      if (href.includes('wa.me') || aria.toLowerCase().includes('whatsapp')) {
        sendEvent('whatsapp');
        return;
      }

      // CV download
      if (target.hasAttribute('download') || href.endsWith('.pdf')) {
        sendEvent('cv_download');
        return;
      }

      // Project view
      if (href.includes('/projects/')) {
        const slug = href.split('/').filter(Boolean).pop();
        if (slug) {
          sendEvent('project_view', { project_slug: slug });
        }
      }
    };

    document.addEventListener('click', handleGlobalClicks, { passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClicks);
    };
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
