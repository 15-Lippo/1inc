import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { CssBaseline, Theme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider as Eip1193Provider } from '@web3-react/types';
import React, { useEffect } from 'react';
import { PropsWithChildren } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from '../constants';
import { RPC_URLS } from '../constants/networks';
import { defaultTheme } from '../mui/theme';
import { ActiveWeb3Provider, useActiveProvider } from '../packages/web3-provider';
import store from '../store';
import { setDefaultSettings } from '../store/state/swap/swapSlice';
import { DefaultRpcJsonEndpoint, DefaultTokenOptions, defaultTypedValueOptions, ReferrerOptions } from '../types';
import { validateReferrerOptions } from '../utils';
import { validateDefaultTokensOptions, validateDefaultValue } from '../utils/validateDefaults';

export interface Defaults {
  defaultInputTokenAddress?: DefaultTokenOptions;
  defaultOutputTokenAddress?: DefaultTokenOptions;
  defaultTypedValue?: defaultTypedValueOptions;
  referrerOptions?: ReferrerOptions;
}

export interface WidgetProps extends Defaults {
  theme?: Theme;
  locale?: SupportedLocale;
  provider?: Eip1193Provider | JsonRpcProvider | Web3Provider;
  jsonRpcEndpoint?: DefaultRpcJsonEndpoint;
}

export default function Widget({
  theme,
  provider,
  jsonRpcEndpoint,
  referrerOptions,
  defaultTypedValue,
  defaultInputTokenAddress,
  defaultOutputTokenAddress,
  locale,
  children,
}: PropsWithChildren<WidgetProps>) {
  const web3Provider = useActiveProvider();
  const { i18n } = useTranslation();

  const changeLanguage = (lng: SupportedLocale) => {
    i18n.changeLanguage(lng);
  };

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
      defaults.defaultTypedValue = defaultTypedValue;
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
        <CssBaseline />
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <ActiveWeb3Provider provider={provider || web3Provider} jsonRpcEndpoint={jsonRpcEndpoint || RPC_URLS}>
              {children}
            </ActiveWeb3Provider>
          </Provider>
        </I18nextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
