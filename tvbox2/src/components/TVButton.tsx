import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TVColors, scale } from '../utils/tvUtils';

interface TVButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  focused?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function TVButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  focused = false,
  style,
  textStyle,
}: TVButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size] as ViewStyle];
    
    if (focused) {
      baseStyle.push(styles.focused as ViewStyle);
    }
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondary as ViewStyle);
        break;
      case 'outline':
        baseStyle.push(styles.outline as ViewStyle);
        break;
      default:
        baseStyle.push(styles.primary as ViewStyle);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.text as TextStyle, styles[`${size}Text` as keyof typeof styles] as TextStyle];
    
    if (focused) {
      baseStyle.push(styles.focusedText as TextStyle);
    }
    
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineText as TextStyle);
        break;
      default:
        baseStyle.push(styles.primaryText as TextStyle);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  // Tamanhos
  small: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  medium: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
  },
  large: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(32),
  },
  // Variantes
  primary: {
    backgroundColor: TVColors.primary,
  },
  secondary: {
    backgroundColor: TVColors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: TVColors.primary,
  },
  // Estados
  focused: {
    borderColor: TVColors.focus,
    backgroundColor: TVColors.focusBackground,
    transform: [{ scale: 1.05 }],
  },
  // Textos
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: scale(14),
  },
  mediumText: {
    fontSize: scale(16),
  },
  largeText: {
    fontSize: scale(20),
  },
  primaryText: {
    color: TVColors.background,
  },
  outlineText: {
    color: TVColors.primary,
  },
  focusedText: {
    color: TVColors.text,
  },
});
