import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { ApproveApi, SwapApi } from '../api';
import { OneInchApproveTxParams } from './types';

interface FetchQuoteParams {
  quoteInfo: ethereumApi.ExchangeControllerGetQuoteRequest;
  chainId: number | undefined;
}

interface FetchSwapParams {
  swapInfo: ethereumApi.ExchangeControllerGetSwapRequest;
  chainId: number | undefined;
}

export const fetchOneInchQuote = async (params: FetchQuoteParams) => {
  try {
    return (await SwapApi(params.chainId).exchangeControllerGetQuoteRaw(params.quoteInfo)).raw.json();
  } catch (error) {
    const e = await error.json();
    if (e.description) {
      const { description } = e;
      throw new Error(description.replace(/^./, description[0].toUpperCase()));
    }
    throw error.message;
  }
};

export const fetchOneInchSwap = async (params: FetchSwapParams) => {
  try {
    return (await SwapApi(params.chainId).exchangeControllerGetSwapRaw(params.swapInfo)).raw.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchOneInchSpender = async (chainId: number): Promise<string> => {
  return (await (await ApproveApi(chainId).chainApproveControllerGetSpenderRaw()).raw.json()).address;
};

export const fetchOneInchApproveTx = async (params: OneInchApproveTxParams) => {
  return (await ApproveApi(params.chainId).chainApproveControllerGetCallDataRaw(params)).raw.json();
};
