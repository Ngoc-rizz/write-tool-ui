import styles from './Home.module.css';
import DocumentCard from '@/modules/documents/components/DocumentCard/DocumentCard';
import ChapterCard from '@/modules/chapters/components/ChapterCard/ChapterCard';
import { Document } from '@/modules/documents/services/document.service';
import type { CurrentUser } from '@/stores/auth.types';
import type { Chapter } from '@/modules/chapters/types';

interface HomeContentProps {
  user: CurrentUser | null;
  loading: boolean;
  documents: Document[];
  chapters: Chapter[];
  onEditDocument: (doc: Document) => void;
  onDeleteDocument: (doc: Document) => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapter: Chapter) => void;
}

export default function HomeContent({ user, loading, documents, chapters, onEditDocument, onDeleteDocument, onEditChapter, onDeleteChapter }: HomeContentProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading documents...</p>
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

      {user?.role === 'visitor' && documents.length === 0 && chapters.length === 0 && (
        <div className={styles.loadingContainer} style={{ flexDirection: 'column', gap: '16px' }}>
          <p>Log in to store and manage your drafts on every device.</p>
        </div>
      )}

      {chapters.length > 0 && (
        <section className={styles.standaloneChapters}>
          <h2 className={styles.sectionTitle}>Standalone chapters</h2>
          <div className={styles.chapterList}>
            {chapters.map(chapter => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                allChapters={chapters}
                onEditClick={onEditChapter}
                onDeleteClick={onDeleteChapter}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
