import { api } from '@/lib/api-client';
import { Chapter, CreateChapterDto, IChapterService, UpdateChapterDto } from '../types';

export class ChaptersApiService implements IChapterService {
  async findAll(documentId?: string): Promise<Chapter[]> {
    const query = documentId ? `?documentId=${documentId}` : '';
    return api.get<Chapter[]>(`/chapters${query}`);
  }

  async findOne(id: string): Promise<Chapter> {
    return api.get<Chapter>(`/chapters/${id}`);
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    return api.post<Chapter>('/chapters', dto);
  }

  async update(id: string, dto: UpdateChapterDto): Promise<Chapter> {
    return api.patch<Chapter>(`/chapters/${id}`, dto);
  }

  async updateContent(id: string, content: any, contentText: string): Promise<Chapter> {
    return api.patch<Chapter>(`/chapters/${id}/content`, { content, contentText });
  }

  async remove(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/chapters/${id}`);
  }
}

export const chaptersApiService = new ChaptersApiService();
