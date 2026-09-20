export interface Chapter {
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
}

export interface CreateChapterDto {
  documentId?: string;
  title: string;
  order?: number;
  content?: any;
  contentText?: string;
}

export interface UpdateChapterDto {
  title?: string;
  order?: number;
  documentId?: string;
}

export interface UpdateChapterContentDto {
  content: any;
  contentText: string;
}

export interface IChapterService {
  findAll(documentId?: string): Promise<Chapter[]>;
  findOne(id: string): Promise<Chapter>;
  create(dto: CreateChapterDto): Promise<Chapter>;
  update(id: string, dto: UpdateChapterDto): Promise<Chapter>;
  updateContent(id: string, content: any, contentText: string): Promise<Chapter>;
  remove(id: string): Promise<{ message: string }>;
}
