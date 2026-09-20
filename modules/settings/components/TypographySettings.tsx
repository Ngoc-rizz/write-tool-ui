import React from 'react';
import styles from './TypographySettings.module.css';
import { useTheme } from '@/stores/ThemeProvider';
import { FONT_OPTIONS, FONT_SIZE_OPTIONS, CONTENT_WIDTH_OPTIONS } from '@/stores/theme.types';

export default function TypographySettings() {
  const { settings, setFontFamily, setFontSize, setContentWidth } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Kiểu chữ</h2>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Phông chữ nội dung</h3>
        <div className={styles.fontGrid}>
          {FONT_OPTIONS.map((font) => (
            <div
              key={font.value}
              className={`${styles.fontCard} ${settings.fontFamily === font.value ? styles.active : ''}`}
              onClick={() => setFontFamily(font.value)}
            >
              <span className={styles.fontName}>{font.label}</span>
              <span className={styles.fontDesc}>{font.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Cỡ chữ mặc định</h3>
        <div className={styles.buttonGroup}>
          {FONT_SIZE_OPTIONS.map((size) => (
            <button
              key={size.value}
              className={`${styles.optionBtn} ${settings.fontSize === size.value ? styles.active : ''}`}
              onClick={() => setFontSize(size.value)}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
