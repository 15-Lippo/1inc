import { useCallback } from 'react';

import { buildUniswapTx } from '../../services/swap/buildUniswapTx';
import { UpdateQuoteParams } from '../../services/types';
import { TxBuilder } from '../update/types';

export const useBuildUniswapTx = (): TxBuilder => {
  return useCallback(async (params: UpdateQuoteParams) => {
    try {
      return await buildUniswapTx(params);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);
};
