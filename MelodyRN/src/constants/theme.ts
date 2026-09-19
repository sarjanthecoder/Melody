// Melody App - Dark Neon Theme Constants

export const COLORS = {
  background: '#05070D',
  card: '#0D1220',
  cardElevated: '#131B2E',
  cardBorder: 'rgba(139, 92, 246, 0.2)',
  primary: '#8B5CF6',
  primaryDark: '#6366F1',
  accent: '#D946EF',
  accentLight: '#F472B6',
  text: '#FFFFFF',
  textSecondary: '#8A91A5',
  textMuted: '#4B5563',
  border: '#1A2234',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  overlay: 'rgba(5, 7, 13, 0.92)',
  glow: 'rgba(139, 92, 246, 0.4)',
} as const;

export const GRADIENTS = {
  primary: ['#6366F1', '#8B5CF6', '#D946EF'] as const,
  card: ['#0D1220', '#131B2E'] as const,
  glow: ['rgba(139, 92, 246, 0.25)', 'transparent'] as const,
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    huge: 34,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};
