import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, SwapRoute } from '@uniswap/smart-order-router';
import JSBI from 'jsbi';

import { createCurrency } from '../utils/createCurrency';
import { UpdateUniswapParams } from './types';

export const getUniswapV3Route = async (params: UpdateUniswapParams): Promise<SwapRoute> => {
  const [inputCurrency, outputCurrency] = await Promise.all([
    createCurrency(params.fromTokenAddress, params.fromTokenDecimals, params.chainId),
    createCurrency(params.toTokenAddress, params.toTokenDecimals, params.chainId),
  ]);

  const currencyAmount = CurrencyAmount.fromRawAmount(inputCurrency, JSBI.BigInt(params.amount));

  const router: AlphaRouter = new AlphaRouter({ chainId: params.chainId, provider: params.provider });

  const swapConfig = params.fromAddress
    ? {
        recipient: String(params.fromAddress),
        slippageTolerance: new Percent(params.slippage, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      }
    : undefined;

  const route = await router.route(currencyAmount, outputCurrency, TradeType.EXACT_INPUT, swapConfig);

  if (!route) {
    throw new Error('Failed to get uniswap route.');
  }

  return route;
};
