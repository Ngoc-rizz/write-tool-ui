import React from 'react';
import styles from './ThemeSettings.module.css';
import { useTheme } from '@/stores/ThemeProvider';
import { THEME_OPTIONS } from '@/stores/theme.types';

const getIconForTheme = (themeValue: string) => {
  switch (themeValue) {
    case 'giay-nga':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      );
    case 'giay-moc':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
      );
    case 'dem-than':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default function ThemeSettings() {
  const { settings, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Appearance</h2>
        </div>
      </div>
      <div className={styles.themeGrid} role="radiogroup" aria-label="Appearance themes">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.value}
            type="button"
            className={`${styles.themeCard} ${settings.theme === theme.value ? styles.active : ''}`}
            onClick={() => setTheme(theme.value)}
            aria-pressed={settings.theme === theme.value}
            data-theme={theme.value}
          >
            <div className={styles.themeCardHeader}>
              <span className={styles.themeName}>{theme.label}</span>
              <span className={styles.themeIcon}>{getIconForTheme(theme.value)}</span>
            </div>
            <span className={styles.themeDesc}>{theme.description}</span>
            <span className={styles.selectionMark} aria-hidden="true">
              {settings.theme === theme.value ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
