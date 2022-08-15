import { createTheme, PaletteOptions } from '@mui/material';

import baseTheme from './base-theme';

const LIGHT_GREY = '#F3F5FA';
const DEEP_BLUE = '#2F8AF5';
const CHARCOAL = '#222222';
const RED = '#E3402A';
const WHITE = '#FFFFFF';
const GREEN = '#00897B';
const BLUE_GREY = '#6C86AD';
const LIGHT_BLUE_GREY = '#9BAFCD';
const YELLOW = '#FF9C08';

const defaultPalette: PaletteOptions = {
  widget: {
    'input-primary-text': CHARCOAL,
    'input-secondary-text': BLUE_GREY,
    'input-placeholder': LIGHT_BLUE_GREY,
    'input-bg': LIGHT_GREY,
    'input-bg-01': WHITE,
    'input-border': DEEP_BLUE,
    'input-border-error': RED,
    'input-border-warn': YELLOW,

    'bg-main': WHITE,
    'bg-disabled': LIGHT_GREY,

    'bg-01': LIGHT_GREY,
    'bg-02': WHITE,
    'bg-03': RED,
    'bg-03-hover': `${RED}B2`, // add alpha=B2
    'bg-04': DEEP_BLUE,
    'bg-04-hover': `${DEEP_BLUE}B2`,
    'bg-05': `${DEEP_BLUE}29`,
    'bg-05-hover': `${DEEP_BLUE}66`,
    'bg-07': GREEN,
    'bg-main-btn': 'linear-gradient(270deg, rgba(3, 97, 206, 0.49) 0%, #2F8AF5 51.04%, #0FBEE4 100%)',
    'bg-main-btn-hovered':
      'linear-gradient(270deg, rgba(47, 138, 245, 0.2704) 0%, rgba(3, 97, 206, 0.442) 52.08%, rgba(15, 190, 228, 0.442) 100%)',
    'bg-alert-warn': '#FF9C0833',
    'bg-alert-error': '#C13D5429',
    'bg-alert': `${DEEP_BLUE}29`,

    'text-primary': CHARCOAL,
    'text-primary-01': DEEP_BLUE,
    'text-primary-02': WHITE,
    'text-disabled': LIGHT_BLUE_GREY,
    'text-secondary': BLUE_GREY,
    'text-successful': GREEN,
    'text-main-btn-00': WHITE,
    'text-main-btn-01': WHITE,
    'text-main-btn-02': DEEP_BLUE,
    'text-warn': YELLOW,
    'text-error': RED,
    'text-alert': CHARCOAL,

    'checkbox-00': DEEP_BLUE,
    'checkbox-01': LIGHT_BLUE_GREY,
    'checkbox-02': WHITE,

    'border-00': '#EAF1FB',
    'border-01': '#F1F3F6',
    'border-02': DEEP_BLUE,
    'border-03': LIGHT_BLUE_GREY,
    'border-gradient': 'radial-gradient(circle, #9BAFCD 0%, #9BAFCD 15%, rgba(155, 175, 205, 0) 100%)',

    'btn-text': DEEP_BLUE,
    'btn-text-hover': '#2F8AF566',
    'bg-btn-hover': LIGHT_GREY,

    'icon-01': CHARCOAL,
    'icon-02': BLUE_GREY,
    'icon-05': LIGHT_BLUE_GREY,
    'icon-06': WHITE,
    'icon-07': GREEN,
    'icon-08': RED,
    'icon-09': YELLOW,
    'icon-10': DEEP_BLUE,

    'bg-tooltip': WHITE,

    'skeleton-00': LIGHT_GREY,
    'skeleton-01': WHITE,
  },
};

const defaultTheme = createTheme(baseTheme, {
  palette: defaultPalette,
  components: {
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          color: defaultPalette.widget['input-primary-text'],
        },
      },
    },
  },
});

export default defaultTheme;
