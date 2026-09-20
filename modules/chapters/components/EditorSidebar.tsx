import React from 'react';
import Link from 'next/link';
import styles from './EditorSidebar.module.css';
import EditorActions from './EditorActions';

interface EditorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  isMobile: boolean;
  documentName?: string;
  chapters?: { id: string; title: string; wordCount: number }[];
  activeChapterId?: string;
  onChapterClick?: (id: string) => void;
  onDeleteChapterClick?: (id: string) => void;
  onSaveClick?: () => void;
  onDownloadTxtClick?: () => void;
  onImportFileClick?: () => void;
  onNewDraftClick?: () => void;
  onEditDocumentClick?: () => void;
  isSaving?: boolean;
}

export default function EditorSidebar({ isOpen, onToggle, onMobileClose, isMobile, documentName, chapters, activeChapterId, onChapterClick, onDeleteChapterClick, onSaveClick, onDownloadTxtClick, onImportFileClick, onNewDraftClick, onEditDocumentClick, isSaving }: EditorSidebarProps) {
  return (
    <div className={styles.sidebar}>
      {documentName && (
        <div className={styles.docInfoSection}>
          <Link href="/" className={styles.backBtn} aria-label="Quay lại Tài liệu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className={styles.backText}>Tài liệu</span>
          </Link>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleWrapper} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p className={styles.docTitle}>
            {documentName ? `Bản thảo: ${documentName}` : ''}
          </p>
          {documentName && onEditDocumentClick && (
            <button 
              className={styles.editDocBtn} 
              onClick={onEditDocumentClick} 
              aria-label="Chỉnh sửa thông tin tài liệu"
              title="Chỉnh sửa thông tin tài liệu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>
        {isMobile && (
          <button className={styles.closeBtn} onClick={onMobileClose} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: 'var(--space-sm) var(--space-sm) 0 var(--space-sm)' }}>
        <button className={styles.addBtn} onClick={onNewDraftClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Viết bản thảo mới
        </button>
      </div>

      <div className={styles.chapterList}>
        {chapters && chapters.length > 0 ? (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`${styles.chapterItem} ${activeChapterId === chapter.id ? styles.active : ''}`}
              onClick={() => onChapterClick && onChapterClick(chapter.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.chapterContent}>
                <div className={styles.chapterTitle}>{chapter.title}</div>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChapterClick && onDeleteChapterClick(chapter.id);
                }}
                title="Xóa bản thảo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>Chưa có bản thảo nào.</p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <EditorActions
          onSaveClick={() => onSaveClick && onSaveClick()}
          onDownloadTxtClick={() => onDownloadTxtClick && onDownloadTxtClick()}
          onImportFileClick={() => onImportFileClick && onImportFileClick()}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
