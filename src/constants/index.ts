import { SupportedChainId } from './chains';

export const TOKEN_HELPER_ADDRESS = {
  [SupportedChainId.LOCALHOST]: '0x31A40a1a176f66fd63ca8075eAE682D2Dc438B2B',
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.ARBITRUM_ONE]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.BINANCE]: '',
  [SupportedChainId.AVALANCHE]: '',
  [SupportedChainId.FANTOM]: '',
};

export const REFRESH_QUOTE_DELAY = 15;

export const MAIN_TOKENS = [
  'ETHEREUM',
  'USD COIN',
  'DAI STABLECOIN',
  'TETHER USD',
  'WRAPPED BTC',
  'AAVE TOKEN',
  'WRAPPED ETHER',
  'BINANCE USD',
  'CHAIN LINK',
  '1INCH TOKEN',
  'UNISWAP',
  'GRAPH TOKEN',
  'SUSHI TOKEN',
];
