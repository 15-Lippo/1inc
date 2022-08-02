import { SupportedChainId } from './constants';

export type ReferrerOptions = {
  [chainId in SupportedChainId]?: {
    referrerAddress: string;
    fee: string;
  };
};

export type DefaultTokenOptions = {
  [chainId in SupportedChainId]?: string | 'NATIVE';
};

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
