import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Função para escalar baseado na resolução da TV
export const scale = (size: number) => {
  const baseWidth = 1920; // Base para 1080p
  return PixelRatio.roundToNearestPixel((size * width) / baseWidth);
};

// Função para altura vertical
export const verticalScale = (size: number) => {
  const baseHeight = 1080; // Base para 1080p
  return PixelRatio.roundToNearestPixel((size * height) / baseHeight);
};

// Função moderada que combina ambas
export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detectar se está em uma TV
export const isTV = () => {
  return width >= 1280 && height >= 720; // Resolução mínima para TV
};

// Cores padrão para TV
export const TVColors = {
  primary: '#00d4ff',
  secondary: '#ff6b6b',
  background: '#0f0f23',
  backgroundSecondary: '#1a1a2e',
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  overlay: 'rgba(0, 0, 0, 0.7)',
  focus: '#00d4ff',
  focusBackground: 'rgba(0, 212, 255, 0.1)',
};

// Espaçamentos padrão
export const TVSpacing = {
  xs: scale(8),
  sm: scale(16),
  md: scale(24),
  lg: scale(32),
  xl: scale(48),
  xxl: scale(64),
};
