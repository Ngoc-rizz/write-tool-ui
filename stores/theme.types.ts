// Theme & Typography settings types

export type ThemeMode = 'giay-nga' | 'giay-moc' | 'dem-than';
export type FontFamily = 'serif' | 'sans' | 'liberation';
export type FontSize = '16' | '18' | '20';
export type ContentWidth = '680' | '740' | '800';

export interface ThemeSettings {
  theme: ThemeMode;
  fontFamily: FontFamily;
  fontSize: FontSize;
  contentWidth: ContentWidth;
}

export const DEFAULT_SETTINGS: ThemeSettings = {
  theme: 'giay-moc',
  fontFamily: 'serif',
  fontSize: '18',
  contentWidth: '740',
};

export const THEME_OPTIONS = [
  {
    value: 'giay-nga' as ThemeMode,
    label: 'Ivory Paper',
    hex: '#F7F4EE',
    description: 'Easy on the eyes during the day',
    icon: '☀',
  },
  {
    value: 'giay-moc' as ThemeMode,
    label: 'Natural Paper',
    hex: '#F1EAD9',
    description: 'The color of a printed page',
    icon: '📖',
  },
  {
    value: 'dem-than' as ThemeMode,
    label: 'Charcoal Night',
    hex: '#161716',
    description: 'Avoid OLED ghosting',
    icon: '🌙',
  },
] as const;

export const FONT_OPTIONS = [
  {
    value: 'serif' as FontFamily,
    label: 'Source Serif 4',
    description: 'Classic and cozy like a printed page',
  },
  {
    value: 'liberation' as FontFamily,
    label: 'Liberation Serif',
    description: 'Classic, easy-to-read typeface',
  },
  {
    value: 'sans' as FontFamily,
    label: 'Inter (Sans-serif)',
    description: 'Clean, modern, and crisp',
  },
] as const;

export const FONT_SIZE_OPTIONS = [
  { value: '16' as FontSize, label: '16px' },
  { value: '18' as FontSize, label: '18px (Standard)' },
  { value: '20' as FontSize, label: '20px' },
] as const;

export const CONTENT_WIDTH_OPTIONS = [
  { value: '680' as ContentWidth, label: '680px (Compact)' },
  { value: '740' as ContentWidth, label: '740px (Standard)' },
  { value: '800' as ContentWidth, label: '800px (Wide)' },
] as const;
