import { TypographyOptions } from '@mui/material/styles/createTypography';
import { CSSProperties } from 'react';

interface WidgetColors {
  'input-primary-text': CSSProperties['color'];
  'input-secondary-text': CSSProperties['color'];
  'input-placeholder': CSSProperties['color'];
  'input-bg': CSSProperties['color'];
  'input-bg-01': CSSProperties['color'];
  'input-border': CSSProperties['color'];
  'input-border-error': CSSProperties['color'];
  'input-border-warn': CSSProperties['color'];

  'bg-main': CSSProperties['color'];
  'bg-disabled': CSSProperties['color'];
  'bg-main-btn': CSSProperties['color'];
  'bg-main-btn-hovered': CSSProperties['color'];
  'bg-01': CSSProperties['color'];
  'bg-02': CSSProperties['color'];
  'bg-03': CSSProperties['color'];
  'bg-03-hover': CSSProperties['color'];
  'bg-04': CSSProperties['color'];
  'bg-04-hover': CSSProperties['color'];
  'bg-05': CSSProperties['color'];
  'bg-05-hover': CSSProperties['color'];
  'bg-07': CSSProperties['color'];
  'bg-alert-warn': CSSProperties['color'];
  'bg-alert-error': CSSProperties['color'];
  'bg-alert': CSSProperties['color'];

  'text-primary': CSSProperties['color'];
  'text-primary-01': CSSProperties['color'];
  'text-primary-02': CSSProperties['color'];
  'text-disabled': CSSProperties['color'];
  'text-secondary': CSSProperties['color'];
  'text-successful': CSSProperties['color'];
  'text-main-btn-00': CSSProperties['color'];
  'text-main-btn-01': CSSProperties['color'];
  'text-main-btn-02': CSSProperties['color'];
  'text-warn': CSSProperties['color'];
  'text-error': CSSProperties['color'];
  'text-alert': CSSProperties['color'];

  'checkbox-00': CSSProperties['color'];
  'checkbox-01': CSSProperties['color'];
  'checkbox-02': CSSProperties['color'];

  'border-00': CSSProperties['color'];
  'border-01': CSSProperties['color'];
  'border-02': CSSProperties['color'];

  'btn-text': CSSProperties['color'];
  'btn-text-hover': CSSProperties['color'];
  'bg-btn-hover': CSSProperties['color'];

  'icon-01': CSSProperties['color'];
  'icon-02': CSSProperties['color'];
  'icon-05': CSSProperties['color'];
  'icon-06': CSSProperties['color'];
  'icon-07': CSSProperties['color'];
  'icon-08': CSSProperties['color'];
  'icon-09': CSSProperties['color'];
  'icon-10': CSSProperties['color'];

  'bg-tooltip': CSSProperties['color'];

  'skeleton-00': CSSProperties['color'];
  'skeleton-01': CSSProperties['color'];
}

declare module '@mui/material/styles' {
  interface Palette {
    widget: WidgetColors;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PaletteOptions extends Partial<Palette> {
    widget: Partial<WidgetColors>;
  }
}

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
    mm16: true;

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
  mm16: CSSProperties;

  //semi-bold
  sblg18: CSSProperties;
  sbm16: CSSProperties;
}
