'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePortfolio } from '@/context/PortfolioContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const LOGO_SIZES = [
  [28, 'S'],
  [36, 'M'],
  [48, 'L'],
  [60, 'XL']
];

export default function Header() {
  const {
    site,
    tx,
    t,
    lang,
    canEdit,
    editing,
    setEditing,
    updateSiteField,
    pickFile,
    menuOpen,
    setMenuOpen,
    waLink,
    activeFolderSlug,
    setActiveFolderSlug
  } = usePortfolio();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAbout = pathname === '/about';
  const isCreativeLab = pathname === '/creative-lab';
  const isServices = pathname === '/services';
  const isPricing = pathname === '/pricing';
  const [activeSection, setActiveSection] = useState('#top');
  const navRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  // Smooth scroll to hash when arriving on home page from a standalone project/folder route
  useEffect(() => {
    if (!isHome || typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetId = hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isHome, pathname]);

  // Scroll spy for active navigation state (cached offsets, zero getBoundingClientRect on scroll)
  useEffect(() => {
    if (isAbout) {
      setActiveSection('/about');
      return;
    }
    if (!isHome) {
      setActiveSection('#work');
      return;
    }
    let ticking = false;
    let cachedOffsets = [];

    const measureOffsets = () => {
      const pairs = [
        ['#work', document.getElementById('work')],
        ['#about', document.getElementById('about')],
        ['#services', document.getElementById('services')],
        ['#tools', document.getElementById('tools')],
        ['#process', document.getElementById('process')],
        ['#packages', document.getElementById('packages')],
        ['#faq', document.getElementById('faq')],
        ['#contact', document.getElementById('brief') || document.getElementById('contact')]
      ];
      const scrollY = window.scrollY;
      cachedOffsets = pairs
        .filter(([, el]) => !!el)
        .map(([id, el]) => ({
          id,
          top: el.getBoundingClientRect().top + scrollY
        }));
    };

    const handleScroll = () => {
      ticking = false;
      if (!cachedOffsets.length) measureOffsets();
      const triggerY = window.scrollY + window.innerHeight * 0.42;
      let nextSection = '#top';
      for (let i = 0; i < cachedOffsets.length; i += 1) {
        if (cachedOffsets[i].top <= triggerY) {
          nextSection = cachedOffsets[i].id;
        }
      }
      setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(handleScroll);
      }
    };

    const onResize = () => {
      measureOffsets();
      onScroll();
    };

    measureOffsets();
    const timer = setTimeout(measureOffsets, 450);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isHome, isAbout]);

  // Clean, focused primary desktop navigation (5 core items — zero clutter)
  const desktopNavItems = [
    {
      key: 'home',
      label: t('home'),
      sectionId: 'top',
      href: '/'
    },
    {
      key: 'work',
      label: t('projectsNav'),
      sectionId: 'work',
      href: isHome ? '#work' : '/#work'
    },
    {
      key: 'services',
      label: t('servicesNav'),
      sectionId: 'services',
      href: '/services'
    },
    {
      key: 'about',
      label: t('about'),
      sectionId: 'about',
      href: '/about'
    },
    {
      key: 'pricing',
      label: t('pricingNav'),
      sectionId: 'packages',
      href: '/pricing'
    }
  ];

  // Full navigation for mobile drawer
  const mobileNavItems = [
    ...desktopNavItems,
    {
      key: 'creative-lab',
      label: t('creativeLabNav'),
      sectionId: 'creative-lab',
      href: '/creative-lab'
    },
    {
      key: 'tools',
      label: t('skillsNav'),
      sectionId: 'tools',
      href: isHome ? '#tools' : '/#tools'
    },
    {
      key: 'contact',
      label: t('contact'),
      sectionId: 'contact',
      href: isHome ? '#contact' : '/#contact'
    }
  ];

  const isNavItemActive = (item) => {
    if (isAbout) return item.key === 'about';
    if (isCreativeLab) return item.key === 'creative-lab' || item.key === 'work';
    if (isServices) return item.key === 'services';
    if (isPricing) return item.key === 'pricing';
    if (pathname.startsWith('/start-project')) return item.key === 'pricing';
    if (pathname.startsWith('/projects')) return item.key === 'work';
    if (item.key === 'home') return activeSection === '#top' || activeSection === '';
    if (item.key === 'services' && (activeSection === '#tools' || activeSection === '#process')) return true;
    if (item.key === 'pricing' && (activeSection === '#faq' || activeSection === '#contact')) return true;
    return activeSection === `#${item.sectionId}`;
  };

  const cvHref = (typeof site.cv === 'string' ? site.cv : site.cv?.data) || '/cv.pdf';
  const cvDownloadName = site.cv?.name || 'Mohamed-Tarek-CV.pdf';

  const handleNavClick = (e, item) => {
    setMenuOpen(false);
    if (
      item.key === 'about' ||
      item.key === 'creative-lab' ||
      item.key === 'services' ||
      item.key === 'pricing'
    ) {
      return;
    }
    if (item.key === 'home' && isHome && typeof window !== 'undefined') {
      e.preventDefault();
      if (activeFolderSlug) setActiveFolderSlug(null);
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('#top');
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
        setActiveSection(`#${item.sectionId}`);
      }
    }
  };

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (activeFolderSlug) {
      setActiveFolderSlug(null);
    }
    if (isHome && typeof window !== 'undefined') {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('#top');
    }
  };

  const talkUrl = waLink() || (isHome ? '#contact' : '/#contact');

  // Sliding active-pill indicator: follows the active nav link
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const a = nav.querySelector('a.active');
      if (!a || nav.offsetParent === null) {
        setPillStyle({ opacity: 0 });
        return;
      }
      setPillStyle({
        opacity: 1,
        width: `${a.offsetWidth}px`,
        transform: `translate3d(${a.offsetLeft}px, 0, 0)`
      });
    };
    const id = requestAnimationFrame(place);
    window.addEventListener('resize', place, { passive: true });
    document.fonts?.ready?.then(place);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', place);
    };
  }, [activeSection, pathname, lang]);

  const isExternalTalk = /^https?:/.test(talkUrl);

  const logoClasses = [
    'logo-img',
    site.logoInv ? 'inv' : '',
    site.logoLight ? 'lt' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header id="header">
        <a className="skip" href={isHome ? '#about' : isAbout ? '#about-top' : '#folder-main'}>
          {t('skip')}
        </a>

        {/* Left: Clean Brand Identity */}
        <div className="brand">
          <Link className="logo" href="/" onClick={handleLogoClick}>
            {site.logo ? (
              <img
                className={logoClasses}
                src={site.logo}
                alt={tx(site.name)}
                width={132}
                height={site.logoH || 34}
                style={{ height: `${site.logoH || 34}px` }}
              />
            ) : null}
            <span translate="no">{tx(site.name)}</span>
          </Link>

          {editing && (
            <div className="logo-tools">
              {!site.logo ? (
                <button
                  type="button"
                  className="pill"
                  onClick={() => pickFile({ type: 'logo' }, false, 'image/*')}
                >
                  {t('logoAdd')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="pill"
                    aria-label={t('logoChange')}
                    title={t('logoChange')}
                    onClick={() => pickFile({ type: 'logo' }, false, 'image/*')}
                  >
                    ⟳
                  </button>
                  <select
                    aria-label="Logo size"
                    value={site.logoH || 34}
                    onChange={(e) =>
                      updateSiteField((s) => {
                        s.logoH = Number(e.target.value);
                        return s;
                      })
                    }
                  >
                    {LOGO_SIZES.map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={`pill ${site.logoInv ? 'on' : ''}`}
                    aria-label={t('logoInv')}
                    title={t('logoInv')}
                    onClick={() =>
                      updateSiteField((s) => {
                        s.logoInv = !s.logoInv;
                        return s;
                      })
                    }
                  >
                    ◐
                  </button>
                  <button
                    type="button"
                    className="pill"
                    aria-label={t('logoRm')}
                    title={t('logoRm')}
                    onClick={() =>
                      updateSiteField((s) => {
                        s.logo = '';
                        s.logoV = Date.now();
                        return s;
                      })
                    }
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Center: Uncluttered 5-Item Capsule Navigation */}
        <nav aria-label="Primary Navigation" ref={navRef} className="nav-pilled hdr-nav-capsule">
          <span className="nav-pill" aria-hidden="true" style={pillStyle} />
          {desktopNavItems.map((item) => {
            const active = isNavItemActive(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Compact Utility Group + Primary CTA */}
        <div className="ctl">
          <a
            className="pill cv-hdr-btn"
            href={cvHref}
            download={cvDownloadName}
            title={t('downloadCv')}
            aria-label={t('downloadCv')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />
            </svg>
            <span>CV</span>
          </a>

          <div className="hdr-toggles">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <Link className="pill solid hire-btn" href="/start-project">
            <span>{lang === 'ar' ? 'تواصل معي' : "Let's Talk"}</span>
          </Link>

          <button
            type="button"
            className="burger"
            aria-label={t('menu')}
            aria-expanded={menuOpen}
            aria-controls="mnav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <div id="mnav" className="mnav" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile Navigation">
          {mobileNavItems.map((item, i) => {
            const active = isNavItemActive(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`ml ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                style={{ '--i': i }}
                onClick={(e) => handleNavClick(e, item)}
              >
                <small>{String(i + 1).padStart(2, '0')}</small>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mnav-extra-actions">
          <a
            className="btn ghost mcv-btn"
            href={cvHref}
            download={cvDownloadName}
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />
            </svg>
            <span>{t('downloadCv')}</span>
          </a>
          <a
            className="btn primary mcta"
            href={talkUrl}
            target={isExternalTalk ? '_blank' : undefined}
            rel={isExternalTalk ? 'noopener noreferrer' : undefined}
            style={{ '--i': mobileNavItems.length }}
            onClick={() => setMenuOpen(false)}
          >
            {t('letsTalk')}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          {canEdit && (
            <button
              type="button"
              className="mnav-edit-toggle"
              onClick={() => {
                setEditing((prev) => !prev);
                setMenuOpen(false);
              }}
            >
              <span>{editing ? '✕ ' + t('done') : '⚙ ' + t('edit')}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
