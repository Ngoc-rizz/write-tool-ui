'use client';

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import HomeHeader from './HomeHeader';
import HomeNav from './HomeNav';
import HomeContent from './HomeContent';
import { useAuth } from '@/stores/AuthProvider';
import DocumentModal, { DocumentModalData } from '@/modules/documents/components/DocumentModal/DocumentModal';

export default function Home() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  useEffect(() => {
    async function loadData() {
      if (user?.role === 'visitor' || !user?.permissions?.includes('all')) {
        setLoading(false);
        return;
      }
      await fetchDocuments();
      setLoading(false);
    }
    loadData();
  }, [user]);

  const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleCreateDocumentClick = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  const handleDeleteDocument = async (doc: Document) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${doc.title}"? Mọi bản thảo bên trong cũng sẽ bị xóa.`)) return;
    try {
      await documentService.deleteDocument(doc.id);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
      alert('Không thể xóa tài liệu.');
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
      console.error('Lỗi khi lưu tài liệu:', error);
      alert('Không thể lưu tài liệu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <HomeHeader user={user} onCreateDocument={handleCreateDocumentClick} />
      <HomeNav user={user} viewMode={viewMode} onViewModeChange={setViewMode} />

      <HomeContent
        user={user}
        loading={loading}
        documents={documents}
        viewMode={viewMode}
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
