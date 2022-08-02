import { BigNumberish } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Theme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { ActiveWeb3Provider, useActiveProvider } from '../packages/web3-provider';
import store from '../store';
import { setDefaultSettings } from '../store/state/swap/swapSlice';
import { defaultTheme } from '../theme';
import { ReferrerOptions } from '../types';
import { validateReferrerOptions } from '../utils';
import { validateDefaultTokensOptions, validateDefaultValue } from '../utils/validateDefaults';
import SwapWidget from './SwapWidget';

export interface Defaults {
  defaultInputTokenAddress?: { [chainId: number]: string | 'NATIVE' };
  defaultOutputTokenAddress?: { [chainId: number]: string | 'NATIVE' };
  defaultTypedValue?: BigNumberish;
  referrerOptions?: ReferrerOptions;
}

export interface WidgetProps extends Defaults {
  theme?: Theme;
  // locale?: SupportedLocale
  // provider?: JsonRpcProvider;
  jsonRpcEndpoint?: string | JsonRpcProvider;
  width?: string | number;
}

export default function Widget({
  theme,
  jsonRpcEndpoint,
  referrerOptions,
  width,
  defaultTypedValue,
  defaultInputTokenAddress,
  defaultOutputTokenAddress,
}: PropsWithChildren<WidgetProps>) {
  const provider = useActiveProvider();

  useEffect(() => {
    const defaults: Defaults = {};

    if (referrerOptions) {
      const validationMsg = validateReferrerOptions(referrerOptions);
      if (validationMsg) throw new Error(validationMsg);
      defaults.referrerOptions = referrerOptions;
    }

    if (defaultTypedValue) {
      const validationMsg = validateDefaultValue(defaultTypedValue);
      if (validationMsg) throw new Error(validationMsg);
      defaults.defaultTypedValue = defaultTypedValue.toString();
    }

    if (defaultInputTokenAddress || defaultOutputTokenAddress) {
      const validationMsg = validateDefaultTokensOptions(defaultInputTokenAddress, defaultOutputTokenAddress);
      if (validationMsg) throw new Error(validationMsg);
      defaults.defaultInputTokenAddress = defaultInputTokenAddress;
      defaults.defaultOutputTokenAddress = defaultOutputTokenAddress;
    }

    store.dispatch(setDefaultSettings(defaults));
  }, [referrerOptions, defaultTypedValue, defaultInputTokenAddress, defaultOutputTokenAddress]);

  return (
    <ThemeProvider theme={theme || defaultTheme}>
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
