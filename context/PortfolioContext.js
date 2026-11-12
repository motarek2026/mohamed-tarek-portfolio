'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { INITIAL_SITE_DATA, DESIGN_TOOLS, SOCIAL_NETWORKS } from '@/data/siteData';
import { INITIAL_PROJECTS, PROJECT_COLORS } from '@/data/projects';
import { CATEGORIES } from '@/data/categories';
import { STR } from '@/data/translations';

const PortfolioContext = createContext(null);

export function intlDigits(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (/^01\d{9}$/.test(d)) d = '20' + d.slice(1);
  return d;
}

export function socHref(id, v) {
  v = (v || '').trim();
  if (!v) return '';
  if (id === 'email') return /^mailto:/i.test(v) ? v : 'mailto:' + v;
  if (id === 'phone') {
    const d = intlDigits(v);
    return d ? 'tel:+' + d : '';
  }
  if (id === 'whatsapp') return /^https?:\/\//i.test(v) ? v : 'https://wa.me/' + intlDigits(v);
  if (/^https?:\/\//i.test(v)) return v;
  if ((id === 'instagram' || id === 'tiktok') && /^@?[\w.]+$/.test(v)) {
    const h = v.replace('@', '');
    return id === 'instagram' ? 'https://instagram.com/' + h : 'https://www.tiktok.com/@' + h;
  }
  return 'https://' + v.replace(/^\/\//, '');
}

export function parseVideoLink(u) {
  u = (u || '').trim();
  if (!/^https?:\/\//i.test(u)) return null;
  let m;
  const E = (embed, ratio) => ({
    type: 'video',
    kind: 'embed',
    embed,
    url: u,
    ratio,
    cs: ratio === '9/16' ? 1 : 2,
    fit: 'cover'
  });
  if ((m = u.match(/youtube\.com\/shorts\/([\w-]{6,})/)))
    return E('https://www.youtube.com/embed/' + m[1] + '?rel=0&playsinline=1', '9/16');
  if ((m = u.match(/(?:youtu\.be\/|youtube\.com\/watch\?(?:[^#]*&)?v=|youtube\.com\/embed\/)([\w-]{6,})/)))
    return E('https://www.youtube.com/embed/' + m[1] + '?rel=0&playsinline=1', '16/9');
  if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
    return E('https://player.vimeo.com/video/' + m[1], '16/9');
  if ((m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
    return E('https://drive.google.com/file/d/' + m[1] + '/preview', '16/9');
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u))
    return { type: 'video', kind: 'direct', src: u, ratio: '16/9', cs: 2, fit: 'cover' };
  return E(u, '16/9');
}

function openIdb() {
  return new Promise((res, rej) => {
    try {
      const r = indexedDB.open('mt-portfolio', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) {
      rej(e);
    }
  });
}

async function idbGet(k) {
  const db = await openIdb();
  return new Promise((res, rej) => {
    const q = db.transaction('kv').objectStore('kv').get(k);
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}

async function idbSet(k, v) {
  const db = await openIdb();
  return new Promise((res, rej) => {
    const tr = db.transaction('kv', 'readwrite');
    tr.objectStore('kv').put(v, k);
    tr.oncomplete = () => res();
    tr.onerror = () => rej(tr.error);
  });
}

function fileToData(file, max) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new window.Image();
      im.onload = () => {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        const x = c.getContext('2d');
        x.fillStyle = '#fff';
        x.fillRect(0, 0, c.width, c.height);
        x.drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.86));
      };
      im.onerror = rej;
      im.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

function blobToData(b) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(b);
  });
}

function fileToLogo(file, max) {
  if (/svg/.test(file.type)) return blobToData(file);
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new window.Image();
      im.onload = () => {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/png'));
      };
      im.onerror = rej;
      im.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

function analyzeLogo(src) {
  return new Promise((res) => {
    const im = new window.Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 48;
      const x = c.getContext('2d');
      x.drawImage(im, 0, 0, 48, 48);
      const d = x.getImageData(0, 0, 48, 48).data;
      let s = 0,
        n = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 60) {
          s += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
          n++;
        }
      }
      const l = n ? s / n : 0.5;
      res(l > 0.8 ? 'light' : l < 0.25 ? 'dark' : 'color');
    };
    im.onerror = () => res('color');
    im.src = src;
  });
}

function slugify(str) {
  return (
    String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'project-' + Date.now()
  );
}

function inferFolderId(proj) {
  if (proj.folderId && CATEGORIES.some((c) => c.id === proj.folderId)) return proj.folderId;
  const catEn = ((proj.cat && proj.cat.en) || '') + ' ' + ((proj.title && proj.title.en) || '');
  if (proj.type === 'uiux' || /ui\/?ux|website|app|dashboard/i.test(catEn)) return 'website-ui-ux';
  if (proj.type === 'branding' || /brand|identity|logo/i.test(catEn)) return 'branding-identity';
  if (/cleanser|starville|product|packaging|facial/i.test(catEn)) return 'product-advertising';
  return 'social-media-campaigns';
}

function normalizeLoadedState(saved) {
  const site = { ...INITIAL_SITE_DATA, ...(saved.site || {}) };
  if (!site.photo || site.photo.startsWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD')) {
    site.photo = INITIAL_SITE_DATA.photo;
  }
  if (!site.logo || site.logo.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAFz')) {
    site.logo = INITIAL_SITE_DATA.logo;
  }
  if (!site.cv) {
    site.cv = INITIAL_SITE_DATA.cv;
  }

  const rawProjects = Array.isArray(saved.projects) ? saved.projects : INITIAL_PROJECTS;
  const projects = rawProjects.map((p, idx) => {
    const seedMatch = INITIAL_PROJECTS.find(
      (sp) => sp.id === p.id || (sp.title && p.title && sp.title.en === p.title.en)
    );
    const id = p.id || (seedMatch ? seedMatch.id : slugify(p.title?.en || `project-${idx + 1}`));
    const slug = p.slug || id;
    const color = p.color || (seedMatch ? seedMatch.color : PROJECT_COLORS[idx % PROJECT_COLORS.length]);

    let images = Array.isArray(p.images) ? p.images : [];
    images = images.map((it, k) => {
      if (typeof it === 'string') return { type: 'img', src: it, cs: 1, ratio: 'inherit', fit: 'cover' };
      const item = { type: 'img', src: '', cs: 1, ratio: 'inherit', fit: 'cover', ...it };
      // Replace base64 from original seed with extracted public path if matching seed project
      if (seedMatch && seedMatch.images[k] && seedMatch.images[k].src) {
        if (item.src && item.src.startsWith('data:image/')) {
          item.src = seedMatch.images[k].src;
        }
        if (item.src === seedMatch.images[k].src) {
          item.width = seedMatch.images[k].width;
          item.height = seedMatch.images[k].height;
          if (!item.alt || typeof item.alt === 'string') {
            item.alt = seedMatch.images[k].alt;
          }
        }
      }
      return item;
    });

    // If saved project was empty but seed project has extracted images, use seed images
    if (seedMatch && seedMatch.images.some((x) => x.src) && images.every((x) => !x.src)) {
      images = seedMatch.images;
    }

    const firstImg = images.find((x) => x.type === 'img' && x.src);
    return {
      ...seedMatch,
      ...p,
      id,
      slug,
      color,
      folderId: inferFolderId({ ...seedMatch, ...p }),
      cols: p.cols || (seedMatch ? seedMatch.cols : 3),
      ratio: p.ratio || (seedMatch ? seedMatch.ratio : 'auto'),
      align: p.align || 'start',
      meta: Array.isArray(p.meta) ? p.meta : [],
      thumbnail: firstImg ? firstImg.src : '',
      images
    };
  });

  return { site, projects };
}

export function PortfolioProvider({
  children,
  initialSite,
  initialProjects,
  initialAppearance,
  initialCategories,
  initialTranslations
}) {
  const canEdit = process.env.NEXT_PUBLIC_ENABLE_EDIT === 'true';
  const [lang, setLangState] = useState('en');
  const [theme, setThemeState] = useState(initialAppearance?.defaultTheme || 'dark');
  const [site, setSite] = useState(initialSite || INITIAL_SITE_DATA);
  const [projects, setProjects] = useState(initialProjects || INITIAL_PROJECTS);
  const [categories, setCategories] = useState(initialCategories || CATEGORIES);
  const [translations, setTranslations] = useState(initialTranslations || STR);
  const [appearance, setAppearance] = useState(initialAppearance || null);
  const [editingState, setEditingState] = useState(false);
  const editing = canEdit ? editingState : false;
  const setEditing = useCallback(
    (next) => {
      if (!canEdit) return;
      setEditingState(next);
    },
    [canEdit]
  );
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(null);
  const [preselectedService, setPreselectedService] = useState(null);
  const [activeFolderSlug, setActiveFolderSlug] = useState(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    projectIndex: 0,
    imageIndex: 0,
    items: [],
    title: '',
    videoSrc: null
  });

  const fileInputRef = useRef(null);
  const pendingFileRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Hydrate preferences & IndexedDB state
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('mt_lang');
      if (savedLang === 'ar' || savedLang === 'en') {
        setLangState(savedLang);
      } else if (/^ar/i.test(navigator.language || '')) {
        setLangState('ar');
      }

      const savedTheme = localStorage.getItem('mt_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else if (!initialAppearance?.defaultTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(prefersDark ? 'dark' : 'light');
      }
    } catch (e) {}

    // Only load from IndexedDB if in Edit Mode (NEXT_PUBLIC_ENABLE_EDIT === 'true')
    // to prevent local browser cache from clobbering published Supabase content
    if (canEdit) {
      idbGet('state')
        .then((saved) => {
          if (saved && saved.projects) {
            const norm = normalizeLoadedState(saved);
            setSite(norm.site);
            setProjects(norm.projects);
          }
        })
        .catch(() => {});
    }
  }, [canEdit, initialAppearance]);

  // Sync lang & dir to <html> and home page metadata
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const nextTitle =
        lang === 'ar'
          ? 'محمد طارق — بورتفوليو 2026 | مصمم جرافيك و UI/UX'
          : 'Mohamed Tarek — Portfolio 2026 | Graphic Designer & UI/UX Designer';
      const nextDesc =
        lang === 'ar'
          ? 'بورتفوليو 2026 لمحمد طارق — مصمم جرافيك و UI/UX. أصمّم حملات سوشيال ميديا، هويات بصرية، ومواقع عربية وإنجليزية تبدو واضحة وواثقة وسهلة الاستخدام.'
          : 'Portfolio 2026 of Mohamed Tarek — Graphic Designer & UI/UX Designer. I design social media campaigns, brand identities, visuals, and bilingual Arabic/English websites that feel clear, confident, and easy to use.';
      document.title = nextTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', nextDesc);
    }
  }, [lang]);

  // Sync theme to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.theme = theme;
  }, [theme]);

  // Sync body classes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('editing', editing);
  }, [editing]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const persistState = useCallback((nextSite, nextProjects) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      idbSet('state', {
        savedAt: Date.now(),
        layoutV: 2,
        site: nextSite,
        projects: nextProjects
      }).catch(() => {});
    }, 300);
  }, []);

  const setLang = useCallback((next) => {
    setLangState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next;
      try {
        localStorage.setItem('mt_lang', val);
      } catch (e) {}
      return val;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, [setLang]);

  const setTheme = useCallback((next) => {
    setThemeState((prev) => {
      const val = typeof next === 'function' ? next(prev) : next;
      try {
        localStorage.setItem('mt_theme', val);
      } catch (e) {}
      return val;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const tx = useCallback(
    (obj) => {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[lang] || obj.en || '';
    },
    [lang]
  );

  const t = useCallback(
    (key) => {
      const dict = translations || STR;
      return (
        (dict[lang] && dict[lang][key]) ||
        (dict.en && dict.en[key]) ||
        (STR[lang] && STR[lang][key]) ||
        STR.en[key] ||
        key
      );
    },
    [lang, translations]
  );

  // Update any bilingual or direct path in site or projects
  const updateLocalizedPath = useCallback(
    (path, textValue) => {
      const parts = path.split('.');
      if (parts[0] === 'site') {
        setSite((prev) => {
          const clone = structuredClone(prev);
          let cur = clone;
          for (let i = 1; i < parts.length - 1; i++) {
            cur = cur[parts[i]];
          }
          const last = parts[parts.length - 1];
          if (cur && cur[last] && typeof cur[last] === 'object') {
            cur[last][lang] = textValue;
          } else if (cur) {
            cur[last] = { ...(cur[last] || {}), [lang]: textValue };
          }
          persistState(clone, projects);
          return clone;
        });
      } else if (parts[0] === 'projects') {
        setProjects((prev) => {
          const clone = structuredClone(prev);
          let cur = clone;
          for (let i = 1; i < parts.length - 1; i++) {
            cur = cur[parts[i]];
          }
          const last = parts[parts.length - 1];
          if (cur && cur[last] && typeof cur[last] === 'object') {
            cur[last][lang] = textValue;
          } else if (cur) {
            cur[last] = { ...(cur[last] || {}), [lang]: textValue };
          }
          persistState(site, clone);
          return clone;
        });
      }
    },
    [lang, site, projects, persistState]
  );

  const updateSiteField = useCallback(
    (updater) => {
      setSite((prev) => {
        const next = typeof updater === 'function' ? updater(structuredClone(prev)) : { ...prev, ...updater };
        persistState(next, projects);
        return next;
      });
    },
    [projects, persistState]
  );

  const updateProjects = useCallback(
    (updater) => {
      setProjects((prev) => {
        const next = typeof updater === 'function' ? updater(structuredClone(prev)) : updater;
        persistState(site, next);
        return next;
      });
    },
    [site, persistState]
  );

  const waBase = useCallback(() => {
    const s = (site.socials || []).find((x) => x.id === 'whatsapp');
    if (!s || !s.value.trim()) return '';
    const v = s.value.trim();
    if (/^https?:\/\//i.test(v)) return v.split('?')[0];
    const num = intlDigits(v);
    return num ? 'https://wa.me/' + num : '';
  }, [site.socials]);

  const waLink = useCallback(() => {
    const s = (site.socials || []).find((x) => x.id === 'whatsapp');
    if (!s || !s.value.trim()) return '';
    const v = s.value.trim();
    if (/^https?:\/\//i.test(v)) return v;
    const num = intlDigits(v);
    return num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(tx(site.waMsg)) : '';
  }, [site.socials, site.waMsg, tx]);

  // Lightbox actions
  const openProjectLightbox = useCallback(
    (pIdx, kIdx) => {
      const proj = projects[pIdx];
      if (!proj) return;
      const list = [];
      (proj.images || []).forEach((it, idx) => {
        if (it.type === 'img' && it.src) {
          list.push({ k: idx, src: it.src, alt: tx(it.alt) || tx(proj.title) });
        }
      });
      if (!list.length) return;
      const foundIdx = Math.max(
        0,
        list.findIndex((x) => x.k === kIdx)
      );
      setLightbox({
        isOpen: true,
        projectIndex: pIdx,
        imageIndex: foundIdx,
        items: list,
        title: tx(proj.title),
        videoSrc: null
      });
    },
    [projects, tx]
  );

  const openSingleImageLightbox = useCallback((src, title = '') => {
    if (!src) return;
    setLightbox({
      isOpen: true,
      projectIndex: -1,
      imageIndex: 0,
      items: [{ k: 0, src, alt: title }],
      title,
      videoSrc: null
    });
  }, []);

  const openVideoLightbox = useCallback((videoSrc, title = '') => {
    if (!videoSrc) return;
    setLightbox({
      isOpen: true,
      projectIndex: -1,
      imageIndex: 0,
      items: [],
      title,
      videoSrc
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, isOpen: false, videoSrc: null }));
  }, []);

  const stepLightbox = useCallback(
    (dir) => {
      setLightbox((prev) => {
        const n = prev.items.length;
        if (n < 2) return prev;
        const logical = lang === 'ar' ? -dir : dir;
        const nextIdx = (prev.imageIndex + logical + n) % n;
        return { ...prev, imageIndex: nextIdx, direction: dir > 0 ? 'fr' : 'fl' };
      });
    },
    [lang]
  );

  const selectLightboxIndex = useCallback((idx) => {
    setLightbox((prev) => {
      if (idx < 0 || idx >= prev.items.length || idx === prev.imageIndex) return prev;
      return {
        ...prev,
        imageIndex: idx,
        direction: idx > prev.imageIndex ? 'fr' : 'fl'
      };
    });
  }, []);

  // File picker helper for Edit Mode
  const pickFile = useCallback((pendingAction, multiple = false, accept = 'image/*') => {
    pendingFileRef.current = pendingAction;
    if (fileInputRef.current) {
      fileInputRef.current.multiple = !!multiple;
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const files = [...(e.target.files || [])];
      e.target.value = '';
      const pending = pendingFileRef.current;
      if (!files.length || !pending) return;

      try {
        if (pending.type === 'cv') {
          if (files[0].size > 4 * 1048576) {
            alert(t('cvBig'));
          } else {
            const data = await blobToData(files[0]);
            updateSiteField((s) => {
              s.cv = { name: files[0].name, data };
              return s;
            });
          }
        } else if (pending.type === 'logo') {
          const d = await fileToLogo(files[0], 480);
          const tone = await analyzeLogo(d);
          updateSiteField((s) => {
            s.logo = d;
            s.logoV = Date.now();
            s.logoLight = tone === 'light';
            s.logoInv = tone === 'dark';
            return s;
          });
        } else if (pending.type === 'photo') {
          const d = await fileToData(files[0], 1100);
          updateSiteField((s) => {
            s.photo = d;
            s.photoV = Date.now();
            return s;
          });
        } else if (pending.type === 'client') {
          const added = [];
          for (const f of files) {
            if (!/^image\//.test(f.type)) continue;
            const src = await fileToLogo(f, 360);
            const nm = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
            added.push({ name: { en: nm, ar: nm }, logo: src });
          }
          if (added.length) {
            updateSiteField((s) => {
              s.clients = [...(s.clients || []), ...added];
              return s;
            });
          }
        } else if (pending.type === 'tmavatar') {
          const d = await fileToData(files[0], 400);
          updateSiteField((s) => {
            if (s.testimonials[pending.i]) s.testimonials[pending.i].avatar = d;
            return s;
          });
        } else if (pending.type === 'tmshot') {
          const d = await fileToData(files[0], 1400);
          updateSiteField((s) => {
            if (s.testimonials[pending.i]) s.testimonials[pending.i].shot = d;
            return s;
          });
        } else if (pending.type === 'img') {
          const d = await fileToData(files[0], 2000);
          updateProjects((list) => {
            if (list[pending.p] && list[pending.p].images[pending.k]) {
              list[pending.p].images[pending.k].src = d;
              const first = list[pending.p].images.find((x) => x.type === 'img' && x.src);
              list[pending.p].thumbnail = first ? first.src : '';
            }
            return list;
          });
        } else if (pending.type === 'add') {
          const dataUrls = [];
          for (const f of files) {
            if (!/^image\//.test(f.type)) continue;
            dataUrls.push(await fileToData(f, 2000));
          }
          if (dataUrls.length) {
            updateProjects((list) => {
              const proj = list[pending.p];
              if (!proj) return list;
              for (const src of dataUrls) {
                const emptyIdx = proj.images.findIndex((x) => x.type === 'img' && !x.src);
                if (emptyIdx > -1) {
                  proj.images[emptyIdx].src = src;
                } else {
                  proj.images.push({ type: 'img', src, cs: 1, ratio: 'inherit', fit: 'cover' });
                }
              }
              const first = proj.images.find((x) => x.type === 'img' && x.src);
              proj.thumbnail = first ? first.src : '';
              return list;
            });
          }
        } else if (pending.type === 'addvid') {
          for (const f of files) {
            if (!/^video\//.test(f.type)) continue;
            const dataUrl = await blobToData(f);
            updateProjects((list) => {
              const proj = list[pending.p];
              if (!proj) return list;
              const item = { type: 'video', kind: 'direct', src: dataUrl, ratio: '16/9', cs: 2, fit: 'cover' };
              const emptyIdx = proj.images.findIndex((x) => x.type === 'img' && !x.src);
              if (emptyIdx > -1) proj.images[emptyIdx] = item;
              else proj.images.push(item);
              return list;
            });
          }
        } else if (pending.type === 'labreel') {
          if (files[0] && /^video\//.test(files[0].type)) {
            const dataUrl = await blobToData(files[0]);
            const nm = files[0].name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
            updateSiteField((s) => {
              s.creativeLab = s.creativeLab || { showreel: null, videos: [] };
              s.creativeLab.showreel = {
                id: 'showreel-' + Date.now(),
                title: { en: nm || 'Featured Showreel', ar: nm || 'الشوريل الرئيسي' },
                category: 'reels',
                kind: 'direct',
                src: dataUrl,
                poster: '/projects/iphone-18-pro-max/01.jpg',
                ratio: '16/9'
              };
              return s;
            });
          }
        } else if (pending.type === 'labvid') {
          const added = [];
          for (const f of files) {
            if (!/^video\//.test(f.type)) continue;
            const dataUrl = await blobToData(f);
            const nm = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
            added.push({
              id: 'lab-video-' + Date.now() + '-' + added.length,
              title: { en: nm || 'Motion Video', ar: nm || 'عمل فيديو وموشن' },
              category: pending.category || 'reels',
              kind: 'direct',
              src: dataUrl,
              poster: '/projects/iphone-18-pro-max/01.jpg',
              ratio: '16/9'
            });
          }
          if (added.length) {
            updateSiteField((s) => {
              s.creativeLab = s.creativeLab || { showreel: null, videos: [] };
              s.creativeLab.videos = [...(s.creativeLab.videos || []), ...added];
              return s;
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
      pendingFileRef.current = null;
    },
    [t, updateSiteField, updateProjects]
  );

  const resetPortfolio = useCallback(() => {
    if (window.confirm(t('confirmReset'))) {
      setSite(INITIAL_SITE_DATA);
      setProjects(INITIAL_PROJECTS);
      persistState(INITIAL_SITE_DATA, INITIAL_PROJECTS);
    }
  }, [t, persistState]);

  const exportPortfolioJson = useCallback(() => {
    const payload = JSON.stringify({ savedAt: Date.now(), site, projects }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mohamed-tarek-portfolio-backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, [site, projects]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      theme,
      setTheme,
      toggleTheme,
      site,
      setSite,
      updateSiteField,
      projects,
      setProjects,
      updateProjects,
      updateLocalizedPath,
      canEdit,
      editing,
      setEditing,
      introDone,
      setIntroDone,
      menuOpen,
      setMenuOpen,
      selectedPkgIndex,
      setSelectedPkgIndex,
      preselectedService,
      setPreselectedService,
      activeFolderSlug,
      setActiveFolderSlug,
      lightbox,
      openProjectLightbox,
      openSingleImageLightbox,
      openVideoLightbox,
      closeLightbox,
      stepLightbox,
      selectLightboxIndex,
      tx,
      t,
      waBase,
      waLink,
      pickFile,
      resetPortfolio,
      exportPortfolioJson,
      tools: DESIGN_TOOLS,
      networks: SOCIAL_NETWORKS,
      categories: categories || CATEGORIES,
      appearance,
      setAppearance
    }),
    [
      lang,
      setLang,
      toggleLang,
      theme,
      setTheme,
      toggleTheme,
      site,
      updateSiteField,
      projects,
      updateProjects,
      updateLocalizedPath,
      editing,
      introDone,
      menuOpen,
      selectedPkgIndex,
      preselectedService,
      activeFolderSlug,
      lightbox,
      openProjectLightbox,
      openSingleImageLightbox,
      openVideoLightbox,
      closeLightbox,
      stepLightbox,
      selectLightboxIndex,
      tx,
      t,
      waBase,
      waLink,
      pickFile,
      resetPortfolio,
      exportPortfolioJson,
      categories,
      appearance
    ]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
}
