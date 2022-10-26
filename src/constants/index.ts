export const REFRESH_QUOTE_DELAY = 15;
export const REFRESH_QUOTE_DELAY_MS = REFRESH_QUOTE_DELAY * 1000;
// export const CSS_PREFIX = 'swap-widget-';

export * as Constants from './constants';
export { ErrorCode } from './eip1193';
export { CustomGasPriceFieldId, GasPriceErrorTypes } from './gasSettings';
export { JSON_RPC_ENDPOINTS } from './jsonRpcEndpoints';
export type { SupportedLocale } from './locales';
export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';
export { LocalStorageKeys } from './localStorageKeys';
export { ALL_SUPPORTED_CHAIN_IDS, getNetworkConfig, networkConfigs } from './networks';
export * as Tokens from './tokens';
