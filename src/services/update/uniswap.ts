import { parseUnits } from '@ethersproject/units';

import { getUniswapV3Route } from '../alphaRouter';
import { UpdateUniswapParams } from '../types';
import { QuoteInfo } from './oneInch';

export const getUniswapQuote = async (params: UpdateUniswapParams): Promise<QuoteInfo> => {
  const route = await getUniswapV3Route(params);

  return {
    toTokenAmount: parseUnits(route.quote.toExact(), params.toTokenDecimals).toString(),
    route: JSON.stringify(route.route),
    estimatedGas: route.estimatedGasUsed.toString(),
  };
};
