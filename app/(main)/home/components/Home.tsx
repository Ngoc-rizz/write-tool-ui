'use client';

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { documentService, Document } from '@/modules/documents/services/document.service';
import DocumentCard from '@/modules/documents/components/DocumentCard/DocumentCard';
import HomeHeader from './HomeHeader';
import HomeNav from './HomeNav';
import HomeContent from './HomeContent';
import { useAuth } from '@/stores/AuthProvider';

export default function Home() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadData() {
      if (user?.role === 'visitor' || !user?.permissions?.includes('all')) {
        setLoading(false);
        return;
      }
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
  }, [user]);

  return (
    <div className={styles.container}>
      <HomeHeader user={user} />
      <HomeNav viewMode={viewMode} onViewModeChange={setViewMode} />

      <HomeContent 
        user={user} 
        loading={loading} 
        documents={documents} 
        viewMode={viewMode} 
      />
    </div>
  );
}
