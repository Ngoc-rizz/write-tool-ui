import styles from './EditorActions.module.css';

interface EditorActionsProps {
  onSaveClick: () => void;
  onDownloadTxtClick: () => void;
  onImportFileClick: () => void;
  isSaving?: boolean;
}

export default function EditorActions({ onSaveClick, onDownloadTxtClick, onImportFileClick, isSaving }: EditorActionsProps) {
  return (
    <div className={styles.actionsContainer}>
      <button 
        className={styles.saveBtn} 
        onClick={onSaveClick}
        disabled={isSaving}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        {isSaving ? 'Đang lưu...' : 'Lưu bản thảo'}
      </button>

      <button className={styles.importBtn} onClick={onImportFileClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="12" y2="12"></line>
          <line x1="15" y1="15" x2="12" y2="12"></line>
        </svg>
        Mở file (.txt, .docx)
      </button>

      <button className={styles.downloadBtn} onClick={onDownloadTxtClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Tải xuống (.txt)
      </button>
    </div>
  );
}

