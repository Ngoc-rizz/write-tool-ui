import React from 'react';
import Link from 'next/link';
import styles from './HomeNav.module.css';
import type { CurrentUser } from '@/stores/auth.types';

interface HomeNavProps {
  user: CurrentUser | null;
}

export default function HomeNav({ user }: HomeNavProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search works, chapters, or content..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
