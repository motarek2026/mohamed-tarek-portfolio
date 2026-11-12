'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { usePortfolio, socHref } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords, NetworkSvg } from './SharedUI';

function isValidHttpUrl(str) {
  try {
    const u = new URL(str);
    return (
      (u.protocol === 'http:' || u.protocol === 'https:') &&
      Boolean(u.hostname) &&
      u.hostname.includes('.')
    );
  } catch (e) {
    return false;
  }
}

export default function BriefForm({ isStandalonePage = false }) {
  const {
    site,
    lang,
    tx,
    t,
    editing,
    waBase,
    selectedPkgIndex,
    setSelectedPkgIndex,
    preselectedService,
    setPreselectedService
  } = usePortfolio();

  const [clockStr, setClockStr] = useState('--:--');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [details, setDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [preparedInquiry, setPreparedInquiry] = useState(null);
  const [copied, setCopied] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const companyRef = useRef(null);
  const servicesGroupRef = useRef(null);
  const budgetRef = useRef(null);
  const refsRef = useRef(null);
  const detailsRef = useRef(null);
  const handoffRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat(
          lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB',
          {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: site.tz || 'Africa/Cairo'
          }
        ).format(new Date());
        setClockStr(formatted);
      } catch (e) {}
    };
    updateClock();
    const timer = setInterval(updateClock, 20000);
    return () => clearInterval(timer);
  }, [lang, site.tz]);

  // Preselect service from PortfolioContext
  useEffect(() => {
    if (preselectedService) {
      setSelectedServices((prev) =>
        prev.includes(preselectedService) ? prev : [...prev, preselectedService]
      );
      setErrors((prev) => ({ ...prev, services: undefined }));
      setPreselectedService(null);
    }
  }, [preselectedService, setPreselectedService]);

  // Preselect service or package from URL query params (?service=... & ?package=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const svcParam = sp.get('service');
    const pkgParam = sp.get('package');

    if (svcParam) {
      const matchedSvc = (site.services || []).find(
        (s) =>
          s.icon === svcParam.toLowerCase() ||
          s.title?.en?.toLowerCase() === svcParam.toLowerCase() ||
          s.title?.ar === svcParam
      );
      const labelToSelect = matchedSvc ? tx(matchedSvc.title) : svcParam;
      if (labelToSelect) {
        setSelectedServices((prev) =>
          prev.includes(labelToSelect) ? prev : [...prev, labelToSelect]
        );
      }
    }

    if (pkgParam !== null && pkgParam !== '') {
      const idxNum = Number(pkgParam);
      if (!Number.isNaN(idxNum) && idxNum >= 0 && idxNum < (site.packages || []).length) {
        setSelectedPkgIndex(idxNum);
      } else {
        const matchedIdx = (site.packages || []).findIndex(
          (p) =>
            p.name?.en?.toLowerCase() === pkgParam.toLowerCase() ||
            p.name?.ar === pkgParam
        );
        if (matchedIdx > -1) {
          setSelectedPkgIndex(matchedIdx);
        }
      }
    }
  }, [site.services, site.packages, tx, setSelectedPkgIndex]);

  const serviceOptions = (site.services || [])
    .map((s) => tx(s.title))
    .filter(Boolean)
    .concat([t('other')]);

  const packages = site.packages || [];
  const timelines = ['whenAsap', 'when2', 'when4', 'whenFlex'];

  const phoneSocial = (site.socials || []).find((s) => s.id === 'phone' && s.value?.trim());
  const phoneHref = phoneSocial ? socHref('phone', phoneSocial.value) : '';

  const emailSocial = (site.socials || []).find(
    (s) => s.id === 'email' && s.value?.trim() && !/your@email\.com/i.test(s.value)
  );
  const verifiedEmailHref = emailSocial ? socHref('email', emailSocial.value) : '';

  const toggleService = (svcName) => {
    setSelectedServices((prev) => {
      const next = prev.includes(svcName)
        ? prev.filter((s) => s !== svcName)
        : [...prev, svcName];
      if (next.length > 0) {
        setErrors((e) => ({ ...e, services: undefined }));
      }
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    const trimmedDetails = details.trim();
    const trimmedBudget = budget.trim();
    const trimmedRefs = referenceLinks.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = t('errNameReq');
    } else if (trimmedName.length > 120) {
      nextErrors.name = t('errNameMax');
    }

    if (!trimmedEmail) {
      nextErrors.email = t('errEmailReq');
    } else if (
      trimmedEmail.length > 160 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)
    ) {
      nextErrors.email = t('errEmailInvalid');
    }

    if (trimmedCompany.length > 120) {
      nextErrors.company = t('errCompanyMax');
    }

    const hasValidPackage =
      selectedPkgIndex !== null &&
      selectedPkgIndex >= 0 &&
      Boolean(packages[selectedPkgIndex]);

    if (selectedServices.length === 0 && !hasValidPackage) {
      nextErrors.services = t('errServiceReq');
    }

    if (trimmedBudget.length > 120) {
      nextErrors.budget = t('errBudgetMax');
    }

    if (trimmedRefs) {
      const parts = trimmedRefs
        .split(/[\s,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const anyInvalid = parts.some((u) => !isValidHttpUrl(u));
      if (anyInvalid) {
        nextErrors.referenceLinks = t('errRefsInvalid');
      }
    }

    if (trimmedDetails.length < 10) {
      nextErrors.details = t('errDetailsReq');
    } else if (trimmedDetails.length > 2500) {
      nextErrors.details = t('errDetailsMax');
    }

    return nextErrors;
  };

  const focusFirstError = (errMap) => {
    if (errMap.name && nameRef.current) {
      nameRef.current.focus();
    } else if (errMap.email && emailRef.current) {
      emailRef.current.focus();
    } else if (errMap.company && companyRef.current) {
      companyRef.current.focus();
    } else if (errMap.services && servicesGroupRef.current) {
      const firstInput = servicesGroupRef.current.querySelector('input');
      if (firstInput) firstInput.focus();
    } else if (errMap.budget && budgetRef.current) {
      budgetRef.current.focus();
    } else if (errMap.referenceLinks && refsRef.current) {
      refsRef.current.focus();
    } else if (errMap.details && detailsRef.current) {
      detailsRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setShake(false);
      requestAnimationFrame(() => setShake(true));
      focusFirstError(validationErrors);
      return;
    }

    const base = waBase();
    const pkgValue =
      selectedPkgIndex !== null &&
      selectedPkgIndex >= 0 &&
      packages[selectedPkgIndex]
        ? tx(packages[selectedPkgIndex].name)
        : '';

    const prefLabel =
      preferredContact === 'email'
        ? t('prefEmail')
        : preferredContact === 'phone'
        ? t('prefPhone')
        : t('prefWhatsapp');

    const who = tx(site.name).split(' ')[0];
    const lines = [];
    lines.push(`${t('bHello').replace('{who}', who)} ${t('bIm').replace('{name}', name.trim())}`);
    lines.push(t('bEmail').replace('{x}', email.trim()));
    if (company.trim()) {
      lines.push(t('bCompany').replace('{x}', company.trim()));
    }
    if (pkgValue) {
      lines.push(t('bPkg').replace('{x}', pkgValue));
    }
    if (selectedServices.length > 0) {
      lines.push(
        t('bNeed').replace('{list}', selectedServices.join(lang === 'ar' ? '، ' : ', '))
      );
    }
    if (timeline) {
      lines.push(t('bWhen').replace('{x}', timeline));
    }
    if (budget.trim()) {
      lines.push(t('bBudget').replace('{x}', budget.trim()));
    }
    if (referenceLinks.trim()) {
      lines.push(t('bRefs').replace('{x}', referenceLinks.trim()));
    }
    lines.push(t('bPref').replace('{x}', prefLabel));
    lines.push(t('bDet').replace('{text}', details.trim()));

    const formattedText = lines.join('\n');
    const waUrl = base ? `${base}?text=${encodeURIComponent(formattedText)}` : '';
    const mailtoUrl = verifiedEmailHref
      ? `${verifiedEmailHref}?subject=${encodeURIComponent(
          `Project Inquiry — ${name.trim()}`
        )}&body=${encodeURIComponent(formattedText)}`
      : '';

    setPreparedInquiry({
      text: formattedText,
      waUrl,
      mailtoUrl
    });

    // Send lead to Dashboard mini-CRM in background (non-blocking)
    try {
      const dashboardUrl =
        process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';
      fetch(`${dashboardUrl.replace(/\/$/, '')}/api/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: preferredContact === 'email' ? email.trim() : phoneSocial?.value || email.trim(),
          email: email.trim(),
          company: company.trim(),
          preferred_contact: preferredContact,
          services: selectedServices,
          package_name: pkgValue,
          timeline,
          budget: budget.trim(),
          message: details.trim(),
          reference_links: referenceLinks
            ? referenceLinks
                .split(/[\s,\n]+/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          source_path:
            typeof window !== 'undefined'
              ? window.location.pathname + window.location.search
              : '/start-project',
          lang,
          _hp_website: honeypot
        })
      }).catch(() => {});
    } catch (e) {}

    setTimeout(() => {
      if (handoffRef.current) {
        handoffRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        handoffRef.current.focus();
      }
    }, 80);
  };

  const handleCopyBrief = async () => {
    if (!preparedInquiry?.text) return;
    try {
      await navigator.clipboard.writeText(preparedInquiry.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  return (
    <section className="brief wrap" id="brief">
      <div className="brief-grid">
        <div className="brief-l rv">
          <h2 className="big">
            {editing ? t('briefTitle') : <AnimatedWords text={t('briefTitle')} />}
          </h2>
          <p className="brief-s">{t('briefSub')}</p>

          <div className="bnext">
            <b>{t('nextTitle')}</b>
            <ol>
              <li>{t('n1')}</li>
              <li>{t('n2')}</li>
              <li>{t('n3')}</li>
            </ol>
          </div>

          <div className="lt">
            <span className="lt-dot" />
            <span>
              {t('cairoTime')}: <strong>{clockStr}</strong>
            </span>
          </div>

          <div className="brief-side-actions">
            {!isStandalonePage && (
              <Link className="pill folder-page-btn" href="/start-project">
                <span>{t('openStartProjectPage')}</span>
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>

        <div className="brief-r-wrap">
          {preparedInquiry ? (
            /* Honest, Transparent Prepared Inquiry Handoff Panel */
            <div
              id="inquiry-handoff"
              ref={handoffRef}
              tabIndex={-1}
              role="region"
              aria-live="polite"
              aria-label={t('handoffTitle')}
              className="bform inq-handoff-card"
            >
              <div className="inq-handoff-head">
                <span className="inq-handoff-icon" aria-hidden="true">
                  <CheckCircle2 size={24} />
                </span>
                <div>
                  <h3 className="inq-handoff-title">{t('handoffTitle')}</h3>
                  <p className="inq-handoff-desc">{t('handoffExplanation')}</p>
                </div>
              </div>

              <pre className="inq-handoff-preview">{preparedInquiry.text}</pre>

              <div className="inq-handoff-actions">
                {preparedInquiry.waUrl && (
                  <a
                    href={preparedInquiry.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn primary inq-wa-send-btn"
                  >
                    <NetworkSvg id="whatsapp" />
                    <span>{t('sendPreparedWaBtn')}</span>
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                )}

                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleCopyBrief}
                >
                  <Copy size={16} aria-hidden="true" />
                  <span aria-live="polite">{copied ? t('copiedBriefMsg') : t('copyBriefBtn')}</span>
                </button>

                {preparedInquiry.mailtoUrl && (
                  <a href={preparedInquiry.mailtoUrl} className="btn ghost">
                    <NetworkSvg id="email" />
                    <span>{t('prefEmail')}</span>
                  </a>
                )}

                <button
                  type="button"
                  className="pill inq-edit-btn"
                  onClick={() => setPreparedInquiry(null)}
                >
                  <Edit3 size={14} aria-hidden="true" />
                  <span>{t('editInquiryBtn')}</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              className={`bform rv ${shake ? 'shake' : ''}`.trim()}
              noValidate
              style={{ '--d': '.12s' }}
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="_hp_website"
                tabIndex="-1"
                autoComplete="off"
                style={{ display: 'none' }}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
              {/* Section 01: Contact Information */}
              <div className="inq-step-block">
                <span className="inq-step-label">{t('stepContactInfo')}</span>

                <div className="inq-two-cols">
                  <div className="bf">
                    <label htmlFor="inq-name" className="inq-label-row">
                      <span>{t('fldName')}</span>
                      <small className="req-tag">{t('reqBadge')}</small>
                    </label>
                    <input
                      ref={nameRef}
                      id="inq-name"
                      name="name"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'inq-name-err' : undefined}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                    />
                    {errors.name && (
                      <span id="inq-name-err" className="field-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  <div className="bf">
                    <label htmlFor="inq-email" className="inq-label-row">
                      <span>{t('fldEmail')}</span>
                      <small className="req-tag">{t('reqBadge')}</small>
                    </label>
                    <input
                      ref={emailRef}
                      id="inq-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      spellCheck={false}
                      required
                      maxLength={160}
                      autoComplete="email"
                      dir="ltr"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'inq-email-err' : undefined}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                    />
                    {errors.email && (
                      <span id="inq-email-err" className="field-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="bf">
                  <label htmlFor="inq-company" className="inq-label-row">
                    <span>{String(t('fldCompany') || '').replace(/\s*\([^)]*\)\s*/g, '')}</span>
                    <small className="opt-tag">{t('optBadge')}</small>
                  </label>
                  <input
                    ref={companyRef}
                    id="inq-company"
                    name="company"
                    type="text"
                    maxLength={120}
                    autoComplete="organization"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? 'inq-company-err' : undefined}
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
                    }}
                  />
                  {errors.company && (
                    <span id="inq-company-err" className="field-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errors.company}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Section 02: Service & Package Scope */}
              <div className="inq-step-block">
                <span className="inq-step-label">{t('stepServiceScope')}</span>

                {packages.length > 0 && (
                  <div className="bg">
                    <span className="bl inq-label-row">
                      <span>{t('fldPkg')}</span>
                      <small className="opt-tag">{t('optBadge')}</small>
                    </span>
                    <div className="bchips" role="radiogroup" aria-label={t('fldPkg')}>
                      {packages.map((x, i) => (
                        <label key={i} className="bchip">
                          <input
                            type="radio"
                            name="pkg"
                            checked={selectedPkgIndex === i}
                            onChange={() => {
                              setSelectedPkgIndex(i);
                              if (errors.services) {
                                setErrors((prev) => ({ ...prev, services: undefined }));
                              }
                            }}
                          />
                          <span>{tx(x.name)}</span>
                        </label>
                      ))}
                      <label className="bchip">
                        <input
                          type="radio"
                          name="pkg"
                          checked={selectedPkgIndex === -1}
                          onChange={() => setSelectedPkgIndex(-1)}
                        />
                        <span>{t('notSure')}</span>
                      </label>
                    </div>
                  </div>
                )}

                <div
                  className="bg"
                  ref={servicesGroupRef}
                  aria-invalid={!!errors.services}
                  aria-describedby={errors.services ? 'inq-services-err' : undefined}
                >
                  <span className="bl inq-label-row">
                    <span>{t('fldNeed')}</span>
                    <small className="req-tag">{t('reqBadge')}</small>
                  </span>
                  <div className="bchips" role="group" aria-label={t('fldNeed')}>
                    {serviceOptions.map((s) => (
                      <label key={s} className="bchip">
                        <input
                          type="checkbox"
                          name="svc"
                          checked={selectedServices.includes(s)}
                          onChange={() => toggleService(s)}
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                  {errors.services && (
                    <span id="inq-services-err" className="field-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errors.services}</span>
                    </span>
                  )}
                </div>

                <div className="bg">
                  <span className="bl inq-label-row">
                    <span>{t('fldWhen')}</span>
                    <small className="opt-tag">{t('optBadge')}</small>
                  </span>
                  <div className="bchips" role="radiogroup" aria-label={t('fldWhen')}>
                    {timelines.map((w) => {
                      const label = t(w);
                      return (
                        <label key={w} className="bchip">
                          <input
                            type="radio"
                            name="when"
                            checked={timeline === label}
                            onChange={() => setTimeline(label)}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bf">
                  <label htmlFor="inq-budget" className="inq-label-row">
                    <span>{t('fldBudget')}</span>
                    <small className="opt-tag">{t('optBadge')}</small>
                  </label>
                  <input
                    ref={budgetRef}
                    id="inq-budget"
                    name="budget"
                    type="text"
                    maxLength={120}
                    aria-invalid={!!errors.budget}
                    aria-describedby={errors.budget ? 'inq-budget-err' : undefined}
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      if (errors.budget) setErrors((prev) => ({ ...prev, budget: undefined }));
                    }}
                  />
                  {errors.budget && (
                    <span id="inq-budget-err" className="field-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errors.budget}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Section 03: Project Description, Reference Links & Preferred Contact */}
              <div className="inq-step-block">
                <span className="inq-step-label">{t('stepProjectDetails')}</span>

                <div className="bf">
                  <label htmlFor="inq-details" className="inq-label-row">
                    <span>{t('fldDetails')}</span>
                    <small className="req-tag">{t('reqBadge')}</small>
                  </label>
                  <textarea
                    ref={detailsRef}
                    id="inq-details"
                    name="details"
                    rows={4}
                    required
                    maxLength={2500}
                    aria-invalid={!!errors.details}
                    aria-describedby={errors.details ? 'inq-details-err' : undefined}
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                      if (errors.details) setErrors((prev) => ({ ...prev, details: undefined }));
                    }}
                  />
                  {errors.details && (
                    <span id="inq-details-err" className="field-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errors.details}</span>
                    </span>
                  )}
                </div>

                <div className="bf">
                  <label htmlFor="inq-refs" className="inq-label-row">
                    <span>{t('fldRefs')}</span>
                    <small className="opt-tag">{t('optBadge')}</small>
                  </label>
                  <input
                    ref={refsRef}
                    id="inq-refs"
                    name="referenceLinks"
                    type="url"
                    inputMode="url"
                    spellCheck={false}
                    autoComplete="off"
                    dir="ltr"
                    placeholder="https://figma.com/…"
                    aria-invalid={!!errors.referenceLinks}
                    aria-describedby={
                      errors.referenceLinks ? 'inq-refs-err' : 'inq-refs-hint'
                    }
                    value={referenceLinks}
                    onChange={(e) => {
                      setReferenceLinks(e.target.value);
                      if (errors.referenceLinks) {
                        setErrors((prev) => ({ ...prev, referenceLinks: undefined }));
                      }
                    }}
                  />
                  <small id="inq-refs-hint" className="field-hint">
                    {t('fldRefsHint')}
                  </small>
                  {errors.referenceLinks && (
                    <span id="inq-refs-err" className="field-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errors.referenceLinks}</span>
                    </span>
                  )}
                </div>

                <div className="bg">
                  <span className="bl inq-label-row">
                    <span>{t('fldPrefContact')}</span>
                  </span>
                  <div className="bchips" role="radiogroup" aria-label={t('fldPrefContact')}>
                    {[
                      { id: 'whatsapp', label: t('prefWhatsapp') },
                      { id: 'email', label: t('prefEmail') },
                      { id: 'phone', label: t('prefPhone') }
                    ].map((opt) => (
                      <label key={opt.id} className="bchip">
                        <input
                          type="radio"
                          name="preferredContact"
                          checked={preferredContact === opt.id}
                          onChange={() => setPreferredContact(opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn primary inq-submit-btn">
                <NetworkSvg id="whatsapp" />
                <span>{t('prepareBriefBtn')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
