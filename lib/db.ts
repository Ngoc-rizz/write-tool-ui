import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface WriteAppDB extends DBSchema {
  chapters: {
    key: string;
    value: {
      id: string;
      documentId?: string;
      title: string;
      content: any;
      contentText: string;
      order: number;
      wordCount: number;
      charCount: number;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      'by-documentId': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<WriteAppDB>> | null = null;

export function getDB() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!dbPromise) {
    dbPromise = openDB<WriteAppDB>('WriteAppDB', 1, {
      upgrade(db) {
        const chapterStore = db.createObjectStore('chapters', {
          keyPath: 'id',
        });
        chapterStore.createIndex('by-documentId', 'documentId');
      },
    });
  }
  
  return dbPromise;
}
