import styles from './EditorFooter.module.css';
import { Editor } from '@tiptap/react';
import EditorToolbar from './EditorToolbar';
import React, { useState, useEffect } from 'react';
import { countWords, countChars } from '@/utils/text.util';

interface EditorFooterProps {
  editor: Editor | null;
}

export default function EditorFooter({ editor }: EditorFooterProps) {
  const [stats, setStats] = useState({ wordCount: 0, characterCount: 0 });

  useEffect(() => {
    if (!editor) return;
    const updateStats = () => {
      const text = editor.getText();
      setStats({
        wordCount: countWords(text),
        characterCount: countChars(text)
      });
    };
    updateStats();

    // Debounce khi gõ
    let timeout: NodeJS.Timeout;
    const handleUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateStats, 500);
    };

    editor.on('update', handleUpdate);

    return () => {
      clearTimeout(timeout);
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  const { wordCount, characterCount } = stats;


  return (
    <div className={styles.footer}>
      <div className={styles.stats}>
        {wordCount} từ &bull; {characterCount} ký tự;
      </div>

      <div className={styles.toolbarWrapper}>
        <EditorToolbar editor={editor} />
      </div>

      <div className={styles.actions}>
        <div className={styles.saveStatus}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Tự động lưu</span>
        </div>
      </div>
    </div>
  );
}
