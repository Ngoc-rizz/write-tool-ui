import React, { useState, useEffect } from 'react';
import styles from './ChapterModal.module.css';
import type { Chapter } from '../../types';

export interface ChapterModalData {
  title: string;
}

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChapterModalData) => Promise<void>;
  initialData?: Chapter | null;
  isSaving?: boolean;
}

export default function ChapterModal({ isOpen, onClose, onSave, initialData, isSaving }: ChapterModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSave({
      title: title.trim(),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edit draft</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={isSaving} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Draft title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="E.g.: Chapter 1"
              className={styles.input}
              required
              disabled={isSaving}
              autoFocus
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={!title.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
