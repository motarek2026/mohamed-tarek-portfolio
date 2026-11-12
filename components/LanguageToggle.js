'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function LanguageToggle() {
  const { lang, toggleLang, t } = usePortfolio();

  return (
    <button
      type="button"
      className="pill"
      data-act="lang"
      onClick={toggleLang}
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className="lfull">{t('lang')}</span>
      <span className="lshort">{lang === 'en' ? 'AR' : 'EN'}</span>
    </button>
  );
}
