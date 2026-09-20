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
    label: 'Giấy Ngà',
    hex: '#F7F4EE',
    description: 'Dịu mắt ban ngày',
    icon: '☀',
  },
  {
    value: 'giay-moc' as ThemeMode,
    label: 'Giấy Mộc',
    hex: '#F1EAD9',
    description: 'Màu trang sách in',
    icon: '📖',
  },
  {
    value: 'dem-than' as ThemeMode,
    label: 'Đêm Than',
    hex: '#161716',
    description: 'Tránh bóng ma OLED',
    icon: '🌙',
  },
] as const;

export const FONT_OPTIONS = [
  {
    value: 'serif' as FontFamily,
    label: 'Source Serif 4',
    description: 'Cổ điển, ấm cúng như trang sách in',
  },
  {
    value: 'liberation' as FontFamily,
    label: 'Liberation Serif',
    description: 'Phông chữ cổ điển, dễ đọc',
  },
  {
    value: 'sans' as FontFamily,
    label: 'Inter (Sans-serif)',
    description: 'Phẳng phiu, hiện đại, rõ nét',
  },
] as const;

export const FONT_SIZE_OPTIONS = [
  { value: '16' as FontSize, label: '16px' },
  { value: '18' as FontSize, label: '18px (Chuẩn)' },
  { value: '20' as FontSize, label: '20px' },
] as const;

export const CONTENT_WIDTH_OPTIONS = [
  { value: '680' as ContentWidth, label: '680px (Gọn)' },
  { value: '740' as ContentWidth, label: '740px (Chuẩn)' },
  { value: '800' as ContentWidth, label: '800px (Rộng)' },
] as const;
