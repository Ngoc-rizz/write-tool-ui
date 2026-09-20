import React, { useState, useEffect } from 'react';
import styles from './DocumentModal.module.css';
import { documentService, Document } from '../../services/document.service';

export interface DocumentModalData {
  title: string;
  summary?: string;
  note?: string;
  language?: string;
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DocumentModalData) => Promise<void>;
  initialData?: Document | null;
  isSaving?: boolean;
}

export default function DocumentModal({ isOpen, onClose, onSave, initialData, isSaving }: DocumentModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [note, setNote] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setSummary(initialData?.summary || '');
      setNote(initialData?.note || '');
      setLanguage(initialData?.language || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSave({
      title: title.trim(),
      summary: summary.trim(),
      note: note.trim(),
      language: language.trim(),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{initialData ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={isSaving} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Tên tài liệu <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Cuốn sách đầu tay"
              className={styles.input}
              required
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tóm tắt</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Tóm tắt nội dung tài liệu..."
              className={styles.input}
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ghi chú</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú thêm về thiết lập thế giới, nhân vật..."
              className={styles.input}
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngôn ngữ</label>
            <input
              type="text"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              placeholder="VD: Tiếng Việt"
              className={styles.input}
              disabled={isSaving}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>Hủy</button>
            <button type="submit" className={styles.submitBtn} disabled={!title.trim() || isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
