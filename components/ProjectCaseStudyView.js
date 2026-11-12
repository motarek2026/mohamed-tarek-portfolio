'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Columns,
  FolderOpen,
  Grid,
  Layers,
  LayoutTemplate,
  Maximize2
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { PROJECT_COLORS } from '@/data/projects';
import { EditableText, NetworkSvg } from './SharedUI';
import ProjectGallery from './ProjectGallery';
import ProjectFolderCard from './ProjectFolderCard';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function ProjectCaseStudyView({ projectSlug, categorySlug }) {
  const {
    projects,
    categories,
    site,
    lang,
    tx,
    t,
    editing,
    updateProjects,
    openProjectLightbox,
    openVideoLightbox,
    waBase,
    waLink
  } = usePortfolio();

  const [layoutMode, setLayoutMode] = useState('grid');
  const router = useRouter();
  const heroVideoRef = useRef(null);
  const nextMediaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [projectSlug]);

  // Pause hero video when scrolled off-screen or when tab is hidden
  useEffect(() => {
    const vid = heroVideoRef.current;
    if (!vid || typeof window === 'undefined') return;
    let inView = true;

    const syncPlayback = () => {
      if (!inView || document.hidden) {
        vid.pause();
      } else {
        vid.play().catch(() => {});
      }
    };

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
          syncPlayback();
        },
        { threshold: 0.15 }
      );
      io.observe(vid);
    }

    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [projectSlug]);

  const projectIndex = projects.findIndex(
    (p) => p.slug === projectSlug || p.id === projectSlug
  );
  const project = projectIndex > -1 ? projects[projectIndex] : null;

  if (!project) {
    return (
      <div className="wrap" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1 className="big">Project Not Found</h1>
        <p style={{ marginTop: '16px' }}>
          <Link href="/#work" className="btn primary">
            {t('backToFolders')}
          </Link>
        </p>
      </div>
    );
  }

  const parentCategory =
    categories.find((c) => c.slug === categorySlug || c.id === project.folderId) ||
    categories[0];

  const projectColor = project.color || PROJECT_COLORS[projectIndex % PROJECT_COLORS.length];

  // Media items & Hero artwork
  const images = project.images || [];
  const validMediaSlots = images
    .map((it, slotIdx) => ({ it, slotIdx }))
    .filter(({ it }) => (it.type === 'img' && it.src) || it.type === 'video');

  const mediaCount = validMediaSlots.length;
  const heroSlot = validMediaSlots.length > 0 ? validMediaSlots[0] : null;

  // Goal & Decision checks (never show template placeholder copy in view mode)
  const rawGoal = String(tx(project.goal) || '').trim();
  const rawDecision = String(tx(project.decision) || '').trim();
  const isDecisionPlaceholder =
    !rawDecision ||
    /^add your design decisions here/i.test(rawDecision) ||
    /^أضف قرارات التصميم هنا/.test(rawDecision);

  const showGoal = editing || !!rawGoal;
  const showDecision = editing || !isDecisionPlaceholder;

  // Previous & Next Projects (wrapping across the portfolio)
  const totalProjects = projects.length;
  const prevIndex = (projectIndex - 1 + totalProjects) % totalProjects;
  const nextIndex = (projectIndex + 1) % totalProjects;
  const prevProject = totalProjects > 1 ? projects[prevIndex] : null;
  const nextProject = totalProjects > 1 ? projects[nextIndex] : null;

  // Related Projects from the same category (or other portfolio projects if single in category)
  const sameCategoryProjects = projects
    .map((proj, idx) => ({ proj, idx }))
    .filter(({ proj }) => proj.folderId === parentCategory.id && proj.id !== project.id);

  const relatedEntries =
    sameCategoryProjects.length > 0
      ? sameCategoryProjects
      : projects
          .map((proj, idx) => ({ proj, idx }))
          .filter(({ proj }) => proj.id !== project.id)
          .slice(0, 2);

  const relatedFolderCards = relatedEntries.map(({ proj, idx }) => {
    const validImgs = (proj.images || []).filter((x) => x.type === 'img' && x.src);
    return {
      id: proj.id,
      slug: `${proj.folderId || parentCategory.slug}/${proj.slug || proj.id}`,
      title: proj.title,
      subtitle: proj.goal,
      badge: proj.cat,
      cat: proj.cat,
      color: proj.color || PROJECT_COLORS[idx % PROJECT_COLORS.length],
      secondaryColor: PROJECT_COLORS[(idx + 1) % PROJECT_COLORS.length],
      projectCount: 1,
      artworkCount: validImgs.length,
      totalSlots: (proj.images || []).length,
      previewImages: validImgs.slice(0, 3).map((im) => ({
        src: im.src,
        alt: tx(im.alt) || tx(proj.title)
      })),
      subProjects: []
    };
  });

  // Project-specific WhatsApp link
  const baseWa = waBase();
  const projectTitleText = tx(project.title);
  const whoName = tx(site.name).split(' ')[0];
  const customWaMsg =
    lang === 'ar'
      ? `أهلاً ${whoName}، شفت مشروع "${projectTitleText}" في البورتفوليو وعايز أتكلم معاك عن مشروع مشابه.`
      : `Hello ${whoName}, I saw your "${projectTitleText}" project and I'd like to discuss a similar project.`;
  const projectWaHref = baseWa
    ? `${baseWa}?text=${encodeURIComponent(customWaMsg)}`
    : waLink();

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const safeVtId = String(project.id || project.slug).replace(/[^a-zA-Z0-9_-]/g, '-');
  const currentVtName = `proj-media-${safeVtId}`;
  const numStr = pad(projectIndex + 1);

  const nextProjectHref = nextProject
    ? `/projects/${nextProject.folderId || parentCategory.slug}/${nextProject.slug || nextProject.id}`
    : '/#work';
  const nextProjectCover = nextProject
    ? (nextProject.images || []).find((x) => x.type === 'img' && x.src)
    : null;
  const nextSafeVtId = nextProject
    ? String(nextProject.id || nextProject.slug).replace(/[^a-zA-Z0-9_-]/g, '-')
    : '';

  const handleNextProjectClick = (e) => {
    if (
      !nextProject ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targetVt = `proj-media-${nextSafeVtId}`;
    // Clear any related folder card sharing the same VT name so the banner media is the unique source
    document.querySelectorAll('.folder-pocket').forEach((node) => {
      if (node.style.viewTransitionName === targetVt) {
        node.style.viewTransitionName = '';
      }
    });
    if (nextMediaRef.current) {
      nextMediaRef.current.style.viewTransitionName = targetVt;
    }

    if (typeof document.startViewTransition === 'function') {
      e.preventDefault();
      try {
        document.startViewTransition(
          () =>
            new Promise((resolve) => {
              window.__mtResolveVT = resolve;
              router.push(nextProjectHref);
              setTimeout(resolve, 420);
            })
        );
      } catch {
        router.push(nextProjectHref);
      }
    } else {
      e.preventDefault();
      document.documentElement.classList.add('vt-fade-fallback');
      router.push(nextProjectHref);
    }
  };

  return (
    <div
      className="folder-view-container case-study-view"
      id="folder-main"
      style={{ '--fc': projectColor, '--pc': projectColor }}
    >
      {/* Multi-Layered Project-Color Ambient Glow */}
      <div className="cs-hero-ambient" aria-hidden="true">
        <span className="cs-amb-orb cs-amb-1" />
        <span className="cs-amb-orb cs-amb-2" />
      </div>
      {/* 1. Sticky Top Bar: Back to Category Folder + Breadcrumbs + Layout Switcher */}
      <div className="folder-sticky-bar">
        <div className="wrap folder-sticky-inner">
          <div className="folder-nav-left">
            <Link
              href={`/projects/${parentCategory.slug}`}
              className="folder-back-btn"
            >
              <BackIcon size={18} />
              <span>
                {t('backToCategory').replace(
                  '{cat}',
                  tx(parentCategory.shortTitle || parentCategory.title)
                )}
              </span>
            </Link>

            <nav className="folder-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/#work" className="bc-link">
                {t('selected')}
              </Link>
              <span className="bc-sep">/</span>
              <Link href={`/projects/${parentCategory.slug}`} className="bc-link">
                {tx(parentCategory.shortTitle || parentCategory.title)}
              </Link>
              <span className="bc-sep">/</span>
              <strong className="bc-current">{projectTitleText}</strong>
            </nav>
          </div>

          <div className="folder-nav-right">
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
          </div>
        </div>
      </div>

      {/* 2. Case Study Editorial Header */}
      <header className="folder-hero case-study-header wrap">
        <div className="case-study-kicker-row">
          <span className="folder-hero-badge" style={{ marginBottom: 0 }}>
            <FolderOpen size={17} />
            <span>{tx(project.cat)}</span>
          </span>

          {project.year && (
            <span className="cs-year-pill" translate="no">
              {project.year}
            </span>
          )}

          <span className="cs-index-pill">
            {t('project')} {numStr} / {pad(totalProjects)}
          </span>
        </div>

        <div className="folder-hero-main" style={{ marginTop: '18px' }}>
          <div>
            <EditableText
              path={`projects.${projectIndex}.title`}
              value={project.title}
              tag="h1"
              className="folder-hero-title"
              singleLine
            />
          </div>

          {/* Metadata Pills (only when present) */}
          {(mediaCount > 0 || (project.meta && project.meta.length > 0) || editing) && (
            <div className="pmeta" style={{ marginTop: 0 }}>
              {mediaCount > 0 && (
                <span className="mc">
                  <b>{t('deliv')}</b>
                  <span>
                    {mediaCount} {t(project.type === 'uiux' ? 'screens' : 'designs')}
                  </span>
                </span>
              )}
              {project.ratio && project.ratio !== 'auto' && (
                <span className="mc">
                  <b>{t('ratioLabel')}</b>
                  <span>{project.ratio.replace('/', ':')}</span>
                </span>
              )}
              {(project.meta || []).map((m, k) => {
                if (!editing && !tx(m.k) && !tx(m.v)) return null;
                return (
                  <span key={k} className="mc">
                    <b>
                      <EditableText
                        path={`projects.${projectIndex}.meta.${k}.k`}
                        value={m.k}
                        tag="span"
                        singleLine
                      />
                    </b>
                    <EditableText
                      path={`projects.${projectIndex}.meta.${k}.v`}
                      value={m.v}
                      tag="span"
                      singleLine
                    />
                    {editing && (
                      <button
                        type="button"
                        className="mx"
                        aria-label="Remove"
                        onClick={() =>
                          updateProjects((list) => {
                            list[projectIndex].meta.splice(k, 1);
                            return list;
                          })
                        }
                      >
                        &times;
                      </button>
                    )}
                  </span>
                );
              })}
              {editing && (
                <button
                  type="button"
                  className="pill"
                  onClick={() =>
                    updateProjects((list) => {
                      list[projectIndex].meta.push({
                        k: { en: 'Role', ar: 'الدور' },
                        v: { en: 'Graphic Designer', ar: 'مصمم جرافيك' }
                      });
                      return list;
                    })
                  }
                >
                  {t('metaAdd')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Project Description (Goal & Design Decision when present) */}
        {(showGoal || showDecision) && (
          <div className={`p-cols case-study-cols ${!showDecision ? 'single-col' : ''}`.trim()}>
            {showGoal && (
              <div className="cs-story-card">
                <h2>{t('goal')}</h2>
                <EditableText
                  path={`projects.${projectIndex}.goal`}
                  value={project.goal}
                  tag="p"
                  className="body"
                />
              </div>
            )}
            {showDecision && (
              <div className="cs-story-card">
                <h2>{t('decision')}</h2>
                <EditableText
                  path={`projects.${projectIndex}.decision`}
                  value={project.decision}
                  tag="p"
                  className="body"
                />
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Case Study Body with Giant Outlined Sticky Project Numeral Rail */}
      <div className="wrap cs-sticky-layout">
        <aside className="cs-sticky-num-rail" aria-hidden="true">
          <div className="cs-sticky-num-box">
            <span className="cs-giant-num" data-num={numStr}>
              {numStr}
            </span>
            <small className="cs-giant-sub">
              {numStr} / {pad(totalProjects)}
            </small>
          </div>
        </aside>

        <div className="cs-main-col">
          {/* 3. Large Hero Artwork Showcase (Preserving Natural Aspect Ratio) */}
          {heroSlot ? (
            <section className="case-study-hero-showcase" aria-label={t('heroArtworkLabel')}>
              <div
                className="cs-hero-stage clip-target"
                style={{ viewTransitionName: currentVtName }}
                role="button"
                tabIndex={0}
                aria-label={`${projectTitleText} — ${t('viewFullRes')}`}
                onClick={() => {
                  if (heroSlot.it.type === 'video' && heroSlot.it.kind !== 'embed' && heroSlot.it.src) {
                    openVideoLightbox(heroSlot.it.src, projectTitleText);
                  } else if (heroSlot.it.type === 'img' && heroSlot.it.src) {
                    openProjectLightbox(projectIndex, heroSlot.slotIdx);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (heroSlot.it.type === 'video' && heroSlot.it.kind !== 'embed' && heroSlot.it.src) {
                      openVideoLightbox(heroSlot.it.src, projectTitleText);
                    } else if (heroSlot.it.type === 'img' && heroSlot.it.src) {
                      openProjectLightbox(projectIndex, heroSlot.slotIdx);
                    }
                  }
                }}
              >
                {heroSlot.it.type === 'video' ? (
                  heroSlot.it.kind === 'embed' ? (
                    <iframe
                      src={heroSlot.it.embed}
                      loading="lazy"
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={projectTitleText}
                      className="cs-hero-iframe"
                    />
                  ) : (
                    <video
                      ref={heroVideoRef}
                      src={heroSlot.it.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="cs-hero-img"
                    />
                  )
                ) : heroSlot.it.src.startsWith('/') ? (
                  <Image
                    src={heroSlot.it.src}
                    alt={tx(heroSlot.it.alt) || `${projectTitleText} — 01`}
                    width={heroSlot.it.width || 1092}
                    height={heroSlot.it.height || 1440}
                    sizes="(max-width: 768px) 95vw, 920px"
                    quality={92}
                    priority
                    className="cs-hero-img"
                  />
                ) : (
                  <img
                    src={heroSlot.it.src}
                    alt={tx(heroSlot.it.alt) || `${projectTitleText} — 01`}
                    className="cs-hero-img"
                  />
                )}

                <div className="cs-hero-caption">
                  <span className="cs-hero-tag">
                    <Layers size={14} aria-hidden="true" />
                    {t('heroArtworkLabel')} · 01 / {pad(mediaCount)}
                  </span>
                  <span className="cs-hero-zoom">
                    <Maximize2 size={14} aria-hidden="true" />
                    {t('viewFullRes')}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            /* Editorial Hero Stage when a project has wireframe/upcoming slots so View Transitions work on all 6 projects */
            <section className="case-study-hero-showcase" aria-label={projectTitleText}>
              <div
                className="cs-hero-stage cs-editorial-hero-stage clip-target"
                style={{ viewTransitionName: currentVtName }}
              >
                <div className="cs-ed-stage-inner">
                  <span className="cs-ed-num" aria-hidden="true">
                    {numStr}
                  </span>
                  <span className="cs-ed-kicker">
                    <Layers size={15} aria-hidden="true" />
                    {tx(project.cat)}
                    {project.year ? ` · ${project.year}` : ''}
                  </span>
                  <strong className="cs-ed-title">{projectTitleText}</strong>
                  {rawGoal && <p className="cs-ed-goal">{rawGoal}</p>}
                </div>
              </div>
            </section>
          )}

          {/* 4. Full Project Gallery (Reusing ProjectGallery & Lightbox) */}
          <section className="case-study-gallery-section" aria-label={t('fullGalleryTitle')}>
            <div className="cs-section-head">
              <h2 className="cs-sec-title">
                <Grid size={18} aria-hidden="true" />
                <span>{t('fullGalleryTitle')}</span>
                {mediaCount > 0 && <small>({mediaCount})</small>}
              </h2>
            </div>

            <ProjectGallery
              project={project}
              projectIndex={projectIndex}
              displayPos={projectIndex}
              totalInView={totalProjects}
              layoutMode={layoutMode}
              showProjectLink={false}
              hideHeader={true}
            />
          </section>
        </div>
      </div>

      {/* 5. Large Editorial "Next Project" Showcase Banner + Previous Project Link */}
      {nextProject && (
        <nav className="wrap cs-next-banner-section" aria-label="Project navigation">
          {prevProject && (
            <div className="cs-prev-row">
              <Link
                href={`/projects/${prevProject.folderId || parentCategory.slug}/${prevProject.slug || prevProject.id}`}
                className="pill cs-prev-pill"
                style={{ '--pc': prevProject.color || '#7C3AED' }}
              >
                <BackIcon size={16} />
                <small>{t('prevProject')}:</small>
                <b>{tx(prevProject.title)}</b>
              </Link>
            </div>
          )}

          <Link
            href={nextProjectHref}
            className="cs-next-hero-banner"
            style={{ '--npc': nextProject.color || '#7C3AED' }}
            onClick={handleNextProjectClick}
          >
            <div className="cs-next-banner-copy">
              <div className="cs-next-kicker-row">
                <span className="cs-next-label">{t('nextProject')}</span>
                <span className="cs-next-cat">
                  {tx(nextProject.cat)}
                  {nextProject.year ? ` · ${nextProject.year}` : ''}
                </span>
              </div>

              <div className="cs-next-title-row">
                <span className="cs-next-big-num" aria-hidden="true">
                  {pad(nextIndex + 1)}
                </span>
                <h2 className="cs-next-big-title">{tx(nextProject.title)}</h2>
              </div>

              {tx(nextProject.goal) && (
                <p className="cs-next-desc">{tx(nextProject.goal)}</p>
              )}

              <span className="cs-next-cta">
                <span>{t('openProject')}</span>
                <span className="nx">
                  <NextIcon size={20} />
                </span>
              </span>
            </div>

            <div className="cs-next-banner-media" ref={nextMediaRef}>
              {nextProjectCover ? (
                nextProjectCover.src.startsWith('/') ? (
                  <Image
                    src={nextProjectCover.src}
                    alt={tx(nextProjectCover.alt) || tx(nextProject.title)}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    quality={88}
                    loading="lazy"
                    className="cs-next-banner-img"
                  />
                ) : (
                  <img
                    src={nextProjectCover.src}
                    alt={tx(nextProjectCover.alt) || tx(nextProject.title)}
                    loading="lazy"
                    decoding="async"
                    className="cs-next-banner-img"
                  />
                )
              ) : (
                <div className="cs-next-banner-wire">
                  <span className="cs-nbw-num">{pad(nextIndex + 1)}</span>
                  <span className="cs-nbw-cat">{tx(nextProject.cat)}</span>
                  <strong className="cs-nbw-title">{tx(nextProject.title)}</strong>
                </div>
              )}
            </div>
          </Link>
        </nav>
      )}

      {/* 6. Related Projects from the Same Category */}
      {relatedFolderCards.length > 0 && (
        <section className="wrap cs-related-section">
          <div className="shelf-header">
            <h2 className="shelf-title">
              <Layers size={18} aria-hidden="true" />
              <span>
                {sameCategoryProjects.length > 0
                  ? t('relatedProjectsTitle').replace(
                      '{cat}',
                      tx(parentCategory.shortTitle || parentCategory.title)
                    )
                  : t('otherProjectsTitle')}
              </span>
            </h2>

            <Link href={`/projects/${parentCategory.slug}`} className="pill folder-page-btn">
              <span>{t('openFolder')}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="folder-grid project-folder-grid">
            {relatedFolderCards.map((rf, i) => (
              <ProjectFolderCard
                key={rf.id}
                folder={rf}
                index={i}
                isProjectFolder={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. CTA to Contact Mohamed Tarek About a Similar Project */}
      <section className="wrap cs-project-cta-wrap">
        <div className="cs-project-cta-card">
          <div className="cs-cta-copy">
            <span className="plabel">{tx(project.cat)}</span>
            <h2 className="cs-cta-title">{t('similarProjectTitle')}</h2>
            <p className="cs-cta-desc">{tx(site.thanks)}</p>
          </div>

          <div className="cs-cta-actions">
            {projectWaHref && (
              <a
                href={projectWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="wacta"
              >
                <NetworkSvg id="whatsapp" />
                <span>{t('askAboutProject')}</span>
              </a>
            )}
            <Link href="/#brief" className="btn ghost">
              <span>{t('startProject')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
