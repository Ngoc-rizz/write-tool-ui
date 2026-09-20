'use client';

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import HomeHeader from './HomeHeader';
import HomeNav from './HomeNav';
import HomeContent from './HomeContent';
import { useAuth } from '@/stores/AuthProvider';
import DocumentModal, { DocumentModalData } from '@/modules/documents/components/DocumentModal/DocumentModal';
import { Chapter } from '@/modules/chapters/types';
import { useChapterService } from '@/modules/chapters/hooks/useChapterService';

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const chapterService = useChapterService();
  
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      if (user?.role === 'visitor' || !user?.permissions?.includes('all')) {
        setLoading(false);
        return;
      }
      await fetchDocuments();
      await fetchChapters();
      setLoading(false);
    }
    loadData();
  }, [isAuthLoading, user, chapterService]);

  const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleCreateDocumentClick = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
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
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Unable to save document.');
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
      />

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingDoc}
        onSave={handleSaveDocument}
        isSaving={isSaving}
      />
    </div>
  );
}
