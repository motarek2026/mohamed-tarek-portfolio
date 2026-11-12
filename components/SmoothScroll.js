'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    // Skip Lenis on reduced-motion and touch/coarse devices (native momentum scroll is 60/120fps hardware-accelerated)
    if (reduce || !finePointer) return;

    let lenis = null;
    let gsapInstance = null;
    let tickerFn = null;
    let fallbackRaf = 0;
    let cancelled = false;

    const init = async () => {
      try {
        const [{ default: Lenis }, gsapMod] = await Promise.all([
          import('lenis'),
          import('gsap').catch(() => null)
        ]);
        if (cancelled) return;

        lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.88,
          syncTouch: false,
          infinite: false
        });

        window.__lenis = lenis;

        gsapInstance = gsapMod?.gsap || gsapMod?.default || null;
        if (gsapInstance && gsapInstance.ticker) {
          tickerFn = (time) => {
            if (!document.hidden && lenis) {
              lenis.raf(time * 1000);
            }
          };
          gsapInstance.ticker.add(tickerFn);
          gsapInstance.ticker.lagSmoothing(0);
        } else {
          const step = (time) => {
            if (cancelled) return;
            if (!document.hidden && lenis) {
              lenis.raf(time);
            }
            fallbackRaf = requestAnimationFrame(step);
          };
          fallbackRaf = requestAnimationFrame(step);
        }
      } catch (e) {
        // Fallback to native browser scroll
      }
    };

    init();

    return () => {
      cancelled = true;
      if (fallbackRaf) cancelAnimationFrame(fallbackRaf);
      if (gsapInstance && tickerFn) {
        gsapInstance.ticker.remove(tickerFn);
      }
      if (lenis) {
        lenis.destroy();
        window.__lenis = null;
      }
    };
  }, []);

  // On route change, scroll to top
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
