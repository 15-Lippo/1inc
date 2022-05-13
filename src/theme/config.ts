import { Color } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Palette, PaletteColorOptions, PaletteOptions } from '@mui/material/styles/createPalette';
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';
import {
  Typography,
  TypographyOptions,
  TypographyStyle,
  TypographyStyleOptions,
} from '@mui/material/styles/createTypography';

interface IPalette extends Palette {
  dark: Color;
  cool: Color;
  blue: Color;
  red: Color;
  yellow: Color;
  green: Color;
  gradient: Color;
}

interface ITypography extends Typography {
  r: TypographyStyle; // regular
  m: TypographyStyle; // medium
  sb: TypographyStyle; //semi-bold
}

export interface ITheme extends Theme {
  palette: IPalette;
  typography: ITypography;
}

interface IPaletteOptions extends PaletteOptions {
  dark?: PaletteColorOptions;
  cool?: PaletteColorOptions;
  blue?: PaletteColorOptions;
  red?: PaletteColorOptions;
  yellow?: PaletteColorOptions;
  green?: PaletteColorOptions;
  gradient?: PaletteColorOptions;
}

interface ITypographyOptions extends TypographyOptions {
  r?: TypographyStyleOptions;
  m?: TypographyStyleOptions;
  sb?: TypographyStyleOptions;
}

interface IThemeOptions extends ThemeOptions {
  palette: IPaletteOptions;
  typography: ITypographyOptions;
}

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
        },
        '#root': {
          height: '100%',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    r: {
      xxlg24: {
        fontWeight: 400,
        fontSize: '24px',
      },
      lg18: {
        fontWeight: 400,
        fontSize: '18px',
      },
      m16: {
        fontWeight: 400,
        fontSize: '16px',
      },
      sm14: {
        fontWeight: 400,
        fontSize: '14px',
      },
      xs12: {
        fontWeight: 400,
        fontSize: '12px',
      },
      m: {
        lg18: {
          fontWeight: 500,
          fontSize: '18px',
        },
      },
      sb: {
        lg18: {
          fontWeight: 600,
          fontSize: '18px',
        },
        m16: {
          fontWeight: 600,
          fontSize: '16px',
        },
      },
    },
  },
  palette: {
    background: {
      default: '#FFFFFF',
    },
    common: {
      white: '#FFFFFF',
    },
    dark: {
      900: '#222222',
      700: '#6C86AD',
      500: '#9BAFCD',
      50: 'rgba(202,218,244,0.5)',
    },
    cool: {
      300: '#E3E7EE',
      100: '#F3F5FA',
    },
    blue: {
      700: '#0056B3',
      500: '#2F8AF5',
      40: 'rgba(47,138,245,0.4)',
      16: 'rgba(47,138,245,0.16)',
    },
    red: {
      500: '#E3402A',
      16: 'rgba(193,61,84,0.16)',
    },
    yellow: {
      500: '#FF9C08',
    },
    green: {
      500: '#00897B',
    },
    gradient: {
      500: 'linear-gradient(270deg, rgba(3, 97, 206, 0.49) 0%, #2F8AF5 51.04%, #0FBEE4 100%)',
      52: 'linear-gradient(270deg, rgba(47, 138, 245, 0.2704) 0%, rgba(3, 97, 206, 0.442) 52.08%, rgba(15, 190, 228, 0.442) 100%)',
    },
  },
} as IThemeOptions);

export default theme;
