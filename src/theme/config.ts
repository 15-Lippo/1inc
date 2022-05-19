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
  // regular
  rxxlg24: TypographyStyle;
  rlg18: TypographyStyle;
  rm16: TypographyStyle;
  rsm14: TypographyStyle;
  rxs12: TypographyStyle;

  // medium
  mxlg20: TypographyStyle;
  mlg18: TypographyStyle;

  //semi-bold
  sblg18: TypographyStyle;
  sbm16: TypographyStyle;
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
  // regular
  rxxlg24?: TypographyStyleOptions;
  rlg18?: TypographyStyleOptions;
  rm16?: TypographyStyleOptions;
  rsm14?: TypographyStyleOptions;
  rxs12?: TypographyStyleOptions;

  // medium
  mxlg20?: TypographyStyleOptions;
  mlg18?: TypographyStyleOptions;

  //semi-bold
  sblg18?: TypographyStyleOptions;
  sbm16?: TypographyStyleOptions;
}

interface IThemeOptions extends ThemeOptions {
  palette: IPaletteOptions;
  typography: ITypographyOptions;
}

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
        disableFocusRipple: true,
      },
    },
  },
  // overrides: {
  //   MuiCssBaseline: {
  //     '@global': {
  //       html: {
  //         height: '100%',
  //       },
  //       body: {
  //         height: '100%',
  //       },
  //       '#root': {
  //         height: '100%',
  //       },
  //     },
  //   },
  // },
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
    rxxlg24: {
      fontWeight: 400,
      fontSize: '24px',
    },
    rlg18: {
      fontWeight: 400,
      fontSize: '18px',
    },
    rm16: {
      fontWeight: 400,
      fontSize: '16px',
    },
    rsm14: {
      fontWeight: 400,
      fontSize: '14px',
    },
    rxs12: {
      fontWeight: 400,
      fontSize: '12px',
    },
    mxlg20: {
      fontWeight: 500,
      fontSize: '20px',
    },
    mlg18: {
      fontWeight: 500,
      fontSize: '18px',
    },
    sblg18: {
      fontWeight: 600,
      fontSize: '18px',
    },
    sbm16: {
      fontWeight: 600,
      fontSize: '16px',
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
