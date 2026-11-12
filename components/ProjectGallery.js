'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio, parseVideoLink } from '@/context/PortfolioContext';
import { ASPECT_RATIOS } from '@/data/projects';
import { PROJECT_TYPES, UIUX_SUBTYPES } from '@/data/categories';
import { EditableText } from './SharedUI';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function ProjectGallery({
  project,
  projectIndex,
  displayPos = 0,
  totalInView = 1,
  layoutMode = 'grid',
  showProjectLink = false,
  hideHeader = false
}) {
  const {
    lang,
    tx,
    t,
    editing,
    updateProjects,
    pickFile,
    openProjectLightbox,
    openVideoLightbox
  } = usePortfolio();

  const cols = project.cols || 3;

  const effRatio = (it) => (it.ratio === 'inherit' ? project.ratio || 'auto' : it.ratio);

  const csClass = (it, slotIdx) => {
    if (layoutMode === 'featured' && slotIdx === 0 && it.type === 'img' && it.src) {
      return cols >= 3 ? 'cs2 featured-slot' : 'csf featured-slot';
    }
    const c = it.cs === 0 || it.cs >= cols ? 'f' : String(it.cs || 1);
    return `cs${c}`;
  };

  const askCustomRatio = () => {
    const raw = window.prompt(t('customPrompt'));
    const m = raw && raw.trim().match(/^(\d+(?:\.\d+)?)\s*[:/xX×]\s*(\d+(?:\.\d+)?)$/);
    return m ? `${m[1]}/${m[2]}` : null;
  };

  const handleMoveProject = (dir) => {
    updateProjects((list) => {
      const target = projectIndex + dir;
      if (target < 0 || target >= list.length) return list;
      const tmp = list[projectIndex];
      list[projectIndex] = list[target];
      list[target] = tmp;
      return list;
    });
  };

  const handleDeleteProject = () => {
    if (window.confirm(t('confirmDel'))) {
      updateProjects((list) => {
        list.splice(projectIndex, 1);
        return list;
      });
    }
  };

  const handleSlotMove = (kIdx, dir) => {
    updateProjects((list) => {
      const imgs = list[projectIndex]?.images;
      if (!imgs) return list;
      const target = kIdx + dir;
      if (target < 0 || target >= imgs.length) return list;
      const tmp = imgs[kIdx];
      imgs[kIdx] = imgs[target];
      imgs[target] = tmp;
      return list;
    });
  };

  const handleSlotRemove = (kIdx) => {
    updateProjects((list) => {
      const imgs = list[projectIndex]?.images;
      if (!imgs) return list;
      const it = imgs[kIdx];
      if (it && it.type === 'img' && it.src) {
        it.src = '';
      } else {
        imgs.splice(kIdx, 1);
      }
      const first = imgs.find((x) => x.type === 'img' && x.src);
      list[projectIndex].thumbnail = first ? first.src : '';
      return list;
    });
  };

  const handleAddVideoLink = () => {
    const raw = window.prompt(t('linkPrompt'));
    if (raw === null) return;
    const entry = parseVideoLink(raw);
    if (!entry) {
      window.alert(t('badLink'));
      return;
    }
    updateProjects((list) => {
      const imgs = list[projectIndex].images;
      const emptyIdx = imgs.findIndex((x) => x.type === 'img' && !x.src);
      if (emptyIdx > -1) imgs[emptyIdx] = entry;
      else imgs.push(entry);
      return list;
    });
  };

  const handleAddTextBlock = () => {
    updateProjects((list) => {
      list[projectIndex].images.push({
        type: 'text',
        cs: 0,
        ratio: 'auto',
        fit: 'cover',
        title: { en: 'Heading', ar: 'عنوان' },
        body: { en: 'Write about this project here…', ar: 'اكتب هنا عن المشروع…' }
      });
      return list;
    });
  };

  const mediaCount = (project.images || []).filter(
    (x) => (x.type === 'img' && x.src) || x.type === 'video'
  ).length;

  const digits = pad(displayPos + 1).split('');
  const cells = Array.from({ length: 20 }, (_, n) => n % 10);

  const rawDecision = String(tx(project.decision) || '').trim();
  const isDecisionPlaceholder =
    !rawDecision ||
    /^add your design decisions here/i.test(rawDecision) ||
    /^أضف قرارات التصميم هنا/.test(rawDecision);
  const showDecisionCol = editing || !isDecisionPlaceholder;
  const caseStudyHref = `/projects/${project.folderId || 'social-media-campaigns'}/${project.slug || project.id}`;

  return (
    <article
      className={`project folder-project-item ${displayPos % 2 ? 'flip' : ''} ${hideHeader ? 'case-study-gallery-only' : ''}`.trim()}
      id={`p-${project.slug || projectIndex + 1}`}
      style={{ '--pc': project.color || '#7C3AED' }}
    >
      <div className="pbg" aria-hidden="true" />

      {editing && (
        <div className="ptools">
          <select
            aria-label="Category"
            value={project.type || 'social'}
            onChange={(e) => {
              const val = e.target.value;
              updateProjects((list) => {
                list[projectIndex].type = val;
                list[projectIndex].sub = val === 'uiux' ? list[projectIndex].sub || 'website' : '';
                return list;
              });
            }}
          >
            {PROJECT_TYPES.map(([id, en, ar]) => (
              <option key={id} value={id}>
                {lang === 'ar' ? ar : en}
              </option>
            ))}
          </select>

          {project.type === 'uiux' && (
            <select
              aria-label="Sub category"
              value={project.sub || 'website'}
              onChange={(e) =>
                updateProjects((list) => {
                  list[projectIndex].sub = e.target.value;
                  return list;
                })
              }
            >
              {UIUX_SUBTYPES.map(([id, en, ar]) => (
                <option key={id} value={id}>
                  {lang === 'ar' ? ar : en}
                </option>
              ))}
            </select>
          )}

          <select
            aria-label="Columns"
            value={cols}
            onChange={(e) =>
              updateProjects((list) => {
                list[projectIndex].cols = Number(e.target.value);
                return list;
              })
            }
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {t('colsLabel').replace('{n}', n)}
              </option>
            ))}
          </select>

          <select
            aria-label="Ratio"
            value={project.ratio || 'auto'}
            onChange={(e) => {
              let v = e.target.value;
              if (v === '__c') {
                v = askCustomRatio();
                if (!v) return;
              }
              updateProjects((list) => {
                list[projectIndex].ratio = v;
                return list;
              });
            }}
          >
            {ASPECT_RATIOS.map(([val, label]) => (
              <option key={val} value={val}>
                {t('ratioLabel')}: {label || t('original')}
              </option>
            ))}
            <option value="__c">{t('custom')}</option>
          </select>

          <button type="button" className="pill" onClick={() => handleMoveProject(-1)}>
            ↑ {t('up')}
          </button>
          <button type="button" className="pill" onClick={() => handleMoveProject(1)}>
            ↓ {t('down')}
          </button>
          <button
            type="button"
            className="pill"
            onClick={() =>
              updateProjects((list) => {
                const cur = list[projectIndex].align;
                list[projectIndex].align = cur === 'stretch' ? 'start' : 'stretch';
                return list;
              })
            }
          >
            {project.align === 'stretch' ? t('rowsAl') : t('rowsNat')}
          </button>
          <button type="button" className="pill" onClick={handleDeleteProject}>
            {t('del')}
          </button>
        </div>
      )}

      {!hideHeader && (
        <>
      <header className="p-head">
        <div className="pnum rv0 in" aria-hidden="true">
          {digits.map((c, n) => (
            <span key={n} className="dg" style={{ '--i': n, '--t': c }}>
              <span className="strip">
                {cells.map((digit, idx) => (
                  <i key={idx}>{digit}</i>
                ))}
              </span>
            </span>
          ))}
        </div>

        <div className="p-meta rv0 in">
          <span className="plabel">
            {t('project')} {pad(displayPos + 1)} / {pad(totalInView)}
          </span>
          <EditableText
            path={`projects.${projectIndex}.title`}
            value={project.title}
            tag="h2"
            className="p-title"
            singleLine
            animatedWords
          />
          <p className="cat">
            <EditableText
              path={`projects.${projectIndex}.cat`}
              value={project.cat}
              tag="span"
              singleLine
            />
          </p>

          {(mediaCount > 0 || (project.meta && project.meta.length > 0) || showProjectLink || editing) && (
            <div className="pmeta">
              {mediaCount > 0 && (
                <span className="mc">
                  <b>{t('deliv')}</b>
                  <span>
                    {mediaCount} {t(project.type === 'uiux' ? 'screens' : 'designs')}
                  </span>
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
              {showProjectLink && !editing && (
                <Link
                  href={caseStudyHref}
                  className="pill folder-page-btn"
                >
                  <span>{t('viewCaseStudy')}</span>
                  <ArrowUpRight size={14} />
                </Link>
              )}
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
      </header>

      <div className="p-rule rv0 in" />

      <div className={`p-cols ${!showDecisionCol ? 'single-col' : ''}`.trim()}>
        <div className="rvx in">
          <h3>{t('goal')}</h3>
          <EditableText
            path={`projects.${projectIndex}.goal`}
            value={project.goal}
            tag="p"
            className="body"
          />
        </div>
        {showDecisionCol && (
          <div className="rvx r in" style={{ '--d': '.15s' }}>
            <h3>{t('decision')}</h3>
            <EditableText
              path={`projects.${projectIndex}.decision`}
              value={project.decision}
              tag="p"
              className="body"
            />
          </div>
        )}
      </div>
      </>
      )}

      {/* Gallery Grid / Masonry / Featured */}
      <div
        className={`gallery ${project.align === 'stretch' ? 'stretch' : ''} ${
          layoutMode === 'masonry' ? 'masonry-mode' : ''
        }`.trim()}
        data-cols={cols}
        style={{ '--cols': cols }}
      >
        {(project.images || []).map((it, k) => {
          if (it.type === 'text') {
            return (
              <figure
                key={k}
                className={`slot rv in ${csClass(it, k)} txt`}
                style={{ '--d': `${((k % 3) * 0.08).toFixed(2)}s` }}
              >
                <div className="tbox">
                  <EditableText
                    path={`projects.${projectIndex}.images.${k}.title`}
                    value={it.title}
                    tag="h4"
                    className="tt"
                    singleLine
                  />
                  <EditableText
                    path={`projects.${projectIndex}.images.${k}.body`}
                    value={it.body}
                    tag="p"
                    className="tb"
                  />
                </div>
                {editing && (
                  <>
                    <SlotControls
                      projectIndex={projectIndex}
                      k={k}
                      it={it}
                      cols={cols}
                      lang={lang}
                      t={t}
                      onMove={handleSlotMove}
                      updateProjects={updateProjects}
                      askCustomRatio={askCustomRatio}
                      showFit={false}
                    />
                    <button
                      type="button"
                      className="x"
                      aria-label="Remove"
                      onClick={() => handleSlotRemove(k)}
                    >
                      &times;
                    </button>
                  </>
                )}
              </figure>
            );
          }

          const isVid = it.type === 'video';
          const isEmbed = isVid && it.kind === 'embed';
          const isEmpty = !isVid && !it.src;
          let ar = effRatio(it);
          if (layoutMode === 'masonry' && !isEmpty && !isVid) {
            ar = 'auto';
          }
          if (isVid && ar === 'auto') ar = '16/9';
          if (isEmpty && ar === 'auto') ar = cols === 1 ? '16/9' : cols === 2 ? '4/3' : '4/5';
          const fixed = isVid || isEmpty || ar !== 'auto';
          const slotClasses = [
            'slot rv in',
            csClass(it, k),
            isEmpty ? 'empty' : '',
            isVid ? `vid ${isEmbed ? 'emb' : ''}` : ''
          ]
            .filter(Boolean)
            .join(' ');

          const showFit = !isVid && !!it.src && effRatio(it) !== 'auto';
          const isFirstPageImage = !hideHeader && displayPos === 0 && k === 0;

          return (
            <GalleryMediaSlot
              key={k}
              slotClasses={slotClasses}
              k={k}
              it={it}
              isVid={isVid}
              isEmbed={isEmbed}
              isEmpty={isEmpty}
              fixed={fixed}
              ar={ar}
              isFirstPageImage={isFirstPageImage}
              editing={editing}
              projectIndex={projectIndex}
              projectTitle={tx(project.title)}
              cols={cols}
              lang={lang}
              tx={tx}
              t={t}
              showFit={showFit}
              onSlotClick={() => {
                if (editing) {
                  pickFile({ type: 'img', p: projectIndex, k }, false, 'image/*');
                } else if (isVid && !isEmbed && it.src) {
                  openVideoLightbox(it.src, tx(project.title));
                } else if (!isEmpty && !isVid) {
                  openProjectLightbox(projectIndex, k);
                }
              }}
              onMove={handleSlotMove}
              onRemove={() => handleSlotRemove(k)}
              updateProjects={updateProjects}
              askCustomRatio={askCustomRatio}
            />
          );
        })}

        {editing && (
          <div className="addrow">
            <button
              type="button"
              className="addbtn"
              onClick={() => pickFile({ type: 'add', p: projectIndex }, true, 'image/*')}
            >
              {t('addImage')}
            </button>
            <button
              type="button"
              className="addbtn"
              onClick={() => pickFile({ type: 'addvid', p: projectIndex }, true, 'video/*')}
            >
              {t('addVideo')}
            </button>
            <button type="button" className="addbtn" onClick={handleAddVideoLink}>
              {t('addLink')}
            </button>
            <button type="button" className="addbtn" onClick={handleAddTextBlock}>
              {t('addText')}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function GalleryMediaSlot({
  slotClasses,
  k,
  it,
  isVid,
  isEmbed,
  isEmpty,
  fixed,
  ar,
  isFirstPageImage = false,
  editing,
  projectIndex,
  projectTitle,
  cols,
  lang,
  tx,
  t,
  showFit,
  onSlotClick,
  onMove,
  onRemove,
  updateProjects,
  askCustomRatio
}) {
  const videoRef = useRef(null);
  const isInteractive = editing || (!isEmpty && !isEmbed);

  // Auto-pause video when scrolled off-screen or when browser tab is hidden
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !isVid || isEmbed || typeof window === 'undefined') return;
    let inView = false;

    const syncVideo = () => {
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
          inView = entries[0]?.isIntersecting ?? false;
          syncVideo();
        },
        { threshold: 0.15 }
      );
      io.observe(vid);
    } else {
      inView = true;
      syncVideo();
    }

    document.addEventListener('visibilitychange', syncVideo);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', syncVideo);
    };
  }, [isVid, isEmbed, it?.src]);

  const handleKeyDown = (e) => {
    if (!isInteractive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSlotClick();
    }
  };

  return (
    <figure
      className={slotClasses}
      data-act={isVid ? 'vslot' : 'slot'}
      style={{ '--d': `${((k % 3) * 0.08).toFixed(2)}s` }}
    >
      <div
        className={`ti ${fixed ? 'fixed' : ''} ${isVid ? 'vbox' : ''}`.trim()}
        style={{
          '--ar': ar,
          '--fit': it.fit === 'contain' ? 'contain' : 'cover'
        }}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={
          isInteractive
            ? `${projectTitle} — ${pad(k + 1)} (${t('view')})`
            : undefined
        }
        onClick={onSlotClick}
        onKeyDown={handleKeyDown}
      >
        {isVid ? (
          isEmbed ? (
            <iframe
              src={it.embed}
              loading="lazy"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title={projectTitle || 'video'}
            />
          ) : (
            <video
              ref={videoRef}
              src={it.src}
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay
            />
          )
        ) : it.src ? (
          <>
            {it.src.startsWith('/') ? (
              fixed ? (
                <Image
                  src={it.src}
                  alt={tx(it.alt) || `${projectTitle} — ${pad(k + 1)}`}
                  fill
                  sizes="(max-width: 480px) 95vw, (max-width: 760px) 48vw, 380px"
                  quality={90}
                  priority={isFirstPageImage}
                  loading={isFirstPageImage ? undefined : 'lazy'}
                />
              ) : (
                <Image
                  src={it.src}
                  alt={tx(it.alt) || `${projectTitle} — ${pad(k + 1)}`}
                  width={it.width || 1080}
                  height={it.height || 1350}
                  sizes="(max-width: 480px) 95vw, (max-width: 760px) 48vw, 380px"
                  quality={90}
                  priority={isFirstPageImage}
                  loading={isFirstPageImage ? undefined : 'lazy'}
                />
              )
            ) : (
              <img
                src={it.src}
                alt={tx(it.alt) || `${projectTitle} — ${pad(k + 1)}`}
                loading={isFirstPageImage ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
            <span className="zi" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
              </svg>
            </span>
          </>
        ) : (
          <div className="empty-slot-placeholder">
            <span className="empty-slot-num">{pad(k + 1)}</span>
            <span>{editing ? t('slotEdit') : `${projectTitle} · ${t('slotView')}`}</span>
          </div>
        )}
      </div>

      {isVid && !isEmbed && (
        <button
          type="button"
          className="mutebtn"
          aria-label={t('mute')}
          title={t('mute')}
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
              e.currentTarget.textContent = videoRef.current.muted ? '🔇' : '🔊';
            }
          }}
        >
          🔇
        </button>
      )}

      {editing && (
        <>
          <SlotControls
            projectIndex={projectIndex}
            k={k}
            it={it}
            cols={cols}
            lang={lang}
            t={t}
            onMove={onMove}
            updateProjects={updateProjects}
            askCustomRatio={askCustomRatio}
            showFit={showFit}
          />
          <button
            type="button"
            className="x"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            &times;
          </button>
        </>
      )}
    </figure>
  );
}

function SlotControls({
  projectIndex,
  k,
  it,
  cols,
  lang,
  t,
  onMove,
  updateProjects,
  askCustomRatio,
  showFit
}) {
  const L = lang === 'ar' ? '▶' : '◀';
  const R = lang === 'ar' ? '◀' : '▶';
  const curCs = it.cs === 0 || it.cs >= cols ? 0 : it.cs || 1;
  const isVid = it.type === 'video';

  return (
    <div className="sc" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="sb" title={t('prev')} onClick={() => onMove(k, -1)}>
        {L}
      </button>
      <button type="button" className="sb" title={t('next')} onClick={() => onMove(k, 1)}>
        {R}
      </button>

      <select
        aria-label="Size"
        value={curCs}
        onChange={(e) => {
          const val = Number(e.target.value);
          updateProjects((list) => {
            list[projectIndex].images[k].cs = val;
            return list;
          });
        }}
      >
        {Array.from({ length: Math.max(0, cols - 1) }, (_, idx) => idx + 1).map((n) => (
          <option key={n} value={n}>
            {t('colN').replace('{n}', n)}
          </option>
        ))}
        <option value={0}>{t('full')}</option>
      </select>

      {it.type !== 'text' && (
        <select
          aria-label="Ratio"
          value={it.ratio || 'inherit'}
          onChange={(e) => {
            let v = e.target.value;
            if (v === '__c') {
              v = askCustomRatio();
              if (!v) return;
            }
            updateProjects((list) => {
              list[projectIndex].images[k].ratio = v;
              return list;
            });
          }}
        >
          {!isVid && <option value="inherit">{t('projDefault')}</option>}
          {ASPECT_RATIOS.filter((r) => !(isVid && r[0] === 'auto')).map(([val, label]) => (
            <option key={val} value={val}>
              {label || t('original')}
            </option>
          ))}
          <option value="__c">{t('custom')}</option>
        </select>
      )}

      {showFit && (
        <button
          type="button"
          className="sb"
          title={t('fit')}
          onClick={() =>
            updateProjects((list) => {
              const curFit = list[projectIndex].images[k].fit;
              list[projectIndex].images[k].fit = curFit === 'contain' ? 'cover' : 'contain';
              return list;
            })
          }
        >
          ⤢
        </button>
      )}
    </div>
  );
}
