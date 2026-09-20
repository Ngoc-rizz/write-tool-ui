'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './chapterEditor.module.css';
import Navbar from '@/components/layout/Navbar/Navbar';
import EditorSidebar from './EditorSidebar';
import EditorMobileSubHeader from './EditorMobileSubHeader';
import EditorCanvas from './EditorCanvas';
import EditorFooter from './EditorFooter';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import SaveChapterModal from './SaveChapterModal';
import { useChapterEditor } from '../hooks/useChapterEditor';
import DocumentModal from '@/modules/documents/components/DocumentModal/DocumentModal';
import { importFile } from '../utils/fileImport';
import { useFileImport } from '../hooks/useFileImport';

export default function ChapterEditor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGlobalSidebarOpen, setIsGlobalSidebarOpen] = useState(false);

  const {
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
    handleSave,
    handleDelete,
    handleRename,
    handleNewDraft,
    loadChapterContent,
    handleEditDocumentClick,
    handleSaveDocument,
  } = useChapterEditor();

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: true,
    content: '',
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
    onFocus: () => {
      if (isSidebarOpen) setIsSidebarOpen(false);
      if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
    }
  });

  // --- Load chapter content into editor when selected ---
  useEffect(() => {
    if (editor && activeChapterId) {
      if (loadedChapterIdRef.current === activeChapterId) return;

      const chapter = chapters.find(c => c.id === activeChapterId);
      if (chapter) {
        if (chapter.content !== undefined) {
          editor.commands.setContent(chapter.content || '');
          loadedChapterIdRef.current = activeChapterId;
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
          }
        } else {
          loadChapterContent(activeChapterId);
        }
      }
    }
  }, [activeChapterId, editor, chapters, loadChapterContent, loadedChapterIdRef]);

  useEffect(()=> {
    const handleKeyDown = (e: KeyboardEvent)=> {
      if((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        e.stopPropagation()
        
        setIsSaveModalOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // --- Handlers that need access to the editor ---
  const handleSaveSubmit = async (data: Parameters<typeof handleSave>[0]) => {
    await handleSave(data, () => ({
      json: editor?.getJSON(),
      text: editor?.getText() || '',
    }));
  };

  const handleNewDraftClick = () => {
    handleNewDraft();
    if (editor) {
      editor.commands.setContent('');
      editor.commands.focus();
    }
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    const deleted = await handleDelete(id);
    if (deleted && activeChapterId === id && editor) {
      editor.commands.setContent('');
      editor.commands.focus();
    }
  };

  const handleRenameChapter = async (id: string) => {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) return;

    const title = window.prompt('Rename chapter', chapter.title);
    if (title !== null) {
      await handleRename(id, title);
    }
  };

  const handleDownloadTxtClick = () => {
    if (!editor) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const chapTitle = activeChapterId ? chapters.find(c => c.id === activeChapterId)?.title : 'Ban-thao';
    a.download = `${chapTitle || 'Ban-thao'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Import file ---
  const { fileInputRef, handleImportFileClick, handleFileSelected } = useFileImport(editor, handleNewDraftClick);


  // --- Scroll ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      sessionStorage.setItem('chapterScrollPos', top.toString());
    }, 200);
  };

  const handleScrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToBottom = () => {
    if (editor) editor.commands.focus('end');
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  // --- Shared sidebar props ---
  const sidebarProps = {
    documentName,
    chapters,
    activeChapterId: activeChapterId || undefined,
    onSaveClick: () => setIsSaveModalOpen(true),
    onDownloadTxtClick: handleDownloadTxtClick,
    onImportFileClick: handleImportFileClick,
    onNewDraftClick: handleNewDraftClick,
    onDeleteChapterClick: handleDeleteChapter,
    onRenameChapterClick: handleRenameChapter,
    onEditDocumentClick: handleEditDocumentClick,
    isSaving,
  };

  return (
    <div className={styles.editorContainer}>
      <Sidebar isOpen={isGlobalSidebarOpen} onClose={() => setIsGlobalSidebarOpen(false)} />
      <Navbar onMenuClick={() => setIsGlobalSidebarOpen(true)} />
      <div className={styles.editorBody}>
        <button
          className={`${styles.sidebarToggleBtn} ${isSidebarOpen ? styles.isOpen : styles.isClosed}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse" : "Open table of contents"}
        >
          {isSidebarOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.open : styles.closed}`}>
          <EditorSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            isMobile={false}
            onChapterClick={(id) => setActiveChapterId(id)}
            {...sidebarProps}
          />
        </div>

        <div className={`${styles.mobileSidebarWrapper} ${isMobileSidebarOpen ? styles.open : ''}`}>
          <div className={styles.mobileOverlay} onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className={styles.mobileDrawer}>
            <EditorSidebar
              isOpen={true}
              onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onMobileClose={() => setIsMobileSidebarOpen(false)}
              isMobile={true}
              onChapterClick={(id) => {
                setActiveChapterId(id);
                setIsMobileSidebarOpen(false);
              }}
              {...sidebarProps}
            />
          </div>
        </div>

        <div className={`${styles.mainContent} ${isSidebarOpen ? styles.shifted : ''}`}>
          <EditorMobileSubHeader 
            onOpenSidebar={() => setIsMobileSidebarOpen(true)} 
            chapterTitle={activeChapterId ? chapters.find(c => c.id === activeChapterId)?.title : undefined}
          />
          <div className={styles.canvasWrapper} ref={scrollRef} onScroll={handleScroll}>
            <EditorCanvas editor={editor} />
          </div>

          <div className={styles.floatingActions}>
            <button className={styles.floatingBtn} onClick={handleScrollToTop} title="Go to top">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button className={styles.floatingBtn} onClick={handleScrollToBottom} title="Continue writing (Go to bottom)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          <EditorFooter editor={editor} />
        </div>
      </div>

      <SaveChapterModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveSubmit}
        initialTitle={activeChapterId ? chapters.find(c => c.id === activeChapterId)?.title : ''}
        initialDocumentId={activeChapterId ? chapters.find(c => c.id === activeChapterId)?.documentId || undefined : docId || undefined}
        isSaving={isSaving}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        initialData={editingDoc}
        onSave={handleSaveDocument}
        isSaving={isSaving}
      />

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
    </div>
  );
}
