import { ethereumApi } from '@yozh-io/1inch-widget-api-client';

import { SwapInfo } from '../../hooks/update/types';
import { fetchOneInchSwap } from '../oneInchApi';
import { UpdateOneInchParams } from '../types';

export const buildOneInchTx = async (params: UpdateOneInchParams): Promise<SwapInfo> => {
  const swap: ethereumApi.SwapResponseDto = await fetchOneInchSwap({
    //TODO get api from networkConfigs
    chainId: params.chainId,
    swapInfo: { ...params, fromAddress: String(params.fromAddress), disableEstimate: true },
  });

  if (!swap.tx) {
    throw new Error('Something went wrong. Tx must be present');
  }

  return {
    tx: {
      from: swap.tx.from,
      to: swap.tx.to,
      data: swap.tx.data,
      gasPrice: swap.tx.gasPrice,
      value: swap.tx.value,
    },
    toTokenAmount: swap.toTokenAmount,
  };
};
