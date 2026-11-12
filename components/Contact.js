'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { EditableText, NetworkSvg, SocialLinksList } from './SharedUI';
import KineticName from './KineticName';

export default function Contact() {
  const { site, t, lang, editing, updateSiteField, waLink } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Cairo'
      }).format(new Date());
    setClock(fmt());

    let inView = true;
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
    if (sectionRef.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
          if (inView) startClock();
          else stopClock();
        },
        { threshold: 0.05 }
      );
      io.observe(sectionRef.current);
    } else {
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
  const hasWa = socials.some((x) => x.id === 'whatsapp');
  const href = waLink();

  const emailEntry = socials.find((x) => x.id === 'email' && x.value && x.value.trim());
  const emailHref = emailEntry ? socHref('email', emailEntry.value) : '';

  const phoneEntry = socials.find((x) => x.id === 'phone' && x.value && x.value.trim());
  const phoneHref = phoneEntry ? socHref('phone', phoneEntry.value) : '';

  const copyTarget = emailEntry || phoneEntry;

  const copyContact = async () => {
    if (!copyTarget) return;
    try {
      await navigator.clipboard.writeText(copyTarget.value.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = emailHref || phoneHref;
    }
  };

  const handleEditWa = () => {
    const idx = socials.findIndex((x) => x.id === 'whatsapp');
    if (idx < 0) return;
    const cur = socials[idx].value || '';
    const v = window.prompt(t('socPrompt').replace('{name}', 'WhatsApp'), cur);
    if (v !== null) {
      updateSiteField((st) => {
        st.socials[idx].value = v.trim();
        return st;
      });
    }
  };

  const cvHref = (typeof site.cv === 'string' ? site.cv : site.cv?.data) || '/cv.pdf';
  const cvDownloadName = site.cv?.name || 'Mohamed-Tarek-CV.pdf';

  return (
    <section className="thanks" id="contact" ref={sectionRef}>
      <div className="blob" aria-hidden="true" />
      <div className="blob b2" aria-hidden="true" />
      <div className="inner rv">
        {editing ? (
          <h2 className="big">{t('thanks')}</h2>
        ) : (
          <div className="contact-kinetic-wrap">
            <KineticName
              as="h2"
              text={t('thanks')}
              lang={lang}
              showRibbon={false}
              className="contact-kinetic-stage"
            />
          </div>
        )}

        <EditableText path="site.thanks" value={site.thanks} tag="p" />

        <div className="contact-actions">
          {hasWa &&
            (editing ? (
              <button
                type="button"
                className="wacta"
                aria-label="WhatsApp"
                onClick={handleEditWa}
              >
                <NetworkSvg id="whatsapp" />
                <span>{t('waCta')}</span>
              </button>
            ) : href ? (
              <a
                className="wacta"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('waCta')}
              >
                <NetworkSvg id="whatsapp" />
                <span>{t('waCta')}</span>
              </a>
            ) : null)}

          <a
            className="btn ghost contact-cv-btn"
            href={cvHref}
            download={cvDownloadName}
            aria-label={t('downloadCv')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />
            </svg>
            <span>{t('downloadCv')}</span>
          </a>

          {!editing && phoneHref && (
            <a className="btn ghost contact-direct-btn" href={phoneHref} aria-label={t('callMe')}>
              <NetworkSvg id="phone" />
              <span dir="ltr">{phoneEntry.value}</span>
            </a>
          )}

          {!editing && emailHref && (
            <a className="btn ghost contact-direct-btn" href={emailHref} aria-label="Email">
              <NetworkSvg id="email" />
              <span dir="ltr">{emailEntry.value}</span>
            </a>
          )}

          {!editing && copyTarget && (
            <button
              type="button"
              className={`btn ghost copy-email-btn ${copied ? 'copied' : ''}`.trim()}
              onClick={copyContact}
              aria-live="polite"
            >
              <span>
                {copied
                  ? lang === 'ar'
                    ? 'تم النسخ ✓'
                    : 'Copied ✓'
                  : emailEntry
                  ? lang === 'ar'
                    ? 'انسخ الإيميل'
                    : 'Copy email'
                  : lang === 'ar'
                  ? 'انسخ الرقم'
                  : 'Copy number'}
              </span>
            </button>
          )}
        </div>

        <p className="local-clock" aria-label="Local time">
          <i aria-hidden="true" />
          <span dir="ltr">{clock}</span>
          <small>{lang === 'ar' ? 'الوقت المحلي — القاهرة' : 'Local time — Cairo'}</small>
        </p>

        <p className="follow">{t('follow')}</p>
        <SocialLinksList skip={['whatsapp']} />
      </div>
    </section>
  );
}
