'use client';

import React from 'react';
import styles from './MainSetting.module.css';
import ThemeSettings from './ThemeSettings';
import TypographySettings from './TypographySettings';

export default function MainSetting() {
  return (
    <div className={styles.container}>
      <ThemeSettings />
      <TypographySettings />
    </div>
  );
}