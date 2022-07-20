import { SupportedChainId } from './chains';

export const EXPLORER_LINKS = {
  [SupportedChainId.LOCALHOST]: { name: 'EtherScan', link: 'https://etherscan.io' },
  [SupportedChainId.MAINNET]: { name: 'EtherScan', link: 'https://etherscan.io' },
  [SupportedChainId.ARBITRUM_ONE]: { name: 'ArbiScan', link: 'https://arbiscan.io' },
  [SupportedChainId.OPTIMISM]: { name: 'Optimism', link: 'https://optimistic.etherscan.io' },
  [SupportedChainId.POLYGON]: { name: 'PolygonScan', link: 'https://polygonscan.com' },
  [SupportedChainId.BINANCE]: { name: 'BscScan', link: 'https://bscscan.com' },
  [SupportedChainId.AVALANCHE]: { name: 'Snowtrace', link: 'https://snowtrace.io' },
  [SupportedChainId.FANTOM]: { name: 'FTMScan', link: 'https://ftmscan.com' },
  [SupportedChainId.GNOSIS]: { name: 'BlockScout', link: 'https://blockscout.com/xdai/mainnet' },
};
