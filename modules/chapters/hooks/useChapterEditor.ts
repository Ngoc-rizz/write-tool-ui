'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChapterService } from './useChapterService';
import { useAuth } from '@/stores/AuthProvider';
import { documentService, Document as AppDocument } from '@/modules/documents/services/document.service';
import { slugify } from '@/utils/text.util';
import { Chapter } from '../types';

interface SaveData {
  title: string;
  documentId?: string;
  newDocumentName?: string;
  newDocumentSummary?: string;
  newDocumentNote?: string;
  newDocumentLanguage?: string;
}

export function useChapterEditor() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const [docId, setDocId] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | undefined>(undefined);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const loadedChapterIdRef = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const docNameParam = searchParams.get('docName');
  const chapterNameParam = searchParams.get('chapterName');
  const { isAuthenticated } = useAuth();
  const chapterService = useChapterService();

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AppDocument | null>(null);

  // --- Document resolution + chapter list loading ---
  useEffect(() => {
    const load = async () => {
      try {
        let resolvedDocId: string | undefined = undefined;

        if (docNameParam && isAuthenticated) {
          // 1. Try sessionStorage first (instant)
          const cached = sessionStorage.getItem('currentDoc');
          if (cached) {
            try {
              const doc = JSON.parse(cached);
              if (slugify(doc.title) === docNameParam) {
                resolvedDocId = doc.id;
                setDocId(doc.id);
                setDocumentName(doc.title);
              }
            } catch { }
          }

          // 2. Fallback: fetch from API
          if (!resolvedDocId) {
            try {
              const docs = await documentService.fetchDocuments();
              const matched = docs.find(d => slugify(d.title) === docNameParam);
              if (matched) {
                resolvedDocId = matched.id;
                setDocId(matched.id);
                setDocumentName(matched.title);
              }
            } catch (e) {
              console.error('Error loading document details:', e);
            }
          }
        } else {
          setDocumentName(undefined);
          setDocId(null);
        }

        const data = await chapterService.findAll(resolvedDocId);
        setChapters(data);
        if (chapterNameParam) {
          const duplicateMatch = chapterNameParam.match(/^(.*)--(\d+)$/);
          const chapterSlug = duplicateMatch?.[1] || chapterNameParam;
          const requestedIndex = duplicateMatch ? Number(duplicateMatch[2]) - 1 : 0;
          const matchingChapters = data.filter(
            chapter => slugify(chapter.title) === chapterSlug
          );
          const selectedChapter = matchingChapters.length > 1
            ? matchingChapters[requestedIndex]
            : matchingChapters[0];

          if (selectedChapter && !selectedChapter.documentId) {
            const fullChapter = selectedChapter.content === undefined
              ? await chapterService.findOne(selectedChapter.id)
              : selectedChapter;

            setChapters(currentChapters => currentChapters.map(chapter => (
              chapter.id === fullChapter.id ? fullChapter : chapter
            )));
            setActiveChapterId(fullChapter.id);
          }
        }
      } catch (err) {
        console.error('Error loading list:', err);
      }
    };
    load();
  }, [chapterNameParam, chapterService, docNameParam, isAuthenticated]);

  const handleEditDocumentClick = useCallback(async () => {
    if (!docId) return;
    try {
      const fullDoc = await documentService.fetchDocumentById(docId);
      setEditingDoc(fullDoc);
      setIsDocModalOpen(true);
    } catch (e) {
      console.error('Error loading document details', e);
    }
  }, [docId]);

  const handleSaveDocument = useCallback(async (data: any) => {
    if (!docId) return;
    setIsSaving(true);
    try {
      await documentService.updateDocument(docId, data);
      setDocumentName(data.title);
      setIsDocModalOpen(false);

      // Update session storage if needed
      const cached = sessionStorage.getItem('currentDoc');
      if (cached) {
        try {
          const doc = JSON.parse(cached);
          sessionStorage.setItem('currentDoc', JSON.stringify({ ...doc, title: data.title }));
        } catch { }
      }
    } catch (err) {
      console.error('Error saving document:', err);
      alert('Unable to save document.');
    } finally {
      setIsSaving(false);
    }
  }, [docId]);

  // --- Lazy-load chapter content on select ---
  const loadChapterContent = useCallback((chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    if (chapter.content === undefined) {
      chapterService.findOne(chapterId).then(full => {
        setChapters(prev => prev.map(c => c.id === chapterId ? full : c));
      }).catch(err => {
        console.error('Error loading chapter content:', err);
      });
    }
  }, [chapters, chapterService]);

  // --- Save (create or update) ---
  const handleSave = useCallback(async (
    data: SaveData,
    getContent: () => { json: any; text: string }
  ) => {
    setIsSaving(true);
    try {
      const { json: contentJSON, text: contentText } = getContent();

      if (isAuthenticated) {
        let finalDocId = data.documentId;
        if (data.newDocumentName) {
          const newDoc = await documentService.createDocument({
            title: data.newDocumentName,
            summary: data.newDocumentSummary,
            note: data.newDocumentNote,
            language: data.newDocumentLanguage,
          });
          finalDocId = newDoc.id;
        }

        if (activeChapterId) {
          await chapterService.update(activeChapterId, { title: data.title, documentId: finalDocId });
          if (chapterService.updateContent) {
            await chapterService.updateContent(activeChapterId, contentJSON, contentText);
          }
        } else {
          const newChap = await chapterService.create({
            title: data.title,
            documentId: finalDocId,
            content: contentJSON,
            contentText,
          });
          setActiveChapterId(newChap.id);
        }
      } else {
        if (activeChapterId) {
          await chapterService.update(activeChapterId, { title: data.title });
          if (chapterService.updateContent) {
            await chapterService.updateContent(activeChapterId, contentJSON, contentText);
          }
        } else {
          const newChap = await chapterService.create({
            title: data.title,
            content: contentJSON,
            contentText,
          });
          setActiveChapterId(newChap.id);
        }
      }

      const fresh = await chapterService.findAll(docId || undefined);
      setChapters(fresh);
      setIsSaveModalOpen(false);
    } catch (err) {
      console.error('Error saving draft:', err);
      alert('An error occurred while saving!');
    } finally {
      setIsSaving(false);
    }
  }, [activeChapterId, chapterService, docId, isAuthenticated]);

  // --- Delete ---
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return false;
    try {
      await chapterService.remove(id);
      setChapters(prev => prev.filter(c => c.id !== id));

      if (activeChapterId === id) {
        setActiveChapterId(null);
        loadedChapterIdRef.current = null;
      }
      return true;
    } catch (err) {
      console.error('Error deleting draft:', err);
      alert('Unable to delete draft.');
      return false;
    }
  }, [activeChapterId, chapterService]);

  const handleRename = useCallback(async (id: string, title: string) => {
    const nextTitle = title.trim();
    if (!nextTitle || nextTitle === chapters.find(chapter => chapter.id === id)?.title) return false;

    try {
      await chapterService.update(id, { title: nextTitle });
      setChapters(prev => prev.map(chapter => (
        chapter.id === id ? { ...chapter, title: nextTitle } : chapter
      )));
      return true;
    } catch (err) {
      console.error('Error renaming chapter:', err);
      alert('Unable to rename chapter.');
      return false;
    }
  }, [chapterService, chapters]);

  // --- New draft ---
  const handleNewDraft = useCallback(() => {
    setActiveChapterId(null);
    loadedChapterIdRef.current = null;
  }, []);

  return {
    // State
    chapters,
    activeChapterId,
    setActiveChapterId,
    docId,
    documentName,
    isSaveModalOpen,
    setIsSaveModalOpen,
    isSaving,
    loadedChapterIdRef,
    isDocModalOpen,
    setIsDocModalOpen,
    editingDoc,

    // Actions
    handleSave,
    handleDelete,
    handleRename,
    handleNewDraft,
    loadChapterContent,
    handleEditDocumentClick,
    handleSaveDocument,
  };
}
