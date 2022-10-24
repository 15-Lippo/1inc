import { BigNumberish } from '@ethersproject/bignumber';

import { Web3ConnectorType } from './packages';

export type ReferrerOptions = {
  [chainId in SupportedChainId]?: {
    referrerAddress: string;
    fee: string;
  };
};

export type DefaultTokenOptions = {
  [chainId in SupportedChainId]?: string | 'NATIVE';
};

export type defaultTypedValueOptions = {
  [chainId in SupportedChainId]?: BigNumberish;
};

export type DefaultRpcJsonEndpoint = {
  [chainId in SupportedChainId]: string;
};

export type NetworkConfig = {
  chainName: string;
  chainIdHex: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
  explorerName: string;
  helperContract: string;
  api: any;
  minGasLimit: string;
};

export type NetworkListBtnType = {
  label: string | number;
  name: string;
  logo: () => void;
};

export type ConnectionMethod = {
  name: string;
  connector: Web3ConnectorType;
  logo: () => void;
};

export enum SupportedChainId {
  MAINNET = 1,
  ARBITRUM_ONE = 42161,
  OPTIMISM = 10,
  POLYGON = 137,
  BINANCE = 56,
  AVALANCHE = 43114,
  FANTOM = 250,
  GNOSIS = 100,
  // LOCALHOST = 1337,
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export enum SupportedGasOptions {
  Instant,
  High,
  Medium,
  Low,
}

export enum SupportedWallets {
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
}
