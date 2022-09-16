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

import { DefaultRpcJsonEndpoint, NetworkConfig, SupportedChainId } from '../types';
import { toHex } from '../utils';

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS = new Set(Object.values(SupportedChainId).filter((id) => typeof id === 'number'));

export const networkConfigs: Record<string, NetworkConfig> = {
  [SupportedChainId.LOCALHOST]: {
    chainName: 'Localhost 8545',
    chainIdHex: toHex(SupportedChainId.LOCALHOST),
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    explorerName: 'Localhost',
    blockExplorerUrls: ['https://etherscan.io'],
    helperContract: process.env.REACT_APP_HELPER_CONTRACT || '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: ethereumApi,
    minGasLimit: '150000',
  },
  [SupportedChainId.MAINNET]: {
    chainName: 'Ethereum Mainnet',
    chainIdHex: toHex(SupportedChainId.MAINNET),
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    explorerName: 'EtherScan',
    blockExplorerUrls: ['https://etherscan.io'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: ethereumApi,
    minGasLimit: '150000',
  },
  [SupportedChainId.BINANCE]: {
    chainName: 'Binance Smart Chain Mainnet',
    chainIdHex: toHex(SupportedChainId.BINANCE),
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    explorerName: 'BscScan',
    blockExplorerUrls: ['https://bscscan.com'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: binanceApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.POLYGON]: {
    chainName: 'Polygon Mainnet',
    chainIdHex: toHex(SupportedChainId.POLYGON),
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    explorerName: 'PolygonScan',
    blockExplorerUrls: ['https://polygonscan.com'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: polygonApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.OPTIMISM]: {
    chainName: 'Optimism',
    chainIdHex: toHex(SupportedChainId.OPTIMISM),
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
    explorerName: 'ArbiScan',
    blockExplorerUrls: ['https://arbiscan.io'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: arbitrumApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.GNOSIS]: {
    chainName: 'Gnosis Chain',
    chainIdHex: toHex(SupportedChainId.GNOSIS),
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
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    explorerName: 'Snowtrace',
    blockExplorerUrls: ['https://snowtrace.io'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: avalancheApi,
    minGasLimit: '200000',
  },
  [SupportedChainId.FANTOM]: {
    chainName: 'Fantom Opera',
    chainIdHex: toHex(SupportedChainId.FANTOM),
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    explorerName: 'FTMScan',
    blockExplorerUrls: ['https://ftmscan.com'],
    helperContract: '0x9E7a4300FBC63c59eC556E5F9962a125D369e42C',
    api: fantomApi,
    minGasLimit: '200000',
  },
};

export const RPC_URLS: DefaultRpcJsonEndpoint = {
  [SupportedChainId.LOCALHOST]: 'http://127.0.0.1:8545',
  [SupportedChainId.MAINNET]: 'https://cloudflare-eth.com',
  [SupportedChainId.OPTIMISM]: 'https://mainnet.optimism.io/',
  [SupportedChainId.BINANCE]: 'https://bsc-dataseed1.ninicoin.io',
  [SupportedChainId.GNOSIS]: 'https://rpc.gnosischain.com',
  [SupportedChainId.POLYGON]: 'https://polygon-rpc.com/',
  [SupportedChainId.FANTOM]: 'https://rpc.ftm.tools',
  [SupportedChainId.ARBITRUM_ONE]: 'https://arb1.arbitrum.io/rpc',
  [SupportedChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
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
