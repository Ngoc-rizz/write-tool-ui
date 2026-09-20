'use client';
import { Suspense } from 'react';
import ChapterEditor from '@/modules/chapters/components/ChapterEditor';

export default function ChapterEditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ChapterEditor />
    </Suspense>
  );
}
