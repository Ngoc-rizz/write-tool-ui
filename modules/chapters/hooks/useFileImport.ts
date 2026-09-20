import { useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { importFile } from '../utils/fileImport'; 

export function useFileImport(editor: Editor | null,handleNewDraft: () => void ) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      e.target.value = '';
        
      try {
       const result = await importFile(file);

      handleNewDraft();

      if (editor) {
        editor.commands.setContent(result.html);
        editor.commands.focus();
      }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unable to read file.';
        alert(message);
      }
    },
    [editor]
  );

  return { fileInputRef, handleImportFileClick, handleFileSelected };
}