import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { TxInfo } from '../../store/state/swap/swapSlice';
import { estimateGas, fetchOneInchQuote, fetchOneInchSwap, getDefaultGasLimit } from '../';
import { UpdateOneInchParams } from '../types';

export const getOneInchTx = async (params: UpdateOneInchParams, provider: any): Promise<TxInfo> => {
  const quote: ethereumApi.QuoteResponseDto = await fetchOneInchQuote({
    chainId: params.chainId,
    quoteInfo: { ...params },
  });

  if (!params.fromAddress) {
    return {
      toTokenAmount: quote.toTokenAmount,
      route: quote.protocols,
      gasLimit: getDefaultGasLimit(params.chainId),
    };
  }

  const swap: ethereumApi.SwapResponseDto = await fetchOneInchSwap({
    chainId: params.chainId,
    swapInfo: { ...params, fromAddress: String(params.fromAddress), disableEstimate: true },
  });

  if (!swap.tx) {
    throw new Error('Something went wrong. Tx must not be null');
  }

  const estimatedGas: string = await estimateGas(
    {
      from: swap.tx.from,
      to: swap.tx.to,
      data: swap.tx.data,
      ...(!Number(swap.tx.value) ? {} : { value: swap.tx.value }),
    },
    provider,
    params.chainId
  );

  return {
    tx: swap.tx,
    toTokenAmount: swap.toTokenAmount,
    route: quote.protocols,
    gasLimit: estimatedGas,
  };
};

export interface QuoteInfo {
  toTokenAmount: string;
  estimatedGas: string;
  route: any;
}

export const getOneInchQuote = async (params: UpdateOneInchParams): Promise<QuoteInfo> => {
  const quote: ethereumApi.QuoteResponseDto = await fetchOneInchQuote({
    chainId: params.chainId,
    quoteInfo: { ...params },
  });

  return {
    toTokenAmount: quote.toTokenAmount,
    estimatedGas: String(quote.estimatedGas),
    route: quote.protocols,
  };
};
