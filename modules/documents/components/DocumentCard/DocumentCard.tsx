import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/text.util';

import styles from './DocumentCard.module.css';
import type { Document } from '../../services/document.service';

interface DocumentCardProps {
  document: Document;
  layout?: 'grid' | 'list';
  onEditClick?: (doc: Document) => void;
  onDeleteClick?: (doc: Document) => void;
}

export default function DocumentCard({ document, layout = 'grid', onEditClick, onDeleteClick }: DocumentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleCardClick = () => {
    sessionStorage.setItem('currentDoc', JSON.stringify({ id: document.id, title: document.title }));
    router.push(`/chapter?docName=${slugify(document.title)}`);
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
    onEditClick?.(document);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDeleteClick?.(document);
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

  const renderMenuBtn = () => (
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
  );

  if (layout === 'list') {
    return (
      <div
        className={`${styles.card} ${styles.listLayout} ${isMenuOpen ? styles.menuOpen : ''}`}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.listMain}>
          <h3 className={styles.title}>{document.title}</h3>
          <p className={styles.description}>{document.summary || 'No summary'}</p>
        </div>

        <div className={styles.listRight}>
          <div className={styles.listMeta}>
            <div className={styles.listDate}>
              {new Date(document.updatedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
            </div>
            <div className={styles.listStats}>
              <span className={styles.statBadge}>{document.chapterCount} chapters</span>
              <span className={styles.statBadge}>{document.wordCount} words</span>
            </div>
          </div>
          {renderMenuBtn()}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${isMenuOpen ? styles.menuOpen : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{document.title}</h3>
        {renderMenuBtn()}
      </div>

      <p className={styles.description}>{document.summary || 'No summary'}</p>

      <div className={styles.footer}>
        <div className={styles.date}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {new Date(document.updatedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
        </div>
        <div className={styles.stats}>
          <span className={styles.statBadge}>{document.chapterCount} chapters</span>
          <span className={styles.statBadge}>{document.wordCount} words</span>
        </div>
      </div>
    </div>
  );
}
