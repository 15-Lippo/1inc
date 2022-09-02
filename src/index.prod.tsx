import './index.css';
import './components/Swap.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import React from 'react';

import Swap, { SwapProps } from './components/Swap';
import Widget, { WidgetProps } from './components/Widget';
export { ALL_SUPPORTED_CHAIN_IDS } from './constants';
export { DEFAULT_LOCALE, networkConfigs, SUPPORTED_LOCALES } from './constants';
export { nereusTheme } from './mui/theme';

// types
export type { SupportedLocale } from './constants';
export type { DefaultTokenOptions, defaultTypedValueOptions, ReferrerOptions, SupportedChainId } from './types';
export type { Provider as Eip1193Provider } from '@web3-react/types';
export type SwapWidgetProps = SwapProps & WidgetProps;
export type { Web3Provider } from '@ethersproject/providers';
export type { Theme } from '@mui/material';

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap {...props} />
    </Widget>
  );
}
