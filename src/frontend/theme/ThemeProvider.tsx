import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import OpenSansRegularWoff from '../assets/fonts/open-sans-v34-latin-regular.woff';
import OpenSansRegularWoff2 from '../assets/fonts/open-sans-v34-latin-regular.woff2';
import OpenSansRegularEot from '../assets/fonts/open-sans-v34-latin-regular.eot';
import OpenSansRegularTtf from '../assets/fonts/open-sans-v34-latin-regular.ttf';
import OpenSansRegularSvg from '../assets/fonts/open-sans-v34-latin-regular.svg';
import { CssBaseline } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
  interface TypeBackground {
    knockoutOne?: string;
  }
  interface Palette {
    solidGrey: Palette['primary'];
    darkgray: Palette['primary'];
    solidBlue: Palette['primary'];
    mediumGrey: Palette['primary'];
    darkGreen: Palette['primary'];
    lightGray: Palette['primary'];
    solidOrange: Palette['primary'];
  }
  interface PaletteOptions {
    solidGrey: PaletteOptions['primary'];
    darkgray: PaletteOptions['primary'];
    solidBlue: PaletteOptions['primary'];
    mediumGrey: PaletteOptions['primary'];
    darkGreen: PaletteOptions['primary'];
    lightGray: PaletteOptions['primary'];
    solidOrange: PaletteOptions['primary'];
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
  interface TypographyVariants {
    title: React.CSSProperties;
  }
  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
  }
}

type Props = {
  children: JSX.Element;
};

const theme = createTheme({
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
      light: '#F2F2F2',
    },
    solidGrey: {
      main: '#7e8083',
      light: '#7e808340',
    },
    darkGreen: {
      main: '#6BA543',
    },
    lightGray: {
      main: '#F2F2F2',
    },
    solidOrange: {
      main: '#F47B27',
    },
    background: {
      knockoutOne: '#F7FBF5',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      /* open-sans-regular - latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400;
        src: url(${OpenSansRegularEot}); /* IE9 Compat Modes */
        src: local(''),
             url(${OpenSansRegularEot}) format('embedded-opentype'), /* IE6-IE8 */
             url(${OpenSansRegularWoff2}) format('woff2'), /* Super Modern Browsers */
             url(${OpenSansRegularWoff}) format('woff'), /* Modern Browsers */
             url(${OpenSansRegularTtf}) format('truetype'), /* Safari, Android, iOS */
             url(${OpenSansRegularSvg}) format('svg'); /* Legacy iOS */
      }
      `,
    },
  },
});

export default function CustomStyles({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
