import { parseUnits } from '@ethersproject/units';

import { getUniswapV3Route } from '../alphaRouter';
import { UpdateUniswapParams } from '../types';
import { QuoteInfo } from './oneInch';

export const getUniswapQuote = async (params: UpdateUniswapParams): Promise<QuoteInfo> => {
  const route = await getUniswapV3Route(params);

  return {
    toTokenAmount: parseUnits(route.quote.toExact(), params.toTokenDecimals).toString(),
    estimatedGas: route.estimatedGasUsed.toString(),
    route: undefined,
    // TODO add route
  };
};
