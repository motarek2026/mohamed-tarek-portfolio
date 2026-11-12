'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Upload,
  Link2,
  Sparkles,
  Trash2
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function CreativeVideoPlayer({
  video,
  isShowreel = false,
  onUploadClick,
  onAddLinkClick,
  onRemoveClick
}) {
  const { t, tx, editing, openVideoLightbox, openSingleImageLightbox } = usePortfolio();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const hasDirectVideo = !!(video && video.kind !== 'embed' && video.src && !hasError);
  const hasEmbedVideo = !!(video && video.kind === 'embed' && video.embed && !hasError);
  const hasRealMedia = hasDirectVideo || hasEmbedVideo;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasDirectVideo || typeof window === 'undefined') return;

    const pauseIfHidden = () => {
      if (document.hidden && !el.paused) {
        el.pause();
        setIsPlaying(false);
      }
    };

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          const inView = entries[0]?.isIntersecting ?? true;
          if (!inView && !el.paused) {
            el.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.1 }
      );
      io.observe(el);
    }

    document.addEventListener('visibilitychange', pauseIfHidden);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', pauseIfHidden);
    };
  }, [hasDirectVideo, video?.src]);

  const title = tx(video?.title) || t('videoStandbyTitle');
  const subtitle = tx(video?.subtitle) || t('videoStandbyDesc');
  const badge = tx(video?.badge) || t('videoStandbyBadge');
  const poster = video?.poster || '/projects/iphone-18-pro-max/01.jpg';
  const ratio = video?.ratio || (isShowreel ? '16/9' : '16/9');

  const handleTogglePlay = async (e) => {
    if (e) e.stopPropagation();
    const el = videoRef.current;
    if (!el || !hasDirectVideo) return;
    try {
      if (el.paused) {
        await el.play();
        setIsPlaying(true);
      } else {
        el.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    const el = videoRef.current;
    if (!el || !hasDirectVideo) {
      setIsMuted((prev) => !prev);
      return;
    }
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  const handleOpenCinema = (e) => {
    if (e) e.stopPropagation();
    if (hasDirectVideo && video.src) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      openVideoLightbox(video.src, title);
    } else if (poster) {
      openSingleImageLightbox(poster, title);
    }
  };

  return (
    <article
      className={`cl-player-card ${isShowreel ? 'is-showreel' : ''} ${
        hasRealMedia ? 'has-media' : 'is-standby'
      }`.trim()}
      style={{ '--v-ratio': ratio }}
    >
      <div className="cl-player-stage" style={{ aspectRatio: ratio }}>
        {hasEmbedVideo ? (
          <iframe
            src={video.embed}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="cl-player-iframe"
          />
        ) : hasDirectVideo ? (
          <>
            <video
              ref={videoRef}
              src={video.src}
              poster={poster}
              preload="none"
              playsInline
              muted={isMuted}
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              className="cl-player-video"
            />

            {!isPlaying && (
              <button
                type="button"
                className="cl-big-play"
                aria-label={`${t('playVideo')}: ${title}`}
                onClick={handleTogglePlay}
              >
                <Play size={28} fill="currentColor" />
              </button>
            )}
          </>
        ) : (
          /* Accessible Standby / Fallback Stage when no video file has been uploaded yet */
          <div className="cl-standby-stage">
            {poster && poster.startsWith('/') && (
              <div className="cl-standby-backdrop" aria-hidden="true">
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 95vw, 960px"
                  quality={82}
                  className="cl-standby-bg-img"
                />
                <div className="cl-standby-scrim" />
              </div>
            )}

            <div className="cl-standby-content">
              <span className="cl-standby-pill">
                <Sparkles size={14} aria-hidden="true" />
                <span>{badge}</span>
              </span>

              <div className="cl-standby-icon-ring" aria-hidden="true">
                <Film size={28} />
              </div>

              <h3 className="cl-standby-title">{title}</h3>
              <p className="cl-standby-desc">{subtitle}</p>
              <span className="cl-standby-hint">{t('videoStandbyHint')}</span>

              {editing && (
                <div className="cl-standby-edit-actions">
                  {onUploadClick && (
                    <button
                      type="button"
                      className="btn primary"
                      onClick={onUploadClick}
                    >
                      <Upload size={16} />
                      <span>{t('addVideo')}</span>
                    </button>
                  )}
                  {onAddLinkClick && (
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={onAddLinkClick}
                    >
                      <Link2 size={16} />
                      <span>{t('addLink')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Player Control Bar */}
      <div className="cl-player-bar">
        <div className="cl-bar-left">
          <button
            type="button"
            className="cl-ctrl-btn"
            aria-label={isPlaying ? t('pauseVideo') : t('playVideo')}
            title={isPlaying ? t('pauseVideo') : t('playVideo')}
            disabled={!hasDirectVideo}
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? t('pauseVideo') : t('playVideo')}</span>
          </button>

          <button
            type="button"
            className="cl-ctrl-btn"
            aria-label={isMuted ? t('unmuteVideo') : t('muteVideo')}
            title={isMuted ? t('unmuteVideo') : t('muteVideo')}
            disabled={!hasDirectVideo}
            onClick={handleToggleMute}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="cl-bar-meta">
            <strong>{title}</strong>
            {video?.catLabel && <span>{tx(video.catLabel)}</span>}
          </div>
        </div>

        <div className="cl-bar-right">
          {ratio && (
            <span className="cl-ratio-tag" title={t('ratioLabel')}>
              {ratio.replace('/', ':')}
            </span>
          )}

          <button
            type="button"
            className="cl-ctrl-btn"
            aria-label={t('openInCinema')}
            title={t('openInCinema')}
            onClick={handleOpenCinema}
          >
            <Maximize2 size={15} />
            <span className="cl-ctrl-label-hide-sm">{t('openInCinema')}</span>
          </button>

          {editing && onRemoveClick && (
            <button
              type="button"
              className="cl-ctrl-btn danger"
              aria-label={t('del')}
              title={t('del')}
              onClick={onRemoveClick}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
