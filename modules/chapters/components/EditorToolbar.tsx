import React from 'react';
import styles from './EditorToolbar.module.css';
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.toolbar}>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${styles.formatBtn} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`} 
          aria-label="Heading 1"
        >
          H1
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${styles.formatBtn} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`} 
          aria-label="Heading 2"
        >
          H2
        </button>
        
        <div className={styles.divider}></div>
        
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.formatBtn} ${editor.isActive('bold') ? styles.active : ''}`} 
          aria-label="Bold" 
          style={{ fontWeight: 'bold' }}
        >
          B
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.formatBtn} ${editor.isActive('italic') ? styles.active : ''}`} 
          aria-label="Italic" 
          style={{ fontStyle: 'italic', fontFamily: 'serif' }}
        >
          I
        </button>
        
        <div className={styles.divider}></div>
        
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.formatBtn} ${editor.isActive('bulletList') ? styles.active : ''}`} 
          aria-label="List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        
        <div className={styles.divider}></div>
        
        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.formatBtn} ${editor.isActive('blockquote') ? styles.active : ''}`} 
          aria-label="Quote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
        </button>
        
        <button 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={styles.formatBtn} 
          aria-label="Undo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6"></path>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
