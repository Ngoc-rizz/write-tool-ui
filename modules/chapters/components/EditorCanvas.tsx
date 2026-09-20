import React from 'react';
import styles from './EditorCanvas.module.css';
import { EditorContent, Editor } from '@tiptap/react';

interface EditorCanvasProps {
  editor: Editor | null;
}

export default function EditorCanvas({ editor }: EditorCanvasProps) {
  return (
    <div className={styles.canvas} onClick={() => editor?.commands.focus()}>
      <EditorContent editor={editor} className={styles.editorContentWrapper} />
    </div>
  );
}
