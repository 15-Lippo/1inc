import { JsonRpcProvider } from '@ethersproject/providers';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { ActiveWeb3Provider, useActiveProvider } from '../packages/web3-provider';
import store from '../store';
import { setReferrerOptions } from '../store/state/swap/swapSlice';
import theme from '../theme/config';
import { ReferrerOptions } from '../types';
import { validateReferrerOptions } from '../utils';
import SwapWidget from './SwapWidget';

export type WidgetProps = {
  // theme?: Theme
  // locale?: SupportedLocale
  // provider?: JsonRpcProvider;
  jsonRpcEndpoint?: string | JsonRpcProvider;
  width?: string | number;
  referrerOptions?: ReferrerOptions;
};

export default function Widget({ jsonRpcEndpoint, referrerOptions, width }: PropsWithChildren<WidgetProps>) {
  const provider = useActiveProvider();

  if (referrerOptions) {
    const validationMsg = validateReferrerOptions(referrerOptions);
    if (validationMsg) throw new Error(validationMsg);

    store.dispatch(setReferrerOptions(referrerOptions));
  }

  return (
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <Provider store={store}>
          <ActiveWeb3Provider
            provider={provider}
            jsonRpcEndpoint={jsonRpcEndpoint || process.env.REACT_APP_JSON_RPC_ENDPOINT}>
            <SwapWidget width={width || 418} />
          </ActiveWeb3Provider>
        </Provider>
      </React.StrictMode>
    </ThemeProvider>
  );
}
