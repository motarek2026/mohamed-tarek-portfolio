'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FolderKanban, Layers, ListFilter, Search, X } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { PROJECT_TYPES, UIUX_SUBTYPES } from '@/data/categories';
import { PROJECT_COLORS } from '@/data/projects';
import { AnimatedWords } from './SharedUI';
import ProjectFolderCard from './ProjectFolderCard';
import ProjectFolderView from './ProjectFolderView';
import ProjectGallery from './ProjectGallery';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function ProjectsSection() {
  const {
    projects,
    categories,
    lang,
    tx,
    t,
    editing,
    activeFolderSlug,
    setActiveFolderSlug
  } = usePortfolio();

  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'projects' | 'index'
  const [filterType, setFilterType] = useState('all');
  const [filterSub, setFilterSub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProjIdx, setHoveredProjIdx] = useState(null);
  const [filterAnimating, setFilterAnimating] = useState(false);

  const savedScrollYRef = useRef(null);
  const wprevRef = useRef(null);
  const sectionRef = useRef(null);
  const filterTimerRef = useRef(null);

  const triggerFilterTransition = (updater) => {
    if (typeof window !== 'undefined') {
      const reduce =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        setFilterAnimating(true);
        if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
        filterTimerRef.current = setTimeout(() => {
          setFilterAnimating(false);
        }, 380);
      }
    }
    updater();
  };

  useEffect(() => {
    return () => {
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    };
  }, []);

  // Smooth GSAP layout stagger when filter or viewMode changes (transform + opacity only)
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    import('gsap')
      .then((mod) => {
        if (cancelled || !sectionRef.current) return;
        const gsap = mod.gsap || mod.default;
        if (!gsap) return;
        const items = sectionRef.current.querySelectorAll(
          '.folder-overview-wrap .folder-card, .folder-overview-wrap .wrow, .folder-overview-wrap .qps-pill'
        );
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 16, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              stagger: 0.04,
              ease: 'power3.out',
              clearProps: 'transform,opacity'
            }
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [viewMode, filterType, filterSub]);

  // Sync browser history back/forward if ?folder= query parameter is used
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initialFolder = params.get('folder');
    if (initialFolder) {
      setActiveFolderSlug(initialFolder);
    }

    const onPopState = () => {
      const sp = new URLSearchParams(window.location.search);
      const f = sp.get('folder');
      setActiveFolderSlug(f || null);
      if (!f && savedScrollYRef.current !== null) {
        const y = savedScrollYRef.current;
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: 'smooth' });
        });
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [setActiveFolderSlug]);

  // Floating preview movement for Editorial Index rows
  useEffect(() => {
    if (typeof window === 'undefined' || hoveredProjIdx === null) return;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (!canHover) return;

    let wpx = window.innerWidth / 2;
    let wpy = window.innerHeight / 2;
    let ctx = wpx;
    let cty = wpy;
    let rafId = 0;

    const onMove = (e) => {
      ctx = e.clientX;
      cty = e.clientY;
    };

    const tick = () => {
      const el = wprevRef.current;
      if (el) {
        const w = el.offsetWidth || 260;
        const h = el.offsetHeight || 325;
        const tx0 = ctx + (lang === 'ar' ? -w - 36 : 36);
        const ty0 = cty - h / 2;
        wpx += (tx0 - wpx) * 0.14;
        wpy += (ty0 - wpy) * 0.14;
        const rot = Math.max(-8, Math.min(8, (tx0 - wpx) * 0.05));
        el.style.transform = `translate3d(${wpx.toFixed(1)}px,${wpy.toFixed(
          1
        )}px,0) rotate(${rot.toFixed(2)}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener('pointermove', onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [hoveredProjIdx, lang]);

  const handleCloseFolder = (nextSlug) => {
    if (typeof nextSlug === 'string' && nextSlug) {
      setActiveFolderSlug(nextSlug);
      return;
    }
    setActiveFolderSlug(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('folder');
      window.history.pushState({}, '', url.toString());
      if (savedScrollYRef.current !== null) {
        const targetY = savedScrollYRef.current;
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
      } else {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects
      .map((proj, idx) => ({ proj, idx }))
      .filter(({ proj }) => {
        if (filterType !== 'all' && proj.type !== filterType) return false;
        if (filterType === 'uiux' && filterSub !== 'all' && proj.sub !== filterSub) return false;
        if (q) {
          const hay = [
            proj.title?.en,
            proj.title?.ar,
            proj.cat?.en,
            proj.cat?.ar,
            proj.goal?.en,
            proj.goal?.ar
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [projects, filterType, filterSub, searchQuery]);

  // Build Category Folders enriched with project & artwork counts and layered previews
  const categoryFolderCards = useMemo(() => {
    return categories
      .filter((cat) => {
        if (filterType !== 'all' && cat.type !== filterType) return false;
        return true;
      })
      .map((cat) => {
        const matching = filteredProjects.filter(({ proj }) => proj.folderId === cat.id);
        const previewImages = [];
        let artworkCount = 0;
        let totalSlots = 0;

        matching.forEach(({ proj }) => {
          const validImgs = (proj.images || []).filter((x) => x.type === 'img' && x.src);
          artworkCount += validImgs.length;
          totalSlots += (proj.images || []).length;
          if (validImgs.length > 0 && previewImages.length < 3) {
            // Take top 1-2 images per project for the folder fan stack
            validImgs.slice(0, 2).forEach((im) => {
              if (previewImages.length < 3) {
                previewImages.push({
                  src: im.src,
                  alt: tx(im.alt) || tx(proj.title),
                  label: tx(proj.title)
                });
              }
            });
          }
        });

        return {
          ...cat,
          projectCount: matching.length,
          artworkCount,
          totalSlots,
          previewImages,
          subProjects: matching.map(({ proj, idx }) => ({
            id: proj.id,
            slug: proj.slug || proj.id,
            num: pad(idx + 1),
            title: proj.title,
            cat: proj.cat,
            goal: proj.goal
          }))
        };
      })
      .filter((cat) => {
        if (searchQuery.trim() && cat.projectCount === 0) return false;
        if (filterType !== 'all' && cat.type !== filterType) return false;
        return true;
      });
  }, [categories, filteredProjects, filterType, searchQuery, tx]);

  // Build Individual Project Folder cards
  const projectFolderCards = useMemo(() => {
    return filteredProjects.map(({ proj, idx }) => {
      const validImgs = (proj.images || []).filter((x) => x.type === 'img' && x.src);
      return {
        id: proj.id,
        slug: `${proj.folderId}/${proj.slug || proj.id}`,
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
  }, [filteredProjects, tx]);

  const hoveredProject = hoveredProjIdx !== null ? projects[hoveredProjIdx] : null;
  const hoveredCover = hoveredProject
    ? (hoveredProject.images || []).find((x) => x.type === 'img' && x.src)
    : null;

  return (
    <section className="projects-section" id="work" ref={sectionRef}>
      {/* Section Header */}
      <div className="divider folder-divider">
        <div className="blob" />
        <div className="inner wrap rv">
          <h2 className="big">
            {editing ? t('selected') : <AnimatedWords text={t('selected')} />}
            <sup>{pad(projects.length)}</sup>
          </h2>
          <p className="folder-section-sub">{t('selectedSub')}</p>

          {/* Top Controls: View Switcher + Category Filters + Search */}
          {!activeFolderSlug && !editing && (
            <div className="folder-controls-panel">
              <div className="folder-mode-tabs" role="tablist" aria-label={t('folderOverview')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'categories'}
                  className={`mode-tab ${viewMode === 'categories' ? 'on' : ''}`}
                  onClick={() => triggerFilterTransition(() => setViewMode('categories'))}
                >
                  <FolderKanban size={16} aria-hidden="true" />
                  <span>{t('categoryFolders')}</span>
                  <small>{categoryFolderCards.length}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'projects'}
                  className={`mode-tab ${viewMode === 'projects' ? 'on' : ''}`}
                  onClick={() => triggerFilterTransition(() => setViewMode('projects'))}
                >
                  <Layers size={16} aria-hidden="true" />
                  <span>{t('projectFolders')}</span>
                  <small>{projectFolderCards.length}</small>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'index'}
                  className={`mode-tab ${viewMode === 'index' ? 'on' : ''}`}
                  onClick={() => triggerFilterTransition(() => setViewMode('index'))}
                >
                  <ListFilter size={16} aria-hidden="true" />
                  <span>{t('indexList')}</span>
                </button>
              </div>

              <div className="folder-filter-bar">
                <div className="filters" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    aria-pressed={filterType === 'all'}
                    className={`fchip ${filterType === 'all' ? 'on' : ''}`}
                    onClick={() =>
                      triggerFilterTransition(() => {
                        setFilterType('all');
                        setFilterSub('all');
                      })
                    }
                  >
                    {t('all')}
                    <sup>{projects.length}</sup>
                  </button>
                  {PROJECT_TYPES.map(([id, en, ar]) => {
                    const count = projects.filter((p) => p.type === id).length;
                    if (!count) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={filterType === id}
                        className={`fchip ${filterType === id ? 'on' : ''}`}
                        onClick={() =>
                          triggerFilterTransition(() => {
                            setFilterType(id);
                            setFilterSub('all');
                          })
                        }
                      >
                        {lang === 'ar' ? ar : en}
                        <sup>{count}</sup>
                      </button>
                    );
                  })}
                </div>

                {/* Search Input */}
                <div className="folder-search-box">
                  <Search size={16} className="search-ic" aria-hidden="true" />
                  <input
                    type="search"
                    name="q"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    aria-label={t('searchPlaceholder')}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear"
                      aria-label={t('clearSearch')}
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {filterType === 'uiux' && (
                <div className="filters sub">
                  <button
                    type="button"
                    aria-pressed={filterSub === 'all'}
                    className={`fchip ${filterSub === 'all' ? 'on' : ''}`}
                    onClick={() => triggerFilterTransition(() => setFilterSub('all'))}
                  >
                    {t('all')}
                    <sup>{projects.filter((p) => p.type === 'uiux').length}</sup>
                  </button>
                  {UIUX_SUBTYPES.map(([id, en, ar]) => {
                    const count = projects.filter((p) => p.type === 'uiux' && p.sub === id).length;
                    if (!count) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={filterSub === id}
                        className={`fchip ${filterSub === id ? 'on' : ''}`}
                        onClick={() => triggerFilterTransition(() => setFilterSub(id))}
                      >
                        {lang === 'ar' ? ar : en}
                        <sup>{count}</sup>
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {t('filterLiveStatus')
                  .replace('{p}', String(filteredProjects.length))
                  .replace('{c}', String(categoryFolderCards.length))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Folder Browsing Area */}
      {editing ? (
        /* In Edit Mode, display all projects directly so every project can be edited/reordered easily */
        <div className="wrap">
          {projects.map((proj, idx) => (
            <ProjectGallery
              key={proj.id || idx}
              project={proj}
              projectIndex={idx}
              displayPos={idx}
              totalInView={projects.length}
              layoutMode="grid"
            />
          ))}
        </div>
      ) : activeFolderSlug ? (
        /* Inline Opened Folder View when ?folder= query parameter is present */
        <ProjectFolderView
          slug={activeFolderSlug}
          onClose={handleCloseFolder}
          isStandalonePage={false}
        />
      ) : (
        <div
          className={`wrap folder-overview-wrap ${filterAnimating ? 'is-filtering' : ''}`}
          data-filter-state={`${viewMode}-${filterType}-${filterSub}`}
        >
          {viewMode === 'categories' && (
            <>
              {/* Primary Discipline Folders Grid — each links to /projects/[slug] */}
              <div className="folder-grid category-folder-grid">
                {categoryFolderCards.map((folder, i) => (
                  <ProjectFolderCard
                    key={folder.id}
                    folder={folder}
                    index={i}
                    isProjectFolder={false}
                  />
                ))}
              </div>

              {/* Compact Quick-Jump Project Bar so any project is 1 click away without duplicating 6 large folder cards */}
              {projectFolderCards.length > 0 && (
                <div className="quick-projects-strip rv">
                  <div className="qps-head">
                    <span className="qps-title">
                      <Layers size={16} aria-hidden="true" />
                      <span>{t('projectFolders')}</span>
                      <small>{projectFolderCards.length}</small>
                    </span>
                    <button
                      type="button"
                      className="pill qps-switch-btn"
                      onClick={() => setViewMode('projects')}
                    >
                      <span>{lang === 'ar' ? 'عرض كروت المشاريع' : 'View project cards'}</span>
                    </button>
                  </div>
                  <div className="qps-pills">
                    {projectFolderCards.map((pf, i) => (
                      <Link
                        key={pf.id}
                        href={`/projects/${pf.slug}`}
                        className="qps-pill"
                        style={{ '--fc': pf.color || '#7C3AED' }}
                      >
                        <b className="qps-num">{String(i + 1).padStart(2, '0')}</b>
                        <span className="qps-name">{tx(pf.title)}</span>
                        <small className="qps-cat">{tx(pf.badge)}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === 'projects' && (
            <div className="folder-grid project-folder-grid">
              {projectFolderCards.length > 0 ? (
                projectFolderCards.map((pf, i) => (
                  <ProjectFolderCard
                    key={pf.id}
                    folder={pf}
                    index={i}
                    isProjectFolder={true}
                  />
                ))
              ) : (
                <div className="pempty">{t('filterEmpty')}</div>
              )}
            </div>
          )}

          {viewMode === 'index' && (
            <nav className="windex" aria-label={t('indexList')}>
              {filteredProjects.map(({ proj, idx }, pos) => (
                <Link
                  key={proj.id || idx}
                  className="wrow"
                  href={`/projects/${proj.folderId}/${proj.slug || proj.id}`}
                  style={{ '--pc': proj.color || PROJECT_COLORS[idx % PROJECT_COLORS.length] }}
                  onClick={() => setHoveredProjIdx(null)}
                  onPointerEnter={() => setHoveredProjIdx(idx)}
                  onPointerLeave={() => setHoveredProjIdx(null)}
                >
                  <span className="wr-n">{pad(pos + 1)}</span>
                  <span className="wr-t">{tx(proj.title)}</span>
                  <span className="wr-c">{tx(proj.cat)}</span>
                  <span className="wr-a">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Floating Cursor Thumbnail Preview for Index Mode */}
      <div
        id="wprev"
        ref={wprevRef}
        className={`${hoveredProjIdx !== null ? 'on' : ''} ${hoveredCover ? '' : 'ph'}`.trim()}
        style={{
          '--pc': hoveredProject?.color || '#7C3AED'
        }}
        aria-hidden="true"
      >
        {hoveredCover ? (
          <img
            src={hoveredCover.src}
            alt=""
            width={320}
            height={220}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span>{hoveredProject ? tx(hoveredProject.title) : ''}</span>
      </div>
    </section>
  );
}