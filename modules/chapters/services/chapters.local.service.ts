import { getDB } from '@/lib/db';
import { Chapter, CreateChapterDto, IChapterService, UpdateChapterDto } from '../types';
import { countWords, countChars } from '@/utils/text.util';

export class ChaptersLocalService implements IChapterService {

  private generateId() {
    return 'local_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  async findAll(): Promise<Chapter[]> {
    const db = await getDB();
    if (!db) return [];

    return db.getAll('chapters');
  }

  async findOne(id: string): Promise<Chapter> {
    const db = await getDB();
    if (!db) throw new Error('IndexedDB not available');

    const chapter = await db.get('chapters', id);
    if (!chapter) throw new Error('Chapter not found');
    return chapter;
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    console.log(dto)
    const db = await getDB();
    if (!db) throw new Error('IndexedDB not available');

    const newChapter: Chapter = {
      id: this.generateId(),
      documentId: dto.documentId,
      title: dto.title,
      order: dto.order || 0,
      content: dto.content || null,
      contentText: dto.contentText || '',
      wordCount: dto.contentText ? countWords(dto.contentText) : 0,
      charCount: dto.contentText ? countChars(dto.contentText) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.add('chapters', newChapter);
    return newChapter;
  }

  async update(id: string, dto: UpdateChapterDto): Promise<Chapter> {
    const db = await getDB();
    if (!db) throw new Error('IndexedDB not available');

    const chapter = await this.findOne(id);
    const updatedChapter = {
      ...chapter,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await db.put('chapters', updatedChapter);
    return updatedChapter;
  }

  async updateContent(id: string, content: any, contentText: string): Promise<Chapter> {
    const db = await getDB();
    if (!db) throw new Error('IndexedDB not available');

    const chapter = await this.findOne(id);
    const updatedChapter = {
      ...chapter,
      content,
      contentText,
      wordCount: countWords(contentText),
      charCount: countChars(contentText),
      updatedAt: new Date().toISOString(),
    };

    await db.put('chapters', updatedChapter);

    return updatedChapter;
  }

  async remove(id: string): Promise<{ message: string }> {
    const db = await getDB();
    if (!db) throw new Error('IndexedDB not available');

    await db.delete('chapters', id);
    return { message: 'Chapter deleted' };
  }
}

export const chaptersLocalService = new ChaptersLocalService();
