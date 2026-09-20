import { api } from '@/lib/api-client';

export interface CreateDocumentDto {
  title: string;
  summary?: string;
  note?: string;
  language?: string;
}

export interface Document {
  id: string;
  title: string;
  summary: string | null;
  note: string | null;
  language: string | null;
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

export interface IDocumentService {
  fetchDocuments(): Promise<Document[]>;
  fetchDocumentById(id: string): Promise<Document>;
  createDocument(dto: CreateDocumentDto): Promise<Document>;
  updateDocument(id: string, dto: Partial<CreateDocumentDto>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

export class DocumentsApiService implements IDocumentService {
  async fetchDocuments(): Promise<Document[]> {
    const res = await api.get<DocumentListResponse>('/documents');
    return res.data;
  }

  async fetchDocumentById(id: string): Promise<Document> {
    return api.get<Document>(`/documents/${id}`);
  }

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    return api.post<Document>('/documents', dto);
  }

  async updateDocument(id: string, dto: Partial<CreateDocumentDto>): Promise<Document> {
    return api.patch<Document>(`/documents/${id}`, dto);
  }

  async deleteDocument(id: string): Promise<void> {
    return api.delete<void>(`/documents/${id}`);
  }
}

export const documentService = new DocumentsApiService();
