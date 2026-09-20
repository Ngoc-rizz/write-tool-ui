'use client';

import { useMemo } from 'react';
import { useAuth } from '@/stores/AuthProvider';
import { IChapterService } from '../types';
import { chaptersApiService } from '../services/chapters.api.service';
import { chaptersLocalService } from '../services/chapters.local.service';

export function useChapterService(): IChapterService {
  const { isAuthenticated } = useAuth();

  return useMemo(() => {
    return isAuthenticated ? chaptersApiService : chaptersLocalService;
  }, [isAuthenticated]);
}
