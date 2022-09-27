import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
  interface Palette {
    solidGrey: Palette['primary'];
    darkgray: Palette['primary'];
    solidBlue: Palette['primary'];
    mediumGrey: Palette['primary'];
  }
  interface PaletteOptions {
    solidGrey: PaletteOptions['primary'];
    darkgray: PaletteOptions['primary'];
    solidBlue: PaletteOptions['primary'];
    mediumGrey: PaletteOptions['primary'];
  }
  interface PaletteColor {
    darker?: string;
    hover?: string;
    active?: string;
    lightHover?: string;
    lightActive?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
    hover?: string;
    active?: string;
    lightHover?: string;
    lightActive?: string;
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}

type Props = {
  children: JSX.Element;
};

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    darkgray: {
      main: '#222222',
    },
    solidBlue: {
      main: '#2372B9',
      lightHover: 'rgb(35,114,185, .05)',
      lightActive: '#EDF4F9',
    },
    mediumGrey: {
      main: '#646669',
    },
    solidGrey: {
      main: '#7e8083',
      light: '#7e808340',
    },
  },
});

export default function CustomStyles({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}