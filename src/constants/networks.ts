import {
  arbitrumApi,
  avalancheApi,
  binanceApi,
  ethereumApi,
  fantomApi,
  gnosisApi,
  optimismApi,
  polygonApi,
} from '@yozh-io/1inch-widget-api-client';

import { NetworkConfig, SupportedChainId } from '../types';
import { toHex } from '../utils';

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS = new Set(Object.values(SupportedChainId).filter((id) => typeof id === 'number'));

export const networkConfigs: Record<string, NetworkConfig> = {
  [SupportedChainId.LOCALHOST]: {
    chainName: 'Localhost 8545',
    chainIdHex: toHex(SupportedChainId.LOCALHOST),
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    explorerName: 'Localhost',
    blockExplorerUrls: ['https://etherscan.io'],
    helperContract: process.env.REACT_APP_HELPER_CONTRACT || '0x31A40a1a176f66fd63ca8075eAE682D2Dc438B2B',
    api: ethereumApi,
    minGasLimit: '150000',
  },
  [SupportedChainId.MAINNET]: {
    chainName: 'Ethereum Mainnet',
    chainIdHex: toHex(SupportedChainId.MAINNET),
    rpcUrls: ['https://cloudflare-eth.com'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    explorerName: 'EtherScan',
    blockExplorerUrls: ['https://etherscan.io'],
    helperContract: '0x31A40a1a176f66fd63ca8075eAE682D2Dc438B2B',
    api: ethereumApi,
    minGasLimit: '150000',
  },
  [SupportedChainId.BINANCE]: {
    chainName: 'Binance Smart Chain Mainnet',
    chainIdHex: toHex(SupportedChainId.BINANCE),
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    explorerName: 'BscScan',
    blockExplorerUrls: ['https://bscscan.com'],
    helperContract: '',
    api: binanceApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.POLYGON]: {
    chainName: 'Polygon Mainnet',
    chainIdHex: toHex(SupportedChainId.POLYGON),
    rpcUrls: ['https://polygon-rpc.com/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    explorerName: 'PolygonScan',
    blockExplorerUrls: ['https://polygonscan.com'],
    helperContract: '',
    api: polygonApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.OPTIMISM]: {
    chainName: 'Optimism',
    chainIdHex: toHex(SupportedChainId.OPTIMISM),
    rpcUrls: ['https://mainnet.optimism.io/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    explorerName: 'Optimism',
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    helperContract: '',
    api: optimismApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.ARBITRUM_ONE]: {
    chainName: 'Arbitrum One',
    chainIdHex: toHex(SupportedChainId.ARBITRUM_ONE),
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    explorerName: 'ArbiScan',
    blockExplorerUrls: ['https://arbiscan.io'],
    helperContract: '',
    api: arbitrumApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.GNOSIS]: {
    chainName: 'Gnosis Chain',
    chainIdHex: toHex(SupportedChainId.GNOSIS),
    rpcUrls: ['https://rpc.gnosischain.com'],
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    explorerName: 'BlockScout',
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
    helperContract: '',
    api: gnosisApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.AVALANCHE]: {
    chainName: 'Avalanche C-Chain',
    chainIdHex: toHex(SupportedChainId.AVALANCHE),
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    explorerName: 'Snowtrace',
    blockExplorerUrls: ['https://snowtrace.io'],
    helperContract: '',
    api: avalancheApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.FANTOM]: {
    chainName: 'Fantom Opera',
    chainIdHex: toHex(SupportedChainId.FANTOM),
    rpcUrls: ['https://rpc.ftm.tools'],
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    explorerName: 'FTMScan',
    blockExplorerUrls: ['https://ftmscan.com'],
    helperContract: '',
    api: fantomApi,
    minGasLimit: '200000',
  },
};

/**
 * Returns networkConfigs depends on chainId
 * number | undefined -> returns networkConfigs | undefined
 */
export function getNetworkConfig(chainId: number | undefined): NetworkConfig | undefined {
  if (chainId) {
    return networkConfigs[chainId] ?? undefined;
  }
  return undefined;
}
