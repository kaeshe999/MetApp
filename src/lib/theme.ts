import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const Colors = {
  primary: '#0A1E3C',
  secondary: '#D20015',
  accent: '#D4AF37',
  textLight: '#FFFFFF',
  textDark: '#333333',
  backgroundLight: '#F8F9FA',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    onPrimary: Colors.textLight,
    primaryContainer: '#1a3560',
    secondary: Colors.secondary,
    onSecondary: Colors.textLight,
    secondaryContainer: '#ff4444',
    tertiary: Colors.accent,
    background: Colors.backgroundLight,
    surface: Colors.textLight,
    onSurface: Colors.textDark,
    outline: '#cccccc',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.accent,
    secondary: Colors.secondary,
    background: Colors.primary,
    surface: '#1a3560',
  },
};
