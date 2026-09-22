'use client';

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import HomeHeader from './HomeHeader';
import HomeNav from './HomeNav';
import HomeContent from './HomeContent';
import { useAuth } from '@/stores/AuthProvider';
import DocumentModal, { DocumentModalData } from '@/modules/documents/components/DocumentModal/DocumentModal';
import ChapterModal, { ChapterModalData } from '@/modules/chapters/components/ChapterModal/ChapterModal';
import { Chapter } from '@/modules/chapters/types';
import { useChapterService } from '@/modules/chapters/hooks/useChapterService';

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const chapterService = useChapterService();

  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.fetchDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      const data = await chapterService.findAll();
      setChapters(data.filter(chapter => !chapter.documentId));
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (isAuthLoading) return;

      setLoading(true);
      try {
        if (user && user.role !== 'visitor' && user.permissions?.includes('all')) {
          await fetchDocuments();
        } else {
          setDocuments([]);
        }
        await fetchChapters();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthLoading, user, chapterService]);


  const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleCreateDocumentClick = () => {
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsChapterModalOpen(true);
  };

  const handleDeleteChapter = async (chapter: Chapter) => {
    if (!confirm(`Are you sure you want to delete the draft "${chapter.title}"?`)) return;
    try {
      await chapterService.remove(chapter.id);
      setChapters(prev => prev.filter(c => c.id !== chapter.id));
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Unable to delete draft.');
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete the document "${doc.title}"? All drafts inside it will also be deleted.`)) return;
    try {
      await documentService.deleteDocument(doc.id);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Unable to delete document.');
    }
  };

  const handleSaveDocument = async (data: DocumentModalData) => {
    setIsSaving(true);
    try {
      if (editingDoc) {
        await documentService.updateDocument(editingDoc.id, data);
      } else {
        await documentService.createDocument(data);
      }
      await fetchDocuments();
      setIsDocModalOpen(false);
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Unable to save document.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChapter = async (data: ChapterModalData) => {
    if (!editingChapter) return;
    setIsSaving(true);
    try {
      await chapterService.update(editingChapter.id, { title: data.title });
      await fetchChapters();
      setIsChapterModalOpen(false);
    } catch (error) {
      console.error('Error saving chapter:', error);
      alert('Unable to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <HomeHeader user={user} onCreateDocument={handleCreateDocumentClick} />
      <HomeNav user={user} />

      <HomeContent
        user={user}
        loading={loading}
        documents={documents}
        chapters={chapters}
        onEditDocument={handleEditDocument}
        onDeleteDocument={handleDeleteDocument}
        onEditChapter={handleEditChapter}
        onDeleteChapter={handleDeleteChapter}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        initialData={editingDoc}
        onSave={handleSaveDocument}
        isSaving={isSaving}
      />

      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        initialData={editingChapter}
        onSave={handleSaveChapter}
        isSaving={isSaving}
      />
    </div>
  );
}
