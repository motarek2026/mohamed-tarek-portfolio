'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { NetworkSvg } from './SharedUI';

export default function Footer() {
  const { site, tx, t, lang, canEdit, editing, setEditing, activeFolderSlug, setActiveFolderSlug } = usePortfolio();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState('');
  const footerRef = useRef(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Cairo'
      }).format(new Date());
    setClock(fmt());
    let inView = false;
    let id = 0;

    const startClock = () => {
      if (!id && inView && !document.hidden) {
        setClock(fmt());
        id = setInterval(() => {
          if (!document.hidden && inView) setClock(fmt());
        }, 1000);
      }
    };

    const stopClock = () => {
      if (id) {
        clearInterval(id);
        id = 0;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stopClock();
      else startClock();
    };

    let io = null;
    if (footerRef.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? false;
          if (inView) startClock();
          else stopClock();
        },
        { threshold: 0.05 }
      );
      io.observe(footerRef.current);
    } else {
      inView = true;
      startClock();
    }

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopClock();
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const socials = site.socials || [];
  const emailEntry = socials.find((x) => x.id === 'email' && x.value && x.value.trim());
  const phoneEntry = socials.find((x) => x.id === 'phone' && x.value && x.value.trim());
  const copyTarget = emailEntry || phoneEntry;

  const handleCopyFooterContact = async () => {
    if (!copyTarget) return;
    try {
      await navigator.clipboard.writeText(copyTarget.value.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const fallbackHref = socHref(copyTarget.id, copyTarget.value);
      if (fallbackHref) window.location.href = fallbackHref;
    }
  };

  const handleScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const logoClasses = [
    'logo-img',
    site.logoInv ? 'inv' : '',
    site.logoLight ? 'lt' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const navItems = [
    { key: 'home', label: t('home'), sectionId: 'top', href: '/' },
    { key: 'about', label: t('about'), sectionId: 'about', href: '/about' },
    { key: 'work', label: t('projectsNav'), sectionId: 'work', href: isHome ? '#work' : '/#work' },
    { key: 'creative-lab', label: t('creativeLabNav'), sectionId: 'creative-lab', href: '/creative-lab' },
    { key: 'services', label: t('servicesNav'), sectionId: 'services', href: '/services' },
    { key: 'pricing', label: t('pricingNav'), sectionId: 'packages', href: '/pricing' },
    { key: 'start-project', label: t('startProject'), sectionId: 'brief', href: '/start-project' },
    { key: 'tools', label: t('skillsNav'), sectionId: 'tools', href: isHome ? '#tools' : '/#tools' },
    { key: 'contact', label: t('contact'), sectionId: 'contact', href: isHome ? '#contact' : '/#contact' }
  ];

  const handleNavClick = (e, item) => {
    if (
      item.key === 'about' ||
      item.key === 'creative-lab' ||
      item.key === 'services' ||
      item.key === 'pricing' ||
      item.key === 'start-project'
    )
      return;
    if (item.key === 'home' && isHome && typeof window !== 'undefined') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (item.sectionId === 'work' && activeFolderSlug) {
      setActiveFolderSlug(null);
    }
    if (isHome && typeof window !== 'undefined') {
      const el = document.getElementById(item.sectionId);
      if (el) {
        e.preventDefault();
        window.history.pushState(null, '', `#${item.sectionId}`);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer ref={footerRef}>
      <div className="wrap footer-shell">
        <div className="footer-top">
          <div className="footer-left">
            <Link
              href="/"
              className="fbrand"
              onClick={(e) => {
                if (isHome && typeof window !== 'undefined') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {site.logo && (
                <img
                  className={logoClasses}
                  src={site.logo}
                  alt={tx(site.name)}
                  width={104}
                  height={26}
                  loading="lazy"
                  decoding="async"
                  style={{ height: '26px' }}
                />
              )}
              <strong translate="no">{tx(site.name)}</strong>
              <span className="f-dot" aria-hidden="true">
                ·
              </span>
              <span>2026</span>
            </Link>
            <div className="footer-sub-row">
              <span className="footer-role">{tx(site.role)}</span>
              <span className="f-dot" aria-hidden="true">
                ·
              </span>
              <span className="footer-avail">
                <i aria-hidden="true" />
                {tx(site.avail)}
              </span>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-action-row">
              {clock && (
                <span className="footer-clock" aria-label="Cairo local time">
                  <i aria-hidden="true" />
                  <b>{clock}</b>
                  <small>{lang === 'ar' ? 'القاهرة (GMT+2)' : 'Cairo · GMT+2'}</small>
                </span>
              )}

              {copyTarget && (
                <button
                  type="button"
                  className={`pill footer-copy-btn ${copied ? 'copied' : ''}`.trim()}
                  onClick={handleCopyFooterContact}
                  aria-live="polite"
                >
                  <NetworkSvg id={copyTarget.id} />
                  <span>
                    {copied
                      ? lang === 'ar'
                        ? 'تم النسخ ✓'
                        : 'Copied ✓'
                      : copyTarget.value}
                  </span>
                </button>
              )}

              <button
                type="button"
                className="pill footer-top-btn"
                onClick={handleScrollTop}
                aria-label={t('top')}
                title={t('top')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span>{t('top')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Footer Navigation">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="footer-meta-wrap">
            <span className="footer-copy" translate="no">
              © 2026 {tx(site.name)}
            </span>
            {canEdit && (
              <button
                type="button"
                className="footer-edit-link"
                onClick={() => setEditing((prev) => !prev)}
                aria-label={editing ? t('done') : t('edit')}
                title={editing ? t('done') : t('edit')}
              >
                <span>{editing ? '✕ ' + t('done') : '⚙ ' + t('edit')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
