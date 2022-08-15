export type ReferrerOptions = {
  [chainId in SupportedChainId]?: {
    referrerAddress: string;
    fee: string;
  };
};

export type DefaultTokenOptions = {
  [chainId in SupportedChainId]?: string | 'NATIVE';
};

export type NetworkConfig = {
  chainName: string;
  chainIdHex: string;
  rpcUrls: string[];
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

export enum SupportedChainId {
  MAINNET = 1,
  ARBITRUM_ONE = 42161,
  OPTIMISM = 10,
  POLYGON = 137,
  BINANCE = 56,
  AVALANCHE = 43114,
  FANTOM = 250,
  GNOSIS = 100,
  LOCALHOST = 1337,
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
