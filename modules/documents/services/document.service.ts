import { api } from '@/lib/api-client';

export interface Document {
  id: string;
  title: string;
  summary: string | null;
  wordCount: number;
  chapterCount: number;
  updatedAt: string;
}

export interface DocumentListResponse {
  data: Document[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const documentService = {
  async fetchDocuments(): Promise<Document[]> {
    // const res = await api.get<DocumentListResponse>('/documents');
    return [];
  }
};
