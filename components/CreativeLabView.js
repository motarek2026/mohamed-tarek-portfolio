'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Film,
  Layers,
  Link2,
  Maximize2,
  Play,
  Sparkles,
  Upload,
  Video
} from 'lucide-react';
import { usePortfolio, parseVideoLink, socHref } from '@/context/PortfolioContext';
import { PROJECT_COLORS } from '@/data/projects';
import { AnimatedWords, NetworkSvg, ToolIconBadge } from './SharedUI';
import CreativeVideoPlayer from './CreativeVideoPlayer';
import ProjectFolderCard from './ProjectFolderCard';

export default function CreativeLabView() {
  const {
    site,
    projects,
    tools,
    lang,
    tx,
    t,
    editing,
    updateSiteField,
    pickFile,
    waBase,
    waLink,
    openProjectLightbox,
    openSingleImageLightbox
  } = usePortfolio();

  const [activeCat, setActiveCat] = useState('all');

  // Verified Video & Motion service definition from site.services
  const videoService = useMemo(() => {
    return (
      (site.services || []).find((s) => s.icon === 'video') || {
        title: { en: 'Video & Motion', ar: 'فيديو وموشن' },
        desc: {
          en: 'Short edits and motion for reels, ads and product launches.',
          ar: 'مونتاج وموشن قصير للريلز والإعلانات وإطلاق المنتجات.'
        },
        tags: { en: 'Reels · Ads · Edits', ar: 'ريلز · إعلانات · مونتاج' }
      }
    );
  }, [site.services]);

  // Curated list of verified projects with cinematic / motion / commercial storytelling
  const experimentItems = useMemo(() => {
    const pIphoneIdx = (projects || []).findIndex((p) => p.id === 'iphone-18-pro-max');
    const pSaudiIdx = (projects || []).findIndex((p) => p.id === 'saudi-national-day-96');

    const list = [
      {
        id: 'iphone-18-pro-max',
        slug: 'social-media-campaigns/iphone-18-pro-max',
        projectIndex: pIphoneIdx,
        imageIndex: 0,
        title: { en: 'iPhone 18 Pro Max', ar: 'آيفون 18 برو ماكس' },
        category: 'commercials',
        categoryKey: 'commercials',
        catLabel: { en: 'Commercial Launch & Motion Direction', ar: 'حملة إطلاق تجارية وإخراج موشن' },
        formatBadge: '16:9 & 4:5',
        desc: {
          en: 'Cinematic launch campaign highlighting the camera, display, and titanium body through bold, restrained motion grids.',
          ar: 'حملة إطلاق سينمائية تبرز الكاميرا والشاشة وهيكل التيتانيوم عبر شبكات موشن جريئة ومتماسكة.'
        },
        poster: '/projects/iphone-18-pro-max/01.jpg',
        color: '#7C3AED',
        ratio: '16/9'
      },
      {
        id: 'saudi-national-day-96',
        slug: 'social-media-campaigns/saudi-national-day-96',
        projectIndex: pSaudiIdx,
        imageIndex: 0,
        title: { en: 'Saudi National Day 96', ar: 'اليوم الوطني السعودي 96' },
        category: 'ai-motion',
        categoryKey: 'ai-motion',
        catLabel: { en: 'Cultural Posters & Motion Cues', ar: 'بوسترات ولمسات موشن ثقافية' },
        formatBadge: '9:16 Vertical',
        desc: {
          en: 'Cultural storytelling posters and kinetic Arabic calligraphy celebrating heritage and architectural identity.',
          ar: 'بوسترات بصرية وخط عربي حركي يحتفي بالتراث والهوية المعمارية بأسلوب معاصر.'
        },
        poster: '/projects/saudi-national-day-96/01.jpg',
        color: '#059669',
        ratio: '4/5'
      },
      {
        id: 'iphone-18-camera-macro',
        slug: 'social-media-campaigns/iphone-18-pro-max',
        projectIndex: pIphoneIdx,
        imageIndex: 1,
        title: { en: 'Telephoto Optics & Studio Macro', ar: 'بصريات التيليفوتو وتصوير الماكرو' },
        category: 'commercials',
        categoryKey: 'commercials',
        catLabel: { en: 'Studio Macro & Product Cues', ar: 'لقطات استوديو وإبراز تفاصيل المنتج' },
        formatBadge: '4:5 Social Ad',
        desc: {
          en: 'Dramatic studio lighting study focusing on multi-lens reflections and titanium edge curvature.',
          ar: 'دراسة إضاءة سينمائية تركز على انعكاسات العدسات وانحناءات حواف التيتانيوم.'
        },
        poster: '/projects/iphone-18-pro-max/02.jpg',
        color: '#0359D7',
        ratio: '4/5'
      },
      {
        id: 'saudi-national-day-arch',
        slug: 'social-media-campaigns/saudi-national-day-96',
        projectIndex: pSaudiIdx,
        imageIndex: 1,
        title: { en: 'Cultural Architecture & Horizon', ar: 'العمارة الثقافية والأفق المعماري' },
        category: 'ai-motion',
        categoryKey: 'ai-motion',
        catLabel: { en: 'Architectural Heritage Cut', ar: 'لقطة الهوية المعمارية والتراث' },
        formatBadge: '4:5 Feed',
        desc: {
          en: 'Modern architectural horizons paired with rich traditional textures in high-impact poster formats.',
          ar: 'آفاق معمارية حديثة تتكامل مع أنسجة تراثية في بوسترات ذات تأثير بصري عالي.'
        },
        poster: '/projects/saudi-national-day-96/02.jpg',
        color: '#10B981',
        ratio: '4/5'
      },
      {
        id: 'iphone-18-interface-motion',
        slug: 'social-media-campaigns/iphone-18-pro-max',
        projectIndex: pIphoneIdx,
        imageIndex: 3,
        title: { en: 'Interface & Dynamic Island Motion', ar: 'تفاعلات الواجهة والجزيرة التفاعلية' },
        category: 'digital-motion',
        categoryKey: 'digital-motion',
        catLabel: { en: 'UI/UX & Kinetic Prototype', ar: 'نموذج تفاعلي وتجربة واجهات' },
        formatBadge: '16:9 Prototype',
        desc: {
          en: 'System-level interface animations, fluid status transitions, and interactive touch pacing.',
          ar: 'حركات واجهة سلسة، وانتقالات ديناميكية للحالة، ومؤشرات تفاعل لمسي متقنة.'
        },
        poster: '/projects/iphone-18-pro-max/04.jpg',
        color: '#3B82F6',
        ratio: '16/9'
      },
      {
        id: 'saudi-national-day-ribbon',
        slug: 'social-media-campaigns/saudi-national-day-96',
        projectIndex: pSaudiIdx,
        imageIndex: 2,
        title: { en: 'Calligraphic Ribbon & Flow', ar: 'شريط الخط العربي الحركي' },
        category: 'ai-motion',
        categoryKey: 'ai-motion',
        catLabel: { en: 'Kinetic Calligraphy Ribbon', ar: 'حركة خط عربي انسيابية' },
        formatBadge: '9:16 Reel',
        desc: {
          en: 'Flowing Arabic letterforms structured for dynamic short-form video pacing and vertical canvases.',
          ar: 'حروف عربية انسيابية مهيأة لإيقاع الفيديو الطولي ومناسب لمنصات الريلز.'
        },
        poster: '/projects/saudi-national-day-96/03.jpg',
        color: '#047857',
        ratio: '4/5'
      },
      {
        id: 'iphone-18-display-spec',
        slug: 'social-media-campaigns/iphone-18-pro-max',
        projectIndex: pIphoneIdx,
        imageIndex: 5,
        title: { en: 'Digital Display & Refresh Motion', ar: 'حركة الشاشة ومعدل التحديث' },
        category: 'digital-motion',
        categoryKey: 'digital-motion',
        catLabel: { en: 'Digital Platform & Display Specs', ar: 'منصة رقمية ومواصفات العرض' },
        formatBadge: '16:9 Widescreen',
        desc: {
          en: 'High-frame-rate display demonstration with fluid scroll dynamics and adaptive typography.',
          ar: 'استعراض لمعدل التحديث المرتفع بانسيابية في التمرير وتناغم تايبوجرافي متكيف.'
        },
        poster: '/projects/iphone-18-pro-max/06.jpg',
        color: '#06B6D4',
        ratio: '16/9'
      },
      {
        id: 'iphone-18-cinema-dark',
        slug: 'social-media-campaigns/iphone-18-pro-max',
        projectIndex: pIphoneIdx,
        imageIndex: 4,
        title: { en: 'Dark Cinema Cut & Color Science', ar: 'اللقطة السينمائية الداكنة واللون' },
        category: 'commercials',
        categoryKey: 'commercials',
        catLabel: { en: 'Cinematic Grade & Color Tone', ar: 'تلوين سينمائي وتدرجات ضوئية' },
        formatBadge: '16:9 Cinema',
        desc: {
          en: 'High-dynamic-range color grading and optical flare control for premium cinema advertisements.',
          ar: 'تدرج لوني عالي الديناميكية مع التحكم بالانعكاسات الضوئية لإعلانات سينمائية راقية.'
        },
        poster: '/projects/iphone-18-pro-max/05.jpg',
        color: '#C026D3',
        ratio: '16/9'
      }
    ];

    // Append any standalone videos uploaded or linked in Edit Mode
    const labVideos = site.creativeLab?.videos || [];
    labVideos.forEach((v, idx) => {
      if (v && (v.src || v.embed)) {
        list.unshift({
          ...v,
          id: v.id || `lab-${idx}`,
          slug: null,
          projectIndex: -1,
          catLabel:
            v.category === 'reels'
              ? { en: 'Reels & Vertical', ar: 'ريلز وفيديو طولي' }
              : v.category === 'ads'
              ? { en: 'Commercial Ad', ar: 'إعلان تجاري' }
              : { en: 'Motion Edit', ar: 'مونتاج وموشن' },
          categoryKey: v.category === 'reels' ? 'reels-edits' : 'commercials',
          formatBadge: v.ratio ? v.ratio.replace('/', ':') : '16:9',
          desc: v.subtitle || { en: 'Experimental video edit and motion concept.', ar: 'عمل فيديو وموشن تجريبي.' },
          poster: v.poster || '/projects/iphone-18-pro-max/01.jpg',
          ratio: v.ratio || '16/9',
          isDirectVideo: true
        });
      }
    });

    return list;
  }, [projects, site.creativeLab]);

  // Featured Hero Project & Supporting Duo for the Editorial Layout
  const primaryFeatured = experimentItems[0];
  const supportingFeatured = experimentItems.slice(1, 3);

  // Standalone showreel (if uploaded via Edit Mode)
  const customShowreel = site.creativeLab?.showreel;
  const hasShowreel = Boolean(customShowreel && (customShowreel.src || customShowreel.embed));

  // Category filter tabs
  const categories = useMemo(
    () => [
      { id: 'all', label: t('catAllExperiments') },
      { id: 'ai-motion', label: t('catAiMotion') },
      { id: 'commercials', label: t('catCommercials') },
      { id: 'digital-motion', label: t('catDigitalMotion') }
    ],
    [t]
  );

  const filteredExperiments = useMemo(() => {
    if (activeCat === 'all') return experimentItems;
    return experimentItems.filter((item) => item.categoryKey === activeCat || item.category === activeCat);
  }, [experimentItems, activeCat]);

  // Social video channels
  const tiktokEntry = (site.socials || []).find((s) => s.id === 'tiktok' && s.value?.trim());
  const instagramEntry = (site.socials || []).find((s) => s.id === 'instagram' && s.value?.trim());
  const behanceEntry = (site.socials || []).find((s) => s.id === 'behance' && s.value?.trim());

  const tiktokUrl = tiktokEntry ? socHref('tiktok', tiktokEntry.value) : '';
  const instagramUrl = instagramEntry ? socHref('instagram', instagramEntry.value) : '';
  const behanceUrl = behanceEntry ? socHref('behance', behanceEntry.value) : '';

  // WhatsApp link for commissioning a video or motion project
  const baseWa = waBase();
  const whoName = tx(site.name).split(' ')[0];
  const videoWaMsg =
    lang === 'ar'
      ? `أهلاً ${whoName}، شفت صفحة المعمل الإبداعي (Creative Lab) وعايز أتكلم معاك عن مشروع فيديو أو موشن.`
      : `Hello ${whoName}, I visited your Creative Lab page and I'd like to discuss a video or motion project.`;
  const videoWaHref = baseWa
    ? `${baseWa}?text=${encodeURIComponent(videoWaMsg)}`
    : waLink();

  // Helper to open cinema lightbox for an item
  const handleOpenCinema = (item) => {
    if (item.projectIndex > -1) {
      openProjectLightbox(item.projectIndex, item.imageIndex || 0);
    } else if (item.poster) {
      openSingleImageLightbox(item.poster, tx(item.title));
    }
  };

  // Edit Mode video helpers
  const handleAddVideoLink = (isReel = false) => {
    const raw = window.prompt(t('linkPrompt'), 'https://');
    if (!raw) return;
    const parsed = parseVideoLink(raw);
    if (!parsed) {
      window.alert(t('badLink'));
      return;
    }
    const titlePrompt = window.prompt(
      lang === 'ar' ? 'عنوان الفيديو:' : 'Video title:',
      isReel ? 'Showreel 2026' : 'Motion Campaign Concept'
    );
    const entry = {
      id: (isReel ? 'reel-' : 'vid-') + Date.now(),
      title: {
        en: titlePrompt || 'Motion Project',
        ar: titlePrompt || 'عمل فيديو وموشن'
      },
      category: parsed.ratio === '9/16' ? 'reels' : 'ads',
      kind: parsed.kind,
      src: parsed.src || '',
      embed: parsed.embed || '',
      poster: '/projects/iphone-18-pro-max/01.jpg',
      ratio: parsed.ratio || '16/9'
    };

    updateSiteField((s) => {
      s.creativeLab = s.creativeLab || { showreel: null, videos: [] };
      if (isReel) {
        s.creativeLab.showreel = entry;
      } else {
        s.creativeLab.videos = [...(s.creativeLab.videos || []), entry];
      }
      return s;
    });
  };

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  // Verified Motion Focus Areas
  const focusCapabilities = [
    {
      id: 'reels',
      badge: '9:16 · Vertical',
      title: t('capReelsTitle'),
      desc: t('capReelsDesc'),
      color: '#7C3AED'
    },
    {
      id: 'ads',
      badge: '4:5 & 16:9 · Commercial',
      title: t('capAdsTitle'),
      desc: t('capAdsDesc'),
      color: '#0359D7'
    },
    {
      id: 'edits',
      badge: 'Cinematic Systems',
      title: t('capLaunchesTitle'),
      desc: t('capLaunchesDesc'),
      color: '#C026D3'
    }
  ];

  return (
    <div className="creative-lab-container" id="creative-lab-top">
      {/* ============================================================
          1. CINEMATIC HERO SECTION
          ============================================================ */}
      <section className="cl-hero">
        <div className="blob cl-hero-blob" aria-hidden="true" />
        <div className="wrap">
          <div className="about-hero-topbar">
            <Link href="/" className="folder-back-btn">
              <BackIcon size={18} />
              <span>{t('backToPortfolio')}</span>
            </Link>

            <span className="about-page-kicker">
              <Clapperboard size={15} />
              <span>{t('creativeLabBadge')}</span>
            </span>
          </div>

          <div className="cl-hero-grid">
            <div className="cl-hero-copy">
              <div className="cl-service-tags">
                <span className="cl-tag-pill">
                  <Sparkles size={13} />
                  <span>{tx(videoService.title)}</span>
                </span>
                <span className="cl-tag-pill subtle">AI Visuals · Reels · Commercial Ads</span>
              </div>

              <h1 className="cl-hero-title">
                <AnimatedWords text={t('creativeLabTitle')} />
              </h1>

              <p className="cl-hero-tagline">
                &ldquo;{t('creativeLabHeroTagline')}&rdquo;
              </p>

              <p className="cl-hero-lead">{t('creativeLabSubtitle')}</p>

              <div className="cl-hero-actions">
                {videoWaHref && (
                  <a
                    href={videoWaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn primary"
                  >
                    <NetworkSvg id="whatsapp" />
                    <span>{t('requestVideoProject')}</span>
                  </a>
                )}

                <a href="#cl-featured" className="btn ghost">
                  <span>{t('exploreExperiments')}</span>
                  <ArrowUpRight size={17} />
                </a>
              </div>

              {/* Verified Short-Form & Motion Channels */}
              {(tiktokUrl || instagramUrl || behanceUrl) && (
                <div className="cl-social-channels">
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cl-channel-pill"
                    >
                      <NetworkSvg id="tiktok" />
                      <span>{t('watchOnTiktok')}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cl-channel-pill"
                    >
                      <NetworkSvg id="instagram" />
                      <span>{t('watchOnInstagram')}</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  {behanceUrl && (
                    <a
                      href={behanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cl-channel-pill"
                    >
                      <NetworkSvg id="behance" />
                      <span>Behance</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Cinematic Lens & Production Spec Card */}
            <aside className="cl-hero-spec-card" aria-label={t('motionCapabilitiesTitle')}>
              <div className="cl-spec-head">
                <span className="cl-spec-kicker">
                  <Film size={15} />
                  <span>Motion & Video Direction</span>
                </span>
                <span className="cl-spec-year">2026</span>
              </div>

              {/* Interactive Hero Aperture Stage */}
              <div
                className="cl-hero-stage-preview"
                role="button"
                tabIndex={0}
                aria-label={`Preview ${tx(primaryFeatured.title)} in Cinema`}
                onClick={() => handleOpenCinema(primaryFeatured)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenCinema(primaryFeatured);
                  }
                }}
              >
                <Image
                  src={primaryFeatured.poster}
                  alt={tx(primaryFeatured.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  quality={90}
                  className="cl-hero-preview-img"
                />
                <div className="cl-stage-scrim" />
                <div className="cl-stage-lens-flare" aria-hidden="true" />

                <div className="cl-stage-center-play">
                  <span className="cl-stage-play-btn" aria-hidden="true">
                    <Play size={22} fill="currentColor" />
                  </span>
                  <span className="cl-stage-play-label">{t('cinemaPreview')}</span>
                </div>

                <div className="cl-stage-meta-row">
                  <span className="cl-stage-tag">{primaryFeatured.formatBadge}</span>
                  <span className="cl-stage-name">{tx(primaryFeatured.title)}</span>
                </div>
              </div>

              <div className="cl-spec-formats">
                <div className="cl-format-box">
                  <b>9:16</b>
                  <span>Reels & TikTok</span>
                </div>
                <div className="cl-format-box">
                  <b>4:5</b>
                  <span>Social Ads</span>
                </div>
                <div className="cl-format-box">
                  <b>16:9</b>
                  <span>Cinema 4K</span>
                </div>
              </div>

              <div className="cl-spec-tools">
                <span className="cl-spec-tools-label">{t('toolsSoftwareTitle')}</span>
                <div className="about-preview-tools" style={{ marginTop: '10px' }}>
                  <div className="mini">
                    {(tools || []).map((tl, i) => (
                      <span key={tl.id} translate="no">
                        <ToolIconBadge tool={tl} index={i} />
                        {tl.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. FEATURED EXPERIMENTS SHOWCASE (1 LARGE + 2 SUPPORTING)
          ============================================================ */}
      <section className="wrap cl-featured-section" id="cl-featured" aria-label={t('featuredExperimentsTitle')}>
        <div className="cs-section-head">
          <div>
            <span className="plabel">{t('creativeLabBadge')}</span>
            <h2 className="cs-sec-title" style={{ marginTop: '6px' }}>
              <Sparkles size={20} aria-hidden="true" />
              <span>{t('featuredExperimentsTitle')}</span>
            </h2>
            <p className="cl-sec-sub">{t('featuredExperimentsSub')}</p>
          </div>

          {editing && (
            <div className="cl-edit-bar">
              <button
                type="button"
                className="pill"
                onClick={() => pickFile({ type: 'labreel' }, false, 'video/*')}
              >
                <Upload size={14} />
                <span>{t('addVideo')}</span>
              </button>
              <button
                type="button"
                className="pill"
                onClick={() => handleAddVideoLink(true)}
              >
                <Link2 size={14} />
                <span>{t('addLink')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Featured Editorial Layout: 1 Large Widescreen Hero + 2 Supporting Cards */}
        <div className="cl-featured-layout">
          {/* Main Large Featured Project */}
          {primaryFeatured && (
            <article className="cl-feat-hero-card">
              <div
                className="cl-feat-hero-stage"
                role="button"
                tabIndex={0}
                aria-label={`Preview ${tx(primaryFeatured.title)} in Cinema`}
                onClick={() => handleOpenCinema(primaryFeatured)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenCinema(primaryFeatured);
                  }
                }}
              >
                <Image
                  src={primaryFeatured.poster}
                  alt={tx(primaryFeatured.title)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1160px"
                  quality={90}
                  priority
                  className="cl-feat-hero-img"
                />
                <div className="cl-feat-scrim" />
                <div className="cl-feat-lens-aura" aria-hidden="true" />

                <div className="cl-feat-hero-floating">
                  <span className="cl-feat-badge">
                    <Sparkles size={13} />
                    <span>Featured Commercial Direction · 2026</span>
                  </span>
                  <span className="cl-feat-ratio">{primaryFeatured.formatBadge}</span>
                </div>

                <div className="cl-feat-play-center">
                  <span className="cl-big-play-btn" aria-hidden="true">
                    <Play size={28} fill="currentColor" />
                  </span>
                  <span className="cl-play-tooltip">{t('cinemaPreview')}</span>
                </div>
              </div>

              <div className="cl-feat-hero-content">
                <div className="cl-feat-copy">
                  <span className="cl-feat-kicker">{tx(primaryFeatured.catLabel)}</span>
                  <h3 className="cl-feat-title">{tx(primaryFeatured.title)}</h3>
                  <p className="cl-feat-desc">{tx(primaryFeatured.desc)}</p>
                </div>

                <div className="cl-feat-actions">
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => handleOpenCinema(primaryFeatured)}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{t('cinemaPreview')}</span>
                  </button>

                  {primaryFeatured.slug && (
                    <Link href={`/projects/${primaryFeatured.slug}`} className="btn ghost">
                      <span>{t('viewCaseStudy')}</span>
                      <ArrowUpRight size={17} />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          )}

          {/* Two Supporting Featured Experiments */}
          <div className="cl-feat-supporting-grid">
            {supportingFeatured.map((item) => (
              <article key={item.id} className="cl-feat-sub-card">
                <div
                  className="cl-sub-stage"
                  role="button"
                  tabIndex={0}
                  aria-label={`Preview ${tx(item.title)} in Cinema`}
                  onClick={() => handleOpenCinema(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenCinema(item);
                    }
                  }}
                >
                  <Image
                    src={item.poster}
                    alt={tx(item.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    quality={88}
                    className="cl-sub-img"
                  />
                  <div className="cl-feat-scrim" />

                  <div className="cl-sub-floating">
                    <span className="cl-sub-kicker">{tx(item.catLabel)}</span>
                    <span className="cl-sub-format">{item.formatBadge}</span>
                  </div>

                  <div className="cl-sub-play-overlay">
                    <span className="cl-sub-play-btn" aria-hidden="true">
                      <Play size={20} fill="currentColor" />
                    </span>
                  </div>
                </div>

                <div className="cl-sub-content">
                  <h4 className="cl-sub-title">{tx(item.title)}</h4>
                  <p className="cl-sub-desc">{tx(item.desc)}</p>

                  <div className="cl-sub-actions">
                    <button
                      type="button"
                      className="cl-action-pill"
                      onClick={() => handleOpenCinema(item)}
                    >
                      <Play size={13} fill="currentColor" />
                      <span>{t('cinemaPreview')}</span>
                    </button>

                    {item.slug && (
                      <Link href={`/projects/${item.slug}`} className="cl-action-pill subtle">
                        <span>{t('viewCaseStudy')}</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. FEATURED SHOWREEL PLAYER (When real showreel is present or in Edit Mode)
          ============================================================ */}
      {(hasShowreel || editing) && (
        <section className="wrap cl-showreel-section" aria-label={t('featuredShowreel')}>
          <div className="cs-section-head">
            <h2 className="cs-sec-title">
              <Video size={20} aria-hidden="true" />
              <span>{t('featuredShowreel')}</span>
            </h2>

            {editing && (
              <div className="cl-edit-bar">
                <button
                  type="button"
                  className="pill"
                  onClick={() => pickFile({ type: 'labreel' }, false, 'video/*')}
                >
                  <Upload size={14} />
                  <span>{t('addVideo')}</span>
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => handleAddVideoLink(true)}
                >
                  <Link2 size={14} />
                  <span>{t('addLink')}</span>
                </button>
              </div>
            )}
          </div>

          <CreativeVideoPlayer
            video={customShowreel}
            isShowreel={true}
            onUploadClick={() => pickFile({ type: 'labreel' }, false, 'video/*')}
            onAddLinkClick={() => handleAddVideoLink(true)}
            onRemoveClick={
              site.creativeLab?.showreel
                ? () =>
                    updateSiteField((s) => {
                      if (s.creativeLab) s.creativeLab.showreel = null;
                      return s;
                    })
                : undefined
            }
          />
        </section>
      )}

      {/* ============================================================
          4. EXPERIMENTAL MOTION GALLERY & ANIMATED CATEGORIES
          ============================================================ */}
      <section className="wrap cl-gallery-section" id="cl-experiments" aria-label={t('experimentalGalleryTitle')}>
        <div className="cl-gallery-header">
          <div>
            <span className="plabel">{tx(videoService.tags)}</span>
            <h2 className="cs-sec-title" style={{ marginTop: '6px' }}>
              <Film size={20} aria-hidden="true" />
              <span>{t('experimentalGalleryTitle')}</span>
              <small>({filteredExperiments.length})</small>
            </h2>
            <p className="cl-sec-sub">{t('experimentalGallerySub')}</p>
          </div>

          <div className="cl-filter-row">
            <div className="filters" style={{ marginTop: 0 }} role="tablist">
              {categories.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? experimentItems.length
                    : experimentItems.filter(
                        (it) => it.categoryKey === cat.id || it.category === cat.id
                      ).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCat === cat.id}
                    className={`fchip ${activeCat === cat.id ? 'on' : ''}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <sup>{count}</sup>
                  </button>
                );
              })}
            </div>

            {editing && (
              <div className="cl-edit-bar">
                <button
                  type="button"
                  className="pill"
                  onClick={() =>
                    pickFile(
                      { type: 'labvid', category: activeCat === 'all' ? 'reels' : activeCat },
                      true,
                      'video/*'
                    )
                  }
                >
                  <Upload size={14} />
                  <span>{t('addVideo')}</span>
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => handleAddVideoLink(false)}
                >
                  <Link2 size={14} />
                  <span>{t('addLink')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Experiments & Motion Cards Grid */}
        <div className="cl-experiment-cards-grid">
          {filteredExperiments.map((item) => (
            <article key={item.id} className="cl-concept-card" style={{ '--card-acc': item.color }}>
              <div
                className="cl-concept-thumb-stage"
                role="button"
                tabIndex={0}
                aria-label={`Preview ${tx(item.title)} in Cinema`}
                onClick={() => handleOpenCinema(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenCinema(item);
                  }
                }}
              >
                <Image
                  src={item.poster}
                  alt={tx(item.title)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  quality={88}
                  className="cl-concept-img"
                />
                <div className="cl-concept-overlay" />

                <div className="cl-concept-top-row">
                  <span className="cl-concept-tag">{tx(item.catLabel)}</span>
                  <span className="cl-concept-ratio">{item.formatBadge}</span>
                </div>

                <div className="cl-concept-play-trigger" aria-hidden="true">
                  <span className="cl-concept-play-circle">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>
              </div>

              <div className="cl-concept-body">
                <h4 className="cl-concept-title">{tx(item.title)}</h4>
                <p className="cl-concept-desc">{tx(item.desc)}</p>

                <div className="cl-concept-actions">
                  <button
                    type="button"
                    className="cl-action-pill"
                    onClick={() => handleOpenCinema(item)}
                    aria-label={`${t('cinemaPreview')}: ${tx(item.title)}`}
                  >
                    <Maximize2 size={13} />
                    <span>{t('cinemaPreview')}</span>
                  </button>

                  {item.slug && (
                    <Link
                      href={`/projects/${item.slug}`}
                      className="cl-action-pill subtle"
                      aria-label={`${t('viewCaseStudy')}: ${tx(item.title)}`}
                    >
                      <span>{t('viewCaseStudy')}</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================
          5. MOTION CAPABILITIES & PRODUCTION PILLARS
          ============================================================ */}
      <section className="wrap cl-capabilities-section" aria-label={t('motionCapabilitiesTitle')}>
        <div className="cs-section-head">
          <div>
            <span className="plabel">{tx(videoService.title)}</span>
            <h2 className="cs-sec-title" style={{ marginTop: '6px' }}>
              <Layers size={20} aria-hidden="true" />
              <span>{t('motionCapabilitiesTitle')}</span>
            </h2>
            <p className="cl-sec-sub">
              {tx(videoService.desc)}
            </p>
          </div>
        </div>

        <div className="cl-capabilities-grid">
          {focusCapabilities.map((cap, idx) => (
            <div key={cap.id} className="cl-cap-card" style={{ '--fc': cap.color }}>
              <div className="cl-cap-top">
                <span className="cl-cap-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="cl-cap-badge">{cap.badge}</span>
              </div>
              <h3 className="cl-cap-title">{cap.title}</h3>
              <p className="cl-cap-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          6. PROJECT COMMISSIONING CTA
          ============================================================ */}
      <section className="wrap cs-project-cta-wrap">
        <div className="cs-project-cta-card cl-cta-card">
          <div className="cs-cta-copy">
            <span className="plabel">{tx(videoService.title)}</span>
            <h2 className="cs-cta-title">{t('videoCtaTitle')}</h2>
            <p className="cs-cta-desc">{t('videoCtaDesc')}</p>
          </div>

          <div className="cs-cta-actions">
            {videoWaHref && (
              <a
                href={videoWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="wacta"
              >
                <NetworkSvg id="whatsapp" />
                <span>{t('requestVideoProject')}</span>
              </a>
            )}
            <Link href="/start-project?service=video" className="btn ghost">
              <span>{t('startProject')}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
