import { parseUnits } from '@ethersproject/units';

import { V3_SWAP_ROUTER_ADDRESS } from '../../constants';
import { SwapInfo } from '../../hooks/update/types';
import { getUniswapV3Route } from '../alphaRouter';
import { UpdateUniswapParams } from '../types';

export const buildUniswapTx = async (params: UpdateUniswapParams): Promise<SwapInfo> => {
  const route = await getUniswapV3Route(params);

  if (!route.methodParameters) {
    throw new Error('MethodParameters must not be null');
  }

  return {
    tx: {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: route.methodParameters.value,
      from: String(params.fromAddress),
      gasPrice: route.gasPriceWei.toString(),
    },
    toTokenAmount: parseUnits(route.quote.toExact(), params.toTokenDecimals).toString(),
  };
};
