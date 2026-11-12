'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  Folder,
  FolderOpen,
  Grid,
  LayoutTemplate,
  Columns,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import ProjectGallery from './ProjectGallery';

export default function ProjectFolderView({
  slug,
  onClose,
  isStandalonePage = false
}) {
  const { projects, categories, tx, t, lang } = usePortfolio();
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [activeProjPos, setActiveProjPos] = useState(0);
  const listWrapRef = useRef(null);

  useEffect(() => {
    setSelectedProjectId('all');
    setActiveProjPos(0);
    if (isStandalonePage && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [slug, isStandalonePage]);

  // Determine whether slug matches a Category Folder or an Individual Project
  const matchedCategory = categories.find((c) => c.slug === slug || c.id === slug);
  const matchedSingleProjectIndex = projects.findIndex((p) => p.slug === slug || p.id === slug);
  const matchedSingleProject =
    matchedSingleProjectIndex > -1 ? projects[matchedSingleProjectIndex] : null;

  let folderTitle = '';
  let folderBadge = '';
  let folderDesc = '';
  let folderColor = '#7C3AED';
  let folderDeliverables = [];
  let folderProjects = [];
  let parentCategory = null;

  if (matchedCategory) {
    folderTitle = tx(matchedCategory.title);
    folderBadge = tx(matchedCategory.badge);
    folderDesc = tx(matchedCategory.description);
    folderColor = matchedCategory.color || '#7C3AED';
    folderDeliverables =
      (matchedCategory.deliverables &&
        (matchedCategory.deliverables[lang] || matchedCategory.deliverables.en)) ||
      [];
    folderProjects = projects
      .map((proj, originalIndex) => ({ proj, originalIndex }))
      .filter(({ proj }) => proj.folderId === matchedCategory.id);
  } else if (matchedSingleProject) {
    parentCategory = categories.find((c) => c.id === matchedSingleProject.folderId) || categories[0];
    folderTitle = tx(matchedSingleProject.title);
    folderBadge = tx(matchedSingleProject.cat);
    folderDesc = tx(matchedSingleProject.goal);
    folderColor = matchedSingleProject.color || '#7C3AED';
    folderProjects = [{ proj: matchedSingleProject, originalIndex: matchedSingleProjectIndex }];
  }

  // Active categories that contain projects (for sequential navigation)
  const populatedCategories = categories.filter((c) =>
    projects.some((p) => p.folderId === c.id)
  );

  // Compute Next Folder for smooth sequential exploration
  let nextFolder = null;
  if (matchedCategory && populatedCategories.length > 0) {
    const cIdx = populatedCategories.findIndex((c) => c.id === matchedCategory.id);
    nextFolder =
      cIdx > -1
        ? populatedCategories[(cIdx + 1) % populatedCategories.length]
        : populatedCategories[0];
  } else if (matchedSingleProject && projects.length > 0) {
    const nextIdx = (matchedSingleProjectIndex + 1) % projects.length;
    nextFolder = projects[nextIdx];
  }

  const displayedProjects =
    selectedProjectId === 'all'
      ? folderProjects
      : folderProjects.filter(({ proj }) => proj.id === selectedProjectId);

  const totalArtworks = folderProjects.reduce(
    (acc, { proj }) =>
      acc +
      (proj.images || []).filter((x) => (x.type === 'img' && x.src) || x.type === 'video').length,
    0
  );

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // GSAP ScrollTrigger + IntersectionObserver fallback to switch the sticky outlined project number
  useEffect(() => {
    const container = listWrapRef.current;
    if (!container || typeof window === 'undefined') return;
    const articles = Array.from(container.querySelectorAll('.folder-project-item'));
    if (!articles.length) return;

    let triggers = [];
    let io = null;

    try {
      gsap.registerPlugin(ScrollTrigger);
      triggers = articles.map((el, idx) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 48%',
          end: 'bottom 48%',
          onEnter: () => setActiveProjPos(idx),
          onEnterBack: () => setActiveProjPos(idx)
        })
      );
    } catch {
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const idx = articles.indexOf(entry.target);
                if (idx > -1) setActiveProjPos(idx);
              }
            });
          },
          { rootMargin: '-35% 0px -45% 0px', threshold: 0.05 }
        );
        articles.forEach((el) => io.observe(el));
      }
    }

    return () => {
      triggers.forEach((tr) => tr.kill());
      if (io) io.disconnect();
    };
  }, [displayedProjects.length, selectedProjectId, slug]);

  const safeFolderVtId = String(
    (matchedCategory && matchedCategory.id) ||
      (matchedSingleProject && matchedSingleProject.id) ||
      slug
  ).replace(/[^a-zA-Z0-9_-]/g, '-');
  const folderVtName = `proj-media-${safeFolderVtId}`;
  const activeEntry = displayedProjects[activeProjPos] || displayedProjects[0];
  const activeColor = (activeEntry && activeEntry.proj?.color) || folderColor;
  const activeNumStr = String(activeProjPos + 1).padStart(2, '0');

  return (
    <div
      className="folder-view-container"
      id="folder-main"
      style={{ '--fc': folderColor, '--pc': activeColor }}
    >
      <div className="cs-hero-ambient" aria-hidden="true">
        <span className="cs-amb-orb cs-amb-1" />
        <span className="cs-amb-orb cs-amb-2" />
      </div>
      {/* Sticky Navigation Bar inside Opened Folder */}
      <div className="folder-sticky-bar">
        <div className="wrap folder-sticky-inner">
          <div className="folder-nav-left">
            {onClose && !isStandalonePage ? (
              <button
                type="button"
                className="folder-back-btn"
                onClick={() => onClose()}
              >
                <BackIcon size={18} />
                <span>{t('backToFolders')}</span>
              </button>
            ) : (
              <Link href="/#work" className="folder-back-btn">
                <BackIcon size={18} />
                <span>{t('backToFolders')}</span>
              </Link>
            )}

            <nav className="folder-breadcrumbs" aria-label="Breadcrumb">
              {isStandalonePage ? (
                <Link href="/#work" className="bc-link">
                  {t('selected')}
                </Link>
              ) : (
                <button
                  type="button"
                  className="bc-link-btn"
                  onClick={() => onClose && onClose()}
                >
                  {t('selected')}
                </button>
              )}
              <span className="bc-sep">/</span>
              {parentCategory && (
                <>
                  {isStandalonePage ? (
                    <Link href={`/projects/${parentCategory.slug}`} className="bc-link">
                      {tx(parentCategory.shortTitle || parentCategory.title)}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="bc-link-btn"
                      onClick={() => onClose && onClose(parentCategory.slug)}
                    >
                      {tx(parentCategory.shortTitle || parentCategory.title)}
                    </button>
                  )}
                  <span className="bc-sep">/</span>
                </>
              )}
              <strong className="bc-current">{folderTitle}</strong>
            </nav>
          </div>

          <div className="folder-nav-right">
            {/* Gallery Layout Mode Switcher */}
            <div className="layout-switcher" role="group" aria-label="Gallery layout">
              <button
                type="button"
                className={`layout-btn ${layoutMode === 'grid' ? 'on' : ''}`}
                title={t('layoutGrid')}
                onClick={() => setLayoutMode('grid')}
              >
                <Grid size={16} />
                <span>{t('layoutGrid')}</span>
              </button>
              <button
                type="button"
                className={`layout-btn ${layoutMode === 'featured' ? 'on' : ''}`}
                title={t('layoutFeatured')}
                onClick={() => setLayoutMode('featured')}
              >
                <LayoutTemplate size={16} />
                <span>{t('layoutFeatured')}</span>
              </button>
              <button
                type="button"
                className={`layout-btn ${layoutMode === 'masonry' ? 'on' : ''}`}
                title={t('layoutMasonry')}
                onClick={() => setLayoutMode('masonry')}
              >
                <Columns size={16} />
                <span>{t('layoutMasonry')}</span>
              </button>
            </div>

            {!isStandalonePage && (
              <Link
                href={`/projects/${slug}`}
                className="pill folder-page-btn"
                title={t('openDedicatedPage')}
              >
                <ExternalLink size={14} />
                <span>{t('openDedicatedPage')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Folder Hero Header */}
      <header className="folder-hero wrap" style={{ viewTransitionName: folderVtName }}>
        <div className="folder-hero-badge">
          <FolderOpen size={18} />
          <span>{folderBadge}</span>
        </div>

        <div className="folder-hero-main">
          <div>
            <h1 className="folder-hero-title">{folderTitle}</h1>
            <p className="folder-hero-desc">{folderDesc}</p>
          </div>

          <div className="folder-hero-stats">
            <div className="fh-stat">
              <b>{String(folderProjects.length).padStart(2, '0')}</b>
              <span>{t('projectFolders')}</span>
            </div>
            <div className="fh-stat">
              <b>{String(totalArtworks).padStart(2, '0')}</b>
              <span>{t('designs')}</span>
            </div>
          </div>
        </div>

        {folderDeliverables.length > 0 && (
          <div className="folder-deliverables">
            {folderDeliverables.map((item, idx) => (
              <span key={idx} className="deliv-chip">
                ✦ {item}
              </span>
            ))}
          </div>
        )}

        {/* Sub-Project Filter Tabs inside Category Folder so multi-image projects never get mixed up */}
        {folderProjects.length > 1 && (
          <div className="folder-project-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={selectedProjectId === 'all'}
              className={`fchip ${selectedProjectId === 'all' ? 'on' : ''}`}
              onClick={() => setSelectedProjectId('all')}
            >
              {t('allInFolder')}
              <sup>{folderProjects.length}</sup>
            </button>
            {folderProjects.map(({ proj }, idx) => {
              const imgCount = (proj.images || []).filter((x) => x.type === 'img' && x.src).length;
              return (
                <button
                  key={proj.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedProjectId === proj.id}
                  className={`fchip ${selectedProjectId === proj.id ? 'on' : ''}`}
                  onClick={() => setSelectedProjectId(proj.id)}
                >
                  {String(idx + 1).padStart(2, '0')} · {tx(proj.title)}
                  {imgCount > 0 && <sup>{imgCount}</sup>}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Folder Projects Content with Sticky Outlined Project Numeral Rail */}
      <div className="wrap cs-sticky-layout" ref={listWrapRef}>
        {displayedProjects.length > 0 && (
          <aside className="cs-sticky-num-rail" aria-hidden="true">
            <div className="cs-sticky-num-box">
              <span className="cs-giant-num" key={activeNumStr} data-num={activeNumStr}>
                {activeNumStr}
              </span>
              <small className="cs-giant-sub">
                {activeNumStr} / {String(displayedProjects.length).padStart(2, '0')}
              </small>
            </div>
          </aside>
        )}

        <div className="cs-main-col folder-projects-list">
          {displayedProjects.length > 0 ? (
            displayedProjects.map(({ proj, originalIndex }, pos) => (
              <ProjectGallery
                key={proj.id || originalIndex}
                project={proj}
                projectIndex={originalIndex}
                displayPos={pos}
                totalInView={displayedProjects.length}
                layoutMode={layoutMode}
                showProjectLink={!matchedSingleProject}
              />
            ))
          ) : (
            <div className="pempty">
              <p>{t('filterEmpty')}</p>
              <p style={{ fontSize: '15px', marginTop: '8px' }}>{t('emptyFolderNote')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Folder Switcher + Next Folder Footer Navigation */}
      <div className="wrap folder-footer-nav">
        {populatedCategories.length > 1 && (
          <div className="folder-switcher-strip">
            {populatedCategories.map((cat) => {
              const isCurrent = matchedCategory && matchedCategory.id === cat.id;
              const count = projects.filter((p) => p.folderId === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/projects/${cat.slug}`}
                  className={`fchip ${isCurrent ? 'on' : ''}`}
                >
                  <Folder size={14} style={{ marginInlineEnd: '6px', verticalAlign: '-2px' }} />
                  {tx(cat.shortTitle || cat.title)}
                  <sup>{count}</sup>
                </Link>
              );
            })}
          </div>
        )}

        {nextFolder && (
          isStandalonePage ? (
            <Link className="nextp" href={`/projects/${nextFolder.slug}`}>
              <span>
                <small>{matchedCategory ? t('openFolder') : t('nextProject')}</small>
                <b>{tx(nextFolder.title)}</b>
              </span>
              <span className="nx">
                <NextIcon size={24} />
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className="nextp nextp-btn"
              onClick={() => {
                if (onClose) onClose(nextFolder.slug);
              }}
            >
              <span>
                <small>{t('openFolder')}</small>
                <b>{tx(nextFolder.title)}</b>
              </span>
              <span className="nx">
                <NextIcon size={24} />
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
