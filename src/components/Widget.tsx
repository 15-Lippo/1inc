import { JsonRpcProvider } from '@ethersproject/providers';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { useActiveProvider } from '../connector';
import { ActiveWeb3Provider } from '../hooks/useActiveWeb3React';
import store from '../store';
import theme from '../theme/config';
import SwapWidget from './SwapWidget';

export type WidgetProps = {
  // theme?: Theme
  // locale?: SupportedLocale
  // provider?: JsonRpcProvider;
  jsonRpcEndpoint?: string | JsonRpcProvider;
  // width?: string | number
};

export default function Widget({ jsonRpcEndpoint }: PropsWithChildren<WidgetProps>) {
  const provider = useActiveProvider();
  return (
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <Provider store={store}>
          <ActiveWeb3Provider
            provider={provider}
            jsonRpcEndpoint={jsonRpcEndpoint || process.env.REACT_APP_JSON_RPC_ENDPOINT}>
            <SwapWidget />
          </ActiveWeb3Provider>
        </Provider>
      </React.StrictMode>
    </ThemeProvider>
  );
}
