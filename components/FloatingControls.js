'use client';

import React, { useEffect, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { PROJECT_COLORS } from '@/data/projects';
import { NetworkSvg } from './SharedUI';

export default function FloatingControls() {
  const {
    site,
    projects,
    lang,
    tx,
    t,
    canEdit,
    editing,
    setEditing,
    updateSiteField,
    updateProjects,
    waLink,
    resetPortfolio,
    exportPortfolioJson
  } = usePortfolio();

  const [showTop, setShowTop] = useState(false);
  const [flyTop, setFlyTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (canEdit && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === '1' || params.get('edit') === 'true') {
        setEditing(true);
      }
    }

    const handleKey = (e) => {
      if (!canEdit) return;
      if ((e.altKey && e.key.toLowerCase() === 'e') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        setEditing((prev) => !prev);
      }
    };
    if (canEdit) {
      window.addEventListener('keydown', handleKey);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, [canEdit, setEditing]);

  const hasWa = (site.socials || []).some((x) => x.id === 'whatsapp');
  const showWaFloat = site.waFloat !== false && hasWa;
  const href = waLink();

  const handleAddProject = () => {
    const nextIdx = projects.length;
    const newId = `project-${Date.now()}`;
    updateProjects((list) => {
      list.push({
        id: newId,
        slug: newId,
        folderId: 'social-media-campaigns',
        type: 'social',
        sub: '',
        color: PROJECT_COLORS[nextIdx % PROJECT_COLORS.length],
        title: { en: 'New project', ar: 'مشروع جديد' },
        cat: { en: 'Social Media Campaign', ar: 'حملة سوشيال ميديا' },
        goal: {
          en: 'Describe the goal of the project.',
          ar: 'اكتب هدف المشروع.'
        },
        decision: {
          en: 'Describe your design decisions.',
          ar: 'اكتب قرارات التصميم.'
        },
        align: 'start',
        cols: 3,
        ratio: 'auto',
        meta: [],
        thumbnail: '',
        images: [1, 2, 3, 4, 5, 6].map(() => ({
          type: 'img',
          src: '',
          cs: 1,
          ratio: 'inherit',
          fit: 'cover'
        }))
      });
      return list;
    });
    setTimeout(() => {
      const el = document.getElementById(`p-${newId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleWaEdit = () => {
    const idx = (site.socials || []).findIndex((x) => x.id === 'whatsapp');
    if (idx < 0) return;
    const v = window.prompt(
      t('socPrompt').replace('{name}', 'WhatsApp'),
      site.socials[idx].value || ''
    );
    if (v !== null) {
      updateSiteField((st) => {
        st.socials[idx].value = v.trim();
        return st;
      });
    }
  };

  const handleWaMsgEdit = () => {
    const v = window.prompt(t('waMsgPrompt'), tx(site.waMsg));
    if (v !== null) {
      updateSiteField((st) => {
        st.waMsg[lang] = v;
        return st;
      });
    }
  };

  return (
    <>
      {/* Bottom Portfolio Editor Toolbar */}
      {canEdit && (
        <div id="toolbar">
          <div className="bar">
            {editing ? (
              <>
                <button type="button" className="pill" onClick={handleAddProject}>
                  {t('addProject')}
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() =>
                    updateSiteField((st) => {
                      st.waFloat = st.waFloat === false;
                      return st;
                    })
                  }
                >
                  {site.waFloat === false ? t('waOff') : t('waOn')}
                </button>
                <button type="button" className="pill" onClick={handleWaMsgEdit}>
                  {t('waMsgBtn')}
                </button>
                <button type="button" className="pill" onClick={exportPortfolioJson}>
                  {t('saveJson')}
                </button>
                <button type="button" className="pill" onClick={resetPortfolio}>
                  {t('reset')}
                </button>
                <button
                  type="button"
                  className="pill solid"
                  onClick={() => setEditing(false)}
                >
                  {t('done')}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="pill solid"
                onClick={() => setEditing(true)}
              >
                {t('edit')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div id="wa">
        {showWaFloat &&
          (editing ? (
            <button
              type="button"
              className="wa"
              aria-label="WhatsApp"
              onClick={handleWaEdit}
            >
              <NetworkSvg id="whatsapp" />
              <span className="tip">{t('waTip')}</span>
            </button>
          ) : href ? (
            <a
              className="wa"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <NetworkSvg id="whatsapp" />
              <span className="tip">{t('waTip')}</span>
            </a>
          ) : (
            <span className="wa off" aria-label="WhatsApp">
              <NetworkSvg id="whatsapp" />
              <span className="tip">{t('waTip')}</span>
            </span>
          ))}
      </div>

      {/* Back to Top Button */}
      <div id="up">
        <a
          className={`totop ${showTop ? 'show' : ''} ${flyTop ? 'fly' : ''}`.trim()}
          href="#top"
          aria-label={t('top')}
          title={t('top')}
          onClick={(e) => {
            e.preventDefault();
            setFlyTop(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setFlyTop(false), 850);
          }}
        >
          <span className="arw">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}
