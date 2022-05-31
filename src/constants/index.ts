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

export const EXPLORER_LINKS = {
  [SupportedChainId.LOCALHOST]: { name: 'EtherScan', link: 'https://etherscan.io/' },
  [SupportedChainId.MAINNET]: { name: 'EtherScan', link: 'https://etherscan.io/' },
  [SupportedChainId.ARBITRUM_ONE]: { name: 'ArbiScan', link: 'https://arbiscan.io/' },
  [SupportedChainId.OPTIMISM]: { name: 'Optimism', link: 'https://optimistic.etherscan.io/' },
  [SupportedChainId.POLYGON]: { name: 'PolygonScan', link: 'https://polygonscan.com/' },
  [SupportedChainId.BINANCE]: { name: 'BscScan', link: 'https://bscscan.com/' },
  [SupportedChainId.AVALANCHE]: { name: 'Snowtrace', link: 'https://snowtrace.io/' },
  [SupportedChainId.FANTOM]: { name: 'FTMScan', link: 'https://ftmscan.com/' },
};
