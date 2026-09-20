import React from 'react';
import styles from './EditorMobileSubHeader.module.css';

interface EditorMobileSubHeaderProps {
  onOpenSidebar: () => void;
  chapterTitle?: string;
}

export default function EditorMobileSubHeader({ onOpenSidebar, chapterTitle }: EditorMobileSubHeaderProps) {
  return (
    <div className={styles.subHeader}>
      <button className={styles.menuBtn} onClick={onOpenSidebar} aria-label="Mở mục lục">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div className={styles.currentChapter}>
        {chapterTitle || 'Bản thảo mới'}
      </div>
    </div>
  );
}
