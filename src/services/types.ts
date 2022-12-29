import { JsonRpcProvider } from '@ethersproject/providers';

export interface UpdateQuoteParams {
  chainId: number;
  amount: string;
  fromAddress?: string;
  slippage: number;
  gasPrice?: any;
  referrerAddress?: string;
  fee?: string;
  provider: JsonRpcProvider;
  fromTokenAddress: string;
  fromTokenDecimals: number;
  toTokenAddress: string;
  toTokenDecimals: number;
}

// eslint-disable-next-line
export interface UpdateOneInchParams extends UpdateQuoteParams {}

// eslint-disable-next-line
export interface UpdateUniswapParams extends UpdateQuoteParams {}

// eslint-disable-next-line
export interface UpdateJoeRouterParams extends UpdateQuoteParams {}

export interface OneInchApproveTxParams {
  tokenAddress: string;
  amount?: string;
  chainId: number;
}

export interface AllowanceParams {
  tokenAddress: string;
  provider: JsonRpcProvider;
  account: string;
  chainId: number;
}

export type AllowanceParamsWithSpender = AllowanceParams & { spender: string };
