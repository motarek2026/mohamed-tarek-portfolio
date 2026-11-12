'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, t } = usePortfolio();

  return (
    <button
      type="button"
      className="pill"
      data-act="theme"
      aria-label={t('theme')}
      aria-pressed={theme === 'light'}
      title={t('theme')}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
