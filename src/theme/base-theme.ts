import { PaletteOptions, ThemeOptions } from '@mui/material';

import { ExtendedTypographyOptions } from './theme';

const baseTheme: ThemeOptions = {
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
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
          '&.MuiFormControlLabel-root .MuiFormControlLabel-label': {
            width: '100%',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#6C86AD',
          '&.Mui-checked': {
            color: '#2F8AF5',
          },
        },
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
    MuiMenuList: {
      styleOverrides: {
        root: {
          padding: 0,
          width: '100%',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '10px 0',
          '&$selected': {
            backgroundColor: 'transparent',
          },
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
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
    mm16: {
      fontWeight: 500,
      fontSize: '16px',
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
      70: 'rgba(47,138,245,0.7)',
      40: 'rgba(47,138,245,0.4)',
      16: 'rgba(47,138,245,0.16)',
    },
    red: {
      500: '#E3402A',
      70: 'rgba(227, 64, 42, 0.7)',
      16: 'rgba(193,61,84,0.16)',
    },
    yellow: {
      500: '#FF9C08',
      20: 'rgba(255, 156, 8, 0.2)',
    },
    green: {
      500: 'rgba(0, 137, 123, 1)',
    },
    gradient: {
      500: 'linear-gradient(270deg, rgba(3, 97, 206, 0.49) 0%, #2F8AF5 51.04%, #0FBEE4 100%)',
      52: 'linear-gradient(270deg, rgba(47, 138, 245, 0.2704) 0%, rgba(3, 97, 206, 0.442) 52.08%, rgba(15, 190, 228, 0.442) 100%)',
    },
  } as PaletteOptions,
} as ThemeOptions;

export default baseTheme;
