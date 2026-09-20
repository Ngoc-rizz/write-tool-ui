import React, { useState, useEffect } from 'react';
import styles from './SaveChapterModal.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import { useAuth } from '@/stores/AuthProvider';

interface SaveChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; documentId?: string; newDocumentName?: string; newDocumentSummary?: string; newDocumentNote?: string; newDocumentLanguage?: string }) => void;
  initialTitle?: string;
  initialDocumentId?: string;
  isSaving?: boolean;
}

export default function SaveChapterModal({ isOpen, onClose, onSave, initialTitle, initialDocumentId, isSaving }: SaveChapterModalProps) {
  const [title, setTitle] = useState(initialTitle || '');
  const [docMode, setDocMode] = useState<'none' | 'existing' | 'new'>(initialDocumentId ? 'existing' : 'none');

  const [selectedDocId, setSelectedDocId] = useState(initialDocumentId || '');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSummary, setNewDocSummary] = useState('');
  const [newDocNote, setNewDocNote] = useState('');
  const [newDocLanguage, setNewDocLanguage] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || '');
      setDocMode(initialDocumentId ? 'existing' : 'none');
      setSelectedDocId(initialDocumentId || '');
      setNewDocName('');
      setNewDocSummary('');
      setNewDocNote('');
      setNewDocLanguage('');

      if (!isAuthenticated) {
        setDocMode('none');
        return;
      }

      const fetchDocs = async () => {
        setIsLoadingDocs(true);
        try {
          const docs = await documentService.fetchDocuments();
          setDocuments(docs);
          if (initialDocumentId && !docs.find(d => d.id === initialDocumentId) && docs.length > 0) {
            setSelectedDocId(docs[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch documents', error);
        } finally {
          setIsLoadingDocs(false);
        }
      };
      if (isAuthenticated) {
        fetchDocs();
      }
    }
  }, [isOpen, initialTitle, initialDocumentId, isAuthenticated]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      documentId: docMode === 'existing' ? selectedDocId : undefined,
      newDocumentName: docMode === 'new' ? newDocName.trim() : undefined,
      newDocumentSummary: docMode === 'new' ? newDocSummary.trim() : undefined,
      newDocumentNote: docMode === 'new' ? newDocNote.trim() : undefined,
      newDocumentLanguage: docMode === 'new' ? newDocLanguage.trim() : undefined,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Save Draft</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={isSaving}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Chapter title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="E.g.: Chapter 1: The Beginning"
              className={styles.input}
              required
              disabled={isSaving}
            />
          </div>

          {isAuthenticated && (
            <div className={styles.formGroup}>
              <label>Attach to document (book)</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="docMode"
                    checked={docMode === 'none'}
                    onChange={() => setDocMode('none')}
                    disabled={isSaving}
                  />
                  Do not attach (Standalone chapter)
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="docMode"
                    checked={docMode === 'existing'}
                    onChange={() => setDocMode('existing')}
                    disabled={isSaving}
                  />
                  Existing document
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="docMode"
                    checked={docMode === 'new'}
                    onChange={() => setDocMode('new')}
                    disabled={isSaving}
                  />
                  Create new document
                </label>
              </div>
            </div>
          )}

          {isAuthenticated && docMode === 'existing' && (
            <div className={styles.formGroup}>
              <select
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                className={styles.input}
                disabled={isSaving || isLoadingDocs}
                required={docMode === 'existing'}
              >
                <option value="" disabled>-- Select a document --</option>
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
              {isLoadingDocs && <span className={styles.loadingText}>Loading...</span>}
            </div>
          )}

          {isAuthenticated && docMode === 'new' && (
            <div className={styles.formGroup}>
              <input
                type="text"
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                placeholder="Enter a new document name"
                className={styles.input}
                required={docMode === 'new'}
                disabled={isSaving}
              />
            </div>
          )}

          {isAuthenticated && docMode === 'new' && (
            <div className={styles.formGroup}>
              <textarea
                value={newDocSummary}
                onChange={e => setNewDocSummary(e.target.value)}
                placeholder="Document summary (optional)"
                className={styles.input}
                rows={3}
                disabled={isSaving}
              />
            </div>
          )}

          {isAuthenticated && docMode === 'new' && (
            <div className={styles.formGroup}>
              <textarea
                value={newDocNote}
                onChange={e => setNewDocNote(e.target.value)}
                placeholder="Additional notes (optional)"
                className={styles.input}
                rows={2}
                disabled={isSaving}
              />
            </div>
          )}

          {isAuthenticated && docMode === 'new' && (
            <div className={styles.formGroup}>
              <input
                type="text"
                value={newDocLanguage}
                onChange={e => setNewDocLanguage(e.target.value)}
                placeholder="Language (E.g.: English)"
                className={styles.input}
                disabled={isSaving}
              />
            </div>
          )}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={!title.trim() || (docMode === 'new' && !newDocName.trim()) || (docMode === 'existing' && !selectedDocId) || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
