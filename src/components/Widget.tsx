import { BigNumberish } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Theme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo } from 'react';
import { PropsWithChildren } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from '../constants';
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
  locale?: SupportedLocale;
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
  locale,
}: PropsWithChildren<WidgetProps>) {
  const provider = useActiveProvider();
  const { i18n } = useTranslation();

  const changeLanguage = (lng: SupportedLocale) => {
    i18n.changeLanguage(lng);
  };

  const widgetWidth = useMemo(() => {
    if (width && width < 400) {
      console.warn(`Widget width must be at least 300px (you set it to ${width}). Falling back to 400px.`);
      return 400;
    }
    return width ?? 400;
  }, [width]);

  useEffect(() => {
    if (locale && ![...SUPPORTED_LOCALES].includes(locale)) {
      console.warn(`Unsupported locale: ${locale}. Falling back to ${DEFAULT_LOCALE}.`);
      changeLanguage(DEFAULT_LOCALE);
    }
    changeLanguage(locale ?? DEFAULT_LOCALE);
  }, [locale]);

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
    <React.StrictMode>
      <ThemeProvider theme={theme || defaultTheme}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <ActiveWeb3Provider
              provider={provider}
              jsonRpcEndpoint={jsonRpcEndpoint || process.env.REACT_APP_JSON_RPC_ENDPOINT}>
              <SwapWidget width={widgetWidth} />
            </ActiveWeb3Provider>
          </Provider>
        </I18nextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
