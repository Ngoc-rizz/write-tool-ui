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
  onRenameChapterClick?: (id: string) => void;
  onSaveClick?: () => void;
  onDownloadTxtClick?: () => void;
  onImportFileClick?: () => void;
  onNewDraftClick?: () => void;
  onEditDocumentClick?: () => void;
  isSaving?: boolean;
}

export default function EditorSidebar({ isOpen, onToggle, onMobileClose, isMobile, documentName, chapters, activeChapterId, onChapterClick, onDeleteChapterClick, onRenameChapterClick, onSaveClick, onDownloadTxtClick, onImportFileClick, onNewDraftClick, onEditDocumentClick, isSaving }: EditorSidebarProps) {
  const [contextMenu, setContextMenu] = React.useState<{ chapterId: string; x: number; y: number } | null>(null);

  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    window.addEventListener('resize', closeMenu);
    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('resize', closeMenu);
    };
  }, []);

  return (
    <div className={styles.sidebar}>
      {documentName && (
        <div className={styles.docInfoSection}>
          <Link href="/" className={styles.backBtn} aria-label="Go back Documents">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className={styles.backText}>Documents</span>
          </Link>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleWrapper} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p className={styles.docTitle}>
            {documentName ? `Draft: ${documentName}` : ''}
          </p>
          {documentName && onEditDocumentClick && (
            <button 
              className={styles.editDocBtn} 
              onClick={onEditDocumentClick} 
              aria-label="Edit document details"
              title="Edit document details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>
        {isMobile && (
          <button className={styles.closeBtn} onClick={onMobileClose} aria-label="Close">
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
          Write a new draft
        </button>
      </div>

      <div className={styles.chapterList}>
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              data-chapter-item
              className={`${styles.chapterItem} ${activeChapterId === chapter.id ? styles.active : ''}`}
              onClick={() => onChapterClick && onChapterClick(chapter.id)}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setContextMenu({ chapterId: chapter.id, x: event.clientX, y: event.clientY });
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.chapterContent}>
                <div className={styles.chapterTitle}>{chapter.title}</div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No drafts yet.</p>
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              onRenameChapterClick?.(contextMenu.chapterId);
              setContextMenu(null);
            }}
          >
            Rename chapter
          </button>
          <button
            type="button"
            className={styles.contextDelete}
            onClick={() => {
              onDeleteChapterClick?.(contextMenu.chapterId);
              setContextMenu(null);
            }}
          >
            Delete chapter
          </button>
        </div>
      )}

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
