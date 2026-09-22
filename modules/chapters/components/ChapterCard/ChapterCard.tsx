import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/text.util';

import styles from './ChapterCard.module.css';
import type { Chapter } from '../../types';

interface ChapterCardProps {
  chapter: Chapter;
  allChapters: Chapter[];
  onEditClick?: (chapter: Chapter) => void;
  onDeleteClick?: (chapter: Chapter) => void;
}

export default function ChapterCard({ chapter, allChapters, onEditClick, onDeleteClick }: ChapterCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleCardClick = () => {
    const chapterSlug = slugify(chapter.title);
    const matchingChapters = allChapters.filter(
      item => slugify(item.title) === chapterSlug
    );
    const chapterIndex = matchingChapters.findIndex(
      item => item.id === chapter.id
    );
    const uniqueSlug = matchingChapters.length > 1
      ? `${chapterSlug}--${chapterIndex + 1}`
      : chapterSlug;

    router.push(`/chapter?chapterName=${encodeURIComponent(uniqueSlug)}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEditClick?.(chapter);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDeleteClick?.(chapter);
  };

  const renderDropdown = () => (
    isMenuOpen && (
      <div className={styles.dropdown}>
        <button className={styles.dropdownItem} onClick={handleEdit}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Edit details
        </button>
        <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Delete
        </button>
      </div>
    )
  );

  return (
    <div
      className={`${styles.card} ${isMenuOpen ? styles.menuOpen : ''}`}
      onClick={handleCardClick}
    >
      <span className={styles.title}>{chapter.title}</span>

      <div className={styles.right}>
        <span className={styles.meta}>{chapter.wordCount} words</span>

        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Options"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          {renderDropdown()}
        </div>
      </div>
    </div>
  );
}
