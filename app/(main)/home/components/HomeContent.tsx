import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import DocumentCard from '@/modules/documents/components/DocumentCard/DocumentCard';
import { Document } from '@/modules/documents/services/document.service';
import type { CurrentUser } from '@/stores/auth.types';
import type { Chapter } from '@/modules/chapters/types';
import { slugify } from '@/utils/text.util';

interface HomeContentProps {
  user: CurrentUser | null;
  loading: boolean;
  documents: Document[];
  chapters: Chapter[];
  onEditDocument: (doc: Document) => void;
  onDeleteDocument: (doc: Document) => void;
}

export default function HomeContent({ user, loading, documents, chapters, onEditDocument, onDeleteDocument }: HomeContentProps) {
  const router = useRouter();
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading documents...</p>
      </div>
    );
  }

  if (user?.role === 'visitor') {
    return (
      <div className={styles.loadingContainer} style={{ flexDirection: 'column', gap: '16px' }}>
        <p>Log in to store and manage your drafts on every device.</p>
      </div>
    );
  }

  if (documents.length === 0 && chapters.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <p>No documents yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.contentSections}>
      {documents.length > 0 && (
        <div className={styles.list}>
          {documents.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc}
              layout="list"
              onEditClick={onEditDocument}
              onDeleteClick={onDeleteDocument}
            />
          ))}
        </div>
      )}

      {chapters.length > 0 && (
        <section className={styles.standaloneChapters}>
          <h2 className={styles.sectionTitle}>Standalone chapters</h2>
          <div className={styles.chapterList}>
            {chapters.map(chapter => (
              <button
                key={chapter.id}
                type="button"
                className={styles.chapterItem}
                onClick={() => {
                  const chapterSlug = slugify(chapter.title);
                  const matchingChapters = chapters.filter(
                    item => slugify(item.title) === chapterSlug
                  );
                  const chapterIndex = matchingChapters.findIndex(
                    item => item.id === chapter.id
                  );
                  const uniqueSlug = matchingChapters.length > 1
                    ? `${chapterSlug}--${chapterIndex + 1}`
                    : chapterSlug;

                  router.push(`/chapter?chapterName=${encodeURIComponent(uniqueSlug)}`);
                }}
              >
                <span className={styles.chapterTitle}>{chapter.title}</span>
                <span className={styles.chapterMeta}>{chapter.wordCount} words</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
