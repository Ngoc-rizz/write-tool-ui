import React from 'react';
import styles from './Home.module.css';
import DocumentCard from '@/modules/documents/components/DocumentCard/DocumentCard';
import { Document } from '@/modules/documents/services/document.service';
import type { CurrentUser } from '@/stores/auth.types';

interface HomeContentProps {
  user: CurrentUser | null;
  loading: boolean;
  documents: Document[];
  viewMode: 'grid' | 'list';
}

export default function HomeContent({ user, loading, documents, viewMode }: HomeContentProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải tài liệu...</p>
      </div>
    );
  }

  if (user?.role === 'visitor') {
    return (
      <div className={styles.loadingContainer} style={{ flexDirection: 'column', gap: '16px' }}>
        <p>Đăng nhập để lưu trữ và quản lý bản thảo của bạn trên mọi thiết bị.</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <p>Chưa có tài liệu nào. Hãy tạo mới!</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? styles.grid : styles.list}>
      {documents.map(doc => (
        <DocumentCard key={doc.id} document={doc} layout={viewMode} />
      ))}
    </div>
  );
}
