'use client';

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import DocumentCard from '@/modules/documents/components/DocumentCard/DocumentCard';
import HomeHeader from './HomeHeader';
import HomeNav from './HomeNav';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await documentService.fetchDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <HomeHeader />
      <HomeNav viewMode={viewMode} onViewModeChange={setViewMode} />

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải tài liệu...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} layout={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
