import { createTheme, ThemeOptions } from '@mui/material';
import { PaletteOptions } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { CSSProperties } from 'react';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    fontFamily: true;
    // regular
    rxxlg24: true;
    rlg18: true;
    rm16: true;
    rsm14: true;
    rxs12: true;

    // medium
    mxlg20: true;
    mlg18: true;

    //semi-bold
    sblg18: true;
    sbm16: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  // regular
  rxxlg24: CSSProperties;
  rlg18: CSSProperties;
  rm16: CSSProperties;
  rsm14: CSSProperties;
  rxs12: CSSProperties;

  // medium
  mxlg20: CSSProperties;
  mlg18: CSSProperties;

  //semi-bold
  sblg18: CSSProperties;
  sbm16: CSSProperties;
}

declare module '@mui/material/styles' {
  interface Palette {
    dark: {
      900: CSSProperties['color'];
      700: CSSProperties['color'];
      500: CSSProperties['color'];
      50: CSSProperties['color'];
    };
    cool: {
      300: CSSProperties['color'];
      100: CSSProperties['color'];
    };
    blue: {
      700: CSSProperties['color'];
      500: CSSProperties['color'];
      40: CSSProperties['color'];
      16: CSSProperties['color'];
    };
    red: {
      500: CSSProperties['color'];
      16: CSSProperties['color'];
    };
    yellow: {
      500: CSSProperties['color'];
      20: CSSProperties['color'];
    };
    green: {
      500: CSSProperties['color'];
    };
    gradient: {
      500: CSSProperties['color'];
      52: CSSProperties['color'];
    };
  }
  interface PaletteOptions {
    dark: {
      900: CSSProperties['color'];
      700: CSSProperties['color'];
      500: CSSProperties['color'];
      50: CSSProperties['color'];
    };
    cool: {
      300: CSSProperties['color'];
      100: CSSProperties['color'];
    };
    blue: {
      700: CSSProperties['color'];
      500: CSSProperties['color'];
      40: CSSProperties['color'];
      16: CSSProperties['color'];
    };
    red: {
      500: CSSProperties['color'];
      16: CSSProperties['color'];
    };
    yellow: {
      500: CSSProperties['color'];
      20: CSSProperties['color'];
    };
    green: {
      500: CSSProperties['color'];
    };
    gradient: {
      500: CSSProperties['color'];
      52: CSSProperties['color'];
    };
  }
}

const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.MuiAccordionSummary-root.Mui-expanded': {
            minHeight: 0,
          },
        },
      },
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            backgroundColor: 'white',
          },
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          minHeight: 0,
          '.MuiAccordionSummary-content': {
            height: '3rem',
            alignItems: 'center',
            margin: 0,
          },
          '.MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
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
      20: 'rgba(255, 156, 8, 0.2)',
    },
    green: {
      500: '#00897B',
    },
    gradient: {
      500: 'linear-gradient(270deg, rgba(3, 97, 206, 0.49) 0%, #2F8AF5 51.04%, #0FBEE4 100%)',
      52: 'linear-gradient(270deg, rgba(47, 138, 245, 0.2704) 0%, rgba(3, 97, 206, 0.442) 52.08%, rgba(15, 190, 228, 0.442) 100%)',
    },
  } as PaletteOptions,
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
  } as ExtendedTypographyOptions,
} as ThemeOptions);

export default theme;
