'use client';

import React, { useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Folder, FolderOpen, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

function ProjectFolderCard({
  folder,
  index = 0,
  onOpen,
  isProjectFolder = false
}) {
  const { tx, t, lang } = usePortfolio();
  const router = useRouter();
  const pocketRef = useRef(null);

  const color = folder.color || '#7C3AED';
  const secondaryColor = folder.secondaryColor || '#0359D7';
  const previewImages = folder.previewImages || [];
  const projectCount = folder.projectCount ?? 1;
  const artworkCount = folder.artworkCount ?? 0;
  const totalSlots = folder.totalSlots ?? 0;
  const subProjects = folder.subProjects || [];
  const href = `/projects/${folder.slug}`;
  const rawTabLabel = String(tx(folder.badge || folder.cat) || '');
  const cleanTabLabel = rawTabLabel.replace(/^\d+\s*[·•\-–—]\s*/, '');
  const numStr = String(index + 1).padStart(2, '0');
  const safeVtId = String(folder.id || folder.slug || `card-${index}`).replace(
    /[^a-zA-Z0-9_-]/g,
    '-'
  );
  const vtName = `proj-media-${safeVtId}`;

  const handleClick = (e) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(folder.slug);
      return;
    }

    // Preserve standard browser behavior for modified clicks (new tab/window)
    if (
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

    window.__mtLastVtName = vtName;

    if (typeof document.startViewTransition === 'function') {
      e.preventDefault();
      try {
        document.startViewTransition(
          () =>
            new Promise((resolve) => {
              window.__mtResolveVT = resolve;
              router.push(href);
              setTimeout(resolve, 420);
            })
        );
      } catch {
        router.push(href);
      }
    } else {
      e.preventDefault();
      document.documentElement.classList.add('vt-fade-fallback');
      router.push(href);
    }
  };

  return (
    <Link
      href={href}
      className="folder-card rv"
      style={{
        '--fc': color,
        '--fc2': secondaryColor,
        '--d': `${(index * 0.08).toFixed(2)}s`
      }}
      aria-label={`${t('openFolder')}: ${tx(folder.title)}`}
      onClick={handleClick}
    >
      {/* Interactive Cursor Spotlight + Ambient Aura */}
      <span className="folder-spotlight" aria-hidden="true" />

      {/* Top Folder Tab + Rim */}
      <div className="folder-top-bar">
        <div className="folder-tab">
          <span className="folder-tab-icon" aria-hidden="true">
            <Folder className="ic-closed" size={16} strokeWidth={2.2} />
            <FolderOpen className="ic-open" size={16} strokeWidth={2.2} />
          </span>
          <span className="folder-tab-num">{numStr}</span>
          <span className="folder-tab-label">{cleanTabLabel}</span>
        </div>

        <div className="folder-counts">
          <span className="folder-pill-count">
            {projectCount === 1
              ? t('projectSingle')
              : t('projectsCount').replace('{n}', projectCount)}
          </span>
          <span className="folder-pill-count accent">
            {artworkCount > 0
              ? t('artworksCount').replace('{n}', artworkCount)
              : t('slotsCount').replace('{n}', totalSlots || 4)}
          </span>
        </div>
      </div>

      {/* Folder Visual Pocket with Layered Artwork Previews */}
      <div
        className="folder-pocket"
        ref={pocketRef}
        style={{ viewTransitionName: vtName }}
      >
        <div className="folder-backplate" aria-hidden="true" />

        {/* Large Kinetic Project Numeral */}
        <span className="folder-big-num" aria-hidden="true" data-num={numStr}>
          <span className="fbn-stroke">{numStr}</span>
          <span className="fbn-fill">{numStr}</span>
        </span>

        <div className="folder-previews">
          {previewImages.length > 0 ? (
            previewImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className={`folder-preview-item item-${idx + 1} ${
                  previewImages.length === 1 ? 'single' : ''
                }`}
                style={{ '--depth': (1 - idx * 0.32).toFixed(2) }}
              >
                {img.src && img.src.startsWith('/') ? (
                  <Image
                    src={img.src}
                    alt={tx(img.alt) || tx(folder.title)}
                    fill
                    sizes="(max-width: 720px) 75vw, (max-width: 1024px) 40vw, 280px"
                    quality={85}
                  />
                ) : (
                  <img
                    src={img.src}
                    alt={tx(img.alt) || tx(folder.title)}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {img.label && <span className="preview-tag">{img.label}</span>}
              </div>
            ))
          ) : (
            /* Editorial typographic & layout schematic cards when a folder has wireframe/upcoming slots */
            <div className="folder-editorial-stack">
              {(subProjects.length > 0 ? subProjects.slice(0, 2) : [folder]).map((item, idx) => (
                <div key={idx} className={`folder-wire-card wire-${idx + 1}`}>
                  <div className="wire-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="wire-body">
                    <span className="wire-kicker">
                      <Layers size={13} aria-hidden="true" />
                      {tx(item.cat || folder.shortTitle || folder.title)}
                    </span>
                    <strong className="wire-title">{tx(item.title)}</strong>
                    <p className="wire-desc">{tx(item.goal || folder.subtitle)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Front Glass Pocket Lip */}
        <div className="folder-front-lip">
          <div className="lip-shine" aria-hidden="true" />
          <div className="lip-meta">
            <span className="lip-hint">
              <Sparkles size={13} aria-hidden="true" />
              {isProjectFolder ? t('exploreGallery') : t('folderContents')}
            </span>
            <span className="lip-open-cta">
              {isProjectFolder ? t('openProject') : t('openFolder')}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Folder Editorial Footer */}
      <div className="folder-info">
        <div className="folder-title-row">
          <h3 className="folder-title">{tx(folder.title)}</h3>
          <span className="folder-route-link" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <p className="folder-desc">{tx(folder.subtitle || folder.goal || folder.description)}</p>

        {/* Sub-project pills or deliverable tags */}
        {subProjects.length > 0 ? (
          <div className="folder-tags">
            {subProjects.map((sp) => (
              <span key={sp.id} className="folder-tag-chip">
                <b>{sp.num}</b>
                {tx(sp.title)}
              </span>
            ))}
          </div>
        ) : folder.deliverables ? (
          <div className="folder-tags">
            {(folder.deliverables[lang] || folder.deliverables.en || []).slice(0, 3).map((d, i) => (
              <span key={i} className="folder-tag-chip">
                {d}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default memo(ProjectFolderCard);