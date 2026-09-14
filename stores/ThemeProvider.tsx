'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type {
  ThemeSettings,
  ThemeMode,
  FontFamily,
  FontSize,
  ContentWidth,
} from '@/stores/theme.types';
import { DEFAULT_SETTINGS } from '@/stores/theme.types';

/* =============================================
   localStorage helpers
   ============================================= */
const STORAGE_KEY = 'write-ui-theme-settings';

function loadSettings(): ThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: ThemeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/* =============================================
   Apply settings to DOM (data attributes on <html>)
   ============================================= */
function applyToDOM(settings: ThemeSettings): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', settings.theme);
  root.setAttribute('data-font', settings.fontFamily);
  root.setAttribute('data-font-size', settings.fontSize);
  root.setAttribute('data-content-width', settings.contentWidth);
}

/* =============================================
   Context
   ============================================= */
interface ThemeContextValue {
  settings: ThemeSettings;
  setTheme: (theme: ThemeMode) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  setContentWidth: (width: ContentWidth) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* =============================================
   Provider
   ============================================= */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    applyToDOM(stored);
    setMounted(true);
  }, []);

  // Sync to DOM + localStorage whenever settings change
  const updateSettings = useCallback(
    (updater: (prev: ThemeSettings) => ThemeSettings) => {
      setSettings((prev) => {
        const next = updater(prev);
        applyToDOM(next);
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => updateSettings((s) => ({ ...s, theme })),
    [updateSettings]
  );

  const setFontFamily = useCallback(
    (fontFamily: FontFamily) => updateSettings((s) => ({ ...s, fontFamily })),
    [updateSettings]
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => updateSettings((s) => ({ ...s, fontSize })),
    [updateSettings]
  );

  const setContentWidth = useCallback(
    (contentWidth: ContentWidth) =>
      updateSettings((s) => ({ ...s, contentWidth })),
    [updateSettings]
  );

  const resetToDefaults = useCallback(() => {
    updateSettings(() => DEFAULT_SETTINGS);
  }, [updateSettings]);

  // Prevent flash of wrong theme (show nothing until mounted)
  if (!mounted) {
    return (
      <div
        style={{ visibility: 'hidden' }}
        suppressHydrationWarning
      >
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        settings,
        setTheme,
        setFontFamily,
        setFontSize,
        setContentWidth,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* =============================================
   Hook
   ============================================= */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>');
  }
  return ctx;
}
