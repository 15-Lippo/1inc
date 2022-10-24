export const REFRESH_QUOTE_DELAY = 15;
export const REFRESH_QUOTE_DELAY_MS = REFRESH_QUOTE_DELAY * 1000;
// export const CSS_PREFIX = 'swap-widget-';

export { connectionMethods } from './connection';
export * as Constants from './constants';
export { CustomGasPriceFieldId, GasPriceErrorTypes } from './gasSettings';
export type { SupportedLocale } from './locales';
export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';
export { LocalStorageKeys } from './localStorageKeys';
export { ALL_SUPPORTED_CHAIN_IDS, getNetworkConfig, networkConfigs, RPC_URLS } from './networks';
export * as Tokens from './tokens';
export const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
