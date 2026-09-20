'use client';

import styles from './MainSetting.module.css';
import ThemeSettings from './ThemeSettings';
import TypographySettings from './TypographySettings';
import { BackButton } from '@/components/common';

export default function MainSetting() {
  return (
    <div className={styles.container}>
      <BackButton />
      <ThemeSettings />
      <TypographySettings />
    </div>
  );
}