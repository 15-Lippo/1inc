import { useCallback } from 'react';

import { UpdateQuoteParams } from '../../services/types';
import { getUniswapQuote, QuoteInfo } from '../../services/update';

export const useUpdateUniswapQuote = (): ((params: UpdateQuoteParams) => Promise<QuoteInfo>) => {
  // is defined as hook to allow for protocol-dependent settings

  return useCallback(async (params: UpdateQuoteParams) => {
    try {
      return await getUniswapQuote(params);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }, []);
};
